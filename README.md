# Script to utilize optimizilla and avoid the pesky ui

Simple node script, used via cli - to upload and process images via [http://optimizilla.com/](http://optimizilla.com/)

[![NPM](https://nodei.co/npm/optimizilla-cli.png?downloads=true)](https://nodei.co/npm/optimizilla-cli/)

## Install
    npm i oz-cli -g

## Usage

    oz [FILENAME]

    Options
      --output, -o  Destination of the optimized file
      --replace, -r  Replace the original file
      --dry, -d  Dry run, upload, optimize and print out links

    Examples
      $ oz xpto.jpg --output ./ --replace

## Features

- Multiple files upload
- Seperate into helpers
- Options
- Help text

## Contribute

PRs accepted.

## Contributors
- [Ksedline](https://github.com/Ksedline)
- [t100n](https://github.com/t100n)

## License

MIT © Dmitri Kunin and sighed in a new way by Kirill Shekhovtsov
