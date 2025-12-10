import { Threat, WAFRule } from './types';

export const MOCK_THREATS: Threat[] = [
  {
    id: '1',
    ip: '192.168.1.105',
    location: 'Unknown Proxy',
    timestamp: new Date().toISOString(),
    severity: 'CRITICAL',
    type: 'SQL Injection Attempt',
    mlConfidence: 0.98,
    status: 'BLOCKED'
  },
  {
    id: '2',
    ip: '45.22.19.11',
    location: 'Russia',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    severity: 'HIGH',
    type: 'Port Scan (SYN Flood)',
    mlConfidence: 0.89,
    status: 'ANALYZING'
  },
  {
    id: '3',
    ip: '103.21.244.0',
    location: 'China',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    severity: 'MEDIUM',
    type: 'XSS Payload',
    mlConfidence: 0.75,
    status: 'BLOCKED'
  },
  {
    id: '4',
    ip: '185.100.85.1',
    location: 'Netherlands',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    severity: 'LOW',
    type: 'Unusual User Agent',
    mlConfidence: 0.45,
    status: 'MONITORING'
  }
];

export const MOCK_WAF_RULES: WAFRule[] = [
  {
    id: '101',
    name: 'Block SQLi Patterns',
    pattern: 'DROP TABLE|UNION SELECT|OR 1=1',
    action: 'BLOCK',
    active: true,
    aiGenerated: false,
    hits: 1420
  },
  {
    id: '102',
    name: 'XSS Prevention',
    pattern: '<script>|javascript:|onerror=',
    action: 'BLOCK',
    active: true,
    aiGenerated: false,
    hits: 856
  },
  {
    id: '103',
    name: 'AI Dynamic Rate Limit',
    pattern: 'REQ_PER_SEC > 50 AND PATH="/login"',
    action: 'BLOCK',
    active: true,
    aiGenerated: true,
    hits: 34
  }
];

export const SYSTEM_INSTRUCTION = `You are the NetGuardian AI Security Analyst. 
Your role is to analyze network threats, explain technical security concepts, generate WAF rules, and provide actionable mitigation strategies.
You are integrated into an enterprise dashboard. Be concise, professional, and use security terminology (CVE, OWASP, etc.).
If asked to generate a report, format it with clear headers and bullet points.
Current Context: Monitoring 14 active nodes. Threat level is ELEVATED.`;
