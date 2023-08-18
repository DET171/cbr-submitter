#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { submitCode } from './submit.js';
import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import console from 'consola';
import { Table } from 'console-table-printer';

yargs(hideBin(process.argv))
	.scriptName('cbr-submit')
	.usage('$0 <filename> [args]')
	// eslint-disable-next-line no-shadow
	.command('$0 <filename>', 'File to submit', (yargs) => {
		yargs.positional('filename', {
			describe: 'File to submit',
			type: 'string',
		});
	}, async (argv) => {
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

		const subtasksTable = new Table({
			columns: [
				{ name: 'subtask', alignment: 'left' },
				{ name: 'score', alignment: 'left' },
				{ name: 'total', alignment: 'left' },
			],
		});

		const code = await fs.readFile(path.join(process.cwd(), argv.filename), 'utf-8');

		const { testcases, submissionUrl, subtasks, verdict, totalScore } = await submitCode(code, argv.token, argv.url, {
			screenshot: {
				path: argv.screenshot,
			},
		});

		spinner.succeed('Submitted code!');
		console.info(`Submission URL: ${chalk.blue(submissionUrl)}`);
		console.info(`Screenshot saved to ${chalk.blue(argv.screenshot)}`);
		console.info(`Verdict: ${chalk.blue(verdict)}`);
		console.info(`Total score: ${chalk.blue(totalScore)}/100`);


		for (const subtask of subtasks) {
			if (subtask.score == subtask.total) {
				subtasksTable.addRow(subtask, { color: 'green' });
				continue;
			}
			if (subtask.score == 0) {
				subtasksTable.addRow(subtask, { color: 'red' });
				continue;
			}
			subtasksTable.addRow(subtask, { color: 'yellow' });
		}
		subtasksTable.printTable();

		for (const testcase of testcases) {
			table.addRow(testcase, { color: testcase.status === 'AC' ? 'green' : 'red' });
		}
		table.printTable();
	})
	.option('token', {
		alias: 't',
		describe: 'Auth token for your account',
		demandOption: true,
		type: 'string',
	})
	.option('url', {
		alias: 'u',
		describe: 'URL of the problem',
		demandOption: true,
		type: 'string',
	})
	.option('screenshot', {
		alias: 's',
		describe: 'Path to save screenshot',
		type: 'string',
		default: 'out/screenshot.png',
	})
	.help()
	.argv;
