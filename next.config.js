const bsconfig = require('./bsconfig.json');
const fs = require("fs");

const transpileModules = ["rescript"].concat(bsconfig["bs-dependencies"]);

module.exports = {
  pageExtensions: ["jsx", "js"],
  env: {
    ENV: process.env.NODE_ENV,
  },
  webpack: (config, options) => {
    const { isServer } = options;

    if (!isServer) {
      // We shim fs for things like the blog slugs component
      // where we need fs access in the server-side part
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    // We need this additional rule to make sure that mjs files are
    // correctly detected within our src/ folder
    config.module.rules.push({
      test: /\.m?js$/,
      use: options.defaultLoaders.babel,
      exclude: /node_modules/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      }
    });

    return config
  }
};
