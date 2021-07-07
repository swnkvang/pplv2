require('../config/lib')

const router = express.Router();


router.post("/login", async function (req, res) {
    let body = req.body
    let username = body.username
    let login_data = await sodium_ppl.login_ppl(body)
    if (login_data[0] == 200) {
        let data_citizen = await sodium_ppl.data_login_Decrypted(login_data[1].ciphertext)
        if (data_citizen[0] == 200) {
            data_citizen[1].data_login.token = data_citizen[1].ciphertext
            return res.send(data_citizen[1].data_login)
            res.end()
        } else {
            // return res.status(401)
            return res.status(401).json({
                result: "ER",
                messageText: 'Unauthorized',
                status_Code: 401
            });
            res.end()
        }

    } else {
        // return res.status(401)
        return res.status(401).json({
            result: "ER",
            messageText: login_data[1],
            status_Code: 401
        });
        res.end()
    }
});


router.post("/login_token", async function (req, res) {
    try {
        let body = req.body
        let code = body.code
        var login_data = await sodium_ppl.login_oneid(code)
        if (login_data[0] == 200) {
            let data_citizen = await sodium_ppl.data_login_Decrypted(login_data[1].ciphertext)
            if (data_citizen[0] == 200) {
                data_citizen[1].data_login.token = data_citizen[1].ciphertext
                return res.send(data_citizen[1].data_login)
            } else {
                return res.status(401).json({
                    result: "ER",
                    messageText: 'Unauthorized',
                    status_Code: 401
                });
            }
        }else{
            return res.status(401).json({
                result: "ER",
                messageText: 'Unauthorized',
                status_Code: 401
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            result: "ER",
            messageText: 'Unauthorized',
            status_Code: 401
        });
    }
});

module.exports = router