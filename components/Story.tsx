'use client';

import { useState, useRef, useEffect } from 'react';

interface StoryProps {
  story: Story;
  isUserStory?: boolean;
  onViewStory?: (story: Story) => void;
  onCreateStory?: () => void;
}

interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  image?: string;
  imageUrl?: string;
  video?: string;
  videoUrl?: string;
  text?: string;
  timestamp: Date;
  viewed?: boolean;
}

export default function Story({ story, isUserStory = false, onViewStory, onCreateStory }: StoryProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleView = () => {
    if (isUserStory && onCreateStory) {
      onCreateStory();
    } else if (onViewStory) {
      onViewStory(story);
    }
  };

  return (
    <div
      className="flex-shrink-0 w-32 h-56 mx-2 cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
    >
      {/* Story Border Ring - Logo Colors (Primary/Accent) */}
      <div className={`absolute inset-0 rounded-xl p-0.5 ${story.viewed && !isUserStory ? 'bg-gray-300' : 'bg-gradient-to-tr from-accent via-primary to-accent-dark'}`}>
        <div className="relative w-full h-full bg-gray-200 rounded-xl overflow-hidden flex items-stretch">
          {story.image ? (
            <img src={(story as any).image || (story as any).imageUrl} alt={story.user.name} className={`w-full h-full object-cover ${isHovered ? 'scale-105' : 'scale-100'} transition-transform duration-300`} />
          ) : story.video ? (
            <video src={(story as any).video || (story as any).videoUrl} className={`w-full h-full object-cover ${isHovered ? 'scale-105' : 'scale-100'} transition-transform duration-300`} />
          ) : story.text ? (
            <div className="w-full h-full flex items-center justify-center p-3 text-center text-white">
              <div className="text-sm font-semibold">{story.text}</div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-accent via-primary to-accent-dark" />
          )}

          {isUserStory && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl mb-2 border-4 border-white">+</div>
              <span className="text-white text-sm font-semibold text-center px-2">Créer</span>
            </div>
          )}

          {!isUserStory && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          )}
        </div>
      </div>

      {/* User Avatar */}
      {!isUserStory && (
        <div className="absolute -top-1 -left-1 w-10 h-10 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm overflow-hidden">
          {story.user?.avatar ? (
            <img src={story.user.avatar} alt={story.user.name} className="w-full h-full object-cover" />
          ) : (
            (story.user?.name || 'U').charAt(0).toUpperCase()
          )}
        </div>
      )}

      {/* User Name */}
      {!isUserStory && (
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-xs font-semibold truncate">{story.user?.name}</p>
        </div>
      )}

      {/* Hover Effect */}
      {isHovered && !isUserStory && (
        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl transition-opacity duration-300" />
      )}
    </div>
  );
}