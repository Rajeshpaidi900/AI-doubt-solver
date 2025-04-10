interface LoadingStateProps {
  currentQuestion: string;
}

export default function LoadingState({ currentQuestion }: LoadingStateProps) {
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="mb-4">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="ri-user-line text-primary-600 dark:text-primary-400"></i>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-3 px-4 max-w-full">
            <p className="text-gray-800 dark:text-gray-200">{currentQuestion}</p>
          </div>
        </div>
      </div>

      <div className="ml-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="ri-robot-line text-green-600 dark:text-green-400"></i>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 w-full shadow-sm flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 dark:border-primary-400 mr-3"></div>
            <p className="text-gray-600 dark:text-gray-300">Generating answer...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
