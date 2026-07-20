import { errorResponse } from "./http/errors";
import { isValidImdbTitleId } from "./validation/imdb";

function routeTitleRequest(pathname: string): string | undefined {
  const match = /^\/titles\/([^/]+)$/.exec(pathname);
  return match?.[1];
}

async function handleRequest(request: Request): Promise<Response> {
  if (request.method !== "GET") {
    return errorResponse("method_not_allowed", "Method not allowed.", 405, {
      headers: {
        allow: "GET",
      },
    });
  }

  const { pathname } = new URL(request.url);
  const imdbId = routeTitleRequest(pathname);

  if (imdbId === undefined) {
    return errorResponse("route_not_found", "Route not found.", 404);
  }

  if (!isValidImdbTitleId(imdbId)) {
    return errorResponse("invalid_imdb_id", "Invalid IMDb ID.", 400);
  }

  return errorResponse("title_not_found", "Title not found.", 404);
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await handleRequest(request);
    } catch {
      return errorResponse("unexpected_failure", "Unexpected failure.", 500);
    }
  },
} satisfies ExportedHandler;
