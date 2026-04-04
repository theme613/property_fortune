import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      // Uncomment and set a KV namespace binding name if needed for caching
      // incrementalCache: "dummy",
      // tagCache: "dummy",
      // queue: "dummy",
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },
};

export default config;
