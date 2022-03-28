const exp = require('express')
const session = require('express-session')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { connectTomongo } = require('./mongo/config')

//const fs = require('fs/promises')

const app = exp()

connectTomongo()

const openApiSpec = swaggerJsDoc({
    definition: {
        openapi: "3.0.0",
        info: {
            description: "Bank API for creating accounts and taking actions like money transfer",
            title: "Open Bank API",
            version: "1.0.0"

        },
        tags: ['Accounts', 'Actions', 'Data']
    },
    apis: ['./routes/*.js']
})


app.use(exp.json())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec))

// app.use(async (req, res, next) => {
//     await fs.appendFile('visits.log', `${new Date().toISOString()} |  ${req.method} ${req.url} IP: ${req.ip} \n`)
//     next()
// })

app.use(session({
    secret: "YoavBroza",//מפתח הצפנה
    resave: false,
    saveUninitialized: true,
    name: 'yoav-cookie'

}))

app.use('/api/account', require('./routes/account'))
app.use('/api/actions', require('./routes/actions'))
app.use('/api/data', require('./routes/data'))

app.listen(1000, () => console.log("server  is up and running on port 1000"))
