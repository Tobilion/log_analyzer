/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Plus, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Database, 
  Cpu, 
  Activity, 
  Server,
  Network,
  FileText,
  Clock,
  Sparkles,
  Search
} from 'lucide-react';
import { LogEntry, SecurityAlert, LogSimulationState, LogScenario } from '../types';

// Standard demo template logs mapping different scenario states
const DEFAULT_LOGS: LogEntry[] = [
  { id: 'l1', ip: '192.168.1.10', timestamp: '03/Jun/2026:12:05:01 +0000', method: 'GET', request: '/index.html', status: '200', size: 4521, userAgent: 'Mozilla/5.0 (Windows NT 10.0)', scenario: 'normal' },
  { id: 'l2', ip: '192.168.1.52', timestamp: '03/Jun/2026:12:05:12 +0000', method: 'GET', request: '/assets/styles.css', status: '200', size: 10214, userAgent: 'Mozilla/5.0 (Macintosh)', scenario: 'normal' },
  { id: 'l3', ip: '203.0.113.195', timestamp: '03/Jun/2026:12:05:22 +0000', method: 'GET', request: "/products?id=1' UNION SELECT username, password FROM users --", status: '500', size: 512, userAgent: 'curl/7.85.0 (Security Scanner)', scenario: 'sqli' },
  { id: 'l4', ip: '192.168.1.52', timestamp: '03/Jun/2026:12:05:30 +0000', method: 'GET', request: '/js/app.js', status: '200', size: 18451, userAgent: 'Mozilla/5.0 (Macintosh)', scenario: 'normal' },
  { id: 'l5', ip: '198.51.100.12', timestamp: '03/Jun/2026:12:05:35 +0000', method: 'GET', request: '/static/../../../../etc/passwd', status: '403', size: 120, userAgent: 'Mozilla/5.0 (X11; Linux)', scenario: 'traversal' },
  { id: 'l6', ip: '192.0.2.1', timestamp: '03/Jun/2026:12:05:40 +0000', method: 'POST', request: '/api/login', status: '401', size: 84, userAgent: 'Hydra/9.4', scenario: 'bruteforce' },
  { id: 'l7', ip: '192.0.2.1', timestamp: '03/Jun/2026:12:05:42 +0000', method: 'POST', request: '/api/login', status: '401', size: 84, userAgent: 'Hydra/9.4', scenario: 'bruteforce' },
  { id: 'l8', ip: '192.0.2.1', timestamp: '03/Jun/2026:12:05:44 +0000', method: 'POST', request: '/api/login', status: '401', size: 84, userAgent: 'Hydra/9.4', scenario: 'bruteforce' },
  { id: 'l9', ip: '192.0.2.1', timestamp: '03/Jun/2026:12:05:46 +0000', method: 'POST', request: '/api/login', status: '401', size: 84, userAgent: 'Hydra/9.4', scenario: 'bruteforce' } // Brute Force triggers on 4th consecutive!
];

// Helper to construct actual raw log string format
function getRawLogLine(entry: LogEntry): string {
  return `${entry.ip} - - [${entry.timestamp}] "${entry.method} {entry.request} HTTP/1.1" ${entry.status} ${entry.size} "${entry.userAgent}"`;
}

