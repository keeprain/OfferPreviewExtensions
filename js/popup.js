/* old code to read data directly from RSP page
  chrome.runtime.onMessage.addListener(function (request, sender) {


  if (request.action == "getSource") {
    var jsonData = request.source;
    message.hidden = true;
    offerpreview.hidden = false;

    var creativeRequest = new XMLHttpRequest();
    creativeRequest.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:

        var jsonOfferCreativeData = JSON.parse(creativeRequest.responseText);
        parseJsonToPageContent(jsonOfferCreativeData);

      }
    };
    var creativeUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/creative/localizedOffer?offerId=" + localStorage['currentOfferId'] + '&locale=en_US';
    creativeRequest.open("POST", creativeUrl, true);
    creativeRequest.send();

    localStorage["offerId"] = jsonData["offerId"];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // Typical action to be performed when the document is ready:
        var jsonOfferDetail = JSON.parse(xhttp.responseText);
        parsePriceInfo(jsonOfferDetail);

      }
    };
    var xmlUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/search/offer?offerId=" + localStorage['currentOfferId'];
    xhttp.open("POST", xmlUrl, true);
    xhttp.send();


  }
});
*/

function parseJsonToPageContent(jsonOfferCreativeData) {
  clearPreviousPreview();
  console.log(jsonOfferCreativeData);
  if (jsonOfferCreativeData['detailPageImagery']) {
    document.getElementById('heroimage').src = jsonOfferCreativeData['detailPageImagery']['heroImage']['src'];

    document.getElementById('altimage1').src = jsonOfferCreativeData['detailPageImagery']['additionalImages'][0]['src'];
    if (jsonOfferCreativeData['detailPageImagery']['additionalImages'].length > 1) {
      var ele = document.getElementById("altimge2Div");
      ele.hidden = false;
      var img = document.getElementById("altimage2")
      img.src = jsonOfferCreativeData['detailPageImagery']['additionalImages'][1]['src'];
    }
  }
  if (jsonOfferCreativeData['detailPageCopy']) {
    document.getElementById('headline').innerText = jsonOfferCreativeData['detailPageCopy']['offerTitle'];
    document.getElementById('summary').innerText = jsonOfferCreativeData['detailPageCopy']['offerSubTitle'];

    var element = document.getElementById("whatyouget-text");
    element.appendChild(StringToHTMLElement(jsonOfferCreativeData['detailPageCopy']['whatsIncluded']));

    element = document.getElementById("whywepickedit-text");
    element.appendChild(StringToHTMLElement(jsonOfferCreativeData['detailPageCopy']['whyWePickedIt']));
    var sessionHeight = document.getElementById('whywepickedit-innerdiv').clientHeight;
    console.log(sessionHeight);
    if (sessionHeight < 200 ) {
      document.getElementById("whywepickedit-middlediv").setAttribute("style", "max-height: none; height: auto;")
      document.getElementById("whywepickedit-seemore").hidden = true;
      document.getElementById("whywepickedit-fade").hidden = true;
    }    

    element = document.getElementById("wewantyoutoknow-text");
    element.appendChild(StringToHTMLElement(jsonOfferCreativeData['detailPageCopy']['weWantYouToKnow']));

    sessionHeight = document.getElementById('wewantyoutoknow-innerdiv').clientHeight;
    console.log(sessionHeight);
    if (sessionHeight < 200 ) {
      document.getElementById("wewantyoutoknow-middlediv").setAttribute("style", "max-height: none; height: auto;")
      document.getElementById("wewantyoutoknow-seemore").hidden = true;
      document.getElementById("wewantyoutoknow-fade").hidden = true;
    }    

    document.getElementById('howtogetithome-title').innerText = jsonOfferCreativeData['detailPageCopy']['howToGetItHome']['accessibilityText'];
    document.getElementById('howtogetithome-image').src = jsonOfferCreativeData['detailPageCopy']['howToGetItHome']['src'];
    document.getElementById('sizeandweight-specifications').innerText = jsonOfferCreativeData['detailPageCopy']['sizeAndWeight']['summaryText'];
    document.getElementById('size-and-weight-specifications').innerText = jsonOfferCreativeData['detailPageCopy']['sizeAndWeight']['specificationText'];


  }
}

