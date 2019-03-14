import EndWebpackPlugin from 'end-webpack-plugin';
import fs from 'fs';
import path from 'path';
import { spawnSync, exec } from 'child_process';
import ghpages from 'gh-pages';

const outputPath = path.resolve(__dirname, '../dist');
const env = process.env.NODE_ENV;

export default config => {
  if (env !== 'development') {
    config.plugin('end-webpack-plugin').use(EndWebpackPlugin, [
      () => {
        ghpages.publish(outputPath, { dotfiles: true }, err => {
          console.log('err', err);
          return;
        });
      },
    ]);
  }
};
