const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); //suppress all logs with { quiet: true } and enable debug logging wwith { debug: true }

const mongoose = require('mongoose');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('❌ UNCAUGHT EXCEPTION! ❌ Shutting down...');
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection status - 🟢 Success...!'));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('❌ UNHANDLED REJECTION! ❌ Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
