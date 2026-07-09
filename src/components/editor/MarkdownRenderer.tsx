import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

const MarkdownRenderer = ({ content, className, style }: MarkdownRendererProps) => {
  if (!content) return null;
  return (
    <div className={`markdown-content ${className || ''}`} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children, ...props }) => <p className="text-sm leading-relaxed" style={style} {...props}>{children}</p>,
          ul: ({ children, ...props }) => <ul className="list-disc pl-5 text-sm leading-relaxed space-y-0.5" style={style} {...props}>{children}</ul>,
          ol: ({ children, ...props }) => <ol className="list-decimal pl-5 text-sm leading-relaxed space-y-0.5" style={style} {...props}>{children}</ol>,
          li: ({ children, ...props }) => <li {...props}>{children}</li>,
          strong: ({ children, ...props }) => <strong className="font-semibold" {...props}>{children}</strong>,
          em: ({ children, ...props }) => <em {...props}>{children}</em>,
          h1: ({ children, ...props }) => <h1 className="text-base font-bold mt-2 mb-1" style={style} {...props}>{children}</h1>,
          h2: ({ children, ...props }) => <h2 className="text-sm font-bold mt-2 mb-1" style={style} {...props}>{children}</h2>,
          h3: ({ children, ...props }) => <h3 className="text-sm font-semibold mt-1 mb-0.5" style={style} {...props}>{children}</h3>,
          code: ({ children, ...props }) => <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded" {...props}>{children}</code>,
          a: ({ children, href, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: style?.color }} {...props}>{children}</a>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
