
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
    
    // If the active task was updated, also update the active task reference
    if (activeTask && activeTask.id === updatedTask.id) {
      setActiveTask(updatedTask);
    }
  };

  const handleTaskComplete = (completedTask: Task) => {
    const updatedTask: Task = {
      ...completedTask,
      status: 'completed' as const,
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
    <div className="min-h-screen study-bg bg-fixed">
      {/* Semi-transparent overlay to improve text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 to-indigo-900/70 mix-blend-multiply pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-3 animate-fade-in drop-shadow-lg">
              Time Task Tactics
            </h1>
            <p className="text-lg text-blue-100 max-w-md mx-auto font-medium">
              Master your study time with focused task management and time tracking
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="animate-fade-in glass-effect rounded-xl p-6" style={{ animationDelay: "0.2s" }}>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4 shadow-md">
                  <TabsTrigger value="create" className="flex items-center gap-1 transition-all duration-300">
                    <PlusSquare className="h-4 w-4" />
                    Create Task
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-1 transition-all duration-300">
                    <ListChecks className="h-4 w-4" />
                    Task History
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="create" className="animate-scale-in">
                  <TaskForm onTaskCreated={handleTaskCreated} />
                </TabsContent>
                <TabsContent value="history" className="animate-scale-in">
                  <TaskHistory tasks={tasks} />
                </TabsContent>
              </Tabs>
            </div>
            
            <div className="flex flex-col animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white drop-shadow-md">
                <Clock className="h-5 w-5 text-blue-300" />
                Active Timer
              </h2>
              
              {activeTask ? (
                <TaskTimer 
                  task={activeTask} 
                  onTaskUpdate={handleTaskUpdate}
                  onTaskComplete={handleTaskComplete}
                />
              ) : (
                <div className="task-card flex flex-col items-center justify-center py-12 text-center glass-effect hover:shadow-xl transition-all duration-300 p-5 rounded-xl">
                  <Clock className="h-16 w-16 text-blue-300 mb-3 animate-pulse-light" />
                  <h3 className="text-xl font-medium text-gray-100 mb-1">No Active Task</h3>
                  <p className="text-blue-200 mb-4">Create a new task or select an existing one to start the timer</p>
                </div>
              )}
              
              {tasks.filter(task => task.status === 'pending').length > 0 && !activeTask && (
                <div className="mt-4 glass-effect p-4 rounded-xl">
                  <h3 className="text-md font-medium mb-3 text-white">Your Tasks</h3>
                  <div className="space-y-2">
                    {tasks
                      .filter(task => task.status === 'pending')
                      .map(task => (
                        <div 
                          key={task.id}
                          className="p-4 bg-white/20 backdrop-blur-sm rounded-md border border-white/30 hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-102"
                          onClick={() => setActiveTask(task)}
                        >
                          <div className="font-medium text-white">{task.name}</div>
                          <div className="text-sm text-blue-100 flex items-center mt-1">
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
