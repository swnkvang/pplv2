require('../config/lib')
require('../config/global')

const createFile = async (path, somePath, file_name, type, data) => {
    try {
        if (file_name == null) file_name = uuid()
        var pathOne = path
        if (path != null && somePath != null) path = path + somePath
        // if (path == null && somePath != null) path = GLOBAL_VALUE.PREFIX_PATH + '/storage/' + somePath + '/'
        var sumPath = path
        var sumPath_file = path + file_name + '.' + type
        if (type == null) sumPath_file = path + file_name
        await createDir(sumPath)
        if (!fs.existsSync(sumPath_file)) {
            sumPath_file = sumPath_file
        } else {
            var now = Number(new Date)
            if (type !== null) {
                file_name_new = file_name + '_' + now + '.' + type
            } else {
                file_name_split = file_name.split(".")
                len_file = file_name_split.length
                if (file_name_split.length == 2) {
                    file_name_new = file_name_split[0] + '_' + now + '.' + file_name_split[1]
                } else {
                    var index_type = len_file - 1
                    file_name_new = file_name_split[0] + '_' + now + '.' + file_name_split[index_type]
                }
            }
            sumPath_file = path + file_name_new
        }
        if (typeof data === "string") {
            await fsPromises.writeFile(sumPath_file, data, function (err) {
                if (err) {
                    console.log(err)
                    return [false, err];
                }
                console.log("The file was saved!");
            });
        } else {
            await fsPromises.writeFile(sumPath_file, data, "binary", function (err) {
                if (err) {
                    console.log(err)
                    return [false, err];
                }
                console.log("The file was saved!");
            });
        }

        return [true, sumPath_file, sumPath, pathOne]
    } catch (error) {
        console.log(error)
        return [false, error]
    }
};

const createDir = async (dir) => {
    await fsPromises.mkdir(dir, {
            recursive: true
        }).then(result => {
            // console.log('Folders created!');
        })
        .catch(err => {
            console.error(err);
        });
};

const save_log_system = async (json_data, tax_id) => {
    try {
        let date_str = timemoment().format('YYYY-MM-DD')
        let time_str = (timemoment().format('HH')) + '.00' + '-' + (timemoment().format('HH')) + '.59'
        let path_folder = path_local + '/logger/' + '/' + tax_id + '/' + date_str + '/' + time_str + '/'
        resulr_create_fol = await createDir(path_folder)
        var file_in_fol = fs.readdirSync(path_folder)
        var file_name = 'log_1'
        if (file_in_fol.length == 0) {
            var file_in_fol = [file_name]
        }
        var num_fol = (file_in_fol.length) - 1
        try {
            var path_save = path_folder + file_in_fol[num_fol].split('.')[0] + '.json'
            var stats = fs.statSync(path_save)
            var fileSize = (stats.size) / (1024 * 1024)

            if (fileSize < 10) { // LIMIT FILE 10 MB
                // result_save_file = await fsPromises.appendFile(path_save, (',' + JSON.stringify(json_data)), function (err) {
                //     if (err) {
                //         console.log(err)
                //         return [false, err];
                //     }
                //     console.log("The file was saved!");
                // });
                result_save_file = await fs.appendFileSync(path_save, (',' + JSON.stringify(json_data)))
            } else {
                var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number);
                var number_name = Number(numbers[0]) + 1
                var file_name_new = 'log_' + number_name
                path_save_more = path_folder + file_name_new + '.json'
                // result_save_file = await fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)), function (err) {
                //     if (err) {
                //         console.log(err)
                //         return [false, err];
                //     }
                //     console.log("The file was saved!");
                // });
                result_save_file = await fs.appendFileSync(path_save_more, (JSON.stringify(json_data)))
            }
        } catch (error) {
            fileSize = 0
            if (fileSize < 10) { // LIMIT FILE 10 MB
                // result_save_file = await fsPromises.appendFile(path_save, (JSON.stringify(json_data)), function (err) {
                //     if (err) {
                //         console.log(err)
                //         return [false, err];
                //     }
                //     console.log("The file was saved!");
                // });
                result_save_file = await fs.appendFileSync(path_save, (JSON.stringify(json_data)))
            } else {
                var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number);
                var number_name = Number(numbers[0]) + 1
                var file_name_new = 'log_' + number_name
                path_save_more = path_folder + file_name_new + '.json'
                // result_save_file = await fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)), function (err) {
                //     if (err) {
                //         console.log(err)
                //         return [false, err];
                //     }
                //     console.log("The file was saved!");
                // });
                await fs.appendFileSync(path_save_more, (JSON.stringify(json_data)))
            }

        }
    } catch (error) {
        console.log(error)
    }
};

const readFile = async (pathRead) => {
    return new Promise((resolve, reject) => {
        fsPromises.readFile(pathRead, 'utf8').then(result => {
                resolve([200, result]);
            })
            .catch(err => {
                resolve([400, err]);
            });
    });
};


