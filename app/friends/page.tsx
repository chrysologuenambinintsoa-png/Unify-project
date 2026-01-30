'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, UserX, Search, RefreshCw, Check, X } from 'lucide-react';
import { useFriendBadges, useFriendRequests, useFriendSuggestions, useFriendsList } from '@/hooks/useFriendBadges';
import { FriendEventBadges } from '@/components/FriendBadge';

interface Person {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
}

export default function FriendsPage() {
  const { translation } = useLanguage();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'suggestions'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Utiliser les nouveaux hooks
  const badgesData = useFriendBadges({ refetchInterval: 30000 });
  const friendsData = useFriendsList({ refetchInterval: 60000 });
  const requestsData = useFriendRequests({ refetchInterval: 30000 });
  const suggestionsData = useFriendSuggestions({ refetchInterval: 60000 });

  // Handlers pour les actions
  const handleAcceptRequest = async (friendshipId: string, userId: string) => {
    try {
      setActionLoading(friendshipId);
      setActionError(null);

      const response = await fetch('/api/friends', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendshipId,
          status: 'accepted',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'acceptation de la demande');
      }

      // Rafraîchir les données
      await badgesData.refetch();
      await requestsData.refetch();
      await friendsData.refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      setActionLoading(friendshipId);
      setActionError(null);

      const response = await fetch('/api/friends', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friendshipId,
          status: 'declined',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du refus de la demande');
      }

      // Rafraîchir les données
      await badgesData.refetch();
      await requestsData.refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddFriend = async (userId: string) => {
    try {
      setActionLoading(userId);
      setActionError(null);

      const response = await fetch('/api/friends/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout d\'ami');
      }

      // Rafraîchir les données
      await badgesData.refetch();
      await suggestionsData.refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      setActionLoading(friendshipId);
      setActionError(null);

      const response = await fetch(`/api/friends?friendshipId=${friendshipId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'ami');
      }

      // Rafraîchir les données
      await badgesData.refetch();
      await friendsData.refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setActionLoading(null);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'friends':
        return friendsData.friends;
      case 'requests':
        return requestsData.requests.map((r: any) => r.fromUser);
      case 'suggestions':
        return suggestionsData.suggestions;
      default:
        return friendsData.friends;
    }
  };

  const getLoading = () => {
    switch (activeTab) {
      case 'friends':
        return friendsData.loading;
      case 'requests':
        return requestsData.loading;
      case 'suggestions':
        return suggestionsData.loading;
      default:
        return false;
    }
  };

  const getError = () => {
    switch (activeTab) {
      case 'friends':
        return friendsData.error;
      case 'requests':
        return requestsData.error;
      case 'suggestions':
        return suggestionsData.error;
      default:
        return null;
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'friends':
        return <Users className="w-4 h-4" />;
      case 'requests':
        return <UserPlus className="w-4 h-4" />;
      case 'suggestions':
        return <UserCheck className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const filteredData = getCurrentData().filter(person =>
    person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {translation.friends.friends}
          </h1>

          {/* Error Message */}
          {actionError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{actionError}</p>
            </div>
          )}

          {/* Badges - Event Counters */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Vue d'ensemble</h2>
                <FriendEventBadges
                  pendingRequests={badgesData.badges.pendingRequests}
                  suggestions={badgesData.badges.suggestions}
                  friends={badgesData.badges.friends}
                  loading={badgesData.loading}
                  showPulse={true}
                  layout="horizontal"
                />
              </div>
              <button
                onClick={() => badgesData.refetch()}
                disabled={badgesData.loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                title="Rafraîchir les compteurs"
              >
                <RefreshCw className={`w-5 h-5 ${badgesData.loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher des amis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'friends', label: 'Amis', count: badgesData.badges.friends },
              { key: 'requests', label: 'Demandes', count: badgesData.badges.pendingRequests },
              { key: 'suggestions', label: 'Suggestions', count: badgesData.badges.suggestions },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setOffset(0);
                }}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all relative ${
                  activeTab === tab.key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {getTabIcon(tab.key)}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {getLoading() ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : getError() ? (
            <div className="text-center py-12">
              <p className="text-red-500">{getError()}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <a href={`/users/${person.id}`} className="flex items-center space-x-3 mb-3 hover:opacity-80 transition-opacity">
                    <div className="relative">
                      <img
                        src={person.avatar}
                        alt={person.fullName}
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{person.fullName}</h3>
                      <p className="text-sm text-gray-500 truncate">@{person.username}</p>
                    </div>
                  </a>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{person.bio}</p>

                  {activeTab === 'friends' && (
                    <button 
                      onClick={() => {
                        const friendship = requestsData.requests.find((r: any) => r.fromUser.id === person.id);
                        if (friendship) {
                          handleRemoveFriend(friendship.id);
                        }
                      }}
                      disabled={actionLoading !== null}
                      className="w-full px-3 py-1 text-sm text-white bg-primary-dark hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading === person.id ? 'Suppression...' : 'Retirer'}
                    </button>
                  )}

                  {activeTab === 'requests' && (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          const friendship = requestsData.requests.find((r: any) => r.fromUser.id === person.id);
                          if (friendship) {
                            handleAcceptRequest(friendship.id, person.id);
                          }
                        }}
                        disabled={actionLoading !== null}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-1 text-sm text-white bg-primary-dark hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{actionLoading === person.id ? 'Acceptation...' : 'Accepter'}</span>
                      </button>
                      <button 
                        onClick={() => {
                          const friendship = requestsData.requests.find((r: any) => r.fromUser.id === person.id);
                          if (friendship) {
                            handleDeclineRequest(friendship.id);
                          }
                        }}
                        disabled={actionLoading !== null}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-1 text-sm text-primary-dark border-2 border-primary-dark rounded-lg hover:bg-primary-dark hover:text-white transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        <span>{actionLoading === person.id ? 'Refus...' : 'Refuser'}</span>
                      </button>
                    </div>
                  )}

                  {activeTab === 'suggestions' && (
                    <button 
                      onClick={() => handleAddFriend(person.id)}
                      disabled={actionLoading !== null}
                      className="w-full px-3 py-1 text-sm bg-primary-dark text-white hover:bg-primary-light rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading === person.id ? 'Ajout en cours...' : 'Ajouter'}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {filteredData.length === 0 && !getLoading() && !getError() && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'friends' && 'Aucun ami trouvé'}
                {activeTab === 'requests' && 'Aucune demande d\'ami'}
                {activeTab === 'suggestions' && 'Aucune suggestion'}
              </h3>
              <p className="text-gray-500">
                {activeTab === 'friends' && 'Vous n\'avez pas encore d\'amis.'}
                {activeTab === 'requests' && 'Vous n\'avez pas de demandes d\'ami en attente.'}
                {activeTab === 'suggestions' && 'Aucune suggestion d\'ami pour le moment.'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}