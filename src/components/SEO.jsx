import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'Arundhati Handlooms - Premium Handloom Sarees & Traditional Wear',
    description = 'Discover exquisite handloom sarees and traditional wear at Arundhati Handlooms. Authentic craftsmanship, premium fabrics, and timeless designs for every occasion.',
    keywords = 'handloom sarees, traditional sarees, Indian sarees, handwoven sarees, silk sarees, cotton sarees, ethnic wear, Arundhati Handlooms',
    ogImage = '/logo.png',
    schema = null
}) => {
    const siteUrl = 'https://arundhati-handlooms.onrender.com'; // Update with your actual domain

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={siteUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Schema.org markup */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
