import React, { useState } from 'react';
import { VideoCard } from './VideoGallery';

/**
 * Universal media component to render an image or a video 
 * based on the file extension or the URL contents.
 * Shows a graceful art-themed placeholder when image is missing or broken.
 */
function getUnsplashProps(src) {
  if (!src || !src.includes('images.unsplash.com')) return {};

  try {
    const [baseUrl, query] = src.split('?');
    const params = new URLSearchParams(query || '');

    // auto format (webp/avif) and moderate quality
    params.set('auto', 'format');
    params.set('q', '70');

    // Generate responsive widths
    const widths = [320, 480, 640, 800, 1024, 1200, 1600];
    const srcSet = widths
      .map(w => {
        params.set('w', w.toString());
        return `${baseUrl}?${params.toString()} ${w}w`;
      })
      .join(', ');

    return {
      srcSet,
      sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
    };
  } catch (e) {
    console.error("Error building responsive Unsplash srcSet:", e);
    return {};
  }
}

function getCloudinaryProps(src) {
  if (!src || !src.includes('res.cloudinary.com')) return {};

  try {
    // A standard Cloudinary URL format: 
    // https://res.cloudinary.com/<cloud_name>/image/upload/v1234567/sample.jpg
    // We want to insert 'q_auto,f_auto' into the URL transformations, e.g.:
    // https://res.cloudinary.com/<cloud_name>/image/upload/q_auto,f_auto/v1234567/sample.jpg
    
    // If it already has q_auto or f_auto, skip to avoid double injecting
    if (src.includes('q_auto') || src.includes('f_auto')) {
      return { src };
    }

    const uploadSplit = src.split('/upload/');
    if (uploadSplit.length === 2) {
      const optimizedSrc = `${uploadSplit[0]}/upload/w_600,c_scale,q_auto,f_auto/${uploadSplit[1]}`;
      
      // We can also create basic responsive sizes if we wanted, but w_600,q_auto,f_auto alone gives 60-70% savings
      return { src: optimizedSrc };
    }
  } catch (e) {
    console.error("Error building Cloudinary optimized URL:", e);
  }
  return {};
}

function ArtPlaceholder({ className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F2EDE4] to-[#E8D8C0] ${className}`}
      aria-label="Image not available"
    >
      <span style={{ fontSize: '2rem', lineHeight: 1 }}>🎨</span>
      <span style={{ fontSize: '10px', color: '#A8873A', fontWeight: 700, marginTop: 4, letterSpacing: '0.05em' }}>
        No Image
      </span>
    </div>
  );
}

export default function MediaDisplay({ src, alt = "Media", className = "", loading = "lazy", ...props }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <ArtPlaceholder className={className} />;
  }
  
  // Check if it's a video based on common extensions or Cloudinary video indicators
  const isVideo = src.match(/\.(mp4|webm|ogg|mov)$/i) || src.includes('/video/upload/');

  if (isVideo) {
    let posterUrl = '';
    if (src.includes('res.cloudinary.com') && src.includes('/video/upload/')) {
      const uploadSplit = src.split('/upload/');
      if (uploadSplit.length === 2) {
        posterUrl = `${uploadSplit[0]}/video/upload/w_600,c_scale,q_auto,f_auto/${uploadSplit[1]}`;
      } else {
        posterUrl = src;
      }
      posterUrl = posterUrl.replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg');
      if (!posterUrl.includes('.jpg')) posterUrl += '.jpg';
    }
    
    return (
      <div className={className}>
        <VideoCard 
          videoUrl={src} 
          posterUrl={posterUrl} 
          title={alt}
        />
      </div>
    );
  }

  const unsplashProps = getUnsplashProps(src);
  const cloudinaryProps = getCloudinaryProps(src);

  return (
    <img
      src={cloudinaryProps.src || src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
      {...unsplashProps}
      {...props}
    />
  );
}
