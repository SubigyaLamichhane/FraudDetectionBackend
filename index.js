const fs = require('fs');
const { spawn, exec } = require('child_process');
const express = require('express');
const cors = require('cors');

const app = express();

//allow from all origins
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

const logger = (err, stdout, stderr) => {
  if (err) {
    console.log(err);
  }
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
};

exec('su', logger);
exec('echo "Installing Python Dependencies"', (err, stdout, stderr) => {
  console.log(stdout);
});
exec('apt-get update', logger);
exec('apt-get install python3-pip', logger);
exec('apt-get install python-is-python3', logger);
exec('source server/bin/activate', logger);
exec('pip install numpy', logger);
exec('pip install sklearn', logger);
exec('echo "Commands Executed"', (err, stdout, stderr) => {
  console.log(stdout);
});

function callToolsPromise(data) {
  const { typeOfPayment, amount, oldbalanceOrg, newbalanceOrg } = data;
  return new Promise((resolve, reject) => {
    let pipshell = 'python';
    // "type", "amount", "oldbalanceOrg", "newbalanceOrig"
    let args = [
      'script.py',
      typeOfPayment.toString(),
      amount.toString(),
      oldbalanceOrg.toString(),
      newbalanceOrg.toString(),
    ];

    tool = spawn(pipshell, args);

    tool.stdout.on('data', (data) => {
      resolve(data.toString());
    });

    tool.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
  });
}

app.use(express.json());

app.get('/', async (req, res) => {
  res.send('Hello World');
});

app.post('/', async (req, res) => {
  const data = req.body;

  let isFraud = await callToolsPromise(data);

  if (isFraud.replace(/(\n)/gm, '') === 'true') {
    isFraud = true;
  } else if (isFraud.replace(/(\n)/gm, '') === 'false') {
    isFraud = false;
  }

  res.send({
    isFraud: isFraud,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server started at port: ' + PORT);
});
