import { FC } from "react";
import { useParams } from "react-router-dom";
import { useLocale } from "@transifex/react";

import { useLoadProject } from "../hooks/useLoadProject";
import { getI18NText } from "../utils/i18n";
import { ProjectMaps } from "../components/project/ProjectMaps";
import { NotFoundPage } from "./NotFoundPage";
import { Layout } from "./layout";

export const ProjectMapPage: FC = () => {
  const { id } = useParams<"id">();
  const { project, loading } = useLoadProject(id);
  const locale = useLocale;

  return (
    <>
      <Layout
        loading={loading}
        project={project ?? undefined}
        heading={project ? getI18NText(locale, project.name) : undefined}
        fullPage={true}
        currentProjectPage={"maps"}
      >
        {project && project.externalUrl ? (
          <iframe
            src={project.externalUrl}
            title={typeof project.name === "string" ? project.name : getI18NText(locale, project.name)}
            className="flex-grow-1"
            style={{ width: "100%", border: "none", minHeight: 0 }}
            allow="fullscreen"
          />
        ) : (
          project && <ProjectMaps />
        )}
      </Layout>
      {!loading && !project && <NotFoundPage />}
    </>
  );
};
