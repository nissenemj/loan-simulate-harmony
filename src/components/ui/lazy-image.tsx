import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  wrapperClassName?: string;
  loadingClassName?: string;
  loadedClassName?: string;
  threshold?: number;
  rootMargin?: string;
}

/**
 * LazyImage component that loads images only when they enter the viewport
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc,
  wrapperClassName,
  loadingClassName,
  loadedClassName,
  threshold = 0.1,
  rootMargin = "0px",
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Set up intersection observer to detect when image enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);
  
  // Handle image load event
  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  
  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {/* Placeholder or blurred image */}
      {!isLoaded && placeholderSrc && (
        <img
          src={placeholderSrc}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100",
            loadingClassName
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      <img
        ref={imgRef}
        src={isInView ? src : "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="}
        alt={alt}
        onLoad={handleImageLoad}
        className={cn(
          "transition-opacity duration-500",
          !isLoaded ? "opacity-0" : "opacity-100",
          className,
          isLoaded && loadedClassName
        )}
        {...props}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !placeholderSrc && (
        <div 
          className={cn(
            "absolute inset-0 bg-muted/30 animate-pulse",
            loadingClassName
          )}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyImage;
