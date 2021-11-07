import { useSystemSelector } from '@/hooks/useSystemSelector';
import React, { FC } from 'react';
import styled from './LoadingContainer.module.scss';
import IconRefresh from '@mui/icons-material/Refresh';

interface Props {}

/**
 * LoadingContainer
 *
 * @param {Props} { }
 */
export const LoadingContainer: FC<Props> = ({}) => {
  const loading = useSystemSelector((v) => v.loading);

  return loading ? (
    <div className={styled.root}>
      <IconRefresh />
    </div>
  ) : null;
};
