/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Settings2, 
  HelpCircle, 
  Terminal, 
  FileCode2, 
  HardDrive,
  Cpu, 
  Bookmark, 
  HelpCircle as Brain,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

import FileFinderSimulator from './components/FileFinderSimulator';
import TerminalPreview from './components/TerminalPreview';
import CsTheorySection from './components/CsTheorySection';
import LogAnalyzerSimulator from './components/LogAnalyzerSimulator';
import LogTerminalPreview from './components/LogTerminalPreview';

type TabID = 'sandbox' | 'customizer' | 'theory' | 'pitch';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabID>('sandbox');
  const [projectType, setProjectType] = useState<'duplicate_finder' | 'log_analyzer'>('duplicate_finder');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative top ambient bar */}
      <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 w-full" />

      {/* Hero Header Area */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3 h-3" />
                PORTFOLIO BUNDLE
              </span>
              <span className="text-[10px] text-slate-400 font-mono">2 Production-ready scripts included</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-950 tracking-tight">
              {projectType === 'duplicate_finder' 
                ? 'Duplicate File Finder & Storage Analyzer' 
                : 'Security Log Analyzer & Threat Protection CLI'}
            </h1>
          </div>

          {/* Quick Dual Project Toggle */}
          <div className="flex bg-slate-100 border border-slate-200/60 p-1 rounded-xl text-xs font-bold gap-1 self-start md:self-center">
            <button
              onClick={() => { setProjectType('duplicate_finder'); }}
              id="toggle-proj-duplicate"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                projectType === 'duplicate_finder' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              📊 File Finder
            </button>
            <button
              onClick={() => { setProjectType('log_analyzer'); }}
              id="toggle-proj-logs"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                projectType === 'log_analyzer' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🛡️ Log Analyzer
            </button>
          </div>

          {/* Core high-contrast tabs selector */}
          <nav className="flex items-center bg-slate-100 border border-slate-200/60 rounded-xl p-1 text-xs font-semibold">
            <button
              id="tab-sandbox-btn"
              onClick={() => setActiveTab('sandbox')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'sandbox' 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Interactive Sandbox
            </button>
            <button
              id="tab-customizer-btn"
              onClick={() => setActiveTab('customizer')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'customizer' 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Script Customizer
            </button>
            <button
              id="tab-theory-btn"
              onClick={() => setActiveTab('theory')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'theory' 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              CS Lecture Room
            </button>
            <button
              id="tab-pitch-btn"
              onClick={() => setActiveTab('pitch')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'pitch' 
                  ? 'bg-white text-slate-950 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Recruiter Pitch Guide
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${projectType}_${activeTab}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'sandbox' && (
              projectType === 'duplicate_finder' ? <FileFinderSimulator /> : <LogAnalyzerSimulator />
            )}
            
            {activeTab === 'customizer' && (
              projectType === 'duplicate_finder' ? <TerminalPreview /> : <LogTerminalPreview />
            )}
            
            {activeTab === 'theory' && (
              projectType === 'duplicate_finder' ? <CsTheorySection /> : (
                <div className="space-y-6">
                  {/* Custom Log Analyzer Lecture Room */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                      🛡️ REGEX & INCIDENT DETECTION THEORY MODULE
                    </span>
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
                      Theory Board: Deep-Dive Computer Science of Security Parsers
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-4xl leading-relaxed">
                      Learn how standard Unix-like routers process and filter petabytes of live log data using compiled regular expressions, state machines, and constant time aggregation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">01</div>
                      <h4 className="font-display font-semibold text-slate-900 text-sm">Regex DFAs & State Trees</h4>
                      <p className="text-slate-500 text-xs leading-relaxed select-text">
                        Instead of scanning character streams with expensive index lookup arrays, compiled regular expressions build a deterministic finite automaton state tree that monitors boundaries recursively.
                      </p>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">02</div>
                      <h4 className="font-display font-semibold text-slate-900 text-sm">Stateful Threat Rules</h4>
                      <p className="text-slate-500 text-xs leading-relaxed select-text">
                        By checking parameters on logins or queries and triggering actions immediately on signature matches, we avoid running multiple scans over logs, reducing overall complexity.
                      </p>
                    </div>
                    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">03</div>
                      <h4 className="font-display font-semibold text-slate-900 text-sm">Stream Memory Safeties</h4>
                      <p className="text-slate-500 text-xs leading-relaxed select-text">
                        Reading files row-by-row allocates single memory buffer arrays. This guarantees $O(1)$ spatial complexity and avoids Out of Memory (OOM) terminal bottlenecks on large production systems.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
            
            {activeTab === 'pitch' && (
              projectType === 'duplicate_finder' ? (
                <div className="space-y-8">
                  {/* Intro pitch guide card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                      <Bookmark className="w-3.5 h-3.5" />
                      RECRUITER INTERVIEW PREPARATION
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-950 tracking-tight">
                      The Interview Pitch: How to Explain Your Script to Recruiters
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
                      When applying for systems roles or full-stack internships, interviewers will ask you to walk through your code step by step. 
                      This guide breaks down your tool's exact logic flow, and formats it as bullet points that fit perfectly on your resume or can be easily explained on a quick introductory call.
                    </p>
                  </div>

                  {/* Vertical Process Steps Flow */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {[
                      {
                        step: "01",
                        title: "Path Verification",
                        desc: "Validates files folders argument directories using os.path.isdir() to prevent operating system path errors.",
                        doc: "Requires validating directories prior to scanning so file streaming libraries don't trigger fatal directory-notfound loops."
                      },
                      {
                        step: "02",
                        title: "Recursive Tree Walk",
                        desc: "Descends into subfolders recursively using os.walk() to dynamically parse files.",
                        doc: "Leverages an automatic Deep-Search (DFS) traversal tree walk in-place to avoid building giant tracking structures in stack memory."
                      },
                      {
                        step: "03",
                        title: "Stream Block Buffer",
                        desc: "Reads files byte-by-byte in 4KB chunks using hashlib to calculate SHA-256 digital hashes.",
                        doc: "Prevents Out-Of-Memory (OOM) fatal core exceptions by indexing file binary signatures without full loading."
                      },
                      {
                        step: "04",
                        title: "O(1) Hash Map Index",
                        desc: "Registers file content hex hashes inside a dictionary mapping keys to path values.",
                        doc: "Resolves O(1) average hash mapping lookup speeds, avoiding costly pairwise file comparisons."
                      },
                      {
                        step: "05",
                        title: "Redundancy Audit",
                        desc: "Filters groups where len(paths) > 1, computing total wasted storage metrics safely.",
                        doc: "Evaluates exact storage reclaimed values by subtracting the original file capacity from cumulative sizes."
                      }
                    ].map((it, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-indigo-200 transition-colors">
                        <div className="space-y-3">
                          <span className="text-3xl font-display font-bold text-slate-200/80 block">
                            {it.step}
                          </span>
                          <h4 className="font-display font-semibold text-slate-950 text-base">
                            {it.title}
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {it.desc}
                          </p>
                        </div>
                        <div className="border-t border-slate-100 pt-3.5 mt-4 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                          <span>Recruiter Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pitch elevator scripts */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="max-w-3xl space-y-4">
                      <h3 className="font-display font-bold text-lg text-indigo-300">The 30-Second Elevator Pitch</h3>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed italic relative">
                        <span className="absolute -left-1.5 -top-3 text-6xl text-slate-800 pointer-events-none select-none">“</span>
                        "For this project, I engineered a highly optimised recursive duplicate detector strictly limiting ourselves to standard python modules. By trading small memory hash registers for quadratic loop steps, I used a Hash Map to reduce comparison durations down to a linear-time complexity of O(N) instead of the traditional naive O(N²) approach. Files are stream-buffered in 4KB blocks through a SHA-256 hasher, assuring high file verification accuracy while securing the system against out-of-memory crashes on large video assets."
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  {/* Intro pitch guide card */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                      <Bookmark className="w-3.5 h-3.5" />
                      RECRUITER INTERVIEW PREPARATION
                    </div>
                    <h2 className="text-2xl font-display font-bold text-slate-950 tracking-tight">
                      Log Analyzer Interview Blueprint
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-4xl">
                      Master the narrative when discussing your Modular Log Analyzer. Learn how to highlight key systems constraints, code cleanliness, and security patterns to showcase your engineering expertise.
                    </p>
                  </div>

                  {/* Operational Steps Flow */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        step: "01",
                        title: "Regex DFA Compiler",
                        desc: "Matches named capture blocks explicitly at system load time, bypassing parsing loop recompilation costs."
                      },
                      {
                        step: "02",
                        title: "Buffered Ingestion",
                        desc: "Implements memory stream pointer bindings, protecting system buffers from massive file OOM events."
                      },
                      {
                        step: "03",
                        title: "Heuristic Signature check",
                        desc: "Triggers proactive alarms during scans to immediately capture SQL attempts and path escapes."
                      },
                      {
                        step: "04",
                        title: "O(1) Map Aggregations",
                        desc: "Directs statistics collection over quick hash indexes, preventing nested sorting delays."
                      }
                    ].map((it, idx) => (
                      <div key={idx} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors">
                        <div className="space-y-3">
                          <span className="text-3xl font-display font-bold text-slate-200/80 block">
                            {it.step}
                          </span>
                          <h4 className="font-display font-semibold text-slate-950 text-base">
                            {it.title}
                          </h4>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {it.desc}
                          </p>
                        </div>
                        <div className="border-t border-slate-100 pt-3.5 mt-4 text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                          <span>Interview Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Elevator verbal pitch */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    <div className="max-w-3xl space-y-4">
                      <h3 className="font-display font-bold text-lg text-indigo-300">The 30-Second Security Pitch</h3>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed italic relative">
                        <span className="absolute -left-1.5 -top-3 text-6xl text-slate-800 pointer-events-none select-none">“</span>
                        "I designed a modular security event log analyzer in standard Python. To achieve high scalability, it ingests log lines in constant space O(1) buffer streams, preventing out-of-memory errors on massive production access dumps. Raw strings are validated through a pre-compiled regular expression, which directs matching boundaries into explicit IP, URI, and HTTP return codes. Then, signature heuristics process these records in real-time, instantly raising alerts for SQL insertions, path exploits, and brute force gate-access surges."
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            Portfolio Bundle Edition • Supporting Student Technical Portfolios
          </p>
          <p className="font-mono">
            MIT License • Standard Library Code Assets
          </p>
        </div>
      </footer>
    </div>
  );
}
