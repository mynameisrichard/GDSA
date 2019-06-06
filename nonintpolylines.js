// from here: https://www.w3schools.com/xml/tryit.asp?filename=try_xpath_select_cdnodes

// new xmlhttprequest object
var xhttp = new XMLHttpRequest();
// initialise request with method=GET and file with our xml
xhttp.open("GET", "TubeMapSVGOnly2.html", true);
// run request
xhttp.send(); 

//run function on state change, e.g. page refresh/load
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //when readystate back to rest, call showResult function, pass response to request to it (i.e. the page we want to scrape)
		showResult(xhttp.responseXML);
    }
};


// function to get xpath result, interate over it and write to table tag with demo id
// doesnt work with IE!!
function showResult(xml) {
    
    var txt = ""; //string for result
   path = '/svg/g/polyline/@id | /svg/g/rect/@x | /svg/g/rect/@y'; //select rectangle id (i.e. station name) | select rectangle x | select rectangle y
  // path = '/svg/g[@contains(@id,'lul')]'
    if (xml.evaluate) {

        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null); //select first path and pass result to nodes
        var result = nodes.iterateNext();

        while (result) {
            //check if it's a coordinate (i.e. a number) with a regex
            if(/^\d+(?:\.\d+)?$/.test(result.nodeValue)){
                txt += "<td>" + result.nodeValue + "</td>";
            } else {
                txt += "<tr><td>" + result.nodeValue + "</td>";
            }
            result = nodes.iterateNext();
        } 

    }

    document.getElementById("stationlist").innerHTML = txt;

//alert(txt);
}