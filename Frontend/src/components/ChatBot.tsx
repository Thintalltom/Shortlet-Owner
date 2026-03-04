import React, { useEffect, useState, useRef } from 'react';
import {
  MessageCircleIcon,
  XIcon,
  SendIcon,
  BotIcon,
  ChevronDownIcon } from
'lucide-react';
import { ChatMessage } from '../types';
const FAQ_TREE: {
  trigger: string[];
  answer: string;
}[] = [
{
  trigger: [
  'contact owner',
  'contact agent',
  'phone number',
  'reach owner',
  'call owner'],

  answer:
  'To contact an owner or agent, open any property listing and click **Call Now** or **WhatsApp** buttons on the right side. Their contact details are displayed directly on the property page.'
},
{
  trigger: ['report', 'fake listing', 'suspicious', 'scam', 'fraud'],
  answer:
  'To report a suspicious listing, open the property page and click the **Report Listing** button near the bottom. Our team reviews all reports within 24 hours.'
},
{
  trigger: ['save property', 'favorite', 'saved', 'bookmark', 'wishlist'],
  answer:
  'You can save properties by clicking the ❤️ heart icon on any property card or listing page. You must be logged in. View saved properties by checking the heart icon in the navigation bar.'
},
{
  trigger: [
  'trusted badge',
  'verification',
  'get verified',
  'trusted agent',
  'badge'],

  answer:
  'To get the Trusted Agent Badge:\n1. Complete your profile (photo, bio, WhatsApp)\n2. Verify your phone number via OTP\n3. Pay the ₦1,000 one-time commitment fee\n4. Wait 24-48 hours for admin review\n\nGo to **Agent Dashboard → Verification** to start.'
},
{
  trigger: [
  'boost listing',
  'boost property',
  'promote',
  'visibility',
  'boost'],

  answer:
  'To boost a listing, go to **Owner/Agent Dashboard → My Properties** and click the **Boost** button next to any property. Boosted listings appear at the top of search results for the selected duration.'
},
{
  trigger: [
  'application rejected',
  'rejected',
  'why rejected',
  'application denied'],

  answer:
  'Applications can be rejected if: the owner chose another agent, your profile is incomplete, or the property already has an approved agent. Complete your profile and try applying to other properties.'
},
{
  trigger: [
  'upload property',
  'add property',
  'list property',
  'how to list'],

  answer:
  'To upload a property:\n1. Login as an Owner\n2. Go to **Owner Dashboard → My Properties**\n3. Click **Add Property**\n4. Fill in details and upload 3-6 images\n5. Choose management type (self or agent)\n6. Click Save'
},
{
  trigger: [
  'property not showing',
  'listing not visible',
  'not appearing',
  'not found'],

  answer:
  "If your property isn't showing: check that its status is **Active**, ensure you've uploaded at least 3 images, and verify all required fields are filled. Contact support if the issue persists."
},
{
  trigger: ['remove agent', 'change agent', 'unassign agent', 'fire agent'],
  answer:
  'To remove an assigned agent, go to **Owner Dashboard → Applications**, find the property, and contact our support team. Agent reassignment requires admin assistance to maintain trust.'
},
{
  trigger: [
  'application limit',
  'max applications',
  'how many applications',
  'limit'],

  answer:
  'Untrusted agents can submit up to **3 applications per month**. Trusted Agents have **unlimited applications**. Upgrade your badge at **Agent Dashboard → Verification**.'
},
{
  trigger: ['feature listing', 'featured', 'homepage', 'appear on homepage'],
  answer:
  'To feature a listing on the homepage and top of search results, go to **Dashboard → My Properties** and click **Feature** next to a property. Featured listings get premium placement.'
},
{
  trigger: ['hello', 'hi', 'hey', 'help', 'start', 'what can you do'],
  answer:
  "Hello! 👋 I'm the ShortletConnect assistant. I can help with:\n\n• Contacting owners/agents\n• Reporting listings\n• Getting the Trusted Badge\n• Boosting/featuring listings\n• Application questions\n• Uploading properties\n\nWhat do you need help with?"
}];

const QUICK_QUESTIONS = [
'How do I contact an owner?',
'How to get Trusted Badge?',
'How to boost a listing?',
'How to save a property?',
'Why was my application rejected?'];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ_TREE) {
    if (faq.trigger.some((t) => lower.includes(t))) {
      return faq.answer;
    }
  }
  return "I'm not sure about that. Please try rephrasing, or contact us at **hello@shortletconnect.ng** for direct support. You can also browse our FAQ section on the Help page.";
}
function MessageBubble({ msg }: {msg: ChatMessage;}) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot &&
      <div className="w-7 h-7 bg-[#1B6B3A] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <BotIcon size={14} className="text-white" />
        </div>
      }
      <div
        className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${isBot ? 'bg-[#F8FAFC] border border-[#E5E7EB] text-[#111827] rounded-tl-sm' : 'bg-[#1B6B3A] text-white rounded-tr-sm'}`}>

        {msg.text.split('\n').map((line, i) =>
        <span key={i}>
            {line.
          split(/\*\*(.*?)\*\*/g).
          map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
            {i < msg.text.split('\n').length - 1 && <br />}
          </span>
        )}
      </div>
    </div>);

}
export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
  {
    id: '1',
    role: 'bot',
    text: "Hello! 👋 I'm the ShortletConnect assistant. How can I help you today?",
    timestamp: new Date().toISOString()
  }]
  );
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open)
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, open]);
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: getBotResponse(text),
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#1B6B3A] hover:bg-[#145230] text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        aria-label="Open support chat">

        {open ? <XIcon size={22} /> : <MessageCircleIcon size={22} />}
        {!open && messages.length === 1 &&
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F59E0B] rounded-full animate-pulse" />
        }
      </button>

      {/* Chat Window */}
      {open &&
      <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-slide-down">
          {/* Header */}
          <div className="bg-[#1B6B3A] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <BotIcon size={16} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  ShortletConnect Support
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full" />
                  <span className="text-white/70 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button
            onClick={() => setOpen(false)}
            className="text-white/70 hover:text-white">

              <ChevronDownIcon size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-72">
            {messages.map((msg) =>
          <MessageBubble key={msg.id} msg={msg} />
          )}
            {typing &&
          <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 bg-[#1B6B3A] rounded-full flex items-center justify-center flex-shrink-0">
                  <BotIcon size={14} className="text-white" />
                </div>
                <div className="bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-2 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <span
                className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                style={{
                  animationDelay: '0ms'
                }} />

                  <span
                className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                style={{
                  animationDelay: '150ms'
                }} />

                  <span
                className="w-1.5 h-1.5 bg-[#6B7280] rounded-full animate-bounce"
                style={{
                  animationDelay: '300ms'
                }} />

                </div>
              </div>
          }
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 &&
        <div className="px-4 pb-2">
              <p className="text-xs text-[#6B7280] mb-2 font-medium">
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.slice(0, 3).map((q) =>
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs bg-[#E8F5EE] text-[#1B6B3A] px-2.5 py-1 rounded-full hover:bg-[#1B6B3A] hover:text-white transition-colors">

                    {q}
                  </button>
            )}
              </div>
            </div>
        }

          {/* Input */}
          <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-[#E5E7EB] flex gap-2">

            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 text-sm border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:border-transparent" />

            <button
            type="submit"
            disabled={!input.trim() || typing}
            className="w-9 h-9 bg-[#1B6B3A] hover:bg-[#145230] text-white rounded-lg flex items-center justify-center disabled:opacity-50 transition-colors flex-shrink-0">

              <SendIcon size={15} />
            </button>
          </form>
        </div>
      }
    </>);

}