export type HttpErrorProps = {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
};

/**
 * @example throw new HttpError('Unauthorized access', 401);
 *
 * @example
 * export async function GET() {
 *   const unauthorized = true;
 *   if (unauthorized) throw new HttpError('Unauthorized access', 401);
 *   return new Response('OK');
 * }
 */
export class HttpError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function httpError(message: string, status = 500) {
  const error = new Error(message);
  (error as any).status = status;
  throw error;
}

type ErrorMessage = string | number | unknown | null | undefined;

/** @example errorParser(new Error("Something bad happened")) */
export function errorParser(content: ErrorMessage) {
  if (!content || content === 'undefined') return null;

  let result: string | number;

  if (typeof content === 'string' || typeof content === 'number') {
    result = String(content);
  } else if (content instanceof Error) {
    result = content.stack || content.message;
  } else if (typeof content === 'object') {
    try {
      result = JSON.stringify(content, null, 2); // pretty-print object
    } catch {
      result = '[Object with circular reference]';
    }
  } else {
    result = String(content); // fallback
  }

  return result;
}
