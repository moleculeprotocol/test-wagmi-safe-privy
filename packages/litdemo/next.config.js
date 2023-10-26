/** @type {import('next').NextConfig} */
const webpack = require("webpack");

module.exports = {
  output: "export",
  basePath: "/litdemo",
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.plugins = [
      ...config.plugins,
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      }),
    ];
    return config;
  },
};
