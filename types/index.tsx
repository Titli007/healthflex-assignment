export interface Timer {
    id: string;
    name: string;
    duration: number;
    category: string;
    halfwayAlert: boolean;
    status: 'Running' | 'Paused' | 'Completed';
    remainingTime: number;
    intervalId: NodeJS.Timeout | null;
    createdAt: string;
    completedAt?: string;
  }
  
  export interface HistoryItem {
    id: string;
    timerId: string;
    name: string;
    category: string;
    duration: number;
    completedAt: string;
  }
  
  export interface TimerContextType {
    timers: Timer[];
    history: HistoryItem[];
    loading: boolean;
    addTimer: (timer: Omit<Timer, 'id' | 'status' | 'remainingTime' | 'intervalId'>) => void;
    startTimer: (id: string) => void;
    pauseTimer: (id: string) => void;
    resetTimer: (id: string) => void;
    deleteTimer: (id: string) => void;
    startCategoryTimers: (category: string) => void;
    pauseCategoryTimers: (category: string) => void;
    resetCategoryTimers: (category: string) => void;
    exportTimerData: () => Promise<string | null>;
  }
  
  export interface TimerItemProps {
    timer: Timer;
  }
  
  export interface CategoryGroupProps {
    category: string;
    timers: Timer[];
  }
  
  export interface ProgressBarProps {
    progress: number;
  }
  
  export interface CompletionModalProps {
    visible: boolean;
    timer: Timer | null;
    onClose: () => void;
  }
  