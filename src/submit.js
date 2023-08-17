import puppeteer from 'puppeteer';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import console from 'consola';
import { Table } from 'console-table-printer';

export async function submitCode(filename, token, url) {
	const spinner = ora('Submitting code...').start();
	const table = new Table({
		columns: [
			{ name: 'testcase', alignment: 'left' },
			{ name: 'score', alignment: 'left' },
			{ name: 'status', alignment: 'left' },
			{ name: 'time', alignment: 'left' },
			{ name: 'memory', alignment: 'left' },
		],
	});

	const code = await fs.readFile(path.join(process.cwd(), filename), 'utf-8');

	const browser = await puppeteer.launch({
		headless: 'new',
		defaultViewport: null,
		args: ['--window-size=1920,1080'],
	});
	const page = await browser.newPage();
	await page.goto(url);
	await page.setCookie({
		name: 'google-login-session',
		value: token,
		domain: 'codebreaker.xyz',
	});
	// reload
	await page.reload();

	// click on #submitlink
	await page.click('#submitlink');
	await page.click('#submitCodeForm > p:nth-child(3) > div > div.CodeMirror-scroll > div.CodeMirror-sizer');
	await page.keyboard.type(code);
	await page.click('#submit');

	await page.waitForNavigation({
		waitUntil: 'networkidle0',
	});

	// take a screenshot
	await fs.mkdir('out', { recursive: true });
	await page.screenshot({
		path: 'out/screenshot.png',
		fullPage: true,
	});

	const scores = await page.evaluate(() => {
		const container = document.getElementById('submission-subtasks-container');
		const subtasks = Array.from(container.querySelectorAll('div[id*="subtask"] tbody > tr'));
		const results = [];

		for (let i = 0; i < subtasks.length; i++) {
			const subtask = subtasks[i];
			const children = Array.from(subtask.children);
			const name = children[0].innerText.trim();
			const score = children[1].innerText.trim();
			const status = children[2].innerText.trim();
			const time = children[3].innerText.trim();
			const memory = children[4].innerText.trim();

			results.push({
				testcase: i + 1,
				score,
				status,
				time,
				memory,
			});
		}

		return results;
	});

	// stop spinner
	spinner.stop();
	console.success(chalk.green('Code submitted successfully!'));
	console.info(chalk.blue('Screenshot saved to out/screenshot.png'));
	// print table
	table.addRows(scores);
	table.printTable();


	return browser.close();
}