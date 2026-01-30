'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/NotificationItem';
import { motion } from 'framer-motion';
import { Bell, Settings, CheckCheck } from 'lucide-react';

type FilterType = 'all' | 'mentions' | 'likes' | 'comments' | 'follows';

export default function NotificationsPage() {
  const { translation } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const filteredNotifications = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => {
        if (activeFilter === 'mentions') return n.type === 'mention';
        if (activeFilter === 'likes') return n.type === 'like';
        if (activeFilter === 'comments') return n.type === 'comment';
        if (activeFilter === 'follows') return n.type === 'follow';
        return true;
      });

  const handleMarkAllAsReadClick = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
    } finally {
      setIsMarkingAll(false);
    }
  };

  const getActionLink = (notification: any) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
        return `/posts/${notification.id}`;
      case 'follow':
      case 'mention':
        return `/users/${notification.user.id}`;
      default:
        return '/';
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {translation.nav.notifications}
              </h1>
              {unreadCount > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-600 mt-1"
                >
                  {unreadCount} {unreadCount === 1 ? 'notification non lue' : 'notifications non lues'}
                </motion.p>
              )}
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {[
              { key: 'all' as FilterType, label: 'Tout' },
              { key: 'mentions' as FilterType, label: 'Mentions' },
              { key: 'likes' as FilterType, label: 'Likes' },
              { key: 'comments' as FilterType, label: 'Commentaires' },
              { key: 'follows' as FilterType, label: 'Abonnements' },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Mark all as read button */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end mb-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsReadClick}
                disabled={isMarkingAll}
                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCheck className="w-4 h-4" />
                {isMarkingAll ? 'Marquage...' : 'Tout marquer comme lu'}
              </motion.button>
            </motion.div>
          )}

          {/* Notifications List */}
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              </motion.div>
              <p className="mt-4 text-gray-500">Chargement...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-red-500">{error}</p>
            </motion.div>
          ) : filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <NotificationItem
                    id={notification.id}
                    type={notification.type}
                    user={notification.user}
                    content={notification.content}
                    time={notification.time}
                    read={notification.read}
                    onRead={markAsRead}
                    actionLink={getActionLink(notification)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-500">
                Vous n'avez pas de notifications pour le moment.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </MainLayout>
  );
}

