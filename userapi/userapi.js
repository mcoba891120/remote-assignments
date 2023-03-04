const mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.urlencoded({extended:true}));
function validatePassword(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(password);
    const typesCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    return typesCount >= 3;
}
function validatename(password) {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(password);
    const typesCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
    return typesCount >= 3;
}

const connection = mysql.createConnection({
    host: "mcoba-db.cyldhxt4vckd.ap-northeast-1.rds.amazonaws.com",
    user: "mcoba",
    password: "race8945",
    database: "assignment"
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database: '+ error.stack);
        return;
    }

    console.log('Connected to database with connection ID '+ connection.user);

});
function test() {
    connection.query('SELECT * FROM users',(error, results, fields) => {
        if (error) {
            console.error('Error executing query: ' + error.stack);
            return;
        }
        console.log('Query results: ', results)
    })
};


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/healthcheck', (req, res) => {
    res.send('Hello, World!');
});

app.get('/users', (req, res) => {
    const userId = req.query.id;
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, [rows]) => {
        if (error) {
            console.log(error);
            res.status(400).json({error: 'database error'});
            return;
        }
        if (rows == undefined) {
            res.status(403).json({error:'user undefine'});
        }
        if (rows.length === 0) {
            res.status(403).json({error: 'user not found'});
            return;
        }

        if(!req.headers['request-date']){
            res.status(400);
            res.send('Request-Date missing');
            return;
        }
        username = rows.name
        useremail = rows.email
        date = req.headers["request-head"]

        res.json({
            data:{
                user:{
                    id:userId,
                    name:username,
                    email:useremail,
                },
                date:date
            }
        });
    });
});

app.use(bodyParser.json());


app.post('/users',(req, res) => {
    const {name, email, password} = req.body;
    const date_created = new Date().toUTCString()
    const sql_if_email = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    connection.query(sql_if_email,[email],(error,results) => {
        if (error) {
            res.status(400).json({error:'internal server error'});
            return;
        }
        const count = results[0].count;
        if (count > 0){
            res.status(403).json({error:'email already exists'});
            return;
        }
        if(req.headers['content-type']!=='application/json'){
            res.status(400);
            res.send('Content-type not matched');
            return;
        }
        if(!req.headers['request-date']){
            res.status(400);
            res.send('Request-Date missing');
            return;
        }
        if (!validatePassword(password)) {
            res.status(400).json({ error: 'Password must contain at least three of the following character types: upper case letter, lower case letter, number, symbol' });
            return;
        }
        const name_test = /^[a-zA-Z0-9]+$/
        if (!name_test.test(name)) {
            res.status(400).json({ error: 'name must contain only english and number' });
            return;
        }
        const email_test = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
        if (!email_test.test(email)) {
            res.status(400).json({error: 'email must be the email format'});
            return;
        }
        connection.query('INSERT INTO users (name, email, password, created) VALUES (?,?,?,?)', [name, email, password,date_created],(error,results,fields) => {
            if (error) {
                console.error('Error executing query: '+error.stack);
                return;
            }
            date = req.headers['request-date']
            console.log(res.status(200),'User created with ID: ' + results.insertId);
            res.json({
                data:{
                    user:{
                        id:results.insertId,
                        name:name,
                        email:email,
                    },
                    date:date
                }
            })
        })
    })
    
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');

});