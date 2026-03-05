export type MessageSource = 'Email' | 'Teams' | 'WhatsApp';
export type MessageCategory = 'Decision Required' | 'Delegatable' | 'Suggested Auto Reply' | 'FYI';
export type Priority = 'Urgent & Strategic' | 'Strategic but Not Urgent' | 'Operational' | 'Informational';
export type ImpactTag = 'Client Impact' | 'Internal Leadership' | 'Delivery / Program' | 'Thought Leadership Opportunity';

export interface RawMessage {
  id: string;
  sender: string;
  subject?: string;
  content: string;
  source: MessageSource;
  timestamp: string;
}

export interface ProcessedMessage {
  id: string;
  raw: RawMessage;
  category: MessageCategory;
  summary: string;
  priority: Priority;
  impact: ImpactTag;
  recommendedExperts: string[];
  clientInsight?: {
    strategicAngle: string;
    relevantOfferings: string[];
    thoughtLeadership: string;
  };
  delegationTarget?: string;
  suggestedReply?: string;
}

export interface DashboardStats {
  totalProcessed: number;
  handledAutomatically: number;
  delegationsPrepared: number;
  informational: number;
  decisionsRequired: number;
}
