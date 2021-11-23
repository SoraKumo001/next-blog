import React, { FC } from 'react';
import { EditTop } from '../Buttons/EditTop';
import { Login } from '../Buttons/Login/Login';
import { NewContents } from '../Buttons/NewContents';
import { Settings } from '../Buttons/Settings';
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
      <Settings />
      <NewContents />
      <EditTop />
    </div>
  );
};