const createFileBase64 = async (path, file_name, type, data) => {
    if (file_name == null) file_name = uuid()
    var pathOne = path
    if (path != null) path = path
    if (path == null) path = GLOBAL_VALUE.PREFIX_PATH + '/storage/'
    var sumPath = path
    var sumPath_file = path + file_name + '.' + type
    if (type == null) sumPath_file = path + file_name
    await createDir(sumPath)
    await fsPromises.writeFile(sumPath_file, data, 'base64', function (err) {
        if (err) {
            console.log(err)
            return (err);
        }
        console.log("The file was saved!");
    });
    return [sumPath_file, sumPath, pathOne]
};

const RemoveFileInDir = async (File) => {
    return new Promise((resolve, reject) => {
        fs.unlink(File, (err) => {
            if (err) {
                resolve([400]);
            }
            resolve([200]);
        });
    })
}

const RemoveDir = async (File) => {
    return new Promise((resolve, reject) => {
        fs.rmdirSync(File, {
            recursive: true
        }, (err) => {
            if (err) {
                console.log(err)
                resolve([400]);
            }
            resolve([200]);
        });
    })
}

var counter = new Queue(async function (data_queue, cb) {
    var json_data = data_queue.json_data
    var tax_id = data_queue.tax_id
    let date_str = timemoment().format('YYYY-MM-DD')
    let time_str = (timemoment().format('HH')) + '.00' + '-' + (timemoment().format('HH')) + '.59'
    let path_folder = path_local + '/logger' + '/' + tax_id + '/' + date_str + '/' + time_str + '/'
    resulr_create_fol = await createDir(path_folder)
    var file_in_fol = fs.readdirSync(path_folder)
    var file_name = 'log_1'
    var fileSize = null
    var list_number = []
    if (file_in_fol.length == 0) {
        var file_in_fol = [file_name]
    }
    // var num_fol = (file_in_fol.length)-1
    file_in_fol.forEach(element =>
        list_number.push((element.match(/\d+/g).map(Number))[0])
    );
    var much_num_file = Math.max(...list_number)
    // var numbers_test = file_in_fol[num_fol].match(/\d+/g).map(Number)
    // var num_fol = (file_in_fol.length)-1
    var num_fol = much_num_file
    try {
        // var path_save = path_folder + file_in_fol[num_fol].split('.')[0] + '.log'
        var path_save = path_folder + 'log_' + num_fol + '.log'
        var stats = fs.statSync(path_save)
        var fileSize = (stats.size) / (1024 * 1024)

        if (fileSize < 10) { // LIMIT FILE 10 MB
            // var result_save_file = await fsPromises.appendFile(path_save, (',' + JSON.stringify(json_data)))
            // var data = await fs.readFileSync(path_save, 'utf-8');
            // var json = JSON.parse(data);
            // // console.log('json_data:',json_data)
            // // console.log('json:',json)
            // json.push(json_data)
            // var result_save_file = await fs.writeFileSync(path_save, JSON.stringify(json), 'utf8')

            var result_save_file = await fs.appendFileSync(path_save, (',' + JSON.stringify(json_data)), 'utf8')
            // counter.push({ id: 'orange', count: 1 });
        } else {
            var list_data = []
            // var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number); 
            // console.log('num_fol',num_fol)
            // console.log('file_in_fol[num_fol]:',file_in_fol)
            // var number_name = Number(numbers[0])+1
            num_fol = num_fol + 1
            var file_name_new = 'log_' + num_fol
            path_save_more = path_folder + file_name_new + '.log'
            // list_data.push((json_data))
            // var result_save_file = await fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)))
            // var result_save_file = await fs.appendFileSync(path_save_more, (JSON.stringify(list_data)), 'utf8')
            var result_save_file = await fs.appendFileSync(path_save_more, (JSON.stringify(json_data)), 'utf8')
        }
    } catch (error) {
        // fileSize = 0
        // console.log('error:',error)
        if (fileSize == null) { // LIMIT FILE 10 MB
            var list_data = []
            // list_data.push((json_data))
            // console.log('list_data:',list_data)
            // var result_save_file = fsPromises.appendFile(path_save, (JSON.stringify(json_data)))
            // var result_save_file = await fs.appendFileSync(path_save, JSON.stringify(list_data), 'utf8')
            var result_save_file = await fs.appendFileSync(path_save, JSON.stringify(json_data), 'utf8')

        } else if (fileSize < 10) {
            // var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number);
            // var number_name = Number(numbers[0])+1
            // var file_name_new = 'log_' + number_name
            // path_save_more = path_folder + file_name_new + '.log'
            // var result_save_file = fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)))
            var result_save_file = await fs.appendFileSync(path_save, (',' + JSON.stringify(json_data)), 'utf8')

            // var data = await fs.readFileSync(path_save, 'utf-8');
            // var json = JSON.parse(data);
            // // console.log('json_data:',json_data)
            // // console.log('json:',json)
            // json.push(json_data)
            // var result_save_file = await fs.writeFileSync(path_save, JSON.stringify(json), 'utf8')
        } else if (fileSize > 10) {
            // var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number);
            // var number_name = Number(numbers[0])+1
            // var file_name_new = 'log_' + number_name
            num_fol = num_fol + 1
            var file_name_new = 'log_' + num_fol
            path_save_more = path_folder + file_name_new + '.log'
            // var result_save_file = fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)))
            var result_save_file = await fs.appendFileSync(path_save_more, (JSON.stringify(json_data)), 'utf8')
        }
    }
    cb();
}, {
    afterProcessDelay: 1500
})

