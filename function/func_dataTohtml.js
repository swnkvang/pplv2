//เปลี่ยนทศนิยม
function genHtmlCs(data,  document_id, ref_qt) {
  try {
    // data = dataCs //เอาออกด้วย
    var docData = dataToJsonKey(data,'CS')
    var doc_no = document_id // อย่าลืมแทนด้วยเลย CS
    docData['Ref_Qt'] = ref_qt //ทำเป็น string ด้วย 
    var isNextPage = false
    var tempService = docData['Service']
    if(tempService.length < 12) {
      var diffLen = 12 - tempService.length
      for(let i = 0; i< diffLen; i++) {
        tempService.push({
          value: ''
        })
      }
    }
    //Page1
    var html = ` <head><meta charset='utf-8'></head>` //header
    var row = 15
    html += `<body style='background-color:white; margin:0;'>` //open body tag
    html += `<div class='paper_size'><div class='paper_set'>` //open size and set
    //In Page
    html += `<div class='img_size'><img src='https://ca.inet.co.th/inetca/assets/inetlogo.png' width='150' height='75' /></div>`
    //Head zone
    html += `<div class='title_head'>
                <div>
                  <div class='doc_form pos_between'><b>เอกสารสนับสนุน (แบบฟอร์ม)</b></div>
                  <div class='doc_form pos_between'><b>หัวข้อ : Cost sheet and Sales Order</b></div>
                  <div class='doc_form pos_between'><b>หน่วยงาน : ส่วนงานสนับสนุนการขาย</b></div>
                </div>
                <div>
                  <div class='doc_form pos_between1'><b>รหัสเอกสาร :</b></div>
                  <div class='doc_form pos_between1'><b>เลขที่เอกสาร :</b></div>
                  <div class='doc_form pos_between1'><b>วันที่บังคับใช้ :</b></div>
                </div>
                <div>
                  <div class='doc_form top_pos'>FM-SALE-PPL-001</div>
                  <div class='doc_form top_pos'>${doc_no}</div>
                  <div class='doc_form top_pos'>29 กรกฎาคม พ.ศ.2563</div>
                </div>
              </div>`
      //Top Fill zone
    html += `<div class='setting_paper set_top_table'>
                  <div class='display_body doc_type doc_size' width='100%'>
                    <div class='customer_details'><b><u>ประเภทเอกสาร</u></b></div><div class='atocom_pletes'>${docData['Doc_Type']}</div>
                    <div class='tab_null'><b>CVM ID :</b></div><div class='cvm_id'>${docData['cvm_id']}</div>
                    <div class='tab_null'><b>Quotation Ref No.</b></div><div class='quotation td_center'>${docData['Ref_Qt']}</div>
                  </div>

                  <div class='size_pos_top display_body doc_type'>
                    <div class='tab_null'><b><u>รายละเอียดลูกค้า</u></b>&nbsp&nbspCustomer ID:</div><div class='company_user td_center'>${docData['CusID']}</div>
                    <div class='tab_null'>ชื่อบริษัทลูกค้า : (ไทย) </div><div class='display_margin name_company_th'>${docData['Cusname_thai']}</div>
                    <div class='tab_null'>ชื่อบริษัทลูกค้า : (อังกฤษ) </div><div class='name_company_en'>${docData['Cusname_Eng']}</div>
                  </div>
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div>Sites/Building:</div><div class='display_margin_sites l_margin'>${docData['Sites/Building']}</div>
                    <div class='tab_null'>ประเภทธุรกิจ: </div><div class='type_bus'>${docData['Business_type']}</div>
                  </div>
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'>ที่อยู่จดทะเบียน :</div><div class='display_margin_sites'>${docData['Address']}</div>
                    <div class='tab_null'>โทรศัพท์ : </div><div class='tel_display_margin td_center'>${docData['CusTel']}</div>
                    <div class='tab_null'>อีเมล : </div><div class='email_display_margin td_center'>${docData['Cus_E-mail']}</div>
                  </div>
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div>ชื่อ-นามสกุล จนท.ด้านเทคนิค : </div><div class='display_margin_technical margin_l'>${docData['Technicain_Name']}</div>
                    <div class='tab_null'>ตำแหน่ง : </div><div class='status_display_margin td_center'>${docData['Technicain_Position']}</div>
                    <div class='tab_null'>โทรศัพท์ : </div><div class='tel_display_margin td_center'>${docData['Technicain_Tel']}</div>
                    <div class='tab_null'>อีเมล : </div><div class='email_display_margin td_center'>${docData['Technicain_E-mail']}</div>
                  </div>
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'>ชื่อ-นามสกุล เจ้าหน้าที่ด้านการเงิน : </div><div class='display_margin_technical'>${docData['Financial_Name']}</div>
                    <div class='tab_null'>ตำแหน่ง : </div><div class='status_display_margin td_center'>${docData['Financial_Position']}</div>
                    <div class='tab_null'>โทรศัพท์ : </div><div class='tel_display_margin td_center'>${docData['Financial_Tel']}</div>
                    <div class='tab_null'>อีเมล : </div><div class='email_display_margin td_center'>${docData['Financial_E-mail']}</div>
                  </div><br />

                  <div class='size_pos_top display_body doc_type'>
                    <div class='customer_details'><b><u>รายละเอียด Job Order</u></b></div><div>Job No. :</div>
                  </div><br />
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'><b>Status : </b></div><div class='display_margin_s'>${docData['Job_Status']}</div>`
                    if(docData['Staging_to_Order']) {
                      html += `<div class='tab_null'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div><div>Staging to Order (ลูกค้าทดสอบระหว่างติดตั้งก่อนใช้บริการจริง)</div>`
                    } else {
                      html += `<div class='tab_null'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div>Staging to Order (ลูกค้าทดสอบระหว่างติดตั้งก่อนใช้บริการจริง)</div>`
                    }
                  html += `</div><br />
                  <div class='display_body doc_type'>
                    <div class='display_margin_ato'></div><div>${docData['Staging_to_Order']}</div>
                  </div><br />
                  <div class='display_body doc_type'>
                  &nbsp;&nbsp;<div class="tab_null"><b>Job Ref No. : </b></div><div class="job-ref-input">${docData['JobRef_No']}</div>
                  </div><br />
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'><b>Service : </b></div><div class='service_ato'>${tempService[0]['value']}</div><div class='service_ato'>${tempService[1]['value']}</div><div class='service_ato'>${tempService[2]['value']}</div><div class='service_ato'>${tempService[3]['value']}</div><div class='service_ato'>${tempService[4]['value']}</div><div class='service_ato'>${tempService[5]['value']}</div>
                    <div class='so_type tab_null'><b>SO Type : </b></div><div class='service_ato'>${docData['SO_Type']}</div><div class='bath_so_type'>${docData['USD']}</div>
                  </div>
                  <div class='display_body doc_type'>
                    <div class='margin_ato_dis service_ato'>${tempService[6]['value']}</div><div class='service_ato'>${tempService[7]['value']}</div><div class='service_ato'>${tempService[8]['value']}</div><div class='service_ato'>${tempService[9]['value']}</div><div class='service_ato'>${tempService[10]['value']}</div><div class='service_ato'>${tempService[11]['value']}</div>`
                    if(docData['Saving'] == "Yes" || docData['Saving'] === true) {
                      html += `<div class='so_type tab_null'><b>Saving Thinking : </b></div><div class='service_ato'>Yes</div>`
                    } else  if(docData['Saving'] == "No" || docData['Saving'] === false){
                      html += `<div class='so_type tab_null'><b>Saving Thinking : </b></div><div class='service_ato'>No</div>`
                    }
                  html += `</div>
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'>วันที่เริ่มทดสอบ</div><div class='display_start_date'>${setDateFormatBE(docData['StagingtoOrder_StartDate'])}</div>
                    <div class='tab_null'>วันที่สิ้นสุดการทดสอบ</div><div class='display_start_date'>${setDateFormatBE(docData['StagingtoOrder_EndDate'])}</div>`
                  if(docData['PayPerUse'] === true) {
                    html += `<div class="payperuse-title"><b>Pay Per Use : </b></div><div class="payperuse-box">Yes</div>`
                  } else if(docData['PayPerUse'] === false) {
                    html += `<div class="payperuse-title"><b>Pay Per Use : </b></div><div class="payperuse-box">No</div>`
                  }
                  html += `</div><br />
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'>วันที่เริ่มสัญญา&nbsp&nbsp</div><div class='display_start_date'>${setDateFormatBE(docData['StartDate'])}</div>
                    <div class='tab_null'>วันที่สิ้นสุดสัญญา</div><div class='end_date display_start_date'>${setDateFormatBE(docData['EndDate'])}</div>
                  </div><br />
                  <div class='display_body doc_type'>
                    &nbsp;&nbsp;<div class='tab_null'>Sales Name:</div><div class='name tab_null'>${docData['Sales_Name']}</div>
                    <div class='tab_null'>Employee ID :</div><div class='employee_id'>${docData['EmployeeID']}</div>
                    <div class='tab_null'>Sale Team:</div><div class='sale_team'>${docData['Sale_Team']}</div>
                  </div>
                  <div class='display_body doc_type'>
                    <div class='make_contract tab_null'><b>โปรดระบุต้องการจัดทำสัญญาหรือไม่</b></div>`
                    if(docData['Contract_Agree'] === true) {
                      html += `<div class='make_contract'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div><div class='make_contract choice_size'>Y = ต้องการ</div>
                      <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>N = ไม่ต้องการ</div>`
                      if(docData['Contract_Agree_Lang'].includes('ภาษาไทย')) {
                        html += `<div class='make_contract'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาไทย</div>`
                      } else {
                        html += `<div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาไทย</div>`
                      }
                      if(docData['Contract_Agree_Lang'].includes('ภาษาอังกฤษ')) {
                        html += `<div class='make_contract'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาอังกฤษ</div>`
                      } else {
                        html += `<div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาอังกฤษ</div>`
                      }
                    } else if(docData['Contract_Agree'] === false){
                       html += ` <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>Y = ต้องการ</div>
                       <div class='make_contract'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div><div class='make_contract choice_size'>N = ไม่ต้องการ</div>
                       <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาไทย</div>
                       <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาอังกฤษ</div>`
                    }  else {
                      html += ` <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>Y = ต้องการ</div>
                      <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>N = ไม่ต้องการ</div>
                      <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาไทย</div>
                      <div class='make_contract'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div><div class='make_contract choice_size'>ภาษาอังกฤษ</div>`
                   }
                  html += `<div class='ex_set_font'>หมายเหตุ ราคาขาย &#60; เดือนละ 50,000 ใช้ใบเสนอราคาแทนสัญญา |ราคา ≥ เดือนละ 50,000 จัดทำสัญญาขาย</div>
                  </div>
                </div>`
      //Table zone
    html += `<div class='table_one display_body'>
                <table class='table_set'>
                  <thead>
                    <tr class='font_table'>
                      <th class='service_name table_td_th table_height_th' width='260px'>Service Name :</th>
                      <th colspan='2' class='bgcolor_table table_td_th table_height_th' width='80px'>Unit</th>
                      <th class='bgcolor_table table_td_th table_height_th' width='64px' style='white-space: pre;'>Group Service</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='64px'>Item Code</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='54px'>PO NO.</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='40px'>Allocate</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>Cost/Unit</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>Internal</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='49px' style='white-space: pre;'>External (JV)</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>External</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='54px'>Actual</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>R&D</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='55px'>Actual Cost</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='55px'>Eng. Cost</th>
                      <th class='bgcolor_table2 table_td_th table_height_th' width='55px'>Revenue</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='50px'>Margin</th>
                      <th class='bgcolor_table1 table_td_th table_height_th' width='40px'>%</th>
                      <th class='bgcolor_table2 table_td_th table_height_th' width='60px'>Pay Type</th>
                    </tr>
                  </thead>
                  <tbody>`
    var tableRow = 0
    if(docData['Service_Table'].length > 20) {
      tableRow = 21
      isNextPage = true
    } else {
      tableRow = docData['Service_Table'].length
    }
    for(let i=0; i<tableRow; i++) {
      html += `<tr class='font_table'>
          <td class='table_td_th table_height_td'>${docData['Service_Table'][i][0].value}</td>
          <td class='table_td_th table_height_td' width='35px'>${docData['Service_Table'][i][1].value}</td>
          <td class='table_td_th table_height_td' width='45px'>${docData['Service_Table'][i][2].value}</td>
          <td class='table_td_th table_height_td'>${docData['Service_Table'][i][3].value}</td>
          <td class='table_td_th table_height_td'>${docData['Service_Table'][i][4].value}</td>
          <td class='table_td_th table_height_td'>${docData['Service_Table'][i][5].value}</td>`
        if(docData['Service_Table'][i][6].value) {
          html += `<td class='td_center table_td_th table_height_td'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></td>`
        } else {
          html += `<td class='td_center table_td_th table_height_td'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></td>`
        }
        html+= `<td class='table_td_th table_height_td'>${numberToCommaFour(docData['Service_Table'][i][7].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][8].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][9].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][10].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][11].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][12].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][13].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][14].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][15].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][16].value)}</td>
          <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][17].value)}</td>
          <td class='table_td_th table_height_td'>${docData['Service_Table'][i][18].value}</td>
      </tr>`
    }

    html +=       `<tr class='font_table'>
                      <th colspan='7' class='td_right font_table2 table_td_th table_height_td'>ค่าบริการต่อเดือน</th>
                      <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Cost/Unit'])}</td>
                      <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Internal'])}</td>
                      <td class='td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_External(JV)'])}</b></td>
                      <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_External'])}</td>
                      <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Actual'])}</td>
                      <td class='td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_RandD'])}</b></td>
                      <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_ActualCost'])}</td>
                      <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_EngCost'])}</td>
                      <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_Revenue'])}</td>
                      <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_Margin'])}</td>
                      <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Percent_Margin'])}</td>
                      <td class='table_td_th table_height_td'></td>
                    </tr>

                    <tr class='font_table'>
                      <th colspan='7' class='td_right font_table2 table_td_th table_height_td'>ค่าบริการต่อเดือน(ทั้งหมด)</th>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Cost/Unit'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Internal'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_External(JV)'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_External'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Actual'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_RandD'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_ActualCost'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_EngCost'])}</b></td>
                      <td class='bgcolor_table2 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_Revenue'])}</b></td> 
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_Margin'])}</b></td>
                      <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Percent_Margin'])}</b></td>
                      <td class='bgcolor_table3 table_td_th table_height_td'></td>
                    </tr>
                  </tbody>
                </table>
              </div>`
      //Table foot zone
    html += `<div class='display_body doc_type set_top_table'>
                  <div class='service_charge'><b>ค่าบริการ</b></div><div class='zero_size'>${numberToComma(docData['Revenue_Month'])}</div><div class='bath_month'><b>บาท/เดือน</b></div><div class='type_size'><b>Int.INET</b></div><div class='zero_size1'>${numberToComma(docData['Int_INET'])}</div><div class='day_prorate'></div><div class='ext_jv'><b>Ext.JV</b></div><div class='zero_size'>${numberToComma(docData['Ext_JV'])}</div><div class='total_revenue'><b>Total Revenue</b></div><div class='zero_size'>${numberToCommaTwoFix(docData['Total_Revenue/Month'])}</div><div class='thb'><b>THB</b></div><div class='sale_factors'><b>Sale Factors</b></div><div class='zero_size2'>${numberToComma(docData['SaleFactors'])}</div><div class='percentage'><b></b></div><div class='thb'><b>R&D</b></div><div class='sale_factors'>${numberToComma(docData['Total_RandD'])}</div>
                </div>
                <div class='display_body doc_type set_top_table'>
                  <div class='service_charge'><b>ระยะสัญญา</b></div><div class='zero_size'>${numberToComma(docData['Month_Contract'])}</div><div class='bath_month'><b>เดือน</b></div><div class='type_size'><b>External</b></div><div class='zero_size1'>${numberToComma(docData['External'])}</div><div class='day_prorate'></div><div class='ext_jv'><b>Matching</b></div><div class='percentage'>`
                if(docData['Matching'] === true) {
                  html += `<img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' />Yes</div><div class='percentage'>
                  <img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' />No</div>`
                } else if(docData['Matching'] === false) {
                  html += `<img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' />Yes</div><div class='percentage'>
                  <img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' />No</div>`
                } else  {
                  html += `<img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' />Yes</div><div class='percentage'>
                  <img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' />No</div>`
                }
                docData['Remark'] = docData['Remark'].split('\t').join('&nbsp;&nbsp;')
                docData['Remark'] = docData['Remark'].split('\n').join('<br>')
                docData['Remark'] = docData['Remark'].split('  ').join('&nbsp;&nbsp;')
                docData['Remark'] = docData['Remark'].split('\u0000').join('')
                html += `<div class='total_revenue'><b>Gross profit</b></div><div class='zero_size'>${numberToComma(docData['Grossprofit'])}</div><div class='thb'><b>THB</b></div><div class='sale_factors'><b>Gross profit</b></div><div class='zero_size2'>${numberToComma(docData['Percent_Grossprofit'])}</div><div class='percentage'><b>%</b></div><div class='thb'><b>R&D</b></div><div class='sale_factors'>${numberToComma(docData['RandD_input'])}</div>
                </div>
                <div class='display_body doc_type set_top_table'>
                  <div class='zero_size left_day'>${numberToComma(docData['Day_Contract'])}</div><div class='bath_month'><b>วัน</b></div><div class='type_size font_prorate'><b>Prorate จาก</b></div><div class='zero_size1 font_prorate'>${numberToComma(docData['Day_Prorate'])}</div><div class='day_prorate font_prorate'><b>วัน</b></div>
                </div><br />
                <div class='display_body doc_type set_top_table'>
                  <div class='service_charge'>Remark :</div>
                </div><br />
                <div class='display_body doc_type set_top_table'>
                  <div class='remark_input'>${docData['Remark']}</div>
                </div>`  
      //Footer zone
    html += `<div class='footer display_body'>
                <table class='approve-table'>
                  <thead>
                    <tr class='font_table2'>`
                if(docData['Presale']) {
                  html += `<th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='130px'>Bill of Material by</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='150px'>Bill of Material Approve by</th>`
                }      
               html += `<th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='125px'>เจ้าหน้าที่ Cost</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='125px'>เจ้าหน้าที่ฝ่ายขาย</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='150px'>ผู้ช่วยผู้บังคับบัญชาฝ่ายขาย</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='130px'>ผู้บังคับบัญชาฝ่ายขาย</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='115px'>ผู้บังคับบัญชา Cost</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='130px'>รองกรรมการผู้จัดการ</th>
                      <th class='bgcolor_table4 td_center table_td_th table_footer_height_th' width='130px'>กรรมการผู้จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class='font_table2'>`
                if(docData['Presale']) {
                  html += `<td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>`
                }
                      
                html += `<td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>
                      <td class='table_td_th table_footer_height_td'></td>
                    </tr>
                  </tbody>
                </table>
              </div>`
    

    html += `</div></div>` //close size and set
    var startLine = 21
    while(isNextPage) {
      if(isNextPage) {
        html += `<div style='page-break-before: always;'></div>`
        html += `<div class='paper_size'><div class='paper_set'>` //open size and set
        html += `<div class='table_one_p2 display_body'>
                  <table class='table_set'>
                    <thead>
                      <tr class='font_table'>
                        <th class='service_name table_td_th table_height_th' width='260px'>Service Name :</th>
                        <th colspan='2' class='bgcolor_table table_td_th table_height_th' width='80px'>Unit</th>
                        <th class='bgcolor_table table_td_th table_height_th' width='64px' style='white-space: pre;'>Group Service</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='64px'>Item Code</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='54px'>PO NO.</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='40px'>Allocate</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>Cost/Unit</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>Internal</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='49px' style='white-space: pre;'>External (JV)</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>External</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='54px'>Actual</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='49px'>R&D</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='55px'>Actual Cost</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='55px'>Eng. Cost</th>
                        <th class='bgcolor_table2 table_td_th table_height_th' width='55px'>Revenue</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='50px'>Margin</th>
                        <th class='bgcolor_table1 table_td_th table_height_th' width='40px'>%</th>
                        <th class='bgcolor_table2 table_td_th table_height_th' width='60px'>Pay Type</th>
                      </tr>
                    </thead>
                    <tbody>`
      var maxLen =  docData['Service_Table'].length
      isNextPage = false
      if(maxLen > startLine + 50) {
        maxLen =  startLine + 50
        isNextPage = true
      }
      for(let i=startLine; i<maxLen; i++) {
        html += `<tr class='font_table'>
            <td class='table_td_th table_height_td'>${docData['Service_Table'][i][0].value}</td>
            <td class='table_td_th table_height_td' width='35px'>${numberToComma(docData['Service_Table'][i][1].value)}</td>
            <td class='table_td_th table_height_td' width='45px'>${docData['Service_Table'][i][2].value}</td>
            <td class='table_td_th table_height_td'>${docData['Service_Table'][i][3].value}</td>
            <td class='table_td_th table_height_td'>${docData['Service_Table'][i][4].value}</td>
            <td class='table_td_th table_height_td'>${docData['Service_Table'][i][5].value}</td>`
          if(docData['Service_Table'][i][6].value) {
            html += `<td class='td_center table_td_th table_height_td'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></td>`
          } else {
            html += `<td class='td_center table_td_th table_height_td'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></td>`
          }
            html += `<td class='table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][7].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][8].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][9].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][10].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][11].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][12].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Service_Table'][i][13].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][14].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][15].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][16].value)}</td>
            <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Service_Table'][i][17].value)}</td>
            <td class='table_td_th table_height_td'>${docData['Service_Table'][i][18].value}</td>
        </tr>`
      }
      if(isNextPage) {
        startLine = startLine + 50
      }
      html +=       `<tr class='font_table'>
                        <th colspan='7' class='td_right font_table2 table_td_th table_height_td'>ค่าบริการต่อเดือน</th>
                        <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Cost/Unit'])}</td>
                        <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Internal'])}</td>
                        <td class='td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_External(JV)'])}</b></td>
                        <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_External'])}</td>
                        <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Actual'])}</td>
                        <td class='td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_RandD'])}</b></td>
                        <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_ActualCost'])}</td>
                        <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_EngCost'])}</td>
                        <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_Revenue'])}</td>
                        <td class='td_center table_td_th table_height_td'>${numberToCommaTwoFix(docData['Total_Margin'])}</td>
                        <td class='td_center table_td_th table_height_td'>${numberToComma(docData['Total_Percent_Margin'])}</td>
                        <td class='table_td_th table_height_td'></td>
                      </tr>
  
                      <tr class='font_table'>
                        <th colspan='7' class='td_right font_table2 table_td_th table_height_td'>ค่าบริการต่อเดือน(ทั้งหมด)</th>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Cost/Unit'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Internal'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_External(JV)'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_External'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Actual'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_RandD'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_ActualCost'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_EngCost'])}</b></td>
                        <td class='bgcolor_table2 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_Revenue'])}</b></td> 
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToCommaTwoFix(docData['Total_Margin'])}</b></td>
                        <td class='bgcolor_table3 td_center table_td_th table_height_td'><b>${numberToComma(docData['Total_Percent_Margin'])}</b></td>
                        <td class='bgcolor_table3 table_td_th table_height_td'></td>
                      </tr>
                    </tbody>
                  </table>
                </div>`
        html += `</div></div>` //close size and set
      }
    }
  

    //Page Invoice Zone
    html += `<div style='page-break-before: always;'></div>`
    html += `<div class='paper_size'><div class='paper_set_p3'>` //open size and set
    //Detail Zone
    docData['Description_Invoice'] =  docData['Description_Invoice'].split('\n').join('<br>')
    html += `<div class='display_body font_set'>
                <div class='start_contract'><b>วันเริ่มสัญญา</b></div><div class='start_date set_center tab_size'>${setDateFormatBE(docData['StartDate'])}</div>
                <div class='start_contract tab_size'><b>วันสิ้นสุดสัญญา</b></div><div class='end_date_p3 set_center tab_size'>${setDateFormatBE(docData['EndDate'])}</div>
                <div class='payment_periodt tab_size'><b>งวดชำระเงิน</b></div><div class='month_set set_center'>${numberToComma(docData['Payment_period'])}</div><div class='set_lesson set_center'>งวด</div>
              </div><br />

              <div class='display_body font_set set_top'>
                <div class='tab_size'><b>Description Invoice :</b></div><div class='set_textarea'>${docData['Description_Invoice']}</div>
              </div>

              <div class='display_body font_set set_top2'>
                <div class='condition_set'><b>เงื่อนไขการออกใบแจ้งหนี้และการชำระเงิน</b></div><div class='set_atocompletes_one'>${docData['Condition_Invoice1']}</div><div class='set_atocompletes_one'>${docData['Condition_Invoice2']}</div>
              </div>

              <div class='display_body font_set set_top'>`
            html += `<div class='tab_size'><b>เอกสารประกอบการชำระเงิน</b></div>`
              if(docData['Docpayment'].includes('Purchase Order(PO) / ใบยืนยันการสั่งซื้อเอง')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>Purchase Order(PO) / ใบยืนยันการสั่งซื้อเอง</div>`
              if(docData['Docpayment'].includes('สัญญาบริการ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>สัญญาบริการ</div>`
              if(docData['Docpayment'].includes('หนังสือมอบอำนาจ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>หนังสือมอบอำนาจ</div>`
              if(docData['Docpayment'].includes('รายละเอียดการใช้บริการ(Report)')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div>รายละเอียดการใช้บริการ(Report)</div>`
            html += `</div><br /><div class='display_body font_set set_left set_top3'>`
              if(docData['Docpayment'].includes('ไม่แสดงรอบบริการ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>ไม่แสดงรอบบริการ</div>`
              if(docData['Docpayment'].includes('อื่นๆ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
                html += `<div>อื่นๆ</div><div class='please_specify'>${docData['Docpayment_Etc']}</div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
                html += `<div>อื่นๆ</div>`
              }
            html += `</div>`
    //Generated Table Zone
    docData['Payment_Years'].forEach(e => {
      let holdLen = e.value.month_invoice.length
      if(holdLen < 12) {
        for(let i=0; i < (12-holdLen); i++) {
          e.value.month_invoice.push({
            'StartDate': '',
            'EndDate': '',
            'Recurring': '',
            'OneTime': '',
            'Other': '',
            'Total': ''
          })
        }
      }
      html += `<div class='set_table display_body'>
              <table class='table_set'>
                <thead>
                  <tr>
                    <th class='table_td_th table_height_th_p3 font_list bgcolor_table_p3' width='80px'>รายการ</th>
                    <td class='table_td_th table_height_th_p3 font_start_date set_center bgcolor_table2_p3' width='100px'>Start Date</td>`
                    e.value.month_invoice.forEach(e2 => {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${setDateFormatBEsub(e2.StartDate)}</td>`
                    })
              html += `</tr>
                </thead>
                <tbody>
                  <tr>
                    <th class='table_td_th table_height_th_p3 font_list bgcolor_table_p3'>การออก Invoice</th>
                    <td class='table_td_th table_height_th_p3 font_start_date set_center bgcolor_table2_p3'>End Date</td>`
                    e.value.month_invoice.forEach(e2 => {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${setDateFormatBEsub(e2.EndDate)}</td>`
                    })
              html +=  `</tr>

                  <tr>
                    <td class='table_td_th table_height_th_p3 font_set'>Recurring</td>`
                    if(docData['Invoice_Type'] == 'Recurring') {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    } else {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                    }
                    e.value.month_invoice.forEach(e2 => {
                      if(docData['Invoice_Type'] == 'Recurring') {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.Recurring)}</td>`
                      } else {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                      } 
                    })
              html += `</tr>

                  <tr>
                    <td class='table_td_th table_height_th_p3 font_set'>One Time</td>`
                    if(docData['Invoice_Type'] == 'One Time') {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    } else {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                    }
                    e.value.month_invoice.forEach(e2 => {
                      if(docData['Invoice_Type'] == 'One Time') {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.OneTime)}</td>`
                      } else {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                      } 
                    })
              html +=`</tr>

                  <tr>
                    <td class='table_td_th table_height_th_p3 font_set'>Other</td>`
                    if(docData['Invoice_Type'] == 'Other') {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    } else {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                    }
                    e.value.month_invoice.forEach(e2 => {
                      if(docData['Invoice_Type'] == 'Other') {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.Other)}</td>`
                      } else {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                      } 
                    })
              html +=`</tr>

                  <tr>
                    <th class='table_td_th table_height_th_p3 font_set set_left bgcolor_table3_p3'>Total</th>`
                    html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    e.value.month_invoice.forEach(e2 => {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.Total)}</td>`
                    })
              html +=`</tr>
                </tbody>
              </table>
            </div>

            <div class='display_body font_set set_total_left'>
              <div class='total_invoice'>Total Invoice year ${e.style.index}</div><div class='set_input1 tab_size'>${numberToComma(e.value.total_invoice)}</div><div class='invoice_balance set_center'>Invoice คงเหลือ</div><div class='set_input2'>${numberToComma(e.value.remain_invoice)}</div>
            </div>`
    })
    html += `</div></div>` //close size and set
    html += `</body>` //close body tag
    html = addClassCs(html)
    return html
  } catch (error) {
    console.log(error)
    return error
  }
}

function genHtmlInvoiceOnly(data,  document_id, ref_qt) {
  try {
    // data = dataCs //เอาออกด้วย
    var docData = dataToJsonKey(data,'CS')
    var doc_no = document_id // อย่าลืมแทนด้วยเลย CS
    docData['Ref_Qt'] = ref_qt //ทำเป็น string ด้วย 
    var isNextPage = false
    var tempService = docData['Service']
    if(tempService.length < 12) {
      var diffLen = 12 - tempService.length
      for(let i = 0; i< diffLen; i++) {
        tempService.push({
          value: ''
        })
      }
    }
    //Page1
    var html = ` <head><meta charset='utf-8'></head>` //header
    var row = 15
    html += `<body style='background-color:white; margin:0;'>` //open body tag
    html += `<div class='paper_size'><div class='paper_set_p3'>` //open size and set
    //Detail Zone
    docData['Description_Invoice'] =  docData['Description_Invoice'].split('\n').join('<br>')
    html += `<div class='display_body font_set'>
                <div class='start_contract'><b>วันเริ่มสัญญา</b></div><div class='start_date set_center tab_size'>${setDateFormatBE(docData['StartDate'])}</div>
                <div class='start_contract tab_size'><b>วันสิ้นสุดสัญญา</b></div><div class='end_date_p3 set_center tab_size'>${setDateFormatBE(docData['EndDate'])}</div>
                <div class='payment_periodt tab_size'><b>งวดชำระเงิน</b></div><div class='month_set set_center'>${numberToComma(docData['Payment_period'])}</div><div class='set_lesson set_center'>งวด</div>
              </div><br />

              <div class='display_body font_set set_top'>
                <div class='tab_size'><b>Description Invoice :</b></div><div class='set_textarea'>${docData['Description_Invoice']}</div>
              </div>

              <div class='display_body font_set set_top2'>
                <div class='condition_set'><b>เงื่อนไขการออกใบแจ้งหนี้และการชำระเงิน</b></div><div class='set_atocompletes_one'>${docData['Condition_Invoice1']}</div><div class='set_atocompletes_one'>${docData['Condition_Invoice2']}</div>
              </div>

              <div class='display_body font_set set_top'>`
            html += `<div class='tab_size'><b>เอกสารประกอบการชำระเงิน</b></div>`
              if(docData['Docpayment'].includes('Purchase Order(PO) / ใบยืนยันการสั่งซื้อเอง')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>Purchase Order(PO) / ใบยืนยันการสั่งซื้อเอง</div>`
              if(docData['Docpayment'].includes('สัญญาบริการ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>สัญญาบริการ</div>`
              if(docData['Docpayment'].includes('หนังสือมอบอำนาจ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>หนังสือมอบอำนาจ</div>`
              if(docData['Docpayment'].includes('รายละเอียดการใช้บริการ(Report)')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div>รายละเอียดการใช้บริการ(Report)</div>`
            html += `</div><br /><div class='display_body font_set set_left set_top3'>`
              if(docData['Docpayment'].includes('ไม่แสดงรอบบริการ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
              }
            html +=`<div class='tab_size'>ไม่แสดงรอบบริการ</div>`
              if(docData['Docpayment'].includes('อื่นๆ')) {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/7ee16256c81a424ee4c2aceaf12ef727.png' width='15' height='15' /></div>`
                html += `<div>อื่นๆ</div><div class='please_specify'>${docData['Docpayment_Etc']}</div>`
              } else {
                html += `<div class='tab_size_img'><img src='https://www.img.in.th/images/66c79838387db27a6319060dc8766007.jpg' width='15' height='15' /></div>`
                html += `<div>อื่นๆ</div>`
              }
            html += `</div>`
    //Generated Table Zone
    docData['Payment_Years'].forEach(e => {
      let holdLen = e.value.month_invoice.length
      if(holdLen < 12) {
        for(let i=0; i < (12-holdLen); i++) {
          e.value.month_invoice.push({
            'StartDate': '',
            'EndDate': '',
            'Recurring': '',
            'OneTime': '',
            'Other': '',
            'Total': ''
          })
        }
      }
      html += `<div class='set_table display_body'>
              <table class='table_set'>
                <thead>
                  <tr>
                    <th class='table_td_th table_height_th_p3 font_list bgcolor_table_p3' width='80px'>รายการ</th>
                    <td class='table_td_th table_height_th_p3 font_start_date set_center bgcolor_table2_p3' width='100px'>Start Date</td>`
                    e.value.month_invoice.forEach(e2 => {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${setDateFormatBEsub(e2.StartDate)}</td>`
                    })
              html += `</tr>
                </thead>
                <tbody>
                  <tr>
                    <th class='table_td_th table_height_th_p3 font_list bgcolor_table_p3'>การออก Invoice</th>
                    <td class='table_td_th table_height_th_p3 font_start_date set_center bgcolor_table2_p3'>End Date</td>`
                    e.value.month_invoice.forEach(e2 => {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${setDateFormatBEsub(e2.EndDate)}</td>`
                    })
              html +=  `</tr>

                  <tr>
                    <td class='table_td_th table_height_th_p3 font_set'>Recurring</td>`
                    if(docData['Invoice_Type'] == 'Recurring') {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    } else {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                    }
                    e.value.month_invoice.forEach(e2 => {
                      if(docData['Invoice_Type'] == 'Recurring') {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.Recurring)}</td>`
                      } else {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                      } 
                    })
              html += `</tr>

                  <tr>
                    <td class='table_td_th table_height_th_p3 font_set'>One Time</td>`
                    if(docData['Invoice_Type'] == 'One Time') {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    } else {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                    }
                    e.value.month_invoice.forEach(e2 => {
                      if(docData['Invoice_Type'] == 'One Time') {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.OneTime)}</td>`
                      } else {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                      } 
                    })
              html +=`</tr>

                  <tr>
                    <td class='table_td_th table_height_th_p3 font_set'>Other</td>`
                    if(docData['Invoice_Type'] == 'Other') {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    } else {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                    }
                    e.value.month_invoice.forEach(e2 => {
                      if(docData['Invoice_Type'] == 'Other') {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.Other)}</td>`
                      } else {
                        html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'></td>`
                      } 
                    })
              html +=`</tr>

                  <tr>
                    <th class='table_td_th table_height_th_p3 font_set set_left bgcolor_table3_p3'>Total</th>`
                    html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e.value.start_invoice)}</td>`
                    e.value.month_invoice.forEach(e2 => {
                      html += `<td class='table_td_th table_height_th_p3 font_set set_center bgcolor_table2_p3' width='79px'>${numberToComma(e2.Total)}</td>`
                    })
              html +=`</tr>
                </tbody>
              </table>
            </div>

            <div class='display_body font_set set_total_left'>
              <div class='total_invoice'>Total Invoice year ${e.style.index}</div><div class='set_input1 tab_size'>${numberToComma(e.value.total_invoice)}</div><div class='invoice_balance set_center'>Invoice คงเหลือ</div><div class='set_input2'>${numberToComma(e.value.remain_invoice)}</div>
            </div>`
    })
    html += `</div></div>` //close size and set
    html += `</body>` //close body tag
    html = addClassCs(html)
    return html
  } catch (error) {
    console.log(error)
    return error
  }
}

function genHtmlQtBiLang(data, document_id) {
  try {
    // data = dataQt
    var docData = dataToJsonKey(data, 'QT')
    var doc_no = document_id //เปลี่ยนเป็นเลขของระบบ
    //Page1
    if(docData['Service'] == 'Cloud') {
      docData['Service'] = docData['Service_Type']
    }
    var html = ` <head><meta charset='utf-8'></head>` //header
    html += `<body style='background-color:white; margin:0;'>` //open body tag
    html += `<div class='paper'><div class='frame'>` //open size and frame
    //In Page
    html += `<div class='row'>
              <div>
                <img src='https://eform.one.th/eform_api/api/v1/view_image?file_name=25020637504_a885d44f-093f-4021-8987-bdc86532f858.png' width='173.97px' class='logo-img'>
              </div>
              <div class='header-block'>
                <div class='row inet-header-row'>
                  <b class='inet-header'>Internet Thailand Public Company Limited</b>
                </div>
                <div class='row'>
                  <span class='address1'>1768 Thai Summit Tower, 10th - 12th Floor and IT Floor</span>
                </div>
                <div class='row'>
                  <span class='address2'>New Petchaburi Road, Khwaeng Bang Kapi, Khet Huay Khwang, Bangkok 10310</span>
                </div>
              </div>
            </div>`
    html += `<div class='row'>
              <b class='qt-title'>Quotation / Purchase Order</b>
              <span class='tel-num'>Tel. (662) 257 7000 Fax (662) 257 1376, (662) 257 1379</span>
            </div>`
    //Head zone
    var cusname = `${docData['Cusname_thai']}`
    if(docData['Qt_Lang'] == 'eng') { cusname = `${docData['Cusname_Eng']}` }
    var techname = `${docData['Technicain_Name']}`
    // var techname = `คุณ ${docData['Technicain_Name']}`
    // if(docData['Qt_Lang'] == 'eng') { techname = `K. ${docData['Technicain_Name']}` }
    html += ` <div class='row qt-header-block'>
                <div class='customer-detail'>
                  <div class='row'>
                    <b class='customer-title'>Customer Name :</b>
                    <div class='input-customer-name'>${techname}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Company Name :</b>
                    <div class='input-customer-name'>${cusname}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Address :</b>
                    <div class='input-customer-address'>
                      <div class='customer-address-line'></div><div class='customer-address-line2'></div>
                      ${docData['Address']}
                    </div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Tel No. :</b>
                    <div class='input-customer-tel'>${docData['CusTel']}</div>
                    <b class='customer-title'>Mobile :</b>
                    <div class='input-customer-mobile'>${docData['Technicain_Tel']}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Email :</b>
                    <div class='input-customer-email'>${docData['Technicain_E-mail']}</div>
                  </div>
                </div>
                <div class='qt-sale-detail'>
                  <div class='row qt-num-row'>
                    <b class='customer-title'>Quotation No. :</b>
                    <div class='input-qt-num'>${doc_no}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Quotation Date :</b>
                    <div class='input-qt-date'>${setDateFormatBE(docData['Quotation_Date'], docData['Qt_Lang'])}</div>
                    <div class='input-qt-time'>${docData['Quotation_Time']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Sale Name :</b>
                    <div class='input-sale-firstname'>${docData['Sales_Name']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Tel NO. :</b>
                    <span class='sale-tel'>022577111</span>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Mobile :</b>
                    <div class='input-sale-mobile'>${docData['Sales_Mobile']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Email :</b>
                    <div class='input-sale-mobile'>${docData['Sales_Email']}</div>
                  </div>
                </div>
              </div>`
    //Table zone
    if(docData['Desciption_R3']) {
      docData['Desciption_R3'] = docData['Desciption_R3'].split('\t').join('&nbsp;&nbsp;')
      docData['Desciption_R3'] = docData['Desciption_R3'].split('\n').join('<br>')
      docData['Desciption_R3'] = docData['Desciption_R3'].split('  ').join('&nbsp;&nbsp;')
    }
    if(docData['Desciption_R4']) {
      docData['Desciption_R4'] = docData['Desciption_R4'].split('\t').join('&nbsp;&nbsp;')
      docData['Desciption_R4'] = docData['Desciption_R4'].split('\n').join('<br>')
      docData['Desciption_R4'] = docData['Desciption_R4'].split('  ').join('&nbsp;&nbsp;')
    }
    if(!Number(docData['Qty_R2'])) {docData['Qty_R2'] = ""}
    if(!Number(docData['Unit_Price_R2'])) {docData['Unit_Price_R2'] = ""}
    if(!Number(docData['Amount_R2'])) {docData['Amount_R2'] = ""}
    html += `<div class='qt-table-block'>
              <table class='qt-table'>
                <thead>
                  <tr class='qt-table-header-row'>
                    <th class='qt-table-header item-header'>Item</th>
                    <th class='qt-table-header'>Description</th>
                    <th class='qt-table-header qty-header'>Qty</th>
                    <th class='qt-table-header unit-header'>Unit</th>
                    <th class='qt-table-header price-header'>Unit Price</th>
                    <th class='qt-table-header amount-header'>Amount</th>
                  </tr>
                </thead>
                <tbody class='qt-table-body'>
                  <tr class='qt-data-row'>
                    <td class='qt-table-cell qt-data-first-row qt-data'>${docData['Item_R2']}</td>
                    <td class='qt-table-cell qt-data-first-row'><div class='description-data'>${docData['Desciption_R2S1']}&nbsp;${docData['Desciption_R2S2']}&nbsp;${docData['Desciption_R2S3']}&nbsp;${docData['Desciption_R2S4']}&nbsp;</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToCommaNoFix(docData['Qty_R2'])}</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToComma(docData['Unit_R2'])}</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToComma(docData['Unit_Price_R2'])}</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToComma(docData['Amount_R2'])}</div></td>
                  </tr>

                  <tr class='qt-data-row'>
                    <td class='qt-table-cell'><div class='qt-data'>${docData['Item_R3']}</div></td>`
                  if(docData['Service'] != 'Outsource') {
                    html += ` <td class='qt-table-cell'>
                                <b class='service-spec-title'>Service Specification :</b>
                              </td>`
                  } else {
                    html += ` <td class='qt-table-cell'>
                                <b class='description-data'>Scope of Work :</b>
                                <span class='scope-work-description'>${docData['Desciption_R3']}</span>
                              </td>`
                  }
          html += `
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                  </tr>`
          if(docData['Service_Specs'].length) {
            for(let i=0; i< docData['Service_Specs'].length; i++) {
              docData['Service_Specs'][i].value[1].value = docData['Service_Specs'][i].value[1].value.split('\t').join('&nbsp;&nbsp;')
              docData['Service_Specs'][i].value[1].value = docData['Service_Specs'][i].value[1].value.split('\n').join('<br>')
              docData['Service_Specs'][i].value[1].value = docData['Service_Specs'][i].value[1].value.split('  ').join('&nbsp;&nbsp;')
              if(!Number(docData['Service_Specs'][i].value[2].value)) {docData['Service_Specs'][i].value[2].value = ""}
              if(!Number(docData['Service_Specs'][i].value[4].value)) {docData['Service_Specs'][i].value[4].value = ""}
              if(!Number(docData['Service_Specs'][i].value[5].value)) {docData['Service_Specs'][i].value[5].value = ""}
              html += `
                      <tr class='qt-data-row'>
                        <td class='qt-table-cell'><div class='qt-data'>${docData['Service_Specs'][i].value[0].value}</div></td>
                        <td class='qt-table-cell'><div class='description-data'>${docData['Service_Specs'][i].value[1].value}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToCommaNoFix(docData['Service_Specs'][i].value[2].value)}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${docData['Service_Specs'][i].value[3].value}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Service_Specs'][i].value[4].value)}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Service_Specs'][i].value[5].value)}</div></td>
                      </tr>`
            }
          }
          if(!Number(docData['Qty_R4'])) {docData['Qty_R4'] = ""}
          if(!Number(docData['Unit_Price_R4'])) {docData['Unit_Price_R4'] = ""}
          if(!Number(docData['Amount_R4'])) {docData['Amount_R4'] = ""}
          html += `
                  <tr class='qt-data-row'>
                    <td class='qt-table-cell'><div class='qt-data'>${docData['Item_R4']}</div></td>
                    <td class='qt-table-cell'><div class='description-data'>${docData['Desciption_R4']}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToCommaNoFix(docData['Qty_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Unit_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Unit_Price_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Amount_R4'])}</div></td>
                  </tr>
                  <tr>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                  </tr>`
            if(docData['QT_Type'] == 'Renew&Discount') {
              html += `<tr class='qt-data-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <b class='total-before-discount'>Total</b>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Total_Unit_Price'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Total_Amount'])}</div></td>
              </tr>
              <tr class='qt-data-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <div class='dicount-block'>
                      <b class='discount-title'>Discount</b>
                      <div class='discount'>${numberToComma(docData['Discount'])}</div>
                      <span class='percent-discount'>%</span>
                    </div>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Discount_UnitPrice'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Discount_Amount'])}</div></td>
              </tr>
              <tr class='after-discount-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <b class='total-before-discount'>Total After Discount</b>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['After_Discount_UnitPrice'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['After_Discount_Amount'])}</div></td>
              </tr>`
            }
            
          html += `</tbody>
            <tfoot>
                <tr>
                  <td colspan='3' rowspan='2' class='qt-table-footer'>
                    <div class='row'>
                      <div class='period-block service-time-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>Minimum Contract Period :</b>`
                      } else {
                        html += `<b class='period-title'>ระยะเวลาการให้บริการขั้นต่ำ :</b>`
                      }
                      html += `<div class='row input-period-block'>
                          <div class='input-period'>${docData['Contract']}</div>
                          <div class='input-unit-period'>${docData['Contract_Unit']}</div>
                        </div>
                      </div>
                      <div class='period-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>Start Date</b>`
                      } else {
                        html += `<b class='period-title'>วันที่เริ่มสัญญา</b>`
                      }
                      html += `<div class='input-start-date'>${setDateFormatBE(docData['StartDate'],docData['Qt_Lang'])}</div>
                      </div>
                      <div class='period-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>End Date</b>`
                      } else {
                        html += `<b class='period-title'>วันที่สิ้นสุดสัญญา</b>`
                      }
                      html += `<div class='input-end-date'>${setDateFormatBE(docData['EndDate'],docData['Qt_Lang'])}</div>
                      </div>
                    </div>
                  </td>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>Total</b></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Unit_Price'])}</div></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Amount'])}</div></td>
                </tr>
                <tr>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>Vat</b></td>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>7%</b></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Vat'])}</div></td>
                </tr>
                <tr>
                  <td colspan='5' class='qt-table-footer grand-total-title'><b>Grand Total</b></td>
                  <td class='qt-table-footer'><div class='input-total'>${numberToComma(docData['Grand_Total'])}</div></td>
                </tr>
              </tfoot>
            </table>
          </div>`
      //Table foot zone
      if(docData['Qt_Lang'] == 'eng') {
        html += `<div class='row condition-title-block'>`
        html += `<b class='condition-title'>Term & Condition</b>`
      } else {
        html += `<div class='row'>
              <b class='note-qt'>หมายเหตุ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กรณีลูกค้าต้องการใช้บริการ INET Privacy Box ลูกค้าต้องดำเนินการลงนามรับทราบข้อตกลงการใช้บริการ INET Privacy Box หน้าที่ 2 เพิ่มเติม</b> <!-- it is in every services except Outsource -->
            </div>
            <div class='row'>`
        html += `<b class='condition-title'>เงื่อนไขการให้บริการ</b>`
      }
    html += `</div>
            <hr class='condition-line'>
              <div class='row'>`
    if(docData['Qt_Lang'] == 'eng') {
      var massTag = ['Cloud Compliance', 'Cloud Enterprise', 'Cloud Commercial', 'Cloud Other', 'Trading', 'IDC', 'Other Products', 'Lead project', 'INET Log', 'One Box', 'One Conference', 'Zimbra mail', 'CA', 'One Collaboration', 'Network', 'Platform', 'INET-Container', 'Paperless', 'E-tax', 'One Collaboration']
      docData['Term_Condition'] = docData['Term_Condition'].split('\t').join('&nbsp;&nbsp;')
      docData['Term_Condition'] = docData['Term_Condition'].split('\n').join('<br>')
      docData['Term_Condition'] = docData['Term_Condition'].split('  ').join('&nbsp;&nbsp;')
      if(massTag.includes(docData['Service'])) {
        html += `<p class='condition-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'Outsource' || docData['Service'] == 'Alibaba') {
        html += `<p class='condition-outsource-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'INET Consent Management Platform') {
        html += `<p class='condition-consent-part'>${docData['Term_Condition']}</p>`
      }
      html += `</div>`

      var certArray = ['Outsource', 'Alibaba']
      if(!certArray.includes(docData['Service'])) {
        html += `
        <hr class='condition-end-line'>
        <b class='certify-text'>INET Company Certified</b><br>
        <b class='certify-text'>ISO/IEC 20000-1:2011 (Information Technology Service Management), ISO/IEC 27001:2013 (Information Security Management)</b><br>
        <b class='certify-text'>ISO/IEC 27799:2016 (Health informatics-Information security), ISO/IEC 22301:2012 (Business Continuity Management)</b><br>
        <b class='certify-text'>ISO 27017:2015 (Cloud security), CSA Security, Trust & Assurance Registry (STAR), มาตรฐาน ISO/IEC 27018:2014</b>`
      }
      if(docData['Service'] == 'Outsource') {
        html += `
        <hr class='condition-end-outsource-line'>
          <div class='row outsource-bank-first outsource-bank-part'>
            <span>Advance deposit transfer amount of</span>
            <div class='money-outsource'>${docData['Outsoure_Prepaid']}</div>
            <span>Baht</span>
          </div>
          <div class='row outsource-bank-part'>${docData['Outsource_Bank']}</div>
          <div class='row outsource-bank-part'>Account number ${docData['Outsource_Account_No']}</div>
          <div class='row outsource-bank-part'>Account name ${docData['Outsource_Account_Name']}</div>`
      }
    } else {
      var massTag = ['Other Products', 'Lead project', 'INET Log', 'One Box', 'One Conference', 'Zimbra mail', 'CA', 'One Collaboration', 'Network', 'Platform', 'INET-Container', 'Paperless', 'Cloud Compliance','Cloud Enterprise', 'Cloud Commercial', 'Cloud Other', 'Trading', 'IDC', 'INET Cybersecurity', 'One Collaboration']
      docData['Term_Condition'] = docData['Term_Condition'].split('\t').join('&nbsp;&nbsp;')
      docData['Term_Condition'] = docData['Term_Condition'].split('\n').join('<br>')
      docData['Term_Condition'] = docData['Term_Condition'].split('  ').join('&nbsp;&nbsp;')
      if(massTag.includes(docData['Service'])) {
        html += `<p class='condition-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'Outsource') {
        html += `<p class='condition-outsource-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'E-tax') {
        html += `<p class='condition-etax-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'INET Consent Management Platform') {
        html += `<p class='condition-consent-part'>${docData['Term_Condition']}</p>`
      }
      html += `</div>`

      var certArray = ['Outsource', 'INET Consent Management Platform', 'INET Cybersecurity']
      if(!certArray.includes(docData['Service'])) {
        html += `
        <hr class='condition-end-line'>
        <b class='certify-text'>INET Company Certified</b><br>
        <b class='certify-text'>ISO/IEC 20000-1:2011 (Information Technology Service Management), ISO/IEC 27001:2013 (Information Security Management)</b><br>
        <b class='certify-text'>ISO/IEC 27799:2016 (Health informatics-Information security), ISO/IEC 22301:2012 (Business Continuity Management)</b><br>
        <b class='certify-text'>ISO 27017:2015 (Cloud security), CSA Security, Trust & Assurance Registry (STAR), มาตรฐาน ISO/IEC 27018:2014</b>`
      }
      if(docData['Service'] == 'Outsource') {
        html += `
        <hr class='condition-end-outsource-line'>
          <div class='row outsource-bank-first outsource-bank-part'>
            <span>ยอดโอนมัดจำล่วงหน้า จำนวน</span>
            <div class='money-outsource'>${docData['Outsoure_Prepaid']}</div>
            <span>บาท</span>
          </div>
          <div class='row outsource-bank-part'>${docData['Outsource_Bank']}</div>
          <div class='row outsource-bank-part'>บัญชีเลขที่ ${docData['Outsource_Account_No']}</div>
          <div class='row outsource-bank-part'>ชื่อบัญชี ${docData['Outsource_Account_Name']}</div>`
      }
    }
    
    
    html += `<div class='sign-table-block'>
              <table class='sign-table'>
                <tr>
                  <th class='sign-table-border sign-table-header customer-sign-header'>Acceptance By Customer</th>
                  <th colspan='2' class='sign-table-border sign-table-header'>Internet Thailand Public Co.,Ltd.</th>
                </tr>
                <tr>
                  <td class='sign-table-border'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>We agree to order the service as quoted</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row note-customer-sign-row'>
                        <span class='note-customer-sign'>Signature of Authorized Person with Company's Seal</span>
                      </div>
                      <div class='row'>
                        <b class='customer-position-sign-title'>Position :</b>
                        <div class='input-customer-position'></div>
                      </div>
                      <div class='row'>
                        <b class='customer-position-sign-title'>Date :</b>
                        <div class='input-customer-sign-date'></div>
                      </div>
                    </div>  
                  </td>
                  <td class='sign-table-border qt-sign-cell'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>Quoted By</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row name-sign-row'>
                        <span class='parentheses-name'>(</span>
                        <div class='name-sign-box'>${docData['Sales_Name']}</div>
                        <span class='parentheses-name'>)</span>
                      </div>
                      <div class='row'>
                        <b class='qt-position-title'>Position :</b>
                        <div class='input-qt-position'>${docData['Sales_Role']}</div>
                      </div>
                    </div>
                  </td>
                  <td class='sign-table-border'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>Approved By</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row name-sign-row'>
                        <span class='parentheses-name'>(</span>
                        <div class='input-name-approve'>${docData['SBM_Name']}</div>
                        <span class='parentheses-name'>)</span>
                      </div>
                      <div class='row'>
                        <b class='qt-position-title'>Position</b>
                        <div class='input-qt-position'>${docData['SBM_Role']}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>`
    html += `</div></div>` //close size and set
    html += `</body>` //close body tag
    if(docData['Qt_Lang'] == 'eng') {
      html = addClassQtEn(html)
    } else {
      html = addClassQtThai(html)
    }
    return html
  } catch (error) {
    console.log(error)
    return ''
  }
}

// Remove คุณ
function genHtmlQtBiLangV2(data, document_id) {
  try {
    // data = dataQt
    var docData = dataToJsonKey(data, 'QT')
    var doc_no = document_id //เปลี่ยนเป็นเลขของระบบ
    //Page1
    if(docData['Service'] == 'Cloud') {
      docData['Service'] = docData['Service_Type']
    }
    docData = getLineCalculate(docData)
    var html = ` <head><meta charset='utf-8'></head>` //header
    html += `<body style='background-color:white; margin:0;'>` //open body tag
    html += `<div class='paper'><div class='frame'>` //open size and frame
    //In Page
    html += `<div class='row'>
              <div>
                <img src='https://eform.one.th/eform_api/api/v1/view_image?file_name=25020637504_a885d44f-093f-4021-8987-bdc86532f858.png' width='173.97px' class='logo-img'>
              </div>
              <div class='header-block'>
                <div class='row inet-header-row'>
                  <b class='inet-header'>Internet Thailand Public Company Limited</b>
                </div>
                <div class='row'>
                  <span class='address1'>1768 Thai Summit Tower, 10th - 12th Floor and IT Floor</span>
                </div>
                <div class='row'>
                  <span class='address2'>New Petchaburi Road, Khwaeng Bang Kapi, Khet Huay Khwang, Bangkok 10310</span>
                </div>
              </div>
            </div>`
    html += `<div class='row'>
              <b class='qt-title'>Quotation / Purchase Order</b>
              <span class='tel-num'>Tel. (662) 257 7000 Fax (662) 257 1376, (662) 257 1379</span>
            </div>`
    //Head zone
    var cusname = `${docData['Cusname_thai']}`
    if(docData['Qt_Lang'] == 'eng') { cusname = `${docData['Cusname_Eng']}` }
    var techname = `${docData['Technicain_Name']}`
    // var techname = `คุณ ${docData['Technicain_Name']}`
    // if(docData['Qt_Lang'] == 'eng') { techname = `K. ${docData['Technicain_Name']}` }
    html += ` <div class='row qt-header-block'>
                <div class='customer-detail'>
                  <div class='row'>
                    <b class='customer-title'>Customer Name :</b>
                    <div class='input-customer-name'>${techname}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Company Name :</b>
                    <div class='input-customer-name'>${cusname}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Address :</b>
                    <div class='input-customer-address'>
                      <div class='customer-address-line'></div><div class='customer-address-line2'></div>
                      ${docData['Address']}
                    </div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Tel No. :</b>
                    <div class='input-customer-tel'>${docData['CusTel']}</div>
                    <b class='customer-title'>Mobile :</b>
                    <div class='input-customer-mobile'>${docData['Technicain_Tel']}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Email :</b>
                    <div class='input-customer-email'>${docData['Technicain_E-mail']}</div>
                  </div>
                </div>
                <div class='qt-sale-detail'>
                  <div class='row qt-num-row'>
                    <b class='customer-title'>Quotation No. :</b>
                    <div class='input-qt-num'>${doc_no}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Quotation Date :</b>
                    <div class='input-qt-date'>${setDateFormatBE(docData['Quotation_Date'], docData['Qt_Lang'])}</div>
                    <div class='input-qt-time'>${docData['Quotation_Time']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Sale Name :</b>
                    <div class='input-sale-firstname'>${docData['Sales_Name']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Tel NO. :</b>
                    <span class='sale-tel'>022577111</span>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Mobile :</b>
                    <div class='input-sale-mobile'>${docData['Sales_Mobile']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Email :</b>
                    <div class='input-sale-mobile'>${docData['Sales_Email']}</div>
                  </div>
                </div>
              </div>`
    //Table zone
    if(docData['Desciption_R3']) {
      docData['Desciption_R3'] = docData['Desciption_R3'].split('\t').join('&nbsp;&nbsp;')
      docData['Desciption_R3'] = docData['Desciption_R3'].split('\n').join('<br>')
      docData['Desciption_R3'] = docData['Desciption_R3'].split('  ').join('&nbsp;&nbsp;')
    }
    if(docData['Desciption_R4']) {
      docData['Desciption_R4'] = docData['Desciption_R4'].split('\t').join('&nbsp;&nbsp;')
      docData['Desciption_R4'] = docData['Desciption_R4'].split('\n').join('<br>')
      docData['Desciption_R4'] = docData['Desciption_R4'].split('  ').join('&nbsp;&nbsp;')
    }
    if(!Number(docData['Qty_R2'])) {docData['Qty_R2'] = ""}
    if(!Number(docData['Unit_Price_R2'])) {docData['Unit_Price_R2'] = ""}
    if(!Number(docData['Amount_R2'])) {docData['Amount_R2'] = ""}
    html += `<div class='qt-table-block'>
              <table class='qt-table'>
                <thead>
                  <tr class='qt-table-header-row'>
                    <th class='qt-table-header item-header'>Item</th>
                    <th class='qt-table-header'>Description</th>
                    <th class='qt-table-header qty-header'>Qty</th>
                    <th class='qt-table-header unit-header'>Unit</th>
                    <th class='qt-table-header price-header'>Unit Price</th>
                    <th class='qt-table-header amount-header'>Amount</th>
                  </tr>
                </thead>
                <tbody class='qt-table-body'>
                  <tr class='qt-data-row'>
                    <td class='qt-table-cell qt-data-first-row qt-data'>${docData['Item_R2']}</td>
                    <td class='qt-table-cell qt-data-first-row'><div class='description-data'>${docData['Desciption_R2S1']}&nbsp;${docData['Desciption_R2S2']}&nbsp;${docData['Desciption_R2S3']}&nbsp;${docData['Desciption_R2S4']}&nbsp;</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToCommaNoFix(docData['Qty_R2'])}</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToComma(docData['Unit_R2'])}</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToComma(docData['Unit_Price_R2'])}</div></td>
                    <td class='qt-table-cell qt-data-first-row'><div class='qt-data'>${numberToComma(docData['Amount_R2'])}</div></td>
                  </tr>

                  <tr class='qt-data-row'>
                    <td class='qt-table-cell'><div class='qt-data'>${docData['Item_R3']}</div></td>`
                  if(docData['Service'] != 'Outsource') {
                    html += ` <td class='qt-table-cell'>
                                <b class='service-spec-title'>Service Specification :</b>
                              </td>`
                  } else {
                    html += ` <td class='qt-table-cell'>
                                <b class='description-data'>Scope of Work :</b>
                                <span class='scope-work-description'>${docData['Desciption_R3']}</span>
                              </td>`
                  }
          html += `
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                  </tr>`
          if(docData['Service_Specs'].length) {
            for(let i=0; i< docData['Service_Specs'].length; i++) {
              docData['Service_Specs'][i].value[1].value = docData['Service_Specs'][i].value[1].value.split('\t').join('&nbsp;&nbsp;')
              docData['Service_Specs'][i].value[1].value = docData['Service_Specs'][i].value[1].value.split('\n').join('<br>')
              docData['Service_Specs'][i].value[1].value = docData['Service_Specs'][i].value[1].value.split('  ').join('&nbsp;&nbsp;')
              if(!Number(docData['Service_Specs'][i].value[2].value)) {docData['Service_Specs'][i].value[2].value = ""}
              if(!Number(docData['Service_Specs'][i].value[4].value)) {docData['Service_Specs'][i].value[4].value = ""}
              if(!Number(docData['Service_Specs'][i].value[5].value)) {docData['Service_Specs'][i].value[5].value = ""}
              html += `
                      <tr class='qt-data-row'>
                        <td class='qt-table-cell'><div class='qt-data'>${docData['Service_Specs'][i].value[0].value}</div></td>
                        <td class='qt-table-cell'><div class='description-data'>${docData['Service_Specs'][i].value[1].value}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToCommaNoFix(docData['Service_Specs'][i].value[2].value)}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${docData['Service_Specs'][i].value[3].value}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Service_Specs'][i].value[4].value)}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Service_Specs'][i].value[5].value)}</div></td>
                      </tr>`
            }
          }
          if(!Number(docData['Qty_R4'])) {docData['Qty_R4'] = ""}
          if(!Number(docData['Unit_Price_R4'])) {docData['Unit_Price_R4'] = ""}
          if(!Number(docData['Amount_R4'])) {docData['Amount_R4'] = ""}
          html += `
                  <tr class='qt-data-row'>
                    <td class='qt-table-cell'><div class='qt-data'>${docData['Item_R4']}</div></td>
                    <td class='qt-table-cell'><div class='description-data'>${docData['Desciption_R4']}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToCommaNoFix(docData['Qty_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Unit_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Unit_Price_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Amount_R4'])}</div></td>
                  </tr>
                  <tr>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                  </tr>`
            if(docData['QT_Type'] == 'Renew&Discount') {
              html += `<tr class='qt-data-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <b class='total-before-discount'>Total</b>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Total_Unit_Price'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Total_Amount'])}</div></td>
              </tr>
              <tr class='qt-data-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <div class='dicount-block'>
                      <b class='discount-title'>Discount</b>
                      <div class='discount'>${numberToComma(docData['Discount'])}</div>
                      <span class='percent-discount'>%</span>
                    </div>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Discount_UnitPrice'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Discount_Amount'])}</div></td>
              </tr>
              <tr class='after-discount-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <b class='total-before-discount'>Total After Discount</b>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['After_Discount_UnitPrice'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['After_Discount_Amount'])}</div></td>
              </tr>`
            }
            
          html += `</tbody>
            <tfoot>
                <tr>
                  <td colspan='3' rowspan='2' class='qt-table-footer'>
                    <div class='row'>
                      <div class='period-block service-time-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>Minimum Contract Period :</b>`
                      } else {
                        html += `<b class='period-title'>ระยะเวลาการให้บริการขั้นต่ำ :</b>`
                      }
                      html += `<div class='row input-period-block'>
                          <div class='input-period'>${docData['Contract']}</div>
                          <div class='input-unit-period'>${docData['Contract_Unit']}</div>
                        </div>
                      </div>
                      <div class='period-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>Start Date</b>`
                      } else {
                        html += `<b class='period-title'>วันที่เริ่มสัญญา</b>`
                      }
                      html += `<div class='input-start-date'>${setDateFormatBE(docData['StartDate'],docData['Qt_Lang'])}</div>
                      </div>
                      <div class='period-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>End Date</b>`
                      } else {
                        html += `<b class='period-title'>วันที่สิ้นสุดสัญญา</b>`
                      }
                      html += `<div class='input-end-date'>${setDateFormatBE(docData['EndDate'],docData['Qt_Lang'])}</div>
                      </div>
                    </div>
                  </td>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>Total</b></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Unit_Price'])}</div></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Amount'])}</div></td>
                </tr>
                <tr>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>Vat</b></td>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>7%</b></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Vat'])}</div></td>
                </tr>
                <tr>
                  <td colspan='5' class='qt-table-footer grand-total-title'><b>Grand Total</b></td>
                  <td class='qt-table-footer'><div class='input-total'>${numberToComma(docData['Grand_Total'])}</div></td>
                </tr>
              </tfoot>
            </table>
          </div>`
      //Table foot zone
      if(docData['Qt_Lang'] == 'eng') {
        html += `<div class='row condition-title-block'>`
        html += `<b class='condition-title'>Term & Condition</b>`
      } else {
        html += `<div class='row'>
              <b class='note-qt'>หมายเหตุ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กรณีลูกค้าต้องการใช้บริการ INET Privacy Box ลูกค้าต้องดำเนินการลงนามรับทราบข้อตกลงการใช้บริการ INET Privacy Box หน้าที่ 2 เพิ่มเติม</b> <!-- it is in every services except Outsource -->
            </div>
            <div class='row'>`
        html += `<b class='condition-title'>เงื่อนไขการให้บริการ</b>`
      }
    html += `</div>
            <hr class='condition-line'>
              <div class='row'>`
    if(docData['Qt_Lang'] == 'eng') {
      var massTag = ['Cloud Compliance', 'Cloud Enterprise', 'Cloud Commercial', 'Cloud Other', 'Trading', 'IDC', 'Other Products', 'Lead project', 'INET Log', 'One Box', 'One Conference', 'Zimbra mail', 'CA', 'One Collaboration', 'Network', 'Platform', 'INET-Container', 'Paperless', 'E-tax', 'One Collaboration']
      docData['Term_Condition'] = docData['Term_Condition'].split('\t').join('&nbsp;&nbsp;')
      docData['Term_Condition'] = docData['Term_Condition'].split('\n').join('<br>')
      docData['Term_Condition'] = docData['Term_Condition'].split('  ').join('&nbsp;&nbsp;')
      if(massTag.includes(docData['Service'])) {
        html += `<p class='condition-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'Outsource' || docData['Service'] == 'Alibaba') {
        html += `<p class='condition-outsource-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'INET Consent Management Platform') {
        html += `<p class='condition-consent-part'>${docData['Term_Condition']}</p>`
      }
      html += `</div>`

      var certArray = ['Outsource', 'Alibaba']
      if(!certArray.includes(docData['Service'])) {
        html += `
        <hr class='condition-end-line'>
        <b class='certify-text'>INET Company Certified</b><br>
        <b class='certify-text'>ISO/IEC 20000-1:2011 (Information Technology Service Management), ISO/IEC 27001:2013 (Information Security Management)</b><br>
        <b class='certify-text'>ISO/IEC 27799:2016 (Health informatics-Information security), ISO/IEC 22301:2012 (Business Continuity Management)</b><br>
        <b class='certify-text'>ISO 27017:2015 (Cloud security), CSA Security, Trust & Assurance Registry (STAR), มาตรฐาน ISO/IEC 27018:2014</b>`
      }
      if(docData['Service'] == 'Outsource') {
        html += `
        <hr class='condition-end-outsource-line'>
          <div class='row outsource-bank-first outsource-bank-part'>
            <span>Advance deposit transfer amount of</span>
            <div class='money-outsource'>${docData['Outsoure_Prepaid']}</div>
            <span>Baht</span>
          </div>
          <div class='row outsource-bank-part'>${docData['Outsource_Bank']}</div>
          <div class='row outsource-bank-part'>Account number ${docData['Outsource_Account_No']}</div>
          <div class='row outsource-bank-part'>Account name ${docData['Outsource_Account_Name']}</div>`
      }
    } else {
      var massTag = ['Other Products', 'Lead project', 'INET Log', 'One Box', 'One Conference', 'Zimbra mail', 'CA', 'One Collaboration', 'Network', 'Platform', 'INET-Container', 'Paperless', 'Cloud Compliance','Cloud Enterprise', 'Cloud Commercial', 'Cloud Other', 'Trading', 'IDC', 'INET Cybersecurity', 'One Collaboration']
      docData['Term_Condition'] = docData['Term_Condition'].split('\t').join('&nbsp;&nbsp;')
      docData['Term_Condition'] = docData['Term_Condition'].split('\n').join('<br>')
      docData['Term_Condition'] = docData['Term_Condition'].split('  ').join('&nbsp;&nbsp;')
      if(massTag.includes(docData['Service'])) {
        html += `<p class='condition-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'Outsource') {
        html += `<p class='condition-outsource-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'E-tax') {
        html += `<p class='condition-etax-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'INET Consent Management Platform') {
        html += `<p class='condition-consent-part'>${docData['Term_Condition']}</p>`
      }
      html += `</div>`

      var certArray = ['Outsource', 'INET Consent Management Platform', 'INET Cybersecurity']
      if(!certArray.includes(docData['Service'])) {
        html += `
        <hr class='condition-end-line'>
        <b class='certify-text'>INET Company Certified</b><br>
        <b class='certify-text'>ISO/IEC 20000-1:2011 (Information Technology Service Management), ISO/IEC 27001:2013 (Information Security Management)</b><br>
        <b class='certify-text'>ISO/IEC 27799:2016 (Health informatics-Information security), ISO/IEC 22301:2012 (Business Continuity Management)</b><br>
        <b class='certify-text'>ISO 27017:2015 (Cloud security), CSA Security, Trust & Assurance Registry (STAR), มาตรฐาน ISO/IEC 27018:2014</b>`
      }
      if(docData['Service'] == 'Outsource') {
        html += `
        <hr class='condition-end-outsource-line'>
          <div class='row outsource-bank-first outsource-bank-part'>
            <span>ยอดโอนมัดจำล่วงหน้า จำนวน</span>
            <div class='money-outsource'>${docData['Outsoure_Prepaid']}</div>
            <span>บาท</span>
          </div>
          <div class='row outsource-bank-part'>${docData['Outsource_Bank']}</div>
          <div class='row outsource-bank-part'>บัญชีเลขที่ ${docData['Outsource_Account_No']}</div>
          <div class='row outsource-bank-part'>ชื่อบัญชี ${docData['Outsource_Account_Name']}</div>`
      }
    }
    
    
    html += `<div class='sign-table-block'>
              <table class='sign-table'>
                <tr>
                  <th class='sign-table-border sign-table-header customer-sign-header'>Acceptance By Customer</th>
                  <th colspan='2' class='sign-table-border sign-table-header'>Internet Thailand Public Co.,Ltd.</th>
                </tr>
                <tr>
                  <td class='sign-table-border'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>We agree to order the service as quoted</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row note-customer-sign-row'>
                        <span class='note-customer-sign'>Signature of Authorized Person with Company's Seal</span>
                      </div>
                      <div class='row'>
                        <b class='customer-position-sign-title'>Position :</b>
                        <div class='input-customer-position'></div>
                      </div>
                      <div class='row'>
                        <b class='customer-position-sign-title'>Date :</b>
                        <div class='input-customer-sign-date'></div>
                      </div>
                    </div>  
                  </td>
                  <td class='sign-table-border qt-sign-cell'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>Quoted By</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row name-sign-row'>
                        <span class='parentheses-name'>(</span>
                        <div class='name-sign-box'>${docData['Sales_Name']}</div>
                        <span class='parentheses-name'>)</span>
                      </div>
                      <div class='row'>
                        <b class='qt-position-title'>Position :</b>
                        <div class='input-qt-position'>${docData['Sales_Role']}</div>
                      </div>
                    </div>
                  </td>
                  <td class='sign-table-border'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>Approved By</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row name-sign-row'>
                        <span class='parentheses-name'>(</span>
                        <div class='input-name-approve'>${docData['SBM_Name']}</div>
                        <span class='parentheses-name'>)</span>
                      </div>
                      <div class='row'>
                        <b class='qt-position-title'>Position</b>
                        <div class='input-qt-position'>${docData['SBM_Role']}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>`
    html += `</div></div>` //close size and set
    
    if(docData['ExtraPage'] && docData['ExtraPage'].count > 0) {
      for(let x=0; x < docData['ExtraPage'].count; x++) {
        html += `<div style='page-break-before: always;'></div>`
        html += `<div class='paper'><div class='frame'>` //open size and frame
        html += `<div class='row'>
              <div>
                <img src='https://eform.one.th/eform_api/api/v1/view_image?file_name=25020637504_a885d44f-093f-4021-8987-bdc86532f858.png' width='173.97px' class='logo-img'>
              </div>
              <div class='header-block'>
                <div class='row inet-header-row'>
                  <b class='inet-header'>Internet Thailand Public Company Limited</b>
                </div>
                <div class='row'>
                  <span class='address1'>1768 Thai Summit Tower, 10th - 12th Floor and IT Floor</span>
                </div>
                <div class='row'>
                  <span class='address2'>New Petchaburi Road, Khwaeng Bang Kapi, Khet Huay Khwang, Bangkok 10310</span>
                </div>
              </div>
            </div>`
        html += `<div class='row'>
              <b class='qt-title'>Quotation / Purchase Order</b>
              <span class='tel-num'>Tel. (662) 257 7000 Fax (662) 257 1376, (662) 257 1379</span>
            </div>`
        //Head zone
        var cusname = `${docData['Cusname_thai']}`
        if(docData['Qt_Lang'] == 'eng') { cusname = `${docData['Cusname_Eng']}` }
        var techname = `${docData['Technicain_Name']}`
        // var techname = `คุณ ${docData['Technicain_Name']}`
        // if(docData['Qt_Lang'] == 'eng') { techname = `K. ${docData['Technicain_Name']}` }
        html += ` <div class='row qt-header-block'>
                <div class='customer-detail'>
                  <div class='row'>
                    <b class='customer-title'>Customer Name :</b>
                    <div class='input-customer-name'>${techname}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Company Name :</b>
                    <div class='input-customer-name'>${cusname}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Address :</b>
                    <div class='input-customer-address'>
                      <div class='customer-address-line'></div><div class='customer-address-line2'></div>
                      ${docData['Address']}
                    </div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Tel No. :</b>
                    <div class='input-customer-tel'>${docData['CusTel']}</div>
                    <b class='customer-title'>Mobile :</b>
                    <div class='input-customer-mobile'>${docData['Technicain_Tel']}</div>
                  </div>
                  <div class='row customer-detail-row'>
                    <b class='customer-title'>Email :</b>
                    <div class='input-customer-email'>${docData['Technicain_E-mail']}</div>
                  </div>
                </div>
                <div class='qt-sale-detail'>
                  <div class='row qt-num-row'>
                    <b class='customer-title'>Quotation No. :</b>
                    <div class='input-qt-num'>${doc_no}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Quotation Date :</b>
                    <div class='input-qt-date'>${setDateFormatBE(docData['Quotation_Date'], docData['Qt_Lang'])}</div>
                    <div class='input-qt-time'>${docData['Quotation_Time']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Sale Name :</b>
                    <div class='input-sale-firstname'>${docData['Sales_Name']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Tel NO. :</b>
                    <span class='sale-tel'>022577111</span>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Mobile :</b>
                    <div class='input-sale-mobile'>${docData['Sales_Mobile']}</div>
                  </div>
                  <div class='row qt-sale-row'>
                    <b class='customer-title'>Email :</b>
                    <div class='input-sale-mobile'>${docData['Sales_Email']}</div>
                  </div>
                </div>
              </div>`
          //Table zone
          if(docData['ExtraPage']['extras'][x]['Desciption_R4']) {
            docData['ExtraPage']['extras'][x]['Desciption_R4'] = docData['ExtraPage']['extras'][x]['Desciption_R4'].split('\t').join('&nbsp;&nbsp;')
            docData['ExtraPage']['extras'][x]['Desciption_R4'] = docData['ExtraPage']['extras'][x]['Desciption_R4'].split('\n').join('<br>')
            docData['ExtraPage']['extras'][x]['Desciption_R4'] = docData['ExtraPage']['extras'][x]['Desciption_R4'].split('  ').join('&nbsp;&nbsp;')
          }
          html += `<div class='qt-table-block'>
              <table class='qt-table'>
                <thead>
                  <tr class='qt-table-header-row'>
                    <th class='qt-table-header item-header'>Item</th>
                    <th class='qt-table-header'>Description</th>
                    <th class='qt-table-header qty-header'>Qty</th>
                    <th class='qt-table-header unit-header'>Unit</th>
                    <th class='qt-table-header price-header'>Unit Price</th>
                    <th class='qt-table-header amount-header'>Amount</th>
                  </tr>
                </thead>
                <tbody class='qt-table-body'>`
          if(docData['ExtraPage']['extras'][x]['Service_Specs'].length) {
            for(let i=0; i< docData['ExtraPage']['extras'][x]['Service_Specs'].length; i++) {
              docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value = docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value.split('\t').join('&nbsp;&nbsp;')
              docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value = docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value.split('\n').join('<br>')
              docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value = docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value.split('  ').join('&nbsp;&nbsp;')
              if(!Number(docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[2].value)) {docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[2].value = ""}
              if(!Number(docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[4].value)) {docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[4].value = ""}
              if(!Number(docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[5].value)) {docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[5].value = ""}
              html += `
                      <tr class='qt-data-row'>
                        <td class='qt-table-cell'><div class='qt-data'>${docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[0].value}</div></td>
                        <td class='qt-table-cell'><div class='description-data'>${docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[1].value}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToCommaNoFix(docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[2].value)}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[3].value}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[4].value)}</div></td>
                        <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['ExtraPage']['extras'][x]['Service_Specs'][i].value[5].value)}</div></td>
                      </tr>`
            }
          }
          if(!Number(docData['Qty_R4'])) {docData['Qty_R4'] = ""}
          if(!Number(docData['Unit_Price_R4'])) {docData['Unit_Price_R4'] = ""}
          if(!Number(docData['Amount_R4'])) {docData['Amount_R4'] = ""}
          html += `
                  <tr class='qt-data-row'>
                    <td class='qt-table-cell'><div class='qt-data'>${docData['Item_R4']}</div></td>
                    <td class='qt-table-cell'><div class='description-data'>${docData['ExtraPage']['extras'][x]['Desciption_R4']}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToCommaNoFix(docData['Qty_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Unit_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Unit_Price_R4'])}</div></td>
                    <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Amount_R4'])}</div></td>
                  </tr>
                  <tr>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                    <td class='qt-table-cell'></td>
                  </tr>`
            if(docData['QT_Type'] == 'Renew&Discount') {
              html += `<tr class='qt-data-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <b class='total-before-discount'>Total</b>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Total_Unit_Price'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Total_Amount'])}</div></td>
              </tr>
              <tr class='qt-data-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <div class='dicount-block'>
                      <b class='discount-title'>Discount</b>
                      <div class='discount'>${numberToComma(docData['Discount'])}</div>
                      <span class='percent-discount'>%</span>
                    </div>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Discount_UnitPrice'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['Discount_Amount'])}</div></td>
              </tr>
              <tr class='after-discount-row'>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'>
                  <div class='row discount-row'>
                    <b class='total-before-discount'>Total After Discount</b>
                  </div>
                </td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'></div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['After_Discount_UnitPrice'])}</div></td>
                <td class='qt-table-cell'><div class='qt-data'>${numberToComma(docData['After_Discount_Amount'])}</div></td>
              </tr>`
            }
            
          html += `</tbody>
            <tfoot>
                <tr>
                  <td colspan='3' rowspan='2' class='qt-table-footer'>
                    <div class='row'>
                      <div class='period-block service-time-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>Minimum Contract Period :</b>`
                      } else {
                        html += `<b class='period-title'>ระยะเวลาการให้บริการขั้นต่ำ :</b>`
                      }
                      html += `<div class='row input-period-block'>
                          <div class='input-period'>${docData['Contract']}</div>
                          <div class='input-unit-period'>${docData['Contract_Unit']}</div>
                        </div>
                      </div>
                      <div class='period-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>Start Date</b>`
                      } else {
                        html += `<b class='period-title'>วันที่เริ่มสัญญา</b>`
                      }
                      html += `<div class='input-start-date'>${setDateFormatBE(docData['StartDate'],docData['Qt_Lang'])}</div>
                      </div>
                      <div class='period-block'>`
                      if(docData['Qt_Lang'] == 'eng') {
                        html += `<b class='period-title'>End Date</b>`
                      } else {
                        html += `<b class='period-title'>วันที่สิ้นสุดสัญญา</b>`
                      }
                      html += `<div class='input-end-date'>${setDateFormatBE(docData['EndDate'],docData['Qt_Lang'])}</div>
                      </div>
                    </div>
                  </td>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>Total</b></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Unit_Price'])}</div></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Amount'])}</div></td>
                </tr>
                <tr>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>Vat</b></td>
                  <td class='qt-table-footer total-cell total-block'><b class='total-title'>7%</b></td>
                  <td class='qt-table-footer total-cell'><div class='input-total'>${numberToComma(docData['Total_Vat'])}</div></td>
                </tr>
                <tr>
                  <td colspan='5' class='qt-table-footer grand-total-title'><b>Grand Total</b></td>
                  <td class='qt-table-footer'><div class='input-total'>${numberToComma(docData['Grand_Total'])}</div></td>
                </tr>
              </tfoot>
            </table>
          </div>`
      //Table foot zone
      if(docData['Qt_Lang'] == 'eng') {
        html += `<div class='row condition-title-block'>`
        html += `<b class='condition-title'>Term & Condition</b>`
      } else {
        html += `<div class='row'>
              <b class='note-qt'>หมายเหตุ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;กรณีลูกค้าต้องการใช้บริการ INET Privacy Box ลูกค้าต้องดำเนินการลงนามรับทราบข้อตกลงการใช้บริการ INET Privacy Box หน้าที่ 2 เพิ่มเติม</b> <!-- it is in every services except Outsource -->
            </div>
            <div class='row'>`
        html += `<b class='condition-title'>เงื่อนไขการให้บริการ</b>`
      }
    html += `</div>
            <hr class='condition-line'>
              <div class='row'>`
    if(docData['Qt_Lang'] == 'eng') {
      var massTag = ['Cloud Compliance', 'Cloud Enterprise', 'Cloud Commercial', 'Cloud Other', 'Trading', 'IDC', 'Other Products', 'Lead project', 'INET Log', 'One Box', 'One Conference', 'Zimbra mail', 'CA', 'One Collaboration', 'Network', 'Platform', 'INET-Container', 'Paperless', 'E-tax', 'One Collaboration']
      docData['Term_Condition'] = docData['Term_Condition'].split('\t').join('&nbsp;&nbsp;')
      docData['Term_Condition'] = docData['Term_Condition'].split('\n').join('<br>')
      docData['Term_Condition'] = docData['Term_Condition'].split('  ').join('&nbsp;&nbsp;')
      if(massTag.includes(docData['Service'])) {
        html += `<p class='condition-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'Outsource' || docData['Service'] == 'Alibaba') {
        html += `<p class='condition-outsource-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'INET Consent Management Platform') {
        html += `<p class='condition-consent-part'>${docData['Term_Condition']}</p>`
      }
      html += `</div>`

      var certArray = ['Outsource', 'Alibaba']
      if(!certArray.includes(docData['Service'])) {
        html += `
        <hr class='condition-end-line'>
        <b class='certify-text'>INET Company Certified</b><br>
        <b class='certify-text'>ISO/IEC 20000-1:2011 (Information Technology Service Management), ISO/IEC 27001:2013 (Information Security Management)</b><br>
        <b class='certify-text'>ISO/IEC 27799:2016 (Health informatics-Information security), ISO/IEC 22301:2012 (Business Continuity Management)</b><br>
        <b class='certify-text'>ISO 27017:2015 (Cloud security), CSA Security, Trust & Assurance Registry (STAR), มาตรฐาน ISO/IEC 27018:2014</b>`
      }
      if(docData['Service'] == 'Outsource') {
        html += `
        <hr class='condition-end-outsource-line'>
          <div class='row outsource-bank-first outsource-bank-part'>
            <span>Advance deposit transfer amount of</span>
            <div class='money-outsource'>${docData['Outsoure_Prepaid']}</div>
            <span>Baht</span>
          </div>
          <div class='row outsource-bank-part'>${docData['Outsource_Bank']}</div>
          <div class='row outsource-bank-part'>Account number ${docData['Outsource_Account_No']}</div>
          <div class='row outsource-bank-part'>Account name ${docData['Outsource_Account_Name']}</div>`
      }
    } else {
      var massTag = ['Other Products', 'Lead project', 'INET Log', 'One Box', 'One Conference', 'Zimbra mail', 'CA', 'One Collaboration', 'Network', 'Platform', 'INET-Container', 'Paperless', 'Cloud Compliance','Cloud Enterprise', 'Cloud Commercial', 'Cloud Other', 'Trading', 'IDC', 'INET Cybersecurity', 'One Collaboration']
      docData['Term_Condition'] = docData['Term_Condition'].split('\t').join('&nbsp;&nbsp;')
      docData['Term_Condition'] = docData['Term_Condition'].split('\n').join('<br>')
      docData['Term_Condition'] = docData['Term_Condition'].split('  ').join('&nbsp;&nbsp;')
      if(massTag.includes(docData['Service'])) {
        html += `<p class='condition-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'Outsource') {
        html += `<p class='condition-outsource-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'E-tax') {
        html += `<p class='condition-etax-part'>${docData['Term_Condition']}</p>`
      } else if(docData['Service'] == 'INET Consent Management Platform') {
        html += `<p class='condition-consent-part'>${docData['Term_Condition']}</p>`
      }
      html += `</div>`

      var certArray = ['Outsource', 'INET Consent Management Platform', 'INET Cybersecurity']
      if(!certArray.includes(docData['Service'])) {
        html += `
        <hr class='condition-end-line'>
        <b class='certify-text'>INET Company Certified</b><br>
        <b class='certify-text'>ISO/IEC 20000-1:2011 (Information Technology Service Management), ISO/IEC 27001:2013 (Information Security Management)</b><br>
        <b class='certify-text'>ISO/IEC 27799:2016 (Health informatics-Information security), ISO/IEC 22301:2012 (Business Continuity Management)</b><br>
        <b class='certify-text'>ISO 27017:2015 (Cloud security), CSA Security, Trust & Assurance Registry (STAR), มาตรฐาน ISO/IEC 27018:2014</b>`
      }
      if(docData['Service'] == 'Outsource') {
        html += `
        <hr class='condition-end-outsource-line'>
          <div class='row outsource-bank-first outsource-bank-part'>
            <span>ยอดโอนมัดจำล่วงหน้า จำนวน</span>
            <div class='money-outsource'>${docData['Outsoure_Prepaid']}</div>
            <span>บาท</span>
          </div>
          <div class='row outsource-bank-part'>${docData['Outsource_Bank']}</div>
          <div class='row outsource-bank-part'>บัญชีเลขที่ ${docData['Outsource_Account_No']}</div>
          <div class='row outsource-bank-part'>ชื่อบัญชี ${docData['Outsource_Account_Name']}</div>`
      }
    }
    
    
    html += `<div class='sign-table-block'>
              <table class='sign-table'>
                <tr>
                  <th class='sign-table-border sign-table-header customer-sign-header'>Acceptance By Customer</th>
                  <th colspan='2' class='sign-table-border sign-table-header'>Internet Thailand Public Co.,Ltd.</th>
                </tr>
                <tr>
                  <td class='sign-table-border'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>We agree to order the service as quoted</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row note-customer-sign-row'>
                        <span class='note-customer-sign'>Signature of Authorized Person with Company's Seal</span>
                      </div>
                      <div class='row'>
                        <b class='customer-position-sign-title'>Position :</b>
                        <div class='input-customer-position'></div>
                      </div>
                      <div class='row'>
                        <b class='customer-position-sign-title'>Date :</b>
                        <div class='input-customer-sign-date'></div>
                      </div>
                    </div>  
                  </td>
                  <td class='sign-table-border qt-sign-cell'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>Quoted By</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row name-sign-row'>
                        <span class='parentheses-name'>(</span>
                        <div class='name-sign-box'>${docData['Sales_Name']}</div>
                        <span class='parentheses-name'>)</span>
                      </div>
                      <div class='row'>
                        <b class='qt-position-title'>Position :</b>
                        <div class='input-qt-position'>${docData['Sales_Role']}</div>
                      </div>
                    </div>
                  </td>
                  <td class='sign-table-border'>
                    <div class='customer-sign-cell'>
                      <div class='row'>
                        <b class='customer-sign-title'>Approved By</b>
                      </div>
                      <div class='customer-sign-box'></div>
                      <div class='row name-sign-row'>
                        <span class='parentheses-name'>(</span>
                        <div class='input-name-approve'>${docData['SBM_Name']}</div>
                        <span class='parentheses-name'>)</span>
                      </div>
                      <div class='row'>
                        <b class='qt-position-title'>Position</b>
                        <div class='input-qt-position'>${docData['SBM_Role']}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>`

        html += `</div></div>` //close size and set
      }
    }
    html += `</body>` //close body tag
    if(docData['Qt_Lang'] == 'eng') {
      html = addClassQtEn(html)
    } else {
      html = addClassQtThai(html)
    }
    return html
  } catch (error) {
    console.log(error)
    return ''
  }
}

