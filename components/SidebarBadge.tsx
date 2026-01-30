import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarBadgeProps {
  count: number;
  className?: string;
  variant?: 'default' | 'error' | 'warning' | 'success';
  size?: 'sm' | 'md';
  animate?: boolean;
}

export function SidebarBadge({
  count,
  className = '',
  variant = 'default',
  size = 'md',
  animate = true
}: SidebarBadgeProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm'
  };

  const variantClasses = {
    default: 'bg-blue-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-orange-500 text-white',
    success: 'bg-green-500 text-white'
  };

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        `absolute -top-2 -right-2 rounded-full flex items-center justify-center font-bold ${sizeClasses[size]} ${variantClasses[variant]} shadow-lg`,
        className
      )}
    >
      {animate && (
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-current opacity-50"
        />
      )}
      <span className="relative z-10">
        {count > 99 ? '99+' : count}
      </span>
    </motion.div>
  );
}

export default SidebarBadge;
