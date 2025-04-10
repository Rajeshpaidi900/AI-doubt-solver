export default function WelcomeMessage() {
  return (
    <div className="max-w-3xl mx-auto mb-6">
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/30 rounded-lg p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-semibold text-primary-700 dark:text-primary-400 mb-2">Welcome to DoubtSolver!</h2>
        <p className="text-primary-600 dark:text-primary-500 mb-3">Ask any question and get answers powered by ChatGPT.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Ask anything</p>
            <p className="text-gray-500 dark:text-gray-400">From coding to science questions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Save history</p>
            <p className="text-gray-500 dark:text-gray-400">Return to previous questions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Smart responses</p>
            <p className="text-gray-500 dark:text-gray-400">Powered by ChatGPT</p>
          </div>
        </div>
      </div>
    </div>
  );
}
