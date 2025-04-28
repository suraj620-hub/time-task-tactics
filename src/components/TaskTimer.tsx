
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

  // Effect to handle timer start/stop
  useEffect(() => {
    if (isRunning) {
      // Clear any existing timer before creating a new one
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
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

    // Cleanup on unmount or when isRunning changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, onTaskComplete, task, toast]);

  // This effect syncs the timeRemaining with the parent component
  useEffect(() => {
    // Only update if the timer isn't running to avoid unnecessary updates
    if (!isRunning && task.timeRemaining !== timeRemaining) {
      const updatedTask = {
        ...task,
        timeRemaining
      };
      onTaskUpdate(updatedTask);
    }
  }, [timeRemaining, onTaskUpdate, task, isRunning]);

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
    <Card className="task-card w-full max-w-md mx-auto transform transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-lg">
        <CardTitle className="flex items-center justify-center space-x-2 text-xl text-gray-800">
          <Clock className="w-5 h-5 text-indigo-600" />
          <span>{task.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 py-6">
        <div className="relative w-48 h-48 mx-auto rounded-full border-4 border-indigo-100 flex items-center justify-center animate-pulse-light">
          {/* Circular progress indicator with improved styling */}
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
              stroke={timeRemaining > 0 ? "#4f46e5" : "#10b981"} 
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 92}
              strokeDashoffset={2 * Math.PI * 92 * (1 - progressPercentage / 100)}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="text-center z-10 transform transition-all duration-300 hover:scale-105">
            <div className="text-3xl font-bold text-indigo-700">{formatTime(timeRemaining)}</div>
            <div className="text-sm text-indigo-500 font-medium">remaining</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full transition-all duration-300 ease-linear"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundImage: timeRemaining > 0 ? 
                'linear-gradient(to right, #4f46e5, #818cf8)' : 
                'linear-gradient(to right, #10b981, #34d399)'
            }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-3">
        {!isRunning ? (
          <Button 
            onClick={handleStart} 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
            disabled={timeRemaining === 0}
          >
            <Play className="w-4 h-4 mr-1" /> Start
          </Button>
        ) : (
          <Button 
            onClick={handlePause} 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
          >
            <Pause className="w-4 h-4 mr-1" /> Pause
          </Button>
        )}
        <Button 
          onClick={handleReset} 
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
          disabled={timeRemaining === task.totalDuration}
        >
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
        <Button 
          onClick={() => {
            setIsRunning(false);
            const completedTask = {
              ...task,
              timeRemaining: 0,
              status: 'completed' as const,
              completedAt: new Date().toISOString()
            };
            onTaskComplete(completedTask);
          }}
          className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
          disabled={task.status === 'completed'}
        >
          <CheckCircle className="w-4 h-4 mr-1" /> Complete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskTimer;
