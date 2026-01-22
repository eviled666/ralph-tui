/**
 * ABOUTME: Tests for PrdChatApp utility functions.
 * Tests ANSI code stripping for clean PRD output.
 */

import { describe, test, expect } from 'bun:test';
import { stripAnsiCodes } from '../../src/plugins/agents/output-formatting.js';

describe('PrdChatApp utilities', () => {
  describe('stripAnsiCodes', () => {
    test('removes color codes from text', () => {
      const input = '\x1B[38;5;252m\x1B[1m### US-001: Title\x1B[0m\x1B[0m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('### US-001: Title');
    });

    test('removes multiple ANSI sequences', () => {
      const input = '\x1B[31mRed\x1B[0m \x1B[32mGreen\x1B[0m \x1B[34mBlue\x1B[0m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Red Green Blue');
    });

    test('preserves text without ANSI codes', () => {
      const input = '### US-001: Simple Title\n\nDescription here.';
      const result = stripAnsiCodes(input);
      expect(result).toBe(input);
    });

    test('handles empty string', () => {
      expect(stripAnsiCodes('')).toBe('');
    });

    test('handles bold and reset codes', () => {
      const input = '\x1B[1mBold\x1B[0m Normal';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Bold Normal');
    });

    test('handles cursor movement codes', () => {
      const input = '\x1B[2KCleared line\x1B[1GStart';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Cleared lineStart');
    });

    test('strips Kiro-style output formatting', () => {
      // Real example from Kiro output
      const input = `\x1B[38;5;252m\x1B[1m### US-001: Database Schema Setup\x1B[0m\x1B[0m
\x1B[1mDescription:\x1B[0m As a developer, I want to set up the database schema.

\x1B[1m**Acceptance Criteria:**\x1B[0m
- [ ] Create SQLite database file`;
      
      const result = stripAnsiCodes(input);
      expect(result).toContain('### US-001: Database Schema Setup');
      expect(result).toContain('Description:');
      expect(result).toContain('**Acceptance Criteria:**');
      expect(result).not.toContain('\x1B');
    });
  });
});
