/**
 * @type { import("next").NextConfig}
 */
const config = {
  experimental: {
    cpus: 4,
  },
  output: 'standalone',
  compiler: {
    styledComponents: true,
    emotion: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...config.externals,
        { 'firebase/app': true },
        { 'firebase/auth': true },
        { 'firebase/firestore': true },
      ];
    }
    return config;
  },
};
module.exports = config;
