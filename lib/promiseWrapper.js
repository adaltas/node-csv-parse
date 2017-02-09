/**
 * Created by cc on 09/02/2017.
 */
"use strict";

const parse = require('./index');
const fs = require('fs');

module.exports = function (file) {
  return new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(file).pipe(parse())
        .on('data', (row) => {
          data.push(row);
        })
        .on('error', e => {
          reject(e);
        })
        .on('end', () => {
          resolve(data);
        });
    }
  );
};