function clearPreviousPreview() {
  document.getElementById('heroimage').src = "";
  document.getElementById('altimage1').src = "";
  document.getElementById("altimage2").src = "";
  document.getElementById('headline').innerText = "";
  document.getElementById('summary').innerText = "";
  document.getElementById("whatyouget-text").innerHTML = "";
  document.getElementById("whywepickedit-text").innerHTML = "";
  document.getElementById("wewantyoutoknow-text").innerHTML = "";
  document.getElementById('howtogetithome-title').innerText = "";
  document.getElementById('howtogetithome-image').src = "";
  document.getElementById('sizeandweight-specifications').innerText = "";
  document.getElementById('size-and-weight-specifications').innerText = "";
  document.getElementById("whywepickedit-middlediv").setAttribute("style", "max-height: none; height: 200px;")
  document.getElementById("whywepickedit-seemore").hidden = false;
  document.getElementById("whywepickedit-fade").hidden = false;
  document.getElementById("wewantyoutoknow-middlediv").setAttribute("style", "max-height: none; height: 200px;")
  document.getElementById("wewantyoutoknow-seemore").hidden = false;
  document.getElementById("wewantyoutoknow-fade").hidden = false;
  toggleToCollaps("whywepickedit");
  toggleToCollaps("wewantyoutoknow");
}

//take input JSON Data jsonOfferDetail to get price info and whether it's perishable or non-prerishable. Show price based on product type.
function parsePriceInfo(jsonOfferDetail) {

  if (jsonOfferDetail['offerType'] == "BUYABLE") {
    document.getElementById('sample-badge-div').hidden = true;
    document.getElementById("price").innerText = "$" + jsonOfferDetail['offerPrice']['amount'];
    if (jsonOfferDetail['productType'] == "NON_PERISHABLE") {
      document.getElementById("discount").hidden = false;
    } else {
      document.getElementById("discount").hidden = true;
    }

  } else {
    document.getElementById("price").hidden = true;
    document.getElementById("discount").hidden = true;
    document.getElementById('sample-badge-div').hidden = false;
  }
}

// function to convert raw string of "Why we pick it" & "What we want you to know" to <p> and <hr> (for "***"") to be able attached back to html
function StringToHTMLElement(str) {
  var strArr = str.split("***");
  var arrLength = strArr.length;
  var element = document.createElement("div");

  for (var i = 0; i < arrLength - 1; i++) {
    var para = document.createElement("p");
    //var node = document.createTextNode(strArr[i]);
    //para.appendChild(node);
    para.innerHTML = mmd(strArr[i]);
    console.log(mmd(strArr[i]));
    element.appendChild(para);
    var hr = document.createElement("hr");
    element.appendChild(hr);
  }
  var para = document.createElement("p");
  para.innerHTML = mmd(strArr[i]);
  //var node = document.createTextNode(strArr[arrLength - 1]);
  //para.appendChild(node);
  element.appendChild(para);

  return element;
}

function onWindowLoad() {


  var offerList = document.querySelector('#offerList');

  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, function (tabs) {
    // and use that tab to fill in out title and url
    var tab = tabs[0];
    console.log(tab.url);

    //check current URL to see whether the users are on RSP page of a single offer. If true, show offer preview directly. If not, show a list 
    if (tab.url.includes("tesoro-offer-management") && tab.url.includes('offerId%3D')) {

      var index = tab.url.indexOf("offerId%3D");
      var currentOfferId = tab.url.substring(index + 10, index + 46);
      console.log(currentOfferId);
      showFutureOffers();
      loadOfferPreviewinPopup(currentOfferId);
      document.getElementById("desktopLink").setAttribute("data-id", currentOfferId);
    }
    else {
      showFutureOffers();
      //document.getElementById("offerPreview").hidden = true;
      //document.getElementById("offerList").hidden = false;
    }
  });
  /*
    chrome.tabs.executeScript(null, {
      file: "getPagesSource.js"
    }, function () {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        offerList.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.offerList;
      }
    });
    */
  document.getElementById("whywepickedit-seemore").onclick = function () { toggle("whywepickedit"); };
  document.getElementById("wewantyoutoknow-seemore").onclick = function () { toggle("wewantyoutoknow"); };

  document.getElementById("offerListLink").onclick = function () { backToOfferList() };

  var offerId = document.getElementById("mobileLink").getAttribute("data-id");
  document.getElementById("mobileLink").onclick = function () { openMobilePreview() };
  
  document.getElementById("desktopLink").onclick = function () { openDesktopPreview(offerId)};
  

}

function backToOfferList() {
  document.getElementById("offerpreview").hidden = true;
  document.getElementById("offerList").hidden = false;
  //localStorage["currentOfferId"] = "";
}

