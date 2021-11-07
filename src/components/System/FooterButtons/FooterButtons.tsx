import React, { FC } from 'react';
import { Login } from '../Buttons/Login/Login';
import { NewContents } from '../Buttons/NewContents';
import styled from './FooterButtons.module.scss';

interface Props {}

/**
 * FooterButtons
 *
 * @param {Props} { }
 */
export const FooterButtons: FC<Props> = ({}) => {
  return (
    <div className={styled.root}>
      <Login />
      <NewContents />
    </div>
  );
};
