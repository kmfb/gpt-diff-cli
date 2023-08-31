# GPT Diff CLI

A command line tool to diff between various changesets using advanced algorithms. Works with npm as well as Docker.

## Prerequisites
- Node.js (for npm usage)
- Docker (for Docker usage)

## Installation & Usage

### NPM:

1. Install the package from npm:

```bash
npm install gpt-diff-cli -g
```

2. Use the command line tool:

```bash
gpt-diff-cli arg1 arg2
```

### Manual Setup:

1. Clone the repository:

```bash
git clone https://github.com/kmfb/gpt-diff-cli.git
```

2. Navigate to the repository:

```bash
cd gpt-diff-cli
```

3. Install the necessary packages:

```bash
npm install
```

4. Run the application:

```bash
node ./src/index.mjs arg1 arg2
```

### Docker:

1. Build the Docker image:

```bash
docker build -t stardusted/gpt-diff-cli .
```

2. Use the Docker container:

```bash
docker run -v /path/to/your/directory:/toBeDiffed stardusted/gpt-diff-cli <commit_id1> <commit_id2>
```

Replace `/path/to/your/directory` with the actual path to your repository or the directory you want to use with the CLI. Replace `<commit_id1>` and `<commit_id2>` with the actual commit IDs you want to diff.

## Example:

```bash
docker run -v /Users/tian/repos/gpt-diff-cli:/toBeDiffed stardusted/gpt-diff-cli a309fc20cf85e4273fd9777df72e683ab3d13b32 6a365a532b7b6c04e86834ae21104eac677712f1
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)