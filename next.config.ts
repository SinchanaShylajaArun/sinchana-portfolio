import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site used to have separate pages. These send any old links
  // (e.g. sinchana…/projects) to the matching section of the single page.
  async redirects() {
    return ["projects", "experience", "ask", "contact"].map((id) => ({
      source: `/${id}`,
      destination: `/#${id}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
