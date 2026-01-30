'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  type: 'profile' | 'cover' | 'gallery';
  caption?: string;
  createdAt: string;
}

interface PhotoGalleryProps {
  userId: string;
  photos: Photo[];
  isOwnProfile: boolean;
  profilePhoto?: string;
  coverPhoto?: string;
  onPhotoUpload?: (photo: Photo) => void;
  onPhotoDelete?: (photoId: string) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  userId,
  photos,
  isOwnProfile,
  profilePhoto,
  coverPhoto,
  onPhotoUpload,
  onPhotoDelete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<'profile' | 'cover' | 'gallery'>('gallery');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Separate photos by type
  const profilePhotos = photos.filter(p => p.type === 'profile');
  const coverPhotos = photos.filter(p => p.type === 'cover');
  const galleryPhotos = photos.filter(p => p.type === 'gallery');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    // For demo, we'll simulate upload. In production, use Cloudinary or similar
    try {
      setUploading(true);
      
      // Create a FormData object for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // In production, upload to Cloudinary and get the URL
      // For now, we'll simulate with a local preview
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        
        // Call the API to save the photo
        try {
          const response = await fetch(`/api/users/${userId}/photos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              url: imageUrl,
              type: selectedType,
              caption: '',
            }),
          });

          if (response.ok) {
            const data = await response.json();
            onPhotoUpload?.(data.photo);
            alert('Photo téléchargée avec succès');
          } else {
            alert('Erreur lors du téléchargement');
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('Erreur lors du téléchargement');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (photoId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo?')) {
      try {
        const response = await fetch(`/api/users/${userId}/photos/${photoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onPhotoDelete?.(photoId);
        }
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {isOwnProfile && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Galerie photos
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de photo
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedType('profile')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === 'profile'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                Photo de profil
              </button>
              <button
                onClick={() => setSelectedType('cover')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === 'cover'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                Photo de couverture
              </button>
              <button
                onClick={() => setSelectedType('gallery')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedType === 'gallery'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                Galerie
              </button>
            </div>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400 mb-1">
              Cliquez pour télécharger une photo
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              ou glissez-déposez une image
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </div>

          {uploading && (
            <p className="text-center text-blue-500 mt-2">Téléchargement en cours...</p>
          )}
        </Card>
      )}

      {/* Profile Photo */}
      {profilePhotos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Photo de profil
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profilePhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={photo.url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Cover Photo */}
      {coverPhotos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Photo de couverture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coverPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-video rounded-lg overflow-hidden group"
              >
                <img
                  src={photo.url}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
                {isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Gallery Photos */}
      {galleryPhotos.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Galerie photos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Gallery photo'}
                  className="w-full h-full object-cover"
                />
                {isOwnProfile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <Card className="p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {isOwnProfile ? 'Aucune photo pour le moment' : 'Cet utilisateur n\'a pas encore de photos'}
          </p>
          {isOwnProfile && (
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Télécharger une photo
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};
