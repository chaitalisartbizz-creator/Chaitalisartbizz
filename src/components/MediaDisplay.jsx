import React, { useState } from 'react';

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
    return (
      <video
        src={src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        {...props}
      />
    );
  }

  const responsiveProps = getUnsplashProps(src);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setHasError(true)}
      {...responsiveProps}
      {...props}
    />
  );
}
