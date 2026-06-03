/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Cpu, 
  Hash, 
  FolderTree, 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  LineChart,
  Zap,
  Info
} from 'lucide-react';

interface ConceptCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  complexity?: string;
  children: React.ReactNode;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ icon, title, subtitle, complexity, children }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-50 text-slate-700 rounded-xl border border-slate-100">
            {icon}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>
        {complexity && (
          <span className="px-2.5 py-1 text-xs font-mono font-semibold text-sky-700 bg-sky-50 rounded-full border border-sky-100">
            {complexity}
          </span>
        )}
      </div>
      <div className="text-slate-600 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
};

export default function CsTheorySection() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

  const interviewQAs = [
    {
      question: "What is a hash collision, and could this break your lookup dictionary?",
      answer: "A hash collision happens when two mathematically distinct input streams hash to the exact same digest. For a cryptographic algorithm like SHA-256, the probability of an accidental collision is astronomically raw—strictly lower than 1 in 2^256 (greater than atoms in the observable universe). Thus, collisions will not occur in general practice. If one does happen (e.g., in broken algorithms like MD5 if malicious inputs are purposefully engineered), Python dictionaries handle keys internally using a hash table with 'open addressing' using pseudo-random probing to resolve matching table indexes. In our script, the worst-case result would be falsely flagging two distinct files as duplicates."
    },
    {
      question: "Why use chunk-by-chunk stream buffering instead of just calling `file.read()`?",
      answer: "Performance safety. Reading structured files or assets in RAM wholly via `file.read()` allocates memory equal to the file size. If a user tries to scan a directory containing large files—such as a 4GB video asset—a direct load would trigger an Out-of-Memory (OOM) runtime exception and immediately crash the Python process. Loading files in small, standard block sizes (like 4096 bytes) bounds the maximum theoretical RAM footprint of the script to just a few kilobytes, ensuring memory efficiency and execution stability on lightweight servers with low resources."
    },
    {
      question: "How does the Walk phase avoid cyclic directory loops caused by Symbolic Links?",
      answer: "By default, python's standard library `os.walk()` does not traverse symbolic links directory branches unless you pass the argument `followlinks=True`. This design protects the engine from entering infinite recursive loops if a symbolic link points back to a parent boundary directory. Our implementation strictly honors this by ignoring links or skipping files that report `os.path.islink(path)` to maintain operating system loop safety."
    },
    {
      question: "Why is the time complexity of a Hash Map O(1) compared to a linear array check?",
      answer: "A standard array search requires looking at every item one by one (linear scan), yielding an O(N) complexity for a single lookup and O(N^2) for overall matches. A Hash Map (Python dictionary) maps the key through a mathematically deterministic hashing function that translates the input into a physical storage index in memory. Because we can index direct memory addresses in constant time O(1), looking up a hash is instant! This represents the holy grail of system design: exchanging negligible memory for complete constant-time lookup performance."
    }
  ];

  return (
    <div className="space-y-10" id="cs-theory-section">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-sm">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 text-indigo-300 pointer-events-none text-xs font-mono rounded-full border border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            CS PORTFOLIO ACCREDITATION
          </div>
          <h2 className="text-3xl font-display font-bold tracking-tight">
            The Computer Science Theories Behind Your File Finder
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Tech recruiters value developers who understand <strong className="text-indigo-200">why</strong> code works, not just how to copy-paste it. 
            This technical reference page defines the computer science algorithms, memory constraints, and data structure choices utilized inside your tool. Use these concepts to confidently present this project during dynamic interview panels.
          </p>
        </div>
      </div>

      {/* Grid of core CS principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConceptCard 
          icon={<Cpu className="w-5 h-5 text-indigo-600" />}
          title="Optimal Hash Map Storage"
          subtitle="Data Structure Theory"
          complexity="Lookup: O(1) Average"
        >
          <p>
            Instead of comparing file elements pairwise (which takes <strong className="text-slate-900 font-medium">O(N²)</strong> steps), we use Python's built-in <strong className="text-slate-900 font-medium">dictionary (Hash Map)</strong>.
          </p>
          <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-700">
            Dictionary Struct: <br/>
            {"{"} "9a0f...fd32": ["/docs/file.txt", "/backup/file.txt"] {"}"}
          </p>
          <p>
            When a new folder file is read, its hash index acts as a direct hash slot. Checking if that slot is already occupied takes a constant time lookup of <strong className="text-indigo-600 font-medium">O(1)</strong>, shrinking total scan computations down to <strong className="text-indigo-600 font-medium">O(N)</strong>.
          </p>
        </ConceptCard>

        <ConceptCard 
          icon={<Hash className="w-5 h-5 text-emerald-600" />}
          title="Digital Hashing vs. Descriptors"
          subtitle="Cryptographic Theory"
          complexity="Collision Risk: < 1 in 2²⁵⁶"
        >
          <p>
            Relying solely on metadata (like file names, file sizes, or system modification times) yields high false rates. Filenames are pointers that edit easily and have duplicates.
          </p>
          <p>
            By piping the actual raw bytes of a file into a cryptographic hash (either <strong className="text-slate-900 font-medium">MD5</strong> or <strong className="text-slate-900 font-medium">SHA-256</strong>), we create a secure math signature of the content.
          </p>
          <div className="flex items-start gap-2 text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100">
            <Zap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span>
              <strong>Avalanche Effect:</strong> If you modify even a single bit or space of a huge file, the cryptographic digestive hash output changes entirely!
            </span>
          </div>
        </ConceptCard>

        <ConceptCard 
          icon={<Layers className="w-5 h-5 text-blue-600" />}
          title="Block Buffering & Chunk streams"
          subtitle="Systems & Memory Architecture"
          complexity="RAM Footprint: O(Block Size)"
        >
          <p>
            Reading huge files entirely into memory at once creates critical out-of-memory bottlenecks.
          </p>
          <p>
            The project reads file elements recursively using binary read sizes of <strong className="text-slate-900 font-medium font-mono">4096 bytes</strong> (4KB). 4KB lines up with standard physical cluster sector allocations inside high-performance SSD and magnetic disk drives.
          </p>
          <p>
            This ensures alignment optimizations while protecting heap storage from runtime crashes.
          </p>
        </ConceptCard>

        <ConceptCard 
          icon={<FolderTree className="w-5 h-5 text-amber-600" />}
          title="Dynamic Directory Traversal"
          subtitle="Recursive Walk Algorithm"
          complexity="Time: O(Directory DFS)"
        >
          <p>
            Standard operating system folder architectures represent deeply nested <strong className="text-slate-900 font-medium">n-ary tree leaf structures</strong>.
          </p>
          <p>
            Python's standard <strong className="text-slate-900 font-medium">os.walk()</strong> executes a Deep Search traversal. It dynamically yields directory nodes recursively, making directory traversal memory-efficient:
          </p>
          <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-700">
            Yields: (current_dir, [subdirs], [filenames])
          </p>
        </ConceptCard>
      </div>

      {/* Visual O(1) vs O(N^2) Performance Comparison */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-base text-slate-900">Complexity Scalability Chart</h4>
            <p className="text-xs text-slate-500">Comparing Naive O(N²) Pairwise checks vs. HashMap O(N) Content indexation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="space-y-4 lg:col-span-1 text-sm bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h5 className="font-semibold text-slate-950 font-display">Linear Scale Breakdown</h5>
            <p className="text-slate-600 text-xs">
              When scanning folders with <strong>1,000 files</strong>:
            </p>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shrink-0" />
                <span><strong>Naive O(N²):</strong> ~500,000 comparisons</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0" />
                <span><strong>HashMap O(N):</strong> Exactly 1,000 hashes</span>
              </li>
            </ul>
            <div className="border-t border-slate-200/60 pt-3 flex items-center gap-2 text-indigo-600 font-semibold text-xs">
              <Zap className="w-4 h-4 shrink-0" />
              <span>HashMap is ~500x faster here!</span>
            </div>
          </div>

          <div className="lg:col-span-2 h-44 flex flex-col justify-between py-2 px-4 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl">
            <div className="flex-1 flex items-end justify-between relative h-full">
              {/* Vertical scales */}
              <div className="absolute left-0 bottom-0 top-0 border-l border-slate-200 font-mono text-[9px] text-slate-400 pl-1.5 flex flex-col justify-between pointer-events-none select-none">
                <span>1 Million Loops</span>
                <span>500k Loops</span>
                <span>0 Loops</span>
              </div>

              {/* Chart lines representation */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
                {/* O(N^2) Red Curve */}
                <path 
                  d="M 50,150 Q 150,140 320,10" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="3.5" 
                  strokeDasharray="1 0"
                  className="animate-pulse"
                />
                
                {/* O(N) Emerald Line */}
                <line 
                  x1="50" y1="150" 
                  x2="320" y2="140" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                />
              </svg>

              {/* Legend overlay */}
              <div className="absolute right-4 top-2 bg-white px-2.5 py-1 text-[10px] font-mono border border-slate-100 rounded-md shadow-sm space-y-1 z-10">
                <div className="flex items-center gap-1.5 font-medium text-rose-600">
                  <span className="w-2 h-2 rounded-full bg-rose-500 block" /> Pairwise Check O(N²)
                </div>
                <div className="flex items-center gap-1.5 font-medium text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block" /> HashMap Scanner O(N)
                </div>
              </div>
            </div>
            {/* X Axis */}
            <div className="border-t border-slate-200 mt-1 pt-1 flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 files</span>
              <span>250 files</span>
              <span>500 files</span>
              <span>1,000 files (Scale limit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Prep Q&A Flashcards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-display font-bold text-slate-900">Technical Interview Q&A Flashcards</h3>
        </div>
        <p className="text-xs text-slate-500">
          Prepare for common portfolio presentation questions and show recruiters that you are an authority on systems coding.
        </p>

        <div className="space-y-3.5">
          {interviewQAs.map((qa, idx) => {
            const isOpen = activeQuestion === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${isOpen ? 'border-indigo-200 ring-2 ring-indigo-50/50' : 'border-slate-100'}`}
              >
                <button
                  onClick={() => setActiveQuestion(isOpen ? null : idx)}
                  id={`interview-q-${idx}`}
                  className="w-full text-left px-6 py-4.5 flex items-center justify-between gap-4 font-medium"
                >
                  <span className="text-slate-900 text-sm font-semibold tracking-tight">{qa.question}</span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-500" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 pt-4 bg-slate-50/50 pr-8">
                        {qa.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
