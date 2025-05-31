import type { ContentBlock } from '@/entities/ContentBlock';
import { ContentProgress } from '@/features/ContentProgress';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './ContentBlockCard.module.scss';

interface ContentBlockCardProps {
  block: ContentBlock;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ContentBlockCard = ({
  block,
  className,
  variant = 'default',
}: ContentBlockCardProps) => {
  const [isCodeExpanded, setIsCodeExpanded] = useState(!block.isCodeFoldable);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Ошибка копирования URL:', error);
    }
  };

  const renderPathTitles = () => {
    if (block.pathTitles.length <= 1) return null;

    return (
      <div className={styles.pathTitles}>
        {block.pathTitles.slice(0, -1).map((title, index) => (
          <span key={index} className={styles.pathTitle}>
            {title}
            {index < block.pathTitles.length - 2 && (
              <span className={styles.pathSeparator}>→</span>
            )}
          </span>
        ))}
      </div>
    );
  };

  const renderCodeBlock = () => {
    if (!block.codeContent) return null;

    const shouldShowToggle = block.isCodeFoldable;
    const codeTitle = block.codeFoldTitle || 'Код';

    return (
      <div className={styles.codeBlock}>
        {shouldShowToggle && (
          <button
            onClick={() => setIsCodeExpanded(!isCodeExpanded)}
            className={styles.codeToggle}
          >
            <span>{codeTitle}</span>
            {isCodeExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        )}

        {isCodeExpanded && (
          <div className={styles.codeContainer}>
            <SyntaxHighlighter
              language={block.codeLanguage || 'javascript'}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: '6px',
                fontSize: '14px',
              }}
            >
              {block.codeContent}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    );
  };

  const renderUrls = () => {
    if (block.extractedUrls.length === 0) return null;

    return (
      <div className={styles.urls}>
        <h4 className={styles.urlsTitle}>Полезные ссылки:</h4>
        <div className={styles.urlsList}>
          {block.extractedUrls.map((url, index) => (
            <div key={index} className={styles.urlItem}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.urlLink}
              >
                <ExternalLink size={14} />
                {new URL(url).hostname}
              </a>
              <button
                onClick={() => handleCopyUrl(url)}
                className={styles.copyButton}
                aria-label="Копировать ссылку"
              >
                {copiedUrl === url ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div
        className={`${styles.contentBlockCard} ${styles.compact} ${className || ''}`}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{block.blockTitle}</h3>
          <ContentProgress
            blockId={block.id}
            currentCount={block.currentUserSolvedCount}
            variant="compact"
          />
        </div>

        <div className={styles.meta}>
          <span className={styles.category}>
            {block.file.mainCategory} / {block.file.subCategory}
          </span>
          <span className={styles.level}>H{block.blockLevel}</span>
        </div>

        {block.textContent && (
          <p className={styles.textPreview}>
            {block.textContent.length > 100
              ? `${block.textContent.substring(0, 100)}...`
              : block.textContent}
          </p>
        )}
      </div>
    );
  }

  return (
    <article
      className={`${styles.contentBlockCard} ${styles.default} ${className || ''}`}
    >
      <header className={styles.header}>
        {renderPathTitles()}

        <div className={styles.titleRow}>
          <h2 className={styles.title}>{block.blockTitle}</h2>
          <ContentProgress
            blockId={block.id}
            currentCount={block.currentUserSolvedCount}
            variant={variant === 'detailed' ? 'detailed' : 'default'}
          />
        </div>

        <div className={styles.meta}>
          <span className={styles.category}>
            {block.file.mainCategory} / {block.file.subCategory}
          </span>
          <span className={styles.level}>Уровень {block.blockLevel}</span>
          <span className={styles.order}>#{block.orderInFile}</span>
        </div>
      </header>

      <div className={styles.content}>
        {block.textContent && (
          <div className={styles.textContent}>
            <p>{block.textContent}</p>
          </div>
        )}

        {renderCodeBlock()}
        {renderUrls()}
      </div>

      <footer className={styles.footer}>
        <div className={styles.fileInfo}>
          <span className={styles.filePath}>{block.file.webdavPath}</span>
        </div>

        <div className={styles.timestamps}>
          <time className={styles.timestamp}>
            Создано: {new Date(block.createdAt).toLocaleDateString('ru-RU')}
          </time>
          {block.updatedAt !== block.createdAt && (
            <time className={styles.timestamp}>
              Обновлено: {new Date(block.updatedAt).toLocaleDateString('ru-RU')}
            </time>
          )}
        </div>
      </footer>
    </article>
  );
};
