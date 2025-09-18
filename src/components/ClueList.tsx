import React from 'react';
import { CrosswordClue } from '@/data/samplePuzzle';

interface ClueListProps {
  clues: CrosswordClue[];
  activeClue: CrosswordClue | null;
  onClueClick: (clue: CrosswordClue) => void;
  direction: 'across' | 'down';
}

export const ClueList: React.FC<ClueListProps> = ({
  clues,
  activeClue,
  onClueClick,
  direction,
}) => {
  const filteredClues = clues
    .filter((clue) => clue.direction === direction)
    .sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-1">
      <h3 className="font-heading text-lg font-semibold capitalize mb-3 text-foreground">
        {direction}
      </h3>
      <div className="space-y-0">
        {filteredClues.map((clue) => (
          <div
            key={`${clue.direction}-${clue.number}`}
            className={`clue-item px-3 py-2 rounded cursor-pointer ${
              activeClue?.number === clue.number &&
              activeClue?.direction === clue.direction
                ? 'active'
                : ''
            }`}
            onClick={() => onClueClick(clue)}
          >
            <div className="flex items-start gap-2">
              <span className="font-semibold text-primary min-w-[2rem]">
                {clue.number}
              </span>
              <span className="text-sm leading-5 text-foreground">
                {clue.clue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};