/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Settings2, 
  Terminal, 
  Download, 
  Sliders, 
  HelpCircle,
  FileCode2,
  Info
} from 'lucide-react';
import { GeneratorOptions, HashAlgorithm } from '../types';
import { generatePythonScript } from '../pyCodeGenerator';

export default function TerminalPreview() {
  const [options, setOptions] = useState<GeneratorOptions>({
    hashAlgorithm: 'sha256',
    blockSize: 4096,
    minSizeKb: 1,
    excludeHidden: true,
    excludeDirs: '.git, __pycache__, node_modules, venv, .idea',
    interactiveMode: true
  });

  const [copied, setCopied] = useState(false);
  
  const generatedScript = generatePythonScript(options);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'duplicate_analyzer.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Options Controller */}
        <div className="lg:col-span-4 bg-white border border-slate-100 p-5 rounded-3xl shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings2 className="w-4 h-4 text-indigo-600" />
            <h4 className="font-display font-bold text-sm text-slate-900">Script Customizer Specs</h4>
          </div>

          <div className="space-y-4">
            {/* Hash Engine select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Cryptographic Algorithm</span>
                <span className="text-[10px] text-slate-400 font-mono">hashlib modules</span>
              </label>
              <select
                value={options.hashAlgorithm}
                onChange={e => setOptions(prev => ({ ...prev, hashAlgorithm: e.target.value as HashAlgorithm }))}
                id="select-hash-algo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option value="sha256">SHA-256 (Best Hash Collision Resistance)</option>
                <option value="md5">MD5 (Faster / Legacy compatible)</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                SHA-256 creates a 64-character digest, guaranteeing collision safety. MD5 runs ~30% faster on tiny older CPUs.
              </p>
            </div>

            {/* Read block bounds */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Block Read Memory Buffer Size (Bytes)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1024, 4096, 8192].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setOptions(prev => ({ ...prev, blockSize: sz }))}
                    id={`btn-block-size-${sz}`}
                    className={`px-2 py-1.5 border rounded-lg text-xs font-mono font-medium text-center transition-colors ${
                      options.blockSize === sz 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {sz / 1024} KB
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                4096 Bytes matches standard OS storage sector block size boundaries, aligning cache buffers for dynamic IO speed.
              </p>
            </div>

            {/* Minimum filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Minimum Scanned Size (KB)
              </label>
              <input
                type="number"
                min="0"
                max="10240"
                value={options.minSizeKb}
                onChange={e => setOptions(prev => ({ ...prev, minSizeKb: parseInt(e.target.value) || 0 }))}
                id="input-min-size"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Prevents scans from bloating the database with 0-byte placeholders or tiny hidden configs.
              </p>
            </div>

            {/* Excluded recursive folders */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ignore Directory Names (Comma Separated)
              </label>
              <input
                type="text"
                value={options.excludeDirs}
                onChange={e => setOptions(prev => ({ ...prev, excludeDirs: e.target.value }))}
                id="input-ignore-dirs"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Removes binary artifacts, caching bins, and virtual folders (like node_modules) safely to decrease scanning time.
              </p>
            </div>

            {/* Hidden toggle options */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-semibold text-slate-700">Skip Hidden Files (Starting with '.')</span>
              <button
                type="button"
                onClick={() => setOptions(prev => ({ ...prev, excludeHidden: !prev.excludeHidden }))}
                id="toggle-exclude-hidden"
                className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${options.excludeHidden ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <span className={`w-4 h-4 bg-white rounded-full shadow block transition-transform ${options.excludeHidden ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Quick CS integration notice */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2 text-xs">
            <h5 className="font-semibold text-slate-800 font-display flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              Direct Copy & Download Built
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              This code complies directly with professional coding conventions: robust docstrings, exception handling, typing pointers, and strict standard library utilization.
            </p>
          </div>
        </div>

        {/* Right Python Code view */}
        <div className="lg:col-span-8 flex flex-col h-[650px] border border-slate-900 rounded-3xl bg-slate-950 shadow-xl overflow-hidden">
          {/* Header Action bar */}
          <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between border-b border-slate-750 shrink-0">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs text-white font-semibold">duplicate_analyzer.py (Custom Generated)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                id="copy-script-code"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-display font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Script'}
              </button>

              <button
                onClick={downloadScript}
                id="download-script-file"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-display font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow"
              >
                <Download className="w-3.5 h-3.5" />
                Download File
              </button>
            </div>
          </div>

          {/* Code text content area mock highlight */}
          <div className="flex-1 p-5 overflow-auto font-mono text-[11px] leading-relaxed select-text text-slate-300">
            <pre className="whitespace-pre">{generatedScript}</pre>
          </div>

          {/* Terminal installation directions */}
          <div className="bg-slate-900 border-t border-slate-850 p-4 shrink-0 font-mono text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-slate-200">How to run in your Terminal:</span>
            </div>
            
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 space-y-2 text-slate-300">
              <div>
                <span className="text-slate-500"># Step 1: Give script execute permissions</span>
                <p className="text-emerald-400">$ chmod +x duplicate_analyzer.py</p>
              </div>
              <div>
                <span className="text-slate-500"># Step 2: Execute script, specifying target folder argument (defaults to interactive input if omitted)</span>
                <p className="text-emerald-200">$ python3 duplicate_analyzer.py ~/Pictures</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
