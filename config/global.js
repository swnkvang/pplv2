// uat
globalclientId = 147
globalsecretKey = 'zgZ45TRqSkoYVZbErn1KCW5FTh5Alin37kZ4vvOk'
// globalUrlOne = 'https://testoneid.inet.co.th'
globalUrlOne = 'https://one.th'
global_SSO_KEY = 'q2TCgLKSwawLCtVFJnShihR16YqYcNUO'
// path_global_1 = '/home/jirayu.ko/paperless_prod'
global.GLOBAL_VALUE = process.env
if (GLOBAL_VALUE.NODE_ENV == 'production') {
    global.envprofile = 'production'
    require('dotenv').config({
        path: '.env'
    })
} else {
    global.envprofile = 'uat'
    require('dotenv').config({
        path: 'uat.env'
    })
}
url_credentials_list_v2 = GLOBAL_VALUE.url_credentials_list_v2
url_credentials_authorize_v2 = GLOBAL_VALUE.url_credentials_authorize_v2
url_pdfSigning_Sign_v3 = GLOBAL_VALUE.url_pdfSigning_Sign_v3
url_jsonsigning_v1 = GLOBAL_VALUE.url_jsonsigning_v1
url_jsonpdf_v1 = GLOBAL_VALUE.url_jsonpdf_v1
url_CaList = GLOBAL_VALUE.url_CaList
url_webservice_signing = GLOBAL_VALUE.url_webservice_signing
global.path_local = GLOBAL_VALUE.path_local
global.url_convert_html = GLOBAL_VALUE.url_convert_html
global.url_convert_html_pdf = GLOBAL_VALUE.url_convert_html_pdf
global.url_ppl = 'https://uatpaperless.one.th/devppl'
global.url_ppl_prod = GLOBAL_VALUE.url_ppl_prod
global.web_ppl = GLOBAL_VALUE.web_ppl
global.url_onechat = GLOBAL_VALUE.url_onechat
global.tokenBotChat = GLOBAL_VALUE.tokenBotChat
global.idBotChat = GLOBAL_VALUE.idBotChat
// global.JsonSftp = GLOBAL_VALUE.JsonSftp
global.JsonSftp = {
    host: GLOBAL_VALUE.hostSftp,
    port: Number(GLOBAL_VALUE.portSftp),
    username: GLOBAL_VALUE.usernameSftp,
    password: GLOBAL_VALUE.passwordSftp
}

// ONEBOX_PRD
global.url_onebox = GLOBAL_VALUE.url_onebox
global.token_onebox = GLOBAL_VALUE.token_onebox

