import { SessionQuestion, sessionQuestionSchema } from '@shared/schema';

const STORAGE_KEY = 'doubtsolver_history';

// Load history from localStorage
export function loadHistory(): SessionQuestion[] {
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEY);
    if (!storedHistory) return [];
    
    const parsedHistory = JSON.parse(storedHistory);
    
    if (!Array.isArray(parsedHistory)) return [];
    
    // Validate each item through the schema
    const validatedHistory = parsedHistory
      .map(item => {
        const result = sessionQuestionSchema.safeParse(item);
        return result.success ? result.data : null;
      })
      .filter((item): item is SessionQuestion => item !== null);
    
    return validatedHistory;
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

// Save history to localStorage
export function saveHistory(history: SessionQuestion[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

// Add a new question to history
export function addToHistory(question: SessionQuestion): SessionQuestion[] {
  const history = loadHistory();
  
  // Check if question with same ID already exists, if so, replace it
  const existingIndex = history.findIndex(item => item.id === question.id);
  
  if (existingIndex !== -1) {
    const updatedHistory = [...history];
    updatedHistory[existingIndex] = question;
    saveHistory(updatedHistory);
    return updatedHistory;
  } else {
    // Add new question at the beginning of the array
    const updatedHistory = [question, ...history];
    saveHistory(updatedHistory);
    return updatedHistory;
  }
}

// Clear all history
export function clearHistory(): SessionQuestion[] {
  saveHistory([]);
  return [];
}
