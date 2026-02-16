import { MutableRefObject } from 'react';
import { Group, SelectedCard } from '../types';
import Grupo from './Grupo';
import './Columna.css';

interface ColumnaProps {
  groups: Group[];
  selectedCard: SelectedCard | null;
  cardRefs: MutableRefObject<Record<string, HTMLDivElement>>;
  onCreateGroup: () => void;
  onCreateCard: (groupId: string) => void;
  onCardClick: (cardId: string) => void;
  onRenameCard: (cardId: string, newName: string) => void;
  onRenameGroup: (groupId: string, newName: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteGroup: (groupId: string) => void;
}

function Columna({
  groups,
  selectedCard,
  cardRefs,
  onCreateGroup,
  onCreateCard,
  onCardClick,
  onRenameCard,
  onRenameGroup,
  onDeleteCard,
  onDeleteGroup,
}: ColumnaProps) {
  return (
    <div className="columna">
      {groups.map((group) => (
        <Grupo
          key={group.id}
          group={group}
          selectedCard={selectedCard}
          cardRefs={cardRefs}
          onCreateCard={() => onCreateCard(group.id)}
          onCardClick={onCardClick}
          onRenameCard={onRenameCard}
          onRenameGroup={onRenameGroup}
          onDeleteCard={onDeleteCard}
          onDeleteGroup={onDeleteGroup}
        />
      ))}

      <button className="btn-crear" onClick={onCreateGroup}>
        + Crear grupo
      </button>
    </div>
  );
}

export default Columna;