function openMobilePreview() {
  //localStorage["offerId"] = offerId;
  chrome.tabs.create({ url: "mobilepreview.html" });
}


function openDesktopPreview() {
  //localStorage["offerId"] = offerId;
  chrome.tabs.create({url: "desktoppreview.html"});
}

function toggle(prefix) {

  var x = document.getElementById(prefix + "-innerdiv").getAttribute("aria-expanded");
  if (x == "true") {
    x = "false";
    document.getElementById(prefix + "-innerdiv").setAttribute("aria-expanded", false);
    document.getElementById(prefix + '-middlediv').setAttribute("style", "max-height: none; height: 200px;");
    document.getElementById(prefix + '-seemore').getElementsByTagName("i")[0].setAttribute("class", "a-icon a-icon-extender-expand");
    document.getElementById(prefix + '-seemore').getElementsByTagName("span")[0].innerText = "See Mores";
    document.getElementById(prefix + '-fade').setAttribute("style", "");
  } else {
    x = "true";
    document.getElementById(prefix + "-innerdiv").setAttribute("aria-expanded", true);
    document.getElementById(prefix + '-middlediv').setAttribute("style", "max-height: none; height: auto;");
    document.getElementById(prefix + '-seemore').getElementsByTagName("i")[0].setAttribute("class", "a-icon a-icon-extender-collapse");
    document.getElementById(prefix + '-seemore').getElementsByTagName("span")[0].innerText = "See Less";
    document.getElementById(prefix + '-fade').setAttribute("style", "display: none;");

  }

  return false;
}

function toggleToCollaps(prefix) {
  document.getElementById(prefix + "-innerdiv").setAttribute("aria-expanded", false);
  document.getElementById(prefix + '-middlediv').setAttribute("style", "max-height: none; height: 200px;");
  document.getElementById(prefix + '-seemore').getElementsByTagName("i")[0].setAttribute("class", "a-icon a-icon-extender-expand");
  document.getElementById(prefix + '-seemore').getElementsByTagName("span")[0].innerText = "See Mores";
  document.getElementById(prefix + '-fade').setAttribute("style", "");
}

function showFutureOffers() {
  /*
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:

      var jsonData = JSON.parse(request.responseText);
      //??parseJsonToPageContent(jsonOfferCreativeData);
      parseJsonToOfferList(jsonData);
    }
  };
  */
  var date = new Date();
  var fromDate = date.getTime();
  var toDate = date.getTime() + 7 * 24 * 60 * 60 * 1000;
  var url = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/search/offersDate?fromDate=" + fromDate
    + "&toDate=" + toDate;
  /*
  request.open("POST", url, true);
  request.send();
  */
  $.ajax({
    type: 'POST',
    url: url,
    success: function (data) {
      //var jsonOfferCreativeData = JSON.parse(creativeRequest.responseText);
      parseJsonToOfferList(data);
    },
    error: function (xhr, status, error) {
      // handle error
      //clearPreviousPreview();
      var err = eval("(" + xhr.responseText + ")");
      console.log(err);
    }
  });
}

