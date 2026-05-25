/**
 * Background Service Worker
 * Handles extension-level logic, background tasks, and message routing
 */

import { ExtensionMessage, ExtensionResponse } from '../types';
import StorageService from '../utils/storage';

/**
 * Initialize extension on install/update
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('onboarding.html'),
    });
  }
});

/**
 * Handle messages from content scripts and UI
 */
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse: (response: ExtensionResponse) => void) => {
    handleMessage(message, sender)
      .then((response) => sendResponse(response))
      .catch((error) => {
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      });

    return true;
  }
);

/**
 * Route and handle different message types
 */
async function handleMessage(message: ExtensionMessage, sender: any): Promise<ExtensionResponse> {
  switch (message.type) {
    case 'EXTRACT_CONTENT':
      return handleExtractContent(message.payload);

    case 'STATUS':
      return handleStatus(message.payload);

    case 'AUTH':
      return handleAuth(message.payload);

    default:
      return {
        success: false,
        error: `Unknown message type: ${message.type}`,
      };
  }
}

/**
 * Handle content extraction
 */
async function handleExtractContent(payload: any): Promise<ExtensionResponse> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.id) {
      return { success: false, error: 'No active tab' };
    }

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'EXTRACT_CONTENT',
      payload: {},
    });

    return {
      success: response.success,
      data: response.data,
      error: response.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Extraction failed',
    };
  }
}

/**
 * Handle status requests
 */
async function handleStatus(payload: any): Promise<ExtensionResponse> {
  try {
    const isAuth = await StorageService.isAuthenticated();
    const prefs = await StorageService.getPreferences();

    return {
      success: true,
      data: {
        isAuthenticated: isAuth,
        preferences: prefs,
        version: chrome.runtime.getManifest().version,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Status check failed',
    };
  }
}

/**
 * Handle authentication messages
 */
async function handleAuth(payload: any): Promise<ExtensionResponse> {
  try {
    const { action } = payload;

    switch (action) {
      case 'logout':
        await StorageService.clearSession();
        return { success: true, data: 'Logged out' };

      case 'check':
        const isAuth = await StorageService.isAuthenticated();
        return { success: true, data: { isAuthenticated: isAuth } };

      default:
        return { success: false, error: `Unknown auth action: ${action}` };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Auth action failed',
    };
  }
}

// Set up alarm for periodic sync (every 30 minutes)
chrome.alarms.create('autoSync', { periodInMinutes: 30 });

/**
 * Handle alarm triggers
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'autoSync') {
    console.log('Auto-sync triggered');
  }
});

console.log('AI Study Assistant background worker initialized');
