import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: SessionQuestion[];
  onHistoryItemClick: (questionId: number) => void;
  onClearHistory: () => void;
  selectedQuestionId: number | null;
}

export default function MobileHistoryModal({
  isOpen,
  onClose,
  history,
  onHistoryItemClick,
  onClearHistory,
  selectedQuestionId
}: MobileHistoryModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const handleHistoryItemClick = (questionId: number) => {
    onHistoryItemClick(questionId);
    onClose();
  };
  
  const handleClearHistory = () => {
    onClearHistory();
    setIsConfirmOpen(false);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-left">Question History</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4">
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
                onClick={() => handleHistoryItemClick(item.id)}
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
      </SheetContent>
    </Sheet>
  );
}
