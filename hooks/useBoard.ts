/**
 * Custom hook for board state management
 */

import { useState, useEffect, useCallback } from 'react';
import { Board } from '@/types';
import { getInitialBoard, saveBoardToStorage } from '@/services/storage.service';

export const useBoard = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load board from storage on mount
  useEffect(() => {
    const initialBoard = getInitialBoard();
    setBoard(initialBoard);
    setIsLoading(false);
  }, []);

  // Save board to storage whenever it changes
  useEffect(() => {
    if (board && !isLoading) {
      saveBoardToStorage(board);
    }
  }, [board, isLoading]);

  // Update board title
  const updateBoardTitle = useCallback((title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return { ...prev, title };
    });
  }, []);

  // Add new list
  const addList = useCallback((title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const newList = {
        id: `list-${Date.now()}`,
        title,
        cards: []
      };
      return {
        ...prev,
        lists: [...prev.lists, newList]
      };
    });
  }, []);

  // Update list title
  const updateListTitle = useCallback((listId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId ? { ...list, title } : list
        )
      };
    });
  }, []);

  // Delete list
  const deleteList = useCallback((listId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.filter((list) => list.id !== listId)
      };
    });
  }, []);

  // Move lists (for drag & drop)
  const moveList = useCallback((startIndex: number, endIndex: number) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const newLists = Array.from(prev.lists);
      const [removed] = newLists.splice(startIndex, 1);
      newLists.splice(endIndex, 0, removed);
      return { ...prev, lists: newLists };
    });
  }, []);

  // Add card to list
  const addCard = useCallback((listId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const newCard = {
        id: `card-${Date.now()}`,
        title,
        comments: []
      };
      return {
        ...prev,
        lists: prev.lists.map((list) =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      };
    });
  }, []);

  // Update card title
  const updateCardTitle = useCallback((cardId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId ? { ...card, title } : card
          )
        }))
      };
    });
  }, []);

  // Move card within same list or to another list
  const moveCard = useCallback((
    sourceListId: string,
    destinationListId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const sourceList = prev.lists.find((l) => l.id === sourceListId);
      const card = sourceList?.cards[sourceIndex];
      
      if (!card) return prev;

      // If same list, handle differently
      if (sourceListId === destinationListId) {
        // Reorder within same list
        const list = prev.lists.find((l) => l.id === sourceListId);
        if (!list) return prev;
        
        const newCards = Array.from(list.cards);
        const [removed] = newCards.splice(sourceIndex, 1);
        newCards.splice(destinationIndex, 0, removed);
        
        return {
          ...prev,
          lists: prev.lists.map((l) =>
            l.id === sourceListId ? { ...l, cards: newCards } : l
          )
        };
      }

      // Different lists: remove from source and add to destination
      return {
        ...prev,
        lists: prev.lists.map((list) => {
          if (list.id === sourceListId) {
            // Remove card from source
            const newCards = Array.from(list.cards);
            newCards.splice(sourceIndex, 1);
            return { ...list, cards: newCards };
          }
          if (list.id === destinationListId) {
            // Add card to destination
            const newCards = Array.from(list.cards);
            newCards.splice(destinationIndex, 0, card);
            return { ...list, cards: newCards };
          }
          return list;
        })
      };
    });
  }, []);

  // Add comment to card
  const addComment = useCallback((cardId: string, content: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const newComment = {
        id: `comment-${Date.now()}`,
        content,
        author: 'You',
        createdAt: new Date().toLocaleString()
      };
      return {
        ...prev,
        lists: prev.lists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? { ...card, comments: [...card.comments, newComment] }
              : card
          )
        }))
      };
    });
  }, []);

  return {
    board,
    isLoading,
    updateBoardTitle,
    addList,
    updateListTitle,
    deleteList,
    moveList,
    addCard,
    updateCardTitle,
    moveCard,
    addComment
  };
};


