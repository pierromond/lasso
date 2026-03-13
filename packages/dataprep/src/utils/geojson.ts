import bbox from "@turf/bbox";
import truncate from "@turf/truncate";
import simplify from "@turf/simplify";
import { FeatureCollection, GeoJSON } from "geojson";

import { BBOX } from "../types";
import { readJson } from "./files";

export async function readGeoJsonFile(file: string): Promise<GeoJSON> {
  const geojson = (await readJson(file)) as FeatureCollection;
  try {
    return geojson as GeoJSON;
  } catch (e) {
    throw new Error(`GeoJSON ${file} is not valid: ${e}`);
  }
}

/**
 * Compute the outer BBOX that contains all the geojson
 */
export function outerBbox(geoJsons: Array<GeoJSON>): BBOX {
  return metaBbox(
    geoJsons
      .map((geo) => {
        return bbox(geo);
      })
      .map(
        (bbox) =>
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]],
          ] as BBOX,
      ),
  );
}

export function metaBbox(bboxs: Array<BBOX>): BBOX {
  return bboxs.reduce(
    (
      acc = [
        [Infinity, Infinity],
        [-Infinity, -Infinity],
      ],
      curr,
    ) => {
      // min X
      if (curr[0][0] < acc[0][0]) acc[0][0] = curr[0][0];
      if (curr[0][1] < acc[0][1]) acc[0][1] = curr[0][1];
      if (curr[1][0] > acc[1][0]) acc[1][0] = curr[1][0];
      if (curr[1][1] > acc[1][1]) acc[1][1] = curr[1][1];
      return acc;
    },
    [
      [Infinity, Infinity],
      [-Infinity, -Infinity],
    ] as BBOX,
  );
}

/**
 * Optimize a GeoJSON by:
 * - Truncating coordinates to `precision` decimals (default 6 ≈ 11cm accuracy)
 * - Simplifying geometries with tolerance (default 0.0001 ≈ 11m) when they exceed a coordinate threshold
 */
export function optimizeGeoJson(geojson: GeoJSON, options?: { precision?: number; tolerance?: number }): GeoJSON {
  const precision = options?.precision ?? 6;
  const tolerance = options?.tolerance ?? 0.0001;

  if (geojson.type !== "FeatureCollection") {
    return truncate(geojson as Parameters<typeof truncate>[0], { precision, coordinates: 2, mutate: false });
  }

  const fc = geojson as FeatureCollection;

  // Estimate total coordinate count to decide if simplification is needed
  const totalCoords = fc.features.reduce((sum, f) => sum + estimateCoordCount(f.geometry), 0);
  const needsSimplification = totalCoords > 50000;

  let result: GeoJSON = fc;

  if (needsSimplification) {
    const beforeSize = totalCoords;
    result = simplify(fc, { tolerance, highQuality: true, mutate: false });
    const afterSize = (result as FeatureCollection).features.reduce(
      (sum, f) => sum + estimateCoordCount(f.geometry),
      0,
    );
    console.log(`  Simplified: ${beforeSize.toLocaleString()} → ${afterSize.toLocaleString()} coordinates`);
  }

  // Truncate precision
  result = truncate(result as Parameters<typeof truncate>[0], { precision, coordinates: 2, mutate: false });

  return result;
}

function estimateCoordCount(geometry: GeoJSON.Geometry | null): number {
  if (!geometry) return 0;
  switch (geometry.type) {
    case "Point":
      return 1;
    case "MultiPoint":
    case "LineString":
      return geometry.coordinates.length;
    case "MultiLineString":
    case "Polygon":
      return geometry.coordinates.reduce((s, ring) => s + ring.length, 0);
    case "MultiPolygon":
      return geometry.coordinates.reduce((s, poly) => poly.reduce((s2, ring) => s2 + ring.length, s), 0);
    case "GeometryCollection":
      return geometry.geometries.reduce((s, g) => s + estimateCoordCount(g), 0);
    default:
      return 0;
  }
}
