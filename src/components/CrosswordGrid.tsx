import React, { useEffect, useRef } from 'react';
import { CrosswordPuzzle } from '@/data/samplePuzzle';

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  userAnswers: string[][];
  selectedCell: { row: number; col: number } | null;
  highlightedCells: { row: number; col: number }[];
  onCellClick: (row: number, col: number) => void;
  onCellInput: (row: number, col: number, value: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

export const CrosswordGrid: React.FC<CrosswordGridProps> = ({
  puzzle,
  userAnswers,
  selectedCell,
  highlightedCells,
  onCellClick,
  onCellInput,
  onKeyDown,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.focus();
    }
  }, [selectedCell]);

  const getCellNumber = (row: number, col: number): number | null => {
    const clue = puzzle.clues.find(
      (c) => c.startRow === row && c.startCol === col
    );
    return clue ? clue.number : null;
  };

  const isBlackCell = (row: number, col: number): boolean => {
    return puzzle.grid[row][col] === '.';
  };

  const isSelected = (row: number, col: number): boolean => {
    return selectedCell?.row === row && selectedCell?.col === col;
  };

  const isHighlighted = (row: number, col: number): boolean => {
    return highlightedCells.some(cell => cell.row === row && cell.col === col);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={gridRef}
        className="crossword-grid"
        style={{
          gridTemplateColumns: `repeat(${puzzle.size}, 1fr)`,
          width: 'min(90vw, 600px)',
          height: 'min(90vw, 600px)',
        }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {puzzle.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const cellNumber = getCellNumber(rowIndex, colIndex);
            const isBlack = isBlackCell(rowIndex, colIndex);
            const selected = isSelected(rowIndex, colIndex);
            const highlighted = isHighlighted(rowIndex, colIndex);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`crossword-cell ${isBlack ? 'black' : ''} ${
                  selected ? 'selected' : ''
                } ${highlighted ? 'highlighted' : ''}`}
                onClick={() => !isBlack && onCellClick(rowIndex, colIndex)}
              >
                {!isBlack && (
                  <>
                    {cellNumber && (
                      <span className="crossword-number">{cellNumber}</span>
                    )}
                    <input
                      className="crossword-input"
                      type="text"
                      maxLength={1}
                      value={userAnswers[rowIndex][colIndex]}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (value === '' || /^[A-Z]$/.test(value)) {
                          onCellInput(rowIndex, colIndex, value);
                        }
                      }}
                      onFocus={() => onCellClick(rowIndex, colIndex)}
                      tabIndex={-1}
                    />
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};