function dataToJsonKey(data, type) {
  try {
    var jsonData = {}
    data.forEach(e => {
      if(e) {
        if(e.value == null || typeof e.value === 'undefined' || e.value == 'undefined' || e.value == 'null') {
          e.value = ''
        }
        jsonData[e.key] = e.value
        if(type == 'QT') {
          if(jsonData[e.key] === 0 || jsonData[e.key] == '0') {
            jsonData[e.key] = ''
          }
        }
        if(e.key == 'Service_Table') {
          var holdArray = []
          e.value.forEach(s => {
            s.forEach(ss => {
              holdArray.push(ss.value)
            })
          })
          jsonData[e.key] = holdArray
        }
      }
    })
  
    return jsonData
  } catch (error) {
    return {}
  }
}

function addClassCs(html) {
  html += `
  <style>
@import url('https://fonts.googleapis.com/css?family=Sarabun&display=swap');
  

.paper_size{
  width: 1190px;
  height: 1666px;
  background-color: white;
}

.paper_set_p3{
  position: relative;
  padding-top: 130px;
  padding-left: 45px;
  padding-right: 20px;
}

.paper_set{
  position: relative;
  height: 100%;
}

.display_body{
  display: inline-flex;
}

.font_set{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
}

.tab_size{
  margin-right: 10px;
}

.tab_size_img{
  margin-right: 3px;
}

.start_date{
  width: 143.94px;
}

.set_center{
  text-align: center;
}

.set_left{
  text-align: left;
}

.end_date_p3{
  width: 159.88px;
}

.end_date{
  margin-left: 23px;
}

.start_contract{
  width: 100px;
}

.payment_periodt{
  width: 75px;
}

.month_set{
  width: 61px;
}

.set_lesson{
  width: 47.97px;
}

.set_top{
  margin-top: 25px;
}

.set_textarea{
  width: 992.91px;
  height: 83.91px;
}

.set_top2{
  margin-top: 20px;
}

.set_top3{
  margin-top: 5px;
}

.condition_set{
  width: 250px;
}

.set_atocompletes_one{
  width: 400px;
}

.set_left{
  margin-left: 160px;
}

.please_specify{
  width: 719.84px;
}

.set_table{
  margin-top: 5px;
  width: 100%;
}

.table_set{
  border-collapse: collapse;
  width: 100%;
}

.table_td_th{
  border: 1px solid black;
}

.table_height_th_p3{
  height: 22px;
}

.table_height_th{
  height: 30px;
}

.font_list{
  font-family: 'Sarabun', sans-serif;
  font-size: 11px;
}

.font_start_date{
  font-family: 'Sarabun', sans-serif;
  font-size: 12px;
}

.bgcolor_table{
  background: rgb(200, 230, 201);
}

.bgcolor_table_p3{
  background: rgb(255, 205, 210);;
}

.bgcolor_table2_p3{
  background: rgb(251, 233, 231);
}

.bgcolor_table3_p3{
  background: rgb(239, 154, 154);
}

.bgcolor_table1{
  background: rgb(225, 245, 254);
}

.bgcolor_table2{
  background: rgb(255, 245, 157);
}

.bgcolor_table3{
  background: rgb(220, 237, 200);
}

.bgcolor_table4{
  background: rgb(197, 225, 165);;
}

.set_total_left{
  margin-left: 5px;
}

.total_invoice{
  width: 161.88px;
}

.set_input1{
  width: 78.84px;
}

.invoice_balance{
  width: 100px;
}

.set_input2{
  width: 80.94px;
}

.table_one{
  width: 99%;
}

.table_one_p2{
  width: 99%;
  margin-left: 2px;
  margin-top: 50px;
}

.approve-table {
  border-collapse: collapse;
}

.table_end{
  margin-bottom: 2px;
}

.td_center{
  text-align: center;
}

.td_right{
  text-align: right;
}

.set_top_table{
  margin-top: 10px;
}

.service_name{
  text-align: left;
  background: rgb(200, 230, 201);
  font-size: 13px;
}

.make_contract{
  margin-top: 3px;
}

.choice_size{
  width: 85px;
}

.font_prorate{
  font-family: 'Sarabun', sans-serif;
  font-size: 11px;
}

.font_table{
  font-family: 'Sarabun', sans-serif;
  font-size: 10px;
}

.font_table2{
  font-family: 'Sarabun', sans-serif;
  font-size: 12px;
}

.ex_set_font{
  font-family: 'Sarabun', sans-serif;
  font-size: 12px;
  margin-top: 4px;
}

.table_height_td{
  height: 30px;
}

.table_footer_height_th{
  height: 25px;
  font-weight: unset;
}

.table_footer_height_td{
  height: 90px;
}

.font_fix{
  width: 1190px;
  font-family: 'Sarabun', sans-serif;
  text-align: center;
}

.img_size{
  display:inline-flex;
  width: 150px;
  height: 75px;
  margin-left: 20px;
  margin-top: 10px;
}

.title_head{
  display: inline-flex;
  background-color: rgb(220, 237, 200);
  margin-left: 20px;
  width: 990px;
  height: 81px;
  vertical-align: top;
  margin-top: 10px;
}

.doc_form{
  font-family: 'Sarabun', sans-serif;
  font-size: 15px;
  margin-top: 5px;
}

.pos_between{
  width: 319px;
}

.pos_between1{
  width: 119px;
}

.top_pos{
  margin-top: 7px;
}

.doc_type{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px;
}

.doc_size{
  margin-right: 15px;
}

.input_size{
  display: inline;
  margin-right: 5px;
}

.atocom_pletes{
  width: 121px;
  margin-right: 365px;
}

.cvm_id{
  width: 100px;
  margin-right: 156px;
}

.quotation{
  width: 160.94px;
}

.size_pos_top{
  margin-top: 8px;
}

.display_margin{
  width: 178px;
}

.display_margin_sites{
  width: 592.84px;
}

.type_bus{
  width: 342.94px;
}

.tel_display_margin{
  width: 155px;
}

.email_display_margin{
  width: 193.91px;
}

.status_display_margin{
  width: 184.91px;
}

.display_margin_technical{
  width: 257.91px;
}

.margin_l{
  margin-left: 28px
}

.l_margin{
  margin-left: 12px
}

.display_margin_s{
  width: 420.84px;
}

.display_margin_ato{
  width: 476px;
}

.service_ato{
  width: 108px;
}

.bath_so_type{
  width: 167px;
}

.margin_ato_dis{
  margin-left: 59px;
}

.display_start_date{
  width: 149px;
}

.so_type{
  margin-left: 30px;
}

.company_user{
  width: 97.91px;
}

.name_company_th{
  width: 300px;
}

.name_company_en{
  width: 318.84px;
}

.service_charge{
  width: 119px;
  text-align: center;
}

.zero_size{
  width: 99px;
  text-align: center;
}

.bath_month{
  width: 64px;
  text-align: center;
}

.left_day{
  margin-left: 119px;
}

.ex_day{
 margin-left: 160px;
}

.footer {
  position: absolute;
  width: 100%;
  bottom: 60px;
  left: 0px; 
  justify-content: center;
}

.employee_id{
  width: 105px;
  text-align: center;
}

.name{
  width: 277px;
}

.sale_team{
  width: 151px;
}

.type_size{
  width: 70px;
}

.zero_size1{
  width: 59px;
  text-align: center;
}

.day_prorate{
  width: 30px;
  text-align: center;
}

.ext_jv{
  width: 65px;
  text-align: center;
}

.total_revenue{
  width: 90px;
  text-align: center;
}

.thb{
  width: 40px;
  text-align: center;
}

.sale_factors{
  width: 80px;
  text-align: center;
}

.zero_size2{
  width: 60px;
  text-align: center;
}

.percentage{
  width: 50px;
  text-align: center;
}

.remark_input{
  width: 890px;
  height: 83.94px;
  padding-left: 120px;
}

.setting_paper{
  margin-top: 5px;
  padding-left: 15px;
}

.customer_details{
  margin-right: 15px;
}

.tab_null{
  margin-right: 5px;
}

.job-ref-input {
  width: 1085px;
}

.payperuse-title {
  margin-right: 5px;
  margin-left: 227px;
}

.payperuse-box {
  width: 30px;
}
</style>
  `

  return html
}

