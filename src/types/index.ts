export type ThreatSeverity = 'Normal' | 'Low' | 'Medium' | 'High' | 'Critical';

export type AttackType = 'Normal' | 'DoS' | 'Fuzzy' | 'Gear' | 'RPM' | 'Spoofing' | string;

export type PredictionStatus = 'Normal' | 'Attack' | 'Warning' | string;

export interface PredictionCounts {
  Normal: number;
  DoS: number;
  Fuzzy: number;
  Gear: number;
  RPM: number;
  [key: string]: number;
}

export interface PredictionResponse {
  status: PredictionStatus;
  attack_percentage: number;
  attack_type: AttackType;
  confidence: number;
  counts: PredictionCounts;
  report_path: string;
}

export interface HistoryRecord {
  id: number;
  filename: string;
  status: PredictionStatus;
  attack_percentage: number;
  attack_type: AttackType;
  confidence: number;
  created_at: string;
  severity?: ThreatSeverity;
}

export interface CANPacket {
  id: string;
  timestamp: string;
  can_id: string;
  dlc: number;
  payload: string;
  prediction: 'Normal' | 'Attack' | 'Suspicious';
  attack_type: AttackType;
  severity: ThreatSeverity;
  confidence: number;
  signal_name?: string;
}

export interface VehicleStatus {
  speed: number;
  rpm: number;
  brake: boolean;
  gear: string;
  steeringAngle: number;
  busLoad: number;
  lastUpdated: string;
}

export type NotificationCategory =
  | 'attack'
  | 'backend'
  | 'model'
  | 'csv'
  | 'database'
  | 'can';

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'critical';

export interface SOCNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
}

export interface TransformerModelInfo {
  name: string;
  architecture: string;
  classes: string[];
  sequenceLength: number;
  inputFeatures: number;
  accuracy: number;
  inferenceTimeMs: number;
  version: string;
  datasetName: string;
  status: 'Ready' | 'Loaded' | 'Inferring' | 'Error';
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'offline';
  backendVersion: string;
  databaseConnected: boolean;
  canInterfaceStatus: 'active' | 'inactive' | 'error';
  socketCanConnected: boolean;
  cpuUsagePercent: number;
  gpuUsagePercent: number;
  memoryUsagePercent: number;
  activeSocketsCount: number;
  uptimeSeconds: number;
}

export type LiveStreamMode = 'real' | 'simulation';

