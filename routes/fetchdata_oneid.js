require('../config/lib')
require('../config/global')

const router = express.Router();
const {
    response
} = require('express');
const middleware = require('../method/middleware')
const fetchOneid = require('../method/fetchoneid_process');
const condb = require('../function/func_condb');
const {
    json
} = require('body-parser');



router.use(middleware)
router.post("/sync/department_business", async function (req, res) {
    let body = req.query
    var data = json_data
    let token = data.one_access_token
    var tax_id = req.headers.taxid
    resp = await fetchOneid.fetch_department(data, tax_id, token)
    if (resp[0] === 200) {
        return res.send({
            status: 'success',
            data: resp[1]
        })
    } else {
        return res.send({
            status: 'fail',
            data: resp[1]
        })
    }
});

router.post("/sync/role_business", async function (req, res) {
    let body = req.query
    var data = json_data
    let token = data.one_access_token
    var tax_id = req.headers.taxid
    resp = await fetchOneid.fetch_role(data, tax_id, token)
    if (resp[0] === 200) {
        return res.send({
            status: 'success',
            data: resp[1]
        })
    } else {
        return res.send({
            status: 'fail',
            data: resp[1]
        })
    }
});

router.post("/sync/business_account", async function (req, res) {
    let body = req.query
    var data = json_data
    let token = data.one_access_token
    var tax_id = req.headers.taxid
    resp = await fetchOneid.fetch_bizaccount(data, tax_id, token)
    if (resp[0] === 200) {
        return res.send({
            status: 'success',
            data: resp[1]
        })
    } else {
        return res.send({
            status: 'fail',
            data: resp[1]
        })
    }
});

router.get("/sync/org_account", async function (req, res) {
    let body = req.query
    var data = json_data
    let token = data.one_access_token
    var tax_id = req.headers.taxid
    resp = await fetchOneid.fetch_OrgAccount(data, tax_id, token)
    if (resp[0] === 200) {
        return res.send({
            status: 'success',
            data: resp[1]
        })
    } else {
        return res.send({
            status: 'fail',
            data: resp[1]
        })
    }
});


module.exports = router