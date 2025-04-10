import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
  question: string;
  errorMessage: string;
  onRetry: () => void;
  isRetrying: boolean;
}

export default function ErrorState({ question, errorMessage, onRetry, isRetrying }: ErrorStateProps) {
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="mb-4">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="ri-user-line text-primary-600 dark:text-primary-400"></i>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-3 px-4 max-w-full">
            <p className="text-gray-800 dark:text-gray-200">{question}</p>
          </div>
        </div>
      </div>

      <div className="ml-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="ri-error-warning-line text-red-600 dark:text-red-400"></i>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg py-3 px-4 w-full shadow-sm">
            <p className="text-red-600 dark:text-red-400 mb-2">Sorry, we encountered an error while generating your answer.</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{errorMessage}</p>
            <Button 
              variant="secondary"
              size="sm"
              className="mt-2 border border-red-300 dark:border-red-800/50 text-red-600 dark:text-red-400"
              onClick={onRetry}
              disabled={isRetrying}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? "Retrying..." : "Retry"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
