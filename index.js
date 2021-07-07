require('./config/lib');
require('./config/global');

const app = express();
const cors = require('cors')
const appConfig = require('./config/app');
const authenRoute = require('./routes/authen');
const fetchOneid = require('./routes/fetchdata_oneid');
const orgchart = require('./routes/orgchart');
const conditionApi = require('./routes/condition_api');
const flowApi = require('./routes/flow_api');
const workflowApi = require('./routes/workflow');
const docApi = require('./routes/document_api');
const condition_templateRoute = require('./routes/condition_template_api');
const detaildropdownRoute = require('./routes/detaildropdown_api');
const servicedetailRoute = require('./routes/service_detail_api');
const cvmRoute = require('./routes/cvm_api');
const signApi = require('./routes/sign_api');
const transactionApi = require('./routes/transaction_api');
const attachfileApi = require('./routes/attachfiles_api');
const attachfile_2Api = require('./routes/attachfiles2_api');
const dowloadApi = require('./routes/dowload_api');
const commentApi = require('./routes/comment_api');
const transactiongroupApi = require('./routes/transactiongroup_api');
const func_save_file = require('./function/func_savefile')
const otherRouter = require('./routes/other.api');
const dataRouter = require('./routes/datafromcvm_api');
const noticationRouter = require('./routes/notication.api');
const detailtemplateRouter = require('./routes/detail_template_api');
const loggerRouter = require('./routes/logger_api');
const publicRouter = require('./routes/public.api');
const pdfRouter = require('./routes/pdf.api');
const multiSignRouter = require('./routes/multiSign.api');
const countRouter = require('./routes/count.api');
const actiontransaction = require('./database/actiondb_transaction');
const previewRouter = require('./routes/previewhtml_api');
const middlewareSocket = require('./method/middleware.socket')
const transaction_other = require('./database/transaction_otherservice_db')
const apiMetrics = require('prometheus-api-metrics');
const scheduleRouter = require('./routes/schedule_api');
const cronRouter = require('./routes/cron.job.api');
const excelRouter = require('./routes/excel_api');
const conditionRouterV2 = require('./routes/conditionv2_api');
const downloadmailRouter = require('./routes/download_mail_api');
const attachfilegroupRouter = require('./routes/attachfile_group_api');
require('./method/cron.job')


app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}))
app.use(bodyParser.json({
    limit: '50mb'
}))

app.use(apiMetrics())


const getActualRequestDurationInMilliseconds = start => {
    const NS_PER_SEC = 1e9; // convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

let demoLogger = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
    console.log(log);
    next();
};

app.use(demoLogger);

expressWinston.requestWhitelist.push('body');
expressWinston.requestWhitelist.push('params');
expressWinston.requestWhitelist.push('json_data');
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) => {
            // console.log('res', info.meta.res);
            // console.log('req', info.meta.req);
            var body = info.meta.res.body
            var request_data = info.meta.req
            var duration = info.meta.responseTime
            if (!(request_data.method == 'OPTIONS')) {
                if (!(request_data.originalUrl == '/logger/api/v1/search_logger_all' || request_data.originalUrl == '/logger/api/v1/search_logger_main' || request_data.originalUrl == '/logger/api/v1/search_logger_main_like' || request_data.originalUrl == '/logger/api/v1/search_logger_main_like')) {
                    let datetime_str_after = timemoment().format('YYYY-MM-DDTHH:mm:ss')
                    var tax_id = request_data.headers.taxid
                    var service_id = null
                    if (tax_id === undefined) {
                        if (request_data.originalUrl == '/data/api/v1/data_from_cvm') {
                            var tax_id = 'Login'
                            try {
                                service_id = request_data.body.service_id
                            } catch (error) {
                                service_id = null
                            }
                        } else if(request_data.originalUrl == '/authen/api/v1/login') {
                            var tax_id = 'Login'
                            try {
                                var account_id = body.one_result_data.id
                            } catch (error) {
                                // console.log('error1',error)
                                var account_id = null
                            }
                        }

                    } else {
                        try {
                            var account_id = request_data.json_data.one_result_data.id
                        } catch (error) {
                            // console.log('error2',error)
                            var account_id = null
                        }
                    }
                    var id_log = uuid()
                    let json_data = {
                        id: id_log,
                        url: request_data.originalUrl,
                        token: request_data.headers.authorization,
                        tax_id: request_data.headers.taxid,
                        datetime: datetime_str_after,
                        account_id: account_id,
                        service_id: service_id,
                        body: request_data.body,
                        query: request_data.query,
                        params: request_data.params,
                        response: body,
                        time_duration: duration + ' ms',
                        statusCode: info.meta.res.statusCode
                    }
                    func_save_file.save_log_system_v2(json_data, tax_id)
                    if (request_data.originalUrl == '/flow/api/v1/to_transaction' || request_data.originalUrl == '/flow/api/v1/update_transaction') {
                        actiontransaction.insert_logtransac(json_data, tax_id)
                    } else if (request_data.originalUrl == '/data/api/v1/data_from_cvm' || request_data.originalUrl == '/public/api/v1/GetDocument') {
                        var url_service = 'https://ppl.one.th/nodeapi' + request_data.originalUrl
                        var status_api = null
                        if (json_data.response.status === true) {
                            status_api = 'OK'
                        } else {
                            status_api = 'ER'
                        }
                        transaction_other.insert_transaction_other_service(json_data, request_data.body, url_service, body, status_api, duration, null)
                    }else if (request_data.originalUrl == '/attachfile/api/v1/add_files' ||request_data.originalUrl == '/attachfile_group/api/v1/addfileGroup' ){
                        transaction_other.insert_transactionlog_attachfile(json_data, tax_id)
                    }
                }
            }
            return `${info.meta.res.body}`;
        })
    ),
    responseWhitelist: [...expressWinston.responseWhitelist, 'body']
}));

