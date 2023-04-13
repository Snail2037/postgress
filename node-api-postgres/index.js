const express = require('express')
const router = express.Router();
const path = require("path")
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3010
const { check, validationResult } = require('express-validator')
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
)

const urlencodedParser = bodyParser.urlencoded({extended: false })

app.get('/', (request, response) => {
    response.render("index")
})

app.get('/users', db.getUsers)
app.get('/create', db.createUser1)
app.post('/create', [
    check('email', 'Email length should be 5 to 30 characters')
                    .isEmail().normalizeEmail(),
    check('name', 'Name length should be 2 to 30 characters')
                    .exists().isLength({ min: 2 })
], db.createUser2)
app.get('/edit/:id', db.getUserById)
app.post('/edit/:id', db.updateUser)
app.get('/delete/:id', db.deleteUser1)
app.post('/delete', db.deleteUser2)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})
