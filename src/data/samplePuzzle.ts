export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startRow: number;
  startCol: number;
}

export interface CrosswordPuzzle {
  title: string;
  author: string;
  date: string;
  size: number;
  grid: string[][];
  clues: CrosswordClue[];
}

export const samplePuzzle: CrosswordPuzzle = {
  title: "Daily Crossword",
  author: "Crossword Creator",
  date: new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  size: 15,
  grid: [
    ['C', 'A', 'T', '.', 'H', 'A', 'T', '.', 'S', 'U', 'N', '.', 'D', 'O', 'G'],
    ['A', 'R', 'E', '.', 'O', 'R', 'E', '.', 'H', 'U', 'E', '.', 'A', 'Y', 'E'],
    ['R', 'E', 'D', '.', 'U', 'S', 'E', '.', 'E', 'L', 'F', '.', 'R', 'E', 'D'],
    ['.', '.', '.', '.', 'S', '.', '.', '.', '.', '.', '.', '.', 'E', '.', '.'],
    ['B', 'A', 'T', 'H', 'E', 'D', '.', 'A', 'R', 'T', '.', 'F', 'A', 'R', 'M'],
    ['O', 'A', 'R', 'S', '.', 'O', 'W', 'E', '.', 'H', 'I', 'P', '.', 'I', 'N'],
    ['A', 'T', 'E', '.', '.', 'N', '.', 'A', '.', 'E', '.', 'S', '.', 'C', 'E'],
    ['T', 'E', 'N', '.', 'F', 'E', 'A', 'R', 'S', '.', 'H', 'I', 'M', '.', '.'],
    ['.', '.', '.', '.', 'I', '.', 'M', '.', 'H', '.', 'E', '.', 'A', 'G', 'E'],
    ['S', 'U', 'M', '.', 'R', 'E', 'D', '.', 'O', 'W', 'L', 'S', '.', 'O', 'N'],
    ['H', 'U', 'E', '.', 'A', '.', '.', '.', 'U', '.', '.', 'E', 'A', 'R', 'S'],
    ['E', 'L', 'M', '.', 'R', 'U', 'N', '.', 'S', 'E', 'A', '.', 'T', 'A', 'R'],
    ['.', '.', '.', '.', '.', '.', '.', '.', 'E', '.', '.', '.', '.', '.', '.'],
    ['D', 'O', 'G', '.', 'E', 'Y', 'E', '.', 'S', 'U', 'N', '.', 'H', 'A', 'T'],
    ['A', 'Y', 'E', '.', 'R', 'E', 'D', '.', 'H', 'U', 'E', '.', 'O', 'R', 'E']
  ],
  clues: [
    // Across
    { number: 1, clue: "Feline pet", answer: "CAT", direction: "across", startRow: 0, startCol: 0 },
    { number: 5, clue: "Head covering", answer: "HAT", direction: "across", startRow: 0, startCol: 4 },
    { number: 8, clue: "Solar body", answer: "SUN", direction: "across", startRow: 0, startCol: 8 },
    { number: 11, clue: "Canine pet", answer: "DOG", direction: "across", startRow: 0, startCol: 12 },
    { number: 12, clue: "Exist", answer: "ARE", direction: "across", startRow: 1, startCol: 0 },
    { number: 13, clue: "Mineral", answer: "ORE", direction: "across", startRow: 1, startCol: 4 },
    { number: 14, clue: "Color", answer: "HUE", direction: "across", startRow: 1, startCol: 8 },
    { number: 15, clue: "Yes", answer: "AYE", direction: "across", startRow: 1, startCol: 12 },
    { number: 16, clue: "Color", answer: "RED", direction: "across", startRow: 2, startCol: 0 },
    { number: 17, clue: "Utilize", answer: "USE", direction: "across", startRow: 2, startCol: 4 },
    { number: 18, clue: "Christmas helper", answer: "ELF", direction: "across", startRow: 2, startCol: 8 },
    { number: 19, clue: "Color", answer: "RED", direction: "across", startRow: 2, startCol: 12 },

    // Down
    { number: 1, clue: "Automobile", answer: "CAR", direction: "down", startRow: 0, startCol: 0 },
    { number: 2, clue: "Every", answer: "ALL", direction: "down", startRow: 0, startCol: 1 },
    { number: 3, clue: "Beverage", answer: "TEA", direction: "down", startRow: 0, startCol: 2 },
    { number: 4, clue: "Home", answer: "HOUSE", direction: "down", startRow: 0, startCol: 4 },
    { number: 6, clue: "Large", answer: "HUGE", direction: "down", startRow: 0, startCol: 5 },
    { number: 7, clue: "Story", answer: "TALE", direction: "down", startRow: 0, startCol: 6 },
    { number: 9, clue: "Boat", answer: "SHIP", direction: "down", startRow: 0, startCol: 8 },
    { number: 10, clue: "Government", answer: "UNION", direction: "down", startRow: 0, startCol: 9 }
  ]
};

export const generateDailyPuzzle = (): CrosswordPuzzle => {
  // In a real app, this would fetch from an API or generate based on date
  return samplePuzzle;
};