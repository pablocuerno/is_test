import { MutableRefObject } from 'react';
import { Group, SelectedCard } from '../types';
import { useInlineEdit } from '../hooks/useInlineEdit';
import Tarjeta from './Tarjeta';
import './Grupo.css';

interface GrupoProps {
  group: Group;
  selectedCard: SelectedCard | null;
  cardRefs: MutableRefObject<Record<string, HTMLDivElement>>;
  onCreateCard: () => void;
  onCardClick: (cardId: string) => void;
  onRenameCard: (cardId: string, newName: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

function Grupo({
  group,
  selectedCard,
  cardRefs,
  onCreateCard,
  onCardClick,
  onRenameCard,
  onRenameGroup,
  onDeleteCard,
  onDeleteGroup,
}: GrupoProps) {
  const { editing, editValue, setEditValue, startEditing, confirmEdit, handleKeyDown } =
    useInlineEdit(group.name, (name) => onRenameGroup(group.id, name));

  return (
    <div className="grupo">
      <div className="grupo__header" onDoubleClick={startEditing}>
        {editing ? (
          <input
            className="grupo__input"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <>
            <span className="grupo__title">{group.name}</span>
            <button
              className="grupo__delete"
              onClick={() => onDeleteGroup(group.id)}
              title="Eliminar grupo"
            >
              &times;
            </button>
          </>
        )}
      </div>

      {group.cards.map((card) => (
        <Tarjeta
          key={card.id}
          card={card}
          isSelected={selectedCard?.cardId === card.id}
          cardRefs={cardRefs}
          onClick={() => onCardClick(card.id)}
          onRename={onRenameCard}
          onDelete={onDeleteCard}
        />
      ))}

      <button className="btn-crear" onClick={onCreateCard}>
        + Crear tarjeta
      </button>
    </div>
  );
}

export default Grupo;
