export type StackOrigin = 'server' | 'client' | 'node' | 'mixed' | 'unknown';

export type ParsedStackEntry = {
  function: string;
  file: string;
  line: number | null;
  column: number | null;
  raw: string;
  isUserCode: boolean;
  origin: Exclude<StackOrigin, 'mixed'>;
  protocol?: string;
};

export type ParsedStack = {
  type: string;
  message: string;
  origin: StackOrigin;
  protocol: 'runtime' | 'validation' | 'database' | 'network' | 'unknown';
  stack: ParsedStackEntry[];
};

function detectOriginFromError(type: string, message: string): ParsedStack['protocol'] {
  const t = type.toLowerCase();
  const m = message.toLowerCase();

  if (t.includes('zod') || m.includes('validation')) return 'validation';
  if (t.includes('prisma') || m.includes('database') || m.includes('sql')) return 'database';
  if (t.includes('axios') || m.includes('network') || m.includes('fetch')) return 'network';
  if (t.includes('referenceerror') || t.includes('typeerror') || t.includes('syntaxerror')) return 'runtime';
  return 'unknown';
}

export function parseErrorStack(stack: string | null | undefined, basePath?: string): ParsedStack | null {
  if (!stack) return null;

  const lines = stack.split('\n').filter(Boolean);

  const [typePart, ...messageParts] = lines[0].split(':');
  const type = typePart.trim();
  const message = messageParts.join(':').trim();

  const stackEntries: ParsedStackEntry[] = lines.slice(1).map(line => {
    const trimmed = line.trim().replace(/^at\s+/, '');

    const match = trimmed.match(/^(.*?) \((.*?):(\d+):(\d+)\)$/) || trimmed.match(/^(.*?):(\d+):(\d+)$/);

    let func = '<anonymous>';
    let file = '';
    let lineNum: number | null = null;
    let colNum: number | null = null;

    if (match) {
      if (match.length === 5) {
        func = match[1].trim();
        file = match[2];
        lineNum = parseInt(match[3], 10);
        colNum = parseInt(match[4], 10);
      } else if (match.length === 4) {
        file = match[1];
        lineNum = parseInt(match[2], 10);
        colNum = parseInt(match[3], 10);
      }
    } else {
      func = trimmed;
    }

    // Hilangkan basePath jika ada
    if (basePath && file.startsWith(basePath)) {
      file = file.slice(basePath.length);
      if (file.startsWith('/') || file.startsWith('\\')) {
        file = file.slice(1);
      }
    }

    // Identifikasi apakah ini user code atau internal
    const isUserCode = file.includes('\\apps\\') || file.includes('/apps/') || file.includes('/src/');

    // Deteksi asal file
    let origin: ParsedStackEntry['origin'] = 'unknown';
    if (file.startsWith('rsc://')) origin = 'server';
    else if (file.startsWith('http://') || file.startsWith('https://')) origin = 'client';
    else if (file.includes('node_modules')) origin = 'node';

    // Ambil protokol kalau ada
    const protocolMatch = file.match(/^([a-zA-Z]+):\/\//);
    const protocol = protocolMatch ? protocolMatch[1] : undefined;

    return {
      function: func,
      file,
      line: lineNum,
      column: colNum,
      raw: trimmed,
      isUserCode,
      origin,
      protocol
    };
  });

  // Tentukan origin global
  const uniqueOrigins = [...new Set(stackEntries.map(s => s.origin))];
  const globalOrigin: StackOrigin = uniqueOrigins[0];
  // const globalOrigin: StackOrigin = uniqueOrigins.length === 1 ? uniqueOrigins[0] : 'mixed';

  const globalProtocol = detectOriginFromError(type, message);

  return { type, message, origin: globalOrigin, protocol: globalProtocol, stack: stackEntries };
}
