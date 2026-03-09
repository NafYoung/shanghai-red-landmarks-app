#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const APP_JS_PATH = path.join(ROOT_DIR, 'app.js');
const BOUNDARY_PATH = path.join(ROOT_DIR, 'data', 'shanghai-boundary.simple.geojson');
const PANORAMA_PATH = path.join(ROOT_DIR, 'data', 'panoramas.json');
const REPORT_PATH = path.join(ROOT_DIR, 'reports', 'accuracy-audit.md');

const AMAP_WEB_SERVICE_KEY = process.env.AMAP_WEB_SERVICE_KEY || '';
const BAIDU_AK = process.env.BAIDU_AK || '';
const ROUTE_FETCH_TIMEOUT_MS = 5000;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function extractLiteral(source, declarationPrefix) {
  const start = source.indexOf(declarationPrefix);
  if (start === -1) {
    throw new Error(`Cannot find declaration: ${declarationPrefix}`);
  }

  let cursor = start + declarationPrefix.length;
  while (/\s/.test(source[cursor])) {
    cursor += 1;
  }

  const open = source[cursor];
  const close = open === '[' ? ']' : open === '{' ? '}' : '';
  if (!close) {
    throw new Error(`Unsupported literal open token: ${open}`);
  }

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let i = cursor; i < source.length; i += 1) {
    const char = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === '\\') {
        escaped = true;
        continue;
      }
      if (char === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = true;
      quote = char;
      continue;
    }

    if (char === open) {
      depth += 1;
      continue;
    }

    if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(cursor, i + 1);
      }
    }
  }

  throw new Error(`Unterminated literal for: ${declarationPrefix}`);
}

function evaluateLiteral(literal) {
  return Function(`"use strict"; return (${literal});`)();
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function haversineMeters(a, b) {
  const R = 6371e3;
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const t = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(t), Math.sqrt(1 - t));
  return R * c;
}

function isCoordValid(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = Number(ring[i][0]);
    const yi = Number(ring[i][1]);
    const xj = Number(ring[j][0]);
    const yj = Number(ring[j][1]);
    const intersects =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersects) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(lng, lat, polygon) {
  if (!Array.isArray(polygon) || !polygon.length) {
    return false;
  }
  const [outer, ...holes] = polygon;
  if (!pointInRing(lng, lat, outer)) {
    return false;
  }
  for (const hole of holes) {
    if (pointInRing(lng, lat, hole)) {
      return false;
    }
  }
  return true;
}

function pointInGeometry(lng, lat, geometry) {
  if (!geometry || !geometry.type) {
    return false;
  }

  if (geometry.type === 'Polygon') {
    return pointInPolygon(lng, lat, geometry.coordinates || []);
  }

  if (geometry.type === 'MultiPolygon') {
    return (geometry.coordinates || []).some((polygon) => pointInPolygon(lng, lat, polygon));
  }

  return false;
}

