/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Users, 
  Zap, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  Share2, 
  ChevronRight,
  Sparkles,
  RefreshCw,
  Inbox
} from 'lucide-react';
import { ProcessedMessage, DashboardStats } from './types';
import { generateDemoMessages, processMessages, calculateStats } from './services/geminiService';

const IMPACT_COLORS: Record<string, string> = {
  'Client Impact': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Internal Leadership': 'bg-blue-50 text-blue-700 border-blue-200',
  'Delivery / Program': 'bg-amber-50 text-amber-700 border-amber-200',
  'Thought Leadership Opportunity': 'bg-purple-50 text-purple-700 border-purple-200',
};

const PRIORITY_COLORS: Record<string, string> = {
  'Urgent & Strategic': 'bg-rose-50 text-rose-700 border-rose-200',
  'Strategic but Not Urgent': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Operational': 'bg-slate-50 text-slate-700 border-slate-200',
  'Informational': 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [messages, setMessages] = useState<ProcessedMessage[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'decisions' | 'delegations' | 'handled'>('decisions');

  const handleGenerate = async () => {
    setLoading(true);
    setLoadingStep('Gathering overnight communication...');
    try {
      const raw = await generateDemoMessages();
      setLoadingStep('AI Chief of Staff is triaging messages...');
      const processed = await processMessages(raw);
      setMessages(processed);
      setStats(calculateStats(processed));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const decisions = messages.filter(m => m.category === 'Decision Required');
  const delegations = messages.filter(m => m.category === 'Delegatable');
  const handled = messages.filter(m => m.category === 'Suggested Auto Reply' || m.category === 'FYI');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="w-full max-w-md text-center space-y-8">
          <motion.div 
            className="w-24 h-24 mx-auto rounded-full infinity-gradient flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="text-white w-10 h-10" />
          </motion.div>
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-semibold text-slate-900">{loadingStep}</h2>
            <p className="text-slate-500 font-light">Compressing communication noise into executive intelligence.</p>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="h-full infinity-gradient"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="h-[40vh] infinity-gradient flex items-center justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 z-10 px-6"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">Executive Command Center</h1>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto">
              Turning inbox chaos into executive clarity.
            </p>
            <button 
              onClick={handleGenerate}
              className="mt-8 px-8 py-4 bg-white text-blue-900 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
            >
              <Zap className="w-5 h-5 fill-current" />
              Generate Demo Messages
            </button>
          </motion.div>
        </header>
        <main className="flex-1 max-w-4xl mx-auto w-full py-20 px-6 text-center space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto text-blue-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Triage Automatically</h3>
              <p className="text-slate-500 text-sm">AI analyzes and categorizes every incoming message from Email, Teams, and WhatsApp.</p>
            </div>
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mx-auto text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Mobilize Expertise</h3>
              <p className="text-slate-500 text-sm">Instantly identify the right Capgemini Invent experts to handle specific requests.</p>
            </div>
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto text-emerald-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Strategic Insights</h3>
              <p className="text-slate-500 text-sm">Elevate operational replies into strategic conversations with AI-powered insights.</p>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100">
            <p className="text-slate-400 font-display text-sm uppercase tracking-widest">Team Prompt & Furious</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Hero Header */}
      <header className="infinity-gradient pt-16 pb-32 px-6 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative z-10">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-display font-bold"
            >
              Good morning, Philipp.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-light opacity-80"
            >
              Everything important is ready for your review.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <button 
              onClick={handleGenerate}
              className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-6 -mt-20 pb-20 space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Processed" value={stats?.totalProcessed || 0} icon={<Inbox className="w-4 h-4" />} />
          <StatCard label="Auto-Handled" value={stats?.handledAutomatically || 0} icon={<CheckCircle2 className="w-4 h-4" />} />
          <StatCard label="Delegations" value={stats?.delegationsPrepared || 0} icon={<Share2 className="w-4 h-4" />} />
          <StatCard label="Informational" value={stats?.informational || 0} icon={<Clock className="w-4 h-4" />} />
          <StatCard label="Decisions" value={stats?.decisionsRequired || 0} icon={<ShieldAlert className="w-4 h-4" />} highlight />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-8">
          <TabButton 
            active={activeTab === 'decisions'} 
            onClick={() => setActiveTab('decisions')}
            label="Your Decisions"
            count={decisions.length}
          />
          <TabButton 
            active={activeTab === 'delegations'} 
            onClick={() => setActiveTab('delegations')}
            label="Delegations Prepared"
            count={delegations.length}
          />
          <TabButton 
            active={activeTab === 'handled'} 
            onClick={() => setActiveTab('handled')}
            label="Already Handled"
            count={handled.length}
          />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'decisions' && (
              <motion.div 
                key="decisions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {decisions.map(msg => (
                  <DecisionCard key={msg.id} message={msg} />
                ))}
              </motion.div>
            )}

            {activeTab === 'delegations' && (
              <motion.div 
                key="delegations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {delegations.map(msg => (
                  <DelegationCard key={msg.id} message={msg} />
                ))}
              </motion.div>
            )}

            {activeTab === 'handled' && (
              <motion.div 
                key="handled"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {handled.map(msg => (
                  <HandledCard key={msg.id} message={msg} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p className="font-display tracking-widest uppercase">Prompt & Furious — Capgemini Invent</p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon, highlight }: { label: string, value: number, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-2xl glass-card flex flex-col justify-between h-32 ${highlight ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}>
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          {icon}
        </div>
        <span className="text-2xl font-display font-bold text-slate-900">{value}</span>
      </div>
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean, onClick: () => void, label: string, count: number }) {
  return (
    <button 
      onClick={onClick}
      className={`pb-4 text-sm font-semibold transition-all relative ${active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
    >
      <span className="flex items-center gap-2">
        {label}
        <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
          {count}
        </span>
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
        />
      )}
    </button>
  );
}

function DecisionCard({ message }: { message: ProcessedMessage, key?: React.Key }) {
  const SourceIcon = message.raw.source === 'Email' ? Mail : message.raw.source === 'Teams' ? MessageSquare : Phone;
  
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 space-y-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <SourceIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">{message.raw.sender}</h4>
              <p className="text-xs text-slate-400">{message.raw.timestamp}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${PRIORITY_COLORS[message.priority]}`}>
              {message.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${IMPACT_COLORS[message.impact]}`}>
              {message.impact}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-display font-semibold text-slate-900 leading-tight">
            {message.raw.subject || "Incoming Message"}
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {message.summary}
          </p>
        </div>

        {message.clientInsight && (
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Strategic Insight</span>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-indigo-900">"{message.clientInsight.strategicAngle}"</p>
              <div className="flex flex-wrap gap-2">
                {message.clientInsight.relevantOfferings.map(offering => (
                  <span key={offering} className="text-[10px] bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-600 font-medium">
                    {offering}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-indigo-600 italic">
                Ref: {message.clientInsight.thoughtLeadership}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Experts</span>
          <div className="flex flex-wrap gap-2">
            {message.recommendedExperts.map(expert => (
              <div key={expert} className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs text-slate-600 font-medium">
                <Users className="w-3 h-3" />
                {expert}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
        <button className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Approve
        </button>
        <button className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Delegate
        </button>
        <button className="flex-1 bg-indigo-600 py-2 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
          Reply
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DelegationCard({ message }: { message: ProcessedMessage, key?: React.Key }) {
  return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-between gap-6 group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Share2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900">{message.raw.subject || "Delegation Task"}</h4>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {message.priority}
            </span>
          </div>
          <p className="text-sm text-slate-500 line-clamp-1">{message.summary}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delegated To</p>
          <p className="text-sm font-semibold text-slate-700">{message.delegationTarget || 'Delivery Lead'}</p>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function HandledCard({ message }: { message: ProcessedMessage, key?: React.Key }) {
  return (
    <div className="glass-card p-6 rounded-2xl flex items-center justify-between gap-6 opacity-75 hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-medium text-slate-900 text-sm">{message.summary}</h4>
          <p className="text-xs text-slate-400">Handled automatically via {message.raw.source}</p>
        </div>
      </div>
      {message.suggestedReply && (
        <div className="max-w-xs text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Auto-Response Sent</p>
          <p className="text-[11px] text-slate-500 italic line-clamp-1">"{message.suggestedReply}"</p>
        </div>
      )}
    </div>
  );
}
