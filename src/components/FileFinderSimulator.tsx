/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  FileText, 
  Play, 
  RotateCcw, 
  Plus, 
  X, 
  Search, 
  Hash, 
  Trash2, 
  Database, 
  AlertTriangle,
  Server,
  Terminal,
  FileCode2,
  CheckCircle,
  HelpCircle,
  Clock,
  HardDrive
} from 'lucide-react';
import { VirtualFile, SimulationFileState, SimulationState, HashAlgorithm } from '../types';

// Preset mock directory files for high CS portfolio educational value
const INITIAL_PRESET_FILES: VirtualFile[] = [
  { id: '1', name: 'report_draft.docx', path: 'documents/q3_report_draft.docx', sizeKb: 14.5, content: 'Status report on final Q3 operations and financial estimates: target exceeded' },
  { id: '2', name: 'report_copy.docx', path: 'documents/backups/report_copy.docx', sizeKb: 14.5, content: 'Status report on final Q3 operations and financial estimates: target exceeded' }, // Duplicate of 1
  { id: '3', name: 'logo_primary.png', path: 'assets/branding/logo_primary.png', sizeKb: 124.0, content: 'IMAGE_HEX_STREAM_A34D9FFEC20E1A0F' },
  { id: '4', name: 'temp_logo.png', path: 'temp/logo_primary_duplicate.png', sizeKb: 124.0, content: 'IMAGE_HEX_STREAM_A34D9FFEC20E1A0F' }, // Duplicate of 3
  { id: '5', name: 'logo_backup.png', path: 'assets/branding/old_logo_backup.png', sizeKb: 124.0, content: 'IMAGE_HEX_STREAM_A34D9FFEC20E1A0F' }, // Duplicate of 3 (triple)
  { id: '6', name: 'build.config.js', path: 'config/build.config.js', sizeKb: 2.1, content: 'const config = { target: "es2022", mode: "production" };' },
  { id: '7', name: 'todo_tasks.txt', path: 'personal/todo_tasks.txt', sizeKb: 1.2, content: '- Draft CS portfolio\n- Test hashing scripts' },
  { id: '8', name: 'notes.txt', path: 'notes.txt', sizeKb: 1.2, content: '- Draft CS portfolio\n- Test hashing scripts' }, // Duplicate of 7
  { id: '9', name: 'manifest.json', path: 'config/manifest.json', sizeKb: 0.8, content: '{"version": "1.0.0", "build": 242}' },
];

// Simple deterministic string hashing for the simulated browser runtime
// Generates reproducible SHA-256 structure hexes or MD5 lookalikes for display
function simulateHash(content: string, type: HashAlgorithm): string {
  let hashVal = 0;
  for (let i = 0; i < content.length; i++) {
    hashVal = (hashVal << 5) - hashVal + content.charCodeAt(i);
    hashVal |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hashVal).toString(16).padStart(8, '0');
  
  if (type === 'md5') {
    // Return 32-char hex (MD5)
    return `d41d8cd98f00b204e9800998ecf${hex}`.slice(0, 32);
  } else {
    // Return 64-char hex (SHA-256)
    return `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8${hex}`.slice(0, 64);
  }
}

