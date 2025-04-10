import { useState, useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { SessionQuestion } from '@shared/schema';
import { addToHistory, loadHistory, clearHistory as clearLocalHistory } from '../lib/history';
import { useToast } from '@/hooks/use-toast';

export function useQuestion() {
  const [history, setHistory] = useState<SessionQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load history from localStorage on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Query for selected question details if needed
  const { data: selectedQuestion } = useQuery({
    queryKey: selectedQuestionId ? [`/api/questions/${selectedQuestionId}`] : ['skip-query'],
    enabled: !!selectedQuestionId,
  });

  // Ask new question mutation
  const askQuestion = useMutation({
    mutationFn: async (question: string) => {
      const res = await apiRequest('POST', '/api/questions', { question });
      return await res.json() as SessionQuestion;
    },
    onSuccess: (data) => {
      // Ensure createdAt is a string
      const sessionQuestion: SessionQuestion = {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
      };
      
      // Add to history and update state
      const updatedHistory = addToHistory(sessionQuestion);
      setHistory(updatedHistory);
      setSelectedQuestionId(sessionQuestion.id);
      
      // Invalidate query if needed
      queryClient.invalidateQueries({ queryKey: [`/api/questions/${sessionQuestion.id}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to ask question",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Regenerate answer mutation
  const regenerateAnswer = useMutation({
    mutationFn: async (questionId: number) => {
      const res = await apiRequest('POST', `/api/questions/${questionId}/regenerate`, {});
      return await res.json() as SessionQuestion;
    },
    onSuccess: (data) => {
      // Ensure createdAt is a string
      const sessionQuestion: SessionQuestion = {
        ...data,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString()
      };
      
      // Update history
      const updatedHistory = addToHistory(sessionQuestion);
      setHistory(updatedHistory);
      
      // Invalidate query if needed
      queryClient.invalidateQueries({ queryKey: [`/api/questions/${sessionQuestion.id}`] });
      
      toast({
        title: "Answer regenerated",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to regenerate answer",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Clear history
  const clearHistory = useCallback(() => {
    const clearedHistory = clearLocalHistory();
    setHistory(clearedHistory);
    setSelectedQuestionId(null);
    
    toast({
      title: "History cleared",
      duration: 2000,
    });
  }, [toast]);

  // Handle history item click
  const handleHistoryItemClick = useCallback((questionId: number) => {
    setSelectedQuestionId(questionId);
  }, []);

  // Toggle mobile history modal
  const toggleMobileHistory = useCallback(() => {
    setIsMobileHistoryOpen(prev => !prev);
  }, []);

  return {
    history,
    selectedQuestionId,
    selectedQuestion: selectedQuestion as SessionQuestion | undefined,
    isMobileHistoryOpen,
    isAsking: askQuestion.isPending,
    isRegenerating: regenerateAnswer.isPending,
    askQuestion: askQuestion.mutate,
    regenerateAnswer: regenerateAnswer.mutate,
    clearHistory,
    handleHistoryItemClick,
    toggleMobileHistory,
    closeMobileHistory: () => setIsMobileHistoryOpen(false),
  };
}
