import { ImgHTMLAttributes } from "react";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
}

/**
 * Lazy-loaded image component with native browser lazy loading
 * Loads image only when it comes into view
 */
export const LazyImage = ({
  src,
  alt,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E",
  className = "",
  ...props
}: LazyImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`transition-opacity duration-300 ${className}`}
      {...props}
    />
  );
};

export default LazyImage;
