const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const crypto = require('crypto');


// const abc = crypto.createHash('sha256').update("Helya").digest("hex");
//
// console.log(abc);

// const pool = mysql.createPool({
//     host: 'localhost',
//     port: 3306,
//     database: 'app',
//     user: 'app_user',
//     password: 'ApplicationPassword',
// });

// app.get('/users', (req, res) => {
//     pool.query('SELECT * FROM users', (err, rows, fields) => {
//         if (err) {
//             // todo: handle the error
//             console.error(err);
//             res.status(500).send('Internal Server Error')
//         } else {
//             const output = rows.map((row) => ({...row, password: undefined}))
//             res.send(output);
//         }
//     })
// })

app.use(cors({origin: true}))
app.use(bodyParser.json())

let data = [
    {id: '1', firstname: 'Helya', lastname: 'Moradi', email: 'helya.m78@gmail.com', password: '123'},
    {id: '2', firstname: 'Saeed', lastname: 'Ahmadi', email: 'sa66@gmail.com', password: 'sa123'},
    {id: '3', firstname: 'Zahra', lastname: 'Amini', email: 'Zahraa77@gmail.com', password: '345'},
    {id: '4', firstname: 'Maryam', lastname: 'Mohseni', email: 'maryammohseni@gmail.com', password: '4565'},
    {id: '5', firstname: 'Ali', lastname: 'Bahrami', email: 'aBahrami@gmail.com', password: '565'}
]

app.get('/', (req, res) => {
    res.send(data.map(d => ({...d, password: undefined})))
})

app.post('/post', (req, res) => {
    try {
        if (req.body && Object.keys(req.body).length > 0) {
            const objData = {id: String(parseInt(data[data.length - 1].id) + 1), ...req.body}
            data.push(objData);

            res.send({status: 'OK', data: objData})
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('internal server error')
    }
})

app.put('/:id', (req, res) => {
    const pass = data.find(d => d.id === req.params.id).password
    const obj = {...req.params, ...req.body, password: pass}

    const index = data.findIndex(d => d.id === req.params.id);

    data.splice(index, 1, obj)

    res.send({status: 'Success', data: {...obj, password: undefined}})
})

app.delete('/:id', (req, res) => {
    try {
        if (req.params && Object.keys(req.params).length > 0) {
            data = data.filter(d => d.id !== req.params.id)

            res.send({status: 'Success', data: data})
        }

    } catch (err) {
        console.log(err)
        res.status(500).send('internal server error')
    }
})

app.listen(port, () => {
    console.log('simple server run')
})