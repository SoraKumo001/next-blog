import { Children, ReactElement, ReactNode, useMemo } from 'react';
import type unist from 'unist';
import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';
import type mdast from 'mdast';
import { Parent } from 'mdast';
export type MarkdownTitles = { text: string; depth: number }[];

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

export const getTreeText = (
  node: unist.Node & Partial<Parent> & Partial<unist.Literal<string>>
): string => {
  return (node.value || '') + (node.children?.map((node) => getTreeText(node)).join('') || '');
};
export type VNode = mdast.Content & Partial<unist.Parent<mdast.Content>>;
const plugin = (headers: MarkdownTitles, images: string[]) => {
  const proc = (children: VNode[]) => {
    for (const v of children) {
      if (v.type === 'heading') {
        headers.push({ text: getTreeText(v), depth: v.depth });
        v.depth += 1;
      } else if (v.type === 'image') {
        images.push(v.url);
      } else {
        v.children && proc(v.children as VNode[]);
      }
    }
  };
  return (node: mdast.Root) => {
    proc(node.children as VNode[]);
  };
};
function compiler(this: Processor) {
  this.Compiler = () => {};
}

export const useMarkdownValues = (value?: string) => {
  return useMemo(() => {
    if (!value) return { titles: [], images: [] };
    const titles: MarkdownTitles = [];
    const images: string[] = [];
    const processor = unified().use(remarkParse).use(plugin, titles, images).use(compiler);
    processor.processSync(value);
    return { titles, images };
  }, [value]);
};
