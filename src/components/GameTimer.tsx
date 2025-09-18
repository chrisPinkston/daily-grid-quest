import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
}

export const GameTimer: React.FC<GameTimerProps> = ({ isRunning, onTimeUpdate }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock size={16} />
      <span className="font-mono text-sm font-medium">
        {formatTime(time)}
      </span>
    </div>
  );
};