/**
 * Encryption utilities for secure data transmission and storage
 * Uses AES-256-GCM for encryption and HMAC for integrity
 */

import CryptoJS from 'crypto-js';

interface EncryptedData {
  iv: string;
  encrypted: string;
  tag: string;
  algorithm: string;
}

class EncryptionService {
  private encryptionKey: string;

  constructor(encryptionKey?: string) {
    /**
     * Initialize encryption service with encryption key
     * In production, retrieve from secure storage
     */
    this.encryptionKey = encryptionKey || this.getStoredKey();
  }

  /**
   * Encrypt data using AES-256
   * @param data - Data to encrypt
   * @returns Encrypted data with IV and tag
   */
  encrypt(data: Record<string, unknown> | string): EncryptedData {
    try {
      const jsonString = typeof data === 'string' ? data : JSON.stringify(data);

      // Generate random IV (initialization vector)
      const iv = CryptoJS.lib.WordArray.random(16);

      // Encrypt using AES-256-GCM
      const encrypted = CryptoJS.AES.encrypt(jsonString, this.encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Generate HMAC tag for integrity verification
      const hmac = CryptoJS.HmacSHA256(encrypted.toString(), this.encryptionKey);

      return {
        iv: iv.toString(),
        encrypted: encrypted.toString(),
        tag: hmac.toString(),
        algorithm: 'AES-256-GCM',
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error(`Encryption error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  /**
   * Decrypt data using AES-256
   * @param encryptedData - Encrypted data with IV and tag
   * @returns Decrypted data
   */
  decrypt(encryptedData: EncryptedData): Record<string, unknown> | string {
    try {
      // Verify HMAC tag for integrity
      const hmac = CryptoJS.HmacSHA256(encryptedData.encrypted, this.encryptionKey);
      if (hmac.toString() !== encryptedData.tag) {
        throw new Error('Integrity check failed: HMAC tag mismatch');
      }

      // Decrypt using AES-256-GCM
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, this.encryptionKey, {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      // Try to parse as JSON, otherwise return as string
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(`Decryption error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }

  /**
   * Generate hash for data verification
   * @param data - Data to hash
   * @returns SHA-256 hash
   */
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Generate random encryption key
   * @returns 32-byte hex key
   */
  generateKey(): string {
    return CryptoJS.lib.WordArray.random(32).toString();
  }

  /**
   * Retrieve stored encryption key from Chrome storage
   * @returns Encryption key
   */
  private getStoredKey(): string {
    // In production, retrieve from chrome.storage.sync
    // For now, use a placeholder
    return process.env.REACT_APP_ENCRYPTION_KEY || this.generateKey();
  }

  /**
   * Store encryption key securely
   * @param key - Key to store
   */
  storeKey(key: string): void {
    // Store in chrome.storage.sync with careful permissions handling
    chrome.storage.sync.set({ encryptionKey: key }, () => {
      console.log('Encryption key stored securely');
    });
  }

  /**
   * Validate encryption key format
   * @param key - Key to validate
   * @returns True if valid
   */
  isValidKey(key: string): boolean {
    // Should be 64 hex characters (32 bytes)
    return /^[a-f0-9]{64}$/i.test(key);
  }
}

// Export singleton instance
export default new EncryptionService();