function parseJsonToOfferList(jsonData) {
  console.log(jsonData.length);
  document.getElementById("loadingtext").hidden = true;
  var length = jsonData.length;
  var element = document.createElement("div");
  for (var i = 0; i < length; i++) {
    var p = document.createElement("p");
    var titleSpan = document.createElement("span");
    var titleText = document.createTextNode(jsonData[i]["offerName"]);
    titleSpan.appendChild(titleText);
    titleSpan.setAttribute("style", "font-size: 17px;");
    p.appendChild(titleSpan);
    p.appendChild(document.createElement("br"));

    var divSecondRow = document.createElement("div");
    divSecondRow.setAttribute("class", "row");
    var divDate = document.createElement("div");
    divDate.setAttribute("class", "column");
    var divMobileLink = document.createElement("div");
    divMobileLink.setAttribute("class", "column");
    var divDesktopLink = document.createElement("div");
    divDesktopLink.setAttribute("class", "column");

    var time = jsonData[i]["scheduledStart"];
    var date = new Date(time);

    var dateSpan = document.createElement("span");
    var dateText = document.createTextNode(date.toLocaleDateString());
    dateSpan.appendChild(dateText);
    divDate.appendChild(dateSpan);

    var mobilePreviewLinkText = "Mobile CX";
    var link = document.createElement("a");
    var linkText = document.createTextNode(mobilePreviewLinkText);
    link.appendChild(linkText);
    link.setAttribute("data-id", jsonData[i]["id"]);
    link.setAttribute("class", "offerPreviewMobileLink");
    link.setAttribute("id", "offerPreviewMobileLink" + i);
    link.setAttribute("style", "text-decoration: none;");
    //link.setAttribute("onclick", "loadOfferPreviewinPopup('" + jsonData[i]["id"] + "');return false;");
    link.setAttribute("href", "javascript:void(0)");

    link.onclick = function (event) {
      console.log(event.target);
      loadOfferPreviewinPopupFromOfferList(event.target);
    }

    divMobileLink.appendChild(link);

    var desktopPreviewLinkText = "Desktop CX";
    link = document.createElement("a");
    linkText = document.createTextNode(desktopPreviewLinkText);
    link.appendChild(linkText);
    link.setAttribute("data-id", jsonData[i]["id"]);
    link.setAttribute("class", "offerPreviewDesktopLink");
    link.setAttribute("id", "offerPreviewDesktopLink" + i);
    link.setAttribute("style", "margin-left:20px; text-decoration: none;");
    //link.setAttribute("onclick", "loadOfferPreviewinPopup('" + jsonData[i]["id"] + "');return false;");
    link.setAttribute("href", "javascript:void(0)");

    link.onclick = function (event) {
      var offerId = event.target.getAttribute("data-id");
      localStorage["offerId"] = offerId;
      openDesktopPreview();
    }
    divDesktopLink.appendChild(link);

    divSecondRow.appendChild(divDate);
    divSecondRow.appendChild(divMobileLink);
    divSecondRow.appendChild(divDesktopLink);

    p.appendChild(divSecondRow)

    element.appendChild(p);

  }
  document.getElementById("offerList").appendChild(element);

  var index = document.getElementsByClassName("offerPreviewMobileLink").length;
  console.log(index);

  /*for (var i = 0; i < index; i++) {
    console.log(document.getElementsByClassName("offerPreviewMobileLink")[i].getAttribute("data-id"));
    document.getElementsByClassName("offerPreviewMobileLink")[i].onclick = function () { loadOfferPreviewinPopupFromOfferList(document.getElementsByClassName("offerPreviewMobileLink")[i]); }
  }
  
  for (var i = 0; i < index; i++) {
    $(document).ready(function () {
      $(".offerPreviewMobileLink")[i].click (function() {
        loadOfferPreviewinPopupFromOfferList($(".offerPreviewMobileLink")[i])
      })
    })
  }
  */
}

function loadOfferPreviewinPopupFromOfferList(link) {
  console.log(link.getAttribute("data-id"));
  loadOfferPreviewinPopup(link.getAttribute("data-id"));
}

function loadOfferPreviewinPopup(currentOfferId) {
  document.getElementById("desktopLink").setAttribute("data-id", currentOfferId);
  //var jsonData = request.source;
  document.getElementById('offerList').hidden = true;
  document.getElementById("offerpreview").hidden = false;

  var creativeUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/creative/localizedOffer?offerId=" + currentOfferId + '&locale=en_US';

  $.ajax({
    type: 'POST',
    url: creativeUrl,
    success: function (data) {
      //var jsonOfferCreativeData = JSON.parse(creativeRequest.responseText);
      parseJsonToPageContent(data);
      console.log(JSON.stringify(data));
    },
    error: function (xhr, status, error) {
      // handle error
      clearPreviousPreview();
      var err = eval("(" + xhr.responseText + ")");
      console.log(err);
    }

  });
/*
  var creativeRequest = new XMLHttpRequest();
  creativeRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:

      var jsonOfferCreativeData = JSON.parse(creativeRequest.responseText);
      parseJsonToPageContent(jsonOfferCreativeData);

    }
  };
  var creativeUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/creative/localizedOffer?offerId=" + currentOfferId + '&locale=en_US';
  creativeRequest.open("POST", creativeUrl, true);
  creativeRequest.send();
  */

  localStorage["offerId"] = currentOfferId;
  console.log(localStorage["offerId"]);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      // Typical action to be performed when the document is ready:
      var jsonOfferDetail = JSON.parse(xhttp.responseText);
      parsePriceInfo(jsonOfferDetail);

    }
  };
  var xmlUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/search/offer?offerId=" + currentOfferId;
  xhttp.open("POST", xmlUrl, true);
  xhttp.send();


}

window.onload = onWindowLoad;

