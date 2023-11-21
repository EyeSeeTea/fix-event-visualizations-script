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

Fix corrupted event reports, on console it will show the number of event reports that will be updated. It will generate a file (`fixed-event-reports.json`) that contains the data to be sent to DHIS2 instance. Add option `--post` actually apply changes (update the event reports).

```console
shell:~$ yarn start eventReports fixCorrupted \
  --url='http://USER:PASSWORD@HOST:PORT'
  [--post]
```

Notes:

-   In some scenarios, there are invalid `userAccesses` on some event reports. This happens when user has been deleted but the permissions on that event report doesn't. So the event report is giving access to a non-existent user. For that scenarios, the script removes the invalid user accesses.

## Fix Event Charts

Fix corrupted event charts, on console it will show the number of event charts that will be updated. It will generate a file (`fixed-event-charts.json`) that contains the data to be sent to DHIS2 instance. Add option `--post` actually apply changes (update the event charts).

```console
shell:~$ yarn start eventCharts fixCorrupted \
  --url='http://USER:PASSWORD@HOST:PORT'
  [--post]
```

Notes:

-   In some scenarios, there are invalid `userAccesses` on some event reports. This happens when user has been deleted but the permissions on that event report doesn't. So the event report is giving access to a non-existent user. For that scenarios, the script removes the invalid user accesses.
