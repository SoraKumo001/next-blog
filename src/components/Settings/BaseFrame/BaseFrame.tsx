import React, { FC } from 'react';
import styled from './BaseFrame.module.scss';
import IconBack from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useRouter } from 'next/router';
interface Props {
  title: string;
  children?: React.ReactNode;
}

/**
 * BaseFrame
 *
 * @param {Props} { }
 */
export const BaseFrame: FC<Props> = ({ title, children }) => {
  const router = useRouter();
  return (
    <div className={styled.root}>
      <div className={styled.frame}>
        <div className={styled.title}>
          <Link href={router.asPath + '/..'} passHref={true}>
            <a>
              <IconBack />
            </a>
          </Link>
          {title}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
