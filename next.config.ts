import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'fastly.picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      // Pakistani supplier image CDNs
      { protocol: 'https', hostname: 'mastersanitaryware.com', pathname: '/**' },
      { protocol: 'https', hostname: 'sbestore.com', pathname: '/**' },
      { protocol: 'https', hostname: 'dktraders.com.pk', pathname: '/**' },
      { protocol: 'https', hostname: 'powerhouseexpress.com.pk', pathname: '/**' },
      { protocol: 'https', hostname: 'img.drz.lazcdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'aysonline.pk', pathname: '/**' },
      { protocol: 'https', hostname: 'miangroup.com.pk', pathname: '/**' },
    ],
  },
};

export default nextConfig;
