/**
 * Type definitions for Trello Clone
 */

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  comments: Comment[];
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}

