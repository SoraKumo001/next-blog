import React, { FC } from 'react';
import IconEdit from '@mui/icons-material/EditOutlined';
import { SystemButton } from '@/components/Commons/SystemButton';
import { Content } from '@/types/Content';
import { authProvider, firebaseAuth, firestore, newClass, saveDoc, useAuth } from '@/libs/firebase';
import { useRouter } from 'next/router';
import { useAdmin } from '@/hooks/useLogin';
interface Props { }

/**
 * NewContents
 *
 * @param {Props} { }
 */
export const NewContents: FC<Props> = ({ }) => {
  const isAdmin = useAdmin();
  const router = useRouter();
  const handleClick = () => {
    const contents = newClass(Content, { title: 'new', visible: false, keywords: [] });
    saveDoc(firestore, contents).then((id) => {
      router.push(`/contents/${id}`);
    });
  };
  if (!isAdmin) return null;
  return (
    <SystemButton icon={<IconEdit />} onClick={handleClick}>
      New
    </SystemButton>
  );
};