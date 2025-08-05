#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const _1 = require(".");
const cli = new commander_1.Command();
cli
    .name('mycli')
    .description('My TypeScript CLI Tool')
    .version('1.0.0');
cli
    .command('start')
    .description('Example command')
    .action(_1.run);
cli.parse(process.argv);