function addClassQtThai(html) {
  html += `<style>
  @import url('https://fonts.googleapis.com/css?family=Sarabun&display=swap');

 .paper {
   width: 1190px;
   height: 1666px;
   background-color: white;
   border: 1px solid lightgray;
 }

 .frame {
   width: 1142px;
   height: 1635px;
   border: 1px solid black;
   margin-left: auto;
   margin-right: auto;
   margin-top: 18px;
   position: relative;
 }

 .row {
   display: inline-flex;
   width: 100%;
 }

 .logo-img {
   margin-left: 3px;
 }

 .header-block {
   width: 100%;
 }

 .inet-header-row {
   margin-top: 12px;
 }

 .inet-header {
   font-family: 'Sarabun', sans-serif;
   font-size: 28px;
   width: 100%;
   text-align: right;
   margin-right: 12px;
 }

 .address1 {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   align-self: flex-end;
   margin-left: 663px;
 }

 .address2 {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin-left: 543px;
   align-self: flex-end;
 }

 .qt-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 22px;
   margin-left: 9px;
 }

 .tel-num {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin-left: 567px;
 }

 .qt-header-block {
   margin-top: 5px;
 }

 .customer-detail {
   border: 1px solid black;
   width: 586px;
   padding-left: 9px;
   padding-top: 5px;
   padding-bottom: 6px;
 }

 .customer-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
 }

 .input-customer-name {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 11px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 458px;
 }

 .customer-detail-row {
   margin-top: 3px;
 }

 .input-customer-address {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 18px;
   width: 501px;
   height: 43px;
   position: relative;
 }

  .customer-address-line {
    position: absolute;
    border-bottom-style: dotted;
    border-width: 2px;
    height: 18px;
    width: 100%;
  }

  .customer-address-line2 {
    position: absolute;
    top: 18px;
    border-bottom-style: dotted;
    border-width: 2px;
    height: 18px;
    width: 100%;
  }

 .input-customer-tel {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 23px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 200px;
   margin-right: 16px;
 }

 .input-customer-mobile {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 18px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 220px;
 }

 .input-customer-email {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 31px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 502px;
 }

 .qt-sale-detail {
   width: 545px;
   text-align: right;
 }

 .qt-num-row {
   justify-content: flex-end;
   margin-top: 19px;
 }

 .input-qt-num {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   width: 296px;
   text-align: left;
   margin-left: 7px;
   margin-right: 9px;
 }

 .qt-sale-row {
   justify-content: flex-end;
   margin-top: 3px;
 }

 .input-qt-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 7px;
   width: 186px;
 }

 .input-qt-time {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 2px;
   width: 109px;
   margin-right: 8px;
 }

 .input-sale-firstname {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 7px;
   width: 305px;
 }

 .sale-tel {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 7px;
   margin-right: 235px;
 }

 .input-sale-mobile {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 7px;
   width: 300px;
   margin-right: 4px;
 }

 .qt-table-block {
   margin-top: 4px;
 }

 .qt-table {
   table-layout: fixed;
   width: 100%;
   height: 825px;
   border: 1px solid black;
   border-collapse: collapse;
   background: url('https://eform.one.th/eform_api/api/v1/view_image?file_name=25020637504_4b05fffa-afa1-46b9-a5d7-3476339f44e6.png');
   background-repeat: no-repeat;
   background-position: center;
   background-size: 420px;
 }

 .qt-table-header-row {
   height: 25px;
 }

 .qt-table-header {
   border: 1px solid black;
   border-collapse: collapse;
   background-color: rgb(104, 159, 56);
   color: white;
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   padding-bottom: 3px;
 }

 .item-header {
   width: 44px;
 }

 .qty-header {
   width: 90px;
 }

 .unit-header {
   width: 93px;
 }

 .price-header {
   width: 122px;
 }

 .amount-header {
   width: 126px;
 }

 .qt-table-body {
   vertical-align: top !important;
 }

 .qt-table-cell {
   border-left: 1px solid black;
   border-right: 1px solid black;
   border-collapse: collapse;
 }

 .qt-data-first-row {
   padding-top: 18px;
 }

 .qt-data {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
 }

 .description-data {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   padding-left: 3px;
 }

 .qt-data-row {
   height: 21px;
 }

 .service-spec-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   padding-left: 21px;
 }

 .scope-work-description {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   margin-left: 14px;
 }

 .discount-row {
   justify-content: flex-end;
 }

 .total-before-discount {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   width: 177px;
 }

 .dicount-block {
   width: 177px;
   display: inline-flex;
 }

 .discount-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .discount {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 51px;
   margin-left: 39px;
 }

 .percent-discount {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .after-discount-row {
   height: 37px;
 }

 .qt-table-footer {
   border: 1px solid black;
   border-collapse: collapse;
 }

 .period-block {
   width: 192px;
   text-align: center;
 }

 .service-time-block {
   margin-left: 20px;
 }

 .period-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .input-period-block {
   justify-content: center;
   margin-top: 6px;
 }

 .input-period {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 54px;
 }

 .input-unit-period {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   width: 78px;
   margin-left: 3px;
   text-align: left;
 }

 .input-start-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 142px;
   margin: auto;
   margin-top: 6px;
 }

 .input-end-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 144px;
   margin: auto;
   margin-top: 6px;
 }

 .total-cell {
   height: 22px;
 }

 .total-block {
   text-align: center;
 }

 .total-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .input-total {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
 }

 .grand-total-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   color: white;
   background-color: rgb(104, 159, 56);
   text-align: center;
   height: 24px;
 }

 .note-qt {
   font-family: 'Sarabun', sans-serif;
   font-size: 10px;
   margin: auto;
 }

 .condition-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin: auto;
 }

 .condition-line {
   border-top: 1px solid black;
   margin-top: 1px;
   margin-bottom: 1px;
 }

 .condition-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 10px;
   margin-top: 7px;
   margin-bottom: 7px;
 }

 .condition-outsource-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin-top: 7px;
   margin-bottom: 7px;
 }

 .condition-etax-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 11px;
   margin-top: 0px;
   margin-bottom: 7px;
 }

 .condition-consent-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 11px;
   margin-top: 7px;
   margin-bottom: 7px;
 }

 .condition-end-line {
   border-top: 1px solid black;
   margin-top: 1px;
   margin-bottom: 0px;
 }

 .certify-text {
   font-family: 'Sarabun', sans-serif;
   font-size: 11px;
   margin-left: 3px;
 }

 .condition-end-outsource-line {
   border-top: 1px solid black;
   margin-top: 17px;
   margin-bottom: 0px;
 }

 .outsource-bank-first {
   margin-top: 18px;
 }

 .outsource-bank-part {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   justify-content: center;
   line-height: 20px;
 }

 .money-outsource {
   width: 76px;
   text-align: center;
 }

 .sign-table-block {
   position: absolute;
   bottom: -1px;
 }

 .sign-table {
   height: 180px;
   width: 100%;
   border: 1px solid black;
   border-collapse: collapse;
 }

 .sign-table-border {
   border: 1px solid black;
   border-collapse: collapse;
 }

 .sign-table-header {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   background-color: rgb(220, 237, 200);
   height: 20px;
 }

 .customer-sign-header {
   width: 450px;
 }

 .customer-sign-cell {
   height: 100%;
 }

 .customer-sign-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin: auto;
 }

 .customer-sign-box {
   border-bottom: 2px dotted black;
   width: 252px;
   height: 64px;
   margin: auto;
 }

 .note-customer-sign-row {
   margin-top: 6px;
 }

 .note-customer-sign {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin: auto;
 }

 .customer-position-sign-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 23px;
   align-self: flex-end;
 }

 .input-customer-position {
   font-family: 'Sarabun', sans-serif;
   text-align: center;
   font-size: 14px;
   width: 290px;
   border-bottom: 2px dotted black;
   margin-left: 15px;
 }

 .input-customer-sign-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   border-bottom: 2px dotted black;
   text-align: center;
   width: 225px;
   margin-left: 13px;
 }

 .qt-sign-cell {
   width: 342px;
 }

 .name-sign-row {
   justify-content: center;
   margin-top: 6px;
 }

 .parentheses-name {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
 }

 .name-sign-box {
   display: inline-flex;
   border-bottom: 2px dotted black;
   width: 241px;
   justify-content: center;
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
 }

 .qt-position-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   align-self: flex-end;
   margin-left: 7px;
 }

 .input-qt-position {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   border-bottom: 2px dotted black;
   text-align: center;
   width: 230px;
   margin-left: 13px;
 }

 .input-name-approve {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   border-bottom: 2px dotted black;
   width: 241px;
   text-align: center;
 }
</style>`
 return html
}

