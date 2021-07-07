require('../config/lib')
require('../callAPI/axiosAPI')

var call_LoginOneid = async function (url,tmp_json) {
    r = await Call.PostAPI(url, tmp_json)
    return r
}
var call_getBizOneid = async function (url,token_one) {
    r = await Call.GetAPI(url, token_one)
    return r
}

var call_getOrgDepartment_Oneid = async function (url,param,token_one) {
    r = await Call.GetAPI_PARAM_TOKEN(url, param , token_one)
    return r
}

var call_getDeptByBusiness_Oneid = async function (url,param,token_one) {
    r = await Call.GetAPI_PARAM_TOKEN(url, param , token_one)
    return r
}

var call_getRoleByBusiness_Oneid = async function (url,param,token_one) {
    r = await Call.GetAPI_PARAM_TOKEN(url, param , token_one)
    return r
}

var call_getbusinessAccount= async function (url,param,token_one) {
    r = await Call.GetAPI_PARAM_TOKEN(url, param , token_one)
    return r
}


module.exports = {
    call_LoginOneid,
    call_getBizOneid,
    call_getOrgDepartment_Oneid,
    call_getDeptByBusiness_Oneid,
    call_getRoleByBusiness_Oneid,
    call_getbusinessAccount
}