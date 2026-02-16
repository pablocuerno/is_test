export interface Card {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  cards: Card[];
}

export interface Column {
  id: string;
  groups: Group[];
}

export interface Connection {
  fromCardId: string;
  toCardId: string;
}

export interface SelectedCard {
  cardId: string;
  columnId: string;
}
