import { useState, useCallback, useEffect } from 'react';

export interface PublishedStory {
  id: string;
  imageUrl?: string;
  videoUrl?: string;
  text?: string;
  createdAt: string;
  expiresAt: string;
  user: {
    id: string;
    username: string;
    fullName?: string;
    avatar?: string;
    isVerified: boolean;
  };
  stats: {
    viewCount: number;
    reactionCount: number;
  };
}

export interface PublishedStoriesResponse {
  success: boolean;
  data: PublishedStory[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface PaginationOptions {
  limit?: number;
  skip?: number;
  userId?: string;
}

export const usePublishedStories = (initialOptions?: PaginationOptions) => {
  const [stories, setStories] = useState<PublishedStory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: initialOptions?.limit || 20,
    skip: initialOptions?.skip || 0,
    hasMore: false
  });

  const fetchStories = useCallback(
    async (options: PaginationOptions = {}) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: String(options.limit || pagination.limit),
          skip: String(options.skip || pagination.skip),
          ...(options.userId && { userId: options.userId })
        });

        const response = await fetch(`/api/stories/published?${params}`);

        if (!response.ok) {
          throw new Error('Failed to fetch published stories');
        }

        const data: PublishedStoriesResponse = await response.json();

        if (options.skip && options.skip > 0) {
          // Ajouter aux stories existantes pour la pagination
          setStories(prev => [...prev, ...data.data]);
        } else {
          setStories(data.data);
        }

        setPagination(data.pagination);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error fetching published stories:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, pagination.skip]
  );

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      fetchStories({
        limit: pagination.limit,
        skip: pagination.skip + pagination.limit,
        userId: initialOptions?.userId
      });
    }
  }, [fetchStories, pagination, loading, initialOptions?.userId]);

  const refresh = useCallback(() => {
    fetchStories({
      limit: pagination.limit,
      skip: 0,
      userId: initialOptions?.userId
    });
  }, [fetchStories, pagination.limit, initialOptions?.userId]);

  useEffect(() => {
    fetchStories(initialOptions);
  }, []);

  return {
    stories,
    loading,
    error,
    pagination,
    fetchStories,
    loadMore,
    refresh
  };
};

export const usePublishedStoryDetails = (storyId: string) => {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStoryDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/stories/published/${storyId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch story details');
      }

      const data = await response.json();
      setStory(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching story details:', err);
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (storyId) {
      fetchStoryDetails();
    }
  }, [storyId, fetchStoryDetails]);

  return {
    story,
    loading,
    error,
    refetch: fetchStoryDetails
  };
};
