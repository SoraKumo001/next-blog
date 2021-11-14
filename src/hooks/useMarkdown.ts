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
const plugin = (headers: MarkdownTitles) => {
  return (node: mdast.Root) => {
    const children = node.children as VNode[];
    for (const v of children) {
      if (v.type === 'heading') {
        headers.push({ text: getTreeText(v), depth: v.depth });
        v.depth += 1;
      }
    }
  };
};
function compiler(this: Processor) {
  this.Compiler = () => {};
}

export const useMarkdownTitles = (value?: string) => {
  const titles = useMemo(() => {
    if (!value) return [];
    const headers: MarkdownTitles = [];
    const processor = unified().use(remarkParse).use(plugin, headers).use(compiler);
    processor.processSync(value);
    return headers;
  }, [value]);
  return titles;
};
