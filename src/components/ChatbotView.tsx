import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, ShieldAlert, Sparkles } from "lucide-react";
import { UserProfile, ChatMessage } from "../types";
import { translations } from "../translations";

interface ChatbotViewProps {
  user: UserProfile;
  chatHistory: ChatMessage[];
  onAddChatMessage: (msg: ChatMessage) => void;
}

export default function ChatbotView({ user, chatHistory, onAddChatMessage }: ChatbotViewProps) {
  const t = translations[user.language];
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiActive, setAiActive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setAiActive(!!data.aiConfigured);
      })
      .catch(() => {
        setAiActive(false);
      });
  }, []);

  const pills = user.language === 'en' ? [
    t.aiChat.suggestStress,
    t.aiChat.suggestLonely,
    t.aiChat.suggestBurnout,
    "Help me with a breathing exercise"
  ] : [
    t.aiChat.suggestStress,
    t.aiChat.suggestLonely,
    t.aiChat.suggestBurnout,
    "ช่วยแนะนำการฝึกหายใจให้ฉันหน่อย"
  ];

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddChatMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      // Create simplified history representation for backend
      // Filter last 10 messages for token efficiency and state mapping
      const historyContext = chatHistory.slice(-10).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyContext,
          language: user.language
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact the chatbot server.");
      }

      const data = await response.json();
      const aiReply = data.text || "I'm always here to listen and help you through this.";

      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      onAddChatMessage(aiMsg);
    } catch (err: any) {
      console.error(err);
      
      // Fallback response on error
      const fallbackText = user.language === 'en'
        ? "I noticed you might be going through a lot. Remember that box breathing and small steps are highly effective. I'm listening—tell me more, or check our SOS tab if you feel highly overwhelmed."
        : "ผมพร้อมรับฟังทุกเรื่องที่คุณไม่สบายใจอยู่เสมอนะครับ หากความเครียดหรือความกังวลหนักเกินไป ลองหายใจเข้าออกช้าๆ หรือกดเข้าดูเมนูช่วยเหลือด่วน (SOS) ด้านบนได้เสมอนะครับ";
      
      const aiMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddChatMessage(aiMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <div id="ai-chat-view" className="flex flex-col h-[calc(100vh-220px)] min-h-[480px]">
      
      {/* AI Connection Status Badge */}
      <div className="flex items-center justify-between mb-3 px-1 shrink-0">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {user.language === 'en' ? "AI Connection Status" : "สถานะการเชื่อมต่อระบบ AI"}
        </span>
        {aiActive === null && (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200/50 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            <span>{user.language === 'en' ? "Checking..." : "กำลังตรวจสอบ..."}</span>
          </span>
        )}
        {aiActive === true && (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100/50">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-800">{user.language === 'en' ? "Gemini 3.5 Active" : "ระบบ AI ทำงานปกติ (Gemini 3.5)"}</span>
          </span>
        )}
        {aiActive === false && (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100/50">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-amber-800">{user.language === 'en' ? "Offline Mock Mode" : "โหมดจำลองท้องถิ่น (ไม่พบ API Key)"}</span>
          </span>
        )}
      </div>

      {aiActive === false && (
        <div className="text-[10px] bg-purple-50/70 border border-purple-100/60 rounded-xl p-3 mb-3 text-purple-900 dark:bg-purple-950/20 dark:text-purple-400 shrink-0">
          <p className="leading-normal">
            <strong>💡 {user.language === 'en' ? "Unlock Live AI Mode: " : "วิธีเปิดใช้งาน AI อัจฉริยะจริงๆ: "}</strong>
            {user.language === 'en'
              ? "Currently using local pre-coded fallback replies. Open the 'Settings' menu (gear icon on the panel) and add your GEMINI_API_KEY to connect the real Gemini 3.5 model!"
              : "ปัจจุบันระบบกำลังทำงานในโหมดจำลองข้อความที่เตรียมไว้เท่านั้น คุณสามารถปลดล็อกคู่หู AI อัจฉริยะจริงที่ปรับสไตล์ตามแชทได้ โดยเปิดเมนู Settings (รูปฟันเฟืองด้านล่างหรือข้างแผงควบคุม) แล้วใส่รหัส GEMINI_API_KEY ครับ!"}
          </p>
        </div>
      )}
      
      {/* Disclaimer Banner */}
      <div className="flex items-center space-x-2.5 rounded-2xl bg-amber-50 p-3 mb-4 text-[10px] text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/40 shrink-0">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="leading-normal">
          <strong>{user.language === 'en' ? "Safety First: " : "ข้อปฏิบัติเพื่อความปลอดภัย: "}</strong>
          {t.aiChat.warning}
        </p>
      </div>

      {/* Main Conversation Canvas */}
      <div className="flex-1 overflow-y-auto border border-slate-100 bg-slate-50/30 rounded-2xl p-4 dark:border-slate-800/60 dark:bg-slate-900/40 space-y-4 min-h-[250px]">
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-200 to-indigo-200 text-purple-600 shadow-md">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {user.language === 'en' ? "MIND MERIT Well-being Counselor" : "ผู้ให้คำปรึกษาทางใจประจำ MIND MERIT"}
              </h3>
              <p className="text-[10px] text-slate-400 max-w-sm mx-auto mt-1">
                {user.language === 'en' 
                  ? "Combining mindfulness coaching with empathetic psychology. Speak to me freely in English or Thai." 
                  : "พร้อมพูดคุย ให้คำปรึกษา และส่งมอบพลังบวกให้กับคุณ รองรับการคุยทั้งภาษาไทยและอังกฤษ"}
              </p>
            </div>
          </div>
        )}

        {/* Message bubbles list */}
        {chatHistory.map((msg) => {
          const isAI = msg.sender === "ai";
          return (
            <div 
              key={msg.id} 
              className={`flex items-start space-x-2 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar Icon */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${isAI ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              {/* Text Bubble */}
              <div className="space-y-1">
                <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${isAI ? 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/40' : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'}`}>
                  {msg.text.split("\n").map((para, idx) => (
                    <p key={idx} className={idx > 0 ? "mt-2" : ""}>{para}</p>
                  ))}
                </div>
                <p className={`text-[9px] text-slate-400 ${isAI ? 'text-left pl-1' : 'text-right pr-1'}`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          );
        })}

        {/* Typing Loader Indicator */}
        {loading && (
          <div className="flex items-start space-x-2 max-w-[80%] mr-auto animate-pulse">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Bot className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="rounded-2xl bg-white border border-slate-100 px-4 py-3 dark:bg-slate-800 dark:border-slate-800/40 flex items-center space-x-1.5 h-8">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 delay-150" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-purple-400 delay-300" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Access Prompt Pills Row */}
      <div className="flex space-x-2 py-3 overflow-x-auto scrollbar-none shrink-0">
        {pills.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="rounded-full bg-purple-50 border border-purple-100/30 px-3 py-1.5 text-[10px] text-purple-600 dark:bg-purple-950/20 dark:text-purple-400 font-semibold hover:bg-purple-100/60 dark:hover:bg-purple-900/20 transition-all cursor-pointer shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 border-t border-slate-100 pt-3 dark:border-slate-800 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.aiChat.placeholder}
          className="flex-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 text-white shadow-md hover:opacity-95 disabled:opacity-40 cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
}
