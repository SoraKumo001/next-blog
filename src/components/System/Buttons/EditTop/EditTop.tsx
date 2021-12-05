import { SystemButton } from '@/components/Commons/SystemButton';
import { useAdmin } from '@/hooks/useAdmin';
import { firestore, getFireDoc, newClass, saveFireDoc } from '@/libs/firebase';
import { Content } from '@/types/Content';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import IconEdit from '@mui/icons-material/EditAttributes';

interface Props {}

/**
 * EditTop
 *
 * @param {Props} { }
 */
export const EditTop: FC<Props> = ({}) => {
  const isAdmin = useAdmin();
  const router = useRouter();
  const handleClick = async () => {
    const v = await getFireDoc(firestore, Content, '@top');
    if (!v) {
      const contents = newClass(Content, {
        id: '@top',
        title: '@top',
        visible: false,
        system: true,
        keywords: [],
      });
      saveFireDoc(firestore, contents).then((id) => {
        router.push(`/contents/${id}/edit`);
      });
    } else {
      router.push(`/contents/@top/edit`);
    }
  };
  if (!isAdmin) return null;
  return (
    <SystemButton icon={<IconEdit />} onClick={handleClick}>
      EditTop
    </SystemButton>
  );
};
