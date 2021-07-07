require('../config/global')
global.express = require("express"); 
if (envprofile==="production"){
    global.sodium_ppl = require('sodium_token_ppl');
}else{
    global.sodium_ppl = require('sodium_token_ppl_poc');
}
global.mongoose = require('mongoose');
global.Schema = mongoose.Schema
global.expressWinston = require('express-winston');
global.axios = require('axios');
global.crypto = require('crypto');
global.bodyParser = require('body-parser')
global.compression = require('compression')
global.jwt_decode = require('jwt-decode')
global.jwt = require('jsonwebtoken');
global.jwt_service = require('jwt-simple');
global.mariadb = require('mariadb');
global.util = require('util')
global.randomInt = require('random-int');
global.randomstring = require("randomstring");
global.randomChoice = require('random-choice');
global.uuid = require('uuid/v4');
global.FormData = require('form-data');
global.multer = require('multer');
// global.fs = require('fs');
// global.fs = require('fs-extra');
global.fs = require('fs');
global.fsPromises = fs.promises;
global.mkdirp = require('mkdirp')
global.cors = require('cors')
global.timemoment = require('moment');
global.jsreport = require('jsreport-core')()
global.winston = require('winston');
global.swaggerUi = require('swagger-ui-express');
global.swaggerDocument = require('../swagger.json');
global.pdf_parse = require('pdf-parse');
global.Client = require('ssh2-sftp-client');
global.Queue = require('better-queue');
global.mysql = require("mysql");
global.schedule = require('node-schedule');
global.ExcelJS = require('exceljs');
global.parser = new (require('simple-excel-to-json').XlsParser)();
global.upload = multer();
global.nodemailer = require("nodemailer");
global.AdmZip = require('adm-zip');
global.archiver = require('archiver');
global.mssql = require('mssql');


