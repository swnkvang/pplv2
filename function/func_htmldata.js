require('../config/lib')
const condition = require('../method/conditon')
const sign_process = require('../method/sign_process')
const func_pdf = require('../function/func_pdf')
const html_to_pdf = require('../method/htmltopdf')
const func_datetime = require('../function/func_datetime')
const func_hash = require('../function/func_hash')

const stringAfter = async (string, item) => {
    var strafter = string.substring(string.indexOf(item) + 1);
    return strafter;
}
const wordAfter = async (string, item) => {
    var strbefore = string.split(item)[1];
    return strbefore;
}

const stringBefore = async (string, item) => {
    var strbefore = string.split(item)[0];
    return strbefore;
}

const replaceComma = async (value) => {
    var text = String(value)
    try {
        var before_period = await stringBefore(text, '.')
        var after_period = await wordAfter(text, '.')
        if (after_period == null) {
            text = text.replace(/(?!-)[^0-9.]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        } else {
            before_period = before_period.replace(/(?!-)[^0-9.]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            text = before_period + "." + after_period
        }
    } catch (error) {
        console.log(error)
    }
    return text
}

const htmlCalData = async (cal) => {
    try {
        var sum_average_internal_factor = 0
        var sum_average_External_factor = 0
        var sum_average_External_factor_02 = 0
        var sum_average_Sale_factor = 0
        var DateToday = timemoment().format("YYYY-MM-DD");
        var Sum_New_Service = 0
        var Sum_new_customer = 0
        var Sum_Renewal = 0
        var Sum_Renewal_Change = 0
        var Sum_Change = 0
        var average_internal_factor = ""
        var average_External_factor = ""
        var average_External_factor_02 = ""
        var average_Sale_factor = ""
        var Sum_Total_Revenue_Month = 0
        var Sum_Total_ActualCost = 0
        var Sum_Total_Actual = 0
        var Sum_Internal = 0
        var Sum_External_JV = 0
        var Sum_External = 0
        var Sum_Total_EngCost = 0
        var Sum_Total_Revenue = 0
        var CountDocument = cal.length
        for (let i = 0; i < cal.length; i++) {
            const cal_element = cal[i];
            var Int_INET = ""
            var Total_ActualCost = ""
            var Total_Actual = ""
            var Total_External_JV = ""
            var Total_External = ""
            var Total_Revenue = ""
            var Month = ""
            var Total_EngCost = ""
            var Total_Revenue_Month = ""
            var Job_Status = ""
            var total_internal = ""
            var InputArray = cal_element.input_data
            for (let j = 0; j < InputArray.length; j++) {
                const InputArray_element = InputArray[j];
                var lowerKey = String(InputArray_element.key).toLowerCase()
                var valueKey = String(InputArray_element.value)
                if (lowerKey == "int_inet") {
                    Int_INET = valueKey
                    // console.log(Sum_Internal)
                    // Sum_Internal = parseFloat(parseFloat(Sum_Internal) + parseFloat(Int_INET).toFixed(2)).toFixed(2)
                }
                if (lowerKey == "total_internal") {
                    total_internal = valueKey
                    Sum_Internal = parseFloat(Sum_Internal) + parseFloat(total_internal)
                }
                if (lowerKey == "total_actualcost") {
                    Total_ActualCost = valueKey
                    Sum_Total_ActualCost = parseFloat(Sum_Total_ActualCost) + parseFloat(Total_ActualCost)
                }
                if (lowerKey == "total_actual") {
                    Total_Actual = valueKey
                    Sum_Total_Actual = parseFloat(Sum_Total_Actual) + parseFloat(Total_Actual)
                }
                if (lowerKey == "total_external(jv)") {
                    Total_External_JV = valueKey
                    Sum_External_JV = parseFloat(Sum_External_JV) + parseFloat(Total_External_JV)
                }
                if (lowerKey == "total_external") {
                    Total_External = valueKey
                    Sum_External = parseFloat(Sum_External) + parseFloat(Total_External)
                }
                if (lowerKey == "total_revenue") {
                    Total_Revenue = valueKey
                    Sum_Total_Revenue = parseFloat(Sum_Total_Revenue) + parseFloat(Total_Revenue)
                }
                if (lowerKey == "revenue_month") {
                    Total_Revenue_Month = valueKey
                    Sum_Total_Revenue_Month = parseFloat(Sum_Total_Revenue_Month) + parseFloat(Total_Revenue_Month)
                }
                if (lowerKey == "total_engcost") {
                    Total_EngCost = valueKey
                    Sum_Total_EngCost = parseFloat(Sum_Total_EngCost) + parseFloat(Total_EngCost)
                }
                if (lowerKey == "job_status") {
                    Job_Status = String(valueKey).toLowerCase()
                }
            }
            average_internal_factor = parseFloat(parseFloat(Int_INET) / parseFloat(Total_ActualCost)).toFixed(2)
            average_External_factor = parseFloat(parseFloat(Total_External_JV) / parseFloat(Total_ActualCost)).toFixed(2)
            average_External_factor_02 = parseFloat(parseFloat(Total_External) / parseFloat(Total_ActualCost)).toFixed(2)
            average_Sale_factor = parseFloat(parseFloat(Total_Revenue_Month) / parseFloat(Total_EngCost)).toFixed(2)
            sum_average_External_factor = parseFloat(parseFloat(sum_average_External_factor) + parseFloat(average_External_factor)).toFixed(4)
            sum_average_External_factor_02 = parseFloat(parseFloat(sum_average_External_factor_02) + parseFloat(average_External_factor_02)).toFixed(4)
            sum_average_Sale_factor = parseFloat(parseFloat(sum_average_Sale_factor) + parseFloat(average_Sale_factor)).toFixed(2)
            if (Job_Status.includes("new service")) {
                Sum_New_Service = Sum_New_Service + 1
            } else if (Job_Status.includes("new customer")) {
                Sum_new_customer = Sum_new_customer + 1
            } else if (Job_Status.includes("renewal")) {
                Sum_Renewal = Sum_Renewal + 1
            } else if (Job_Status.includes("renewal&change")) {
                Sum_Renewal_Change = Sum_Renewal_Change + 1
            } else if (Job_Status.includes("change")) {
                Sum_Change = Sum_Change + 1
            }
        }
        sum_average_internal_factor = parseFloat(Sum_Internal / Sum_Total_Actual).toFixed(4)
        sum_average_External_factor = parseFloat(Sum_External_JV / Sum_Total_Actual).toFixed(4)
        sum_average_External_factor_02 = parseFloat(Sum_External / Sum_Total_Actual).toFixed(4)
        sum_average_Sale_factor = parseFloat(Sum_Total_Revenue_Month / Sum_Total_EngCost).toFixed(2)
        Sum_Total_ActualCost = Sum_Total_ActualCost.toFixed(2)
        Sum_Total_Revenue_Month = Sum_Total_Revenue_Month.toFixed(2)
        var json = {
            type: [{
                newcustomer: Sum_new_customer
            }, {
                newservice: Sum_New_Service
            }, {
                renewal: Sum_Renewal
            }, {
                renewalchange: Sum_Renewal_Change
            }, {
                change: Sum_Change
            }],
            date: DateToday,
            value: [{
                totalactualcostmonth: await replaceComma(Sum_Total_ActualCost)
            }, {
                totalrevenuemonth: await replaceComma(Sum_Total_Revenue_Month)
            }, {
                averagesalefactor: sum_average_Sale_factor
            }, {
                averageinternalfactor: sum_average_internal_factor
            }, {
                averageexternaljvfactor: sum_average_External_factor
            }, {
                averageexternalfactor: sum_average_External_factor_02
            }]

        }
        var txt = `<!DOCTYPE html>
        <html>
        <meta charset='UTF-8'>
        <link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'>
        <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'>
        <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.6.3/css/all.css'
            integrity='sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/' crossorigin='anonymous'>
        <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Sarabun:300,400,500,700|Material+Icons'>
        <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js'></script>
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js'></script>
        <style>
            .w4 {
                background-color: #19625D;
            }
        
            table {
                border-collapse: collapse;
                border-spacing: 0;
                width: 100%;
                border: 1px solid #ddd;
            }
        
            body {
                font-family: Sarabun;
            }
        </style>
        
        <head>
            <script type='text/javascript' src='https://www.gstatic.com/charts/loader.js'></script>
            <script type='text/javascript'>
                google.charts.load('current', {
                    packages: ['corechart']
                });
                google.charts.setOnLoadCallback(drawChart);

                function drawChart() {
                    var data = google.visualization.arrayToDataTable([
                        ['color', 'closshet '],
                        ['New Customer', ` + Sum_new_customer + `],
                        ['New Service', ` + Sum_New_Service + `],
                        ['Renewal', ` + Sum_Renewal + `],
                        ['Renewal&Change', ` + Sum_Renewal_Change + `],
                        ['Change', ` + Sum_Change + `]
                    ]);
                    var options = {
                        legend: 'none',
                        legend: {
                            position: 'bottom'
                        },
                        fontSize: 20,
                        is3D: true,
                        pieSliceText: 'value-and-percentage',
                        colors: ['#F08E3A', '#F4B41A', '#E15D5D', '#5E7590', '#5BB381'],
                        chartArea: {
                            top: 10,
                            width: '100%',
                            height: '83%'
                        },
                    };
                    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                    chart.draw(data, options);
                }
            </script>
        </head>
        
        <body>
            <div class='w3'>
                <div style='background-color:#F49393' class='w-bar w3-wide text-black'>
                    <center>
                        <h1 class='font-weight-bolder ' style='font-size:2vw;padding: 10px;font-family:Sarabun;'>Cost Sheet as
                            of ` + DateToday + `</h1>
                    </center>
                </div>
                <div class='container '></div>
                <div class='row' style='text-align: center;'>
                    <div class='col-sm-4'>
                        <div class='container h2'>
                            <div style='background-color:#D5D5D5;font-size:2vw ;' class='container card h2'>Total Revenue /
                                Month</div>
                            <div style='background-color:#FFFFFF;font-size:2vw;border: 3px solid black;'
                                class='container card h2'>` + await replaceComma(Sum_Total_Revenue_Month) + `</div>
                            <div style='background-color:#D5D5D5;font-size:2vw;' class='container  card h2'>Total Actual Cost /
                                Month</div>
                            <div style='background-color:#FFFFFF;font-size:2vw;border: 3px solid black;'
                                class='container card h2'>` + await replaceComma(Sum_Total_ActualCost) + `</div>
                            <div style='background-color:#D5D5D5;font-size:1.9vw;' class='container card h2'>Average Sale Factor
                            </div>
                            <div style='background-color:#FFFFFF;font-size:2vw;border: 3px solid black;'
                                class='container card h2'>` + sum_average_Sale_factor + `</div>
                        </div>
                    </div>
                    <div id='piechart' class='col-sm-4 container'></div>
                    <div class='col-sm-4'>
                        <div class='container h2'>
                            <div style='background-color:#D5D5D5;font-size:2vw ;' class='container card h2'>Average Internal
                                Factor</div>
                            <div style='background-color:#FFFFFF;font-size:2vw;border: 3px solid black;'
                                class='container card h2'>` + sum_average_internal_factor + `</div>
                            <div style='background-color:#D5D5D5;font-size:2vw;' class='container  card h2'>Average External JV
                                Factor</div>
                            <div style='background-color:#FFFFFF;font-size:2vw;border: 3px solid black;'
                                class='container card h2'>` + sum_average_External_factor + `</div>
                            <div style='background-color:#D5D5D5;font-size:2vw;' class='container card h2'>Average External
                                Factor</div>
                            <div style='background-color:#FFFFFF;font-size:2vw;border: 3px solid black;'
                                class='container card h2'>` + sum_average_External_factor_02 + `</div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        
        </html>`
        txt = txt.replace(/\n/g, ' ');
        return [true, txt, json]
    } catch (error) {
        console.log(error)
        return [false]
    }
};

module.exports = {
    htmlCalData
}