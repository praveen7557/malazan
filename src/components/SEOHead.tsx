import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'The Phoenix Inn - Fun Malazan Games | Book of the Fallen Interactive Experience',
  description = "Discover which Malazan character matches your personality with our interactive quiz. Draw your fate from the mystical Deck of Dragons. Explore the world of Steven Erikson's Book of the Fallen series through immersive games and quizzes.",
  keywords = 'Malazan, Book of the Fallen, Steven Erikson, character quiz, Deck of Dragons, fantasy games, interactive fiction, Bridgeburners, Darujhistan, Phoenix Inn',
  image = 'https://malazan.netlify.app/og-image.jpg',
  url = 'https://malazan.netlify.app/',
  type = 'website'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />

      {/* Open Graph */}
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={image} />
      <meta property='og:url' content={url} />
      <meta property='og:type' content={type} />

      {/* Twitter */}
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Canonical URL */}
      <link rel='canonical' href={url} />
    </Helmet>
  );
};

export default SEOHead;
