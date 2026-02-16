import { useCallback, MutableRefObject } from 'react';
import { Card } from '../types';
import { useInlineEdit } from '../hooks/useInlineEdit';
import './Tarjeta.css';

interface TarjetaProps {
  card: Card;
  isSelected: boolean;
  cardRefs: MutableRefObject<Record<string, HTMLDivElement>>;
  onClick: () => void;
  onRename: (cardId: string, newName: string) => void;
  onDelete: (cardId: string) => void;
}

function Tarjeta({ card, isSelected, cardRefs, onClick, onRename, onDelete }: TarjetaProps) {
  const { editing, editValue, setEditValue, startEditing, confirmEdit, handleKeyDown } =
    useInlineEdit(card.name, (name) => onRename(card.id, name));

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      cardRefs.current[card.id] = node;
    } else {
      delete cardRefs.current[card.id];
    }
  }, [card.id, cardRefs]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    startEditing();
  };

  return (
    <div
      ref={refCallback}
      className={`tarjeta ${isSelected ? 'tarjeta--selected' : ''}`}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          className="tarjeta__input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={confirmEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <>
          <span>{card.name}</span>
          <button
            className="tarjeta__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card.id);
            }}
            title="Eliminar tarjeta"
          >
            &times;
          </button>
        </>
      )}
    </div>
  );
}

export default Tarjeta;
