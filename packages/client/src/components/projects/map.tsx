import { FC, useEffect, useState } from "react";
import Map, { Source, Layer, MapRef } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";

import { ExportedData, Project } from "@lasso/dataprep";
import { ProjectMapBoundingBox } from "../project/map/ProjectMapBoundingBox";

interface MapProperties {
  bbox: ExportedData["bbox"];
  projects: Array<Project>;
  selected: Project | null;
  setSelected: (p: Project | null) => void;
}

export const ProjectsMap: FC<MapProperties> = ({ bbox, projects, setSelected, selected }) => {
  const [map, setMap] = useState<MapRef | null>(null);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features) {
        const selectedProjects = projects.find((p) =>
          (e.features?.map((f) => f.properties?.projectId) || []).includes(p.id),
        );
        setSelected(selectedProjects || null);
      }
    };
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "projectsRectangles", handleClick);
    map.on("mouseenter", "projectsRectangles", handleMouseEnter);
    map.on("mouseleave", "projectsRectangles", handleMouseLeave);

    return () => {
      map.off("click", "projectsRectangles", handleClick);
      map.off("mouseenter", "projectsRectangles", handleMouseEnter);
      map.off("mouseleave", "projectsRectangles", handleMouseLeave);
    };
  }, [map, setSelected, projects]);

  useEffect(() => {
    if (map) {
      map.fitBounds(selected ? selected.bbox : bbox);
    }
  }, [selected, map, bbox]);

  return (
    <Map ref={setMap}>
      <Source id="osm" type="raster" tiles={["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]} attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors">
        <Layer id="basemap" type="raster" source="osm" />
      </Source>
      {projects.map((project) => (
        <ProjectMapBoundingBox key={project.id} project={project} type="fill" />
      ))}
    </Map>
  );
};
