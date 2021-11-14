import { useSystemDispatch } from '@/hooks/useSystemDispatch';
import { useSystemSelector } from '@/hooks/useSystemSelector';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styled from './NotificationContainer.module.scss';
import { Notification } from '../Notification';
const fadeTime = 5000;
const fadeNextTime = 100;
interface Props {}

/**
 * NotificationContainer
 *
 * @param {Props} { }
 */
export const NotificationContainer: FC<Props> = ({}) => {
  const notifications = useSystemSelector((state) => state.notification);
  const timer = useRef<number>();
  const dispatch = useSystemDispatch();
  useEffect(() => {
    if (notifications?.length === 0) return;
    timer.current = Date.now();
    let handle: ReturnType<typeof setInterval> | undefined = setInterval(() => {
      const elapse = Date.now() - timer.current!;
      if (
        (notifications && notifications.length > 1 && elapse >= fadeNextTime) ||
        elapse >= fadeTime
      ) {
        onAnimationEnd();
      }
      if (!notifications?.length) {
        handle && clearInterval(handle);
        handle = undefined;
      }
    }, 10);
    return () => handle && clearInterval(handle);
  }, [notifications]);
  const onAnimationEnd = useCallback(() => {
    dispatch({ type: 'removeNotification' });
    timer.current = Date.now();
  }, [dispatch]);
  if (!notifications || !notifications.length) return null;
  return (
    <div className={styled.root}>
      <Notification
        key={String(notifications[0])}
        onAnimationEnd={onAnimationEnd}
        onClose={onAnimationEnd}
      >
        {notifications[0]}
      </Notification>
    </div>
  );
};
