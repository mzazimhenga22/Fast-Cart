import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './BannerSlider.css';

interface Slide {
  id: string;
  subTitle: string;
  title: string;
  description: string;
  button1Text: string;
  button1Link: string;
  button2Text: string;
  button2Link: string;
  image: string;
  neonColor: string;
}

const BannerSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  // For swipe detection
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const slideDuration = 30000; // 30 seconds

  // Fetch slides from the "products" collection
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, 'products'));
        const fetchedSlides: Slide[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            subTitle: data.category || "New Arrival",
            title: data.title || "Product Title",
            description: data.description || "",
            button1Text: "Shop Now",
            button1Link: "#",
            button2Text: "Learn More",
            button2Link: "#",
            image: data.image || "https://via.placeholder.com/300x200?text=No+Image",
            neonColor: "#ff6f61",
          };
        });
        setSlides(fetchedSlides);
      } catch (error) {
        console.error('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Function to change slide with proper wrap-around
  const goToSlide = (index: number) => {
    if (slides.length > 0) {
      setCurrentSlide((index + slides.length) % slides.length);
    }
  };

  // Start auto slide
  const startAutoSlide = () => {
    stopAutoSlide(); // Clear any existing interval
    autoSlideRef.current = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideDuration);
  };

  // Stop auto slide
  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  };

  // Restart auto slide whenever slides or currentSlide changes
  useEffect(() => {
    if (slides.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides, currentSlide]);

  // Keyboard navigation for left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToSlide(currentSlide + 1);
      } else if (e.key === 'ArrowLeft') {
        goToSlide(currentSlide - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides]);

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const threshold = 50; // Minimum swipe distance in px
      if (distance > threshold) {
        // Swiped left
        goToSlide(currentSlide + 1);
      } else if (distance < -threshold) {
        // Swiped right
        goToSlide(currentSlide - 1);
      }
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (loading) return <div>Loading...</div>;
  if (!loading && slides.length === 0) return <div>No slides available</div>;

  // Use neonColor of current slide with fallback
  const neonColor = slides.length > 0 ? slides[currentSlide].neonColor : '#ff6f61';

  return (
    <div
      className="sliderContainer"
      onMouseEnter={stopAutoSlide}
      onMouseLeave={startAutoSlide}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="slide"
          style={{
            opacity: index === currentSlide ? 1 : 0,
            pointerEvents: index === currentSlide ? 'auto' : 'none',
          }}
        >
          <div className="textContainer">
            <p className="subTitle">{slide.subTitle}</p>
            <h1 className="title">{slide.title}</h1>
            <h2 className="description">{slide.description}</h2>
            <div className="buttonsWrapper">
              <a href={slide.button1Link} className="primaryButton">
                {slide.button1Text}
              </a>
              <a href={slide.button2Link} className="secondaryButton">
                {slide.button2Text}
              </a>
            </div>
          </div>
          <div className="imageWrapper">
            <img src={slide.image} alt={slide.title} className="slideImage" />
          </div>
        </div>
      ))}

      {/* Neon lights using the fallback neonColor */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: neonColor,
          boxShadow: `0 0 10px 4px ${neonColor}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: neonColor,
          boxShadow: `0 0 10px 4px ${neonColor}`,
        }}
      />

      {/* Arrow Navigation */}
      <button className="arrow leftArrow" onClick={() => goToSlide(currentSlide - 1)}>
        &#10094;
      </button>
      <button className="arrow rightArrow" onClick={() => goToSlide(currentSlide + 1)}>
        &#10095;
      </button>

      {/* Progress Bar Indicator */}
      <div className="progressBar">
        <div
          className="progress"
          key={currentSlide} 
          style={{ animation: `progress ${slideDuration}ms linear` }}
        />
      </div>

      {/* Dot Indicators */}
      <div className="dotContainer">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className="dot"
            style={{
              backgroundColor: index === currentSlide ? '#333' : '#bbb',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
