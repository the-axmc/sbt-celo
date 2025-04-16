// next.config.js
require('dotenv').config(); // Load the environment variables

module.exports = {
  reactStrictMode: true,
  env: {
    // Add the ABI path from the .env file
    SBT_ABI_PATH: process.env.SBT_ABI_PATH,
  },
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};
