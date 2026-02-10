import type { OpenClawPluginApi } from "../../src/plugins/types.js";
import { createMatrixSearchTool } from "./src/matrix-search-tool.js";

export default function register(api: OpenClawPluginApi) {
  api.registerTool(
    () => {
      // Always available (host tool)
      return createMatrixSearchTool();
    },
    { optional: true },
  );
}