corsOptions = {
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors(corsOptions))
app.use(express.json());
app.use('/authen/api/v1', authenRoute)
app.use('/fetchoneid/api/v1', fetchOneid)
app.use('/orgchart/api/v1', orgchart)
app.use('/condition/api/v1', conditionApi)
app.use('/flow/api/v1', flowApi)
app.use('/workflow/api/v1', workflowApi)
app.use('/document/api/v1', docApi)
app.use('/cvm/api', cvmRoute)
app.use('/conditiontemplate/api/v1', condition_templateRoute)
app.use('/detaildocument/api', detaildropdownRoute)
app.use('/service/api/v1', servicedetailRoute)
app.use('/sign/api/v1', signApi)
app.use('/transaction/api/v1', transactionApi)
app.use('/attachfile/api/v1', attachfileApi)
app.use('/attachfile/api/v2', attachfile_2Api)
app.use('/dowload/api/v1', dowloadApi)
app.use('/comment/api/v1', commentApi)
app.use('/groupdoc/api/v1', transactiongroupApi)
app.use('/other/api/v1', otherRouter)
app.use('/data/api/v1', dataRouter)
app.use('/notication/api/v1', noticationRouter)
app.use('/detailtemplate/api/v1', detailtemplateRouter)
app.use('/logger/api/v1', loggerRouter)
app.use('/public/api/v1', publicRouter)
app.use('/pdf/api/v1', pdfRouter)
app.use('/multiSign/api/v1', multiSignRouter)
app.use('/count/api/v1', countRouter)
app.use('/preview/api/v1', previewRouter)
app.use('/schedule/api/v1', scheduleRouter)
app.use('/cron/api/v1', cronRouter)
app.use('/excel/api/v1',excelRouter)
app.use('/conditiontemplate/api/v2',conditionRouterV2)
app.use('/downloadmail/api/v1',downloadmailRouter)
app.use('/attachfile_group/api/v1',attachfilegroupRouter)



const server = app.listen(appConfig.NODE_PORT, () => {
    console.log("[success] task 1 : listening on port " + appConfig.NODE_PORT);
}).on('error', err => {
    console.log("[failed] task 1 : " + err);
});


// const redisAdapter = require('socket.io-redis');
// var io = require('socket.io')(server);
// const redisHost = '10.0.0.11';
// io.adapter(redisAdapter({
//     host: redisHost,
//     port: 6379,
//     password: "mis@Pass01"
// }));
// io.on('connection', (socket) => {
//     console.log(socket.id)
//     var RoomId = null
//     var interval = null
//     socket.on('CreateRoom', async (msg) => {
//         const SocketMethod = require('./method/socketio')
//         var token = msg.token
//         var tax_id = msg.tax_id
//         var GetResultCreateRoom = await SocketMethod.CreateRoomSocketio(socket.id, token, tax_id)
//         if (GetResultCreateRoom[0]) {
//             var room_id = GetResultCreateRoom[1]
//             socket.join(room_id);
//             console.log(socket)
//             io.emit('ResultCreateRoom', {
//                 status: true,
//                 data: {
//                     room_id: room_id
//                 },
//                 message: "CreateRoom Success"
//             })
//             RoomId = room_id
//         }
//     })
//     io.in(socket.id).emit('event', {
//         status: true
//     });
//     io.emit('main', {
//         status: true,
//         message: "welcome"
//     });
//     socket.on('CountDocument', async (msg) => {
//         const SocketMethod = require('./method/socketio')
//         const countFunc = require('./function/count.func')
//         interval = setInterval(async () => {
//             var GetRoomInfor = await SocketMethod.FindRoomSocketio(socket.id)
//             if (GetRoomInfor[0]) {
//                 var DataRoom = GetRoomInfor[1]
//                 var token = DataRoom.token
//                 var tax_id = DataRoom.tax_id
//                 var GetDataAccount = await middlewareSocket.EncToken(token, tax_id)
//                 console.log(GetDataAccount)
//                 if (!GetDataAccount[0]) {
//                     io.in(socket.id).emit('ResultCountDocument', {
//                         status: false,
//                         data: null,
//                         message: "Unauthorized"
//                     });
//                 }
//                 var json_data = GetDataAccount[1]
//                 var GetCountInfo = await countFunc.GetCountSummaryGroup(json_data)
//                 io.in(socket.id).emit('ResultCountDocument', {
//                     status: true,
//                     data: {
//                         summaryGroupCount_all: GetCountInfo[1][0],
//                         summaryGroupCount_y: GetCountInfo[1][7],
//                         summaryGroupCount_w: GetCountInfo[1][6],
//                         document_all: GetCountInfo[1][1],
//                         document_status_w: GetCountInfo[1][2],
//                         document_status_n: GetCountInfo[1][3],
//                         document_status_y: GetCountInfo[1][4],
//                         document_status_r: GetCountInfo[1][5]
//                     },
//                     message: "Get Count Success"
//                 });
//             }
//         }, 5000);
//     });

//     socket.on('disconnect', function () {
//         if (interval) {
//             clearInterval(interval);
//         }
//     });
// });


module.exports = server;