/**
 * Storage utilities for managing extension state and user data
 * Uses Chrome Storage API with fallback to localStorage
 */

import { StoredSession, StoredPreferences, ExtractedContent } from '../types';

class StorageService {
  private readonly STORAGE_KEYS = {
    SESSION: 'ai_assistant_session',
    PREFERENCES: 'ai_assistant_preferences',
    HISTORY: 'ai_assistant_history',
    ENCRYPTION_KEY: 'ai_assistant_encryption_key',
  };

  /**
   * Save user session
   * @param session - Session data to save
   */
  async saveSession(session: Partial<StoredSession>): Promise<void> {
    try {
      const existingSession = (await this.getSession()) || {};
      const updatedSession = { ...existingSession, ...session };

      return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [this.STORAGE_KEYS.SESSION]: updatedSession }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  /**
   * Retrieve stored session
   * @returns Stored session or null
   */
  async getSession(): Promise<StoredSession | null> {
    try {
      return new Promise((resolve) => {
        chrome.storage.sync.get([this.STORAGE_KEYS.SESSION], (result) => {
          resolve(result[this.STORAGE_KEYS.SESSION] || null);
        });
      });
    } catch (error) {
      console.error('Error retrieving session:', error);
      return null;
    }
  }

  /**
   * Get access token
   * @returns Access token or null
   */
  async getAccessToken(): Promise<string | null> {
    const session = await this.getSession();
    if (session && session.accessToken) {
      // Check if token has expired
      if (session.expiresAt && session.expiresAt > Date.now()) {
        return session.accessToken;
      }
    }
    return null;
  }

  /**
   * Get refresh token
   * @returns Refresh token or null
   */
  async getRefreshToken(): Promise<string | null> {
    const session = await this.getSession();
    return session?.refreshToken || null;
  }

  /**
   * Check if user is authenticated
   * @returns True if user has valid session
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  }

  /**
   * Clear stored session
   */
  async clearSession(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.remove([this.STORAGE_KEYS.SESSION], () => {
        resolve();
      });
    });
  }

  /**
   * Save user preferences
   * @param preferences - Preferences to save
   */
  async savePreferences(preferences: Partial<StoredPreferences>): Promise<void> {
    try {
      const existing = (await this.getPreferences()) || this.getDefaultPreferences();
      const updated = { ...existing, ...preferences };

      return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [this.STORAGE_KEYS.PREFERENCES]: updated }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  /**
   * Retrieve stored preferences
   * @returns Stored preferences or defaults
   */
  async getPreferences(): Promise<StoredPreferences> {
    try {
      return new Promise((resolve) => {
        chrome.storage.sync.get([this.STORAGE_KEYS.PREFERENCES], (result) => {
          resolve(result[this.STORAGE_KEYS.PREFERENCES] || this.getDefaultPreferences());
        });
      });
    } catch (error) {
      console.error('Error retrieving preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default preferences
   * @returns Default preference values
   */
  private getDefaultPreferences(): StoredPreferences {
    return {
      apiProvider: 'openai',
      maxTokens: 2000,
      language: 'en',
      autoSync: true,
      encryptionEnabled: true,
      theme: 'light',
    };
  }

  /**
   * Check if encryption is enabled
   * @returns True if encryption is enabled
   */
  async isEncryptionEnabled(): Promise<boolean> {
    const prefs = await this.getPreferences();
    return prefs.encryptionEnabled;
  }

  /**
   * Save content to history
   * @param content - Content to save
   */
  async addToHistory(content: ExtractedContent): Promise<void> {
    try {
      const history = (await this.getHistory()) || [];
      // Keep only last 50 items
      const updated = [content, ...history].slice(0, 50);

      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [this.STORAGE_KEYS.HISTORY]: updated }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error adding to history:', error);
      throw error;
    }
  }

  /**
   * Get content history
   * @returns Array of previously extracted content
   */
  async getHistory(): Promise<ExtractedContent[]> {
    try {
      return new Promise((resolve) => {
        chrome.storage.local.get([this.STORAGE_KEYS.HISTORY], (result) => {
          resolve(result[this.STORAGE_KEYS.HISTORY] || []);
        });
      });
    } catch (error) {
      console.error('Error retrieving history:', error);
      return [];
    }
  }

  /**
   * Clear content history
   */
  async clearHistory(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove([this.STORAGE_KEYS.HISTORY], () => {
        resolve();
      });
    });
  }
}

// Export singleton instance
export default new StorageService();
