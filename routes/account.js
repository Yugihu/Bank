const { hash, compare } = require('bcrypt')
const { onlyLogged } = require('../middlewares/onlyLogged')
const { Accounts } = require('../mongo/account-model')

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


router.post('/register', async (req, res) => {
    const { username, password } = req.body

    try {
        const hashedPass = await hash(password, 10)
        const userToBeSaved = new Accounts({ username, password: hashedPass })
        await userToBeSaved.save()
        return res.status(201).send({ msg: `user was created : ${username}` })
    } catch (err) {
        console.log(err)
        res.status(400)
        if (err.code === 11000) {
            res.send({ err: 'username already taken' })
        } else
            res.send({ err: 'username and password required' })
    }


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


router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).send({ err: "invalid credantials" })
    }

    try {

        const account = await Accounts.findOne({ username: username })

        if (!account) {
            return res.status(400).send({ err: "user not found" })
        }

        if (!await compare(password, account.password)) {
            return res.status(400).send({ err: "password incorrect" })
        }

        req.session.account = {
            username,
            id: account._id
        }

        res.send({ msg: `logged successfuly, welcome  ${username}` })

    } catch (err) {
        console.log(err)
        return res.status(500).send({ err: err })
    }

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
*       401:
*         description: you need to logout in order to login.
*     

*/
router.delete('/logout', onlyLogged, (req, res) => {
    const name = req.session.account.username
    req.session.destroy()
    res.send({ msg: `${name} is logged out succesfuly` })
})
module.exports = router