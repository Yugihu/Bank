const { onlyLogged } = require('../middlewares/onlyLogged')
const { Accounts } = require('../mongo/account-model')

const router = require('express').Router()


/**
 * @openapi
 * components:
 *   schemas:
 *     ActionBody:
 *       type: object
 *       required:
 *         - type
 *         - amount
 *       properties: 
 *         type:
 *           type: string
 *           description: type of the actions taken options are withrawal, deposite, transfer
 *         amount:
 *           type: number
 *           descripton: amount of the money involved in the actions
 *         to:
 *           type: ObjectId
 *           descripton: optional,  in case of transfer actions
 *       example:
 *         type: deposite
 *         amount: 123
 *
 */

/**
 * @openapi
 * /api/actions/:
 *   post:
 *     description: create new action.
 *     tags: [Actions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionBody'
 *     responses:
 *       200:
 *         description: action done successfully.
 *       400:
 *         description: missing info in the request body or amount in negativ value, invalid destination or limited account.
 *     
 */
router.post('/',onlyLogged, async (req, res) => {
    try {
        const { type, amount, to } = req.body

        if (!amount || amount <= 0) {
            return res.status(400).send({ err: `invalide amount for action` })
        }

        const account = await Accounts.findById(req.session.account.id)
        let newBalance
        switch (type) {

            case 'deposite':
                account.actions.push({ type, amount })
                account.balance += amount;
                break;
            case 'withrawal':
                if (!account.credit && account.balance - amount > 0) {
                    return res.status(400).send({ err: `your account balance is limited to debit only ,please deposit $${Math.abs(account.balance - amount)} before trying again` })
                }
                account.actions.push({ type, amount })
                account.balance -= amount;
                break;

            case 'transfer':
                if (!to) {
                    return res.status(400).send({ err: `invalide destination ,please choose valid account` })
                }

                if (!account.credit && account.balance - amount < 0) {
                    return res.status(400).send({ err: `your account balance is limited to debit only ,please deposit $${Math.abs(account.balance - amount)} before trying again` })
                }
                console.log(account.credit)
                account.actions.push({ type, amount, to })
                account.balance -= amount;

                const reciverAccount = await Accounts.findById(to)
                if (!reciverAccount) {
                    return res.status(400).send({ err: `invalide destination ,please choose valid account` })

                }
                reciverAccount.actions.push({ type, amount, from: account._id })
                reciverAccount.balance += amount
                await reciverAccount.save()
                break;

            default:
                return res.status(400).send({ err: 'invalid action type' })
                break;

        }
        await account.save()
        res.send("action done")

    } catch (err) {
        console.log(err)
        res.status(500).send({ err: err })
    }
})

module.exports = router