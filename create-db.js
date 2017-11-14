var { Pool } = require('pg');


var pool = new Pool({
  host: '127.0.0.1',
  port: '5432',
  database: 'debugger',
  user: 'postgres',
  password: 'shasin670621'
});

var createSQL = `CREATE TABLE "participants" (
  "id" serial NOT NULL,
  "team_name" text NOT NULL,
  "email" text NOT NULL,
  "mobile_no" text NOT NULL,
  "password" text NOT NULL,
  "is_completed" boolean NOT NULL DEFAULT 'f',
  "player1" text NOT NULL,
  "player2" text NULL,
  "college" integer NOT NULL
)`;

pool.query(createSQL, (err, res) => {
  console.log(err, res);
  pool.end();
});
