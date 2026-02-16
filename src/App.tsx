import { useState, useRef, useCallback } from 'react';
import { Column, Connection, SelectedCard } from './types';
import Columna from './components/Columna';
import Lineas from './components/Lineas';
import './App.css';

function generateId(): string {
  return crypto.randomUUID();
}

const initialColumns: Column[] = [
  {
    id: 'col-1',
    groups: [
      {
        id: 'group-101',
        name: 'Grupo',
        cards: [
          { id: 'card-1001', name: 'Tarjeta' },
          { id: 'card-1002', name: 'Tarjeta' },
        ],
      },
    ],
  },
  {
    id: 'col-2',
    groups: [
      {
        id: 'group-201',
        name: 'Grupo',
        cards: [
          { id: 'card-2001', name: 'Tarjeta' },
          { id: 'card-2002', name: 'Tarjeta' },
        ],
      },
    ],
  },
];

function App() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement>>({});

  // Refs que se sincronizan con el estado para usar en callbacks con dependencias []
  const selectedCardRef = useRef<SelectedCard | null>(null);
  const connectionsRef = useRef<Connection[]>([]);
  const columnsRef = useRef<Column[]>(initialColumns);

  // Sincronizar refs con estado
  selectedCardRef.current = selectedCard;
  connectionsRef.current = connections;
  columnsRef.current = columns;

  // --- Handlers de creacion ---

  const handleCreateGroup = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          groups: [...col.groups, { id: generateId(), name: 'Grupo', cards: [] }],
        };
      })
    );
    setSelectedCard(null);
  }, []);

  const handleCreateCard = useCallback((columnId: string, groupId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== columnId) return col;
        return {
          ...col,
          groups: col.groups.map((group) => {
            if (group.id !== groupId) return group;
            return {
              ...group,
              cards: [...group.cards, { id: generateId(), name: 'Tarjeta' }],
            };
          }),
        };
      })
    );
    setSelectedCard(null);
  }, []);

  // --- Handlers de renombrado ---

  const handleRenameCard = useCallback((cardId: string, newName: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        groups: col.groups.map((group) => ({
          ...group,
          cards: group.cards.map((card) =>
            card.id === cardId ? { ...card, name: newName } : card
          ),
        })),
      }))
    );
  }, []);

  const handleRenameGroup = useCallback((groupId: string, newName: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        groups: col.groups.map((group) =>
          group.id === groupId ? { ...group, name: newName } : group
        ),
      }))
    );
  }, []);

  // --- Handler de eliminacion de tarjeta ---

  const handleDeleteCard = useCallback((cardId: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        groups: col.groups.map((group) => ({
          ...group,
          cards: group.cards.filter((card) => card.id !== cardId),
        })),
      }))
    );
    setConnections((prev) =>
      prev.filter((c) => c.fromCardId !== cardId && c.toCardId !== cardId)
    );
    setSelectedCard((prev) => (prev?.cardId === cardId ? null : prev));
  }, []);

  // --- Handler de eliminacion de grupo ---

  const handleDeleteGroup = useCallback((groupId: string) => {
    // Encontrar las tarjetas del grupo para limpiar conexiones
    const cardIds = new Set<string>();
    for (const col of columnsRef.current) {
      for (const group of col.groups) {
        if (group.id === groupId) {
          for (const card of group.cards) {
            cardIds.add(card.id);
          }
        }
      }
    }

    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        groups: col.groups.filter((group) => group.id !== groupId),
      }))
    );

    setConnections((prev) =>
      prev.filter((c) => !cardIds.has(c.fromCardId) && !cardIds.has(c.toCardId))
    );

    setSelectedCard((prev) => {
      if (prev && cardIds.has(prev.cardId)) return null;
      return prev;
    });
  }, []);

  // --- Handler de conexiones ---

  const handleCardClick = useCallback(
    (cardId: string, columnId: string) => {
      const selected = selectedCardRef.current;
      const conns = connectionsRef.current;

      if (selected === null) {
        setSelectedCard({ cardId, columnId });
        return;
      }

      if (selected.cardId === cardId) {
        setSelectedCard(null);
        return;
      }

      if (selected.columnId === columnId) {
        setSelectedCard({ cardId, columnId });
        return;
      }

      const alreadyExists = conns.some(
        (c) =>
          (c.fromCardId === selected.cardId && c.toCardId === cardId) ||
          (c.fromCardId === cardId && c.toCardId === selected.cardId)
      );

      if (!alreadyExists) {
        setConnections((prev) => [
          ...prev,
          { fromCardId: selected.cardId, toCardId: cardId },
        ]);
      }

      setSelectedCard(null);
    },
    []
  );

  const handleDeleteConnection = useCallback((fromCardId: string, toCardId: string) => {
    setConnections((prev) =>
      prev.filter(
        (c) =>
          !(c.fromCardId === fromCardId && c.toCardId === toCardId) &&
          !(c.fromCardId === toCardId && c.toCardId === fromCardId)
      )
    );
  }, []);

  return (
    <div className="app">
      <Columna
        groups={columns[0].groups}
        selectedCard={selectedCard}
        cardRefs={cardRefs}
        onCreateGroup={() => handleCreateGroup(columns[0].id)}
        onCreateCard={(groupId) => handleCreateCard(columns[0].id, groupId)}
        onCardClick={(cardId) => handleCardClick(cardId, columns[0].id)}
        onRenameCard={handleRenameCard}
        onRenameGroup={handleRenameGroup}
        onDeleteCard={handleDeleteCard}
        onDeleteGroup={handleDeleteGroup}
      />

      <div className="middle-area" />

      <Columna
        groups={columns[1].groups}
        selectedCard={selectedCard}
        cardRefs={cardRefs}
        onCreateGroup={() => handleCreateGroup(columns[1].id)}
        onCreateCard={(groupId) => handleCreateCard(columns[1].id, groupId)}
        onCardClick={(cardId) => handleCardClick(cardId, columns[1].id)}
        onRenameCard={handleRenameCard}
        onRenameGroup={handleRenameGroup}
        onDeleteCard={handleDeleteCard}
        onDeleteGroup={handleDeleteGroup}
      />

      <Lineas
        connections={connections}
        cardRefs={cardRefs}
        columns={columns}
        onDeleteConnection={handleDeleteConnection}
      />
    </div>
  );
}

export default App;
