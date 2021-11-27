require('dotenv').config();
const exec = require('child_process').exec;
exec(`gsutil cors set cors.json gs://${process.env.NEXT_PUBLIC_storageBucket}`, (err, stdout) => {
  if (err) { console.log(err); }
  console.log(stdout);
});