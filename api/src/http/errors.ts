export type ErrorCode = "invalid_imdb_id" | "title_not_found" | "route_not_found" | "method_not_allowed" | "unexpected_failure";

export interface ErrorResponseBody {
  error: {
    code: ErrorCode;
    message: string;
  };
}

export function jsonResponse(body: unknown, status: number, init?: ResponseInit): Response {
  const headers = new Headers(init?.headers);
  headers.set("content-type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(body), {
    ...init,
    status,
    headers,
  });
}

export function errorResponse(code: ErrorCode, message: string, status: number, init?: ResponseInit): Response {
  return jsonResponse({ error: { code, message } }, status, init);
}
