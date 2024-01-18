import path from 'path';
import webpack from 'webpack';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { env as processEnv } from 'custom-env';
import { FederatedTypesPlugin } from '@module-federation/typescript';
import packageJson from './package.json';
import 'webpack-dev-server';

const { ModuleFederationPlugin } = webpack.container;

const federationConfig = () => ({
  name: 'inspection',
  filename: 'remoteEntry.js',
  exposes: {
    './app': './src/plugin',
  },
  remotes: {
    library: `library@${process.env.LIBRARY_URL}remoteEntry.js`,
    ui: `ui@${process.env.UI_URL}remoteEntry.js`,
  },
  shared: {
    '@heroicons/react': {
      singleton: true,
      requiredVersion: packageJson.dependencies['@heroicons/react'],
    },
    clsx: {
      singleton: true,
      requiredVersion: packageJson.dependencies.clsx,
    },
    react: {
      singleton: true,
      requiredVersion: packageJson.dependencies.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: packageJson.dependencies['react-dom'],
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: packageJson.dependencies['react-router-dom'],
    },
  },
});

const webpackConfigFactory = (): webpack.Configuration => ({
  output: {
    publicPath: process.env.INSPECTION_URL,
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[local]__[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      fix: true,
    }),
    new ModuleFederationPlugin(federationConfig()),
    new FederatedTypesPlugin({
      federationConfig: federationConfig(),
      disableTypeCompilation: true,
      typescriptFolderName: 'types',
    }),
    new HtmlWebpackPlugin(),
    new CopyPlugin({ patterns: ['public'] }),
  ],
});

const config = (env: Record<string, string>) => {
  const environment = env.production
    ? 'production'
    : env.staging
    ? 'staging'
    : env.local
    ? 'local'
    : 'development';
  processEnv(environment);

  const webpackConfig = webpackConfigFactory();

  if (env.development || env.local) {
    webpackConfig.mode = 'development';
    webpackConfig.devtool = 'eval-source-map';
    webpackConfig.devServer = {
      historyApiFallback: true,
      port: 9003,
      static: {
        directory: path.join(__dirname, 'dist'),
      },
    };
  } else {
    webpackConfig.mode = 'production';
  }

  webpackConfig.plugins?.unshift(
    new Dotenv({
      path: `./.env.${environment}`,
      systemvars: true,
    })
  );

  return webpackConfig;
};

export default config;
