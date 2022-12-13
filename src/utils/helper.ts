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
export function processLog(msg: string): void {
  process.stdout.write(`${msg}\r`);
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
