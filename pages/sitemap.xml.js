function SiteMap() {
    // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {

    res.setHeader('Content-Type', 'text/xml');
    res.write(`<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>https://insidertradealert.com/sitemap1.xml</loc>
        </sitemap>
        <sitemap>
            <loc>https://insidertradealert.com/sitemap2.xml</loc>
        </sitemap>
        <sitemap>
            <loc>https://insidertradealert.com/sitemap3.xml</loc>
        </sitemap>
        <sitemap>
            <loc>https://insidertradealert.com/sitemap4.xml</loc>
        </sitemap>
    </sitemapindex>`);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;
