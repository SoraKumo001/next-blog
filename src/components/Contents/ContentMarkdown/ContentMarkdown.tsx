import React, { FC } from 'react';
import styled from './ContentMarkdown.module.scss';
import ReactMarkdown from 'react-markdown';
import { PrismAsync } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type mdast from 'mdast';
import { VNode } from '@/hooks/useMarkdown';
interface Props {
  children?: string;
}

/**
 * ContentMarkdown
 *
 * @param {Props} { }
 */
export const ContentMarkdown: FC<Props> = ({ children }) => {
  const plugin = () => {
    return (node: mdast.Root) => {
      const children = node.children as VNode[];
      for (const v of children) {
        if (v.type === 'heading') {
          v.depth += 1;
        }
      }
    };
  };
  const components: Parameters<typeof ReactMarkdown>[0]['components'] = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <code className={className}>
          <PrismAsync style={prism} language={match[1]} PreTag="div" {...{ ...props, ref: null }}>
            {String(children).replace(/\n$/, '')}
          </PrismAsync>
        </code>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
  const handleImage = (src: string) => {
    const m = /https:\/\/drive\.google\.com\/file\/d\/(.*)\//.exec(src);
    return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : src;
  };
  return (
    <ReactMarkdown
      className={styled.root}
      components={components}
      transformImageUri={handleImage}
      plugins={[plugin]}
    >
      {children || ''}
    </ReactMarkdown>
  );
};
