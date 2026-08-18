import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { getPublicProjects } from "@/lib/data/public-projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/ergasies",
    "/portfolio",
    "/about",
    "/epikoinonia",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
  }));

  const { projects, isPlaceholder } = await getPublicProjects();
  const portfolioRoutes = isPlaceholder
    ? []
    : projects.map((project) => ({
        url: `${siteConfig.url}/portfolio/${project.id}`,
        lastModified: new Date(),
      }));

  return [...staticRoutes, ...portfolioRoutes];
}
