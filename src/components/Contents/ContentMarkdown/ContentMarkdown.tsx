import React, { Children, FC, ReactElement, ReactNode, useRef } from 'react';
import styled from './ContentMarkdown.module.scss';
import ReactMarkdown from 'react-markdown';
import { PrismAsyncLight } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Transformer, Plugin } from 'unified';
import type unist from 'unist';
import { Parent } from 'mdast';

const getNodeText = (node: ReactNode): string => {
  if (!node) return '';
  if (typeof node === 'string') return node;
  return (
    Children.map(node, (c) => {
      if (!c || typeof c !== 'object') return String(c);
      return getNodeText((c as ReactElement)?.props?.children);
    })?.join('') || ''
  );
};

const getTreeText = (
  node: unist.Node & Partial<Parent> & Partial<unist.Literal<string>>
): string => {
  return (node.value || '') + (node.children?.map((node) => getTreeText(node)).join('') || '');
};

interface Props {
  onTitle: (title: string) => void;
}

/**
 * ContentMarkdown
 *
 * @param {Props} { }
 */
export const ContentMarkdown: FC<Props> = ({ children, onTitle }) => {
  const values = useRef<{ title?: string }>({}).current;
  const components: Parameters<typeof ReactMarkdown>[0]['components'] = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <code className={className}>
          <PrismAsyncLight
            style={prism}
            language={match[1]}
            PreTag="div"
            {...{ ...props, ref: null }}
          >
            {String(children).replace(/\n$/, '')}
          </PrismAsyncLight>
        </code>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
  const test: Plugin = () => {
    const plugin: Transformer = (tree: unist.Node & Partial<Parent>) => {
      const h1 = tree.children?.find((v) => v.type === 'heading' && v.depth === 1);
      if (h1) {
        h1.data = { first: true };
        h1.type = 'text';
        (h1 as any).value = '';
        const title = getTreeText(h1);
        if (values.title === undefined) {
          values.title = title;
        } else if (title !== values.title) {
          values.title = title;
          onTitle?.(title);
        }
      }
      return undefined;
    };
    return plugin;
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
      remarkPlugins={[test]}
      //rehypePlugins={[rehypeRaw, test]}
    >
      {getNodeText(children)}
    </ReactMarkdown>
  );
};