function addClassQtEn(html) {
  html += `<style>
  @import url('https://fonts.googleapis.com/css?family=Sarabun&display=swap');

 .paper {
   width: 1190px;
   height: 1666px;
   background-color: white;
   border: 1px solid lightgray;
 }

 .frame {
   width: 1142px;
   height: 1635px;
   border: 1px solid black;
   margin-left: auto;
   margin-right: auto;
   margin-top: 18px;
   position: relative;
 }

 .row {
   display: inline-flex;
   width: 100%;
 }

 .logo-img {
   margin-left: 3px;
 }

 .header-block {
   width: 100%;
 }

 .inet-header-row {
   margin-top: 12px;
 }

 .inet-header {
   font-family: 'Sarabun', sans-serif;
   font-size: 28px;
   width: 100%;
   text-align: right;
   margin-right: 12px;
 }

 .address1 {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   align-self: flex-end;
   margin-left: 663px;
 }

 .address2 {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin-left: 543px;
   align-self: flex-end;
 }

 .qt-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 22px;
   margin-left: 9px;
 }

 .tel-num {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin-left: 567px;
 }

 .qt-header-block {
   margin-top: 5px;
 }

 .customer-detail {
   border: 1px solid black;
   width: 586px;
   padding-left: 9px;
   padding-top: 5px;
   padding-bottom: 6px;
 }

 .customer-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
 }

 .input-customer-name {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 11px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 458px;
 }

 .customer-detail-row {
   margin-top: 3px;
 }

 .input-customer-address {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 18px;
   width: 501px;
   height: 43px;
   position: relative;
 }

  .customer-address-line {
    position: absolute;
    border-bottom-style: dotted;
    border-width: 2px;
    height: 18px;
    width: 100%;
  }

  .customer-address-line2 {
    position: absolute;
    top: 18px;
    border-bottom-style: dotted;
    border-width: 2px;
    height: 18px;
    width: 100%;
  }

 .input-customer-tel {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 23px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 200px;
   margin-right: 16px;
 }

 .input-customer-mobile {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 18px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 220px;
 }

 .input-customer-email {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 31px;
   border-bottom-style: dotted;
   border-width: 2px;
   width: 502px;
 }

 .qt-sale-detail {
   width: 545px;
   text-align: right;
 }

 .qt-num-row {
   justify-content: flex-end;
   margin-top: 19px;
 }

 .input-qt-num {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   width: 296px;
   text-align: left;
   margin-left: 7px;
   margin-right: 9px;
 }

 .qt-sale-row {
   justify-content: flex-end;
   margin-top: 3px;
 }

 .input-qt-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 7px;
   width: 186px;
 }

 .input-qt-time {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 2px;
   width: 109px;
   margin-right: 8px;
 }

 .input-sale-firstname {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 7px;
   width: 305px;
 }

 .sale-tel {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 7px;
   margin-right: 235px;
 }

 .input-sale-mobile {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   text-align: left;
   margin-left: 7px;
   width: 300px;
   margin-right: 4px;
 }

 .qt-table-block {
   margin-top: 4px;
 }

 .qt-table {
   table-layout: fixed;
   width: 100%;
   height: 825px;
   border: 1px solid black;
   border-collapse: collapse;
   background: url('https://eform.one.th/eform_api/api/v1/view_image?file_name=25020637504_4b05fffa-afa1-46b9-a5d7-3476339f44e6.png');
   background-repeat: no-repeat;
   background-position: center;
   background-size: 420px;
 }

 .qt-table-header-row {
   height: 25px;
 }

 .qt-table-header {
   border: 1px solid black;
   border-collapse: collapse;
   background-color: rgb(104, 159, 56);
   color: white;
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   padding-bottom: 3px;
 }

 .item-header {
   width: 44px;
 }

 .qty-header {
   width: 90px;
 }

 .unit-header {
   width: 93px;
 }

 .price-header {
   width: 122px;
 }

 .amount-header {
   width: 126px;
 }

 .qt-table-body {
   vertical-align: top !important;
 }

 .qt-table-cell {
   border-left: 1px solid black;
   border-right: 1px solid black;
   border-collapse: collapse;
 }

 .qt-data-first-row {
   padding-top: 18px;
 }

 .qt-data {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
 }

 .description-data {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   padding-left: 3px;
 }

 .qt-data-row {
   height: 21px;
 }

 .service-spec-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   padding-left: 21px;
 }

 .scope-work-description {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   margin-left: 14px;
 }

 .discount-row {
   justify-content: flex-end;
 }

 .total-before-discount {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   width: 177px;
 }

 .dicount-block {
   width: 177px;
   display: inline-flex;
 }

 .discount-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .discount {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 51px;
   margin-left: 39px;
 }

 .percent-discount {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .after-discount-row {
   height: 37px;
 }

 .qt-table-footer {
   border: 1px solid black;
   border-collapse: collapse;
 }

 .period-block {
   width: 192px;
   text-align: center;
 }

 .service-time-block {
   margin-left: 20px;
 }

 .period-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .input-period-block {
   justify-content: center;
   margin-top: 6px;
 }

 .input-period {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 54px;
 }

 .input-unit-period {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   width: 78px;
   margin-left: 3px;
   text-align: left;
 }

 .input-start-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 142px;
   margin: auto;
   margin-top: 6px;
 }

 .input-end-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
   width: 144px;
   margin: auto;
   margin-top: 6px;
 }

 .total-cell {
   height: 22px;
 }

 .total-block {
   text-align: center;
 }

 .total-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
 }

 .input-total {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   text-align: center;
 }

 .grand-total-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 13px;
   color: white;
   background-color: rgb(104, 159, 56);
   text-align: center;
   height: 24px;
 }

 .note-qt {
   font-family: 'Sarabun', sans-serif;
   font-size: 10px;
   margin: auto;
 }

 .condition-title-block {
   height: 23px;
 }

 .condition-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   margin: auto;
 }

 .condition-line {
   border-top: 1px solid black;
   margin-top: 1px;
   margin-bottom: 1px;
 }

 .condition-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 10px;
   margin-top: 0px;
   margin-bottom: 7px;
 }

 .condition-outsource-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 11px;
   margin-top: 15px;
   margin-bottom: 7px;
 }

 .condition-consent-part {
   column-count: 2;
   font-family: 'Sarabun', sans-serif;
   font-size: 11px;
   margin-top: 11px;
   margin-bottom: 7px;
 }

 .condition-end-line {
   border-top: 1px solid black;
   margin-top: 1px;
   margin-bottom: 0px;
 }

 .certify-text {
   font-family: 'Sarabun', sans-serif;
   font-size: 11px;
   margin-left: 3px;
 }

 .condition-end-outsource-line {
   border-top: 1px solid black;
   margin-top: 17px;
   margin-bottom: 0px;
 }

 .outsource-bank-first {
   margin-top: 26px;
 }

 .outsource-bank-part {
   font-family: 'Sarabun', sans-serif;
   font-size: 12px;
   justify-content: center;
 }

 .money-outsource {
   width: 76px;
   text-align: center;
 }

 .sign-table-block {
   position: absolute;
   bottom: -1px;
 }

 .sign-table {
   height: 180px;
   width: 100%;
   border: 1px solid black;
   border-collapse: collapse;
 }

 .sign-table-border {
   border: 1px solid black;
   border-collapse: collapse;
 }

 .sign-table-header {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   background-color: rgb(220, 237, 200);
   height: 20px;
 }

 .customer-sign-header {
   width: 450px;
 }

 .customer-sign-cell {
   height: 100%;
 }

 .customer-sign-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin: auto;
 }

 .customer-sign-box {
   border-bottom: 2px dotted black;
   width: 252px;
   height: 64px;
   margin: auto;
 }

 .note-customer-sign-row {
   margin-top: 6px;
 }

 .note-customer-sign {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin: auto;
 }

 .customer-position-sign-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   margin-left: 23px;
   align-self: flex-end;
 }

 .input-customer-position {
   font-family: 'Sarabun', sans-serif;
   text-align: center;
   font-size: 14px;
   width: 290px;
   border-bottom: 2px dotted black;
   margin-left: 15px;
 }

 .input-customer-sign-date {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   border-bottom: 2px dotted black;
   text-align: center;
   width: 225px;
   margin-left: 13px;
 }

 .qt-sign-cell {
   width: 342px;
 }

 .name-sign-row {
   justify-content: center;
   margin-top: 6px;
 }

 .parentheses-name {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
 }

 .name-sign-box {
   display: inline-flex;
   border-bottom: 2px dotted black;
   width: 241px;
   justify-content: center;
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
 }

 .qt-position-title {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   align-self: flex-end;
   margin-left: 7px;
 }

 .input-qt-position {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   border-bottom: 2px dotted black;
   text-align: center;
   width: 230px;
   margin-left: 13px;
 }

 .input-name-approve {
   font-family: 'Sarabun', sans-serif;
   font-size: 14px;
   border-bottom: 2px dotted black;
   width: 241px;
   text-align: center;
 }
</style>`
return html
}

