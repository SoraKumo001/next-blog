import { getDownloadURL, ref } from 'firebase/storage';
import { firestorage } from './firebase';
import type unist from 'unist';
import type mdast from 'mdast';
import { unified, Processor } from 'unified';
import remarkParse from 'remark-parse';

export const convertUrl = async (storage: string, url: string) => {
  const re = new RegExp(`https://firebasestorage.googleapis.com/v0/b/${storage}/o/(.+)\\?`);
  const image = url.match(re)?.[1];
  if (!image) return url;
  return (
    (firestorage &&
      (await getDownloadURL(ref(firestorage, decodeURIComponent(image))).catch(() => undefined))) ||
    url
  );
};

function compiler(this: Processor, storage: string) {
  this.Compiler = async (v: mdast.Root, vfile): Promise<string> => {
    const src = vfile.value;
    let buffer = '';
    let point = 0;
    const convert = async (children: VNode[]) => {
      for (const v of children) {
        if (v.type === 'image') {
          buffer += `![${v.alt}](${await convertUrl(storage, v.url)})`;
          point = v.position!.end.offset!;
        } else {
          if ('value' in v && v.position?.start.offset) {
            buffer += src.slice(point, v.position.start.offset);
            point = v.position.start.offset;
          }
          v.children && (await convert(v.children as VNode[]));
        }
      }
    };
    await convert(v.children);
    buffer += src.slice(point);
    return buffer;
  };
}

type VNode = mdast.Content & Partial<unist.Parent<mdast.Content>>;

export const convertImageLink = async (storage: string, value: string) => {
  const processor = unified()
    .use(remarkParse)
    .use([[compiler, storage]]);
  return (await processor().process(value)).result as string;
};
