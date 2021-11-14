import React, { FC } from 'react';
import IconEdit from '@mui/icons-material/EditOutlined';
import { SystemButton } from '@/components/Commons/SystemButton';
import { Content } from '@/types/Content';
import { firestore, newClass, saveDoc } from '@/libs/firebase';
import { useRouter } from 'next/router';
import { useAdmin } from '@/hooks/useAdmin';
interface Props {}

/**
 * NewContents
 *
 * @param {Props} { }
 */
export const NewContents: FC<Props> = ({}) => {
  const isAdmin = useAdmin();
  const router = useRouter();
  const handleClick = () => {
    const contents = newClass(Content, { title: 'new', visible: false, keywords: [] });
    saveDoc(firestore, contents).then((id) => {
      router.push(`/contents/${id}/edit`);
    });
  };
  if (!isAdmin) return null;
  return (
    <SystemButton icon={<IconEdit />} onClick={handleClick}>
      New
    </SystemButton>
  );
};
