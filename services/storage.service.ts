/**
 * LocalStorage service for data persistence
 */

import { Board } from '@/types';

const STORAGE_KEY = 'trello-board';

/**
 * Get board from localStorage
 */
export const getBoardFromStorage = (): Board | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Board;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Save board to localStorage
 */
export const saveBoardToStorage = (board: Board): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Initialize default board if none exists
 */
export const getInitialBoard = (): Board => {
  const stored = getBoardFromStorage();
  
  if (stored) {
    return stored;
  }
  
  // Default board with initial lists
  return {
    id: 'board-1',
    title: 'Demo Board',
    lists: [
      {
        id: 'list-1',
        title: 'Todo',
        cards: [
          {
            id: 'card-1',
            title: 'Create interview Kanban',
            comments: []
          },
          {
            id: 'card-2',
            title: 'Review Drag & Drop',
            comments: []
          }
        ]
      },
      {
        id: 'list-2',
        title: 'In Progress',
        cards: [
          {
            id: 'card-3',
            title: 'Set up Next.js project',
            comments: [
              {
                id: 'comment-1',
                content: 'aaa',
                author: 'You',
                createdAt: new Date().toLocaleString()
              }
            ]
          }
        ]
      },
      {
        id: 'list-3',
        title: 'Done',
        cards: []
      }
    ]
  };
};


