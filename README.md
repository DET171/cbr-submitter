# FOR EDUCATION PURPOSES ONLY
# I will not be responsible for any misuse of this software, any damage caused, or any suspensions/bans that may occur from using it.
As a sidenote, please do NOT DDoS codebreaker.xyz or the admins are going to come after my ass.
# cbr-submitter-og
Submit your Codebreaker solutions straight from your terminal!

## Installation
1. Download the latest release:
```bash
git clone https://github.com/DET171/cbr-submitter-og.git
```
2. Install the dependencies:
```bash
cd cbr-submitter-og
yarn
```
3. Run it!
```bash
yarn cli <file containing solution> -t <auth token> -u <url to problem>
# e.g.
yarn cli test/main.cpp -t $TOKEN -u https://codebreaker.xyz/problem/dijkstra 
```

## Usage
You can view the usage by running `yarn cli --help`:
```
cbr-submit <filename> [args]

Positionals:
  filename  File to submit                                              [string]

Options:
      --version  Show version number                                   [boolean]
  -t, --token    Auth token for your account                 [string] [required]
  -u, --url      URL of the problem                          [string] [required]
      --help     Show help                                             [boolean]
```