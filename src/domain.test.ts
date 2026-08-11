import { describe, expect, it } from 'vitest';
import { attentionLeads, seedLeads, weightedPipeline, wonValue } from './domain';

describe('dashboard metrics', () => {
  it('derives all values from the visible demo dataset', () => {
    expect(wonValue(seedLeads)).toBe(3_600_000);
    expect(weightedPipeline(seedLeads)).toBe(17_295_000);
    expect(attentionLeads(seedLeads).map((lead) => lead.id)).toEqual(['LD-1048', 'LD-1047', 'LD-1045']);
  });
});
