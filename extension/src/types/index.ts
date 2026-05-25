/**
 * Type definitions for AI Study Assistant Extension
 */

// User authentication types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: number;
  pairedDevices: string[];
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Content extraction types
export interface ExtractedContent {
  title: string;
  url: string;
  text: string;
  cleanText: string;
  wordCount: number;
  language: string;
  timestamp: number;
}

// AI processing types
export interface AIRequest {
  content: string;
  action: 'summarize' | 'extract-key-points' | 'generate-quiz' | 'analyze';
  maxLength?: number;
  language?: string;
}

export interface AIResponse {
  id: string;
  requestId: string;
  action: string;
  result: string | Record<string, unknown>;
  tokensUsed: number;
  processingTime: number;
  timestamp: number;
}

// Sync types
export interface SyncPayload {
  userId: string;
  deviceId: string;
  content: ExtractedContent;
  aiResponse: AIResponse;
  timestamp: number;
  encrypted: boolean;
}

export interface DevicePairing {
  userId: string;
  deviceId: string;
  deviceName: string;
  pairedAt: number;
  publicKey: string;
  lastSyncAt?: number;
}

// Storage types
export interface StoredSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  deviceId: string;
}

export interface StoredPreferences {
  apiProvider: 'openai' | 'anthropic';
  maxTokens: number;
  language: string;
  autoSync: boolean;
  encryptionEnabled: boolean;
  theme: 'light' | 'dark';
}

// Message types for communication
export interface ExtensionMessage {
  type: 'EXTRACT_CONTENT' | 'ANALYZE' | 'SYNC' | 'AUTH' | 'STATUS';
  payload: unknown;
  requestId?: string;
}

export interface ExtensionResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  requestId?: string;
}

// Real-time sync types
export interface RealtimeSyncUpdate {
  type: 'content' | 'response' | 'status' | 'error';
  data: unknown;
  timestamp: number;
  deviceId: string;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: number;
}

export interface APIError extends AppError {
  statusCode: number;
  endpoint: string;
}
