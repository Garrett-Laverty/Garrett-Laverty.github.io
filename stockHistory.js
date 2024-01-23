// Garrett Laverty, CSE383, Section B, Final Assignment

// An array of data from the database, this is used to display information in displayRowData()
var everything = new Array();

// Handles the disabling/enabling of buttons
function toggleButton() {
	$("#historyButton").removeAttr("disabled");
	$("#stocksDate").removeAttr("onchange");
}

// performs a call to grab data from the database and constructs a table accordingly
function getData() {
	var stocksDate = $("#stocksDate").val();
	var maxLines = $("#stockLines").val();

	a=$.ajax({
		url: "final.php?method=getStock&date=" + stocksDate,
		method: "GET"
	}).done(function(data) {
		$("#lookUps").html("");
		$("#noResults").html("");
        console.log(data.message);
        var len;
        if (maxLines == 0 || maxLines >= data.result.length) {
            len = data.result.length;
        } else {
            len = maxLines;
        }
        if(len === 0) {
            $("#noResults").html("<h2>No requests made on that day</h2>");
        }

		for (i=0;i<len;i++) {
			everything[i] = JSON.parse(data.result[i].jsonData);
			$("#lookUps").append("<tr id='row"+ (2*i) +"'><td>" + data.result[i].dateTime +"</td><td>" + data.result[i].queryType
                                + "</td><td>" + data.result[i].stockTicker + "</td><td> <button type='button' id='historyButton" + i
                                + "' onclick='displayRowData(" + (2*i+1) + ", " + (data.result[i].queryType === "detail")
                                + ")'>Toggle Display</button> </td></tr>");
			
            if(data.result[i].queryType === "detail"){
				var n = (2*i+1);
				$("#lookUps").append("<tr id='row"+ n +"' hidden><td colspan='4'><div id='stockDetails'>"    +      
								"<div class='container'>" +
								"<div class='row justify-content-center'>" +
								"<div class='col-md-3 box'>" +
								"</div>" +
								"<div class='col-md-6 box'>" +
								"<h1 id='stockName"+ n +"'></h1>" +
								"<h3 id='stockPrimary"+ n +"'></h3>" +
								"</div>" +
								"<div class='col-md-3 box'>" +
								"<div id='stockIcon"+ n +"'></div>" +
								"</div></div>" +
								"<div class='row justify-content-center'>" +
								"<div class='col-md-6 box'>" +
								"<div id='stockDescription"+ n +"'></div>" +
								"</div>" +
								"<div class='col-md-6 box'>" +
								"<div id='stockAddress"+ n +"'></div>" +
								"<div id='phoneNumber"+ n +"'></div>" +
								"<div id='stockHomePage"+ n +"'></div>" +
							    "</div>" +
							    "</div>" +
							    "<div class='row justify-content-center'>" +
								"<div class='col-md-3 box'>" +
							    "<div id='stockListDate"+ n +"'></div>" +
								"</div>" +
								"<div class='col-md-3 box'>" +
							    "<div id='stockOutstandingShares"+ n +"'></div>" +
								"</div>" +
								"<div class='col-md-3 box'>" +
							    "<div id='employeeCount"+ n +"'></div>" +
								"</div>" +
								"<div class='col-md-3 box'>" +
								"<div id='stockMarketCap"+ n +"'></div>" +
								"</div>" +
							    "</div>" +
							    "<div id='chartContainer" + n + "'>" +
								"<canvas id='myChart"+ n +"'></canvas>" +
							    "</div>" +
							    "</div>" +
								"</div></td></tr>");

			} else if (data.result[i].queryType === "news") {
				var news = "stockNews" + (2*i+1);
				$("#lookUps").append("<tr id='row"+(2*i+1)+"' hidden><td colspan='4'><div class='stockNews' id='"+ news +"'><div>");
				news = "#" + news;
				$(news).html("<h1>LATEST NEWS FOR: " + data.result[i].stockTicker + "</h1>");
			}
		}
	}).fail(function(error) {
		alert("ERROR: " + error.statusText);
	});
}

