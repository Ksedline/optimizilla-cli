#!/usr/bin/env node
import fs from 'fs';
import meow from 'meow';
import url from 'url';
import path from 'path';
import request from 'request';
import { getStatus } from './lib/get-status.js';
import { asynchronously } from './lib/async.js';
import { printResult } from './lib/print-result.js';
import { randomString } from './lib/random-string.js';
import { guid } from './lib/guid.js'

const MAIN_HOST = 'https://imagecompressor.com';

const cli = meow(
  `
    Usage
      $ oz <input>

    Options
      --output, -o  Destination of the optimized file
      --replace, -r  Replace the original file
      --dry, -d  Dry run, upload, optimize and print out links

    Examples
      $ oz xpto.jpg --output ./ --replace
`,
  {
    flags: {
      output: {
        alias: 'o'
      }, 
      replace: {
        alias: 'r'
      }, 
      dry: {
        alias: 'd'
      },
    },
  }
);

if (!cli.input.length) {
  cli.showHelp(-1);
}

/**
 * startProcessingFile
 * @param {String}
 * @return {Promise}
 */
const startProcessingFile = (fileName) => {
  return new Promise((resolve, reject) => {
    let uniqPathId = randomString();
    let randomId = guid();

    const formData = {
      file: fs.createReadStream(
        fileName[0] == path.sep
          ? fileName
          : path.resolve(process.cwd() + path.sep + fileName)
      ),
      id: randomId,
      name: fileName
    };

    request.post(
      {
        url: `${MAIN_HOST}/upload/${uniqPathId}`,
        formData
      },
      error => {
        if (error) {
          reject({ fileName, uniqPathId, randomId, error });
        } else {
          resolve({ fileName, uniqPathId, randomId });
        }
      }
    );
  });
}

/**
 * downloadFinalFile
 * @param {Object} body
 * @param {Object} options
 */
const downloadFinalFile = (body, options, flags) => {
  let outputFile = flags.output ? flags.output : process.cwd();

  if (flags.replace) {
    outputFile = options.fileName;
  } else {
    outputFile = path.resolve(`${outputFile}${path.sep}${body.image.result}`);
  }

  if (cli.flags.dry) {
    printResult(
      Object.assign(options, {
        status: 'success',
        savings: body.image.savings,
        compressedUrl: url.resolve(MAIN_HOST, body.image.compressed_url)
      })
    );
  } else {
    request
      .get(url.resolve(MAIN_HOST, body.image.compressed_url))
      .pipe(fs.createWriteStream(outputFile));

    printResult(
      Object.assign(options, {
        status: 'success',
        savings: body.image.savings
      })
    );
  }
}

/**
 * Main process generator
 * @param {Object} options
 * @return {Function}
 */
const processGenerator = (options, flags) => {
  return function* () {
    let content = {};

    content = yield getStatus('auto', options);

    while (true) {
      content = yield getStatus('status', options);
      printResult(
        Object.assign(options, {
          status: 'processing',
          percent: content.body.auto_progress
        })
      );
      if (content.body.auto_progress >= 100) {
        break;
      }
    }

    content = yield getStatus('panel', options);
    downloadFinalFile(content.body, options, flags);

    return content;
  };
}

cli.input
  .reduce((newArray, singleFileName) => {
    if (singleFileName.toLowerCase().match(/png|jpg|jpeg/)) {
      return newArray.concat(singleFileName);
    }
    console.log(
      `${singleFileName} format is invalid, only png/jpeg/jpg can be used`
    );
    return newArray;
  }, [])
  .forEach(singleFileName => {
    startProcessingFile(singleFileName, cli.flags)
      .then(options => asynchronously(processGenerator(options, cli.flags)))
      .catch(options => {
        printResult(
          Object.assign(options, {
            status: 'error'
          })
        );
      });
  });
