require('../config/lib')
require('../config/global')
// require('../config/mongo_db')

const {
    querySql
} = require('../config/maria_db')
const {
    connonsql
} = require('../config/mongo_db')

const db_select = require('../database/db_select');

async function get_orgchart_presell(keyword,connectiondb) {
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var role_id = 'e9dd2bf0-de9a-11e9-92c3-8704036eaa4b'
        var q_keyword = '%'+keyword+'%'
        // console.log('connectiondb:',connectiondb)
        // cluster.getConnection = util.promisify(cluster.getConnection);
        // let connection = await cluster.getConnection("master")
        // connection.query = util.promisify(connection.query)
        var sql = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_org_personal.role_id = "'+role_id+'" \
            AND (tb_account.first_name_th LIKE "'+q_keyword+'" \
            OR tb_account.last_name_th LIKE "'+q_keyword+'" \
            OR tb_account.first_name_eng LIKE "'+q_keyword+'" \
            OR tb_account.last_name_eng LIKE "'+q_keyword+'" \
            OR tb_account.thai_email LIKE "'+q_keyword+'" \
            OR tb_account.employee_id LIKE "'+q_keyword+'" \
            OR tb_org_personal.dept_name LIKE "'+q_keyword+'")'

        result_select = await querySql(connectiondb,sql)
        
        return [200, result_select]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_presell_v2(keyword,role_id,connectiondb) {
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var role_id = role_id
        var q_keyword = '%'+keyword+'%'
        // console.log('connectiondb:',connectiondb)
        // cluster.getConnection = util.promisify(cluster.getConnection);
        // let connection = await cluster.getConnection("master")
        // connection.query = util.promisify(connection.query)
        var sql = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_org_personal.role_id = "'+role_id+'" \
            AND (tb_account.first_name_th LIKE "'+q_keyword+'" \
            OR tb_account.last_name_th LIKE "'+q_keyword+'" \
            OR tb_account.first_name_eng LIKE "'+q_keyword+'" \
            OR tb_account.last_name_eng LIKE "'+q_keyword+'" \
            OR tb_account.thai_email LIKE "'+q_keyword+'" \
            OR tb_account.employee_id LIKE "'+q_keyword+'" \
            OR tb_org_personal.dept_name LIKE "'+q_keyword+'")'

        result_select = await querySql(connectiondb,sql)
        
        return [200, result_select]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_presell_v3(keyword,role_id,connectiondb) {
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var list_role_id = []
        var role_id = role_id
        role_id.forEach(element =>
            list_role_id.push('"' + element+ '"')
        );
        console.log('list_role_id:',list_role_id)

        var q_keyword = '%'+keyword+'%'
        // console.log('connectiondb:',connectiondb)
        // cluster.getConnection = util.promisify(cluster.getConnection);
        // let connection = await cluster.getConnection("master")
        // connection.query = util.promisify(connection.query)
        var sql = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_org_personal.role_id IN (' + list_role_id.join(',') + ') \
            AND (tb_account.first_name_th LIKE "'+q_keyword+'" \
            OR tb_account.last_name_th LIKE "'+q_keyword+'" \
            OR tb_account.first_name_eng LIKE "'+q_keyword+'" \
            OR tb_account.last_name_eng LIKE "'+q_keyword+'" \
            OR tb_account.thai_email LIKE "'+q_keyword+'" \
            OR tb_account.employee_id LIKE "'+q_keyword+'" \
            OR tb_org_personal.dept_name LIKE "'+q_keyword+'")'

        var result_select = await querySql(connectiondb,sql)
        console.log('sql:',sql)
        return [200, result_select]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_presell_v4(list_account_id,connectiondb) {
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var account_id = []
        list_account_id.forEach(element =>
            account_id.push('"' + element+ '"')
        );
        // console.log('connectiondb:',connectiondb)
        // cluster.getConnection = util.promisify(cluster.getConnection);
        // let connection = await cluster.getConnection("master")
        // connection.query = util.promisify(connection.query)
        var sql = 'SELECT \
        tb_account.employee_id, \
        tb_account.account_id \
        FROM tb_account \
        WHERE tb_account.account_id IN (' + account_id.join(',') + ')'

        var result_select = await querySql(connectiondb,sql)
        // console.log('sql:',sql)
        return [200, result_select]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_sale(account_id,connectiondb) {
    // console.log(connectiondb)
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var sql = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_account.mobile_no, \
        tb_account.employee_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_account.account_id = "'+account_id+'"'

        result_select = await querySql(connectiondb,sql)        
        return [200, result_select]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_SBM(dept_id,connectiondb) {
    // console.log(connectiondb)
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var sql = 'SELECT \
        tb_org_personal.account_id \
        FROM tb_org_personal \
        WHERE tb_org_personal.dept_id = "'+dept_id+'" \
        AND tb_org_personal.role_id = "d32c5fc0-de9a-11e9-9eed-6dafe77dbb46"'

        // var sql = 'SELECT \
        // tb_org_personal.account_id \
        // FROM tb_org_personal \
        // WHERE tb_org_personal.dept_id = "'+dept_id+'" \
        // AND (tb_org_personal.role_id = "d32c5fc0-de9a-11e9-9eed-6dafe77dbb46" \
        // OR tb_org_personal.role_id = "170aa490-de98-11e9-bee0-43ba952e7719" \
        // OR tb_org_personal.role_id = "f781e880-de97-11e9-a9ee-a9fe75612663")'

        var result_select = await querySql(connectiondb,sql)
        if (result_select.length == 0){
            return [200,'']
        }
        // console.log('result_select:',result_select)
        var account_id = result_select[0].account_id
        
        var sql_2 = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_account.mobile_no, \
        tb_account.employee_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_account.account_id = "'+account_id+'"'
        var result_select_sbm = await querySql(connectiondb,sql_2)
        // console.log('result_select_sbm:',result_select_sbm)
        return [200, result_select_sbm[0]]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_SBM_ppl(connectiondb) {
    try{
        var account_id = '3113712582'
        
        var sql_2 = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_account.mobile_no, \
        tb_account.employee_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_account.account_id = "'+account_id+'"\
        AND tb_org_personal.role_id = "fde68240-762e-11ea-bdf7-531ed9b021e9"'
        var result_select_sbm = await querySql(connectiondb,sql_2)
        // console.log('result_select_sbm:',result_select_sbm)
        return [200, result_select_sbm[0]]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function get_orgchart_SBM_cost(dept_id,connectiondb) {
    // console.log(connectiondb)
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        // var sql = 'SELECT \
        // tb_org_personal.account_id \
        // FROM tb_org_personal \
        // WHERE tb_org_personal.dept_id = "'+dept_id+'" \
        // AND tb_org_personal.role_id = "d32c5fc0-de9a-11e9-9eed-6dafe77dbb46"'

        var sql = 'SELECT \
        tb_org_personal.account_id \
        FROM tb_org_personal \
        WHERE tb_org_personal.dept_id = "'+dept_id+'" \
        AND (tb_org_personal.role_id = "a477f040-e5ae-11e9-84df-77c5f38ee864" \
        OR tb_org_personal.role_id = "909c3ec0-f003-11e9-aa98-19ab825aa780" \
        OR tb_org_personal.role_id = "5a167a30-f003-11e9-b98e-538ee31d6a91")'

        var result_select = await querySql(connectiondb,sql)
        if (result_select.length == 0){
            return [200,'']
        }
        // var account_id = result_select[0].account_id
        var list_data = JSON.parse(JSON.stringify(result_select))
        var arr = [list_data.map( function(el) { return el.account_id; })];

        var sql_2 = 'SELECT \
        tb_account.account_id, \
        tb_account.first_name_th, \
        tb_account.last_name_th, \
        tb_account.first_name_eng, \
        tb_account.last_name_eng , \
        tb_account.account_title_th, \
        tb_account.account_title_eng, \
        tb_account.employee_id, \
        tb_account.thai_email, \
        tb_account.mobile_no, \
        tb_account.employee_email, \
        tb_org_personal.role_name, \
        tb_org_personal.role_id, \
        tb_org_personal.dept_name, \
        tb_org_personal.dept_id \
        FROM tb_account \
        INNER JOIN tb_org_personal ON tb_account.account_id = tb_org_personal.account_id \
        WHERE tb_account.account_id in ('+arr+')'
        var result_select_sbm = await querySql(connectiondb,sql_2)
        return [200, result_select_sbm]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}


async function get_tel_number(tax_id,connectiondb) {
    // console.log(connectiondb)
    // if (connectiondb != null) { await consql(connectiondb,sql) }
    try{
        var sql = 'SELECT \
        tb_tel_number.tel_no \
        FROM tb_tel_number \
        WHERE tb_tel_number.tax_id = "'+tax_id+'"'

        result_select = await querySql(connectiondb,sql)        
        return [200, result_select]
    }
    catch(err){
        console.log('err:',err)
        return [400, err]
    }
}

async function process_get_condition_presale(doctype,connectiondb) {
    // if (connectiondb != null) { await connonsql(connectiondb) }
    try{
        var role_id = null
        var result_select = await db_select.func_get_condition_presale(doctype,connectiondb)
        if (result_select[0] == true){
            var detail = result_select[1].detail
            
            for (let i = 0 ; i< detail.length ; i++){
                if (detail[i].doctype == doctype){
                    role_id = detail[i].role_id
                }
            }
            if (role_id == null){
                return [false,'Not found document type']
            }
            else{
                return [true,role_id]
            }
        }
        
    }
    catch(err){
        console.log('err:',err)
        return [false, err]
    }
}

async function process_get_flow_presale_v2(doctype,type_of_team,type_of_flow,connectiondb) {
    // if (connectiondb != null) { await connonsql(connectiondb) }
    try{
        var role_id = null
        var result_select = await db_select.func_get_flow_presale_v2(doctype,type_of_team,type_of_flow,connectiondb)
        if (result_select[0] == true){
            var actor_of_flow = result_select[1].actor_of_flow[0]
            var permission_status = actor_of_flow.permission_status
            var actor_status = actor_of_flow.actor_status
            if (permission_status == true){
                var permission = actor_of_flow.permission
                console.log('permission:',permission)
                return [true,permission,0]
            }
            else if(actor_status == true){
                var index = actor_of_flow.index
                var flow_data = result_select[1].flow_data
                for (let j=0 ;j<flow_data.length ; j++){
                    if (flow_data[j].index == index){
                        var actor = flow_data[j].actor
                    }
                }
                console.log('actor:',actor)
                return [true,actor,1]

            }
            console.log('actor_status:',actor_status)
            // if (role_id == null){
            //     return [false,'Not found document type']
            // }
            // else{
            //     return [true,role_id]
            // }
        }
        else{
            return [false,'Not found document type']
        }
        
    }
    catch(err){
        console.log('err:',err)
        return [false, err]
    }
}


module.exports = {
    get_orgchart_presell,
    get_orgchart_sale,
    get_tel_number,
    get_orgchart_SBM,
    get_orgchart_SBM_ppl,
    process_get_condition_presale,
    get_orgchart_presell_v2,
    process_get_flow_presale_v2,
    get_orgchart_presell_v3,
    get_orgchart_presell_v4,
    get_orgchart_SBM_cost
}