import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Clipboard, RefreshCw } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { SessionQuestion } from '@shared/schema';

interface QuestionAnswerPairProps {
  qaItem: SessionQuestion;
  onRegenerateAnswer: (questionId: number) => void;
  isRegenerating: boolean;
}

export default function QuestionAnswerPair({ 
  qaItem, 
  onRegenerateAnswer,
  isRegenerating
}: QuestionAnswerPairProps) {
  const { toast } = useToast();
  const [isCopying, setIsCopying] = useState(false);
  
  const copyToClipboard = async () => {
    if (!qaItem.answer) return;
    
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(qaItem.answer);
      toast({
        title: "Copied to clipboard",
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };
  
  const handleRegenerate = () => {
    onRegenerateAnswer(qaItem.id);
  };
  
  const formattedTime = new Date(qaItem.createdAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  const formattedDate = format(new Date(qaItem.createdAt), 'PPP');
  const todayDate = format(new Date(), 'PPP');
  const dateDisplay = formattedDate === todayDate ? 'Today' : formattedDate;
  
  return (
    <div className="max-w-3xl mx-auto mb-6">
      {/* Question */}
      <div className="mb-4">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="ri-user-line text-primary-600 dark:text-primary-400"></i>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-3 px-4 max-w-full">
            <p className="text-gray-800 dark:text-gray-200">{qaItem.question}</p>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">{dateDisplay}, {formattedTime}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="ml-4 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
            <i className="ri-robot-line text-green-600 dark:text-green-400"></i>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-3 px-4 w-full shadow-sm">
            {qaItem.error ? (
              <div className="text-red-500 dark:text-red-400">
                <p>Error: {qaItem.error}</p>
              </div>
            ) : (
              <div className="prose dark:prose-invert prose-sm w-full max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {qaItem.answer || ""}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        {qaItem.answer && (
          <div className="flex ml-11 mt-2 space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={copyToClipboard}
              disabled={isCopying}
            >
              <Clipboard className="h-3 w-3 mr-1" />
              {isCopying ? "Copying..." : "Copy"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              onClick={handleRegenerate}
              disabled={isRegenerating}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
