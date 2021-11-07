import React from 'react';
import { useRouter } from 'next/router';
import { ContentContainer } from '@/components/Contents/ContentContainer';

const Page = () => {
  const router = useRouter();
  const id = router.query['id'];
  if (!id || typeof id !== 'string') return null;
  return (
    <div>
      <ContentContainer id={id} />
    </div>
  );
};

export default Page;
