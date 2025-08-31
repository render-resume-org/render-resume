import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import InlineText from './inline-text';

interface ResumeHeaderProps {
  personalInfo: OptimizedResume['personalInfo'];
  template: ResumeTemplate;
  inlineEditable?: boolean;
  onInlineChange?: (payload: { path: string; value: string }) => void;
  highlightForPath?: (path: string) => 'set' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function ResumeHeader({ personalInfo, template, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: ResumeHeaderProps) {
  const { font, styles } = template;

  if (template.id === 'latex') {
    return (
      <header className={cn(styles.header)}>
        <h1 className={cn(font.sizes.title, 'text-black')}>
          {inlineEditable ? (
            <InlineText
              text={personalInfo.fullName || '姓名未提供'}
              inlineEditable
              highlightType={highlightForPath?.('personalInfo.fullName')}
              previewOriginal={getPreviewValueForPath?.('personalInfo.fullName')?.before}
              previewReplaceWith={getPreviewValueForPath?.('personalInfo.fullName')?.after}
              onChange={(t) => onInlineChange?.({ path: 'personalInfo.fullName', value: t })}
            />
          ) : (
            personalInfo.fullName || '姓名未提供'
          )}
        </h1>
        <div className={cn(font.sizes.subtitle, 'text-black flex justify-center items-center space-x-2')}>
          {personalInfo.email && (
            inlineEditable ? (
              <InlineText text={personalInfo.email} inlineEditable highlightType={highlightForPath?.('personalInfo.email')} previewOriginal={getPreviewValueForPath?.('personalInfo.email')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.email')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.email', value: t })} />
            ) : (
              <span>{personalInfo.email}</span>
            )
          )}
          {personalInfo.email && personalInfo.phone && <span>{'//'}</span>}
          {personalInfo.phone && (
            inlineEditable ? (
              <InlineText text={personalInfo.phone} inlineEditable highlightType={highlightForPath?.('personalInfo.phone')} previewOriginal={getPreviewValueForPath?.('personalInfo.phone')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.phone')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.phone', value: t })} />
            ) : (
              <span>{personalInfo.phone}</span>
            )
          )}
          {personalInfo.linkedin && (
            <>
              <span>{'//'}</span>
              {inlineEditable ? (
                <InlineText text={personalInfo.linkedin} inlineEditable highlightType={highlightForPath?.('personalInfo.linkedin')} previewOriginal={getPreviewValueForPath?.('personalInfo.linkedin')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.linkedin')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.linkedin', value: t })} />
              ) : (
                <span>{personalInfo.linkedin}</span>
              )}
            </>
          )}
          {personalInfo.github && (
            <>
              <span>{'//'}</span>
              {inlineEditable ? (
                <InlineText text={personalInfo.github} inlineEditable highlightType={highlightForPath?.('personalInfo.github')} previewOriginal={getPreviewValueForPath?.('personalInfo.github')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.github')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.github', value: t })} />
              ) : (
                <span>{personalInfo.github}</span>
              )}
            </>
          )}
          {personalInfo.website && (
            <>
              <span>{'//'}</span>
              {inlineEditable ? (
                <InlineText text={personalInfo.website} inlineEditable highlightType={highlightForPath?.('personalInfo.website')} previewOriginal={getPreviewValueForPath?.('personalInfo.website')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.website')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.website', value: t })} />
              ) : (
                <span>{personalInfo.website}</span>
              )}
            </>
          )}
        </div>
      </header>
    );
  }

  // Standard template
  return (
    <header className={cn(styles.header)}>
      <h1 className={cn(font.sizes.title, 'text-black text-center mb-1')}>
        {inlineEditable ? (
          <InlineText
            text={personalInfo.fullName || '姓名未提供'}
            inlineEditable
            onChange={(t) => onInlineChange?.({ path: 'personalInfo.fullName', value: t })}
          />
        ) : (
          personalInfo.fullName || '姓名未提供'
        )}
      </h1>
      
      <div className={cn('text-center', font.sizes.body, 'text-black')}>
        {inlineEditable ? (
          <>
            <InlineText text={personalInfo.location} inlineEditable highlightType={highlightForPath?.('personalInfo.location')} previewOriginal={getPreviewValueForPath?.('personalInfo.location')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.location')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.location', value: t })} />
            {'・'}
            <InlineText text={personalInfo.phone} inlineEditable highlightType={highlightForPath?.('personalInfo.phone')} previewOriginal={getPreviewValueForPath?.('personalInfo.phone')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.phone')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.phone', value: t })} />
            {'・'}
            <InlineText text={personalInfo.email} inlineEditable highlightType={highlightForPath?.('personalInfo.email')} previewOriginal={getPreviewValueForPath?.('personalInfo.email')?.before} previewReplaceWith={getPreviewValueForPath?.('personalInfo.email')?.after} onChange={(t) => onInlineChange?.({ path: 'personalInfo.email', value: t })} />
            {personalInfo.linkedin ? (<><span>{'・'}</span><InlineText text={personalInfo.linkedin} inlineEditable onChange={(t) => onInlineChange?.({ path: 'personalInfo.linkedin', value: t })} /></>) : null}
            {personalInfo.github ? (<><span>{'・'}</span><InlineText text={personalInfo.github} inlineEditable onChange={(t) => onInlineChange?.({ path: 'personalInfo.github', value: t })} /></>) : null}
            {personalInfo.website ? (<><span>{'・'}</span><InlineText text={personalInfo.website} inlineEditable onChange={(t) => onInlineChange?.({ path: 'personalInfo.website', value: t })} /></>) : null}
          </>
        ) : (
          [
            personalInfo.location,
            personalInfo.phone,
            personalInfo.email,
            personalInfo.linkedin,
            personalInfo.github,
            personalInfo.website
          ].filter(Boolean).join('・')
        )}
      </div>
    </header>
  );
} 