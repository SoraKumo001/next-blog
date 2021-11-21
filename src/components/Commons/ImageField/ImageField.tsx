/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useRef, useState } from 'react';
import styled from './ImageField.module.scss';
import { classNames } from '@/libs/classNames';
import { convertWebp } from '@/libs/webp';
interface Props {
  className?: string;
  onChange?: (value: Blob | null) => void;
  src?: string
}

/**
 * ImageField
 *
 * @param {Props} { }
 */
export const ImageField: FC<Props> = ({ className, onChange, children, src }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [isDrag, setDrag] = useState(false);
  const [imageData, setImageData] = useState<string | undefined>(src);
  const [reader, setReader] = useState<FileReader>();
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      const { result } = reader;
      if (typeof result === 'string') {
        setImageData(result);
      }
    };
    setReader(reader);
    return () => {
      reader.onload = null;
    };
  }, []);
  useEffect(() => {
    const handle = () => {
      navigator.clipboard.read().then((items) => {
        for (const item of items) {
          item.getType('image/png').then(async (value) => {
            const v = await convertWebp(value);
            onChange?.(v);
            reader?.readAsDataURL(v);
          });
        }
      });
    };
    addEventListener('paste', handle);
    return () => removeEventListener('paste', handle);
  }, [onChange, reader]);
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
            reader?.readAsDataURL(blob);
          });
        }
        e.preventDefault();
      }}
    >
      {imageData ? (
        <>
          <span className={styled.clear} onClick={() => {
            setImageData(undefined)
            onChange?.(null)
          }}>
            ✖
          </span>
          <img src={imageData} />
        </>
      ) : (
        <>
          <input
            ref={ref}
            type="file"
            accept=".jpg, .png, .gif"
            onChange={(e) => {
              if (e.currentTarget.files?.[0]) {
                onChange?.(e.currentTarget.files[0]);
                reader?.readAsDataURL(e.currentTarget.files[0]);
              }
            }}
          />
          {children}
        </>
      )}
    </div>
  );
};
