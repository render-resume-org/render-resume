import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

interface ResumeSectionProps {
  title: string;
  icon?: React.ElementType;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
  children: React.ReactNode;
  showIcon?: boolean;
  onEdit?: () => void;
  inlineEditable?: boolean;
}

const ResumeSection = ({
  title,
  icon: Icon,
  className,
  titleClassName,
  iconClassName,
  children,
  showIcon = true,
  onEdit,
  inlineEditable,
}: ResumeSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const handleDoubleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <section ref={sectionRef} onDoubleClick={handleDoubleClick} className={cn('resume-section group relative', className)}>
      <h3 className={cn('resume-section-title', titleClassName)}>
        {Icon && showIcon && <Icon className={cn('resume-section-icon mr-2', iconClassName)} />}
        {title}
        {inlineEditable && (
          <span className="ml-2 text-xs text-blue-500 opacity-60" title="This section is editable">
            ✏️
          </span>
        )}
      </h3>
      <div className="resume-section-content">
        {children}
      </div>
    </section>
  );
};

export default ResumeSection; 