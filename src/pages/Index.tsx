
import React, { useState, useEffect } from 'react';
import TaskForm from '@/components/TaskForm';
import TaskTimer from '@/components/TaskTimer';
import TaskHistory from '@/components/TaskHistory';
import { Task } from '@/types/task';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ListChecks, PlusSquare } from 'lucide-react';

const STORAGE_KEY = 'time-task-tactics-tasks';

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Load tasks from local storage
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    setActiveTask(newTask);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const handleTaskComplete = (completedTask: Task) => {
    const updatedTask: Task = {
      ...completedTask,
      status: 'completed',
      timeRemaining: 0,
      completedAt: new Date().toISOString()
    };
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    
    setActiveTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 bg-fixed">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 opacity-5 bg-study-pattern bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-2">
              Time Task Tactics
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Master your study time with focused task management and time tracking
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="create" className="flex items-center gap-1">
                    <PlusSquare className="h-4 w-4" />
                    Create Task
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1">
                    <ListChecks className="h-4 w-4" />
                    Task History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                  <TaskForm onTaskCreated={handleTaskCreated} />
                </TabsContent>
                <TabsContent value="history">
                  <TaskHistory tasks={tasks} />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-timer-blue" />
                Active Timer
              </h2>
              
              {activeTask ? (
                <TaskTimer 
                  task={activeTask} 
                  onTaskUpdate={handleTaskUpdate}
                  onTaskComplete={handleTaskComplete}
                />
              ) : (
                <div className="task-card flex flex-col items-center justify-center py-12 text-center">
                  <Clock className="h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-xl font-medium text-gray-700 mb-1">No Active Task</h3>
                  <p className="text-gray-500 mb-4">Create a new task or select an existing one to start the timer</p>
                </div>
              )}
              
              {tasks.filter(task => task.status === 'pending').length > 0 && !activeTask && (
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-3">Your Tasks</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(task => task.status === 'pending')
                      .map(task => (
                        <div 
                          key={task.id}
                          className="p-3 bg-white rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => setActiveTask(task)}
                        >
                          <div className="font-medium">{task.name}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.floor(task.totalDuration / 3600)}h {Math.floor((task.totalDuration % 3600) / 60)}m
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
