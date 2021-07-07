var config = {
    user: 'paperlessreading',
    password: 'bS2bAXhatT',
    server: '203.150.109.151', 
    database: 'INET_PRD',
    port:1433
};

async function select_So_one(RefJobNO){
    try {
      sql_text = `Select  sh.*,sh.NetValue/1.07 as [12_revmonth]
        ,pmt.SaleText as CreditTerm
        ,ss.RegDelivDate as RegDelivDate,
        sh.ShipToParty as CustomerCode, 
        sh.ShipToDesc as [5_customer_name],
        sh.SaleDocument as RefJobNO
        , ISNULL(ss.SaleRepresent, '') as SaleRepresent
        ,ISNULL(emp.FirstName,'')+' '+ISNULL(emp.LastName,'') as SaleRepresentative
        ,shps.xValue as Project,
        Tit.TitleName as TitleCustomer
        ,stt.Description as StatusName
         ,case when( ISNULL(selCS01.xValue,'')='' ) then ISNULL(pCS01.xValue,'') else ISNULL(pCS01.xValue,'')+':'+ISNULL(selCS01.xValue,'') end AS pCS01
         ,ISNULL(selCS01.xValue,'') AS selCS01
         ,case when( ISNULL(selCS02.xValue,'')='' ) then ISNULL(pCS02.xValue,'') else ISNULL(pCS02.xValue,'')+':'+ISNULL(selCS02.xValue,'') end AS pCS02
         ,ISNULL(selCS02.xValue,'') AS selCS02
         ,case when( ISNULL(selCS03.xValue,'')='' ) then ISNULL(pCS03.xValue,'') else ISNULL(pCS03.xValue,'')+':'+ISNULL(selCS03.xValue,'') end AS pCS03
         ,ISNULL(selCS03.xValue,'') AS selCS03
         ,case when( ISNULL(selCS04.xValue,'')='' ) then ISNULL(pCS04.xValue,'') else ISNULL(pCS04.xValue,'')+':'+ISNULL(selCS04.xValue,'') end AS pCS04
         ,ISNULL(selCS04.xValue,'') AS selCS04
         ,case when( ISNULL(selCS05.xValue,'')='' ) then ISNULL(pCS05.xValue,'') else ISNULL(pCS05.xValue,'')+':'+ISNULL(selCS05.xValue,'') end AS pCS05
         ,ISNULL(selCS05.xValue,'') AS selCS05
         ,case when( ISNULL(selCS06.xValue,'')='' ) then ISNULL(pCS06.xValue,'') else ISNULL(pCS06.xValue,'')+':'+ISNULL(selCS06.xValue,'') end AS pCS06
         ,ISNULL(selCS06.xValue,'') AS selCS06
         ,case when( ISNULL(selCS07.xValue,'')='' ) then ISNULL(pCS07.xValue,'') else ISNULL(pCS07.xValue,'')+':'+ISNULL(selCS07.xValue,'') end AS pCS07
         ,ISNULL(selCS07.xValue,'') AS selCS07
         ,case when( ISNULL(selCS08.xValue,'')='' ) then ISNULL(pCS08.xValue,'') else ISNULL(pCS08.xValue,'')+':'+ISNULL(selCS08.xValue,'') end AS pCS08
         ,ISNULL(selCS08.xValue,'') AS selCS08
         ,case when( ISNULL(selCS09.xValue,'')='' ) then ISNULL(pCS09.xValue,'') else ISNULL(pCS09.xValue,'')+':'+ISNULL(selCS09.xValue,'') end AS pCS09
         ,ISNULL(selCS09.xValue,'') AS selCS09
         ,case when( ISNULL(selCS10.xValue,'')='' ) then ISNULL(pCS10.xValue,'') else ISNULL(pCS10.xValue,'')+':'+ISNULL(selCS10.xValue,'') end AS pCS10
         ,ISNULL(selCS10.xValue,'') AS selCS10
         ,case when( ISNULL(selCS11.xValue,'')='' ) then ISNULL(pCS11.xValue,'') else ISNULL(pCS11.xValue,'')+':'+ISNULL(selCS11.xValue,'') end AS pCS11
         ,ISNULL(selCS11.xValue,'') AS selCS11
         ,case when( ISNULL(selCS14.xValue,'')='' ) then ISNULL(pCS14.xValue,'') else ISNULL(pCS14.xValue,'')+':'+ISNULL(selCS14.xValue,'') end AS pCS14
         ,ISNULL(selCS14.xValue,'') AS selCS14
         ,case when( ISNULL(selCS21.xValue,'')='' ) then ISNULL(pCS21.xValue,'') else ISNULL(pCS21.xValue,'')+':'+ISNULL(selCS21.xValue,'') end AS pCS21
         ,ISNULL(selCS21.xValue,'') AS selCS21
         ,case when( ISNULL(selCS22.xValue,'')='' ) then ISNULL(pCS22.xValue,'') else ISNULL(pCS22.xValue,'')+':'+ISNULL(selCS22.xValue,'') end AS pCS22
         ,ISNULL(selCS22.xValue,'') AS selCS22
         ,case when( ISNULL(selCS23.xValue,'')='' ) then ISNULL(pCS23.xValue,'') else ISNULL(pCS23.xValue,'')+':'+ISNULL(selCS23.xValue,'') end AS pCS23
         ,ISNULL(selCS23.xValue,'') AS selCS23
         ,case when( ISNULL(selCS24.xValue,'')='' ) then ISNULL(pCS24.xValue,'') else ISNULL(pCS24.xValue,'')+':'+ISNULL(selCS24.xValue,'') end AS pCS24
         ,ISNULL(selCS24.xValue,'') AS selCS24
         ,case when( ISNULL(selCS25.xValue,'')='' ) then ISNULL(pCS25.xValue,'') else ISNULL(pCS25.xValue,'')+':'+ISNULL(selCS25.xValue,'') end AS pCS25
         ,ISNULL(selCS25.xValue,'') AS selCS25
         ,case when( ISNULL(selCS26.xValue,'')='' ) then ISNULL(pCS26.xValue,'') else ISNULL(pCS26.xValue,'')+':'+ISNULL(selCS26.xValue,'') end AS pCS26
         ,ISNULL(selCS26.xValue,'') AS selCS26
         ,case when( ISNULL(selCS27.xValue,'')='' ) then ISNULL(pCS27.xValue,'') else ISNULL(pCS27.xValue,'')+':'+ISNULL(selCS27.xValue,'') end AS pCS27
         ,ISNULL(selCS27.xValue,'') AS selCS27
         ,case when( ISNULL(selCS28.xValue,'')='' ) then ISNULL(pCS28.xValue,'') else ISNULL(pCS28.xValue,'')+':'+ISNULL(selCS28.xValue,'') end AS pCS28
         ,ISNULL(selCS28.xValue,'') AS selCS28
         ,case when( ISNULL(selCS29.xValue,'')='' ) then ISNULL(pCS29.xValue,'') else ISNULL(pCS29.xValue,'')+':'+ISNULL(selCS29.xValue,'') end AS pCS29
         ,ISNULL(selCS29.xValue,'') AS selCS29
         ,case when( ISNULL(selQP04.xValue,'')='' ) then ISNULL(pQP04.xValue,'') else ISNULL(pQP04.xValue,'')+':'+ISNULL(selQP04.xValue,'') end AS pQP04
         ,ISNULL(selQP04.xValue,'') AS selQP04
         ,case when( ISNULL(selQP05.xValue,'')='' ) then ISNULL(pQP05.xValue,'') else ISNULL(pQP05.xValue,'')+':'+ISNULL(selQP05.xValue,'') end AS pQP05
         ,ISNULL(selQP05.xValue,'') AS selQP05
         ,case when( ISNULL(selSC01.xValue,'')='' ) then ISNULL(pSC01.xValue,'') else ISNULL(pSC01.xValue,'')+':'+ISNULL(selSC01.xValue,'') end AS pSC01
         ,ISNULL(selSC01.xValue,'') AS selSC01
         ,case when( ISNULL(selSC02.xValue,'')='' ) then ISNULL(pSC02.xValue,'') else ISNULL(pSC02.xValue,'')+':'+ISNULL(selSC02.xValue,'') end AS pSC02
         ,ISNULL(selSC02.xValue,'') AS selSC02
         ,case when( ISNULL(selSO02.xValue,'')='' ) then ISNULL(pSO02.xValue,'') else ISNULL(pSO02.xValue,'')+':'+ISNULL(selSO02.xValue,'') end AS pSO02
         ,ISNULL(selSO02.xValue,'') AS selSO02
         ,case when( ISNULL(selSO03.xValue,'')='' ) then ISNULL(pSO03.xValue,'') else ISNULL(pSO03.xValue,'')+':'+ISNULL(selSO03.xValue,'') end AS pSO03
         ,ISNULL(selSO03.xValue,'') AS selSO03
         ,iif(replace(case when( ISNULL(selSO04.xValue,'')='' ) then ISNULL(pSO04.xValue,'') else ISNULL(pSO04.xValue,'')+':'+ISNULL(selSO04.xValue,'')  end,'/','-') = ''
          , null,substring(replace(case when( ISNULL(selSO04.xValue,'')='' ) then ISNULL(pSO04.xValue,'') else ISNULL(pSO04.xValue,'')+':'+ISNULL(selSO04.xValue,'')  end,'/','-'),1,10)) AS ContractStartDate
         ,ISNULL(selSO04.xValue,'') AS selSO04
         ,iif(replace(case when( ISNULL(selSO05.xValue ,'')='' ) then ISNULL(pSO05.xValue,'') else ISNULL(pSO05.xValue,'')+':'+ISNULL(selSO05.xValue,'') end,'/','-') = ''
         , null,substring(replace(case when( ISNULL(selSO05.xValue ,'')='' ) then ISNULL(pSO05.xValue,'') else ISNULL(pSO05.xValue,'')+':'+ISNULL(selSO05.xValue,'') end,'/','-'),1,10)) AS ContractEndDate
         ,ISNULL(selSO05.xValue,'') AS selSO05
         ,case when( ISNULL(selSO06.xValue,'')='' ) then ISNULL(pSO06.xValue,'') else ISNULL(pSO06.xValue,'')+':'+ISNULL(selSO06.xValue,'') end AS Service
         ,ISNULL(selSO06.xValue,'') AS selSO06
         ,case when( ISNULL(selSO07.xValue,'')='' ) then ISNULL(pSO07.xValue,'') else ISNULL(pSO07.xValue,'')+':'+ISNULL(selSO07.xValue,'') end AS pSO07
         ,ISNULL(selSO07.xValue,'') AS selSO07
         ,case when( ISNULL(selSV01.xValue,'')='' ) then ISNULL(pSV01.xValue,'') else ISNULL(pSV01.xValue,'')+':'+ISNULL(selSV01.xValue,'') end AS pSV01
         ,ISNULL(selSV01.xValue,'') AS selSV01
         ,case when( ISNULL(selSV02.xValue,'')='' ) then ISNULL(pSV02.xValue,'') else ISNULL(pSV02.xValue,'')+':'+ISNULL(selSV02.xValue,'') end AS pSV02
         ,ISNULL(selSV02.xValue,'') AS selSV02
         ,case when( ISNULL(selSV03.xValue,'')='' ) then ISNULL(pSV03.xValue,'') else ISNULL(pSV03.xValue,'')+':'+ISNULL(selSV03.xValue,'') end AS pSV03
         ,ISNULL(selSV03.xValue,'') AS selSV03
         from sd_so_header sh
        Left outer join sd_so_header_sale ss on sh.SID=ss.SID and sh.ObjectID=ss.ObjectID
        Left outer join master_employee emp on ss.SID=emp.SID and ss.SaleRepresent=emp.EmployeeCode
        Left outer join master_payment_terms pmt on ss.SID=pmt.SID and ss.PmntTermCode=pmt.PaymentTermCode
        Left outer join sd_so_header_properties shp on sh.SID=shp.SID and shp.ObjectID=sh.ObjectID and shp.PropertiesCode='PROJ'
        Left outer join master_conf_selectedvalue_detail shps on shp.SID=shps.SID and shps.Code=shp.PropertiesCode and shp.xValue=shps.DetailCode
        Left outer join master_config_lo_doctype_docdetail lo on sh.SID=lo.SID and sh.companyCode=lo.companyCode and sh.Stypecode=lo.DocumentTypeCode
        Left outer join master_customer cus on sh.SID=cus.SID and sh.SoldToParty=cus.CustomerCode
        Left outer join master_TitleName Tit on cus.SID=Tit.SID and cus.TitleCode=Tit.TitleCode
        Left outer join sd_master_status stt on sh.SID=stt.SID and sh.Status=stt.Code
        Left outer join bl_item b on b.sid = sh.sid and b.CompanyRef = sh.CompanyCode and b.FiscalYearRef = sh.Fiscalyear and b.SaleQtRef = sh.SaleDocument
        LEFT OUTER JOIN sd_so_header_properties pCS01 WITH(NOLOCK)
         ON sh.SID = pCS01.SID
             AND sh.ObjectID = pCS01.ObjectID
             AND pCS01.PropertiesCode = 'CS01'
         LEFT OUTER JOIN master_conf_properties mpropCS01 WITH(NOLOCK)
             ON pCS01.SID = mpropCS01.SID
                 AND pCS01.PropertiesCode = mpropCS01.PropertiesCode
                 AND mpropCS01.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS01 WITH(NOLOCK)
         ON pCS01.sid = selCS01.sid
             AND mpropCS01.SelectedCode = selCS01.Code
             AND pCS01.xValue = selCS01.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS02 WITH(NOLOCK)
         ON sh.SID = pCS02.SID
             AND sh.ObjectID = pCS02.ObjectID
             AND pCS02.PropertiesCode = 'CS02'
         LEFT OUTER JOIN master_conf_properties mpropCS02 WITH(NOLOCK)
             ON pCS02.SID = mpropCS02.SID
                 AND pCS02.PropertiesCode = mpropCS02.PropertiesCode
                 AND mpropCS02.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS02 WITH(NOLOCK)
         ON pCS02.sid = selCS02.sid
             AND mpropCS02.SelectedCode = selCS02.Code
             AND pCS02.xValue = selCS02.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS03 WITH(NOLOCK)
         ON sh.SID = pCS03.SID
             AND sh.ObjectID = pCS03.ObjectID
             AND pCS03.PropertiesCode = 'CS03'
         LEFT OUTER JOIN master_conf_properties mpropCS03 WITH(NOLOCK)
             ON pCS03.SID = mpropCS03.SID
                 AND pCS03.PropertiesCode = mpropCS03.PropertiesCode
                 AND mpropCS03.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS03 WITH(NOLOCK)
         ON pCS03.sid = selCS03.sid
             AND mpropCS03.SelectedCode = selCS03.Code
             AND pCS03.xValue = selCS03.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS04 WITH(NOLOCK)
         ON sh.SID = pCS04.SID
             AND sh.ObjectID = pCS04.ObjectID
             AND pCS04.PropertiesCode = 'CS04'
         LEFT OUTER JOIN master_conf_properties mpropCS04 WITH(NOLOCK)
             ON pCS04.SID = mpropCS04.SID
                 AND pCS04.PropertiesCode = mpropCS04.PropertiesCode
                 AND mpropCS04.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS04 WITH(NOLOCK)
         ON pCS04.sid = selCS04.sid
             AND mpropCS04.SelectedCode = selCS04.Code
             AND pCS04.xValue = selCS04.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS05 WITH(NOLOCK)
         ON sh.SID = pCS05.SID
             AND sh.ObjectID = pCS05.ObjectID
             AND pCS05.PropertiesCode = 'CS05'
         LEFT OUTER JOIN master_conf_properties mpropCS05 WITH(NOLOCK)
             ON pCS05.SID = mpropCS05.SID
                 AND pCS05.PropertiesCode = mpropCS05.PropertiesCode
                 AND mpropCS05.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS05 WITH(NOLOCK)
         ON pCS05.sid = selCS05.sid
             AND mpropCS05.SelectedCode = selCS05.Code
             AND pCS05.xValue = selCS05.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS06 WITH(NOLOCK)
         ON sh.SID = pCS06.SID
             AND sh.ObjectID = pCS06.ObjectID
             AND pCS06.PropertiesCode = 'CS06'
         LEFT OUTER JOIN master_conf_properties mpropCS06 WITH(NOLOCK)
             ON pCS06.SID = mpropCS06.SID
                 AND pCS06.PropertiesCode = mpropCS06.PropertiesCode
                 AND mpropCS06.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS06 WITH(NOLOCK)
         ON pCS06.sid = selCS06.sid
             AND mpropCS06.SelectedCode = selCS06.Code
             AND pCS06.xValue = selCS06.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS07 WITH(NOLOCK)
         ON sh.SID = pCS07.SID
             AND sh.ObjectID = pCS07.ObjectID
             AND pCS07.PropertiesCode = 'CS07'
         LEFT OUTER JOIN master_conf_properties mpropCS07 WITH(NOLOCK)
             ON pCS07.SID = mpropCS07.SID
                 AND pCS07.PropertiesCode = mpropCS07.PropertiesCode
                 AND mpropCS07.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS07 WITH(NOLOCK)
         ON pCS07.sid = selCS07.sid
             AND mpropCS07.SelectedCode = selCS07.Code
             AND pCS07.xValue = selCS07.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS08 WITH(NOLOCK)
         ON sh.SID = pCS08.SID
             AND sh.ObjectID = pCS08.ObjectID
             AND pCS08.PropertiesCode = 'CS08'
         LEFT OUTER JOIN master_conf_properties mpropCS08 WITH(NOLOCK)
             ON pCS08.SID = mpropCS08.SID
                 AND pCS08.PropertiesCode = mpropCS08.PropertiesCode
                 AND mpropCS08.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS08 WITH(NOLOCK)
         ON pCS08.sid = selCS08.sid
             AND mpropCS08.SelectedCode = selCS08.Code
             AND pCS08.xValue = selCS08.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS09 WITH(NOLOCK)
         ON sh.SID = pCS09.SID
             AND sh.ObjectID = pCS09.ObjectID
             AND pCS09.PropertiesCode = 'CS09'
         LEFT OUTER JOIN master_conf_properties mpropCS09 WITH(NOLOCK)
             ON pCS09.SID = mpropCS09.SID
                 AND pCS09.PropertiesCode = mpropCS09.PropertiesCode
                 AND mpropCS09.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS09 WITH(NOLOCK)
         ON pCS09.sid = selCS09.sid
             AND mpropCS09.SelectedCode = selCS09.Code
             AND pCS09.xValue = selCS09.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS10 WITH(NOLOCK)
         ON sh.SID = pCS10.SID
             AND sh.ObjectID = pCS10.ObjectID
             AND pCS10.PropertiesCode = 'CS10'
         LEFT OUTER JOIN master_conf_properties mpropCS10 WITH(NOLOCK)
             ON pCS10.SID = mpropCS10.SID
                 AND pCS10.PropertiesCode = mpropCS10.PropertiesCode
                 AND mpropCS10.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS10 WITH(NOLOCK)
         ON pCS10.sid = selCS10.sid
             AND mpropCS10.SelectedCode = selCS10.Code
             AND pCS10.xValue = selCS10.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS11 WITH(NOLOCK)
         ON sh.SID = pCS11.SID
             AND sh.ObjectID = pCS11.ObjectID
             AND pCS11.PropertiesCode = 'CS11'
         LEFT OUTER JOIN master_conf_properties mpropCS11 WITH(NOLOCK)
             ON pCS11.SID = mpropCS11.SID
                 AND pCS11.PropertiesCode = mpropCS11.PropertiesCode
                 AND mpropCS11.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS11 WITH(NOLOCK)
         ON pCS11.sid = selCS11.sid
             AND mpropCS11.SelectedCode = selCS11.Code
             AND pCS11.xValue = selCS11.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS14 WITH(NOLOCK)
         ON sh.SID = pCS14.SID
             AND sh.ObjectID = pCS14.ObjectID
             AND pCS14.PropertiesCode = 'CS14'
         LEFT OUTER JOIN master_conf_properties mpropCS14 WITH(NOLOCK)
             ON pCS14.SID = mpropCS14.SID
                 AND pCS14.PropertiesCode = mpropCS14.PropertiesCode
                 AND mpropCS14.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS14 WITH(NOLOCK)
         ON pCS14.sid = selCS14.sid
             AND mpropCS14.SelectedCode = selCS14.Code
             AND pCS14.xValue = selCS14.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS21 WITH(NOLOCK)
         ON sh.SID = pCS21.SID
             AND sh.ObjectID = pCS21.ObjectID
             AND pCS21.PropertiesCode = 'CS21'
         LEFT OUTER JOIN master_conf_properties mpropCS21 WITH(NOLOCK)
             ON pCS21.SID = mpropCS21.SID
                 AND pCS21.PropertiesCode = mpropCS21.PropertiesCode
                 AND mpropCS21.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS21 WITH(NOLOCK)
         ON pCS21.sid = selCS21.sid
             AND mpropCS21.SelectedCode = selCS21.Code
             AND pCS21.xValue = selCS21.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS22 WITH(NOLOCK)
         ON sh.SID = pCS22.SID
             AND sh.ObjectID = pCS22.ObjectID
             AND pCS22.PropertiesCode = 'CS22'
         LEFT OUTER JOIN master_conf_properties mpropCS22 WITH(NOLOCK)
             ON pCS22.SID = mpropCS22.SID
                 AND pCS22.PropertiesCode = mpropCS22.PropertiesCode
                 AND mpropCS22.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS22 WITH(NOLOCK)
         ON pCS22.sid = selCS22.sid
             AND mpropCS22.SelectedCode = selCS22.Code
             AND pCS22.xValue = selCS22.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS23 WITH(NOLOCK)
         ON sh.SID = pCS23.SID
             AND sh.ObjectID = pCS23.ObjectID
             AND pCS23.PropertiesCode = 'CS23'
         LEFT OUTER JOIN master_conf_properties mpropCS23 WITH(NOLOCK)
             ON pCS23.SID = mpropCS23.SID
                 AND pCS23.PropertiesCode = mpropCS23.PropertiesCode
                 AND mpropCS23.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS23 WITH(NOLOCK)
         ON pCS23.sid = selCS23.sid
             AND mpropCS23.SelectedCode = selCS23.Code
             AND pCS23.xValue = selCS23.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS24 WITH(NOLOCK)
         ON sh.SID = pCS24.SID
             AND sh.ObjectID = pCS24.ObjectID
             AND pCS24.PropertiesCode = 'CS24'
         LEFT OUTER JOIN master_conf_properties mpropCS24 WITH(NOLOCK)
             ON pCS24.SID = mpropCS24.SID
                 AND pCS24.PropertiesCode = mpropCS24.PropertiesCode
                 AND mpropCS24.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS24 WITH(NOLOCK)
         ON pCS24.sid = selCS24.sid
             AND mpropCS24.SelectedCode = selCS24.Code
             AND pCS24.xValue = selCS24.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS25 WITH(NOLOCK)
         ON sh.SID = pCS25.SID
             AND sh.ObjectID = pCS25.ObjectID
             AND pCS25.PropertiesCode = 'CS25'
         LEFT OUTER JOIN master_conf_properties mpropCS25 WITH(NOLOCK)
             ON pCS25.SID = mpropCS25.SID
                 AND pCS25.PropertiesCode = mpropCS25.PropertiesCode
                 AND mpropCS25.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS25 WITH(NOLOCK)
         ON pCS25.sid = selCS25.sid
             AND mpropCS25.SelectedCode = selCS25.Code
             AND pCS25.xValue = selCS25.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS26 WITH(NOLOCK)
         ON sh.SID = pCS26.SID
             AND sh.ObjectID = pCS26.ObjectID
             AND pCS26.PropertiesCode = 'CS26'
         LEFT OUTER JOIN master_conf_properties mpropCS26 WITH(NOLOCK)
             ON pCS26.SID = mpropCS26.SID
                 AND pCS26.PropertiesCode = mpropCS26.PropertiesCode
                 AND mpropCS26.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS26 WITH(NOLOCK)
         ON pCS26.sid = selCS26.sid
             AND mpropCS26.SelectedCode = selCS26.Code
             AND pCS26.xValue = selCS26.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS27 WITH(NOLOCK)
         ON sh.SID = pCS27.SID
             AND sh.ObjectID = pCS27.ObjectID
             AND pCS27.PropertiesCode = 'CS27'
         LEFT OUTER JOIN master_conf_properties mpropCS27 WITH(NOLOCK)
             ON pCS27.SID = mpropCS27.SID
                 AND pCS27.PropertiesCode = mpropCS27.PropertiesCode
                 AND mpropCS27.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS27 WITH(NOLOCK)
         ON pCS27.sid = selCS27.sid
             AND mpropCS27.SelectedCode = selCS27.Code
             AND pCS27.xValue = selCS27.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS28 WITH(NOLOCK)
         ON sh.SID = pCS28.SID
             AND sh.ObjectID = pCS28.ObjectID
             AND pCS28.PropertiesCode = 'CS28'
         LEFT OUTER JOIN master_conf_properties mpropCS28 WITH(NOLOCK)
             ON pCS28.SID = mpropCS28.SID
                 AND pCS28.PropertiesCode = mpropCS28.PropertiesCode
                 AND mpropCS28.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS28 WITH(NOLOCK)
         ON pCS28.sid = selCS28.sid
             AND mpropCS28.SelectedCode = selCS28.Code
             AND pCS28.xValue = selCS28.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pCS29 WITH(NOLOCK)
         ON sh.SID = pCS29.SID
             AND sh.ObjectID = pCS29.ObjectID
             AND pCS29.PropertiesCode = 'CS29'
         LEFT OUTER JOIN master_conf_properties mpropCS29 WITH(NOLOCK)
             ON pCS29.SID = mpropCS29.SID
                 AND pCS29.PropertiesCode = mpropCS29.PropertiesCode
                 AND mpropCS29.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selCS29 WITH(NOLOCK)
         ON pCS29.sid = selCS29.sid
             AND mpropCS29.SelectedCode = selCS29.Code
             AND pCS29.xValue = selCS29.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pQP04 WITH(NOLOCK)
         ON sh.SID = pQP04.SID
             AND sh.ObjectID = pQP04.ObjectID
             AND pQP04.PropertiesCode = 'QP04'
         LEFT OUTER JOIN master_conf_properties mpropQP04 WITH(NOLOCK)
             ON pQP04.SID = mpropQP04.SID
                 AND pQP04.PropertiesCode = mpropQP04.PropertiesCode
                 AND mpropQP04.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selQP04 WITH(NOLOCK)
         ON pQP04.sid = selQP04.sid
             AND mpropQP04.SelectedCode = selQP04.Code
             AND pQP04.xValue = selQP04.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pQP05 WITH(NOLOCK)
         ON sh.SID = pQP05.SID
             AND sh.ObjectID = pQP05.ObjectID
             AND pQP05.PropertiesCode = 'QP05'
         LEFT OUTER JOIN master_conf_properties mpropQP05 WITH(NOLOCK)
             ON pQP05.SID = mpropQP05.SID
                 AND pQP05.PropertiesCode = mpropQP05.PropertiesCode
                 AND mpropQP05.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selQP05 WITH(NOLOCK)
         ON pQP05.sid = selQP05.sid
             AND mpropQP05.SelectedCode = selQP05.Code
             AND pQP05.xValue = selQP05.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSC01 WITH(NOLOCK)
         ON sh.SID = pSC01.SID
             AND sh.ObjectID = pSC01.ObjectID
             AND pSC01.PropertiesCode = 'SC01'
         LEFT OUTER JOIN master_conf_properties mpropSC01 WITH(NOLOCK)
             ON pSC01.SID = mpropSC01.SID
                 AND pSC01.PropertiesCode = mpropSC01.PropertiesCode
                 AND mpropSC01.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSC01 WITH(NOLOCK)
         ON pSC01.sid = selSC01.sid
             AND mpropSC01.SelectedCode = selSC01.Code
             AND pSC01.xValue = selSC01.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSC02 WITH(NOLOCK)
         ON sh.SID = pSC02.SID
             AND sh.ObjectID = pSC02.ObjectID
             AND pSC02.PropertiesCode = 'SC02'
         LEFT OUTER JOIN master_conf_properties mpropSC02 WITH(NOLOCK)
             ON pSC02.SID = mpropSC02.SID
                 AND pSC02.PropertiesCode = mpropSC02.PropertiesCode
                 AND mpropSC02.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSC02 WITH(NOLOCK)
         ON pSC02.sid = selSC02.sid
             AND mpropSC02.SelectedCode = selSC02.Code
             AND pSC02.xValue = selSC02.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSO02 WITH(NOLOCK)
         ON sh.SID = pSO02.SID
             AND sh.ObjectID = pSO02.ObjectID
             AND pSO02.PropertiesCode = 'SO02'
         LEFT OUTER JOIN master_conf_properties mpropSO02 WITH(NOLOCK)
             ON pSO02.SID = mpropSO02.SID
                 AND pSO02.PropertiesCode = mpropSO02.PropertiesCode
                 AND mpropSO02.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSO02 WITH(NOLOCK)
         ON pSO02.sid = selSO02.sid
             AND mpropSO02.SelectedCode = selSO02.Code
             AND pSO02.xValue = selSO02.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSO03 WITH(NOLOCK)
         ON sh.SID = pSO03.SID
             AND sh.ObjectID = pSO03.ObjectID
             AND pSO03.PropertiesCode = 'SO03'
         LEFT OUTER JOIN master_conf_properties mpropSO03 WITH(NOLOCK)
             ON pSO03.SID = mpropSO03.SID
                 AND pSO03.PropertiesCode = mpropSO03.PropertiesCode
                 AND mpropSO03.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSO03 WITH(NOLOCK)
         ON pSO03.sid = selSO03.sid
             AND mpropSO03.SelectedCode = selSO03.Code
             AND pSO03.xValue = selSO03.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSO04 WITH(NOLOCK)
         ON sh.SID = pSO04.SID
             AND sh.ObjectID = pSO04.ObjectID
             AND pSO04.PropertiesCode = 'SO04'
         LEFT OUTER JOIN master_conf_properties mpropSO04 WITH(NOLOCK)
             ON pSO04.SID = mpropSO04.SID
                 AND pSO04.PropertiesCode = mpropSO04.PropertiesCode
                 AND mpropSO04.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSO04 WITH(NOLOCK)
         ON pSO04.sid = selSO04.sid
             AND mpropSO04.SelectedCode = selSO04.Code
             AND pSO04.xValue = selSO04.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSO05 WITH(NOLOCK)
         ON sh.SID = pSO05.SID
             AND sh.ObjectID = pSO05.ObjectID
             AND pSO05.PropertiesCode = 'SO05'
         LEFT OUTER JOIN master_conf_properties mpropSO05 WITH(NOLOCK)
             ON pSO05.SID = mpropSO05.SID
                 AND pSO05.PropertiesCode = mpropSO05.PropertiesCode
                 AND mpropSO05.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSO05 WITH(NOLOCK)
         ON pSO05.sid = selSO05.sid
             AND mpropSO05.SelectedCode = selSO05.Code
             AND pSO05.xValue = selSO05.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSO06 WITH(NOLOCK)
         ON sh.SID = pSO06.SID
             AND sh.ObjectID = pSO06.ObjectID
             AND pSO06.PropertiesCode = 'SO06'
         LEFT OUTER JOIN master_conf_properties mpropSO06 WITH(NOLOCK)
             ON pSO06.SID = mpropSO06.SID
                 AND pSO06.PropertiesCode = mpropSO06.PropertiesCode
                 AND mpropSO06.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSO06 WITH(NOLOCK)
         ON pSO06.sid = selSO06.sid
             AND mpropSO06.SelectedCode = selSO06.Code
             AND pSO06.xValue = selSO06.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSO07 WITH(NOLOCK)
         ON sh.SID = pSO07.SID
             AND sh.ObjectID = pSO07.ObjectID
             AND pSO07.PropertiesCode = 'SO07'
         LEFT OUTER JOIN master_conf_properties mpropSO07 WITH(NOLOCK)
             ON pSO07.SID = mpropSO07.SID
                 AND pSO07.PropertiesCode = mpropSO07.PropertiesCode
                 AND mpropSO07.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSO07 WITH(NOLOCK)
         ON pSO07.sid = selSO07.sid
             AND mpropSO07.SelectedCode = selSO07.Code
             AND pSO07.xValue = selSO07.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSV01 WITH(NOLOCK)
         ON sh.SID = pSV01.SID
             AND sh.ObjectID = pSV01.ObjectID
             AND pSV01.PropertiesCode = 'SV01'
         LEFT OUTER JOIN master_conf_properties mpropSV01 WITH(NOLOCK)
             ON pSV01.SID = mpropSV01.SID
                 AND pSV01.PropertiesCode = mpropSV01.PropertiesCode
                 AND mpropSV01.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSV01 WITH(NOLOCK)
         ON pSV01.sid = selSV01.sid
             AND mpropSV01.SelectedCode = selSV01.Code
             AND pSV01.xValue = selSV01.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSV02 WITH(NOLOCK)
         ON sh.SID = pSV02.SID
             AND sh.ObjectID = pSV02.ObjectID
             AND pSV02.PropertiesCode = 'SV02'
         LEFT OUTER JOIN master_conf_properties mpropSV02 WITH(NOLOCK)
             ON pSV02.SID = mpropSV02.SID
                 AND pSV02.PropertiesCode = mpropSV02.PropertiesCode
                 AND mpropSV02.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSV02 WITH(NOLOCK)
         ON pSV02.sid = selSV02.sid
             AND mpropSV02.SelectedCode = selSV02.Code
             AND pSV02.xValue = selSV02.DetailCode
        LEFT OUTER JOIN sd_so_header_properties pSV03 WITH(NOLOCK)
         ON sh.SID = pSV03.SID
             AND sh.ObjectID = pSV03.ObjectID
             AND pSV03.PropertiesCode = 'SV03'
         LEFT OUTER JOIN master_conf_properties mpropSV03 WITH(NOLOCK)
             ON pSV03.SID = mpropSV03.SID
                 AND pSV03.PropertiesCode = mpropSV03.PropertiesCode
                 AND mpropSV03.xType = lo.PostingType
        LEFT OUTER JOIN master_conf_selectedvalue_detail selSV03 WITH(NOLOCK)
         ON pSV03.sid = selSV03.sid
             AND mpropSV03.SelectedCode = selSV03.Code
             AND pSV03.xValue = selSV03.DetailCode
        Where sh.Sid='555' and lo.PostingType='SO'  and sh.SaleDocument = @input_parameter;`
        let pool = await mssql.connect(config)
        let result1 = await pool.request()
            .input('input_parameter', sql.VarChar, RefJobNO)
            .query(sql_text)
        sql.close()
        if (result1.recordset.length !== 0){
          data_so = result1.recordset[0]
          if (data_so.ContractStartDate!==null){
              data_so.ContractStartDate = data_so.ContractStartDate.replace(/-/gi, "/")
          }else{
              data_so.ContractStartDate = ""
          }
          if (data_so.ContractEndDate!==null){
              data_so.ContractEndDate = data_so.ContractEndDate.replace(/-/gi, "/")
          }else{
              data_so.ContractEndDate = ""
          }
          // console.log(data_so.ContractStartDate)
          return [true,data_so]
        }else{
          return [false,'no data']
        }
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}
  
async function select_Sonumber(){
    try {
        let so_list = []
        sql_text = `Select distinct 
                isnull (sh.SaleDocument,'') as RefJobNO
            from sd_so_header sh
            Left outer join sd_so_header_sale ss on sh.SID=ss.SID and sh.ObjectID=ss.ObjectID
            Left outer join master_employee emp on ss.SID=emp.SID and ss.SaleRepresent=emp.EmployeeCode
            Left outer join master_payment_terms pmt on ss.SID=pmt.SID and ss.PmntTermCode=pmt.PaymentTermCode
            Left outer join sd_so_header_properties shp on sh.SID=shp.SID and shp.ObjectID=sh.ObjectID and shp.PropertiesCode='PROJ'
            Left outer join master_conf_selectedvalue_detail shps on shp.SID=shps.SID and shps.Code=shp.PropertiesCode and shp.xValue=shps.DetailCode
            Left outer join master_config_lo_doctype_docdetail lo on sh.SID=lo.SID and sh.companyCode=lo.companyCode and sh.Stypecode=lo.DocumentTypeCode
            Left outer join master_customer cus on sh.SID=cus.SID and sh.SoldToParty=cus.CustomerCode
            Left outer join master_TitleName Tit on cus.SID=Tit.SID and cus.TitleCode=Tit.TitleCode
            Left outer join sd_master_status stt on sh.SID=stt.SID and sh.Status=stt.Code
            Left outer join bl_item b on b.sid = sh.sid and b.CompanyRef = sh.CompanyCode and b.FiscalYearRef = sh.Fiscalyear and b.SaleQtRef = sh.SaleDocument
            LEFT OUTER JOIN sd_so_header_properties pCS01 WITH(NOLOCK)
            ON sh.SID = pCS01.SID
                AND sh.ObjectID = pCS01.ObjectID
                AND pCS01.PropertiesCode = 'CS01'
            LEFT OUTER JOIN master_conf_properties mpropCS01 WITH(NOLOCK)
                ON pCS01.SID = mpropCS01.SID
                    AND pCS01.PropertiesCode = mpropCS01.PropertiesCode
                    AND mpropCS01.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS01 WITH(NOLOCK)
            ON pCS01.sid = selCS01.sid
                AND mpropCS01.SelectedCode = selCS01.Code
                AND pCS01.xValue = selCS01.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS02 WITH(NOLOCK)
            ON sh.SID = pCS02.SID
                AND sh.ObjectID = pCS02.ObjectID
                AND pCS02.PropertiesCode = 'CS02'
            LEFT OUTER JOIN master_conf_properties mpropCS02 WITH(NOLOCK)
                ON pCS02.SID = mpropCS02.SID
                    AND pCS02.PropertiesCode = mpropCS02.PropertiesCode
                    AND mpropCS02.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS02 WITH(NOLOCK)
            ON pCS02.sid = selCS02.sid
                AND mpropCS02.SelectedCode = selCS02.Code
                AND pCS02.xValue = selCS02.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS03 WITH(NOLOCK)
            ON sh.SID = pCS03.SID
                AND sh.ObjectID = pCS03.ObjectID
                AND pCS03.PropertiesCode = 'CS03'
            LEFT OUTER JOIN master_conf_properties mpropCS03 WITH(NOLOCK)
                ON pCS03.SID = mpropCS03.SID
                    AND pCS03.PropertiesCode = mpropCS03.PropertiesCode
                    AND mpropCS03.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS03 WITH(NOLOCK)
            ON pCS03.sid = selCS03.sid
                AND mpropCS03.SelectedCode = selCS03.Code
                AND pCS03.xValue = selCS03.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS04 WITH(NOLOCK)
            ON sh.SID = pCS04.SID
                AND sh.ObjectID = pCS04.ObjectID
                AND pCS04.PropertiesCode = 'CS04'
            LEFT OUTER JOIN master_conf_properties mpropCS04 WITH(NOLOCK)
                ON pCS04.SID = mpropCS04.SID
                    AND pCS04.PropertiesCode = mpropCS04.PropertiesCode
                    AND mpropCS04.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS04 WITH(NOLOCK)
            ON pCS04.sid = selCS04.sid
                AND mpropCS04.SelectedCode = selCS04.Code
                AND pCS04.xValue = selCS04.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS05 WITH(NOLOCK)
            ON sh.SID = pCS05.SID
                AND sh.ObjectID = pCS05.ObjectID
                AND pCS05.PropertiesCode = 'CS05'
            LEFT OUTER JOIN master_conf_properties mpropCS05 WITH(NOLOCK)
                ON pCS05.SID = mpropCS05.SID
                    AND pCS05.PropertiesCode = mpropCS05.PropertiesCode
                    AND mpropCS05.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS05 WITH(NOLOCK)
            ON pCS05.sid = selCS05.sid
                AND mpropCS05.SelectedCode = selCS05.Code
                AND pCS05.xValue = selCS05.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS06 WITH(NOLOCK)
            ON sh.SID = pCS06.SID
                AND sh.ObjectID = pCS06.ObjectID
                AND pCS06.PropertiesCode = 'CS06'
            LEFT OUTER JOIN master_conf_properties mpropCS06 WITH(NOLOCK)
                ON pCS06.SID = mpropCS06.SID
                    AND pCS06.PropertiesCode = mpropCS06.PropertiesCode
                    AND mpropCS06.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS06 WITH(NOLOCK)
            ON pCS06.sid = selCS06.sid
                AND mpropCS06.SelectedCode = selCS06.Code
                AND pCS06.xValue = selCS06.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS07 WITH(NOLOCK)
            ON sh.SID = pCS07.SID
                AND sh.ObjectID = pCS07.ObjectID
                AND pCS07.PropertiesCode = 'CS07'
            LEFT OUTER JOIN master_conf_properties mpropCS07 WITH(NOLOCK)
                ON pCS07.SID = mpropCS07.SID
                    AND pCS07.PropertiesCode = mpropCS07.PropertiesCode
                    AND mpropCS07.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS07 WITH(NOLOCK)
            ON pCS07.sid = selCS07.sid
                AND mpropCS07.SelectedCode = selCS07.Code
                AND pCS07.xValue = selCS07.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS08 WITH(NOLOCK)
            ON sh.SID = pCS08.SID
                AND sh.ObjectID = pCS08.ObjectID
                AND pCS08.PropertiesCode = 'CS08'
            LEFT OUTER JOIN master_conf_properties mpropCS08 WITH(NOLOCK)
                ON pCS08.SID = mpropCS08.SID
                    AND pCS08.PropertiesCode = mpropCS08.PropertiesCode
                    AND mpropCS08.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS08 WITH(NOLOCK)
            ON pCS08.sid = selCS08.sid
                AND mpropCS08.SelectedCode = selCS08.Code
                AND pCS08.xValue = selCS08.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS09 WITH(NOLOCK)
            ON sh.SID = pCS09.SID
                AND sh.ObjectID = pCS09.ObjectID
                AND pCS09.PropertiesCode = 'CS09'
            LEFT OUTER JOIN master_conf_properties mpropCS09 WITH(NOLOCK)
                ON pCS09.SID = mpropCS09.SID
                    AND pCS09.PropertiesCode = mpropCS09.PropertiesCode
                    AND mpropCS09.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS09 WITH(NOLOCK)
            ON pCS09.sid = selCS09.sid
                AND mpropCS09.SelectedCode = selCS09.Code
                AND pCS09.xValue = selCS09.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS10 WITH(NOLOCK)
            ON sh.SID = pCS10.SID
                AND sh.ObjectID = pCS10.ObjectID
                AND pCS10.PropertiesCode = 'CS10'
            LEFT OUTER JOIN master_conf_properties mpropCS10 WITH(NOLOCK)
                ON pCS10.SID = mpropCS10.SID
                    AND pCS10.PropertiesCode = mpropCS10.PropertiesCode
                    AND mpropCS10.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS10 WITH(NOLOCK)
            ON pCS10.sid = selCS10.sid
                AND mpropCS10.SelectedCode = selCS10.Code
                AND pCS10.xValue = selCS10.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS11 WITH(NOLOCK)
            ON sh.SID = pCS11.SID
                AND sh.ObjectID = pCS11.ObjectID
                AND pCS11.PropertiesCode = 'CS11'
            LEFT OUTER JOIN master_conf_properties mpropCS11 WITH(NOLOCK)
                ON pCS11.SID = mpropCS11.SID
                    AND pCS11.PropertiesCode = mpropCS11.PropertiesCode
                    AND mpropCS11.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS11 WITH(NOLOCK)
            ON pCS11.sid = selCS11.sid
                AND mpropCS11.SelectedCode = selCS11.Code
                AND pCS11.xValue = selCS11.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS14 WITH(NOLOCK)
            ON sh.SID = pCS14.SID
                AND sh.ObjectID = pCS14.ObjectID
                AND pCS14.PropertiesCode = 'CS14'
            LEFT OUTER JOIN master_conf_properties mpropCS14 WITH(NOLOCK)
                ON pCS14.SID = mpropCS14.SID
                    AND pCS14.PropertiesCode = mpropCS14.PropertiesCode
                    AND mpropCS14.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS14 WITH(NOLOCK)
            ON pCS14.sid = selCS14.sid
                AND mpropCS14.SelectedCode = selCS14.Code
                AND pCS14.xValue = selCS14.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS21 WITH(NOLOCK)
            ON sh.SID = pCS21.SID
                AND sh.ObjectID = pCS21.ObjectID
                AND pCS21.PropertiesCode = 'CS21'
            LEFT OUTER JOIN master_conf_properties mpropCS21 WITH(NOLOCK)
                ON pCS21.SID = mpropCS21.SID
                    AND pCS21.PropertiesCode = mpropCS21.PropertiesCode
                    AND mpropCS21.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS21 WITH(NOLOCK)
            ON pCS21.sid = selCS21.sid
                AND mpropCS21.SelectedCode = selCS21.Code
                AND pCS21.xValue = selCS21.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS22 WITH(NOLOCK)
            ON sh.SID = pCS22.SID
                AND sh.ObjectID = pCS22.ObjectID
                AND pCS22.PropertiesCode = 'CS22'
            LEFT OUTER JOIN master_conf_properties mpropCS22 WITH(NOLOCK)
                ON pCS22.SID = mpropCS22.SID
                    AND pCS22.PropertiesCode = mpropCS22.PropertiesCode
                    AND mpropCS22.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS22 WITH(NOLOCK)
            ON pCS22.sid = selCS22.sid
                AND mpropCS22.SelectedCode = selCS22.Code
                AND pCS22.xValue = selCS22.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS23 WITH(NOLOCK)
            ON sh.SID = pCS23.SID
                AND sh.ObjectID = pCS23.ObjectID
                AND pCS23.PropertiesCode = 'CS23'
            LEFT OUTER JOIN master_conf_properties mpropCS23 WITH(NOLOCK)
                ON pCS23.SID = mpropCS23.SID
                    AND pCS23.PropertiesCode = mpropCS23.PropertiesCode
                    AND mpropCS23.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS23 WITH(NOLOCK)
            ON pCS23.sid = selCS23.sid
                AND mpropCS23.SelectedCode = selCS23.Code
                AND pCS23.xValue = selCS23.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS24 WITH(NOLOCK)
            ON sh.SID = pCS24.SID
                AND sh.ObjectID = pCS24.ObjectID
                AND pCS24.PropertiesCode = 'CS24'
            LEFT OUTER JOIN master_conf_properties mpropCS24 WITH(NOLOCK)
                ON pCS24.SID = mpropCS24.SID
                    AND pCS24.PropertiesCode = mpropCS24.PropertiesCode
                    AND mpropCS24.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS24 WITH(NOLOCK)
            ON pCS24.sid = selCS24.sid
                AND mpropCS24.SelectedCode = selCS24.Code
                AND pCS24.xValue = selCS24.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS25 WITH(NOLOCK)
            ON sh.SID = pCS25.SID
                AND sh.ObjectID = pCS25.ObjectID
                AND pCS25.PropertiesCode = 'CS25'
            LEFT OUTER JOIN master_conf_properties mpropCS25 WITH(NOLOCK)
                ON pCS25.SID = mpropCS25.SID
                    AND pCS25.PropertiesCode = mpropCS25.PropertiesCode
                    AND mpropCS25.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS25 WITH(NOLOCK)
            ON pCS25.sid = selCS25.sid
                AND mpropCS25.SelectedCode = selCS25.Code
                AND pCS25.xValue = selCS25.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS26 WITH(NOLOCK)
            ON sh.SID = pCS26.SID
                AND sh.ObjectID = pCS26.ObjectID
                AND pCS26.PropertiesCode = 'CS26'
            LEFT OUTER JOIN master_conf_properties mpropCS26 WITH(NOLOCK)
                ON pCS26.SID = mpropCS26.SID
                    AND pCS26.PropertiesCode = mpropCS26.PropertiesCode
                    AND mpropCS26.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS26 WITH(NOLOCK)
            ON pCS26.sid = selCS26.sid
                AND mpropCS26.SelectedCode = selCS26.Code
                AND pCS26.xValue = selCS26.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS27 WITH(NOLOCK)
            ON sh.SID = pCS27.SID
                AND sh.ObjectID = pCS27.ObjectID
                AND pCS27.PropertiesCode = 'CS27'
            LEFT OUTER JOIN master_conf_properties mpropCS27 WITH(NOLOCK)
                ON pCS27.SID = mpropCS27.SID
                    AND pCS27.PropertiesCode = mpropCS27.PropertiesCode
                    AND mpropCS27.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS27 WITH(NOLOCK)
            ON pCS27.sid = selCS27.sid
                AND mpropCS27.SelectedCode = selCS27.Code
                AND pCS27.xValue = selCS27.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS28 WITH(NOLOCK)
            ON sh.SID = pCS28.SID
                AND sh.ObjectID = pCS28.ObjectID
                AND pCS28.PropertiesCode = 'CS28'
            LEFT OUTER JOIN master_conf_properties mpropCS28 WITH(NOLOCK)
                ON pCS28.SID = mpropCS28.SID
                    AND pCS28.PropertiesCode = mpropCS28.PropertiesCode
                    AND mpropCS28.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS28 WITH(NOLOCK)
            ON pCS28.sid = selCS28.sid
                AND mpropCS28.SelectedCode = selCS28.Code
                AND pCS28.xValue = selCS28.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pCS29 WITH(NOLOCK)
            ON sh.SID = pCS29.SID
                AND sh.ObjectID = pCS29.ObjectID
                AND pCS29.PropertiesCode = 'CS29'
            LEFT OUTER JOIN master_conf_properties mpropCS29 WITH(NOLOCK)
                ON pCS29.SID = mpropCS29.SID
                    AND pCS29.PropertiesCode = mpropCS29.PropertiesCode
                    AND mpropCS29.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selCS29 WITH(NOLOCK)
            ON pCS29.sid = selCS29.sid
                AND mpropCS29.SelectedCode = selCS29.Code
                AND pCS29.xValue = selCS29.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pQP04 WITH(NOLOCK)
            ON sh.SID = pQP04.SID
                AND sh.ObjectID = pQP04.ObjectID
                AND pQP04.PropertiesCode = 'QP04'
            LEFT OUTER JOIN master_conf_properties mpropQP04 WITH(NOLOCK)
                ON pQP04.SID = mpropQP04.SID
                    AND pQP04.PropertiesCode = mpropQP04.PropertiesCode
                    AND mpropQP04.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selQP04 WITH(NOLOCK)
            ON pQP04.sid = selQP04.sid
                AND mpropQP04.SelectedCode = selQP04.Code
                AND pQP04.xValue = selQP04.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pQP05 WITH(NOLOCK)
            ON sh.SID = pQP05.SID
                AND sh.ObjectID = pQP05.ObjectID
                AND pQP05.PropertiesCode = 'QP05'
            LEFT OUTER JOIN master_conf_properties mpropQP05 WITH(NOLOCK)
                ON pQP05.SID = mpropQP05.SID
                    AND pQP05.PropertiesCode = mpropQP05.PropertiesCode
                    AND mpropQP05.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selQP05 WITH(NOLOCK)
            ON pQP05.sid = selQP05.sid
                AND mpropQP05.SelectedCode = selQP05.Code
                AND pQP05.xValue = selQP05.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSC01 WITH(NOLOCK)
            ON sh.SID = pSC01.SID
                AND sh.ObjectID = pSC01.ObjectID
                AND pSC01.PropertiesCode = 'SC01'
            LEFT OUTER JOIN master_conf_properties mpropSC01 WITH(NOLOCK)
                ON pSC01.SID = mpropSC01.SID
                    AND pSC01.PropertiesCode = mpropSC01.PropertiesCode
                    AND mpropSC01.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSC01 WITH(NOLOCK)
            ON pSC01.sid = selSC01.sid
                AND mpropSC01.SelectedCode = selSC01.Code
                AND pSC01.xValue = selSC01.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSC02 WITH(NOLOCK)
            ON sh.SID = pSC02.SID
                AND sh.ObjectID = pSC02.ObjectID
                AND pSC02.PropertiesCode = 'SC02'
            LEFT OUTER JOIN master_conf_properties mpropSC02 WITH(NOLOCK)
                ON pSC02.SID = mpropSC02.SID
                    AND pSC02.PropertiesCode = mpropSC02.PropertiesCode
                    AND mpropSC02.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSC02 WITH(NOLOCK)
            ON pSC02.sid = selSC02.sid
                AND mpropSC02.SelectedCode = selSC02.Code
                AND pSC02.xValue = selSC02.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSO02 WITH(NOLOCK)
            ON sh.SID = pSO02.SID
                AND sh.ObjectID = pSO02.ObjectID
                AND pSO02.PropertiesCode = 'SO02'
            LEFT OUTER JOIN master_conf_properties mpropSO02 WITH(NOLOCK)
                ON pSO02.SID = mpropSO02.SID
                    AND pSO02.PropertiesCode = mpropSO02.PropertiesCode
                    AND mpropSO02.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSO02 WITH(NOLOCK)
            ON pSO02.sid = selSO02.sid
                AND mpropSO02.SelectedCode = selSO02.Code
                AND pSO02.xValue = selSO02.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSO03 WITH(NOLOCK)
            ON sh.SID = pSO03.SID
                AND sh.ObjectID = pSO03.ObjectID
                AND pSO03.PropertiesCode = 'SO03'
            LEFT OUTER JOIN master_conf_properties mpropSO03 WITH(NOLOCK)
                ON pSO03.SID = mpropSO03.SID
                    AND pSO03.PropertiesCode = mpropSO03.PropertiesCode
                    AND mpropSO03.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSO03 WITH(NOLOCK)
            ON pSO03.sid = selSO03.sid
                AND mpropSO03.SelectedCode = selSO03.Code
                AND pSO03.xValue = selSO03.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSO04 WITH(NOLOCK)
            ON sh.SID = pSO04.SID
                AND sh.ObjectID = pSO04.ObjectID
                AND pSO04.PropertiesCode = 'SO04'
            LEFT OUTER JOIN master_conf_properties mpropSO04 WITH(NOLOCK)
                ON pSO04.SID = mpropSO04.SID
                    AND pSO04.PropertiesCode = mpropSO04.PropertiesCode
                    AND mpropSO04.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSO04 WITH(NOLOCK)
            ON pSO04.sid = selSO04.sid
                AND mpropSO04.SelectedCode = selSO04.Code
                AND pSO04.xValue = selSO04.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSO05 WITH(NOLOCK)
            ON sh.SID = pSO05.SID
                AND sh.ObjectID = pSO05.ObjectID
                AND pSO05.PropertiesCode = 'SO05'
            LEFT OUTER JOIN master_conf_properties mpropSO05 WITH(NOLOCK)
                ON pSO05.SID = mpropSO05.SID
                    AND pSO05.PropertiesCode = mpropSO05.PropertiesCode
                    AND mpropSO05.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSO05 WITH(NOLOCK)
            ON pSO05.sid = selSO05.sid
                AND mpropSO05.SelectedCode = selSO05.Code
                AND pSO05.xValue = selSO05.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSO06 WITH(NOLOCK)
            ON sh.SID = pSO06.SID
                AND sh.ObjectID = pSO06.ObjectID
                AND pSO06.PropertiesCode = 'SO06'
            LEFT OUTER JOIN master_conf_properties mpropSO06 WITH(NOLOCK)
                ON pSO06.SID = mpropSO06.SID
                    AND pSO06.PropertiesCode = mpropSO06.PropertiesCode
                    AND mpropSO06.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSO06 WITH(NOLOCK)
            ON pSO06.sid = selSO06.sid
                AND mpropSO06.SelectedCode = selSO06.Code
                AND pSO06.xValue = selSO06.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSO07 WITH(NOLOCK)
            ON sh.SID = pSO07.SID
                AND sh.ObjectID = pSO07.ObjectID
                AND pSO07.PropertiesCode = 'SO07'
            LEFT OUTER JOIN master_conf_properties mpropSO07 WITH(NOLOCK)
                ON pSO07.SID = mpropSO07.SID
                    AND pSO07.PropertiesCode = mpropSO07.PropertiesCode
                    AND mpropSO07.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSO07 WITH(NOLOCK)
            ON pSO07.sid = selSO07.sid
                AND mpropSO07.SelectedCode = selSO07.Code
                AND pSO07.xValue = selSO07.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSV01 WITH(NOLOCK)
            ON sh.SID = pSV01.SID
                AND sh.ObjectID = pSV01.ObjectID
                AND pSV01.PropertiesCode = 'SV01'
            LEFT OUTER JOIN master_conf_properties mpropSV01 WITH(NOLOCK)
                ON pSV01.SID = mpropSV01.SID
                    AND pSV01.PropertiesCode = mpropSV01.PropertiesCode
                    AND mpropSV01.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSV01 WITH(NOLOCK)
            ON pSV01.sid = selSV01.sid
                AND mpropSV01.SelectedCode = selSV01.Code
                AND pSV01.xValue = selSV01.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSV02 WITH(NOLOCK)
            ON sh.SID = pSV02.SID
                AND sh.ObjectID = pSV02.ObjectID
                AND pSV02.PropertiesCode = 'SV02'
            LEFT OUTER JOIN master_conf_properties mpropSV02 WITH(NOLOCK)
                ON pSV02.SID = mpropSV02.SID
                    AND pSV02.PropertiesCode = mpropSV02.PropertiesCode
                    AND mpropSV02.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSV02 WITH(NOLOCK)
            ON pSV02.sid = selSV02.sid
                AND mpropSV02.SelectedCode = selSV02.Code
                AND pSV02.xValue = selSV02.DetailCode
            LEFT OUTER JOIN sd_so_header_properties pSV03 WITH(NOLOCK)
            ON sh.SID = pSV03.SID
                AND sh.ObjectID = pSV03.ObjectID
                AND pSV03.PropertiesCode = 'SV03'
            LEFT OUTER JOIN master_conf_properties mpropSV03 WITH(NOLOCK)
                ON pSV03.SID = mpropSV03.SID
                    AND pSV03.PropertiesCode = mpropSV03.PropertiesCode
                    AND mpropSV03.xType = lo.PostingType
            LEFT OUTER JOIN master_conf_selectedvalue_detail selSV03 WITH(NOLOCK)
            ON pSV03.sid = selSV03.sid
                AND mpropSV03.SelectedCode = selSV03.Code
                AND pSV03.xValue = selSV03.DetailCode
            Where sh.Sid='555' and lo.PostingType='SO';`
        let pool = await mssql.connect(config)
        let result1 = await pool.request()
            .query(sql_text)
        sql.close()
        if (result1.recordset.length !== 0){
            for (let i = 0; i < result1.recordset.length; i++) {
                so_list.push(result1.recordset[i].RefJobNO)
            } 
            return [true,so_list]
        }else{
            return [false,'no data']
        }
    } catch (error) {
        console.log(error)
        return [false,error.message]
    }
}

module.exports = {
    select_So_one,
    select_Sonumber
}