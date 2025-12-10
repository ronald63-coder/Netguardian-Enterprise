export interface Threat {
  id: string;
  ip: string;
  location: string;
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  mlConfidence: number;
  status: 'BLOCKED' | 'MONITORING' | 'ANALYZING';
}

export interface WAFRule {
  id: string;
  name: string;
  pattern: string;
  action: 'BLOCK' | 'ALLOW' | 'LOG';
  active: boolean;
  aiGenerated: boolean;
  hits: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface SecurityStats {
  totalThreats: number;
  securityScore: number;
  activeRules: number;
  aiAnalyses: number;
}
