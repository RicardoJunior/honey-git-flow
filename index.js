#!/usr/bin/env node
const program = require('comander');

program
    .version('0.0.1')
    .description('A new git flow with hooks for waffle.io. And now you have a Waffle with honey.');

program
    .command('commit')
    .description('Trigger ghooks for commit')
    .action(() => {
        require('./gitValidations.js');
    });

program
    .command('rebase')
    .description('Trigger ghooks for rebase')
    .action(() => {
        require('./gitValidations.js');
    });

program.parse(process.argv);