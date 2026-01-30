'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Bell, Mail, Settings, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/SearchBar';
import { UserMenu } from '@/components/layout/UserMenu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnreadCounts } from '@/hooks/useUnreadCounts';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const { translation } = useLanguage();
  const { counts } = useUnreadCounts();

  return (
    <header className="sticky top-0 z-[10000] bg-white border-b border-gray-200 shadow-sm overflow-visible">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 overflow-visible">
          {/* Menu Button - Mobile Only */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 sm:space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center flex-shrink-0"
            >
              <img src="/logo.svg" alt="Unify" className="w-full h-full" />
            </motion.div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-dark hidden sm:block">
              Unify
            </span>
          </Link>

          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:block">
            <SearchBar />
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <Link href="/messages">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                  <Badge count={counts.messages} />
                </motion.button>
              </Link>

              <Link href="/notifications">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                  <Badge count={counts.notifications} />
                </motion.button>
              </Link>

              <Link href="/settings">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                </motion.button>
              </Link>
            </nav>

            {/* User Menu */}
            <div className="relative">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}