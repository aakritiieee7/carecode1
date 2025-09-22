import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Trash2, Loader2 } from "lucide-react";
import { useChatSessions, useSendMessage, useClearChatHistory } from "@/hooks/useApi";
import { ChatMessage } from "@/lib/api";
import { format } from "date-fns";
import { toast } from "sonner";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // API hooks
  const { data: chatData, isLoading, refetch } = useChatSessions();
  const sendMessage = useSendMessage();
  const clearHistory = useClearChatHistory();
  
  // Get the current session and messages
  const currentSession = chatData?.sessions?.[0];
  const messages = currentSession?.messages || [];
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sendMessage.isPending) return;

    const messageText = newMessage;
    setNewMessage(""); // Clear input immediately for better UX

    try {
      await sendMessage.mutateAsync({ text: messageText });
    } catch (error) {
      // Error handling is done by the mutation hook
      setNewMessage(messageText); // Restore message on error
    }
  };
  
  const handleClearHistory = async () => {
    try {
      await clearHistory.mutateAsync();
      toast.success("Chat history cleared successfully!");
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Show welcome message if no messages exist
  const showWelcomeMessage = messages.length === 0;
  const welcomeMessage = {
    id: 'welcome',
    text: "Hello! I'm your AI wellness assistant. I'm here to provide emotional support, suggest coping strategies, and help you with your mental health journey. How are you feeling today?",
    senderType: 'bot' as const,
    timestamp: new Date().toISOString()
  };

  return (
    <>
      {/* Chat Widget Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-primary shadow-soft animate-pulse-glow"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-96 z-40 shadow-wellness animate-slide-up">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-calm text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">AI Support Assistant</h3>
                  <p className="text-xs opacity-80">Your mental health companion</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearHistory}
                  disabled={clearHistory.isPending || messages.length === 0}
                  className="text-white hover:bg-white/20"
                  title="Clear chat history"
                >
                  {clearHistory.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-calm" />
                      <p className="text-sm text-muted-foreground">Loading your conversations...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Welcome message if no chat history */}
                    {showWelcomeMessage && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] p-3 rounded-lg bg-muted">
                          <div className="flex items-start gap-2">
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-calm" />
                            <div>
                              <p className="text-sm text-muted-foreground">{welcomeMessage.text}</p>
                              <p className="text-xs text-muted-foreground/60 mt-1">
                                {format(new Date(welcomeMessage.timestamp), 'HH:mm')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Chat messages */}
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderType === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-lg ${
                            message.senderType === "user"
                              ? "bg-wellness text-white"
                              : "bg-muted"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.senderType === "bot" && (
                              <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-calm" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm whitespace-pre-wrap ${
                                message.senderType === "user" 
                                  ? "text-white" 
                                  : "text-muted-foreground"
                              }`}>
                                {message.text}
                              </p>
                              <p className={`text-xs mt-1 ${
                                message.senderType === "user" 
                                  ? "text-white/60" 
                                  : "text-muted-foreground/60"
                              }`}>
                                {format(new Date(message.timestamp), 'HH:mm')}
                              </p>
                            </div>
                            {message.senderType === "user" && (
                              <User className="h-4 w-4 mt-0.5 flex-shrink-0 text-white/80" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Loading indicator for AI response */}
                    {sendMessage.isPending && (
                      <div className="flex justify-start">
                        <div className="max-w-[85%] p-3 rounded-lg bg-muted">
                          <div className="flex items-start gap-2">
                            <Bot className="h-4 w-4 mt-0.5 flex-shrink-0 text-calm" />
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <p className="text-sm text-muted-foreground">AI is thinking...</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={sendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}