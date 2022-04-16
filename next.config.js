/**
 * @type { import("next").NextConfig}
 */
const config = {
  //swcMinify: true,
  experimental: {
    cpus: 4,
    runtime: 'edge',
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
