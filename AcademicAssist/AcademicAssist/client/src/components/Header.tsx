import { useState, useEffect } from "react";
import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onToggleMobileHistory: () => void;
}

export default function Header({ onToggleMobileHistory }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if dark mode preference is stored in localStorage
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Store preference in localStorage
    localStorage.setItem("darkMode", String(newDarkMode));
    
    // Toggle dark class on html element
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    toast({
      title: newDarkMode ? "Dark mode enabled" : "Light mode enabled",
      duration: 1500,
    });
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <i className="ri-chat-3-line text-primary-600 text-2xl mr-2"></i>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">DoubtSolver</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="sm:hidden"
          onClick={onToggleMobileHistory}
        >
          <i className="ri-history-line text-xl text-gray-500 dark:text-gray-300"></i>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="hidden sm:flex items-center gap-1"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? (
            <>
              <SunMedium className="h-4 w-4 mr-1" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-1" />
              Dark Mode
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
