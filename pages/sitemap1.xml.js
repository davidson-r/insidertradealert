const DOMAIN_URL = 'https://insidertradealert.com';
const slugify = require('../utils/functions');
import pool from '../db';

function generateSiteMap(items) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://insidertradealert.com</loc>
       <changefreq>daily</changefreq>
        <priority>1</priority>

     </url>

     ${items
       .map(item => {
         return `
       <url>
           <loc>${`${DOMAIN_URL}/${item.entity_type}/${slugify(item.entity_name)}-${item.cik}`}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.5</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {

  var sitemap_query = await pool.query(`
    select distinct on(cik)* from (
        select distinct report_owner_cik cik, report_owner_name entity_name,'reporter' entity_type
            from submissions where report_owner_name is not null
        )t
        union select distinct on(cik)* from (
            select distinct issuer_cik cik, issuer_name entity_name,'issuer'entity_type
            from submissions where issuer_name is not null
        )t
        order by 1,2
        offset 0
        limit 50000
        ;`)
  const sitemap = generateSiteMap(sitemap_query.rows);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
