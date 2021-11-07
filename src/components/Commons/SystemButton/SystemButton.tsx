import React, { FC, ReactNode } from 'react';
import styled from './SystemButton.module.scss';

interface Props {
  icon: ReactNode;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * SystemButton
 *
 * @param {Props} { }
 */
export const SystemButton: FC<Props> = ({ icon, onClick, children }) => {
  return (
    <div className={styled.root} onClick={onClick}>
      <div>{icon}</div>
      <div className={styled.label}>{children}</div>
    </div>
  );
};
