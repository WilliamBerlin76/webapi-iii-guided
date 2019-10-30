const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

//three amigos req res next
function dateLogger(req,res,next){
  console.log(new Date().toISOString());

  next();
};

function requestLogger(req,res,next){
  console.log(req.method, req.originalUrl)

  next();
}

function gateKeeper(req, res, next){
  // new way of reading data sent by the client
  const password = req.headers.password || '';

  if(password.toLowerCase() === 'mellon'){
    next();
  } else if (!password){
    res.status(400).json({message: 'please provide a password'})
  } else {
    res.status(401).json({you: 'cannot pass!!'});
  }
}

// global middleware
server.use(gateKeeper)
server.use(helmet()); // third party
server.use(express.json()); // built-in
server.use(dateLogger); //custom middleware
server.use(requestLogger);
server.use(morgan('dev'));

server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

module.exports = server;
