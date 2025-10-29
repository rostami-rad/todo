/**
 * List Component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { List as ListType, Card as CardType } from '@/types';
import { Card } from './Card';

interface ListProps {
  list: ListType;
  onUpdateTitle: (title: string) => void;
  onDelete: () => void;
  onAddCard: (title: string) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onOpenCardComments: (card: CardType) => void;
}

export const List: React.FC<ListProps> = ({
  list,
  onUpdateTitle,
  onDelete,
  onAddCard,
  onUpdateCardTitle,
  onOpenCardComments
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [showOptions, setShowOptions] = useState(false);
  const [showAddCardInput, setShowAddCardInput] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);
  const cardInputContainerRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  // Make list cards area droppable
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `droppable-${list.id}`,
    data: {
      type: 'list',
      listId: list.id
    }
  });

  useEffect(() => {
    setTitle(list.title);
  }, [list.title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (showAddCardInput && cardInputRef.current) {
      cardInputRef.current.focus();
    }
  }, [showAddCardInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
      if (
        cardInputContainerRef.current &&
        !cardInputContainerRef.current.contains(event.target as Node) &&
        showAddCardInput
      ) {
        // Close if clicked outside and input is empty
        if (!newCardTitle.trim()) {
          setShowAddCardInput(false);
        }
      }
    };

    if (showOptions || showAddCardInput) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptions, showAddCardInput, newCardTitle]);

  const handleTitleBlur = () => {
    if (title.trim()) {
      onUpdateTitle(title.trim());
    } else {
      setTitle(list.title);
    }
    setIsEditing(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setTitle(list.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the list "${list.title}"?`)) {
      onDelete();
    }
    setShowOptions(false);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle.trim());
      setNewCardTitle('');
      setShowAddCardInput(false);
    }
  };

  const handleCancelAddCard = () => {
    setNewCardTitle('');
    setShowAddCardInput(false);
  };

  const handleCardInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      handleCancelAddCard();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="list-container"
      {...attributes}
    >
      <div className="list-header" style={{ position: 'relative', zIndex: 2 }}>
        {/* Draggable area on empty space of header */}
        <div
          {...listeners}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '60px', // Leave space for options button
            height: '100%',
            cursor: 'grab',
            zIndex: 1
          }}
          onMouseDown={(e) => {
            // Only allow drag if not clicking on input or button
            const target = e.target as HTMLElement;
            if (target.closest('input') || target.closest('button')) {
              e.stopPropagation();
              return;
            }
          }}
        />
        <input
          ref={inputRef}
          className="list-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => e.stopPropagation()}
          readOnly={!isEditing}
          style={{ position: 'relative', zIndex: 2 }}
        />
        <div style={{ position: 'relative', zIndex: 3 }} ref={optionsRef}>
          <button
            className="list-options"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowOptions(!showOptions);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            type="button"
          >
            ⋯
          </button>
          {showOptions && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                background: '#ffffff',
                borderRadius: '4px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                minWidth: '120px',
                padding: '8px'
              }}
            >
              <button
                onClick={handleDelete}
                style={{
                  width: '100%',
                  padding: '8px',
                  textAlign: 'left',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#333',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Delete List
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        ref={setDroppableRef}
        className="list-cards"
        style={{
          minHeight: '20px',
          backgroundColor: isOver ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
          borderRadius: '4px',
          padding: isOver ? '4px' : '0',
          transition: 'background-color 0.2s ease',
          position: 'relative',
          zIndex: 1
        }}
      >
        {list.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            listId={list.id}
            index={index}
            onUpdateTitle={(title) => onUpdateCardTitle(card.id, title)}
            onOpenComments={() => onOpenCardComments(card)}
          />
        ))}
      </div>

      {showAddCardInput ? (
        <div
          ref={cardInputContainerRef}
          style={{
            background: '#ffffff',
            borderRadius: '8px',
            padding: '8px',
            marginTop: '8px',
            position: 'relative',
            zIndex: 2
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <input
            ref={cardInputRef}
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleCardInputKeyDown}
            placeholder="Enter a card title..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #333',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
              marginBottom: '8px',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddCard}
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
              type="button"
            >
              Create card
            </button>
            <button
              onClick={handleCancelAddCard}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#6b7280',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px'
              }}
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <button
          className="add-card-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddCardInput(true);
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          type="button"
          style={{ position: 'relative', zIndex: 2 }}
        >
          + Add another card
        </button>
      )}
    </div>
  );
};

