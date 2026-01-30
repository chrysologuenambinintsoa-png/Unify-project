'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBadges } from '@/hooks/useBadges';

/**
 * Composant pour afficher un aperçu des badges
 * Peut être utilisé dans la barre d'en-tête ou ailleurs
 */
export function BadgesOverview() {
  const { badges } = useBadges();
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const total = badges.messages + badges.notifications + badges.friends + badges.groups;
    setTotalCount(total);
  }, [badges]);

  return (
    <div className="flex items-center gap-2">
      {/* Messages Badge */}
      {badges.messages > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
          title={`${badges.messages} messages non lus`}
        >
          <div className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">
            💬 {badges.messages}
          </div>
        </motion.div>
      )}

      {/* Notifications Badge */}
      {badges.notifications > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
          title={`${badges.notifications} notifications non lues`}
        >
          <div className="text-xs font-bold text-white bg-orange-500 px-2 py-1 rounded-full">
            🔔 {badges.notifications}
          </div>
        </motion.div>
      )}

      {/* Friends Badge */}
      {badges.friends > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
          title={`${badges.friends} demandes d'amis`}
        >
          <div className="text-xs font-bold text-white bg-blue-500 px-2 py-1 rounded-full">
            👥 {badges.friends}
          </div>
        </motion.div>
      )}

      {/* Groups Badge */}
      {badges.groups > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="relative"
          title={`${badges.groups} invitations de groupe`}
        >
          <div className="text-xs font-bold text-white bg-purple-500 px-2 py-1 rounded-full">
            👫 {badges.groups}
          </div>
        </motion.div>
      )}

      {/* Total Badge */}
      {totalCount > 0 && (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="ml-2"
        >
          <div className="text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full shadow-lg">
            {totalCount} {totalCount === 1 ? 'alerte' : 'alertes'}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default BadgesOverview;
