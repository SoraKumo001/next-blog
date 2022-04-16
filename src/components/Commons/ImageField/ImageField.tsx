/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useRef, useState } from 'react';
import styled from './ImageField.module.scss';
import { classNames } from '@/libs/classNames';
import { convertWebp } from '@/libs/webp';
import { Buffer } from 'buffer';
interface Props {
  className?: string;
  onChange?: (value: Blob | null) => void;
  src?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

/**
 * ImageField
 *
 * @param {Props} { }
 */
export const ImageField: FC<Props> = ({ className, onChange, children, src, width, height }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isDrag, setDrag] = useState(false);
  const [imageData, setImageData] = useState<string | undefined>(src);
  const convertUrl = async (blob: Blob | undefined | null) => {
    if (!blob) return undefined;
    return `data:image/webp;base64,` + Buffer.from(await blob.arrayBuffer()).toString('base64');
  };
  useEffect(() => {
    const handle = () => {
      navigator.clipboard.read().then((items) => {
        for (const item of items) {
          item.getType('image/png').then(async (value) => {
            const v = await convertWebp(value);
            onChange?.(v);
            convertUrl(v).then(setImageData);
          });
        }
      });
    };
    addEventListener('paste', handle);
    return () => removeEventListener('paste', handle);
  }, [onChange]);
  return (
    <div
      className={classNames(styled.root, isDrag && styled.dragover, className)}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        ref.current?.click();
        e.stopPropagation();
      }}
      onDragEnter={() => setDrag(true)}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        for (const item of e.dataTransfer.files) {
          convertWebp(item).then((blob) => {
            onChange?.(blob);
            convertUrl(blob).then(setImageData);
          });
        }
        e.preventDefault();
      }}
    >
      {imageData ? (
        <>
          <span
            className={styled.clear}
            onClick={() => {
              setImageData(undefined);
              onChange?.(null);
            }}
          >
            ✖
          </span>
          <img src={imageData} width={width} height={height} />
        </>
      ) : (
        <>
          <input
            ref={ref}
            type="file"
            accept=".jpg, .png, .gif"
            onChange={(e) => {
              const blob = e.currentTarget.files?.[0];
              if (blob) {
                onChange?.(blob);
                convertUrl(blob).then(setImageData);
              }
            }}
          />
          {children}
        </>
      )}
    </div>
  );
};
