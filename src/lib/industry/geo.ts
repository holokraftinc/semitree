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

/** India bounding box (mainland), with a little padding. */
export const INDIA_BOX: ProjectionBox = {
  minLong: 67,
  maxLong: 98,
  minLat: 6,
  maxLat: 37,
};

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
