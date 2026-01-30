import { useState } from 'react';
import './index.css';

const LazyImage = ({ src, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`image-wrapper ${className || ''}`}>

      {!isLoaded && <div className="skeleton" />}
      
      <img
        src={src}
        alt={alt}
        loading="lazy" 
        className={`styled-image ${isLoaded ? 'loaded' : ''}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default LazyImage;