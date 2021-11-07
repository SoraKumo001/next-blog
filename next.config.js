/**
 * @type { import("next").NextConfig}
 */
const config = {
  swcMinify: true,
  experimental: {
    esmExternals: true,
    cpus: 4,
  },
  webpack: (config, { isServer }) => {
    if(isServer){ 
      config.externals = [...config.externals,{"firebase/firestore":true}]
    }
    return config
  },
};
module.exports = config;
