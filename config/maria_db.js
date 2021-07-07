// const querySql = async (dbconfig, sql) => {
//   var cluster = mariadb.createPoolCluster({
//     removeNodeErrorCount: 20,
//     restoreNodeTimeout: 5000
//   });
//   let tax_id = dbconfig.t
//   let detail = dbconfig.d[0].sql
//   let dbname = detail.db
//   let ipaddress = detail.ip
//   let user = detail.us
//   let ps = detail.ps
//   let po = detail.po
//   let detail2 = dbconfig.d[1].sql
//   let dbname2 = detail2.db
//   let ipaddress2 = detail2.ip
//   let user2 = detail2.us
//   let ps2 = detail2.ps
//   let po2 = detail2.po
//   database = dbname
//   database2 = dbname2
//   cluster.add("master", {
//     host: ipaddress,
//     user: user,
//     password: ps,
//     database: database,
//     port: po
//   });
//   cluster.add("master2", {
//     host: ipaddress2,
//     user: user2,
//     password: ps2,
//     database: database,
//     port: po2
//   });
//   let getData = await cluster.of('master*', 'RANDOM').getConnection()
//     .then(conn => {
//       return conn.query(sql)
//         .then(row => {
//           return row;
//         })
//         .finally(() => {
//           conn.release()
//             .then(() => {
//               // console.log("connection release success")
//             })
//             .catch(err => {
//               console.log("connection release fail :" + err)
//               //connection was closed but not due of current end command
//             })
//           cluster.end().then(() => {
//               // console.log("cluster end success")
//             })
//             .catch(err => {
//               console.log("cluster end fail :" + err)
//               //connection was closed but not due of current end command
//             });
//         });
//     });
//   return getData
// }

async function querySql(dbconfig, query) {
  try {
    var poolCluster = null
    let tax_id = dbconfig.t
    let detail = dbconfig.d[0].sql
    let dbname = detail.db
    let ipaddress = detail.ip
    let user = detail.us
    let ps = detail.ps
    let po = detail.po
    let detail2 = dbconfig.d[1].sql
    let dbname2 = detail2.db
    let ipaddress2 = detail2.ip
    let user2 = detail2.us
    let ps2 = detail2.ps
    let po2 = detail2.po
    var config = {
      host: ipaddress,
      user: user,
      password: ps,
      database: dbname,
      port: po
    }
    var configSlave = {
      host: ipaddress2,
      user: user2,
      password: ps2,
      database: dbname2,
      port: po2
    }
    return new Promise(function (resolve, reject) {
      poolCluster = mysql.createPoolCluster({
        removeNodeErrorCount: 20,
        restoreNodeTimeout: 5000
      });
      poolCluster.add('MASTER', config);
      poolCluster.add('SLAVE1', configSlave);
      poolCluster.add('SLAVE2', configSlave);
      poolCluster.of('*', 'ORDER').getConnection(async function (err, con) {
        // console.log(con.config.database);
        // console.log(con);
        if (err != null) {
          // fail
          console.log('ERROR');
          console.log(err);
          resolve(err);
        }
        var Data = await queryExec(con, query)
        // await conRelease(con)
        await poolCluster.end(function (err) {
          if (err) {
            console.log(err)
          }
        });
        resolve(Data);
      });
    });
  } catch (error) {
    console.log(error)
  }

}

async function queryExec(con, query, params, callback) {
  return new Promise(function (resolve, reject) {
    con.query(query, function (err, rows) {
      console.log(err)
      resolve(rows);
    });
  })
}

async function conRelease(con) {
  con.release();
}


module.exports = {
  querySql
}