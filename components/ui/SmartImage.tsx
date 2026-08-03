'use client';

import { useEffect, useState } from 'react';

/**
 * A resilient image element for a user-managed catalog. Renders a native
 * <img> (so admin-uploaded / arbitrary image hosts work without per-domain
 * Next.js config) and falls back to a branded placeholder on error.
 * Supports the `fill` layout used across the storefront.
 */
interface SmartImageProps {
  src?: string | null;
  alt?: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean; // accepted for next/image call-site compatibility; ignored
  onLoad?: () => void;
  onError?: () => void;
}

const FALLBACK = 'https://placehold.co/600x600/1E3A6E/FFFFFF?text=Chaudhry';

export default function SmartImage({
  src,
  alt = '',
  fill,
  className,
  sizes,
  width,
  height,
  onLoad,
  onError,
}: SmartImageProps) {
  const [errored, setErrored] = useState(false);

  // Reset the error state whenever the source changes.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const finalSrc = !src || errored ? FALLBACK : src;

  const style: React.CSSProperties | undefined = fill
    ? { position: 'absolute', inset: 0, height: '100%', width: '100%' }
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={finalSrc}
      alt={alt}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      style={style}
      className={className}
      loading="lazy"
      onLoad={onLoad}
      onError={() => {
        if (!errored) {
          setErrored(true);
          onError?.();
        }
      }}
    />
  );
}
