import { ErrorReset } from './reset';
import { NotchTailIcon } from './icons';
import { TextTransform } from '@repo/utils';
import { ChevronFillIcon } from '@repo/icons';
import { errorParser, HttpErrorProps } from './lib';
import { parseErrorStack, type ParsedStack } from './utils/stack-parser';

function NavPagination() {
  return (
    <>
      <button type="button" aria-label="error-previous" disabled aria-disabled="true" data-dialog-error-previous="" className="error-overlay-pagination-button">
        <ChevronFillIcon chevron="left" className="error-overlay-pagination-button-icon" />
      </button>
      <div className="error-overlay-pagination-count">
        <span data-dialog-error-index="0">1/</span>
        <span data-dialog-header-total-count="">1</span>
      </div>
      <button type="button" aria-label="error-next" disabled aria-disabled="true" data-dialog-error-next="" className="error-overlay-pagination-button">
        <ChevronFillIcon chevron="right" className="error-overlay-pagination-button-icon" />
      </button>
    </>
  );
}

export function ErrorBlockHead({ error }: { error: HttpErrorProps['error'] }) {
  const stack = parseErrorStack(error?.stack);

  return (
    <div data-error-overlay-nav="">
      <div className="error-overlay-notch" data-side="left">
        <nav className="error-overlay-pagination dialog-exclude-closing-from-outside-click">
          <span className="overlay-protocol-desc">
            <span className="protocol-desc">{stack?.protocol !== 'unknown' ? TextTransform.text(stack?.protocol) : 'Error'}</span>
          </span>
        </nav>
        <NotchTailIcon className="error-overlay-notch-tail" />
      </div>
      <div className="error-overlay-notch" data-side="right">
        <p className="container-build-error-version-status dialog-exclude-closing-from-outside-click">
          <span data-staleness-indicator="" className="stale" />
          <span data-version-checker="true" title={stack?.type}>
            {process.env.NEXT_PUBLIC_SITE_URL}
          </span>
        </p>
        <NotchTailIcon className="error-overlay-notch-tail" />
      </div>
    </div>
  );
}

export function ErrorBlockBody({ error, reset }: HttpErrorProps) {
  const stack = parseErrorStack(error?.stack);

  const errorCause = stack?.message || errorParser((typeof (error as any)?.cause === 'object' ? JSON.stringify((error as any)?.cause, null, 2) : (error as any)?.cause) || error.message);

  return (
    <div data-dialog-content="">
      <div data-dialog-header="">
        <div className="flex flex-row items-center justify-between mb-3.5">
          <p data-environment="" className="flex flex-row items-center gap-2">
            {stack?.type && <span data-environment-type="">{stack?.type}</span>}
            <span data-environment-name-label="">{TextTransform.text(stack?.origin)}</span>
          </p>
          <ErrorReset reset={reset} />
        </div>
        <div className="relative">
          <p className="errors-desc">{errorCause}</p>
        </div>
      </div>
      <div data-dialog-body="">
        <div data-codeframe="">
          <div data-codeframe-header="">
            <div className="flex flex-row items-center gap-2">
              <p>{error.digest ? `Digest: ${error.digest}` : 'Console'}</p>
            </div>
            <a className="cursor-default text-sm font-semibold text-muted-foreground hover:text-color">↪</a>
          </div>
          <pre data-codeframe-content="">
            <ErrorStack stack={stack} />
          </pre>
        </div>
      </div>
    </div>
  );
}

// Padding untuk line number: berdasarkan selisih digit
const getLinePadding = (digitCount: number, currentLength: number, padChar = ' ') => {
  return padChar.repeat(Math.max(digitCount - currentLength, 0));
};

// Padding untuk resource: selalu berdasarkan digitCount penuh
const getResourcePadding = (digitCount: number, padChar = ' ') => {
  return padChar.repeat(Math.max(digitCount - 1, 0));
};

function ErrorStack({ stack: parsed }: { stack: ParsedStack | null }) {
  if (!parsed) return null;

  const totalLines = parsed.stack.length;
  const digitCount = totalLines.toString().length;

  return (
    <div data-line-numbers={digitCount} className="max-h-80 overflow-y-auto pr-4 pb-3 grid">
      {parsed.stack.map((s, idx) => {
        const lineNumb = idx + 1;
        const paddedLength = lineNumb.toString().length;

        const padd = getLinePadding(digitCount, paddedLength);
        const paddRsc = getResourcePadding(digitCount);

        const srcOrigin = s.origin !== 'unknown' && `(${s.origin})`;
        const srcFile = s.file && decodeURIComponent(s.file);
        const srcLine = s.line && `line: ${s.line}`;
        const srcColumn = s.column && `column: ${s.column}`;
        const resource = [srcFile, [srcLine, srcColumn].join(', ')].filter(Boolean);

        return (
          <span key={idx} data-line="" className="grid">
            <span data-line-origin="">
              <span data-number="">
                {lineNumb}&nbsp;{`${padd}|`}&nbsp;
              </span>
              {s.function}&nbsp;{srcOrigin}
            </span>
            {resource?.map((x, i) => (
              <span key={i} style={{ color: 'var(--muted-foreground)' }}>
                <span data-number="">{`  ${paddRsc}|`}&nbsp;</span>
                {x}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
