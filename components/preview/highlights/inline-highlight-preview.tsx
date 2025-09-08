import { cn } from '@/lib/utils';
import type React from 'react';

export type InlineHighlightMode = 'set' | 'insert' | 'remove';

type InlineDataAttributes = {
  'data-inline-group'?: string;
  'data-inline-order'?: string;
};

interface InlineHighlightPreviewProps {
  mode: InlineHighlightMode;
  beforeText?: string;
  afterText?: string;
  className?: string;
  beforeClassName?: string;
  afterClassName?: string;
  containerRef?: React.Ref<HTMLSpanElement>;
  afterRef?: React.Ref<HTMLSpanElement>;
  containerProps?: Omit<React.HTMLAttributes<HTMLSpanElement>, keyof InlineDataAttributes> & InlineDataAttributes;
  afterProps?: Omit<React.HTMLAttributes<HTMLSpanElement>, keyof InlineDataAttributes> & InlineDataAttributes;
}

export default function InlineHighlightPreview({
  mode,
  beforeText,
  afterText,
  className,
  beforeClassName,
  afterClassName,
  containerRef,
  afterRef,
  containerProps,
  afterProps,
}: InlineHighlightPreviewProps) {
  const showBefore = (mode === 'set' || mode === 'remove') && typeof beforeText === 'string';
  const showAfter = typeof afterText === 'string' && afterText.trim() !== '' && mode !== 'remove';

  return (
    <span
      ref={containerRef}
      className={cn('inline-flex flex-col gap-1', className, containerProps?.className)}
      {...containerProps}
    >
      {showBefore && (
        <span
          className={cn(
            'cursor-text bg-red-50 decoration-red-400 decoration-2 underline-offset-2  text-red-700 dark:text-red-300 dark:bg-red-900/20 p-1 px-2 rounded-md',
            beforeClassName
          )}
        >
          {beforeText}
        </span>
      )}
      {showAfter && (
        <span
          ref={afterRef}
          suppressContentEditableWarning
          contentEditable={true}
          className={cn(
            'cursor-text bg-green-50 decoration-green-500 decoration-2 underline-offset-2 text-green-800 dark:text-green-200 dark:bg-green-900/20 p-1 px-2 rounded-md outline-none',
            afterClassName,
            afterProps?.className
          )}
          {...afterProps}
        />
      )}
    </span>
  );
}


