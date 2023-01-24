const fs = require('fs');
const { spawn } = require('child_process');
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

// const childPython = spawn('python', ['script.py', 'Subigya']);

// childPython.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// childPython.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

// childPython.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

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
