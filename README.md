## Setup

The required node version is v16.14.0. Alternatively, you can run:

```console
shell:~$ nvm use
```

To build the script run:

```console
shell:~$ yarn install
shell:~$ yarn build
```

## How to run

The entry point CLI is executed with `yarn start`. Pass `--help` to show commands and arguments to commands:

```console
shell:~$ yarn start --help
# ...
shell:~$ yarn start users --help
```

The default log level is `info`. Set the desired level using env variable `LOG_LEVEL`:

```console
shell:~$ LOG_LEVEL=debug yarn start users
```

Available levels: 'debug' | 'info' | 'warn' | 'error'

## Fix Event Reports

Fix corrupted event reports, show the number of event reports that will be updated. Add option `--post` to apply changes.

```console
shell:~$ yarn start eventReports fixCorrupted \
  --url='http://USER:PASSWORD@HOST:PORT'
  [--post]
```

## Fix Event Charts

Fix corrupted event charts, show the number of event charts that will be updated. Add option `--post` to apply changes.

```console
shell:~$ yarn start eventCharts fixCorrupted \
  --url='http://USER:PASSWORD@HOST:PORT'
  [--post]
```
