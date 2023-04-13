const { check, validationResult } = require('express-validator')
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'sahil',
    host: 'localhost',
    database: 'user_db',
    password: 'sahil1234',
    port: 5432,
})
console.log("Successfully connected to database!");

const sql_create = `CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL
);`;

//pool.query(sql_create, [], (err, result) => {
//  if (err) {
//    return console.error(err.message);
//  }
//  console.log("User table created");

//  const sql_insert = `INSERT INTO Users (id, name, email) VALUES
//    (1, 'Sahil', 'sahilsinha.us@gmail.com'),
//    (2, 'Sahil2', 'sahil.sinha@clearhaven.com')
//  ON CONFLICT DO NOTHING;`;
//  pool.query(sql_insert, [], (err, result) => {
//    if (err) {
//      return console.error(err.message);
//    }
//  });
//});

const getUsers = (request, response) => {
    pool.query('SELECT * FROM Users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).json(results.rows)
        response.render("users",{model: results.rows})
    })
}

//GET /edit/1
const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM Users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).json(results.rows)
        response.render("edit", {model: results.rows[0]})
    })
}

//GET /create
const createUser1 = (request, response) => {
    response.render("create", { model: {} });
}

//POST /create
const createUser2 = (request, response) => {
    console.log("now creating user")
    pool.query('INSERT INTO Users (name, email) VALUES ($1, $2)', [request.body.name, request.body.email], (error, results) => {
        if (error) {
            throw error
        }
        //response.status(201).send(`User added with ID: ${result.insertId}`)
        //const errors = validationResult(request)
    	//if(!errors.isEmpty()) {
        //    const alert = errors.array()
        //    response.render('create', {
        //        alert
        //    })
        //}
        const errors = validationResult(request)
        if(!errors.isEmpty()) {
            const alert = errors.array()
            //response.json(errors)
            response.render('create', { model: {}, alert })
        }
        else {
            response.redirect("/users")
        }
    })
}

//POST /edit/1
const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query(
        'UPDATE Users SET name = $1, email = $2 WHERE id = $3',
        [request.body.name, request.body.email, id],
        (error, results) => {
            if (error) {
                throw error
            }
            //response.status(200).send(`User modified with ID: ${id}`)
            response.redirect("/users")
        }
    )
}

//GET /delete/1
const deleteUser1 = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM Users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).send(`User deleted with ID: ${id}`)
        response.render("delete", { model: results.rows[0] });
    })
}

//POST /delete
const deleteUser2 = (request, response) => {
    let {id} = request.body
    console.log(id)
    pool.query('DELETE FROM Users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        //response.status(200).send(`User deleted with ID: ${id}`)
        console.log("made it")
        response.redirect("/users")
	console.log("finshed delete")

    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser1,
    createUser2,
    updateUser,
    deleteUser1,
    deleteUser2
}
