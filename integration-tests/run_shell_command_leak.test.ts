/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestRig } from './test-helper.js';

describe('run_shell_command memory leak', () => {
  let rig: TestRig;

  beforeEach(() => {
    rig = new TestRig();
  });

  afterEach(async () => await rig.cleanup());

  it('should not leak memory when calling run_shell_command multiple times', async () => {
    await rig.setup('should not leak memory', {
      settings: { tools: { core: ['run_shell_command'] } },
    });

    const prompt = `Please run the command "echo hello-world" and show me the output`;

    for (let i = 0; i < 15; i++) {
      await rig.run({ args: prompt });
    }

    const toolCalls = rig
      .readToolLogs()
      .filter((toolCall) => toolCall.toolRequest.name === 'run_shell_command');

    expect(toolCalls.length).toBe(15);
  });
});
