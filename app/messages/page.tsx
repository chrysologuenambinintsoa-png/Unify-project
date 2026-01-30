'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { FriendsMessageList } from '@/components/FriendsMessageList';
import { motion } from 'framer-motion';
import { MessageCircle, MoreVertical, Send } from 'lucide-react';

interface Conversation {
  id: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  lastMessage: string;
  time: string;
  unread: number;
}

export default function MessagesPage() {
  const { translation } = useLanguage();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Array<any>>([]);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchConversation = async () => {
      try {
        const url = typeof window !== 'undefined' 
          ? `${window.location.origin}/api/messages?userId=${selectedConversation}`
          : `/api/messages?userId=${selectedConversation}`;
          
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!res.ok) throw new Error('Failed to load conversation');
        const data = await res.json();
        
        // data is an array of messages
        const mapped = data.map((m: any) => ({
          id: m.id,
          content: m.content,
          time: m.createdAt,
          isMine: m.sender?.id === selectedConversation ? false : true, // If sender is the other person, it's not mine
          sender: m.sender,
          receiver: m.receiver,
        }));
        setMessages(mapped);
        
        // Set selected user from the other person in conversation
        if (mapped.length > 0) {
          // The selectedUser should be the person we're talking to (not current user)
          const firstMsg = mapped[0];
          const otherUser = firstMsg.isMine ? firstMsg.receiver : firstMsg.sender;
          if (otherUser && otherUser.id === selectedConversation) {
            setSelectedUser(otherUser);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchConversation();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) {
      setSendError('Message and recipient required');
      return;
    }

    // Clear typing indicator before sending
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    setIsSending(true);
    setSendError(null);

    try {
      const url = typeof window !== 'undefined' 
        ? `${window.location.origin}/api/messages/send`
        : '/api/messages/send';
        
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: selectedConversation, content: newMessage }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to send message' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const sent = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: sent.id,
          content: sent.content,
          time: sent.createdAt,
          isMine: true,
          sender: sent.sender,
        },
      ]);
      setNewMessage('');
      setSendError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error sending message';
      console.error('Send message error:', err);
      setSendError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = async (text: string) => {
    setNewMessage(text);

    // Clear previous timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Send typing indicator
    if (text.trim() && selectedConversation) {
      try {
        const url = typeof window !== 'undefined'
          ? `${window.location.origin}/api/messages/typing`
          : '/api/messages/typing';
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationPartnerId: selectedConversation, isTyping: true }),
        }).catch(() => {});
      } catch (e) {
        console.error('Typing indicator error:', e);
      }

      // Clear typing after 3 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        fetch(typeof window !== 'undefined' ? `${window.location.origin}/api/messages/typing` : '/api/messages/typing', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationPartnerId: selectedConversation, isTyping: false }),
        }).catch(() => {});
      }, 3000);
    } else if (!text.trim() && selectedConversation) {
      // Clear typing immediately when input is empty
      try {
        const url = typeof window !== 'undefined'
          ? `${window.location.origin}/api/messages/typing`
          : '/api/messages/typing';
        await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationPartnerId: selectedConversation, isTyping: false }),
        }).catch(() => {});
      } catch (e) {
        console.error('Typing indicator error:', e);
      }
    }
  };

  // Poll for partner typing status
  useEffect(() => {
    if (!selectedConversation) return;

    const checkTyping = async () => {
      try {
        const url = typeof window !== 'undefined'
          ? `${window.location.origin}/api/messages/typing?partnerId=${selectedConversation}`
          : `/api/messages/typing?partnerId=${selectedConversation}`;
        const res = await fetch(url, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setIsPartnerTyping(data.isPartnerTyping ?? false);
        }
      } catch (e) {
        console.error('Error checking typing status:', e);
      }
    };

    const interval = setInterval(checkTyping, 500);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[calc(100vh-8rem)] flex bg-gray-50 overflow-hidden"
      >
        {/* Conversations List */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {translation.nav.messages}
              </h1>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <FriendsMessageList
              onSelectFriend={(friendId) => {
                setSelectedConversation(friendId);
              }}
              selectedFriendId={selectedConversation}
              maxHeight="h-full"
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-[9998]">
                <div className="flex items-center space-x-3">
                  <Link href={`/users/${selectedUser?.id}`} className="hover:opacity-75 transition-opacity flex-shrink-0">
                    {selectedUser?.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.fullName}
                        className="w-12 h-12 rounded-full object-cover cursor-pointer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold cursor-pointer">
                        {selectedUser?.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/users/${selectedUser?.id}`} className="block hover:opacity-75 transition-opacity">
                      <h2 className="font-600 text-gray-900 truncate text-lg">
                        {selectedUser?.fullName || 'Conversation'}
                      </h2>
                      <p className="text-sm text-gray-500">Actif maintenant</p>
                    </Link>
                  </div>
                  <div className="relative">
                    <button 
                      onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {showHeaderMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-30 border border-gray-200">
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm border-b border-gray-200 transition-colors">
                          Informations du contact
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm border-b border-gray-200 transition-colors">
                          Rechercher des messages
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm border-b border-gray-200 transition-colors">
                          Médias
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors">
                          Supprimer la conversation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <p>Aucun message. Commencez la conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isMine ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}
                      >
                        {/* Avatar */}
                        <Link href={`/users/${message.sender?.id}`} className="hover:opacity-75 transition-opacity flex-shrink-0 mb-1">
                          {message.sender?.avatar ? (
                            <img
                              src={message.sender.avatar}
                              alt={message.sender.fullName}
                              className="w-10 h-10 rounded-full object-cover cursor-pointer"
                              title={message.sender.fullName}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-bold cursor-pointer">
                              {message.sender?.fullName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </Link>

                        {/* Message Bubble */}
                        <div className={`max-w-sm ${message.isMine ? 'items-start' : 'items-end'} flex flex-col`}>
                          <p className={`text-xs font-semibold mb-1 ${message.isMine ? 'text-left text-primary' : 'text-right text-gray-600'}`}>
                            {message.isMine ? 'Vous' : message.sender?.fullName}
                          </p>
                          <div
                            className={`px-4 py-2 rounded-2xl font-normal leading-normal ${
                              message.isMine
                                ? 'bg-primary text-white rounded-bl-md'
                                : 'bg-gray-200 text-gray-900 rounded-br-md'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 opacity-70 ${
                              message.isMine ? 'text-primary-light' : 'text-gray-600'
                            }`}>
                              {new Date(message.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isPartnerTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end gap-3"
                      >
                        <Link href={`/users/${selectedUser?.id}`} className="hover:opacity-75 transition-opacity flex-shrink-0 mb-1">
                          {selectedUser?.avatar ? (
                            <img
                              src={selectedUser.avatar}
                              alt={selectedUser.fullName}
                              className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm text-gray-600 font-bold cursor-pointer">
                              {selectedUser?.fullName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </Link>
                        <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2">
                          <div className="flex space-x-1">
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="w-2 h-2 bg-gray-600 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-gray-600 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-gray-600 rounded-full"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                {sendError && (
                  <div className="mb-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                    ⚠️ {sendError}
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                    placeholder="Aa"
                    disabled={isSending}
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors disabled:bg-gray-100 text-gray-900 placeholder-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="flex-shrink-0 p-2.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 flex items-center justify-center"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-500 text-base">
                  Choisissez un ami pour commencer à discuter
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}
