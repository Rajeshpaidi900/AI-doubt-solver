import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import SidebarHistory from '@/components/SidebarHistory';
import MobileHistoryModal from '@/components/MobileHistoryModal';
import QuestionInput from '@/components/QuestionInput';
import QuestionAnswerPair from '@/components/QuestionAnswerPair';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import WelcomeMessage from '@/components/WelcomeMessage';
import EmptyState from '@/components/EmptyState';
import { useQuestion } from '@/hooks/use-question';

export default function Home() {
  const conversationRef = useRef<HTMLDivElement>(null);
  const {
    history,
    selectedQuestionId,
    isMobileHistoryOpen,
    isAsking,
    isRegenerating,
    askQuestion,
    regenerateAnswer,
    clearHistory,
    handleHistoryItemClick,
    toggleMobileHistory,
    closeMobileHistory,
  } = useQuestion();
  
  // Find currently displayed question (either the selected one or the first one in history)
  const currentQuestion = history.find(q => q.id === selectedQuestionId) || history[0];
  
  // Scroll to bottom when new question is added or answered
  useEffect(() => {
    if (conversationRef.current && (isAsking || isRegenerating)) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [isAsking, isRegenerating, history.length]);
  
  // Handle asking a new question
  const handleSubmitQuestion = (question: string) => {
    askQuestion(question);
  };
  
  // Handle retrying a failed question
  const handleRetry = () => {
    if (currentQuestion) {
      regenerateAnswer(currentQuestion.id);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header onToggleMobileHistory={toggleMobileHistory} />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Desktop) */}
        <SidebarHistory
          history={history}
          onHistoryItemClick={handleHistoryItemClick}
          onClearHistory={clearHistory}
          selectedQuestionId={selectedQuestionId}
        />
        
        {/* Mobile History Modal */}
        <MobileHistoryModal
          isOpen={isMobileHistoryOpen}
          onClose={closeMobileHistory}
          history={history}
          onHistoryItemClick={handleHistoryItemClick}
          onClearHistory={clearHistory}
          selectedQuestionId={selectedQuestionId}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
          {/* Questions and Answers Container */}
          <div 
            ref={conversationRef}
            className="flex-1 overflow-y-auto p-4 sm:p-6"
          >
            {/* Show welcome message if no history */}
            {history.length === 0 && !isAsking && (
              <>
                <WelcomeMessage />
                <EmptyState />
              </>
            )}
            
            {/* Loading State */}
            {isAsking && !currentQuestion && (
              <LoadingState currentQuestion={history.length > 0 ? history[0].question : ""} />
            )}
            
            {/* Current question/answer or history items */}
            {currentQuestion && (
              <QuestionAnswerPair
                qaItem={currentQuestion}
                onRegenerateAnswer={regenerateAnswer}
                isRegenerating={isRegenerating && currentQuestion.id === selectedQuestionId}
              />
            )}
            
            {/* Error State - if needed */}
            {currentQuestion && currentQuestion.error && (
              <ErrorState
                question={currentQuestion.question}
                errorMessage={currentQuestion.error}
                onRetry={handleRetry}
                isRetrying={isRegenerating && currentQuestion.id === selectedQuestionId}
              />
            )}
          </div>
          
          {/* Question Input */}
          <QuestionInput 
            onSubmit={handleSubmitQuestion}
            isLoading={isAsking}
          />
        </main>
      </div>
    </div>
  );
}
