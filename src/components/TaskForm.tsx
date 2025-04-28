
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from '@/types/task';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
  const [taskName, setTaskName] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!taskName) {
      alert('Please enter a task name');
      return;
    }

    // Convert hours and minutes to seconds
    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    
    if (hoursNum === 0 && minutesNum === 0) {
      alert('Please specify a duration for the task');
      return;
    }

    const totalSeconds = (hoursNum * 60 * 60) + (minutesNum * 60);
    
    const newTask: Task = {
      id: Date.now().toString(),
      name: taskName,
      totalDuration: totalSeconds,
      timeRemaining: totalSeconds,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onTaskCreated(newTask);
    
    // Reset form
    setTaskName('');
    setHours('');
    setMinutes('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Create New Task</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input 
              id="taskName" 
              placeholder="e.g., Study Biology" 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="focus:ring-2 focus:ring-timer-blue"
            />
          </div>
          <div className="flex space-x-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="hours">Hours</Label>
              <Input 
                id="hours" 
                type="number" 
                placeholder="0" 
                min="0" 
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="focus:ring-2 focus:ring-timer-blue"
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="minutes">Minutes</Label>
              <Input 
                id="minutes" 
                type="number" 
                placeholder="0" 
                min="0" 
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="focus:ring-2 focus:ring-timer-blue"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-timer-blue hover:bg-blue-600 transition-colors"
          >
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskForm;
