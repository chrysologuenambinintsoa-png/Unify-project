/**
 * Custom Hooks for Search Actions
 * Réutilisable hooks pour les actions de recherche
 */

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook pour envoyer des messages
 */
export const useSendMessage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (receiverId: string, content: string) => {
      if (!session?.user?.id) {
        setError('Not authenticated');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/messages/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId,
            content,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to send message');
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return { sendMessage, loading, error };
};

/**
 * Hook pour ajouter des amis
 */
export const useAddFriend = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFriend = useCallback(
    async (userId: string) => {
      if (!session?.user?.id) {
        setError('Not authenticated');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/friends/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add friend');
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return { addFriend, loading, error };
};

/**
 * Hook pour suivre des pages
 */
export const useFollowPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const followPage = useCallback(
    async (pageId: string) => {
      if (!session?.user?.id) {
        setError('Not authenticated');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/pages/follow', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to follow page');
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const unfollowPage = useCallback(
    async (pageId: string) => {
      if (!session?.user?.id) {
        setError('Not authenticated');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/pages/follow?pageId=${pageId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to unfollow page');
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return { followPage, unfollowPage, loading, error };
};

/**
 * Hook pour joindre des groupes
 */
export const useJoinGroup = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const joinGroup = useCallback(
    async (groupId: string) => {
      if (!session?.user?.id) {
        setError('Not authenticated');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/groups/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ groupId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to join group');
        }

        const data = await response.json();
        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  const leaveGroup = useCallback(
    async (groupId: string) => {
      if (!session?.user?.id) {
        setError('Not authenticated');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/groups/join?groupId=${groupId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to leave group');
        }

        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [session]
  );

  return { joinGroup, leaveGroup, loading, error };
};

/**
 * Hook pour effectuer une recherche
 */
export const useSearch = () => {
  const [results, setResults] = useState({
    personnes: [],
    groupes: [],
    pages: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, type: 'all' | 'personnes' | 'groupes' | 'pages' = 'all') => {
    if (!query || query.length < 2) {
      setResults({ personnes: [], groupes: [], pages: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults({ personnes: [], groupes: [], pages: [] });
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
};

/**
 * Hook combiné pour les actions de recherche
 */
export const useSearchActions = () => {
  const { search, results, loading: searchLoading, error: searchError } = useSearch();
  const { sendMessage, loading: messageSending, error: messageError } = useSendMessage();
  const { addFriend, loading: friendAdding, error: friendError } = useAddFriend();
  const { followPage, unfollowPage, loading: pageLoading, error: pageError } = useFollowPage();
  const { joinGroup, leaveGroup, loading: groupLoading, error: groupError } = useJoinGroup();

  return {
    // Search
    search,
    results,
    searchLoading,
    searchError,
    // Messages
    sendMessage,
    messageSending,
    messageError,
    // Friends
    addFriend,
    friendAdding,
    friendError,
    // Pages
    followPage,
    unfollowPage,
    pageLoading,
    pageError,
    // Groups
    joinGroup,
    leaveGroup,
    groupLoading,
    groupError,
    // Combined
    isLoading: searchLoading || messageSending || friendAdding || pageLoading || groupLoading,
    error: searchError || messageError || friendError || pageError || groupError,
  };
};

/**
 * Hook pour gérer les états d'action avec debounce
 */
export const useActionState = (
  defaultState: Record<string, boolean> = {}
) => {
  const [actionStates, setActionStates] = useState(defaultState);

  const setActionLoading = useCallback(
    (actionId: string, isLoading: boolean) => {
      setActionStates((prev) => ({
        ...prev,
        [actionId]: isLoading,
      }));
    },
    []
  );

  const resetActionState = useCallback((actionId: string) => {
    setActionStates((prev) => ({
      ...prev,
      [actionId]: false,
    }));
  }, []);

  const resetAllStates = useCallback(() => {
    setActionStates({});
  }, []);

  return {
    actionStates,
    setActionLoading,
    resetActionState,
    resetAllStates,
    isActionLoading: (actionId: string) => actionStates[actionId] || false,
  };
};

export default {
  useSendMessage,
  useAddFriend,
  useFollowPage,
  useJoinGroup,
  useSearch,
  useSearchActions,
  useActionState,
};
