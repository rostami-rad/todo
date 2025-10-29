/**
 * Comments Modal Component
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/types';
import '@/styles/main.scss';

interface CommentsModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (content: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  card,
  isOpen,
  onClose,
  onAddComment
}) => {
  const [commentText, setCommentText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log('CommentsModal - isOpen:', isOpen, 'card:', card);
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
    setCommentText('');
  }, [isOpen, card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !card) {
    return null;
  }

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '24px',
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          color: '#333333',
          zIndex: 10001,
          visibility: 'visible',
          opacity: 1,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Comments for '{card.title}'</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              padding: 0,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333'
            }}
          >
            ×
          </button>
        </div>

        <div className="comments-list" style={{ marginBottom: '24px', minHeight: '50px', maxHeight: '400px', overflowY: 'auto' }}>
          {card.comments && card.comments.length > 0 ? (
            card.comments.map((comment) => (
              <div 
                key={comment.id} 
                className="comment-item"
                style={{
                  padding: '12px',
                  borderBottom: '1px solid #e0e0e0',
                  marginBottom: '12px',
                  backgroundColor: '#fff'
                }}
              >
                <div className="comment-author" style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>
                  {comment.author || 'Unknown'} - {comment.createdAt || 'No date'}
                </div>
                <div className="comment-content" style={{ fontSize: '14px', color: '#333333', lineHeight: '1.5' }}>
                  {comment.content || '(Empty comment)'}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: '#6b7280', fontSize: '14px', padding: '12px' }}>
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>

        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            className="comment-textarea"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="add-comment-button"
            disabled={!commentText.trim()}
          >
            Add Comment
          </button>
        </form>
      </div>
    </div>
  );
};