function numberToComma(num) {
  if(!isNaN(num) && num != '') {
    num = Math.floor(num * 100)/100
    num = Number(num).toFixed(2)
    num = String(num)
    var sp_num = num.split('.')
    var decimal = ''
    sp_num[1]?decimal = sp_num[1]: decimal = ''
    num = sp_num[0]
    var commaNum =  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    decimal != ''? commaNum += '.' + decimal: commaNum = commaNum
    return commaNum
  } else {
    return num
  }
}

//เพิ่มใหม่
function numberToCommaTwoFix(num) {
  if(!isNaN(num) && num != '') {
    num = Number(num).toFixed(2)
    num = String(num)
    var sp_num = num.split('.')
    var decimal = ''
    sp_num[1]?decimal = sp_num[1]: decimal = ''
    num = sp_num[0]
    var commaNum =  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    decimal != ''? commaNum += '.' + decimal: commaNum = commaNum
    return commaNum
  } else {
    return num
  }
}
//เพิ่มใหม่ 2
function numberToCommaFour(num) {
  if(!isNaN(num) && num != '') {
    num = Math.floor(num * 10000)/10000
    num = Number(num).toFixed(4)
    num = String(num)
    var sp_num = num.split('.')
    var decimal = ''
    sp_num[1]?decimal = sp_num[1]: decimal = ''
    num = sp_num[0]
    var commaNum =  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    decimal != ''? commaNum += '.' + decimal: commaNum = commaNum
    return commaNum
  } else {
    return num
  }
}

