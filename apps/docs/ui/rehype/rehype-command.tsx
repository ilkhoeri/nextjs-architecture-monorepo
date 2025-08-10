'use client';
import * as React from 'react';
import { cn } from '@repo/utils';
import { Button } from '@repo/ui';
import { Tabs } from '@repo/ui/tabs';
import { useConfig } from './config';
import { NpmCommands } from './types';
import { visit } from 'unist-util-visit';
import { HasCopyIcon } from '@repo/icons';
import { Tooltip } from '@repo/ui/tooltip';
import { Event, trackEvent } from './event';
import { UnistNode, UnistTree } from './types';
import { ScrollArea } from '@repo/ui/scroll-area';

export function rehypeCommand() {
  return (tree: UnistTree) => {
    visit(tree, (node: UnistNode) => {
      if (node.type !== 'element' || node?.tagName !== 'pre') {
        return;
      }

      // npm install.
      if (node.properties?.['__rawString__']?.startsWith('npm install')) {
        const npmCommand = node.properties?.['__rawString__'];
        node.properties['__npmCommand__'] = npmCommand;
        node.properties['__yarnCommand__'] = npmCommand.replace('npm install', 'yarn add');
        node.properties['__pnpmCommand__'] = npmCommand.replace('npm install', 'pnpm add');
        node.properties['__bunCommand__'] = npmCommand.replace('npm install', 'bun add');
      }

      // npx create-.
      if (node.properties?.['__rawString__']?.startsWith('npx create-')) {
        const npmCommand = node.properties?.['__rawString__'];
        node.properties['__npmCommand__'] = npmCommand;
        node.properties['__yarnCommand__'] = npmCommand.replace('npx create-', 'yarn create ');
        node.properties['__pnpmCommand__'] = npmCommand.replace('npx create-', 'pnpm create ');
        node.properties['__bunCommand__'] = npmCommand.replace('npx', 'bunx --bun');
      }

      // npm create.
      if (node.properties?.['__rawString__']?.startsWith('npm create')) {
        const npmCommand = node.properties?.['__rawString__'];
        node.properties['__npmCommand__'] = npmCommand;
        node.properties['__yarnCommand__'] = npmCommand.replace('npm create', 'yarn create');
        node.properties['__pnpmCommand__'] = npmCommand.replace('npm create', 'pnpm create');
        node.properties['__bunCommand__'] = npmCommand.replace('npm create', 'bun create');
      }

      // npm run.
      if (node.properties?.['__rawString__']?.startsWith('npm run')) {
        const npmCommand = node.properties?.['__rawString__'];
        node.properties['__npmCommand__'] = npmCommand;
        node.properties['__yarnCommand__'] = npmCommand.replace('npm run', 'yarn');
        node.properties['__pnpmCommand__'] = npmCommand.replace('npm run', 'pnpm run');
        node.properties['__bunCommand__'] = npmCommand.replace('npm run', 'bun');
      }

      // npx.
      if (node.properties?.['__rawString__']?.startsWith('npx') && !node.properties?.['__rawString__']?.startsWith('npx create-')) {
        const npmCommand = node.properties?.['__rawString__'];
        node.properties['__npmCommand__'] = npmCommand;
        node.properties['__yarnCommand__'] = npmCommand;
        node.properties['__pnpmCommand__'] = npmCommand.replace('npx', 'pnpm dlx');
        node.properties['__bunCommand__'] = npmCommand.replace('npx', 'bunx --bun');
      }
    });
  };
}

export function CodeBlockCommand(_props: React.ComponentProps<'pre'> & NpmCommands) {
  const { __npmCommand__, __yarnCommand__, __pnpmCommand__, __bunCommand__ } = _props;
  const [config, setConfig] = useConfig();
  const [copied, setCopied] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const packageManager = config.packageManager || 'pnpm';
  const tabs = React.useMemo(() => {
    return {
      pnpm: __pnpmCommand__,
      npm: __npmCommand__,
      yarn: __yarnCommand__,
      bun: __bunCommand__
    };
  }, [__npmCommand__, __pnpmCommand__, __yarnCommand__, __bunCommand__]);

  async function copyToClipboardWithMeta(value: string, event?: Event) {
    navigator.clipboard.writeText(value.trimEnd());
    if (event) {
      trackEvent(event);
    }
  }

  const copyCommand = React.useCallback(() => {
    const command = tabs[packageManager];

    if (!command) {
      return;
    }

    copyToClipboardWithMeta(command, {
      name: 'copy_npm_command',
      properties: {
        command,
        pm: packageManager
      }
    });
    setCopied(true);
  }, [packageManager, tabs]);

  const copyLabel = 'Copy';
  const copiedLabel = 'Copied';

  return (
    <div data-installation="" className="relative mt-6 max-h-[650px] overflow-hidden rounded-xl border">
      <Tabs
        unstyled
        value={packageManager}
        defaultValue={packageManager}
        onChange={value => {
          setConfig({
            ...config,
            packageManager: value as 'pnpm' | 'npm' | 'yarn' | 'bun'
          });
        }}
      >
        <Tabs.List className="flex flex-row items-center justify-start gap-3 border-b bg-muted/45 px-3 pt-0.5">
          {Object.entries(tabs).map(([key]) => {
            return (
              <Tabs.Tab
                key={key}
                value={key}
                data-pm={key}
                className={cn('-mb-px border-b border-transparent p-1 font-geist-mono text-muted-foreground', {
                  'aria-selected:border-color aria-selected:text-color': mounted
                })}
              >
                {key}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {Object.entries(tabs).map(([key, value]) => {
          return (
            <ScrollArea key={key} dir="ltr" orientation="horizontal" classNames={{ viewport: 'bg-[var(--bg-code,hsl(var(--primitive)))]' }}>
              <Tabs.Panel
                value={key}
                className={cn('mt-0 px-4 py-5', {
                  'text-transparent': !mounted
                  // "[--pre-p:0] [--code-p:0] [--code-fz:1rem] [--code-leading:1.55]": isHighlight
                })}
                // dangerouslySetInnerHTML={isHighlight ? { __html: highlighted.code } : undefined}
              >
                <code data-language="bash" className={cn('inline-flex min-w-max', { 'text-transparent': !mounted })}>
                  {(value || '')?.trim()}
                </code>
              </Tabs.Panel>
            </ScrollArea>
          );
        })}
      </Tabs>

      <Tooltip asChild content={copied ? copiedLabel : copyLabel} side="left" aria-label={copied ? copiedLabel : copyLabel}>
        <Button size="icon" variant="ghost" className="[--sz:28px] absolute right-1 top-[3px] z-10 border-0 [&_svg]:size-4" onClick={copyCommand}>
          <span className="sr-only">Copy</span>
          <HasCopyIcon has={copied} />
        </Button>
      </Tooltip>
    </div>
  );
}
