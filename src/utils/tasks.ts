import { colorLog, decryptString, isAttendanceDone, isValidaConfig, ObjectLiteral, processLog, setConfig } from '../utils/helper';
import * as puppeteer from 'puppeteer';
import { logTable, ConfigLiteral } from './helper';
const config = require("../..//nerd.json");
const prompt = require('prompt');


export async function giveAttendance(): Promise<void> {
    if (!isValidaConfig(config)) {
        console.log('Invalid configuration. Please run the "configure" command');
        return;
    }
    const username = config.username as string;
    const password = decryptString(config.password as string);
    const browser = await puppeteer.launch({
        headless: true // false to show the browser
    });
    const page = await browser.newPage();
    processLog('\r⠋ Launching', 'yellow');
    await page.goto('https://app.bikribatta.com/#single-user-attendance-take', { waitUntil: 'load' });
    await page.type('#username', username);
    await page.type('#password', password);
    await page.click('#login');
    processLog('⠋ Signing in', 'yellow');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    const checkData = await page.waitForResponse(response => response.url() == 'https://app.bikribatta.com/single-user-attendance');
    const firstReponse = await checkData.json();
    const lastEntry = firstReponse.data.attendances?.[0].updatedAt;
    const isAlreadyGiven = isAttendanceDone(lastEntry);
    const givenDate = new Date(lastEntry).toLocaleDateString('en-us', {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric" 
    });
    if (isAlreadyGiven) {
        colorLog('green', `Attendance already given today at ${givenDate}`);
    } else {
        await page.type('#password', password);
        await page.click('#save-attendance');
        processLog('⠋ Providing attendance', 'yellow');
        const response = await page.waitForResponse(response => response.url() == 'https://app.bikribatta.com/single-user-attendance');
        const networkResponse = await response.json();
        const operationStatus = networkResponse.success ? 'Successful' : 'Failed';
        processLog(`✓ ${operationStatus}`, networkResponse.success ? 'green' : 'red');
        let terminalReponse:ObjectLiteral[];
        if (networkResponse.success) {
            const {data: {updatedAt}} = networkResponse;
            const parsedDate = new Date(updatedAt).toLocaleDateString('en-us', {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric" 
            });
            terminalReponse = [
                { 'Status': operationStatus, 'Last Entry': parsedDate },
            ];
        } else {
            terminalReponse = [
                { 'Status': operationStatus, 'Message': networkResponse.message }
            ];
        }
        logTable(terminalReponse);
    }
    browser.close();
}

export function configureCredential(username: string, password: string): void {
    console.log({username, password});
}

export function startPrompt(): void {
    prompt.start();

    prompt.get([{
        name: 'username',
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        message: "Enter valid email address",
        required: true
      }, {
        name: 'password',
        hidden: true,
        replace: '*',
        conform: function (value: string) {
          return true;
        }
        }], function (err: any, result: ConfigLiteral) {
        setConfig(result);
      });
}