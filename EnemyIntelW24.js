// ==UserScript==
// @name         W24 - EnemyInfo
// @description  Enemy Information for YAFl W24
// @copyright    Kalish, 2020
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @author       Greety, Fact, Kalish
// @match        https://w24.crownofthegods.com/
// @include		 https://w24.crownofthegods.com/?s=*

// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function LoadSheet(sheet) {
        return fetch(sheet)
            .then((response) => {return response.text();})
            .then((html) => {
            let name, data = new Array(), spreadsheet = new DOMParser().parseFromString(html, "text/html");
            spreadsheet.querySelectorAll(".waffle > tbody").forEach(function(tbody, table) {
                name = spreadsheet.querySelector("#sheet-menu") ? spreadsheet.querySelectorAll("#sheet-menu > li > a")[table].innerHTML : spreadsheet.querySelector("#doc-title > span").innerHTML.split(": ")[1];
                data[name] = [];
                tbody.querySelectorAll("tr").forEach(function(tr, line) {
                    data[name].push([]);
                    tr.querySelectorAll("td").forEach(function(td, column) {
                        if(td.innerHTML) data[name][line].push(td.innerHTML);
                        else data[name][line].push("");
                    });
                });
            });
            return data;
        });
    }
    $("#cityplayerInfo").append("<div class='smallredheading'><small><p id='TroopsHere'></p><p id='FormLinkGFUNKY'></p></small></div>");
    const WatchCity = new MutationObserver(function() {
	//link comes from the published sheet section
	LoadSheet("https://docs.google.com/spreadsheets/d/e/2PACX-1vQxsaN3fqtIssMRpqPaz_0SqbIKTl3jIwjDxO0yG9o87gz8a3N42yiZ3oPtFCRs38Hrvbr9BAIOiej-/pubhtml").then(data => {
            let DiscoveredTroopInfo;
            data[Object.keys(data)[0]].forEach(function(entry, index) {
                if ($("#citycoords").text() == entry[3]) DiscoveredTroopInfo = entry;
            });
            (DiscoveredTroopInfo != null) ? $("#TroopsHere").html(DiscoveredTroopInfo[0].split("/")[1]+"/"+DiscoveredTroopInfo[0].split("/")[0]+": "+DiscoveredTroopInfo[2]) : $("#TroopsHere").text("No Info");

			//link comes from "prefilled link"
            $("#FormLinkGFUNKY").html("<a href='https://docs.google.com/forms/d/e/1FAIpQLSexYNboKHlB2VQSRnsL0gDD97evL8-lW1vio7NeasuAzLllCw/viewform?entry.109348414="+$('#citycoords').text()+"&entry.1683452871="+$('#cityplayername').text()+"&entry.1949543373="+$('#citycont').text()+"&entry.473721675="+$('#cityplayeralliance').text()+"&entry.1294457972="+$('#landframe').hasClass('framewater')+"'target='_blank'>Open in form</a>");
        });
    });
    WatchCity.observe(document.querySelector("#citycoords"), {childList: true});
	WatchCity.observe(document.querySelector("#cityplayername"), {childList: true});
	WatchCity.observe(document.querySelector("#cityplayeralliance"), {childList: true});
	WatchCity.observe(document.querySelector("#citycont"), {childList: true});


})();
