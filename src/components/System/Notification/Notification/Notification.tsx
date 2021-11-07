import React, { AnimationEventHandler, FC } from 'react';
import styled from './Notification.module.scss';
import IconInfo from '@mui/icons-material/InfoOutlined';
interface Props {
  fade?: boolean;
  onClose?: () => void;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
}

/**
 * Notification
 *
 * @param {Props} { }
 */
export const Notification: FC<Props> = ({ onAnimationEnd, children }) => {
  return (
    <div className={styled.root} onAnimationEnd={onAnimationEnd}>
      <div className={styled.message}>
        <IconInfo />
        {children}
      </div>
    </div>
  );
};
