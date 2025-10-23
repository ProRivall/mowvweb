import { useEffect, useRef, useState } from 'react';
import { colors } from '../constants/colors';
import { MORPH_WORDS } from '../constants/morphWords';
import { galleryItems } from '../data/galleryItems';
import { streetStories } from '../data/streetStories';
import LoadingScreen from './common/LoadingScreen';
import MotionToggle from './common/MotionToggle';
import ProgressBar from './common/ProgressBar';
import Footer from './layout/Footer';
import useSectionParallax from '../hooks/useSectionParallax';
import Header from './layout/Header';
import OurStory from './sections/OurStory';
import GallerySection from './sections/GallerySection';
import HeroSection from './sections/HeroSection';
import JoinSection from './sections/JoinSection';
import StoriesSection from './sections/StoriesSection';

export default function MowvExperience() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [heroVisible, setHeroVisible] = useState({});
  const [currentStory, setCurrentStory] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [galleryTitleGlitch, setGalleryTitleGlitch] = useState(false);
  const [currentMorphIndex, setCurrentMorphIndex] = useState(0);

  const galleryRef = useRef(null);
  const autoplayRef = useRef(null);
  const resumeTimeoutRef = useRef(null);
  const loadingTimeoutRef = useRef(null);

  useSectionParallax({ enabled: motionEnabled && !isMobile });

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 400);
      }
      setLoadingProgress(progress);
    }, 150);

    return () => {
      clearInterval(interval);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sh = document.documentElement.scrollHeight - window.innerHeight;
          const progressValue = sh > 0 ? (window.scrollY / sh) * 100 : 0;
          setScrollProgress(progressValue);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const titleTimeout = setTimeout(() => setHeroVisible({ title: true }), 200);
      const subtitleTimeout = setTimeout(
        () => setHeroVisible((prev) => ({ ...prev, subtitle: true })),
        500,
      );
      const manifestTimeout = setTimeout(
        () => setHeroVisible((prev) => ({ ...prev, manifest: true })),
        800,
      );

      return () => {
        clearTimeout(titleTimeout);
        clearTimeout(subtitleTimeout);
        clearTimeout(manifestTimeout);
      };
    }

    return undefined;
  }, [isLoading]);

  useEffect(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    if (isAutoPlaying && motionEnabled) {
      autoplayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
      }, 4000);
    }

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isAutoPlaying, motionEnabled]);

  useEffect(() => {
    if (!motionEnabled) {
      return () => {};
    }

    const storyInterval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % streetStories.length);
    }, 6000);

    return () => clearInterval(storyInterval);
  }, [motionEnabled]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setGalleryTitleGlitch(true);
    setCurrentMorphIndex(currentSlide % MORPH_WORDS.length);
    const timeout = setTimeout(() => setGalleryTitleGlitch(false), 1200);
    return () => clearTimeout(timeout);
  }, [currentSlide]);

  useEffect(
    () => () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    },
    [],
  );

  const scheduleAutoPlayResume = (delay = 5000) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), delay);
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % galleryItems.length);
    scheduleAutoPlayResume();
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    scheduleAutoPlayResume();
  };

  const handleSelectSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    scheduleAutoPlayResume();
  };

  const handleMouseEnterGallery = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    setIsAutoPlaying(false);
  };

  const handleMouseLeaveGallery = () => {
    if (motionEnabled) {
      setIsAutoPlaying(true);
    }
  };

  const handleStoryChange = (index) => {
    setCurrentStory(index);
  };

  const handleToggleMotion = () => {
    setMotionEnabled((prev) => !prev);
  };

  if (isLoading) {
    return <LoadingScreen colors={colors} loadingProgress={loadingProgress} />;
  }

  const headerOffset = isMobile ? 96 : 136;

  return (
    <div
      style={{
        background: colors.bg,
        color: colors.text,
        fontFamily: "'Work Sans', sans-serif",
        overflowX: 'hidden',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <ProgressBar progress={scrollProgress} colors={colors} />
      <Header colors={colors} isMobile={isMobile} />
      <main
        style={{
          paddingTop: `${headerOffset}px`,
          '--header-offset': `${headerOffset}px`,
        }}
      >
        <HeroSection
          colors={colors}
          heroVisible={heroVisible}
          mousePosition={mousePosition}
          headerOffset={headerOffset}
        />
        <OurStory colors={colors} isMobile={isMobile} motionEnabled={motionEnabled} />
        <StoriesSection
          colors={colors}
          stories={streetStories}
          currentStory={currentStory}
          onStoryChange={handleStoryChange}
          motionEnabled={motionEnabled}
        />
        <GallerySection
          colors={colors}
          galleryItems={galleryItems}
          currentSlide={currentSlide}
          onSelectSlide={handleSelectSlide}
          onPrev={prevSlide}
          onNext={nextSlide}
          isMobile={isMobile}
          morphWords={MORPH_WORDS}
          currentMorphIndex={currentMorphIndex}
          isTitleGlitch={galleryTitleGlitch}
          galleryRef={galleryRef}
          onHoverStart={handleMouseEnterGallery}
          onHoverEnd={handleMouseLeaveGallery}
          motionEnabled={motionEnabled}
        />
        <JoinSection colors={colors} />
      </main>
      <Footer colors={colors} motionEnabled={motionEnabled} />
      <MotionToggle motionEnabled={motionEnabled} onToggle={handleToggleMotion} colors={colors} />
    </div>
  );
}
