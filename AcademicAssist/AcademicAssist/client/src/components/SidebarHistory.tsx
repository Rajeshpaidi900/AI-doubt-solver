import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SessionQuestion } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SidebarHistoryProps {
  history: SessionQuestion[];
  onHistoryItemClick: (questionId: number) => void;
  onClearHistory: () => void;
  selectedQuestionId: number | null;
}

export default function SidebarHistory({ 
  history, 
  onHistoryItemClick, 
  onClearHistory,
  selectedQuestionId
}: SidebarHistoryProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const handleClearHistory = () => {
    onClearHistory();
    setIsConfirmOpen(false);
  };
  
  return (
    <aside className="hidden sm:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Question History</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {history.length === 0 ? (
          <div className="text-center p-4 text-gray-500 dark:text-gray-400">
            <p>No history yet</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 ${
                selectedQuestionId === item.id 
                  ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800' 
                  : ''
              }`}
              onClick={() => onHistoryItemClick(item.id)}
            >
              <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{item.question}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </p>
            </button>
          ))
        )}
      </div>
      {history.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive"
                className="w-full flex items-center justify-center"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear history?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your question history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  Yes, clear history
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </aside>
  );
}
