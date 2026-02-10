import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { z } from "zod";
import type { Tool } from "../../../src/tools/types.js";

const execFileAsync = promisify(execFile);

export function createMatrixSearchTool(): Tool {
  return {
    name: "matrix_search",
    description: "Search Matrix chat history for keywords. Returns recent matching messages.",
    parameters: z.object({
      query: z.string().describe("The keyword or phrase to search for"),
      limit: z.number().optional().describe("Max results (default 20)"),
      sender: z.string().optional().describe("Filter by sender (e.g. @alice:server)"),
      room: z.string().optional().describe("Filter by room ID"),
    }),
    execute: async ({ query, limit = 20, sender, room }) => {
      const args = [query, "--limit", limit.toString()];
      if (sender) {
        args.push("--sender", sender);
      }
      if (room) {
        args.push("--room", room);
      }

      try {
        const { stdout, stderr } = await execFileAsync("matrix-indexer-search", args);
        return stdout || stderr || "No results found.";
      } catch (error: any) {
        // If the command fails (exit code != 0), return the error output
        const output = error.stdout || error.stderr || error.message;
        return `Error searching matrix: ${output}`;
      }
    },
  };
}
