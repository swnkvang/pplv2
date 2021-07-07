const connonsql = async function (dbconfig) {
    let tax_id = dbconfig.t
    let detail = dbconfig.d[0].nosql
    let dbname = detail.db
    let ipaddress = detail.ip
    let user = detail.us
    let ps = detail.ps
    let po = detail.po
    database = dbname
    var mongo_uri = 'mongodb://' + user + ':' + ps + '@' + ipaddress + ':' + po + '/' + dbname
    var db;
    mongoose.connect(mongo_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {

    });
}


module.exports = {
    connonsql
}