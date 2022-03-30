const { Accounts } = require('../mongo/account-model')

const router = require('express').Router()

/**
 * @openapi
 * /api/data/history:
 *   get:
 *     description: returns account's actions  history.
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: OK.
 *       400:
 *         description: please login first.
 *     
 */
router.get('/history', async (req, res) => {
    try {
        const account = await Accounts.findById(req.session.account.id).populate({
            path: 'actions.to',
            select: 'username'
        }).populate({
            path: 'actions.from',
            select: 'username'
        })
        res.send({ history: account.actions, balance: account.balance })
    } catch (err) {
        res.status(500).send({ err: err })
        console.log(err)
    }
})
/**
 * @openapi
 * /api/data/accounts:
 *   get:
 *     description: returns accounts search result.
 *     tags: [Data]
 *     responses:
 *       200:
 *         description: OK.
 *       400:
 *         description: please login first.
 *     
 */
router.get('/accounts', async (req, res) => {
    try {
        const accounts = await Accounts.find({}, { username: 1 })
        res.send(accounts)
    } catch (error) {
        res.status(500).send({ err: err })
        console.log(err)
    }
})
module.exports = router