# Nerd CLI

Nerd CLI is a command line interface for giving work attendance. With Nerd CLI, you can quickly and easily log your attendance for the day.

## Installation
To install Nerd CLI, first make sure that you have Node.js installed on your system. Then, open a terminal window and run the following command to install the package:
```
npm install
```
Once the package is installed, you can build it by running the following command:

```
npm run build
```
## Usage
To run the build, you can use the node command to execute the compiled code:
```
node dist
```

This will start the Nerd CLI and display the available commands -
```
Usage: dist [options] [command]

A NerdDevs CLI

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  attend          Provide daily attendance
  configure       Configure username and password
  help [command]  display help for command

```
You can onfigure your login details by running the configure command and log your attendance by running the attend command.

Alternatively, you can install the package globally, which allows you to run the Nerd CLI from any directory on your system. To do this, use the following command:
```
npm i -g
```
Once the package is installed globally, you can run the Nerd CLI by using the nerd command:
```
nerd
```
This will display the available commands, which you can use in the same way as described above.


This will display the available commands, which you can use in the same way as described above.

## Dependencies

Nerd CLI uses the following third-party packages:

- [commander](https://github.com/tj/commander.js): A command-line interface framework
- [figlet](https://github.com/patorjk/figlet.js): A library for generating ASCII art from text
- [path](https://nodejs.org/api/path.html): A core Node.js module for working with file paths
- [prompt](https://github.com/flatiron/prompt): A library for prompting the user for input
- [puppeteer](https://github.com/puppeteer/puppeteer): A library for controlling a headless Chrome instance

## Change Log

-   `2.0.0`: Upgraded to node 18.13.0 and Fixed page loading issue 