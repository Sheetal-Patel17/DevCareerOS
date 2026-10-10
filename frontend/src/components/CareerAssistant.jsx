import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { sendAssistantMessage } from "../services/assistantService";
import "../styles/careerAssistant.css";

const SUGGESTIONS = [
  "Write a professional bio for me",
  "Improve my resume summary",
  "Help me prepare for an interview",
];

function getPageContext(pathname) {
  const pages = {
    "/": "Dashboard",
    "/applications": "Job Applications",
    "/skills": "Skills & Learning",
    "/projects": "Projects",
    "/dsa": "DSA Tracker",
    "/interviews": "Interview Preparation",
    "/goals": "Goal Tracker",
    "/resumes": "Resume Manager",
    "/analytics": "Career Analytics",
    "/github": "GitHub Activity",
    "/settings": "Profile & Settings",
  };

  return pages[pathname] || "DevCareerOS";
}

function CareerAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your Career AI Assistant. Ask me to write a bio, improve your resume, practise interview questions, or plan your next career step.",
    },
  ]);
  const bottomRef = useRef(null);
  const pageContext = getPageContext(location.pathname);
  const isAuthenticated = Boolean(localStorage.getItem("devcareer_token"));
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    setError("");
  }, [location.pathname]);

  if (!isAuthenticated || isAuthPage) return null;

  async function sendMessage(text) {
    const content = text.trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setIsLoading(true);

    try {
      const reply = await sendAssistantMessage(
        nextMessages.slice(-12),
        pageContext
      );
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage(draft);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <div className="career-assistant-root">
      {isOpen && (
        <section className="career-assistant-panel" aria-label="Career AI Assistant">
          <header className="career-assistant-header">
            <div className="career-assistant-brand-icon"><Bot size={22} /></div>
            <div className="career-assistant-heading">
              <strong>Career AI Assistant</strong>
              <span><span className="career-assistant-status-dot" /> Ready to help</span>
            </div>
            <button
              className="career-assistant-icon-button"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Minimize assistant"
              title="Minimize"
            >
              <ChevronDown size={20} />
            </button>
            <button
              className="career-assistant-icon-button"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              title="Close"
            >
              <X size={18} />
            </button>
          </header>

          <div className="career-assistant-context">
            <Sparkles size={14} />
            <span>Context: {pageContext}</span>
          </div>

          <div className="career-assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`career-assistant-message ${message.role}`} key={`${index}-${message.role}`}>
                {message.role === "assistant" && (
                  <span className="career-assistant-message-avatar"><Bot size={15} /></span>
                )}
                <div className="career-assistant-message-bubble">{message.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="career-assistant-message assistant">
                <span className="career-assistant-message-avatar"><Bot size={15} /></span>
                <div className="career-assistant-message-bubble career-assistant-typing">
                  <span /><span /><span />
                  <span className="career-assistant-sr-only">Assistant is thinking</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length === 1 && (
            <div className="career-assistant-suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  disabled={isLoading}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {error && <p className="career-assistant-error" role="alert">{error}</p>}

          <form className="career-assistant-composer" onSubmit={handleSubmit}>
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              aria-label="Message Career AI Assistant"
              rows={1}
              maxLength={2000}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!draft.trim() || isLoading}
              aria-label="Send message"
              title="Send message"
            >
              <Send size={17} />
            </button>
          </form>
          <p className="career-assistant-disclaimer">AI can make mistakes. Avoid sharing passwords or sensitive information.</p>
        </section>
      )}

      <button
        className={`career-assistant-launcher ${isOpen ? "is-open" : ""}`}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close Career AI Assistant" : "Open Career AI Assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={25} />}
        {!isOpen && <span className="career-assistant-launcher-label">Ask Career AI</span>}
      </button>
    </div>
  );
}

export default CareerAssistant;
