import React from 'react';
import { useRouter } from 'next/router';
import { ContentEditContainer } from '@/components/Contents/ContentEditContainer';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (!id || typeof id !== 'string') return null;
  return (
    <div>
      <ContentEditContainer id={id} />
    </div>
  );
};

export default Page;