export default function LogAnalyzerSimulator() {
  const [logs, setLogs] = useState<LogEntry[]>(DEFAULT_LOGS);
  
  // Custom Addition State
  const [customIP, setCustomIP] = useState('');
  const [customRequest, setCustomRequest] = useState('');
  const [customStatus, setCustomStatus] = useState('200');
  const [customSize, setCustomSize] = useState('1200');
  const [customScenario, setCustomScenario] = useState<LogScenario>('normal');
  const [showForm, setShowForm] = useState(false);

  // Analyzer Tracker states
  const [simState, setSimState] = useState<LogSimulationState>({
    status: 'idle',
    currentEntryId: null,
    scannedEntries: [],
    totalBandwidth: 0,
    ipCounts: {},
    endpointCounts: {},
    statusCounts: {},
    alerts: [],
    traceLog: []
  });

  const resetSim = () => {
    setSimState({
      status: 'idle',
      currentEntryId: null,
      scannedEntries: [],
      totalBandwidth: 0,
      ipCounts: {},
      endpointCounts: {},
      statusCounts: {},
      alerts: [],
      traceLog: []
    });
  };

  const startSimulation = async () => {
    if (logs.length === 0) return;

    setSimState(prev => ({
      ...prev,
      status: 'parsing',
      traceLog: [
        '[+] Compiling Regex Pattern compiler: ^(\\S+)\\s+\\S+\\s+(\\S+)\\s+\\[([^\\]]+)\\]\\s+"([A-Z]+)\\s+(\\S+)\\s+[^"]+"\\s+(\\d{3})\\s+(\\d+|-)\\s+"([^"]+)"',
        `[+] Loaded rule heuristics threshold: 4 authentication failure limits`,
        `[+] Demuxing ${logs.length} stream log nodes recursively...`
      ]
    }));

    await new Promise(resolve => setTimeout(resolve, 1400));

    let runBandwidth = 0;
    const runIps: Record<string, number> = {};
    const runEndpoints: Record<string, number> = {};
    const runStatus: Record<string, number> = {};
    const runAlerts: SecurityAlert[] = [];
    let loginFailuresCount = 0;

    let traceAccumulator = [
      '[+] Processing streaming data pipelines...',
      '[+] Initializing event telemetry captures...'
    ];

    for (let idx = 0; idx < logs.length; idx++) {
      const entry = logs[idx];

      setSimState(prev => ({
        ...prev,
        currentEntryId: entry.id,
        traceLog: [...prev.traceLog.slice(0, 3), ...traceAccumulator, `➜ Processing index line [${idx + 1}/${logs.length}] from IP: ${entry.ip}`]
      }));

      // Buffer state delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // 1. Accumulate parameters
      runBandwidth += entry.size;
      runIps[entry.ip] = (runIps[entry.ip] || 0) + 1;
      runEndpoints[entry.request] = (runEndpoints[entry.request] || 0) + 1;
      runStatus[entry.status] = (runStatus[entry.status] || 0) + 1;

      // 2. Evaluation checks
      const requestLower = entry.request.toLowerCase();
      let alertRegistered = false;

      // Check SQLi Pattern matcher
      const sqliTriggers = ["'", '"', "union", "select", "concat", "or 1=1", "--"];
      if (sqliTriggers.some(t => requestLower.includes(t))) {
        const newAlert: SecurityAlert = {
          type: 'SQL Injection Blocked',
          ip: entry.ip,
          timestamp: entry.timestamp,
          severity: 'CRITICAL',
          details: `Threat matched query parameters signature patterns: ${entry.request}`
        };
        runAlerts.push(newAlert);
        alertRegistered = true;
        traceAccumulator.push(`⚠️  [ALARM] SQL Injection attempt detected from address: ${entry.ip}`);
      }

      // Check Path Traversals
      const traversalTriggers = ["../", "..\\", "/etc/passwd"];
      if (traversalTriggers.some(t => requestLower.includes(t))) {
        const newAlert: SecurityAlert = {
          type: 'Path Traversal Blocked',
          ip: entry.ip,
          timestamp: entry.timestamp,
          severity: 'CRITICAL',
          details: `Client attempted system back-reference directories escape: ${entry.request}`
        };
        runAlerts.push(newAlert);
        alertRegistered = true;
        traceAccumulator.push(`⚠️  [ALARM] Path Traversal breach attempt registered at: ${entry.request}`);
      }

      // Check Login Failures brute force thresholds
      if (entry.request.includes('/login') && (entry.status === '401' || entry.status === '403')) {
        loginFailuresCount += 1;
        if (loginFailuresCount >= 4) {
          const newAlert: SecurityAlert = {
            type: 'Brute Force Attack Suspended',
            ip: entry.ip,
            timestamp: entry.timestamp,
            severity: 'HIGH',
            details: `Threshold breached: ${loginFailuresCount} consecutive login credentials failures tracked on authorization gateway.`
          };
          runAlerts.push(newAlert);
          alertRegistered = true;
          traceAccumulator.push(`🛑 [ALERT] Brute Force Warning triggered representing IP: ${entry.ip}`);
          loginFailuresCount = 0; // reset
        }
      }

      if (!alertRegistered) {
        traceAccumulator.push(`    [INDEX SUCCESS] Regex parsed OK - Status ${entry.status} returned from ${entry.request}`);
      }

      setSimState(prev => ({
        ...prev,
        scannedEntries: [...prev.scannedEntries, entry.id],
        totalBandwidth: runBandwidth,
        ipCounts: { ...runIps },
        endpointCounts: { ...runEndpoints },
        statusCounts: { ...runStatus },
        alerts: [...runAlerts],
        traceLog: [...prev.traceLog.slice(0, 3), ...traceAccumulator]
      }));
    }

    setSimState(prev => ({
      ...prev,
      status: 'reporting'
    }));

    await new Promise(resolve => setTimeout(resolve, 1000));

    setSimState(prev => ({
      ...prev,
      status: 'done',
      traceLog: [
        ...prev.traceLog,
        `[✔] Active scan stream completed successfully.`,
        `[✔] Automated report generated containing ${runAlerts.length} security alerts.`,
        `[✔] Written Markdown log audit results to: 'log_analysis_report.md'`
      ]
    }));
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIP || !customRequest) return;

    const newLog: LogEntry = {
      id: `custom_${Date.now()}`,
      ip: customIP.trim(),
      timestamp: new Date().toISOString(),
      method: customRequest.includes('login') ? 'POST' : 'GET',
      request: customRequest.trim(),
      status: customStatus,
      size: parseInt(customSize) || 450,
      userAgent: 'Mozilla/5.0 (Custom Emulator)',
      scenario: customScenario
    };

    setLogs(prev => [...prev, newLog]);
    setCustomIP('');
    setCustomRequest('');
    setCustomStatus('200');
    setCustomSize('1200');
    setShowForm(false);
    resetSim();
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    resetSim();
  };

  const handleResetLogs = () => {
    setLogs(DEFAULT_LOGS);
    resetSim();
  };

  return (
    <div className="space-y-8">
      {/* Alert Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            Security Incident Simulator workspace
          </h3>
          <p className="text-xs text-slate-500">
            Inspect live streaming logs, simulate hacking vectors, and analyze how stateful dictionaries keep trace metrics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetLogs}
            id="reset-logs-presets"
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset presets
          </button>
        </div>
      </div>

      {/* Primary Simulator Grid splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Stream data feed */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <span className="font-display font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-500" />
                Web Transactions Queue Buffer
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {logs.length} entries
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {logs.map((log) => {
                const processed = simState.scannedEntries.includes(log.id);
                const isActive = simState.currentEntryId === log.id;
                
                return (
                  <div
                    key={log.id}
                    className={`border px-3.5 py-3 rounded-2xl transition-all text-xs relative ${
                      isActive 
                        ? 'border-indigo-400 bg-indigo-50/55 ring-1 ring-indigo-400' 
                        : processed 
                          ? 'border-slate-100 bg-slate-50 opacity-70'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 max-w-[80%]">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold text-slate-950">{log.ip}</span>
                          <span className={`text-[9px] px-1.5 py-0.1 font-mono rounded ${
                            log.method === 'POST' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {log.method}
                          </span>
                        </div>
                        <p className="font-mono text-slate-600 truncate break-all">{log.request}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          log.status.startsWith('2') ? 'bg-emerald-50 text-emerald-700' :
                          log.status.startsWith('4') ? 'bg-amber-50 text-amber-700' :
                          'bg-rose-50 text-rose-700'
                        }`}>
                          {log.status}
                        </span>

                        {simState.status === 'idle' && (
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            id={`delete-log-${log.id}`}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-slate-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-[9px] text-slate-400 font-mono flex items-center justify-between">
                      <span>Bytes: {log.size}</span>
                      <span className="truncate max-w-[150px]">{log.userAgent}</span>
                    </div>

                    {/* Threat indicator tag colors */}
                    {log.scenario !== 'normal' && (
                      <span className={`absolute top-2 right-12 text-[8px] font-mono font-bold uppercase tracking-wider px-1 bg-amber-100 text-amber-800 rounded border border-amber-200`}>
                        {log.scenario} test
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom Addition Form */}
            <div className="border-t border-slate-100 pt-4 mt-4">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  id="open-log-form-btn"
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-display font-semibold border border-slate-200 rounded-xl text-xs flex items-center justify-center gap-1 px-4 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Web Transaction log
                </button>
              ) : (
                <form onSubmit={handleAddLog} className="space-y-3 bg-slate-50/50 p-4 border border-slate-150 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Simulate Hacking / Access Line</span>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="p-1 text-slate-400 hover:bg-slate-150 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Source IP Address</label>
                      <input
                        type="text"
                        placeholder="192.168.1.99"
                        value={customIP}
                        onChange={e => setCustomIP(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Response bytes</label>
                      <input
                        type="number"
                        placeholder="1200"
                        value={customSize}
                        onChange={e => setCustomSize(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">Requested URI Endpoint (Simulate /login, traversal, or script parameters)</label>
                    <input
                      type="text"
                      placeholder="/api/users?search=' UNION SELECT password..."
                      value={customRequest}
                      onChange={e => setCustomRequest(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Response Code</label>
                      <select
                        value={customStatus}
                        onChange={e => setCustomStatus(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-mono"
                      >
                        <option value="200">200 OK</option>
                        <option value="401">401 Unauthorized</option>
                        <option value="403">403 Forbidden</option>
                        <option value="404">404 Not Found</option>
                        <option value="500">500 Server Error</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Target Scenario</label>
                      <select
                        value={customScenario}
                        onChange={e => setCustomScenario(e.target.value as LogScenario)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-mono"
                      >
                        <option value="normal">Normal Log</option>
                        <option value="sqli">SQL injection</option>
                        <option value="traversal">Directory traversal</option>
                        <option value="bruteforce">Brute Force fail</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-log"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Insert Log into stream
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Aggregates stats dashboard and alarms board */}
        <div className="lg:col-span-7 space-y-6 animate-fade-in">
          
          {/* Action trigger card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                INCIDENT RADAR REGEX ENGINE
              </span>
              <p className="text-xs text-slate-600">
                Execute regex compiler streaming and discover attacks in progress.
              </p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {simState.status !== 'idle' && (
                <button
                  onClick={resetSim}
                  id="reset-state-btn"
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear radar
                </button>
              )}

              <button
                onClick={startSimulation}
                id="start-log-sim"
                disabled={simState.status === 'parsing' || logs.length === 0}
                className="flex-1 sm:flex-none px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-display font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-4 h-4" />
                {simState.status === 'idle' ? 'START STREAM DECODER' : 'RE-RUN STREAM'}
              </button>
            </div>
          </div>

          {/* Active Alarms Radar list */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm tracking-tight">Active Hacking Indicators Decoded</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Heuristic rule signatures flagging threats in raw bytes</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full">
                {simState.alerts.length} ALARMS
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {simState.alerts.map((al, ai) => (
                <div key={ai} className="p-4 border border-rose-100/80 bg-rose-50/20 rounded-2xl text-xs space-y-1.5 animate-flash">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-800 flex items-center gap-1 font-display">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      {al.type}
                    </span>
                    <span className="px-2 py-0.5 font-mono font-bold text-[9px] bg-rose-100 text-rose-700 rounded uppercase">
                      {al.severity}
                    </span>
                  </div>
                  <p className="font-mono text-slate-600 text-[11px] leading-relaxed select-text">{al.details}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>IP address: {al.ip}</span>
                    <span>{al.timestamp}</span>
                  </div>
                </div>
              ))}

              {simState.alerts.length === 0 && (
                <div className="text-center py-10 text-slate-400 text-xs">
                  <Cpu className="w-7 h-7 mx-auto text-slate-300 animate-pulse mb-1.5" />
                  <p className="font-semibold text-slate-700">Threat engine active | Radar quiet</p>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-0.5">Stream logs containing injection tests to verify heuristic matches.</p>
                </div>
              )}
            </div>
          </div>

          {/* Real-time stats Accumulators Dashboard cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-sm text-xs">
              <span className="text-slate-400 font-semibold font-mono block mb-1">CUMULATIVE BANDWIDTH</span>
              <p className="text-xl font-display font-extrabold text-slate-900">
                {(simState.totalBandwidth / 1024).toFixed(2)} KB
              </p>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                Streamed on-the-fly dynamically
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-sm text-xs">
              <span className="text-slate-400 font-semibold font-mono block mb-1">TOTAL REQUESTS</span>
              <p className="text-xl font-display font-extrabold text-slate-900">
                {simState.scannedEntries.length} lines
              </p>
              <div className="text-[10px] text-indigo-600 font-semibold mt-1">
                Memory mapped index collections
              </div>
            </div>
          </div>

          {/* Simulated stdout Terminal view */}
          <div className="bg-slate-950 text-emerald-400 border border-slate-900 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center gap-1.5 mb-2.5 float-right">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center gap-2 mb-3 border-b border-slate-900 pb-2 text-slate-400 text-xs font-mono">
              <Terminal className="w-4 h-4" />
              <span>Modular Terminal stdout preview</span>
            </div>

            <div className="font-mono text-[10px] leading-relaxed space-y-1 max-h-56 overflow-y-auto pr-1">
              {simState.traceLog.map((log, li) => (
                <div key={li} className={`${
                  log.includes('[ALARM]') || log.includes('[ALERT]') ? 'text-rose-400 font-semibold' :
                  log.includes('[✔]') ? 'text-emerald-300 font-bold' :
                  'text-slate-350'
                }`}>
                  {log}
                </div>
              ))}

              {simState.status === 'idle' && (
                <div className="text-slate-500 italic select-none">
                  $ python3 main.py --logfile test_server.log<br/>
                  -- Waiting for stream parser command invocation... --
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
