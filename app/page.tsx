'use client';

import { useBoard } from '@/hooks/useBoard';
import { Board } from '@/components/Board';
import '@/styles/main.scss';

export default function Home() {
  const {
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
  } = useBoard();

  if (isLoading || !board) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#ffffff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Board
      board={board}
      onUpdateBoardTitle={updateBoardTitle}
      onAddList={addList}
      onUpdateListTitle={updateListTitle}
      onDeleteList={deleteList}
      onMoveList={moveList}
      onAddCard={addCard}
      onUpdateCardTitle={updateCardTitle}
      onMoveCard={moveCard}
      onAddComment={addComment}
    />
  );
}
