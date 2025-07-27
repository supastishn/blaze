#!/usr/bin/env node

import { Command } from 'commander';
import { run } from '.';

const cli = new Command();

cli
  .name('mycli')
  .description('My TypeScript CLI Tool')
  .version('1.0.0');

cli
  .command('start')
  .description('Example command')
  .action(run);

cli.parse(process.argv);
