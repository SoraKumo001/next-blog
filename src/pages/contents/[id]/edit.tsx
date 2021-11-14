import React from 'react';
import { useRouter } from 'next/router';
import { ContentEditContainer } from '@/components/ContentEdit/ContentEditContainer';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (!id || typeof id !== 'string') return null;
  return <ContentEditContainer id={id} />;
};

export default Page;
