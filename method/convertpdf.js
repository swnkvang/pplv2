require('../config/lib')
require('../config/global')

function create_html_server(file_in) {
    const http = require('http');
    return new Promise(resolve => {
        const server = http.createServer((req, res) => {
            res.setHeader('Content-Type', 'text/html')
            res.end(file_in)
        })
        resolve(server)
    })
}

function html_server_address(server) {
    return new Promise(resolve => {
        const address = server.address()
        resolve(address)
    })
}

function base64_encode_v2(file_buffer) {
    return new Promise(resolve => {
        resolve(Buffer.from(file_buffer).toString('base64'))
    })
}

const GenPdfV1 = async (file_in) => {
    try {
        const puppeteer = require('puppeteer');
        paper_size = 'A4'
        let pdf_options = {
            printBackground: true,
            margin: {
                left: '0px',
                top: '0px',
                right: '0px',
                bottom: '0px',
            },
            displayHeaderFooter: false,
            landscape: false
        }

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

        let navigationTimeout = 0 // 1 min
        // const PCR = require("puppeteer-chromium-resolver");
        // const stats = await PCR();
        let browser_options = {
            headless: true,
            pipe: true,
            args: ['--no-sandbox'],
            // executablePath: stats.executablePath
            executablePath: '/app/node_modules/chromium/lib/chromium/chrome-linux/chrome'
        }
        // if (process.platform !== 'win32') browser_options.executablePath = '/usr/bin/google-chrome-stable' 
        // browser_options.executablePath = '/app/node_modules/chromium/lib/chromium/chrome-linux/chrome' // /usr/bin/google-chrome /bin/google-chrome'' /usr/bin/chromium-browser /app/node_modules/chromium/lib/chromium/chrome-linux/chrome

        const server = await create_html_server(file_in)
        await new Promise((resolve, reject) => {
            server.on('error', reject)
            // Start server on random port
            server.listen(resolve)
        })
        const address = await html_server_address(server)
        const url = `http://localhost:${address.port}`
        const browser = await puppeteer.launch(browser_options);
        const page = await browser.newPage()
        await page.setViewport({
            width: 750,
            height: 600
        })
        await page.goto(url, {
            timeout: navigationTimeout,
            waitUntil: 'networkidle0'
        })

        // We set the page content as the generated html by handlebars
        // await page.setContent(file_in)
        const pdfBuffer = await page.pdf(pdf_options)
        // await browser.close();
        await Promise.all([
            new Promise((resolve, reject) => server.close(resolve))
        ])

        const base64String = await base64_encode_v2(pdfBuffer)
        return {
            status: true,
            message: "Gen PDF Success",
            data: base64String
        }
    } catch (error) {
        console.log(error)
        return {
            status: false,
            message: error.message,
            data: null
        }
    }
};

module.exports = {
    GenPdfV1
}