function pointInBoundary(lng, lat, boundaryGeoJson) {
  const features = Array.isArray(boundaryGeoJson?.features) ? boundaryGeoJson.features : [];
  return features.some((feature) => pointInGeometry(lng, lat, feature.geometry));
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAmapDriveRealtime(fromSpot, toSpot) {
  if (!AMAP_WEB_SERVICE_KEY) {
    return {
      ok: false,
      reason: 'missing-key'
    };
  }

  const params = new URLSearchParams({
    key: AMAP_WEB_SERVICE_KEY,
    origin: `${fromSpot.lng},${fromSpot.lat}`,
    destination: `${toSpot.lng},${toSpot.lat}`,
    extensions: 'all',
    strategy: '0',
    output: 'json'
  });

  try {
    const data = await fetchJsonWithTimeout(`https://restapi.amap.com/v3/direction/driving?${params}`, ROUTE_FETCH_TIMEOUT_MS);
    const firstPath = data?.route?.paths?.[0];
    const distanceMeters = Number(firstPath?.distance);
    const durationMinutes = Math.round((Number(firstPath?.duration) || 0) / 60);
    if (data?.status === '1' && Number.isFinite(distanceMeters) && distanceMeters > 0 && Number.isFinite(durationMinutes) && durationMinutes > 0) {
      return {
        ok: true,
        distanceMeters,
        durationMinutes
      };
    }
    return {
      ok: false,
      reason: 'invalid-payload'
    };
  } catch (error) {
    return {
      ok: false,
      reason: error?.name === 'AbortError' ? 'timeout' : 'request-failed'
    };
  }
}

function buildRouteLegs(routes, scenicById) {
  const legs = [];
  routes.forEach((route) => {
    for (let i = 0; i < route.spotIds.length - 1; i += 1) {
      const fromSpot = scenicById.get(route.spotIds[i]);
      const toSpot = scenicById.get(route.spotIds[i + 1]);
      if (!fromSpot || !toSpot) {
        continue;
      }
      legs.push({
        routeId: route.id,
        fromSpot,
        toSpot,
        key: `${fromSpot.id}->${toSpot.id}`
      });
    }
  });
  return legs;
}

function toStatus(ok, passLabel, failLabel) {
  return ok ? passLabel : failLabel;
}

function makeReportTable(rows) {
  const headers = [
    'spotId',
    'coordStatus',
    'boundaryStatus',
    'routeLegStatus',
    'driveTrafficSource',
    'panoramaSource',
    'fallbackReason'
  ];

  const lines = [];
  lines.push(`| ${headers.join(' | ')} |`);
  lines.push(`| ${headers.map(() => '---').join(' | ')} |`);
  rows.forEach((row) => {
    lines.push(
      `| ${headers.map((key) => (row[key] != null ? String(row[key]) : '')).join(' | ')} |`
    );
  });
  return lines.join('\n');
}

async function run() {
  const appSource = fs.readFileSync(APP_JS_PATH, 'utf8');
  const spotsLiteral = extractLiteral(appSource, 'const rawScenicSpots =');
  const routesLiteral = extractLiteral(appSource, 'const recommendedRoutes =');
  const spots = evaluateLiteral(spotsLiteral);
  const routes = evaluateLiteral(routesLiteral);

  const boundaryGeoJson = readJson(BOUNDARY_PATH);
  const panoramaIndex = readJson(PANORAMA_PATH);

  const scenicById = new Map(spots.map((spot) => [spot.id, spot]));
  const panoramasBySpotId = new Map();
  panoramaIndex.forEach((record) => {
    if (!record || !record.spotId) {
      return;
    }
    if (!panoramasBySpotId.has(record.spotId)) {
      panoramasBySpotId.set(record.spotId, []);
    }
    panoramasBySpotId.get(record.spotId).push(record);
  });

  const legs = buildRouteLegs(routes, scenicById);
  const legRealtimeResult = new Map();

  let realtimeHit = 0;
  for (const leg of legs) {
    const result = await fetchAmapDriveRealtime(leg.fromSpot, leg.toSpot);
    legRealtimeResult.set(leg.key, result);
    if (result.ok) {
      realtimeHit += 1;
    }
  }

  const rows = spots.map((spot) => {
    const coordOk = isCoordValid(spot.lat, spot.lng);
    const boundaryOk = coordOk && pointInBoundary(spot.lng, spot.lat, boundaryGeoJson);

    const relatedLegs = legs.filter((leg) => leg.fromSpot.id === spot.id || leg.toSpot.id === spot.id);
    const routeLegComplete = relatedLegs.every((leg) => {
      const distanceMeters = Math.max(120, Math.round(haversineMeters(leg.fromSpot, leg.toSpot) * 1.25));
      const walkMinutes = Math.round((distanceMeters / 1000 / 4.8) * 60 + 2);
      const bikeMinutes = Math.round((distanceMeters / 1000 / 13.5) * 60 + 3);
      const metroMinutes = Math.round((distanceMeters / 1000 / 26) * 60 + 14);
      const driveMinutes = Math.round((distanceMeters / 1000 / 30) * 60 + 10);
      return [walkMinutes, bikeMinutes, metroMinutes, driveMinutes].every((v) => Number.isFinite(v) && v > 0);
    });

    let driveTrafficSource = '模型估算';
    if (AMAP_WEB_SERVICE_KEY && relatedLegs.length) {
      const anyRealtime = relatedLegs.some((leg) => legRealtimeResult.get(leg.key)?.ok === true);
      driveTrafficSource = anyRealtime ? '实时路况' : '模型估算';
    }

    const panoramaEntries = panoramasBySpotId.get(spot.id) || [];
    let panoramaSource = 'none';
    if (panoramaEntries.some((entry) => entry.provider === 'baidu')) {
      panoramaSource = 'baidu';
    } else if (panoramaEntries.some((entry) => entry.provider === 'local')) {
      panoramaSource = 'local';
    }

    let fallbackReason = '无';
    if (panoramaSource === 'none') {
      fallbackReason = '无覆盖';
    } else if (panoramaSource === 'baidu' && !BAIDU_AK) {
      fallbackReason = '权限';
    }

    return {
      spotId: spot.id,
      coordStatus: toStatus(coordOk, 'ok', 'invalid'),
      boundaryStatus: toStatus(boundaryOk, 'in-shanghai', 'out-of-boundary'),
      routeLegStatus: toStatus(routeLegComplete, '4modes-ready', 'missing-mode'),
      driveTrafficSource,
      panoramaSource,
      fallbackReason
    };
  });

  const totalSpots = spots.length;
  const panoramaCoveredCount = rows.filter((row) => row.panoramaSource !== 'none').length;
  const fallbackCount = rows.filter((row) => row.fallbackReason !== '无').length;

  const realtimeHitRate = legs.length ? ((realtimeHit / legs.length) * 100).toFixed(1) : '0.0';
  const panoramaCoverageRate = totalSpots ? ((panoramaCoveredCount / totalSpots) * 100).toFixed(1) : '0.0';
  const fallbackRate = totalSpots ? ((fallbackCount / totalSpots) * 100).toFixed(1) : '0.0';

  const report = [
    '# 准确性体检基线报告',
    '',
    `- 生成时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
    `- 驾车实时路况命中率：${realtimeHitRate}%（${realtimeHit}/${legs.length}）`,
    `- 全景覆盖率：${panoramaCoverageRate}%（${panoramaCoveredCount}/${totalSpots}）`,
    `- 3D 回退触发率：${fallbackRate}%（${fallbackCount}/${totalSpots}）`,
    `- 高德 Key：${AMAP_WEB_SERVICE_KEY ? '已配置' : '未配置'}`,
    `- 百度 AK：${BAIDU_AK ? '已配置' : '未配置'}`,
    '',
    makeReportTable(rows),
    ''
  ].join('\n');

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, 'utf8');
  console.log(`Report generated: ${REPORT_PATH}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
