import { useState, useEffect, useCallback, MutableRefObject } from 'react';
import { Column, Connection } from '../types';

interface LineData {
  key: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromCardId: string;
  toCardId: string;
}

interface LineasProps {
  connections: Connection[];
  cardRefs: MutableRefObject<Record<string, HTMLDivElement>>;
  columns: Column[];
  onDeleteConnection: (fromCardId: string, toCardId: string) => void;
}

function Lineas({ connections, cardRefs, columns, onDeleteConnection }: LineasProps) {
  const [lines, setLines] = useState<LineData[]>([]);

  const updateLines = useCallback(() => {
    const newLines: LineData[] = [];

    for (const conn of connections) {
      const fromEl = cardRefs.current[conn.fromCardId];
      const toEl = cardRefs.current[conn.toCardId];
      if (!fromEl || !toEl) continue;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const leftRect = fromRect.left < toRect.left ? fromRect : toRect;
      const rightRect = fromRect.left < toRect.left ? toRect : fromRect;

      newLines.push({
        key: `${conn.fromCardId}-${conn.toCardId}`,
        x1: leftRect.right,
        y1: leftRect.top + leftRect.height / 2,
        x2: rightRect.left,
        y2: rightRect.top + rightRect.height / 2,
        fromCardId: conn.fromCardId,
        toCardId: conn.toCardId,
      });
    }

    setLines(newLines);
  }, [connections, cardRefs]);

  useEffect(() => {
    updateLines();

    window.addEventListener('scroll', updateLines, true);
    window.addEventListener('resize', updateLines);
    return () => {
      window.removeEventListener('scroll', updateLines, true);
      window.removeEventListener('resize', updateLines);
    };
  }, [updateLines, columns]);

  return (
    <svg className="lineas-svg">
      {lines.map((line) => {
        const midX = (line.x1 + line.x2) / 2;
        const midY = (line.y1 + line.y2) / 2;

        return (
          <g key={line.key}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className="linea"
            />
            <g
              className="linea-delete"
              onClick={() => onDeleteConnection(line.fromCardId, line.toCardId)}
            >
              <circle cx={midX} cy={midY} r={10} />
              <text x={midX} y={midY} textAnchor="middle" dominantBaseline="central">
                &times;
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export default Lineas;
