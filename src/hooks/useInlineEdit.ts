import { useState } from 'react';

export function useInlineEdit(currentName: string, onConfirm: (name: string) => void) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentName);

  const startEditing = () => {
    setEditValue(currentName);
    setEditing(true);
  };

  const confirmEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onConfirm(trimmed);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') confirmEdit();
    if (e.key === 'Escape') setEditing(false);
  };

  return { editing, editValue, setEditValue, startEditing, confirmEdit, handleKeyDown };
}
