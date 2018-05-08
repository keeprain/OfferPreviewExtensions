window.onload = onWindowLoad;
function onWindowLoad() {
console.log(localStorage['offerId']);
    var creativeUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/creative/localizedOffer?offerId=" + localStorage['offerId'] + '&locale=en_US';
    $.ajax({
        type: 'POST',
        url: creativeUrl,
        success: function (data) {
          parseJsonToPageContent(data);
        },
        error: function (xhr, status, error) {
          // handle error
          var err = eval("(" + xhr.responseText + ")");
          console.log(err);
        }
      });

    var xmlUrl = "https://tesoro-offer-management-iad.iad.proxy.amazon.com/services/search/offer?offerId=" + localStorage['offerId'];
    $.ajax({
        type: 'POST',
        url: xmlUrl,
        success: function (data) {
            parsePriceInfo(data);
        },
        error: function (xhr, status, error) {
          // handle error
          var err = eval("(" + xhr.responseText + ")");
          console.log(err);
        }
      });
}

function parseJsonToPageContent(jsonOfferCreativeData) {
    console.log(jsonOfferCreativeData);
    if (jsonOfferCreativeData['detailPageImagery']) {
      document.getElementById('hero-image').setAttribute("style", "background-image: url(" + jsonOfferCreativeData['detailPageImagery']['heroImage']['src'] + ");");
      document.getElementById('altimage1').setAttribute("style", "background-image: url(" + jsonOfferCreativeData['detailPageImagery']['additionalImages'][0]['src'] + ");");
      if (jsonOfferCreativeData['detailPageImagery']['additionalImages'].length > 1) {
        document.getElementById('altimage2').setAttribute("style", "background-image: url(" + jsonOfferCreativeData['detailPageImagery']['additionalImages'][1]['src'] + ");");
      }
      console.log(jsonOfferCreativeData['detailPageImagery']['heroImage']['src']);
        /*
      document.getElementById('altimage1').src = jsonOfferCreativeData['detailPageImagery']['additionalImages'][0]['src'];
      if (jsonOfferCreativeData['detailPageImagery']['additionalImages'].length > 1) {
        var ele = document.getElementById("altimge2Div");
        ele.hidden = false;
        var img = document.getElementById("altimage2")
        img.src = jsonOfferCreativeData['detailPageImagery']['additionalImages'][1]['src'];
      }
    }
    */
    if (jsonOfferCreativeData['detailPageCopy']) {
      document.getElementById('offer-headline-text').innerText = jsonOfferCreativeData['detailPageCopy']['offerTitle'];
      console.log(jsonOfferCreativeData['detailPageCopy']['offerTitle']);
      console.log(document.getElementById("offer-headline-text"));
      document.getElementById('offer-summary-text').innerText = jsonOfferCreativeData['detailPageCopy']['offerSubTitle'];
  
      var element = document.getElementById("whatyouget-text");
      element.appendChild(StringToHTMLElement(jsonOfferCreativeData['detailPageCopy']['whatsIncluded']));
  
      element = document.getElementById("whywepickedit-text");
      element.appendChild(StringToHTMLElement(jsonOfferCreativeData['detailPageCopy']['whyWePickedIt']));
     
  
      element = document.getElementById("wewantyoutoknow-text");
      element.appendChild(StringToHTMLElement(jsonOfferCreativeData['detailPageCopy']['weWantYouToKnow']));
  
      
      document.getElementById('howtogetithome-title').innerText = jsonOfferCreativeData['detailPageCopy']['howToGetItHome']['accessibilityText'];
      document.getElementById('howtogetithome-image').src = jsonOfferCreativeData['detailPageCopy']['howToGetItHome']['src'];
      document.getElementById('sizeandweight-summary').innerText = jsonOfferCreativeData['detailPageCopy']['sizeAndWeight']['summaryText'];
      document.getElementById('size-and-weight-specifications').innerText = jsonOfferCreativeData['detailPageCopy']['sizeAndWeight']['specificationText'];
  
  
    }
  }
}

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

function parsePriceInfo(jsonOfferDetail) {

    if (jsonOfferDetail['offerType'] == "BUYABLE") {
        var price = jsonOfferDetail['offerPrice']['amount'];
        $(".a-price-whole")[0].innerText = Math.floor(price);
        $(".a-price-fraction")[0].innerText = (price - Math.floor(price)).toFixed(2) * 100;
        if($(".a-price-fraction")[0].innerText == "0") {
          $(".a-price-fraction")[0].innerText = "00";
        }
        /*
        document.getElementById('sample-badge-div').hidden = true;
        document.getElementById("price").innerText = "$" + jsonOfferDetail['offerPrice']['amount'];
        if (jsonOfferDetail['productType'] == "NON_PERISHABLE") {
            document.getElementById("discount").hidden = false;
        } else {
            document.getElementById("discount").hidden = true;
        }
        */

    } else {
        /*
        document.getElementById("price").hidden = true;
        document.getElementById("discount").hidden = true;
        document.getElementById('sample-badge-div').hidden = false;
        */
    }
}