const save_log_system_v2 = async (json_data_in, tax_id_in) => {
    try {
        var data_queue = {
            json_data: json_data_in,
            tax_id: tax_id_in
        }
        counter.push(data_queue);
        // console.log('counter:',counter)

    } catch (error) {
        console.log(error)
    }
};

const save_log_system_v2_old = async (json_data, tax_id) => {
    try {
        var _queue = Promise.resolve();
        var list_number = []
        let date_str = timemoment().format('YYYY-MM-DD')
        let time_str = (timemoment().format('HH')) + '.00' + '-' + (timemoment().format('HH')) + '.59'
        let path_folder = path_local + '/logger/' + tax_id + '/' + date_str + '/' + time_str + '/'
        resulr_create_fol = await createDir(path_folder)
        var file_in_fol = fs.readdirSync(path_folder)
        var file_name = 'log_1'
        if (file_in_fol.length == 0) {
            var file_in_fol = [file_name]
        }
        file_in_fol.forEach(element =>
            list_number.push((element.match(/\d+/g).map(Number))[0])
        );
        var much_num_file = Math.max(...list_number)
        // var numbers_test = file_in_fol[num_fol].match(/\d+/g).map(Number)
        // var num_fol = (file_in_fol.length)-1
        var num_fol = much_num_file
        // console.log('num_fol:',num_fol)
        try {
            // var path_save = path_folder + file_in_fol[num_fol].split('.')[0] + '.json'
            var path_save = path_folder + 'log_' + num_fol + '.json'
            // console.log('path_save:',path_save)
            var stats = fs.statSync(path_save)
            var fileSize = (stats.size) / (1024 * 1024)

            if (fileSize < 10) { // LIMIT FILE 10 MB
                // _queue = _queue.then(function(){
                //     return new Promise(function(resolve){ 
                //         result_save_file = fsPromises.appendFile(path_save, (','+ JSON.stringify(json_data)), function (err) {
                //             if (err) {
                //                 console.log(err)
                //                 return [false,err];
                //             }
                //             else resolve();
                //         console.log("The file was saved!");
                //         })
                //     })
                // })
                var result_save_file = await fs.appendFileSync(path_save, (',' + JSON.stringify(json_data)))
            } else {
                // var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number);
                // console.log('numbers:',numbers)
                // var number_name = Number(numbers[0])+1
                // console.log('number_name:',number_name)
                num_fol = num_fol + 1
                var file_name_new = 'log_' + num_fol
                path_save_more = path_folder + file_name_new + '.json'
                // _queue = _queue.then(function(){
                //     return new Promise(function(resolve){ 
                //         result_save_file = fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)), function (err) {
                //             if (err) {
                //                 console.log(err)
                //                 return [false,err];
                //             }
                //             else resolve();
                //         console.log("The file was saved!");
                //         })
                //     })
                // })
                var result_save_file = await fs.appendFileSync(path_save_more, (JSON.stringify(json_data)))
            }
        } catch (error) {
            fileSize = 0
            if (fileSize < 10) { // LIMIT FILE 10 MB
                // _queue = _queue.then(function(){
                //     return new Promise(function(resolve){ 
                //         result_save_file = fsPromises.appendFile(path_save, (JSON.stringify(json_data)), function (err) {
                //             if (err) {
                //                 console.log(err)
                //                 return [false,err];
                //             }
                //             else resolve();
                //         console.log("The file was saved!");
                //         })
                //     })
                // })
                var result_save_file = fs.appendFileSync(path_save, (JSON.stringify(json_data)))
            } else {
                // var numbers = file_in_fol[num_fol].match(/\d+/g).map(Number);
                // var number_name = Number(numbers[0])+1
                // var file_name_new = 'log_' + number_name
                num_fol = num_fol + 1
                var file_name_new = 'log_' + num_fol
                path_save_more = path_folder + file_name_new + '.json'
                // _queue = _queue.then(function(){
                //     return new Promise(function(resolve){ 
                //         result_save_file = fsPromises.appendFile(path_save_more, (JSON.stringify(json_data)), function (err) {
                //             if (err) {
                //                 console.log(err)
                //                 return [false,err];
                //             }
                //             else resolve();
                //         console.log("The file was saved!");
                //         })
                //     })
                // })
                var result_save_file = fs.appendFileSync(path_save_more, (JSON.stringify(json_data)))
            }

        }
    } catch (error) {
        console.log(error)
    }
};


module.exports = {
    createFile,
    createDir,
    save_log_system,
    readFile,
    createFileBase64,
    RemoveFileInDir,
    save_log_system_v2,
    RemoveDir
}