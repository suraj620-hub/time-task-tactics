
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from '@/types/task';
import { CheckCircle, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskHistoryProps {
  tasks: Task[];
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ tasks }) => {
  // Only show completed tasks in the history
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Group tasks by date
  const groupedTasks: Record<string, Task[]> = {};
  
  completedTasks.forEach(task => {
    const date = new Date(task.completedAt || task.createdAt);
    const dateString = date.toLocaleDateString();
    
    if (!groupedTasks[dateString]) {
      groupedTasks[dateString] = [];
    }
    
    groupedTasks[dateString].push(task);
  });

  // Function to format duration nicely
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <CheckCircle className="h-5 w-5 text-timer-green" />
          Task History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(groupedTasks).length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            {Object.entries(groupedTasks).map(([date, tasks]) => (
              <div key={date} className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{date}</h3>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="p-3 bg-gray-50 rounded-md border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{task.name}</div>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Completed
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(task.totalDuration)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No completed tasks yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskHistory;
