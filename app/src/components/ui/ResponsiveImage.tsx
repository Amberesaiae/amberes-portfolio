interface ResponsiveImageProps {
  src: string; // Path without extension, e.g., "/images/optimized/project-scoutbridge-1"
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
}: ResponsiveImageProps) {
  // Remove extension if provided
  const basePath = src.replace(/\.(png|jpg|jpeg|webp|avif)$/i, '');
  
  return (
    <picture>
      {/* AVIF - Best compression, modern browsers */}
      <source
        type="image/avif"
        srcSet={`${basePath}.avif`}
        sizes={sizes}
      />
      
      {/* WebP - Good compression, wide support */}
      <source
        type="image/webp"
        srcSet={`${basePath}.webp`}
        sizes={sizes}
      />
      
      {/* Fallback - Original format */}
      <img
        src={`${basePath}.png`}
        alt={alt}
        loading={loading}
        className={className}
      />
    </picture>
  );
}
