const fs = require('fs');
const csv = require('csv');

const readCSV = (file_path) => new Promise((resolve) => {
  fs.createReadStream(file_path)
    .pipe(csv.parse({columns: true}, (err, data) => {
      if(err) console.log(err);
      resolve(data);
    }));
});

const writeJSON = (file_path, data) => new Promise((resolve) => {
  fs.writeFile(file_path, JSON.stringify(data, null, '  '), (err) => {
    if(err) console.log(err);
    resolve(data);
  });
});

Promise.resolve()
  .then(() => readCSV(__dirname + '/query-check.csv'))
  .then((data) => writeJSON(__dirname + '/query-check.json', data));
