#! /usr/bin/env node
import * as figlet from 'figlet';
import { program } from 'commander';
import { configureCredential, giveAttendance, startPrompt } from './utils/tasks';
const { version } = require('../package.json');

program.addHelpText('before', figlet.textSync("NerdDevs"));

program
  .version(version)
  .description("A NerdDevs CLI")

program
  .command('attend')
  .description("Provide daily attendance")
  .action( async () => await giveAttendance());
    
program
  .command('configure')
  .description("Configure username and password")
  .action(() => startPrompt());
  
program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}