function setDateFormatBE (date, lang) {
  try {
    var curDate = date.split('-')
    var thaiDate = ''
    if(lang == 'eng') {
      thaiDate = String(Number(curDate[2])) + ' ' + getEngMonth(curDate[1]) + ' ' + String(Number(curDate[0]))
    } else {
      thaiDate = String(Number(curDate[2])) + ' ' + getThaiMonth(curDate[1]) + ' พ.ศ.' + String(Number(curDate[0]) + 543)
    }
    
    return date ? thaiDate : ''
  } catch(e) {
    return ""
  }
}

function getThaiMonth (mon) {
  var thaiMon = ''
  mon == '01'? thaiMon = 'มกราคม':
  mon == '02'? thaiMon = 'กุมภาพันธ์':
  mon == '03'? thaiMon = 'มีนาคม':
  mon == '04'? thaiMon = 'เมษายน':
  mon == '05'? thaiMon = 'พฤษภาคม':
  mon == '06'? thaiMon = 'มิถุนายน':
  mon == '07'? thaiMon = 'กรกฎาคม':
  mon == '08'? thaiMon = 'สิงหาคม':
  mon == '09'? thaiMon = 'กันยายน':
  mon == '10'? thaiMon = 'ตุลาคม':
  mon == '11'? thaiMon = 'พฤศจิกายน':
  mon == '12'? thaiMon = 'ธันวาคม':
  thaiMon = 'อื่นๆ'
  return thaiMon
}

