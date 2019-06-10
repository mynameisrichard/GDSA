// from here: https://www.w3schools.com/xml/tryit.asp?filename=try_xpath_select_cdnodes

//function to get lu station letters
function grab_GZZ(characters,startAtCharacter,endAtCharacter){

	var startLetter = characters.indexOf(startAtCharacter,0) + startAtCharacter.length; //don't return first letter
    var stopLetter = characters.indexOf(endAtCharacter,0);

    return characters.substring(startLetter,stopLetter);
	
}

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
		// run function to loop through table
		addStationNames ();
    }
};


// function to get xpath result, iterate over it, decide if its a coordinate and append tr or td tag

// !!!doesnt work with IE!!!

function showResult(xml) {
    
var txt = ""; //string for result

var lu_ID = "940gzzlu"; //search string for within g id

//this path selects the d element of all blue-fill paths within all lu interchange-circles and also returns the parent element, which should contain the station id
var path = "/svg/g[@id='interchange-circles']/g[contains(@id,'"+lu_ID +"')]/g/path[@class='blue-fill']/@d | /svg/g[@id='interchange-circles']/g[contains(@id,'"+lu_ID +"')]/g/path[@class='blue-fill']/../../@id";
//select rectangle id (i.e. station name) | select rectangle x | select rectangle y
var path2 = "/svg/g/rect[contains(@id,'"+lu_ID+"')]/@id | /svg/g/rect[contains(@id,'"+lu_ID+"')]/@x | /svg/g/rect[contains(@id,'"+lu_ID+"')]/@y";
 //select polyline id (i.e. station name) | select polyline points
var path3 = "/svg/g/polyline[contains(@id,'"+lu_ID+"')]/@id | /svg/g/polyline[contains(@id,'"+lu_ID+"')]/@points";

	//loop 1 with first path - non interchange step-free stations  
    if (xml.evaluate) {

        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null); //select first path and pass result to nodes
        var result = nodes.iterateNext();

        while (result) {
            //check if first letter is M so know its the coordinate
            var crrPath = result.nodeValue;
            if(crrPath.substring(0,1)=="M"){
                txt += "<td>" + grab_GZZ(crrPath,'M',',') + "</td>" + "<td>" + grab_GZZ(crrPath,',','c') + "</td>";
            } else {
                txt += "<tr><td>" + result.nodeValue + "</td>";
            }
            result = nodes.iterateNext();
        } 

    }
	
	//loop2 with path2 - non interchange rectangle elements
    if (xml.evaluate) {

        var nodes2 = xml.evaluate(path2, xml, null, XPathResult.ANY_TYPE, null); //select first path and pass result to nodes
        var result2 = nodes2.iterateNext();

        while (result2) {
            //check if it's a coordinate (i.e. a number) with a regex
            if(/^\d+(?:\.\d+)?$/.test(result2.nodeValue)){
                txt += "<td>" + result2.nodeValue + "</td>";
            } else {
                txt += "<tr><td>" + result2.nodeValue + "</td>";
            }
            result2 = nodes2.iterateNext();
        } 

    }

	//loop3 with path3 - non interchange polyline elements
    if (xml.evaluate) {

        var nodes3 = xml.evaluate(path3, xml, null, XPathResult.ANY_TYPE, null); //select first path and pass result to nodes
        var result3 = nodes3.iterateNext();

        while (result3) {
            //check if it's a station id by searching for lul at start of string - bit of hack but there's only a few of these
			var crrPath2 = result3.nodeValue
            if(crrPath2.substring(0,3)=="lul"){
                txt += "<tr><td>" + result3.nodeValue + "</td>";
            } else {
                txt += "<td>" + crrPath2.substring(0,crrPath2.indexOf(',',0)) + "</td>" + "<td>" + crrPath2.substring(crrPath2.indexOf(',',0)+1,crrPath2.indexOf(' ',0)) + "</td>";
            }
            result3 = nodes3.iterateNext();
        } 

    }
	
	//add contents of txt variable to table body tag in html file
    document.getElementById("stationlist").innerHTML = txt; 
	//alert(txt);
	
}

function addStationNames () {
	
		var myTable = document.getElementById("stationlist");
		var stationListRows = myTable.getElementsByTagName('tr');
		
		for (var i=0; i < stationListRows.length;i++){
			
			var cell = stationListRows[i].getElementsByTagName('td');
			var stationName = cell[0].innerHTML; //get station id from element Name column
			var newCol = stationListRows[i].insertCell(-1);
            newCol.innerHTML=grab_GZZ(stationName,'940gzz','_');
		}
			
}