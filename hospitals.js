const puppeteer = require('puppeteer');
const fs = require('fs');


let scrape = async () => {
    const browser = await puppeteer.launch({ headless: false });
    var lastPageNumber = 1;
    var results = []; // variable to hold collection of all book titles and prices
    for (let index = 1; index <= lastPageNumber; index++) {
        var page = await browser.newPage();
        var pageUrl = "http://www.e-daleel.gov.jo/search/index?view=tab&q=&solr-search-type=q&f%5B0%5D=yii_doc_type%3AMOH&f%5B1%5D=moh_moh_type%3A%25D9%2585%25D8%25B3%25D8%25AA%25D8%25B4%25D9%2581%25D9%2589%2B%25D8%25AE%25D8%25A7%25D8%25B5&"+index+"&per-page=10";
        await page.goto(pageUrl);
        await page.waitFor(2500);
        //await page.waitForSelector(".solr-result-page");
        var hIndex = 10;//10
        for (let index1 = 1; index1 <= hIndex; index1++) {
            await page.click(".solr-result-page .tabbed-search-result:nth-child("+index1+") .z-container .z-content-inner table tr:nth-child(1) a");
            await page.waitFor(1000);
            results.push(await extractedEvaluateCall(page));
            await page.goto(pageUrl);
        }
        page.close();
    }

    browser.close();
    fs.writeFile('output/private-hospitals.json', JSON.stringify(results), function(err) {
        if (err) throw err;
        console.log('write json on result file complete');
    });
    return results;
};

async function extractedEvaluateCall(page) {
    // just extracted same exact logic in separate function
    // this function should use async keyword in order to work and take page as argument
    return page.evaluate((v) => {
        console.log(v);
        let data = {};
        if (document.querySelector(".panel-info:nth-child(1) .panel-heading.blue")) {
            var hospital_name= document.querySelector(".panel-info:nth-child(1) .panel-heading.blue").innerText;
        } else {
            var hospital_name= "";
        }
        if(document.querySelector(".panel-info:nth-child(1) table tr:nth-child(2) td:nth-child(2)")) {
            var hospital_phone= document.querySelector(".panel-info:nth-child(1) table tr:nth-child(2) td:nth-child(2)").innerText;
        } else {
            var hospital_phone= "";
        }
        if (document.querySelector(".panel-info:nth-child(1) table tr:nth-child(3) td:nth-child(2)")) {
            var hospital_sector=document.querySelector(".panel-info:nth-child(1) table tr:nth-child(3) td:nth-child(2)").innerText;
        } else {
            var hospital_sector="";
        }
        
        if (document.querySelector(".panel-info:nth-child(2) table tr:nth-child(3) td:nth-child(2)")) {
            var hospital_manager=document.querySelector(".panel-info:nth-child(2) table tr:nth-child(3) td:nth-child(2)").innerText;
        } else {
            var hospital_manager="";
        }
        if (document.querySelector(".panel-info:nth-child(5) table:nth-child(1) tr:nth-child(2) td:nth-child(2)")) {
            var hospital_type=document.querySelector(".panel-info:nth-child(5) table:nth-child(1) tr:nth-child(2) td:nth-child(2)").innerText;
        } else {
            var hospital_type="";
        }
        if (document.querySelector(".panel-info:nth-child(5) table:nth-child(1) tr:nth-child(3) td:nth-child(2)")) {
            var hospital_speciality=document.querySelector(".panel-info:nth-child(5) table:nth-child(1) tr:nth-child(3) td:nth-child(2)").innerText;
        } else {
            var hospital_speciality="";
        }
        
        data = {
            "hospital name": hospital_name,
            "hospital phone": hospital_phone,
            "hospital manager": hospital_manager,
            "hospital Sector": hospital_sector,
            "hospital Type": hospital_type,
            "hospital speciality": hospital_speciality
        };
        return data;
    });
}

scrape().then((value) => {
    //console.log(value);
    console.log('Collection length: ' + value.length);
    //console.log(value[0]);
    //console.log(value[value.length - 1]);
});