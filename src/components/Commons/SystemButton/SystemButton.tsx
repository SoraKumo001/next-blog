import { useRouter } from 'next/router';
import React, { FC, ReactNode, useCallback } from 'react';
import styled from './SystemButton.module.scss';

interface Props {
  icon: ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  href?: string;
}

/**
 * SystemButton
 *
 * @param {Props} { }
 */
export const SystemButton: FC<Props> = ({ icon, onClick, href, children }) => {
  const router = useRouter();
  const handleClick = useCallback(() => href && router.push(href), [href, router]);
  return (
    <div className={styled.root} onClick={onClick || handleClick}>
      <div>{icon}</div>
      <div className={styled.label}>{children}</div>
    </div>
  );
};
