/**
 * Composant pour afficher un badge avec un compteur
 * Utilisé pour afficher les compteurs d'amis, demandes, suggestions
 */
'use client';

import React from 'react';

interface BadgeProps {
  count: number;
  icon?: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export function FriendBadge({
  count,
  icon,
  label,
  variant = 'primary',
  size = 'md',
  pulse = false,
}: BadgeProps) {
  const variants = {
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={`inline-flex items-center space-x-2 ${variants[variant]} rounded-full ${sizes[size]} ${pulse && count > 0 ? 'animate-pulse' : ''}`}>
      {icon && <span>{icon}</span>}
      {label && <span className="font-medium">{label}</span>}
      <span className="font-bold">{count}</span>
    </div>
  );
}

/**
 * Composant pour afficher les compteurs d'événements sous forme de badges
 */
interface FriendEventBadgesProps {
  pendingRequests: number;
  suggestions: number;
  friends: number;
  loading?: boolean;
  showPulse?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export function FriendEventBadges({
  pendingRequests,
  suggestions,
  friends,
  loading = false,
  showPulse = true,
  layout = 'horizontal',
}: FriendEventBadgesProps) {
  const containerClass =
    layout === 'horizontal' ? 'flex space-x-3' : 'flex flex-col space-y-2';

  if (loading) {
    return (
      <div className={containerClass}>
        <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {pendingRequests > 0 && (
        <FriendBadge
          count={pendingRequests}
          label="Demandes"
          variant="danger"
          size="sm"
          pulse={showPulse}
        />
      )}
      {suggestions > 0 && (
        <FriendBadge
          count={suggestions}
          label="Suggestions"
          variant="warning"
          size="sm"
          pulse={showPulse}
        />
      )}
      {friends > 0 && (
        <FriendBadge
          count={friends}
          label="Amis"
          variant="success"
          size="sm"
          pulse={false}
        />
      )}
      {pendingRequests === 0 && suggestions === 0 && friends === 0 && (
        <span className="text-gray-400 text-sm">Aucun événement</span>
      )}
    </div>
  );
}
