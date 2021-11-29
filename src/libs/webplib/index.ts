/* eslint-disable no-unused-vars */
import webp from './webp';

type ModuleType = {
  encode: (data: BufferSource, width: number, height: number, quality: number) => Uint8Array | null;
};

let webpModule: ModuleType;

const getModule = async () => {
  if (!webpModule) webpModule = await webp();
  return webpModule;
};

export const encode: {
  (data: BufferSource, width: number, height: number, quality?: number): Promise<Uint8Array | null>;
  (data: ImageData, quality?: number): Promise<Uint8Array | null>;
} = async (data: BufferSource | ImageData, a?: number, b?: number, c?: number) => {
  const module = await getModule();
  return data instanceof ImageData
    ? module.encode(data.data, data.width, data.height, a || 100)
    : module.encode(data, a as number, b as number, c || 100);
};