function getEngMonth (mon) {
  var engMon = ''
  mon == '01'? engMon = 'January':
  mon == '02'? engMon = 'Febuary':
  mon == '03'? engMon = 'March':
  mon == '04'? engMon = 'April':
  mon == '05'? engMon = 'May':
  mon == '06'? engMon = 'June':
  mon == '07'? engMon = 'July':
  mon == '08'? engMon = 'August':
  mon == '09'? engMon = 'September':
  mon == '10'? engMon = 'October':
  mon == '11'? engMon = 'November':
  mon == '12'? engMon = 'December':
  engMon = 'Else'
  return engMon
}

function setDateFormatBEsub (date) {
  var new_date = new Date(date)
  var setYear = String(Number(new_date.getFullYear()) + 543)
  var month   = (new_date.getMonth()+1) < 10 ? '0'+ (new_date.getMonth()+1) : (new_date.getMonth()+1)
  var day     = new_date.getDate()      < 10 ? '0'+ new_date.getDate()      : new_date.getDate()
  var hours   = new_date.getHours()     < 10 ? '0'+ new_date.getHours()     : new_date.getHours()
  var minutes = new_date.getMinutes()   < 10 ? '0'+ new_date.getMinutes()   : new_date.getMinutes()
  setYear = ' '+setYear.slice(2,4)
  var time = `${hours}:${minutes}`
  var thaiDate = String(Number(day)) + ' ' + getThaiMonthsub(String(month)) + String(setYear)
  return date ? thaiDate : ''
}

