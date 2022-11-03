import Link from 'next/link';
import React, { FC } from 'react';
import styled from './ContentListContainer.module.scss';
import { useLoading } from '@/hooks/useLoading';
import { firestore, useFireDocs } from '@/libs/firebase';
import { Content } from '@/types/Content';
import { useAdmin } from '@/hooks/useAdmin';
import { Title } from '@/components/Commons/Title';
import { classNames } from '@/libs/classNames';
import { ContentTopContainer } from '../ContentTopContainer';
import { where } from '@firebase/firestore';
interface Props {}

/**
 * ContentListContainer
 *
 * @param {Props} { }
 */
export const ContentListContainer: FC<Props> = ({}) => {
  const isAdmin = useAdmin();
  const whereSystem = ['system', '==', false] as Parameters<typeof where>;
  const { state, contents } = useFireDocs(firestore, Content, {
    order: [['updatedAt', 'desc']],
    where: isAdmin ? whereSystem : [whereSystem, ['visible', '==', true]],
  });
  useLoading([state]);
  return (
    <div className={styled.root}>
      <Title>記事一覧</Title>
      <div className={styled.main}>
        <ContentTopContainer />
        <div className={styled.title}>記事一覧</div>
        <div className={styled.list}>
          {contents?.map((c) => (
            <Link
              key={c.id}
              passHref
              href={`/contents/${c.id}`}
              className={classNames(styled.item, c.visible === false && styled.hidden)}
            >
              <div className={styled.image}>
                <div>📖</div>
              </div>
              <div>
                <div className={styled.title}>{c.title}</div>
                <div>
                  {c.updatedAt?.toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </Link>
          ))}
          {contents && contents.length % 2 ? (
            <div className={styled.item} style={{ visibility: 'hidden' }} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
