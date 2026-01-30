'use client';

import { useState, useRef, useEffect } from 'react';

interface ReactionPickerProps {
  onReact: (reaction: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

const reactions = [
  { emoji: '👍', label: 'Like', color: 'bg-blue-500' },
  { emoji: '❤️', label: 'Love', color: 'bg-red-500' },
  { emoji: '😂', label: 'Haha', color: 'bg-yellow-500' },
  { emoji: '😮', label: 'Wow', color: 'bg-orange-500' },
  { emoji: '😢', label: 'Sad', color: 'bg-blue-400' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-600' },
];

export default function ReactionPicker({ onReact, onClose, position }: ReactionPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className={`absolute bg-white rounded-full shadow-lg p-2 flex space-x-1 z-50 ${position ? '' : 'bottom-full left-0 mb-2'}`}
      style={position ? { left: position.x, top: position.y } : undefined}
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.label}
          onClick={() => {
            onReact(reaction.label);
            onClose();
          }}
          className="relative group"
        >
          <div className={`w-10 h-10 rounded-full ${reaction.color} flex items-center justify-center text-2xl transform transition-all duration-200 hover:scale-125 hover:shadow-lg`}>
            {reaction.emoji}
          </div>
          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {reaction.label}
          </span>
        </button>
      ))}
    </div>
  );
}