import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export async function submitCode(code, token, url, opts) {
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


	const submissionUrl = page.url();
	// take a screenshot
	if (opts.screenshot) {
		await fs.mkdir('out', { recursive: true });
		await page.screenshot({
			path: opts.screenshot.path || path.join(process.cwd(), 'out/screenshot.png'),
			fullPage: true,
		});
	}

	const testcases = await page.evaluate(() => {
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

	// check if overall verdict is AC, PS or WA
	const subtasksScores = await page.evaluate(() => {
		function extractScore(inputString) {
			const pattern = /Subtask \d+: \((\d+)\/(\d+)\)/;
			const match = inputString.match(pattern);

			if (match) {
				const score = match[1];
				const total = match[2];
				return { score, total };
			}

			return null;
		}

		const container = document.getElementById('submission-subtasks-container');
		const subtasks = Array.from(container.querySelectorAll(':scope div[data-target*="subtask"] > h6'));
		const scores = subtasks.map((subtask, i) => {
			const score = extractScore(subtask.innerText.trim());
			return {
				subtask: i + 1,
				...score,
			};
		});

		return scores;
	});

	const totalScore = subtasksScores.reduce((acc, curr) => {
		return acc + Number(curr.score);
	}, 0);

	const verdict = totalScore === 100 ? 'AC' : (totalScore === 0 ? 'WA' : 'PS');


	browser.close();

	return {
		submissionUrl,
		testcases,
		subtasks: subtasksScores,
		verdict,
		totalScore,
	};
}