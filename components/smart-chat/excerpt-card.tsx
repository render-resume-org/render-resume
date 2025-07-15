
interface ExcerptCardProps {
  excerpt: {
    title: string;
    content: string;
    source: string;
  };
}

const ExcerptCard = ({ excerpt }: ExcerptCardProps) => (
  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 max-w-md">
    <div className="flex items-center space-x-2 mb-2">
      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
      <span className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
        {excerpt.source}
      </span>
    </div>
    <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
      {excerpt.title}
    </h4>
    <p className="text-xs text-orange-800 dark:text-orange-200 whitespace-pre-wrap break-words leading-relaxed">
      {excerpt.content}
    </p>
  </div>
);

export default ExcerptCard; 