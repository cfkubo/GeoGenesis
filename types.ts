export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TreeCheckIn {
  id: string;
  date: string; // ISO string
  imageUrl: string;
  aiHealthAnalysis: string;
  isHealthy: boolean;
}

export interface Tree {
  id: string;
  nickname: string;
  species: string;
  plantedDate: string; // ISO string
  location: Coordinates;
  imageUrl: string; // Initial planted photo
  checkIns: TreeCheckIn[];
  lastCheckInDate: string;
  status: 'healthy' | 'needs-attention' | 'verified';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  PLANT = 'PLANT',
  TREE_DETAILS = 'TREE_DETAILS',
  LOTTERY = 'LOTTERY',
}

export interface AiVerificationResult {
  isTree: boolean;
  species: string;
  healthAssessment: string;
  confidence: number;
  advice: string;
}

export interface AiProgressResult {
  isSameTree: boolean;
  growthDetected: boolean;
  healthStatus: 'healthy' | 'struggling' | 'dead';
  message: string;
}