const test = require('node:test');
const assert = require('node:assert/strict');
const { haversineKm } = require('../src/services/deliveryService');

test('haversineKm returns zero for the same point', () => {
  assert.equal(haversineKm({ lat: 41.9028, lon: 12.4964 }, { lat: 41.9028, lon: 12.4964 }), 0);
});

test('haversineKm approximates the distance between Rome and Milan', () => {
  const distance = haversineKm({ lat: 41.9028, lon: 12.4964 }, { lat: 45.4642, lon: 9.19 });
  assert.ok(distance > 475 && distance < 485);
});
