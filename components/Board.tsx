/**
 * Board Component
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Board as BoardType, List as ListType, Card as CardType } from '@/types';
import { List } from './List';
import { CommentsModal } from './CommentsModal';

interface BoardProps {
  board: BoardType;
  onUpdateBoardTitle: (title: string) => void;
  onAddList: (title: string) => void;
  onUpdateListTitle: (listId: string, title: string) => void;
  onDeleteList: (listId: string) => void;
  onMoveList: (startIndex: number, endIndex: number) => void;
  onAddCard: (listId: string, title: string) => void;
  onUpdateCardTitle: (cardId: string, title: string) => void;
  onMoveCard: (
    sourceListId: string,
    destinationListId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  onAddComment: (cardId: string, content: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onUpdateBoardTitle,
  onAddList,
  onUpdateListTitle,
  onDeleteList,
  onMoveList,
  onAddCard,
  onUpdateCardTitle,
  onMoveCard,
  onAddComment
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(board.title);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  // Sync selectedCard with board data whenever board changes
  useEffect(() => {
    if (selectedCard && isCommentsModalOpen) {
      const updatedCard = board.lists
        .flatMap((list) => list.cards)
        .find((card) => card.id === selectedCard.id);
      
      if (updatedCard) {
        // Compare comments length to force update
        const commentsChanged = updatedCard.comments.length !== selectedCard.comments.length;
        if (commentsChanged || JSON.stringify(updatedCard.comments) !== JSON.stringify(selectedCard.comments)) {
          setSelectedCard({ ...updatedCard });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isCommentsModalOpen]);
  const [newListTitle, setNewListTitle] = useState('');
  const [showAddListInput, setShowAddListInput] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const listInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    setTitle(board.title);
  }, [board.title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (showAddListInput && listInputRef.current) {
      listInputRef.current.focus();
    }
  }, [showAddListInput]);

  const handleTitleBlur = () => {
    if (title.trim()) {
      onUpdateBoardTitle(title.trim());
    } else {
      setTitle(board.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setTitle(board.title);
      setIsEditingTitle(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Handle list drag
    if (active.id.toString().startsWith('list-')) {
      const oldIndex = board.lists.findIndex((l) => l.id === active.id);
      const newIndex = board.lists.findIndex((l) => l.id === over.id);

      if (oldIndex !== newIndex) {
        onMoveList(oldIndex, newIndex);
      }
      return;
    }

    // Handle card drag
    if (active.id.toString().startsWith('card-')) {
      const sourceListId = active.data.current?.listId as string;
      const sourceIndex = active.data.current?.index as number;
      
      // Find destination - could be a list or another card
      let destinationListId: string;
      let destinationIndex: number;

      if (over.id.toString().startsWith('card-')) {
        // Card dropped on another card
        destinationListId = over.data.current?.listId as string;
        const overIndex = over.data.current?.index as number;
        
        // Adjust index based on direction
        if (sourceListId === destinationListId) {
          // Same list: account for the fact that removing source shifts indices
          if (sourceIndex < overIndex) {
            // Moving down: after removal, target moves up by 1, so insert at overIndex
            destinationIndex = overIndex;
          } else if (sourceIndex > overIndex) {
            // Moving up: insert at target position (before overIndex)
            destinationIndex = overIndex;
          } else {
            // Same position, no move needed
            return;
          }
        } else {
          // Different list: insert after target
          destinationIndex = overIndex + 1;
        }
      } else if (over.id.toString().startsWith('list-') || over.id.toString().startsWith('droppable-')) {
        // Card dropped on list or droppable area
        if (over.id.toString().startsWith('droppable-')) {
          destinationListId = over.data.current?.listId as string;
        } else {
          destinationListId = over.id.toString();
        }
        const destinationList = board.lists.find((l) => l.id === destinationListId);
        destinationIndex = destinationList?.cards.length || 0;
      } else {
        return;
      }

      if (sourceListId !== destinationListId || sourceIndex !== destinationIndex) {
        onMoveCard(sourceListId, destinationListId, sourceIndex, destinationIndex);
      }
    }
  };

  const handleAddList = () => {
    if (newListTitle.trim()) {
      onAddList(newListTitle.trim());
      setNewListTitle('');
      setShowAddListInput(false);
    }
  };

  const handleAddListKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddList();
    } else if (e.key === 'Escape') {
      setNewListTitle('');
      setShowAddListInput(false);
    }
  };

  // handleAddCard is now passed directly to List component
  // List component handles the UI and calls onAddCard with the title

  const handleOpenCardComments = (card: CardType) => {
    console.log('handleOpenCardComments called with card:', card);
    // Find the latest card data from board to ensure we have fresh comments
    const latestCard = board.lists
      .flatMap((list) => list.cards)
      .find((c) => c.id === card.id);
    
    if (latestCard) {
      console.log('Setting selectedCard to latestCard:', latestCard);
      setSelectedCard(latestCard);
    } else {
      console.log('Card not found, using passed card:', card);
      setSelectedCard(card);
    }
    console.log('Setting isCommentsModalOpen to true');
    setIsCommentsModalOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsModalOpen(false);
    setSelectedCard(null);
  };

  const handleAddComment = (content: string) => {
    if (selectedCard) {
      onAddComment(selectedCard.id, content);
      // The useEffect will update selectedCard when board changes
    }
  };

  const listIds = board.lists.map((list) => list.id);

  return (
    <div className="board-container">
      <div className="board-header">
        <input
          ref={titleInputRef}
          className="board-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          onKeyDown={handleTitleKeyDown}
          onDoubleClick={() => setIsEditingTitle(true)}
          readOnly={!isEditingTitle}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="board-lists">
          <SortableContext
            items={listIds}
            strategy={horizontalListSortingStrategy}
          >
            {board.lists.map((list) => {
              const cardIds = list.cards.map((card) => card.id);

              return (
                <div key={list.id} data-list-id={list.id}>
                  <SortableContext
                    items={cardIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <List
                      list={list}
                      onUpdateTitle={(title) => onUpdateListTitle(list.id, title)}
                      onDelete={() => onDeleteList(list.id)}
                      onAddCard={(title) => onAddCard(list.id, title)}
                      onUpdateCardTitle={onUpdateCardTitle}
                      onOpenCardComments={handleOpenCardComments}
                    />
                  </SortableContext>
                </div>
              );
            })}
          </SortableContext>

          {showAddListInput ? (
            <div
              style={{
                minWidth: '300px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '12px'
              }}
            >
              <input
                ref={listInputRef}
                type="text"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleAddListKeyDown}
                onBlur={() => {
                  if (!newListTitle.trim()) {
                    setShowAddListInput(false);
                  }
                }}
                placeholder="Enter list title..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '15px',
                  outline: 'none',
                  background: '#ffffff',
                  color: '#333'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={handleAddList}
                  style={{
                    padding: '8px 16px',
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Add List
                </button>
                <button
                  onClick={() => {
                    setNewListTitle('');
                    setShowAddListInput(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="add-list-button"
              onClick={() => setShowAddListInput(true)}
              type="button"
            >
              + Add another list
            </button>
          )}
        </div>
      </DndContext>

      {isCommentsModalOpen && (
        <CommentsModal
          card={selectedCard}
          isOpen={isCommentsModalOpen}
          onClose={handleCloseComments}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

