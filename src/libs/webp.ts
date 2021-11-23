import encode from '@jsquash/webp/encode';

export const convertWebp = async (blob: Blob) => {
  if (!blob.type.match(/^image\/(png|jpeg)/)) return blob;
  const src = await blob
    .arrayBuffer()
    .then((v) => `data:${blob.type};base64,` + Buffer.from(v).toString('base64'));
  const img = document.createElement('img');
  img.src = src;
  await new Promise((resolve) => (img.onload = resolve));
  const canvas = document.createElement('canvas');
  [canvas.width, canvas.height] = [img.width, img.height];
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  return new Blob([await encode(ctx.getImageData(0, 0, img.width, img.height))], {
    type: 'image/webp',
  });
};

export const getImageSize = async (blob: Blob) => {
  const src = await blob
    .arrayBuffer()
    .then((v) => `data:${blob.type};base64,` + Buffer.from(v).toString('base64'));
  const img = document.createElement('img');
  img.src = src;
  await new Promise((resolve) => (img.onload = resolve));
  return { width: img.naturalWidth, height: img.naturalHeight };
};