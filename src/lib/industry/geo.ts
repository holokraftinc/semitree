/**
 * Geographic helpers for the industry maps.
 *
 * Both maps use a simple equirectangular projection (longitude → x, latitude →
 * y), which is enough to place city-level markers with no external map tiles or
 * libraries — important for the static export.
 */
import type { Company, GeoPoint } from "./types";
import { COMPANIES, companyPoints } from "./companies";

/** A marker that carries which company (and site) it belongs to. */
export interface MapMarker {
  company: Company;
  point: GeoPoint;
}

/** Project lat/long to 0..1 fractions on an equirectangular canvas subset. */
export interface ProjectionBox {
  minLong: number;
  maxLong: number;
  minLat: number;
  maxLat: number;
}

export function project(
  lat: number,
  long: number,
  box: ProjectionBox,
): { x: number; y: number } {
  const x = (long - box.minLong) / (box.maxLong - box.minLong);
  const y = (box.maxLat - lat) / (box.maxLat - box.minLat); // north is up
  return { x, y };
}

/** World box (full equirectangular). */
export const WORLD_BOX: ProjectionBox = {
  minLong: -180,
  maxLong: 180,
  minLat: -60,
  maxLat: 80,
};

/**
 * Simplified continent silhouettes as [longitude, latitude] polygons. Coarse on
 * purpose — enough to read as a world map behind the city-level markers, with no
 * external map tiles or libraries (keeps the static export self-contained). They
 * project through `project()` so they line up with the grid and the markers.
 */
export const WORLD_LAND: [number, number][][] = [
  // North America
  [
    [-165, 68], [-140, 70], [-122, 71], [-100, 72], [-83, 70], [-73, 68],
    [-60, 61], [-56, 52], [-64, 47], [-70, 44], [-70, 40], [-75, 36], [-81, 31],
    [-81, 25], [-90, 29], [-97, 26], [-105, 22], [-110, 23], [-114, 29],
    [-120, 34], [-124, 40], [-124, 48], [-130, 54], [-141, 59], [-152, 58],
    [-165, 60],
  ],
  // Central America bridge
  [
    [-105, 20], [-96, 16], [-88, 16], [-83, 9], [-77, 8], [-82, 12], [-90, 15],
    [-98, 18],
  ],
  // Greenland
  [[-45, 60], [-28, 60], [-20, 70], [-25, 78], [-42, 83], [-56, 80], [-54, 70], [-48, 63]],
  // South America
  [
    [-80, 9], [-72, 11], [-61, 9], [-50, 0], [-46, -6], [-38, -6], [-38, -13],
    [-48, -25], [-58, -34], [-63, -41], [-66, -46], [-71, -52], [-74, -50],
    [-72, -42], [-71, -30], [-71, -18], [-78, -8], [-81, -4], [-80, 4],
  ],
  // Africa
  [
    [-16, 15], [-8, 33], [10, 37], [24, 32], [33, 31], [43, 11], [51, 12],
    [43, -1], [40, -15], [33, -26], [26, -34], [18, -35], [12, -17], [9, 0],
    [-8, 5], [-17, 10],
  ],
  // Europe
  [
    [-10, 43], [-9, 37], [3, 39], [18, 40], [28, 41], [40, 46], [40, 55],
    [30, 60], [24, 66], [12, 65], [5, 60], [8, 54], [-2, 51], [-5, 48], [-2, 44],
  ],
  // Asia (incl. India, SE Asia)
  [
    [26, 40], [40, 47], [48, 40], [50, 28], [58, 24], [67, 25], [72, 20],
    [77, 8], [80, 12], [88, 22], [92, 16], [98, 8], [104, 9], [109, 18],
    [117, 23], [122, 31], [122, 40], [130, 43], [135, 50], [143, 53], [158, 62],
    [172, 66], [178, 69], [160, 71], [140, 73], [110, 74], [80, 73], [68, 68],
    [58, 62], [48, 55], [40, 50], [33, 46],
  ],
  // Australia
  [
    [114, -22], [122, -18], [130, -12], [137, -12], [143, -12], [147, -18],
    [151, -24], [153, -30], [149, -38], [141, -38], [132, -32], [123, -34],
    [115, -33], [113, -26],
  ],
  // Japan
  [[132, 33], [138, 35], [141, 40], [143, 43], [140, 39], [136, 34]],
  // British Isles
  [[-6, 50], [-2, 51], [-1, 55], [-5, 58], [-8, 55], [-6, 51]],
  // New Zealand
  [[167, -45], [171, -44], [175, -41], [178, -38], [174, -41], [169, -46]],
];