function getThaiMonthsub (mon) {
  var thaiMon = ''
  mon == '01' ? thaiMon = 'ม.ค.':
  mon == '02' ? thaiMon = 'ก.พ.':
  mon == '03' ? thaiMon = 'มี.ค.':
  mon == '04' ? thaiMon = 'เม.ย.':
  mon == '05' ? thaiMon = 'พ.ค.':
  mon == '06' ? thaiMon = 'มิ.ย.':
  mon == '07' ? thaiMon = 'ก.ค.':
  mon == '08' ? thaiMon = 'ส.ค.':
  mon == '09' ? thaiMon = 'ก.ย.':
  mon == '10' ? thaiMon = 'ต.ค.':
  mon == '11' ? thaiMon = 'พ.ย.':
  mon == '12' ? thaiMon = 'ธ.ค.':
  thaiMon = 'อื่นๆ'
  return thaiMon
}

function numberToCommaNoFix(num) {
  if(!isNaN(num) && num != '') {
    num = String(num)
    var sp_num = num.split('.')
    var decimal = ''
    sp_num[1]?decimal = sp_num[1]: decimal = ''
    num = sp_num[0]
    var commaNum =  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    decimal != ''? commaNum += '.' + decimal: commaNum = commaNum
    return commaNum
  } else {
    return num
  }
}

function getLineCalculate(docData) {
  docData['ExtraPage'] = {
    'count': 0,
    'extras': []
  }
  if(docData['Service_Specs'].length || docData['Desciption_R4']) {
    var tempSpecArray = docData['Service_Specs']
    var spceLen = tempSpecArray.length
    var descriptArray = docData['Desciption_R4'].split('\n')
    var descriptLen  = descriptArray.length
    if(spceLen + descriptLen > 25) {
      var lenCount = 0
      var lineRow = [{
        'Service_Specs': [],
        'Desciption_R4': []
      }]
      var rowCount = 0
      tempSpecArray.forEach(e => {
        lineRow[rowCount]['Service_Specs'].push(e)
        lenCount ++
        if(lenCount == 25) {
          lenCount = 0
          lineRow.push({
            'Service_Specs': [],
            'Desciption_R4': []
          })
          rowCount++
        }
      })
      descriptArray.forEach(e => {
        lineRow[rowCount]['Desciption_R4'].push(e)
        lenCount ++
        if(lenCount == 25) {
          lenCount = 0
          lineRow.push({
            'Service_Specs': [],
            'Desciption_R4': []
          })
          rowCount++
        }
      })

      if(lineRow.length) {
        docData['Service_Specs'] = lineRow[0]['Service_Specs']
        docData['Desciption_R4'] = lineRow[0]['Desciption_R4'].join('\n')
        for(let i=1; i<lineRow.length; i++) {
          docData['ExtraPage'].count ++
          docData['ExtraPage'].extras.push({
            'Service_Specs': lineRow[i]['Service_Specs'],
            'Desciption_R4': lineRow[i]['Desciption_R4'].join('\n')
          })
        }
      }
    }
  }
  return docData
}

module.exports = {
  genHtmlCs,
  genHtmlQtBiLang,
  genHtmlQtBiLangV2,
  genHtmlInvoiceOnly
}