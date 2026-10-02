import { describe, expect, it } from 'vitest';
import { ShipmentBuilder } from '../../test-data/shipment.builder';
import { seededRandom, seedFromEnv } from '../seeded-random';

describe('seededRandom', () => {
  it('is deterministic for the same seed', () => {
    const a = seededRandom(42);
    const b = seededRandom(42);
    expect(Array.from({ length: 5 }, () => a.next())).toEqual(Array.from({ length: 5 }, () => b.next()));
  });

  it('differs for different seeds', () => {
    expect(seededRandom(1).next()).not.toEqual(seededRandom(2).next());
  });

  it('keeps int() inside an inclusive range', () => {
    const r = seededRandom(7);
    const values = Array.from({ length: 500 }, () => r.int(3, 5));
    expect(new Set(values)).toEqual(new Set([3, 4, 5]));
  });

  it('rejects invalid ranges and empty picks', () => {
    expect(() => seededRandom(1).int(5, 3)).toThrow(RangeError);
    expect(() => seededRandom(1).pick([])).toThrow(RangeError);
  });

  it('reads a replay seed from DEMO_SEED', () => {
    expect(seedFromEnv({ DEMO_SEED: '1234' })).toBe(1234);
    expect(seedFromEnv({ DEMO_SEED: 'nope' })).toBeGreaterThan(0);
  });
});

describe('ShipmentBuilder', () => {
  it('builds identical payloads for the same seed and tag', () => {
    expect(new ShipmentBuilder(99, 'T').build()).toEqual(new ShipmentBuilder(99, 'T').build());
  });

  it('produces unique, valid references', () => {
    const builder = new ShipmentBuilder(5, 'RUN1');
    const refs = Array.from({ length: 20 }, () => builder.build().reference);
    expect(new Set(refs).size).toBe(20);
    for (const ref of refs) expect(ref).toMatch(/^[A-Z0-9][A-Z0-9-]{2,39}$/);
  });

  it('never picks the same origin and destination', () => {
    const builder = new ShipmentBuilder(11);
    for (let i = 0; i < 50; i++) {
      const s = builder.build();
      expect(s.origin).not.toBe(s.destination);
    }
  });

  it('keeps weight within the default vehicle capacity', () => {
    const builder = new ShipmentBuilder(3);
    for (let i = 0; i < 50; i++)
      expect(builder.build({ vehicleType: 'VAN' }).weightKg).toBeLessThanOrEqual(1500);
  });

  it('lets overrides win', () => {
    expect(new ShipmentBuilder(1).build({ weightKg: 1, customerId: 'CUSTOMER-BETA' })).toMatchObject({
      weightKg: 1,
      customerId: 'CUSTOMER-BETA',
    });
  });
});
