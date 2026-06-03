/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HashAlgorithm = 'md5' | 'sha256';

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  sizeKb: number;
  content: string;
}

export interface SimulationFileState extends VirtualFile {
  hash: string;
  status: 'pending' | 'hashing' | 'completed';
}

export interface SimulationState {
  status: 'idle' | 'scanning' | 'hashing' | 'generating_report' | 'done';
  currentFileId: string | null;
  scannedFiles: SimulationFileState[];
  hashMap: Record<string, string[]>; // hash -> array of file paths
  wastedBytes: number;
  totalBytes: number;
  duplicatesCount: number;
  scanLog: string[];
}

export interface GeneratorOptions {
  hashAlgorithm: HashAlgorithm;
  blockSize: number;
  minSizeKb: number;
  excludeHidden: boolean;
  excludeDirs: string;
  interactiveMode: boolean;
}

export type LogScenario = 'normal' | 'sqli' | 'traversal' | 'bruteforce';

export interface LogEntry {
  id: string;
  ip: string;
  timestamp: string;
  method: string;
  request: string;
  status: string;
  size: number;
  userAgent: string;
  scenario: LogScenario;
}

export interface SecurityAlert {
  type: string;
  ip: string;
  timestamp: string;
  severity: 'HIGH' | 'CRITICAL' | 'WARNING';
  details: string;
}

export interface LogSimulationState {
  status: 'idle' | 'parsing' | 'reporting' | 'done';
  currentEntryId: string | null;
  scannedEntries: string[];
  totalBandwidth: number;
  ipCounts: Record<string, number>;
  endpointCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  alerts: SecurityAlert[];
  traceLog: string[];
}

