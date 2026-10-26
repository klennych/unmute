import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UNMUTE DUO | Speak Confidently & Be Heard',
    short_name: 'UNMUTE DUO',
    description: 'Two Voices. One Purpose.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F3EB',
    theme_color: '#171D36',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
