var express = require('express');
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');
var fs = require("fs");
var exphbs = require('express-handlebars');
var shell = require('shelljs');

const { Pool } = require('pg');

var app = express();

// setting view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');


// configure morgan
app.use(morgan('combined'));

//configure body parser
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// configure session middleware
app.use(session({
    secret: "debuggersession",
    cookie: {maxAge: 1000 * 60 * 60 * 24}
}));

// configurw static files
app.use('/static', express.static('public'));

// database configs
var config = {
    host: "127.0.0.1",
    port: "5432",
    database: "debugger",
    user: "postgres",
    password: "shasin670621"
}

// init db
var pool = new Pool(config);

// hash password
function hash(password, salt) {
   var hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512'); 
   return ['pbkdf2', '10000', salt, hash.toString('hex')].join('$');
};

// root end point
app.get('/', function(req, res) {
   if(req.session && req.session.auth && req.session.auth.teamName) {
       console.log('inside /');
      return res.redirect('/app/console'); 
   }       
   return res.render('index'); 
});

// register user
app.post('/register', function(req, res) {
   var teamName = req.body.tname;
   var email = req.body.email;
   var mobNo = req.body.mobNo;
   var password = req.body.pssd;
   var player1 = req.body.p1name;
   var player2 = req.body.p2name;
   var college = req.body.college;        
    
   // generate salt 
   var salt = crypto.randomBytes(128).toString('hex');    
   var hashedPassword = hash(password, salt);
    
   // save to db
   pool.query('INSERT INTO participants (team_name, email, mobile_no, password, player1, player2, college) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
    [teamName, email, mobNo, hashedPassword, player1, player2, college], (err, result) => {
      if(err) {
          res.status(500).send(JSON.stringify(err));
      } else {
          res.redirect('/login');
      }
   });    
});

// login get
app.get('/login', function(req, res) {
   if(req.session && req.session.auth && req.session.auth.teamName) {
      return res.redirect('/app/console'); 
   } 
   return res.render('login');
});

// login post
app.post('/login', function(req, res) {
   var teamName = req.body.tname;
   var password = req.body.pssd;
      
   // search db
   pool.query('SELECT * FROM participants WHERE team_name=$1', [teamName], (err, result) => {
      if(err) {
        return res.status(500).send(err.toString()); 
      } else {
        if(result.rows.length === 0) {
            res.status(403).send("User Not Registered");
        } else {
            var dbPassword = result.rows[0].password;
            var salt = dbPassword.split('$')[2];
            var hashedPassword = hash(password, salt); 
            if(dbPassword === hashedPassword) {
                req.session.auth = {
                    teamName: result.rows[0].team_name,
                    userId: result.rows[0].id
                };
                return res.redirect("/app/console");
            } else {
                return res.status(403).send("Password Incorrect");
            }
        } 
      }       
   });    
});

// logout
app.get('/logout', function(req, res) {
  delete req.session.auth;
  return res.redirect('/login');    
});


// get app console window after login
app.get('/app/console', function(req, res) {
    return res.render('selectConsole');
});

// c -language console
app.get('/app/console/language/c', function(req, res) {
    if(req.session && req.session.auth && req.session.auth.teamName) {
        // set pathname
        var pathname = path.join(__dirname, 'public/errorprograms/c/');
        // synchronous read
        var programs = []
        programs.push({
            id: 1,
            name: "armstrong",
            content: fs.readFileSync(path.join(pathname, 'armstrong_err.c')).toString()
        });
        programs.push({
            id: 2,
            name: "magic_no",
            content: fs.readFileSync(path.join(pathname, 'magic_no_err.c')).toString()
        });
        programs.push({
            id: 3,
            name: "mat_add",
            content: fs.readFileSync(path.join(pathname, 'mat_add_error.c')).toString()
        });
        programs.push({
            id: 4,
            name: "quad",
            content: fs.readFileSync(path.join(pathname, 'quad_error.c')).toString()
        });
        return res.render('console', {lang: 'c', programs: programs, authenticated: true});
    }
    return res.redirect('/login');
});

