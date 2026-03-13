import { FC } from "react";
import { useT } from "@transifex/react";

import { config } from "../config";
import { useAppContext } from "../hooks/useAppContext";
import { Layout } from "./layout/index";
import { ProjectCard } from "../components/project/ProjectCard";
import { Projects } from "../components/projects";
import { Markdown } from "../components/Markdown";

const PARTNER_LOGOS = [
  { src: "logo/UMRAE.svg", alt: "UMRAE" },
  { src: "logo/LASTIG.svg", alt: "LASTIG" },
  { src: "logo/PDL.png", alt: "PDL" },
  { src: "logo/IGN.svg", alt: "IGN" },
  { src: "logo/UGE.png", alt: "UGE" },
  { src: "logo/CEREMA.svg", alt: "CEREMA" },
  { src: "logo/CNRS.svg", alt: "CNRS" },
  { src: "logo/ETIS.png", alt: "ETIS" },
  { src: "logo/CYU.png", alt: "CYU" },
];

export const HomePage: FC = () => {
  const t = useT();
  const [{ data }] = useAppContext();
  const higlightedProject = data.projects.slice(0, config.nbHiglightedProject);

  return (
    <Layout heading={t("Soundscape Mapping")}>
      <div className="row">
        <div className="col-12">
          <Markdown
            content={t(
              "Welcome to the LASSO platform. The LASSO platform is a web-based platform that presents a range of spatio-temporal dataset related to soundscapes. These dataset are the result of collaborative projects between Gustave Eiffel University and the University of Cergy-Pontoise. The platform aims to demonstrate the value of soundscape mapping in comparison to standardized noise mapping, and to provide researchers and data analysts with access to exclusive soundscapes datasets. In addition to serving as a repository of unique datasets, the LASSO platform provides a platform for researchers and specialists to submit their own projects for representation. The LASSO platform is committed to advancing our understanding of the role of soundscapes in shaping our environment. Through this platform, users can explore the power of soundscapes and their impact on our daily lives. Enjoy your visit!",
            )}
          />
          <div className="text-center my-4">
            {PARTNER_LOGOS.map((logo) => (
              <img
                key={logo.alt}
                style={{ border: "10px solid transparent" }}
                src={`${process.env.PUBLIC_URL}/${logo.src}`}
                alt={logo.alt}
                height="50"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h2>{t("Higlighted Projects")}</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3 g-4 pb-4 justify-content-center">
            {higlightedProject.map((project) => (
              <div className="col" key={project.id}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h2>{t("Find a project on the map")}</h2>
          <Projects />
        </div>
      </div>
    </Layout>
  );
};
