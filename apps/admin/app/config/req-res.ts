import { NextResponse } from 'next/server';

type ResponseBody = BodyInit | Record<string, any>;
type ResponseStatus = ResponseInit | number;

export function getResponse(body: ResponseBody, status?: ResponseStatus) {
  const init = typeof status === 'number' ? { status } : status;
  if (typeof body === 'object') return NextResponse.json(body, init);
  return new NextResponse(body, init);
}

/** Helper function to parse different content types */
export async function getRequest(req: Request) {
  const contentType = req.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return await req.json();
  } else if (contentType?.includes('application/x-www-form-urlencoded')) {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const body: { [key: string]: string } = {};
    for (const [key, value] of params.entries()) {
      body[key] = value;
    }
    return body;
  } else {
    // Default to JSON parsing if content-type is not explicitly handled or is missing
    // Or throw an error if you want to strictly enforce content types
    try {
      return await req.json();
    } catch (error) {
      return {}; // Return empty object if JSON parsing fails for unknown content type
    }
  }
}