// cpp console
app.get('/app/console/language/cpp', function(req, res) {
    if(req.session && req.session.auth && req.session.auth.teamName) {
        // set pathname
        var pathname = path.join(__dirname, 'public/errorprograms/cpp/');
        // synchronous read
        var programs = []
        programs.push({
            id: 1,
            name: "armstrong",
            content: fs.readFileSync(path.join(pathname, 'armstrong_error.cpp')).toString()
        });
        programs.push({
            id: 2,
            name: "magic_no",
            content: fs.readFileSync(path.join(pathname, 'magic_no_err.cpp')).toString()
        });
        programs.push({
            id: 3,
            name: "mat_add",
            content: fs.readFileSync(path.join(pathname, 'mat_add_err.cpp')).toString()
        });
        programs.push({
            id: 4,
            name: "quad",
            content: fs.readFileSync(path.join(pathname, 'quad_err.cpp')).toString()
        });
        return res.render('console', {lang: 'cpp', programs: programs, authenticated: true});
    }
    return res.redirect('/login');
});


// submit the program 
app.post('/submit', function(req, res) {
    if(req.session && req.session.auth && req.session.auth.teamName) {
        var userId = req.session.auth.userId;
        var programId = req.body.id;
        var lang = req.body.lang;
        var name = req.body.name;
        var content = req.body.content;
        var now = req.body.now;

        var teamName = req.session.auth.teamName;
        var path = 'public/submittedprograms/'+teamName+'_'+name+'.'+lang;
      
        fs.writeFileSync(path, content, { flag: 'w' });
        
        var shellCmd = '';
        if(lang === 'cpp')
            shellCmd = `g++ ${path} -lm`
        else 
            shellCmd = `gcc ${path} -lm`;
        
        if (shell.exec(shellCmd).stderr != '') {
            res.setHeader('Content-Type', 'application/json');
            return res.send(JSON.stringify({errorMsg: "Submission rejected", status:0}));  
        } else { 
            // save status to db;
            
            pool.query('SELECT * FROM players WHERE user_id=$1', [userId], (err, result) => {
                if(err) {
                  res.status(500).send(err.toString());
                } else {
                    var column;
                    if(result.rows.length !== 0) {
                        switch(programId) {
                            case 1:
                                column = 'program1';
                                break;
                            case 2:
                                column = 'program2';
                                break;
                            case 3:
                                column = 'program3';
                                break;
                            case 4:
                                column = 'program4';
                                break;    
                        }
                        
                        var query = `UPDATE players SET ${column}=$1 WHERE user_id=$2`;
                        pool.query(query, [now , userId], (err, result) => {
                           if(err) throw err;
                            res.setHeader('Content-Type', 'application/json');
                            return res.send(JSON.stringify({
                                errorMsg: "Submission Accepted",
                                status:1,
                                now: now
                            }));     
                        });
                    }
                }          
            });
        }
    }
    
});

app.post('/set-start-time', function(req, res) {
   var userId = req.session.auth.userId;
   var startTime = req.body.startTime;    
   pool.query('INSERT INTO players (user_id, start_time) VALUES($1, $2)',
     [userId, startTime], function(err, result) {
      
       if(err) {
           return res.status(500).send(err.toString());
       } else {
           res.setHeader('Content-Type', 'application/json');
           return res.send(JSON.stringify({startTime}));
       }
   }); 
});

app.get('/players/status/:accessCode', function(req, res) {
    if(req.params.accessCode === '170g0tj02') {
        var query = `select participants.team_name, players.program1,  players.program2,  players.program3,  players.program4, players.start_time from participants, players`;
        
        pool.query(query, function(err, result) {
            if(err) {
                return res.status(500).send(err.toString());
            } else {
            
                if(result.rows.length !== 0) {
                    
                    return res.render('playerStatus', {players: result.rows});
                } else {
                    return res.send("No Status");
                }
            }
        });
    } else 
        return res.send("Not Acceessible");
});

app.listen(8080, function () {
   console.log("Debugger Listening at port 8080"); 
});
