const config = require('../config/env');

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function haversineKm(from, to) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLon = toRadians(to.lon - from.lon);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

async function geocodeAddress(address) {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', address);

  const response = await fetch(url, { headers: { 'User-Agent': config.osmUserAgent } });
  if (!response.ok) {
    throw new Error('Geocoding OpenStreetMap non disponibile');
  }
  const [place] = await response.json();
  if (!place) {
    throw new Error('Indirizzo di consegna non trovato');
  }
  return { lat: Number(place.lat), lon: Number(place.lon) };
}

async function calculateDelivery(from, address) {
  const to = await geocodeAddress(address);
  const distanceKm = Number(haversineKm(from, to).toFixed(2));
  const cost = Number((config.deliveryBaseCost + distanceKm * config.deliveryCostPerKm).toFixed(2));
  return { distanceKm, cost, destination: to };
}

module.exports = { calculateDelivery, haversineKm };