/** India bounding box (mainland), with a little padding. */
export const INDIA_BOX: ProjectionBox = {
  minLong: 67,
  maxLong: 98,
  minLat: 6,
  maxLat: 37,
};

/**
 * Simplified outline of mainland India as a [longitude, latitude] polygon.
 * Coarse on purpose — a recognizable silhouette behind the state markers, drawn
 * through the same `project()` (no external tiles/libraries). Not a survey
 * boundary; it is a stylized backdrop.
 */
export const INDIA_LAND: [number, number][] = [
  [74, 34], [76, 33], [78, 32], [80, 30.5], [81, 30], [83, 28], [85, 27.5],
  [88, 27], [89, 26], [92, 27], [95, 27], [96, 28], [94, 25], [92, 24],
  [91, 23], [89, 22], [87, 21], [85, 19], [82, 17], [80.5, 15], [80, 13],
  [79, 11], [78, 9], [77.5, 8], [76, 9], [75, 12], [74, 15], [73, 18],
  [72.8, 19], [70.5, 21], [69, 22], [68, 23], [70, 24], [70, 28], [74, 30],
  [75, 32],
];

/** Every marker across all companies (HQ + sites). */
export function allMarkers(): MapMarker[] {
  const markers: MapMarker[] = [];
  for (const company of COMPANIES) {
    for (const point of companyPoints(company)) {
      markers.push({ company, point });
    }
  }
  return markers;
}

/** Markers located in India. */
export function indiaMarkers(): MapMarker[] {
  return allMarkers().filter((m) => m.point.countryCode === "IN");
}

/**
 * Cluster markers that fall on (nearly) the same coordinate so overlapping city
 * pins render as one grouped marker.
 */
export interface MarkerCluster {
  lat: number;
  long: number;
  city: string;
  markers: MapMarker[];
}

export function clusterMarkers(markers: MapMarker[]): MarkerCluster[] {
  const byKey = new Map<string, MarkerCluster>();
  for (const m of markers) {
    // Round to ~0.25° so same-city points group together.
    const key = `${Math.round(m.point.lat * 4)}:${Math.round(m.point.long * 4)}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.markers.push(m);
    } else {
      byKey.set(key, {
        lat: m.point.lat,
        long: m.point.long,
        city: m.point.city,
        markers: [m],
      });
    }
  }
  return Array.from(byKey.values());
}

/* ------------------------------- India states ------------------------------ */

/** The India-map categories, in display order. */
export const INDIA_BUCKETS = [
  "Gujarat",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Other states",
] as const;

export type IndiaBucket = (typeof INDIA_BUCKETS)[number];

const NAMED = new Set<string>(INDIA_BUCKETS.slice(0, 6));

/** Map an Indian state to one of the seven buckets. */
export function bucketForState(state: string | undefined): IndiaBucket {
  if (state && NAMED.has(state)) return state as IndiaBucket;
  return "Other states";
}

/** India markers grouped by bucket, in display order (empty buckets included). */
export function indiaMarkersByBucket(): { bucket: IndiaBucket; markers: MapMarker[] }[] {
  const markers = indiaMarkers();
  return INDIA_BUCKETS.map((bucket) => ({
    bucket,
    markers: markers.filter((m) => bucketForState(m.point.state) === bucket),
  }));
}
