const mysql = require('mysql2');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
function validatePassword(password) {
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
connection.query('SELECT * FROM users',(error, results, fields) => {
    if (error) {
        console.error('Error executing query: ' + error.stack);
        return;
    }

    console.log('Query results: ', results)
});


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3001, () => {
    console.log('Server is running on port 300');

});
app.get('/users/:id', (req, res) => {
    const userId = req.params.id
    connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, [rows]) => {
        if (error) {
            console.log(error);
            res.status(400).json({error: 'database error'});
            return;
        }
        if (rows.length === 0) {
            res.status(403).json({error: 'user not found'});
            return;
        }
        username = rows.name
        useremail = rows.email
        date = rows.created
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
    const datedate  = new Date();
    const date = datedate.toUTCString()
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
        connection.query('INSERT INTO users (name, email, password, created) VALUES (?,?,?,?)', [name, email, password, date],(error,results,fields) => {
            if (error) {
                console.error('Error executing query: '+error.stack);
                return;
            }
            const password = req.body.password;
            if (!validatePassword(password)) {
                res.status(400).json({ error: 'Password must contain at least three of the following character types: upper case letter, lower case letter, number, symbol' });
                return;
            }
        
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