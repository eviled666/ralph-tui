/**
 * ABOUTME: Tests for structured logger progress output formatting.
 * Verifies iteration progress lines include effective routing visibility for agent/model.
 */

import { describe, expect, test } from 'bun:test';
import { Writable } from 'node:stream';
import { StructuredLogger } from '../../src/logs/structured-logger.js';

function createCapturingStream(): { stream: Writable; getOutput: () => string } {
  let output = '';
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      output += chunk.toString();
      callback();
    },
  });

  return {
    stream,
    getOutput: () => output,
  };
}

describe('StructuredLogger progress', () => {
  test('includes effective agent and model when provided', () => {
    const capture = createCapturingStream();
    const logger = new StructuredLogger({
      showTimestamp: false,
      stream: capture.stream,
      errorStream: capture.stream,
    });

    logger.progress(2, 10, 'US-005', 'Surface routing decisions', 'codex', 'gpt-5.3-codex');

    expect(capture.getOutput()).toContain(
      '[INFO] [progress] Iteration 2/10: Working on US-005 - Surface routing decisions (agent: codex, model: gpt-5.3-codex)'
    );
  });

  test('omits routing suffix when effective agent/model are not provided', () => {
    const capture = createCapturingStream();
    const logger = new StructuredLogger({
      showTimestamp: false,
      stream: capture.stream,
      errorStream: capture.stream,
    });

    logger.progress(1, 0, 'US-001', 'Base task');

    expect(capture.getOutput()).toContain(
      '[INFO] [progress] Iteration 1/∞: Working on US-001 - Base task'
    );
    expect(capture.getOutput()).not.toContain('(agent:');
  });
});
