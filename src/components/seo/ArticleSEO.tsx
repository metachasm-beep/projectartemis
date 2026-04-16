import React from 'react';
import { SEOProvider } from '../SEOProvider';
import type { Post } from '@/blogs/data/posts';

interface ArticleSEOProps {
  post: Partial<Post>;
  author?: {
    name: string;
    city: string;
  };
}

/**
 * 🖋️ ARTICLE SEO:
 * Injects structured data and metadata specifically for Journal entries.
 */
export const ArticleSEO: React.FC<ArticleSEOProps> = ({ post, author }) => {
  const keywords = "elite dating, selection protocol, dating in delhi, dating in mumbai, dating in bangalore, delhi dating, mumbai dating, matriarch journal";
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.date,
    "author": [{
      "@type": "Person",
      "name": author?.name || "Matriarch Editorial",
      "jobTitle": "Aspirant"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Matriarch India",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.matriarchindia.com/logo.png"
      }
    },
    "description": post.excerpt || post.title
  };

  return (
    <SEOProvider 
      title={`${post.title} | Matriarch Journal`}
      description={post.excerpt || `Read the latest entry in the Matriarch Selection Protocol: ${post.title}`}
      ogType="article"
      ogImage={post.image}
      schema={articleSchema}
    />
  );
};
