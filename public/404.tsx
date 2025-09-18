import React, { useState, useCallback, useEffect } from 'react';
import { CrosswordGrid } from './CrosswordGrid';
import { ClueList } from './ClueList';
import { GameTimer } from './GameTimer';
import { CrosswordPuzzle, CrosswordClue, generateDailyPuzzle } from '@/data/samplePuzzle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RotateCcw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CrosswordGame: React.FC = () => {
  const [puzzle] = useState<CrosswordPuzzle>(generateDailyPuzzle());
  const [userAnswers, setUserAnswers] = useState<string[][]>(() =>
    Array(puzzle.size).fill(null).map(() => Array(puzzle.size).fill(''))
  );
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const [activeClue, setActiveClue] = useState<CrosswordClue | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const getClueForCell = useCallback((row: number, col: number, direction: 'across' | 'down'): CrosswordClue | null => {
    return puzzle.clues.find(clue => {
      if (clue.direction !== direction) return false;
      
      if (direction === 'across') {
        return clue.startRow === row && col >= clue.startCol && col < clue.startCol + clue.answer.length;
      } else {
        return clue.startCol === col && row >= clue.startRow && row < clue.startRow + clue.answer.length;
      }
    }) || null;
  }, [puzzle.clues]);

  const getHighlightedCells = useCallback((clue: CrosswordClue | null): { row: number; col: number }[] => {
    if (!clue) return [];
    
    const cells = [];
    for (let i = 0; i < clue.answer.length; i++) {
      if (clue.direction === 'across') {
        cells.push({ row: clue.startRow, col: clue.startCol + i });
      } else {
        cells.push({ row: clue.startRow + i, col: clue.startCol });
      }
    }
    return cells;
  }, []);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!isGameStarted) setIsGameStarted(true);

    // If clicking the same cell, toggle direction
    if (selectedCell?.row === row && selectedCell?.col === col) {
      const newDirection = currentDirection === 'across' ? 'down' : 'across';
      setCurrentDirection(newDirection);
      const newClue = getClueForCell(row, col, newDirection);
      setActiveClue(newClue);
    } else {
      setSelectedCell({ row, col });
      // Find clue for current direction, fallback to other direction
      let clue = getClueForCell(row, col, currentDirection);
      if (!clue) {
        const fallbackDirection = currentDirection === 'across' ? 'down' : 'across';
        clue = getClueForCell(row, col, fallbackDirection);
        if (clue) {
          setCurrentDirection(fallbackDirection);
        }
      }
      setActiveClue(clue);
    }
  }, [selectedCell, currentDirection, getClueForCell, isGameStarted]);

  const handleCellInput = useCallback((row: number, col: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[row][col] = value;
    setUserAnswers(newAnswers);

    // Move to next cell if value entered
    if (value && activeClue) {
      const cells = getHighlightedCells(activeClue);
      const currentIndex = cells.findIndex(cell => cell.row === row && cell.col === col);
      
      if (currentIndex >= 0 && currentIndex < cells.length - 1) {
        const nextCell = cells[currentIndex + 1];
        setSelectedCell(nextCell);
      }
    }
  }, [userAnswers, activeClue, getHighlightedCells]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!selectedCell || !activeClue) return;

    const cells = getHighlightedCells(activeClue);
    const currentIndex = cells.findIndex(cell => 
      cell.row === selectedCell.row && cell.col === selectedCell.col
    );

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndex > 0) {
          setSelectedCell(cells[currentIndex - 1]);
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndex < cells.length - 1) {
          setSelectedCell(cells[currentIndex + 1]);
        }
        break;
      case 'Backspace':
        event.preventDefault();
        if (userAnswers[selectedCell.row][selectedCell.col]) {
          handleCellInput(selectedCell.row, selectedCell.col, '');
        } else if (currentIndex > 0) {
          const prevCell = cells[currentIndex - 1];
          setSelectedCell(prevCell);
          handleCellInput(prevCell.row, prevCell.col, '');
        }
        break;
      case 'Delete':
        event.preventDefault();
        handleCellInput(selectedCell.row, selectedCell.col, '');
        break;
      case 'Tab':
        event.preventDefault();
        // Move to next clue
        const currentClueIndex = puzzle.clues.findIndex(clue => 
          clue.number === activeClue.number && clue.direction === activeClue.direction
        );
        const nextClueIndex = (currentClueIndex + 1) % puzzle.clues.length;
        const nextClue = puzzle.clues[nextClueIndex];
        setActiveClue(nextClue);
        setSelectedCell({ row: nextClue.startRow, col: nextClue.startCol });
        setCurrentDirection(nextClue.direction);
        break;
    }
  }, [selectedCell, activeClue, getHighlightedCells, userAnswers, handleCellInput, puzzle.clues]);

  const handleClueClick = useCallback((clue: CrosswordClue) => {
    setActiveClue(clue);
    setSelectedCell({ row: clue.startRow, col: clue.startCol });
    setCurrentDirection(clue.direction);
    if (!isGameStarted) setIsGameStarted(true);
  }, [isGameStarted]);

  const resetGame = useCallback(() => {
    setUserAnswers(Array(puzzle.size).fill(null).map(() => Array(puzzle.size).fill('')));
    setSelectedCell(null);
    setActiveClue(null);
    setIsGameStarted(false);
    setIsCompleted(false);
  }, [puzzle.size]);

  const checkCompletion = useCallback(() => {
    return puzzle.clues.every(clue => {
      for (let i = 0; i < clue.answer.length; i++) {
        const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
        if (userAnswers[row][col] !== clue.answer[i]) {
          return false;
        }
      }
      return true;
    });
  }, [puzzle.clues, userAnswers]);

  useEffect(() => {
    if (isGameStarted && checkCompletion()) {
      setIsCompleted(true);
      toast({
        title: "Congratulations!",
        description: "You've completed the crossword puzzle!",
      });
    }
  }, [userAnswers, isGameStarted, checkCompletion, toast]);

  const highlightedCells = getHighlightedCells(activeClue);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                {puzzle.title}
              </h1>
              <p className="text-muted-foreground">
                By {puzzle.author} • {puzzle.date}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <GameTimer isRunning={isGameStarted && !isCompleted} />
              <Button
                variant="outline"
                size="sm"
                onClick={resetGame}
                className="gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Crossword Grid */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <CrosswordGrid
                  puzzle={puzzle}
                  userAnswers={userAnswers}
                  selectedCell={selectedCell}
                  highlightedCells={highlightedCells}
                  onCellClick={handleCellClick}
                  onCellInput={handleCellInput}
                  onKeyDown={handleKeyDown}
                />
              </CardContent>
            </Card>
          </div>

          {/* Clues */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check size={20} />
                  Clues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ClueList
                  clues={puzzle.clues}
                  activeClue={activeClue}
                  onClueClick={handleClueClick}
                  direction="across"
                />
                <Separator />
                <ClueList
                  clues={puzzle.clues}
                  activeClue={activeClue}
                  onClueClick={handleClueClick}
                  direction="down"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
