/**
 * Card Component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as CardType } from '@/types';

interface CardProps {
  card: CardType;
  listId: string;
  index: number;
  onUpdateTitle: (title: string) => void;
  onOpenComments: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  listId,
  index,
  onUpdateTitle,
  onOpenComments
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
      listId,
      index
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  useEffect(() => {
    setTitle(card.title);
  }, [card.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    if (title.trim()) {
      onUpdateTitle(title.trim());
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const handleCommentsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    console.log('Comments button clicked for card:', card.id);
    onOpenComments();
  };

  const handleCommentsMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card-container"
      {...attributes}
      {...(!isEditing ? listeners : {})}
    >
      <input
        ref={inputRef}
        className="card-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        onMouseDown={(e) => {
          if (!isEditing) {
            e.stopPropagation();
          }
        }}
        readOnly={!isEditing}
        style={{ cursor: isEditing ? 'text' : 'grab' }}
      />
      <button
        className="card-comments-button"
        onClick={handleCommentsClick}
        onMouseDown={handleCommentsMouseDown}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        type="button"
        style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
      >
        Comments ({card.comments?.length || 0})
      </button>
    </div>
  );
};

