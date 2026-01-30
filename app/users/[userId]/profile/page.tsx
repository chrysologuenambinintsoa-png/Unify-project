'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { About } from '@/components/profile/About';
import { PhotoGallery } from '@/components/profile/PhotoGallery';
import { Mail, Calendar } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  type: 'profile' | 'cover' | 'gallery';
  caption?: string;
  createdAt: string;
}

interface AboutInfo {
  dateOfBirth?: string;
  originCity?: string;
  currentCity?: string;
  schoolName?: string;
  collegeName?: string;
  highSchoolName?: string;
  universityName?: string;
  skills?: string[];
  pseudonym?: string;
}

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  coverImage?: string | null;
  createdAt: string;
  isVerified: boolean;
  postsCount: number;
  friendsCount: number;
  about?: AboutInfo;
  photoGallery?: Photo[];
}

interface FriendshipStatus {
  status: 'self' | 'accepted' | 'pending' | 'sent' | 'none';
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { translation } = useLanguage();
  const userId = params?.userId as string;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [friendshipStatus, setFriendshipStatus] = useState<string>('none');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/users/${userId}/profile`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Utilisateur non trouvé');
          } else {
            setError('Erreur lors du chargement du profil');
          }
          setProfile(null);
          return;
        }

        const data = await response.json();
        setProfile(data.user);
        setFriendshipStatus(data.friendshipStatus || 'none');
        setPhotos(data.user.photoGallery || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleAddFriend = async () => {
    try {
      const response = await fetch(`/api/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: userId }),
      });

      if (response.ok) {
        setFriendshipStatus('sent');
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const response = await fetch(`/api/friends/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFriendshipStatus('none');
      }
    } catch (err) {
      console.error('Error removing friend:', err);
    }
  };

  const handleCancelRequest = async () => {
    try {
      const response = await fetch(`/api/friends/request/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: userId }),
      });

      if (response.ok) {
        setFriendshipStatus('none');
      }
    } catch (err) {
      console.error('Error canceling request:', err);
    }
  };

  const handlePhotoUpload = (newPhoto: Photo) => {
    setPhotos([newPhoto, ...photos]);
  };

  const handlePhotoDelete = (photoId: string) => {
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-dark"></div>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <Card className="p-8 text-center max-w-md mx-auto">
          <p className="text-gray-600 mb-4">{error || 'Utilisateur non trouvé'}</p>
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </Card>
      </MainLayout>
    );
  }

  const isOwnProfile = session?.user?.id === profile.id;
  const joinDate = new Date(profile.createdAt);
  const formattedDate = joinDate.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        {/* Profile Header */}
        <Card className="overflow-hidden mb-6">
          <div 
            className="h-32 bg-gradient-to-r from-primary-dark to-accent-dark"
            style={{
              backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>

          <div className="px-6 pb-6 -mt-16 relative z-10">
            <div className="flex items-end gap-4 mb-6">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-primary-dark to-accent-dark flex items-center justify-center text-white text-4xl font-bold">
                  {profile.username?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.fullName}
                  </h1>
                  {profile.isVerified && (
                    <span className="text-blue-500 text-2xl">✓</span>
                  )}
                </div>
                <p className="text-gray-600">@{profile.username}</p>
                {profile.about?.pseudonym && (
                  <p className="text-sm text-gray-500 italic">\"{profile.about.pseudonym}\"</p>
                )}
              </div>

              {!isOwnProfile && (
                <div className="mb-1">
                  {friendshipStatus === 'self' ? null : friendshipStatus === 'accepted' ? (
                    <Button
                      onClick={handleRemoveFriend}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Supprimer l'ami
                    </Button>
                  ) : friendshipStatus === 'sent' ? (
                    <Button
                      onClick={handleCancelRequest}
                      className="bg-gray-500 hover:bg-gray-600"
                    >
                      Annuler la demande
                    </Button>
                  ) : friendshipStatus === 'pending' ? (
                    <Button
                      onClick={handleAddFriend}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Accepter
                    </Button>
                  ) : (
                    <Button
                      onClick={handleAddFriend}
                      className="bg-primary-dark hover:bg-accent-dark"
                    >
                      Ajouter un ami
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-gray-700 mb-4">{profile.bio}</p>
            )}

            {/* Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Rejoint {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-4 flex gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.postsCount}</p>
              <p className="text-sm text-gray-600">Publications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{profile.friendsCount}</p>
              <p className="text-sm text-gray-600">Amis</p>
            </div>
          </div>
        </Card>

        {/* Additional Actions */}
        {!isOwnProfile && (
          <div className="flex gap-3 mb-6">
            <Button
              onClick={() => router.push(`/messages?user=${profile.id}`)}
              className="flex-1 bg-primary-dark hover:bg-accent-dark"
            >
              Envoyer un message
            </Button>
            <Link href={`/users/${profile.id}/posts`} className="flex-1">
              <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900">
                Voir les publications
              </Button>
            </Link>
          </div>
        )}

        {isOwnProfile && (
          <div className="flex gap-3 mb-6">
            <Link href="/settings" className="flex-1">
              <Button className="w-full bg-primary-dark hover:bg-accent-dark">
                Modifier le profil
              </Button>
            </Link>
          </div>
        )}

        {/* About Section */}
        {profile.about && (
          <About 
            about={profile.about}
            isOwnProfile={isOwnProfile}
            onEdit={() => router.push('/settings')}
          />
        )}

        {/* Photo Gallery Section */}
        <PhotoGallery
          userId={profile.id}
          photos={photos}
          isOwnProfile={isOwnProfile}
          profilePhoto={profile.avatar || undefined}
          coverPhoto={profile.coverImage || undefined}
          onPhotoUpload={handlePhotoUpload}
          onPhotoDelete={handlePhotoDelete}
        />
      </motion.div>
    </MainLayout>
  );
}

