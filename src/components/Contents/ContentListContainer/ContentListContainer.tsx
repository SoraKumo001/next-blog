import Link from 'next/link';
import React, { FC } from 'react';
import styled from './ContentListContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDocs } from '@/libs/firebase';
import { Content } from '@/types/Content';
import { Button } from '@mui/material';
import { useAdmin } from '@/hooks/useAdmin';
import { classNames } from '@/libs/classNames';
interface Props { }

/**
 * ContentListContainer
 *
 * @param {Props} { }
 */
export const ContentListContainer: FC<Props> = ({ }) => {
  const isAdmin = useAdmin();
  const { state, contents } = useFireDocs(firestore, Content, {
    order: ['updatedAt'],
    where: isAdmin ? undefined : ['visible', '==', true],
  });
  useLoading([state]);
  console.log({ state })
  return (
    <div className={styled.root}>
      <div>
        {contents?.map((c) => (
          <Link key={c.id} passHref href={`/contents/${c.id}`}>
            <div className={classNames(styled.content, c.visible === false && styled.hidden)}>
              <div className={styled.image}>
                <div>🤖</div>
              </div>
              <div>
                <div className={styled.title}>{c.title}</div>
                <div>{c.updatedAt?.toLocaleString()}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
