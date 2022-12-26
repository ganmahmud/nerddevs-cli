const { Console } = require('console');
const { Transform } = require('stream');
const { writeFileSync } = require('fs');
const { Buffer } = require('buffer');
const fs = require("fs");

export function logTable(data: ObjectLiteral): void {
  const ts = new Transform({ transform(chunk: any, enc: any, cb: (arg0: null, arg1: any) => void) { cb(null, chunk) } })
  const logger = new Console({ stdout: ts })
  logger.table(data)
  const table = (ts.read() || '').toString()
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  console.log(result.trim());
}

export function setConfig(config: ConfigLiteral): void {
  const path = './nerd.json';
  const encrypted = {
    username: config.username,
    password: encryptString(config.password)
  }

  try {
      writeFileSync(path, JSON.stringify(encrypted, null, 2), 'utf8');
      console.log('Configuration successfully saved to disk');
  } catch (error) {
      console.log('An error has occurred during saving configuration', error);
  }
}

export function isValidaConfig(config: ObjectLiteral): boolean {
  
  const { username, password } = config;
  if (username && password && username.length > 0 && password.length > 0) {
    return true;
  }
  return false;
}
export function processLog(msg: string, color?: 'red' | 'green' | 'yellow' | 'reset'): void {
  const colorCodes = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m'
  };

  const colorCode = color ? colorCodes[color] : colorCodes['reset'];
  process.stdout.write(`${colorCode}${msg}${colorCode}\r`);
}


export function encryptString(text: string): string {
  return Buffer.from(text).toString('base64');
}

export function decryptString(text: string): string {
  return Buffer.from(text, 'base64').toString('utf8');
}

export interface ObjectLiteral {
  [key: string]: any;
}

export interface ConfigLiteral {
  username: string;
  password: string;
}

export function isAttendanceDone(lastEntry: string): boolean {
  const currentDate = new Date();
  const updatedAtDate = new Date(lastEntry);
  return currentDate.toDateString() === updatedAtDate.toDateString();
}

export function colorLog(color: string, text: string): void {
  const fontColor = color === 'red' ? '\x1b[31m%s\x1b[0m' : '\x1b[1m\x1b[32m%s\x1b[0m';
  console.log(fontColor, text);
}