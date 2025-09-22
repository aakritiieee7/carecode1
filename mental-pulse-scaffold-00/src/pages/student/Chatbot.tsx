import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Lightbulb, RefreshCw } from "lucide-react";
import { chatApi } from "@/lib/api";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "suggestion" | "normal";
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI wellness assistant. I'm here to provide support, listen to your concerns, and help you find resources for your mental health. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const suggestedQuestions = [
    "I'm feeling anxious about exams",
    "Can you help with stress management techniques?",
    "I'm having trouble sleeping",
    "How can I improve my mood?",
    "I need help with time management",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mutation for sending messages
  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => chatApi.sendMessage({ text }),
    onSuccess: (response) => {
      const { sessionId: newSessionId, userMessage, botMessage } = response.data;
      
      if (!sessionId) {
        setSessionId(newSessionId);
      }
      
      // Add both user and bot messages
      const formattedUserMessage: Message = {
        id: Date.now(),
        text: userMessage.text,
        sender: "user",
        timestamp: new Date(userMessage.timestamp),
      };
      
      const formattedBotMessage: Message = {
        id: Date.now() + 1,
        text: botMessage.text,
        sender: "bot",
        timestamp: new Date(botMessage.timestamp),
      };
      
      setMessages(prev => [...prev, formattedUserMessage, formattedBotMessage]);
      setIsTyping(false);
    },
    onError: (error: any) => {
      console.error('Chat error:', error);
      toast.error(error.response?.data?.error || 'Failed to send message');
      setIsTyping(false);
    },
  });

  const sendMessage = (messageText?: string) => {
    const textToSend = messageText || newMessage.trim();
    if (!textToSend || sendMessageMutation.isPending) return;

    setNewMessage("");
    setIsTyping(true);
    sendMessageMutation.mutate(textToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Mutation for clearing chat
  const clearChatMutation = useMutation({
    mutationFn: () => chatApi.clearHistory(sessionId || undefined),
    onSuccess: () => {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI wellness assistant. I'm here to provide support, listen to your concerns, and help you find resources for your mental health. How are you feeling today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setSessionId(null);
      toast.success('Chat history cleared');
    },
    onError: (error: any) => {
      console.error('Clear chat error:', error);
      toast.error('Failed to clear chat history');
    },
  });

  const clearChat = () => {
    clearChatMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-primary" />
          AI Wellness Assistant
        </h1>
        <p className="text-muted-foreground">
          Get instant support, guidance, and mental health resources through our AI-powered assistant
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col shadow-soft">
            <CardHeader className="flex-shrink-0 bg-gradient-calm text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Bot className="h-5 w-5" />
                  Wellness AI Assistant
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                    Online
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-white hover:bg-white/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg animate-slide-up ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.sender === "bot" && (
                        <Bot className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      {message.sender === "user" && (
                        <User className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-4 rounded-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <Bot className="h-5 w-5 text-primary" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t bg-muted/30">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message... (Press Enter to send)"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isTyping || sendMessageMutation.isPending}
                />
                <Button 
                  onClick={() => sendMessage()} 
                  disabled={isTyping || !newMessage.trim() || sendMessageMutation.isPending}
                  className="px-6"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Suggestions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Lightbulb className="h-5 w-5" />
                Quick Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                  onClick={() => sendMessage(question)}
                  disabled={isTyping || sendMessageMutation.isPending}
                >
                  {question}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Features */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-sm">Chat Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-wellness">
                <div className="w-2 h-2 bg-wellness rounded-full"></div>
                <span>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Confidential & Private</span>
              </div>
              <div className="flex items-center gap-2 text-accent">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Evidence-Based Support</span>
              </div>
              <div className="flex items-center gap-2 text-calm">
                <div className="w-2 h-2 bg-calm rounded-full"></div>
                <span>Resource Recommendations</span>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary text-sm mb-2">Privacy Notice</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your conversations are confidential and not stored permanently. 
                This AI assistant provides general wellness support and is not a replacement for professional mental health care.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}