/* eslint-disable @next/next/no-img-element */
import React, { ElementType, FC, ReactNode } from 'react';
import styled from './ContentMarkdown.module.scss';
import ReactMarkdown from 'react-markdown';
import { PrismAsync } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import type mdast from 'mdast';
import type hast from 'hast';
import { VNode } from '@/hooks/useMarkdown';
import { LinkTarget } from '@/components/Commons/LinkTarget';
import Link from 'next/link';
interface Props {
  directStorage: boolean;
  children?: string;
}

/**
 * ContentMarkdown
 *
 * @param {Props} { }
 */
export const ContentMarkdown: FC<Props> = ({ directStorage, children }) => {
  const plugin = () => {
    return (node: mdast.Root) => {
      let index = 0;
      const children = node.children as VNode[];
      for (const v of children) {
        if (v.type === 'heading') {
          v.depth += 1;
          v.data = { id: String(index++) };
        }
      }
    };
  };
  let index = 0;
  const headerProp = ({ node, children }: { node: hast.Element; children: ReactNode }) => {
    const Tag: ElementType = node.tagName as 'h1';
    return (
      <>
        <LinkTarget id={`header-${index++}`} />
        <Tag>{children}</Tag>
      </>
    );
  };
  const components: Parameters<typeof ReactMarkdown>[0]['components'] = {
    h1: headerProp,
    h2: headerProp,
    h3: headerProp,
    h4: headerProp,
    h5: headerProp,
    h6: headerProp,
    a({ href, children }) {
      if (href?.match(/^https:\/\/codepen.io\//)) {
        return (
          <iframe
            frameBorder="no"
            loading="lazy"
            allowFullScreen={true}
            allowTransparency={true}
            src={href.replace('/pen/', '/embed/')}
          />
        );
      }
      return (
        <Link href={href!}>
          <a target={href?.match(/https?:/) ? '_blank' : undefined}>{children}</a>
        </Link>
      );
    },
    img({ src, alt }) {
      try {
        const styleString = alt?.match(/^{.*}$/);
        const style = styleString ? JSON.parse(alt!) : undefined;
        return <img src={src} style={style} alt="" />;
      } catch {}
      return <img src={src} alt="" />;
    },
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <code className={className}>
          <PrismAsync style={prism} language={match[1]} PreTag="div" {...{ ...props, ref: null }}>
            {String(children).replace(/\n$/, '')}{' '}
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
    //const m = /https:\/\/drive\.google\.com\/file\/d\/(.*)\//.exec(src);
    // if(m){
    //   return `https://drive.google.com/uc?export=download&id=${m[1]}`
    // }
    if (directStorage) {
      const m = new RegExp(
        `https://firebasestorage\.googleapis\.com/v0/b/${process.env.NEXT_PUBLIC_storageBucket}/o/(.+)\\?`
      ).exec(src);
      if (m) {
        return `https://storage.googleapis.com/${process.env.NEXT_PUBLIC_storageBucket}/${m[1]}`;
      }
    }
    return src;
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
