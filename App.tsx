import React, { useState, useEffect } from 'react';
import { Shield, Activity, Lock, Globe, AlertTriangle, Terminal, Menu, X, Cpu } from 'lucide-react';
import { MOCK_THREATS, MOCK_WAF_RULES } from './constants';
import ThreatChart from './components/ThreatChart';
import ChatInterface from './components/ChatInterface';
import CyberMap from './components/CyberMap';
import { analyzeThreat } from './services/geminiService';
import { Threat } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'waf' | 'reports'>('dashboard');
  const [threats, setThreats] = useState(MOCK_THREATS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Simulate real-time threats
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const ips = ['192.168.1.1', '10.0.0.5', '172.16.0.22', '8.8.8.8'];
        const types = ['DDoS Attempt', 'Malware Beacon', 'Unauthorized Access', 'Brute Force'];
        const severities = ['LOW', 'MEDIUM', 'HIGH'] as const;
        
        const newThreat: Threat = {
          id: Date.now().toString(),
          ip: ips[Math.floor(Math.random() * ips.length)],
          location: 'Unknown',
          timestamp: new Date().toISOString(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          type: types[Math.floor(Math.random() * types.length)],
          mlConfidence: Math.random(),
          status: 'ANALYZING'
        };
        
        setThreats(prev => [newThreat, ...prev].slice(0, 10)); // Keep last 10
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAnalyzeThreat = async (threat: Threat) => {
    setSelectedThreat(threat);
    setAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzeThreat(JSON.stringify(threat));
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-cyber-accent/10 text-cyber-accent border-r-2 border-cyber-accent' 
          : 'text-slate-400 hover:bg-cyber-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-grid-bg text-slate-200 font-sans flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-30 w-64 h-full bg-cyber-900 border-r border-cyber-700 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-cyber-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="text-cyber-accent" size={28} />
            <h1 className="text-lg font-bold tracking-wider text-slate-100">NetGuardian</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <SidebarItem id="dashboard" icon={Activity} label="Live Dashboard" />
          <SidebarItem id="waf" icon={Lock} label="WAF Rules" />
          <SidebarItem id="reports" icon={Terminal} label="AI Reports" />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-cyber-700 bg-cyber-900/50">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-xs">AI</div>
             <div>
                <p className="text-sm font-bold text-slate-200">Gemini 3 Pro</p>
                <p className="text-xs text-cyber-accent">Connected</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto relative">
        {/* Header */}
        <header className="h-16 bg-cyber-900/80 backdrop-blur-md border-b border-cyber-700 flex items-center justify-between px-6 sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-400">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-6 ml-auto">
             <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse"></span>
                <span className="text-cyber-accent">System Normal</span>
             </div>
             <div className="flex items-center space-x-1 px-3 py-1 rounded bg-cyber-800 border border-cyber-700">
                <Cpu size={14} className="text-slate-400"/>
                <span className="text-xs text-slate-300">ML Confidence: 98.4%</span>
             </div>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
          
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-cyber-800 border border-cyber-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-1">Total Threats</p>
                  <h3 className="text-2xl font-bold text-slate-100">14,205</h3>
                  <p className="text-xs text-cyber-accent mt-2 flex items-center">
                    <Activity size={12} className="mr-1" /> +12% from last hour
                  </p>
                </div>
                <div className="bg-cyber-800 border border-cyber-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-1">Security Score</p>
                  <h3 className="text-2xl font-bold text-emerald-400">94/100</h3>
                  <p className="text-xs text-slate-500 mt-2">Optimal Protection</p>
                </div>
                <div className="bg-cyber-800 border border-cyber-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-1">Active WAF Rules</p>
                  <h3 className="text-2xl font-bold text-blue-400">{MOCK_WAF_RULES.length}</h3>
                  <p className="text-xs text-slate-500 mt-2">AI Generated: 1</p>
                </div>
                <div className="bg-cyber-800 border border-cyber-700 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm mb-1">Gemini Analyses</p>
                  <h3 className="text-2xl font-bold text-purple-400">1,024</h3>
                  <p className="text-xs text-slate-500 mt-2">Daily Token Usage: Low</p>
                </div>
              </div>

              {/* Main Viz Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-cyber-800 border border-cyber-700 rounded-xl p-5 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-100 flex items-center">
                      <Globe size={18} className="mr-2 text-blue-500" />
                      Global Threat Map
                    </h3>
                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20 animate-pulse">LIVE ATTACKS</span>
                  </div>
                  <CyberMap />
                  <div className="mt-4">
                     <h4 className="text-sm font-semibold text-slate-300 mb-2">Traffic Volume</h4>
                     <ThreatChart />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <ChatInterface />
                </div>
              </div>

              {/* Threats Table Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-cyber-800 border border-cyber-700 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-cyber-700 bg-cyber-900/50">
                       <h3 className="font-bold text-slate-100 flex items-center">
                          <AlertTriangle size={18} className="mr-2 text-orange-500" />
                          Recent Threat Log
                       </h3>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-cyber-900 text-slate-400 uppercase text-xs">
                             <tr>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">IP Address</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Severity</th>
                                <th className="px-4 py-3">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-cyber-700">
                             {threats.map((threat) => (
                                <tr key={threat.id} className="hover:bg-cyber-700/50 transition-colors">
                                   <td className="px-4 py-3 text-slate-400 font-mono">
                                      {new Date(threat.timestamp).toLocaleTimeString()}
                                   </td>
                                   <td className="px-4 py-3 font-mono text-slate-300">{threat.ip}</td>
                                   <td className="px-4 py-3 text-slate-300">{threat.type}</td>
                                   <td className="px-4 py-3">
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                                         threat.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                         threat.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                                         'bg-blue-500/20 text-blue-400'
                                      }`}>
                                         {threat.severity}
                                      </span>
                                   </td>
                                   <td className="px-4 py-3">
                                      <button 
                                        onClick={() => handleAnalyzeThreat(threat)}
                                        className="text-cyber-accent hover:text-emerald-300 text-xs border border-cyber-accent/30 px-2 py-1 rounded bg-cyber-accent/10 hover:bg-cyber-accent/20 transition-all"
                                      >
                                         AI Analyze
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>

                 {/* AI Analysis Panel */}
                 <div className="lg:col-span-1 bg-cyber-800 border border-cyber-700 rounded-xl p-5 flex flex-col">
                    <h3 className="font-bold text-slate-100 mb-4 flex items-center">
                       <Cpu size={18} className="mr-2 text-purple-500" />
                       Threat Intelligence
                    </h3>
                    <div className="flex-1 bg-cyber-900/50 rounded-lg p-4 border border-cyber-700 overflow-y-auto">
                       {!selectedThreat ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                             <Shield size={48} className="mb-2" />
                             <p>Select a threat to analyze</p>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             <div className="border-b border-cyber-700 pb-2">
                                <p className="text-xs text-slate-400">Target IP</p>
                                <p className="font-mono text-lg text-slate-200">{selectedThreat.ip}</p>
                             </div>
                             <div>
                                <p className="text-xs text-slate-400 mb-1">AI Assessment</p>
                                {analyzing ? (
                                   <div className="flex items-center space-x-2 text-purple-400 animate-pulse">
                                      <Terminal size={14} />
                                      <span className="text-sm">Gemini is analyzing payload...</span>
                                   </div>
                                ) : (
                                   <p className="text-sm text-slate-300 leading-relaxed">
                                      {analysisResult}
                                   </p>
                                )}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            </>
          )}

          {activeTab === 'waf' && (
             <div className="bg-cyber-800 border border-cyber-700 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold flex items-center">
                      <Lock className="mr-3 text-cyber-accent" /> Web Application Firewall
                   </h2>
                   <button className="bg-cyber-accent hover:bg-emerald-600 text-cyber-900 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                      + Add Custom Rule
                   </button>
                </div>
                <div className="grid gap-4">
                   {MOCK_WAF_RULES.map(rule => (
                      <div key={rule.id} className="bg-cyber-900/50 border border-cyber-700 p-4 rounded-lg flex items-center justify-between">
                         <div>
                            <div className="flex items-center space-x-3">
                               <h4 className="font-bold text-slate-200">{rule.name}</h4>
                               {rule.aiGenerated && (
                                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-0.5 rounded border border-purple-500/30">AI GENERATED</span>
                               )}
                            </div>
                            <code className="text-xs text-slate-500 mt-1 block font-mono">{rule.pattern}</code>
                         </div>
                         <div className="flex items-center space-x-6">
                            <div className="text-right">
                               <p className="text-xs text-slate-400">Hits</p>
                               <p className="font-mono text-slate-200">{rule.hits}</p>
                            </div>
                            <div className={`px-3 py-1 rounded text-xs font-bold ${rule.action === 'BLOCK' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                               {rule.action}
                            </div>
                            <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${rule.active ? 'bg-cyber-accent' : 'bg-slate-600'}`}>
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${rule.active ? 'left-6' : 'left-1'}`} />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'reports' && (
             <div className="bg-cyber-800 border border-cyber-700 rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                <Terminal size={64} className="text-cyber-700 mb-4" />
                <h2 className="text-xl font-bold text-slate-300 mb-2">Enterprise Reporting Center</h2>
                <p className="text-slate-500 max-w-md text-center mb-6">
                   Generate comprehensive security audit logs and AI-summarized threat assessments in PDF format.
                </p>
                <button 
                  onClick={() => alert("Generating Report via Gemini... (Mock Action)")}
                  className="bg-cyber-accent hover:bg-emerald-600 text-cyber-900 px-6 py-3 rounded-lg font-bold flex items-center space-x-2 transition-all"
                >
                   <span>Generate Monthly Report</span>
                </button>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
