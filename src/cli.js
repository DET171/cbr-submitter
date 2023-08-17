#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { submitCode } from './submit.js';

const args = yargs(hideBin(process.argv))
	.scriptName('cbr-submit')
	.usage('$0 <filename> [args]')
	// eslint-disable-next-line no-shadow
	.command('$0 <filename>', 'File to submit', (yargs) => {
		yargs.positional('filename', {
			describe: 'File to submit',
			type: 'string',
		});
	}, async (argv) => {
		await submitCode(argv.filename, argv.token, argv.url);
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
	.help()
	.argv;
