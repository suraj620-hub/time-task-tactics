
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from '@/types/task';
import { Clock, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface TaskTimerProps {
  task: Task;
  onTaskUpdate: (updatedTask: Task) => void;
  onTaskComplete: (task: Task) => void;
}

const TaskTimer: React.FC<TaskTimerProps> = ({ task, onTaskUpdate, onTaskComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(task.timeRemaining);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Start or stop the timer based on isRunning state
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            
            const completedTask = {
              ...task,
              timeRemaining: 0,
              status: 'completed' as const,
              completedAt: new Date().toISOString()
            };
            
            onTaskComplete(completedTask);
            
            toast({
              title: "Task Completed! 🎉",
              description: `Congratulations! You've completed "${task.name}"`,
              duration: 5000,
            });
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onTaskComplete, task, toast]);

  useEffect(() => {
    // Update the task whenever timeRemaining changes
    if (task.timeRemaining !== timeRemaining) {
      const updatedTask = {
        ...task,
        timeRemaining
      };
      onTaskUpdate(updatedTask);
    }
  }, [timeRemaining, onTaskUpdate, task]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(task.totalDuration);
  };

  // Calculate progress percentage
  const progressPercentage = ((task.totalDuration - timeRemaining) / task.totalDuration) * 100;

  return (
    <Card className="task-card w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2 text-xl">
          <Clock className="w-5 h-5 text-timer-blue" />
          <span>{task.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-gray-100 flex items-center justify-center">
          {/* Circular progress indicator */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="96" 
              cy="96" 
              r="92" 
              fill="none" 
              stroke="#edf2f7" 
              strokeWidth="8"
            />
            <circle 
              cx="96" 
              cy="96" 
              r="92" 
              fill="none" 
              stroke={timeRemaining > 0 ? "#3498db" : "#2ecc71"} 
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 92}
              strokeDashoffset={2 * Math.PI * 92 * (1 - progressPercentage / 100)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-center">
            <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
            <div className="text-sm text-gray-500">remaining</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full transition-all duration-300 ease-linear"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: timeRemaining > 0 ? '#3498db' : '#2ecc71'
            }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2">
        {!isRunning ? (
          <Button 
            onClick={handleStart} 
            className="bg-timer-green hover:bg-green-600 text-white"
            disabled={timeRemaining === 0}
          >
            <Play className="w-4 h-4 mr-1" /> Start
          </Button>
        ) : (
          <Button 
            onClick={handlePause} 
            className="bg-timer-yellow hover:bg-yellow-600 text-white"
          >
            <Pause className="w-4 h-4 mr-1" /> Pause
          </Button>
        )}
        <Button 
          onClick={handleReset} 
          className="bg-timer-blue hover:bg-blue-600"
          disabled={timeRemaining === task.totalDuration}
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
        <Button 
          onClick={() => {
            const completedTask = {
              ...task,
              timeRemaining: 0,
              status: 'completed' as const,
              completedAt: new Date().toISOString()
            };
            onTaskComplete(completedTask);
          }}
          className="bg-timer-red hover:bg-red-600"
          disabled={task.status === 'completed'}
        >
          <CheckCircle className="w-4 h-4 mr-1" /> Complete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskTimer;
