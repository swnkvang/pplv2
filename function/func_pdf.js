require('../config/lib')
const savefile = require('../function/func_savefile')
let jsReportInitialized = false;

var html_server_address = async function (server) {
    return new Promise(resolve => {
        const address = server.address()
        resolve(address)
    })
}

var base64_encode_v2 = async function (file_buffer) {
    return new Promise(resolve => {
        resolve(Buffer.from(file_buffer).toString('base64'))
    })
}

var create_html_server = async function (file_in) {
    return new Promise(resolve => {
        const server = http.createServer((req, res) => {
            res.setHeader('Content-Type', 'text/html')
            res.end(file_in)
        })
        resolve(server)
    })
}

var createfile_pdfsign_v1 = async function (pdfdata, hashpdf, pathbiz) {
    folder_name = uuid()
    file_name = uuid()
    var path = pathbiz + folder_name
    var path_pdf = pathbiz + folder_name + '/original/'
    var path_pdf_sign = pathbiz + folder_name + '/sign/'
    var path_data = pathbiz + folder_name
    var arr_pathpdf = [path_data, path_pdf, path_pdf_sign]
    for (i = 0; i < arr_pathpdf.length; i++) {
        var pathOf = arr_pathpdf[i]
        try {
            await savefile.createDir(pathOf)
        } catch (err) {
            console.error(err)
        }
    }
    try {
        var org_addressfile = path_pdf + file_name + '.txt'
        var hash_addressfile = path_pdf + file_name + '-hash.txt'
        var sign_addressfile = path_pdf_sign + file_name + '.txt'
        var hashsign_address = path_pdf_sign + file_name + '-hash.txt'
        // Write file original
        fs.writeFile(org_addressfile, pdfdata, function (err) {
            if (err) console.log(err)
        });
        // Write file original hash
        fs.writeFile(hash_addressfile, hashpdf, function (err) {
            if (err) console.log(err)
        });
        // Write file begin sign
        fs.writeFile(sign_addressfile, pdfdata, function (err) {
            if (err) console.log(err)
        });
        // Write file begin hashsign
        fs.writeFile(hashsign_address, hashpdf, function (err) {
            if (err) console.log(err)
        });
        return [200, {
            'path': path,
            'path_pdf': org_addressfile,
            'path_pdfhash': hash_addressfile,
            'path_pdfsign': sign_addressfile,
            'path_pdfhashsign': hashsign_address
        }]
    } catch (error) {
        console.log(error)
        return [400, error]
    }
}

var generatePdf_v4 = async function (file_in, landscape_status, paper_size) {
    let pdf_options = {
        printBackground: true,
        margin: {
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',
        },
        displayHeaderFooter: false,
    }
    if (landscape_status == 'true' || landscape_status == 'True') pdf_options.landscape = true
    else pdf_options.landscape = false

    switch (paper_size) {
        case 'A3':
            pdf_options.format = 'A3'
            break;
        case 'A4':
            pdf_options.format = 'A4'
            break;
        default:
            pdf_options.format = 'A4'
            break;
    }
    console.log('landscape_status: ', pdf_options.landscape)
    console.log('paper_size: ', pdf_options.format)

    let navigationTimeout = 0 // 1 min
    let browser_options = {
        headless: true,
        pipe: true,
        args: ['--no-sandbox']
    }

    if (process.platform !== 'win32') browser_options.executablePath = '/usr/bin/chromium-browser' // /bin/google-chrome''

    try {
        // add new page
        const server = await create_html_server(file_in)
        // Wait until server has started
        await new Promise((resolve, reject) => {
            server.on('error', reject)
            // Start server on random port
            server.listen(resolve)
        })
        const address = await html_server_address(server)
        const url = `http://localhost:${address.port}`
        console.log('port: ', address.port)
        const browser = await puppeteer.launch(browser_options)
        let page = await browser.newPage()
        await page.setViewport({
            width: 750,
            height: 600
        })

        // Navigate to the running HTTP server
        await page.goto(url, {
            timeout: navigationTimeout,
            waitUntil: 'networkidle0'
        })

        // await page.waitFor(500)
        // Get the PDF buffer of the current page with the given options
        const pdfBuffer = await page.pdf(pdf_options)

        // Wait until server and browser are closed
        await Promise.all([
            new Promise((resolve, reject) => server.close(resolve))
        ])
        // return pdfBuffer
        const base64String = await base64_encode_v2(pdfBuffer)
        // await fs.writeFileSync('tmp/' + uuidv4() + '.txt', base64String)
        // return { result: 'OK', message: base64String }
        return [true, base64String]
    } catch (error) {
        console.log('error', error)
        // process.exit(1)
        return [false, error]
    }
}

function checkIfJsReportIsInit() {

    if (!jsReportInitialized) {
        jsReportInitialized = true;
        return jsreport.init();
    }
    return Promise.resolve();
}

var generatePdf_v5 = async function (html, path_sign, status_path) {
    try {
        if (status_path) {
            html = await fs.readFileSync(path_sign, 'utf-8')
        }
        var result_pdf = await checkIfJsReportIsInit().then(() => {
            return jsreport.render({
                template: {
                    content: html,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf'
                },
                data: {
                    foo: "world"
                }
            }).then((resp) => {
                // prints pdf with headline Hello world
                // console.log(resp.content.toString())
                // fs.writeFileSync("666.pdf", resp.content, 'base64');
                var base64_str = (resp.content).toString('base64')
                return base64_str
            });
        }).catch((e) => {
            console.error(e)
        })
        return [true, result_pdf]
    } catch (error) {
        return [false, error]
    }

}

module.exports = {
    createfile_pdfsign_v1,
    generatePdf_v4,
    generatePdf_v5
}