//var BASE_URL = "http://localhost:8080/CoMS-1.12.1.0";
var BASE_URL = "http://10.0.0.95:9095/CoMSTesting";
//var BASE_URL = "http://10.0.0.95:9094/CoMS";
var AD_URL = "http://localhost:8080/CoMS-1.12.1.0/AD/login";

////For getting api url for hargrey
var devMode = false;    //true:fire to BASE_URL,false:for dynamic url

//For getting api url for hargrey
/* if (devMode != true) {
	var url = window.location.href;
	var splitArr = url.split(":");
	if (splitArr.length == 3) {
		reapiurl = url.substr(0, url.indexOf("/", url.indexOf(splitArr[2])));
	}
	BASE_URL = reapiurl + "/CoMS";
	AD_URL = BASE_URL + "/AD/login";
} */

