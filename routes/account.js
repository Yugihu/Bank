const router = require('express').Router()
/**
 * @openapi
 * components:
 *   schemas:
 *     AccoountBody:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: name of the account owner
 *         password:
 *           type: string
 *           descripton: choose password to securly log into your account
 *       example:
 *         username: jo
 *         password: 123
 *
 */

/**
 * @openapi
 * /api/account/register:
 *   post:
 *     description: log to your account.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccoountBody'
 *     responses:
 *       201:
 *         description: user was created .
 *       400:
 *         description: missing info in the request body.
 *     
 */


router.post('/register', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send({ err: "invalid credantials" })
    }

    if (users.some(user => user.username == username)) {
        return res.status(400).send({ err: "username is already exist" })
    }

    const userId = v4()
    users.push({
        id: userId,
        username: username,
        password: password,
        lastVisit: new Date(),
        cart: [],
        role: "user"
    })

    console.log(`user was created : ${username} with id:${userId}`)
    return res.status(201).send({ msg: `user was created : ${username} with id:${userId}` })

})

/**
 * @openapi
 * /api/account/login:
 *   post:
 *     description: log to your account.
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccoountBody'
 *     responses:
 *       200:
 *         description: welcome to your account.
 *       400:
 *         description: missing info in the request body.
 *       401:
 *         description: wrong password.
 */


router.post('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).send({ err: "invalid credantials" })
    }

    const user = users.find(user => user.username == username)

    if (!user) {
        return res.status(400).send({ err: "user not found" })
    }

    if (user.password != password) {
        return res.status(400).send({ err: "password incorrect" })
    }

    req.session.user = user

    res.send({ msg: `logged successfuly, welcome  ${user.username}` })

})
/**
* @openapi
* /api/account/logout:
*   delete:
*     description: log out from your account.
*     tags: [Accounts]
*     requestBody:
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/AccoountBody'
*     responses:
*       200:
*         description: logout from your account.
*/
router.delete('/logout', (req, res) => {
    req.session.destroy()
    res.send({ msg: `logged out succesfuly` })
})
module.exports = router