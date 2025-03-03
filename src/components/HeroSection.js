import React, { useEffect, useState } from 'react';
import { getHeroSectionData } from '../api';
import { STRAPI_URL } from '../config';

const HeroSection = () => {
  const [heroData, setHeroData] = useState([]);

  useEffect(() => {
    const fetchHeroData = async () => {
      const data = await getHeroSectionData();
      setHeroData(data);
    };
    fetchHeroData();
  }, []);

  if (!heroData.length) return <p>Carregando...</p>;

  return (
    <section className="hero-section">
      <div className="main-image-container">
        {heroData.length > 0 && (
          <a href={heroData[0].attributes.url} className="hero-link">
            <img 
              src={`${STRAPI_URL}${heroData[0].attributes.imagem.data[0].attributes.url}`} 
              alt="Main Hero"
              className="main-hero-image"
            />
          </a>
        )}
      </div>
      <div className="small-images-container">
        {heroData.slice(1).map((item) => (
          <a href={item.attributes.url} className="hero-link" key={item.id}>
            <img 
              src={`${STRAPI_URL}${item.attributes.imagem.data[0].attributes.url}`} 
              alt={`Hero ${item.id}`}
              className="small-hero-image"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
