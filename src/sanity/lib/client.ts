import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-03-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export function isSanityConfigured() {
  return Boolean(projectId && dataset);
}

export const sanityClient = createClient({
  projectId: projectId ?? "localdev",
  dataset: dataset ?? "production",
  apiVersion,
  useCdn: true,
});

export const sanityWriteClient = createClient({
  projectId: projectId ?? "localdev",
  dataset: dataset ?? "production",
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
