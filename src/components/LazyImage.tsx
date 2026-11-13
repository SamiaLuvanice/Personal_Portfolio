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
  // Mantido na API por compatibilidade; o carregamento nativo dispensa placeholder.
  placeholder: _placeholder,
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
