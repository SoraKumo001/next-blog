import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  res.statusCode = 200;
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.setHeader('Content-Type', 'text/plain');
  res.write(
    `User-Agent: *
Sitemap: https://${req.headers.host}/sitemap.xml`
  );
  res.end();

  return {
    props: {},
  };
};

const Page = () => null;
export default Page;