// When a row's "toggle display" button is pressed the first time, the information will be taken from the "everything" array
// it will then set that spot in the array to false. This way, when information is to be displayed a second time, it will not
// need to access data from the "everything" array again.
function displayRowData(rowNumber, detail) {
	var isHidden = $("#row" + rowNumber).attr("hidden");
    var n = rowNumber;  // This n variables exists just to make reading id's easier
    rowInfo = everything[(n-1) / 2];

	if (typeof isHidden !== "undefined" && isHidden !== false) {
		$("#row" + rowNumber).removeAttr("hidden");
	} else {
		$("#row" + rowNumber).attr("hidden", "true");
	}

    if(rowInfo !== false) {
        if(detail === true) {
            $("#stockName" + n).html(rowInfo.name);
            $("#stockPrimary" + n).html(rowInfo.ticker + " (" + rowInfo.locale.toUpperCase() + ": " + rowInfo.primary_exchange + ")");
            if(rowInfo.description === undefined){
                $("#stockDescription" + n).html("<h5>Description:</h5><p>No description found.</p>");
            } else {
                $("#stockDescription" + n).html("<h5>Description:</h5><p>" + rowInfo.description + "</p>");
            }
            if(rowInfo.address === undefined){
                $("#stockAddress" + n).html("<h5>Address:</h5><p>No address found.</p>");
            } else {
                $("#stockAddress" + n).html("<h5>Address:</h5>");
                $("#stockAddress" + n).append("<p>"+rowInfo.address+"</p><p>"+rowInfo.city + ", " + rowInfo.state+", "+rowInfo.postal_code+"</p>");
            }
            if(rowInfo.icon_url === undefined){
                $("#stockIcon" + n).html("");
            } else {
                $("#stockIcon" + n).html("<img src='" + rowInfo.icon_url + "?apiKey=jqTDdpydvXoltASoD9wgtlOUpK9xRHKe" + "' width='100' height='100' alt='Icon for " + rowInfo.name + "'>");
            }
            if(rowInfo.homepage_url === undefined){
                $("#stockHomePage" + n).html("<h5>Home Page:</h5><p>No home page found.</p>");
            } else {
                $("#stockHomePage" + n).html("<h5>Home Page:</h5>");
                $("#stockHomePage" + n).append("<a href='" + rowInfo.homepage_url + "' target='_blank'>" + rowInfo.homepage_url + "</a>");
            }
            if(rowInfo.list_date === undefined) {
                $("#stockListDate" + n).html("<h5>Stock List Date:</h5><p>No List Date found.</p>");
            } else {
                $("#stockListDate" + n).html("<h5>Stock List Date:</h5><p>" + rowInfo.list_date + "</p>");
            }
            if(rowInfo.market_cap === undefined) {
                $("#stockMarketCap" + n).html("<h5>Market Cap:</h5><p>No market cap found.");
            } else {
                $("#stockMarketCap" + n).html("<h5>Market Cap:</h5><p>" + rowInfo.market_cap + "</p>");
            }
            if(rowInfo.phone_number === undefined) {
                $("#phoneNumber" + n).html("<h5>Phone Number:</h5><p>No phone number found.</p>");
            } else {
                $("#phoneNumber" + n).html("<h5>Phone Number:</h5><p>" + rowInfo.phone_number + "</p>");
            }
            if(rowInfo.share_class_shares_outstanding === undefined) {
                $("#stockOutstandingShares" + n).html("<h5>Oustanding Shares:</h5><p>No outstanding shares found.</p>");
            } else {
                $("#stockOutstandingShares" + n).html("<h5>Outstanding Shares:</h5><p>" + rowInfo.share_class_shares_outstanding + "</p>");
            }
            if(rowInfo.total_employees === undefined) {
                $("#employeeCount" + n).html("<h5>Employee Count:</h5><p>No employee count found.</p>");
            } else {
                $("#employeeCount" + n).html("<h5>Employee Count:</h5><p>" + rowInfo.total_employees + "</p>");
            }

            var chart = document.getElementById('myChart' + n);
            fillChart(rowInfo.closings, rowInfo.dates, rowInfo.sigFigs, chart);
        } else {
            if(rowInfo.results.length !== 0){
                for (var i = 0; i < rowInfo.results.length; i++) {
                    var oldDate = rowInfo.results[i].published_utc;
                    var newDate = new Date(oldDate).toString();
                    var date = newDate.substring(3, 10) + ',' + newDate.substring(10, 15);
                    $("#stockNews" + n).append("<a href='"+ rowInfo.results[i].url +"' target='_blank'>" + rowInfo.results[i].title + "</a> " + "<span id='publisher'>" + date + " - " + rowInfo.results[i].publisher.name + "</span>" + "<br>");
                }
            } else {
                $("#stockNews" + n).append("<p>No recent news for this stock</p>");
            }
        }
        everything[(n-1) / 2] = false;
    }

}
