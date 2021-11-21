import { firestore, getFireDocs } from '@/libs/firebase';
import { Content } from '@/types/Content';
import { IncomingMessage } from 'http';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
    const xml = await generateSitemapXml(req);
    res.statusCode = 200;
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.setHeader('Content-Type', 'text/xml');
    res.write(xml)
    res.end();

    return {
        props: {},
    };
};

const Page = () => null;
export default Page;

const generateSitemapXml = async (req: IncomingMessage) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    const values = await getFireDocs(firestore, Content, {
        order: ['updatedAt'],
        where: ['visible', '==', true]
    });
    values.forEach((v) => {
        xml += `
      <url>
        <loc>https://${req.headers.host}/contents/${v.id}</loc>
        <lastmod>${v.updatedAt?.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
      </url>
    `
    })

    xml += `</urlset>`;
    return xml;
}