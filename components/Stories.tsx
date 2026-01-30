'use client';

import { useState } from 'react';
import Story from './Story';

interface StoriesProps {
  stories: Story[];
  currentUser?: User;
  onCreated?: () => void;
}

interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  image: string;
  timestamp: Date;
  viewed?: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

export default function Stories({ stories, currentUser, onCreated }: StoriesProps) {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createImage, setCreateImage] = useState('');
  const [createVideo, setCreateVideo] = useState('');
  const [createText, setCreateText] = useState('');
  const [creating, setCreating] = useState(false);
  const [createBackground, setCreateBackground] = useState<string>('gradient-1');
  const [previewType, setPreviewType] = useState<'image'|'video'|null>(null);

  const handleViewStory = (story: Story) => {
    setActiveStory(story);
  };

  const handleCloseStory = () => {
    setActiveStory(null);
  };

  const openCreate = () => setShowCreateModal(true);
  const closeCreate = () => setShowCreateModal(false);

  const handleCreate = async () => {
    if (!createImage && !createVideo && !createText) return;
    setCreating(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: createImage || undefined, videoUrl: createVideo || undefined, text: createText || undefined })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Failed to create story');
      }
      // optionally refresh the page or call parent callback
      closeCreate();
      if (typeof onCreated === 'function') {
        try { onCreated(); } catch {}
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Create story failed', err);
      alert((err as Error).message || 'Error creating story');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Stories Carousel */}
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Create Story Button */}
        {currentUser && (
          <Story
            story={{
              id: 'create',
              user: currentUser,
              image: currentUser.avatar || 'https://via.placeholder.com/300x500',
              timestamp: new Date(),
            }}
            isUserStory={true}
            onCreateStory={openCreate}
          />
        )}

        {/* User Stories */}
        {stories.map(story => (
          <Story
            key={story.id}
            story={story}
            onViewStory={handleViewStory}
          />
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
          onClick={handleCloseStory}
        >
          <div
            className="relative w-full max-w-md h-full md:h-[80vh] md:rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4">
              <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full transition-all duration-[5000ms] ease-linear" style={{ width: '0%' }} />
              </div>
            </div>

            {/* Story Header */}
            <div className="absolute top-4 left-4 right-4 z-10 flex items-center">
              <div className="w-10 h-10 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white font-bold overflow-hidden">
                {activeStory.user.avatar ? (
                  <img src={activeStory.user.avatar} alt={activeStory.user.name} className="w-full h-full object-cover" />
                ) : (
                  activeStory.user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="ml-3 text-white">
                <p className="font-semibold">{activeStory.user.name}</p>
                <p className="text-sm opacity-80">2h ago</p>
              </div>
              <button
                onClick={handleCloseStory}
                className="ml-auto text-white text-2xl font-bold hover:text-gray-200"
              >
                ×
              </button>
            </div>

            {/* Story Image */}
            <img
              src={activeStory.image}
              alt={activeStory.user.name}
              className="w-full h-full object-cover"
            />

            {/* Story Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
              <input
                type="text"
                placeholder="Send message..."
                className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none border-b border-white/30 pb-2"
              />
            </div>
          </div>
        </div>
      )}
      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Créer une Story</h3>
            <label className="block text-sm text-gray-700">Image / Video</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  if (f.type.startsWith('image/')) {
                    setCreateImage(result);
                    setCreateVideo('');
                    setPreviewType('image');
                  } else if (f.type.startsWith('video/')) {
                    setCreateVideo(result);
                    setCreateImage('');
                    setPreviewType('video');
                  }
                };
                reader.readAsDataURL(f);
              }}
              className="w-full mb-3"
            />

            <label className="block text-sm text-gray-700">Fond</label>
            <div className="flex space-x-2 mb-3">
              <button type="button" onClick={() => setCreateBackground('gradient-1')} className={`w-10 h-10 rounded ${createBackground==='gradient-1' ? 'ring-2 ring-offset-2 ring-primary' : ''}`} style={{background: 'linear-gradient(135deg,#E8B923, #0D2E5F)'}} />
              <button type="button" onClick={() => setCreateBackground('gradient-2')} className={`w-10 h-10 rounded ${createBackground==='gradient-2' ? 'ring-2 ring-offset-2 ring-primary' : ''}`} style={{background: 'linear-gradient(135deg,#ff7eb3,#65d6ff)'}} />
              <button type="button" onClick={() => setCreateBackground('gradient-3')} className={`w-10 h-10 rounded ${createBackground==='gradient-3' ? 'ring-2 ring-offset-2 ring-primary' : ''}`} style={{background: 'linear-gradient(135deg,#7b2ff7,#f107a3)'}} />
              <button type="button" onClick={() => setCreateBackground('solid-1')} className={`w-10 h-10 rounded ${createBackground==='solid-1' ? 'ring-2 ring-offset-2 ring-primary' : ''}`} style={{background: '#0D2E5F'}} />
            </div>

            <label className="block text-sm text-gray-700">Texte (optionnel)</label>
            <textarea value={createText} onChange={(e) => setCreateText(e.target.value)} className="w-full border border-border rounded px-3 py-2 mb-3" />

            { (createImage || createVideo || createText) && (
              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Aperçu</p>
                <div className="w-full h-64 rounded overflow-hidden relative" style={{background: createImage||createVideo ? undefined : (createBackground==='gradient-1' ? 'linear-gradient(135deg,#E8B923, #0D2E5F)' : createBackground==='gradient-2' ? 'linear-gradient(135deg,#ff7eb3,#65d6ff)' : createBackground==='gradient-3' ? 'linear-gradient(135deg,#7b2ff7,#f107a3)' : '#0D2E5F')}}>
                  { previewType === 'image' && createImage && (<img src={createImage} alt="preview" className="w-full h-full object-cover" />) }
                  { previewType === 'video' && createVideo && (<video src={createVideo} controls className="w-full h-full object-cover" />) }
                  { !previewType && createText && (
                    <div className="w-full h-full flex items-center justify-center px-4 text-white text-center">
                      <div className="text-2xl font-bold">{createText}</div>
                    </div>
                  ) }
                </div>
              </div>
            ) }
            <div className="flex justify-end space-x-2">
              <button onClick={closeCreate} className="px-4 py-2 rounded bg-gray-100">Annuler</button>
              <button onClick={handleCreate} disabled={creating} className="px-4 py-2 rounded bg-primary text-white">{creating ? 'Création...' : 'Publier'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}