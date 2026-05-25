/**
 * Content Script
 * Executes in the context of web pages
 * Extracts text content and handles user interactions
 */

import { ExtensionMessage, ExtensionResponse } from '../types';

/**
 * Extract visible text from the current webpage
 * Respects user permissions and content policies
 */
function extractVisibleText(): string {
  try {
    const body = document.body;
    if (!body) return '';

    const clonedBody = body.cloneNode(true) as HTMLElement;

    // Remove unwanted elements
    const elementsToRemove = clonedBody.querySelectorAll(
      'script, style, nav, noscript, meta, [hidden], .advertisement, .ad, .nav, .header-nav'
    );
    elementsToRemove.forEach((el) => el.remove());

    let text = clonedBody.innerText || clonedBody.textContent || '';

    // Clean up whitespace
    text = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n');

    return text;
  } catch (error) {
    console.error('Text extraction error:', error);
    return '';
  }
}

/**
 * Handle incoming messages from extension UI
 */
chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, sender, sendResponse: (response: ExtensionResponse) => void) => {
    try {
      switch (message.type) {
        case 'EXTRACT_CONTENT':
          const content = extractVisibleText();
          sendResponse({
            success: true,
            data: content,
          });
          break;

        default:
          sendResponse({
            success: false,
            error: 'Unknown message type',
          });
      }
    } catch (error) {
      console.error('Message handler error:', error);
      sendResponse({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return true;
  }
);

console.log('AI Study Assistant content script loaded');
