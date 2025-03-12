import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 允许访问外部资源域名
  images: {
    domains: ['source.hhhstudy.online'],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: 'https://source.hhhstudy.online/:path*',
  //     },
  //   ];
  // },
  experimental: {
    turbo: {
      rules: {
        '*.mp3': ['file-loader'],
        '*.lrc': ['raw-loader'],
      },
    },
  },
};

export default nextConfig;