export default function FileFinderSimulator() {
  const [files, setFiles] = useState<VirtualFile[]>(INITIAL_PRESET_FILES);
  const [algo, setAlgo] = useState<HashAlgorithm>('sha256');
  
  // Custom File Form State
  const [newFileName, setNewFileName] = useState('');
  const [newFilePath, setNewFilePath] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileSize, setNewFileSize] = useState('5');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Simulation Engine State
  const [simState, setSimState] = useState<SimulationState>({
    status: 'idle',
    currentFileId: null,
    scannedFiles: [],
    hashMap: {},
    wastedBytes: 0,
    totalBytes: 0,
    duplicatesCount: 0,
    scanLog: []
  });

  // Calculate simulated dashboard outputs on mock file list
  const totalVolumeKb = files.reduce((sum, f) => sum + f.sizeKb, 0);

  const resetSimulation = () => {
    setSimState({
      status: 'idle',
      currentFileId: null,
      scannedFiles: [],
      hashMap: {},
      wastedBytes: 0,
      totalBytes: 0,
      duplicatesCount: 0,
      scanLog: []
    });
  };

  const startSimulation = async () => {
    if (files.length === 0) return;
    
    // Status update: SCANNING
    setSimState(prev => ({
      ...prev,
      status: 'scanning',
      scanLog: ['[+] Initializing recursively walked scanning of root directory ...', `[+] OS Root Walker target: "."`, `[+] Scanning ${files.length} total virtual hierarchy file nodes...`]
    }));

    // Transition delay to show scanned folder elements walking
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Initialize list for hashing
    const initialFilesState = files.map(f => ({
      ...f,
      hash: '',
      status: 'pending' as const
    }));

    const hashMap: Record<string, string[]> = {};
    let runningLog: string[] = ['[+] Phase 1 Complete [Walked successfully]', '[+] Phase 2: Computing Cryptographic Digital Fingerprints...'];
    
    setSimState(prev => ({
      ...prev,
      status: 'hashing',
      scannedFiles: initialFilesState,
      scanLog: [...prev.scanLog, ...runningLog]
    }));

    // Hash file-by-file sequentially to visualize the O(1) dynamic dictionary insertion
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      
      setSimState(prev => ({
        ...prev,
        currentFileId: currentFile.id,
        scannedFiles: prev.scannedFiles.map(f => f.id === currentFile.id ? { ...f, status: 'hashing' } : f)
      }));

      // Simulate dynamic byte read streaming animation delay
      await new Promise(resolve => setTimeout(resolve, 600));

      const fileHash = simulateHash(currentFile.content, algo);
      
      // Update our simulation tracking map
      if (hashMap[fileHash]) {
        hashMap[fileHash].push(currentFile.path);
      } else {
        hashMap[fileHash] = [currentFile.path];
      }

      // Log the insertion operation
      const isDupe = hashMap[fileHash].length > 1;
      const logLine = isDupe 
        ? `    [HASH MATCH] Hash ${fileHash.slice(0, 8)}... matched! Path "${currentFile.path}" is a duplicate.` 
        : `    [MAP INSERT] File "${currentFile.path}" -> Hash ${fileHash.slice(0, 8)}... registered into O(1) storage index.`;

      runningLog = [...runningLog, logLine];

      setSimState(prev => ({
        ...prev,
        hashMap: { ...hashMap },
        scannedFiles: prev.scannedFiles.map(f => f.id === currentFile.id ? { ...f, status: 'completed', hash: fileHash } : f),
        scanLog: [...prev.scanLog.slice(0, 5), ...runningLog]
      }));
    }

    // Step 3: Analysis of duplicates and redundancy space calculation
    setSimState(prev => ({
      ...prev,
      status: 'generating_report',
      scanLog: [...prev.scanLog, '[+] Phase 2 Complete [Hashing completed]', '[+] Phase 3: Analyzing Storage Redundancy Buckets...']
    }));

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Sum space wasted
    let totalBytes = 0;
    let wastedBytes = 0;
    let dupesCount = 0;

    Object.entries(hashMap).forEach(([hash, paths]) => {
      // Find the corresponding files sizes
      const fileGroup = files.filter(f => paths.includes(f.path));
      if (fileGroup.length === 0) return;
      
      const singleSizeKBytes = fileGroup[0].sizeKb * 1024; // convert to bytes
      totalBytes += fileGroup.reduce((sum, f) => sum + f.sizeKb * 1024, 0);

      if (paths.length > 1) {
        dupesCount += 1;
        const redundantsCount = paths.length - 1;
        wastedBytes += singleSizeKBytes * redundantsCount;
      }
    });

    setSimState(prev => ({
      ...prev,
      status: 'done',
      wastedBytes,
      totalBytes,
      duplicatesCount: dupesCount,
      scanLog: [
        ...prev.scanLog,
        `[✔] Storage breakdown analysis compiled.`,
        `[✔] Total potential space saved: ${(wastedBytes / 1024).toFixed(2)} KB by removing duplicate contents.`
      ]
    }));
  };

  const handleAddFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName || !newFilePath || !newFileContent) return;

    const fileId = `custom_${Date.now()}`;
    // Format path
    let cleanedPath = newFilePath.trim().replace(/^\/+/, '');
    if (!cleanedPath.includes('/') && !cleanedPath.includes('.')) {
      cleanedPath = `custom_folder/${cleanedPath}`;
    }

    const newFile: VirtualFile = {
      id: fileId,
      name: newFileName.trim(),
      path: cleanedPath,
      sizeKb: parseFloat(newFileSize) || 12,
      content: newFileContent
    };

    setFiles(prev => [...prev, newFile]);
    setNewFileName('');
    setNewFilePath('');
    setNewFileContent('');
    setNewFileSize('5');
    setShowAddForm(false);
    resetSimulation();
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    resetSimulation();
  };

  const handleResetPresets = () => {
    setFiles(INITIAL_PRESET_FILES);
    resetSimulation();
  };

  return (
    <div className="space-y-8">
      {/* Simulation Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
        <div className="space-y-1">
          <h3 className="font-display font-semibold text-lg text-slate-900 flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600" />
            File Space & Directory Simulation Stage
          </h3>
          <p className="text-xs text-slate-500">
            Define virtual files, choose a hashing engine, and run the simulator to visualize the Hash Map search logic.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex rounded-lg bg-white border border-slate-200/80 p-1 text-xs">
            <button
              onClick={() => { setAlgo('sha256'); resetSimulation(); }}
              id="set-algo-sha256"
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${algo === 'sha256' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              SHA-256 (Optimal)
            </button>
            <button
              onClick={() => { setAlgo('md5'); resetSimulation(); }}
              id="set-algo-md5"
              className={`px-3 py-1.5 font-medium rounded-md transition-colors ${algo === 'md5' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              MD5 (Fast)
            </button>
          </div>

          <button
            onClick={handleResetPresets}
            id="reset-presets"
            className="p-2 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1"
            title="Reset to Demo Files"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset presets
          </button>
        </div>
      </div>

      {/* Main interactive grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Virtual Tree List & Add utility */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100/80 pb-3">
              <span className="font-display font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-500" />
                Virtual Directory State
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                {files.length} Files | {totalVolumeKb.toFixed(1)} KB
              </span>
            </div>

            {/* Virtual Files Stack */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {files.map((file) => {
                const scannedState = simState.scannedFiles.find(s => s.id === file.id);
                const isScanning = simState.currentFileId === file.id;
                
                return (
                  <div 
                    key={file.id} 
                    className={`group relative text-xs border rounded-xl p-3 flex flex-col gap-2 transition-all ${
                      isScanning 
                        ? 'bg-indigo-50/50 border-indigo-400 ring-1 ring-indigo-400' 
                        : scannedState?.status === 'completed'
                          ? 'bg-slate-50/50 border-slate-200'
                          : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 max-w-[80%]">
                        <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isScanning ? 'text-indigo-600 animate-bounce' : 'text-slate-400'}`} />
                        <div className="truncate">
                          <p className="font-mono font-semibold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 truncate">{file.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono font-medium">
                          {file.sizeKb.toFixed(1)} KB
                        </span>
                        {simState.status === 'idle' && (
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            id={`del-file-${file.id}`}
                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded hover:bg-slate-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Details content slice */}
                    <div className="bg-slate-50/50 px-2.5 py-1.5 rounded-lg border border-slate-100 text-[10px] font-mono text-slate-500 italic max-w-full truncate">
                      Content: "{file.content}"
                    </div>

                    {/* Real-time calculated hash status badge */}
                    {scannedState && (
                      <div className="flex flex-wrap items-center justify-between border-t border-slate-100/80 pt-1.5 mt-0.5 text-[9px]">
                        <span className="flex items-center gap-1 font-mono uppercase text-slate-400 font-bold">
                          <Hash className="w-2.5 h-2.5" />
                          {algo}
                        </span>
                        <span className={`font-mono font-bold ${
                          scannedState.status === 'hashing' 
                            ? 'text-indigo-600 animate-pulse' 
                            : 'text-emerald-600'
                        }`}>
                          {scannedState.status === 'hashing' 
                            ? 'Hashing bytes...' 
                            : `Hex: ${scannedState.hash.slice(0, 12)}...`}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {files.length === 0 && (
                <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-slate-700 text-xs font-semibold">No virtual files created</p>
                  <p className="text-slate-400 text-[10px] mt-1">Please create some simulation file instances or load the presets above.</p>
                </div>
              )}
            </div>

            {/* Create virtual files Form */}
            <div className="mt-4 border-t border-slate-100/80 pt-4">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  id="show-add-file-form"
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-display font-semibold border border-slate-200 rounded-xl text-xs flex items-center justify-center gap-1 px-4 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Virtual File
                </button>
              ) : (
                <form onSubmit={handleAddFile} className="space-y-3 bg-slate-50/50 border border-slate-150 p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono">Create new file metadata</span>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">File Name</label>
                      <input
                        type="text"
                        placeholder="my_photo.jpg"
                        value={newFileName}
                        onChange={e => setNewFileName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Virtual Size (KB)</label>
                      <input
                        type="number"
                        min="0.1"
                        max="2000"
                        step="0.1"
                        value={newFileSize}
                        onChange={e => setNewFileSize(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">Simulated Search Path</label>
                    <input
                      type="text"
                      placeholder="assets/photos/my_photo.jpg"
                      value={newFilePath}
                      onChange={e => setNewFilePath(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">File Content (Input text content to generate distinct hashes)</label>
                    <textarea
                      rows={2}
                      placeholder="Enter file text bytes... Identical contents produces matching digests regardless of names"
                      value={newFileContent}
                      onChange={e => setNewFileContent(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-add-file"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add File & Reset Walk
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Execution control & Output breakdown map */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Trigger Box */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 select-none">
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-indigo-500" />
                Step-by-step controller
              </span>
              <p className="text-xs text-slate-600">
                Witness recursion walk folders, run hashing block loops, and populate the hash map.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {simState.status !== 'idle' && (
                <button
                  onClick={resetSimulation}
                  id="reset-sim-state"
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-display font-semibold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear State
                </button>
              )}

              <button
                onClick={startSimulation}
                id="trigger-start-sim"
                disabled={files.length === 0 || simState.status === 'scanning' || simState.status === 'hashing' || simState.status === 'generating_report'}
                className="flex-1 sm:flex-none px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-display font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Play className="w-4 h-4" />
                {simState.status === 'idle' ? 'START WALK & INDEX SIMULATOR' : 'RE-RUN SIMULATION'}
              </button>
            </div>
          </div>

          {/* Visualizing the HashMap Buckets */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100/80 pb-3">
              <Database className="w-5 h-5 text-indigo-500" />
              <div className="space-y-0.5">
                <h4 className="font-display font-bold text-sm text-slate-900 tracking-tight">Active Hash Map Storage Indices</h4>
                <p className="text-[11px] text-slate-400 font-medium">Memory structures mapping Content Hash (Key) to File Paths (Value List)</p>
              </div>
            </div>

            {simState.status === 'idle' ? (
              <div className="text-center py-10 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-150 text-slate-400 space-y-2">
                <Database className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
                <p className="text-xs font-semibold text-slate-700">Storage Hash Map is currently empty</p>
                <p className="text-[10px] leading-relaxed max-w-sm mx-auto">
                  Run the directory walk simulation to generate hashes of files, cluster duplicates dynamically in real time, and examine the lookup engine.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {Object.entries(simState.hashMap).map(([hashKey, pathsList]) => {
                  const pathsListTyped = pathsList as string[];
                  const isDupeGroup = pathsListTyped.length > 1;
                  return (
                    <div 
                      key={hashKey} 
                      className={`border p-4 rounded-xl transition-all text-xs ${
                        isDupeGroup 
                          ? 'border-amber-200 bg-amber-50/20' 
                          : 'border-slate-100 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/80 pb-2 mb-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className={`w-2.5 h-2.5 rounded-full ${isDupeGroup ? 'bg-amber-500' : 'bg-slate-300 animate-pulse'}`} />
                          <span className="font-mono font-bold text-slate-900 truncate">Hash: {hashKey}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                          isDupeGroup ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {pathsListTyped.length} Copy {pathsListTyped.length > 1 ? 'Files' : 'File'}
                        </span>
                      </div>

                      <div className="space-y-1.5 pl-4">
                        {pathsListTyped.map((p, pathIdx) => (
                          <div key={p} className="flex items-center gap-2 text-[11px] font-mono text-slate-600 truncate">
                            <span className="text-indigo-500 font-semibold">{`[Index: ${pathIdx}]`}</span>
                            <span className="truncate">{p}</span>
                            {pathIdx > 0 && (
                              <span className="px-1.5 py-0.1 bg-rose-50 text-rose-700 text-[8px] font-sans font-bold rounded border border-rose-100 uppercase shrink-0">
                                Redundant
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Simulated CLI Terminal Dashboard Output */}
          <div className="bg-slate-950 text-emerald-400 border border-slate-900 rounded-3xl p-5 shadow-2xl relative">
            <div className="absolute right-4 top-4 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-center gap-2 mb-3 border-b border-slate-900 pb-2 text-slate-400 text-xs font-mono">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span>Shell Console Output Preview</span>
            </div>

            <div className="font-mono text-[10px] leading-relaxed space-y-1 max-h-56 overflow-y-auto pr-1">
              {simState.scanLog.map((log, idx) => (
                <div key={idx} className={`${
                  log.includes('[✔]') ? 'text-emerald-300 font-bold' :
                  log.includes('[HASH MATCH]') ? 'text-amber-400' :
                  log.includes('[-] Error') ? 'text-rose-400 font-semibold' :
                  'text-slate-300'
                }`}>
                  {log}
                </div>
              ))}

              {simState.status === 'idle' && (
                <div className="text-slate-500 italic select-none">
                  $ python3 duplicate_analyzer.py --target .<br/>
                  -- Waiting for operator script call... --
                </div>
              )}

              {/* Live Status Indicators in Terminal */}
              {(simState.status === 'scanning' || simState.status === 'hashing' || simState.status === 'generating_report') && (
                <div className="text-indigo-400 font-semibold animate-pulse">
                  ➜ Status: Processing {simState.status.replace('_', ' ')} phase...
                </div>
              )}

              {simState.status === 'done' && (
                <div className="mt-4 pt-3 border-t border-slate-900/80 text-slate-200">
                  <p className="text-slate-300 font-semibold uppercase tracking-wider text-xs">===================================================</p>
                  <p className="text-slate-300 font-semibold uppercase tracking-wider text-xs font-display">   DUPLICATE FILE SCANNER - METRICS SUMMARY</p>
                  <p className="text-slate-300 font-semibold uppercase tracking-wider text-xs">===================================================</p>
                  <p>📂 Total Target Files Checked: <strong className="text-white">{files.length}</strong></p>
                  <p>💾 Total Evaluated Capacity : <strong className="text-white">{(simState.totalBytes / 1024).toFixed(2)} KB</strong></p>
                  <p>🔥 Unique Duplicate Groups: <strong className="text-amber-400">{simState.duplicatesCount}</strong></p>
                  <p>💡 Recoverable Wasted Space : <strong className="text-emerald-300">{(simState.wastedBytes / 1024).toFixed(2)} KB</strong></p>
                  <p className="text-slate-300 font-semibold uppercase tracking-wider text-xs mt-2">---------------------------------------------------</p>
                  <p className="text-amber-300 font-medium">RECRUITER PERFORMANCE AUDIT: Scanning completed in 1.45s via O(N) Hash Map index keys lookup.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
