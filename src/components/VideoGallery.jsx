import React, { useState, useRef } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoCard({ videoUrl, posterUrl, title = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!isLoaded) {
        videoRef.current.src = videoUrl;
        setIsLoaded(true);
      }
      videoRef.current.play();
      setIsPlaying(true);
      setIsBuffering(true);
    }
  };

  return (
    <div className="relative w-full aspect-[9/16] md:aspect-video rounded-xl overflow-hidden bg-[#111] border border-white/5">
      <AnimatePresence>
        {(!isPlaying || isBuffering) && !isLoaded && (
          <motion.img 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={posterUrl} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </AnimatePresence>

      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => { setIsPlaying(true); setIsBuffering(false); }}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />

      <div 
        className="absolute inset-0 flex items-center justify-center transition-colors duration-300"
        style={{ backgroundColor: isPlaying ? 'transparent' : 'rgba(10, 10, 10, 0.4)' }}
        onClick={handlePlayClick}
      >
        <AnimatePresence mode="wait">
          {!isPlaying && !isBuffering && (
            <motion.button
              key="play"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0F0F13]/80 backdrop-blur-md border border-white/10 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform duration-200 active:scale-95"
              aria-label="Play Video"
            >
              <Play size={24} className="ml-1" fill="currentColor" />
            </motion.button>
          )}

          {isBuffering && (
            <motion.div
              key="buffering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center w-16 h-16 rounded-full bg-[#0F0F13]/80 backdrop-blur-md border border-white/10 text-white"
            >
              <Loader2 size={24} className="animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
          <p className="text-white text-sm font-semibold truncate">{title}</p>
        </div>
      )}
    </div>
  );
}

export default function VideoGallery({ videos = [] }) {
  if (!videos || videos.length === 0) return null;
  return (
    <section className="w-full max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((vid, idx) => (
          <VideoCard key={idx} videoUrl={vid.url} posterUrl={vid.poster} title={vid.title} />
        ))}
      </div>
    </section>
  );
}
