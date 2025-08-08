#!/usr/bin/env node

import { Command } from 'commander';
import { compile } from '../compiler';
import fs from 'fs/promises';

const cli = new Command();

cli
  .name('ts2cpp')
  .description('TypeScript to C++ Compiler')
  .version('1.0.1');

cli
  .command('compile <source>')
  .description('Compile TypeScript to C++')
  .option('-o, --output <file>', 'Output file')
  .action(async (source, {output}) => {
    try {
      const code = await fs.readFile(source, 'utf-8');
      const cppCode = compile(code);
      if (output) {
        await fs.writeFile(output, cppCode);
      } else {
        console.log(cppCode);
      }
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });

cli.parse(process.argv);
