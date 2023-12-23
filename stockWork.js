// Garrett Laverty, CSE383, Section B, Final Assignment

var apiKey = "jqTDdpydvXoltASoD9wgtlOUpK9xRHKe";

// Variables used in sending data to the database
var jsonObjData = {};
var jsonObj;

// Handles the enabling of buttons and displaying stock details/news divs
function toggleButtons() {
	$("#detailsButton").removeAttr("disabled");
	$("#newsButton").removeAttr("disabled");
	$("#stocks").removeAttr("onchange");
	$("#stocks").attr("onchange", "erase()");
	$("#stockDetails").removeAttr("hidden");
	$(".stockNews").removeAttr("hidden");
	erase();
}

function erase() {
	$("#stockDetails").hide();
	$(".stockNews").hide();
}

// Utilizes a call to polygon to retrieve the first 900 stocks of an exchange
function getStocks(selectObj) {
	var exchange = selectObj.value;

	a=$.ajax({
		url: "https://api.polygon.io/v3/reference/tickers?exchange=" + exchange + "&active=true&limit=900&apiKey=" + apiKey,
		method: "GET"
	}).done(function(data) {
		// Reset the drop-down
		$("#stocks").html("<option value='' selected='selected' disabled>Select one</option>");
		len = data.results.length;
		// Loop through stocks and add each ticker to the drop-down
		for (i=0;i<len;i++) {
			$("#stocks").append("<option value='" + data.results[i].ticker + "'>" + data.results[i].ticker + "</option>");
		}
	}).fail(function(error) {
		alert("ERROR: " + error.responseJSON.error);
	});
}

// Utilizes a call to polygon to retrieve the details of a selected stock
// It also constructs a custom JSON object to be sent to the database
function getDetails() {
	var stock = $("#stocks").val();

	a=$.ajax({
		url: "https://api.polygon.io/v3/reference/tickers/" + stock + "?apiKey=" + apiKey,
		method: "GET"
	}).done(function(data) {
		jsonObjData = {};

		$("#stockName").html(data.results.name);
		$("#stockPrimary").html(data.results.ticker + " (" + data.results.locale.toUpperCase() + ": " + data.results.primary_exchange + ")");
		if(data.results.description === undefined){
			$("#stockDescription").html("<h5>Description:</h5><p>No description found.</p>");
		} else {
			$("#stockDescription").html("<h5>Description:</h5><p>" + data.results.description + "</p>");
			jsonObjData["description"] = data.results.description;
		}
		if(data.results.address === undefined){
			$("#stockAddress").html("<h5>Address:</h5><p>No address found.</p>");
		} else {
			$("#stockAddress").html("<h5>Address:</h5>");
			$("#stockAddress").append("<p>"+data.results.address.address1+"</p><p>"+data.results.address.city + ", " + data.results.address.state+", "+data.results.address.postal_code+"</p>");
			jsonObjData["address"] = data.results.address.address1;
			jsonObjData["city"] = data.results.address.city;
			jsonObjData["state"] = data.results.address.state;
			jsonObjData["postal_code"] = data.results.address.postal_code;
		}
		if(data.results.branding === undefined){
			$("#stockIcon").html("");
		} else {
			if(data.results.branding.icon_url === undefined){
				$("#stockIcon").html("");
			} else {
				$("#stockIcon").html("<img src='" + data.results.branding.icon_url + "?apiKey=jqTDdpydvXoltASoD9wgtlOUpK9xRHKe" + "' width='100' height='100' alt='Icon for " + data.results.name + "'>");
				jsonObjData["icon_url"] = data.results.branding.icon_url;
			}
		}
		if(data.results.homepage_url === undefined){
			$("#stockHomePage").html("<h5>Home Page:</h5><p>No home page found.</p>");
		} else {
			$("#stockHomePage").html("<h5>Home Page:</h5>");
			$("#stockHomePage").append("<a href='" + data.results.homepage_url + "' target='_blank'>" + data.results.homepage_url + "</a>");
			jsonObjData["homepage_url"] = data.results.homepage_url;
		}
		if(data.results.list_date === undefined) {
			$("#stockListDate").html("<h5>Stock List Date:</h5><p>No List Date found.</p>");
		} else {
			$("#stockListDate").html("<h5>Stock List Date:</h5><p>" + data.results.list_date + "</p>");
			jsonObjData["list_date"] = data.results.list_date;
		}
		if(data.results.market_cap === undefined) {
			$("#stockMarketCap").html("<h5>Market Cap:</h5><p>No market cap found.");
		} else {
			$("#stockMarketCap").html("<h5>Market Cap:</h5><p>" + data.results.market_cap + "</p>");
			jsonObjData["market_cap"] = data.results.market_cap;
		}
		if(data.results.phone_number === undefined) {
			$("#phoneNumber").html("<h5>Phone Number:</h5><p>No phone number found.</p>");
		} else {
			$("#phoneNumber").html("<h5>Phone Number:</h5><p>" + data.results.phone_number + "</p>");
			jsonObjData["phone_number"] = data.results.phone_number;
		}
		if(data.results.share_class_shares_outstanding === undefined) {
			$("#stockOutstandingShares").html("<h5>Oustanding Shares:</h5><p>No outstanding shares found.</p>");
		} else {
			$("#stockOutstandingShares").html("<h5>Outstanding Shares:</h5><p>" + data.results.share_class_shares_outstanding + "</p>");
			jsonObjData["share_class_shares_outstanding"] = data.results.share_class_shares_outstanding;
		}
		if(data.results.total_employees === undefined) {
			$("#employeeCount").html("<h5>Employee Count:</h5><p>No employee count found.</p>");
		} else {
			$("#employeeCount").html("<h5>Employee Count:</h5><p>" + data.results.total_employees + "</p>");
			jsonObjData["total_employees"] = data.results.total_employees;
		}
		jsonObjData["name"] = data.results.name;
		jsonObjData["ticker"] = data.results.ticker;
		jsonObjData["locale"] = data.results.locale;
		jsonObjData["primary_exchange"] = data.results.primary_exchange;

		getNumbers(stock);
	
	}).fail(function(error) {
		alert("ERROR: " + error.responseJSON.error);
	});
}

// Utilizes a call to polygon to get closing prices of a stock
// It adds needed information to the JSON object
function getNumbers(stock) {
	var toDate = new Date();
	toDate.setDate(toDate.getDate() - 1);
	var fromDate = new Date();
	fromDate.setDate(toDate.getDate() - 8);
	a=$.ajax({
		url: "https://api.polygon.io/v2/aggs/ticker/" + stock + "/range/1/day/"+ fromDate.toISOString().substring(0, 10) + "/" + toDate.toISOString().substring(0, 10) + "?adjusted=true&sort=asc&limit=120&apiKey=" + apiKey,
		method: "GET"
	}).done(function(data) {
		$("#stockDetails").show();
		$("#stockClosings").html("");
		var len = 0;
		if(data.resultsCount > 0){
			len = data.results.length;
		}

		var closings = [];
		var dates = [];
		var largestValue = 0;
		var sigFigs;

		for (i=0;i<len;i++) {
			closings[i] = data.results[i].c;
			if (closings[i] > largestValue) {
				largestValue = closings[i];
			}
			var dateTime = new Date(data.results[i].t);
			var mon = dateTime.toLocaleString('default', { month: 'long' });
			var day = dateTime.toLocaleString('default', { day: '2-digit' });
			var dateString = mon.substring(0, 3) + " " + day;
			dates[i] = dateString;
		}
		jsonObjData["closings"] = closings;
		jsonObjData["dates"] = dates;

		if (largestValue < 1) {
			sigFigs = 1;
		} else if (largestValue >= 1000) {
			sigFigs = 5;
		} else if (largestValue >= 100) {
			sigFigs = 4;
		} else if (largestValue >= 10) {
			sigFigs = 3;
		} else if (largestValue >= 1) {
			sigFigs = 2;
		}
		
		jsonObjData["sigFigs"] = sigFigs;
		$("#myChart").remove();
		$("#chartContainer").append("<canvas id='myChart'></canvas>");
	
	
		var chart = document.getElementById('myChart');
		fillChart(closings, dates, sigFigs, chart);
		sendData(stock, "detail");


	}).fail(function(error) {
		alert("ERROR: " + error.responseJSON.error);
	});
}

// Constructs the chart of closing prices utilizing chart.js
function fillChart(closings, dates, sigFigs, chart) {
	
	// Used to change color of chart line
	const down = (chart, value) => chart.p0.parsed.y > chart.p1.parsed.y ? value : 'rgb(75, 192, 192)';

	 new Chart(chart, {
		type: 'line',
		data: {
		labels: dates,
		datasets: [{
			label: 'Closing Price',
			data: closings,
			borderWidth: 4,
			borderColor: 'rgb(192,75,75)',
			backgroundColor: 'rgb(75, 192, 192)',
			pointBackgroundColor: 'rgb(75, 192, 192)',
			pointBorderColor: 'rgb(90, 192, 192)',
			pointBorderWidth: 4,
			segment: {
				borderColor: chart => down(chart, 'rgb(192,75,75)')
			},
			spanGaps: true
		}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				tooltip: {
					callbacks: {
						// Include a dollar sign in the labels
						label: function(context) {
							var label = ' ' + context.dataset.label + ': ' + '$' + context.parsed.y;
							return label;
						}
					}
				}
			},
			scales: {
				y: {
					ticks: {
						// Include a dollar sign in the ticks
						callback: function(value) {
							var val = value.toPrecision(sigFigs + 1);
							return '$' + val;
						},
						color: 'rgb(150, 150, 150)'
					},
					grid: {
						color:'rgb(90, 90, 90)'
					}
				},
				x: {
					ticks: {
						color: 'rgb(150, 150, 150)'
					},
					grid: {
						color:'rgb(90, 90, 90)'
					}
				}
			}
		}
	});
}

// Send the data to the database
function sendData(stock, type) {

	jsonObj = JSON.stringify(jsonObjData);

	a=$.ajax({
		url: "final.php",
		method: "POST",
		data: {method:"setStock", stockTicker:stock, queryType:type, jsonData:jsonObj}
	}).done(function(data) {
		console.log("Correctly Inserted");
	}).fail(function(error) {
		alert("ERROR: " + error.responseJSON.error);
	});
}

// Utilizes a call to polygon to retrieve the newest 15 articles about a stock
function getStockNews() {
	var stock = $("#stocks").val();

	a=$.ajax({
		url: "https://api.polygon.io/v2/reference/news?ticker=" + stock + "&limit=15&apiKey=" + apiKey,
		method: "GET"
	}).done(function(data) {
		jsonObjData = data;
		len = data.results.length;
		$(".stockNews").html("<h1>LATEST NEWS FOR: " + stock + "</h1>");
		$(".stockNews").show();

		if(len > 0){
			var articles = new Array();
			for (i=0;i<len;i++) {
				var oldDate = data.results[i].published_utc;
				var newDate = new Date(oldDate).toString();
				var date = newDate.substring(3, 10) + ',' + newDate.substring(10, 15);
				$(".stockNews").append("<a href='"+ data.results[i].article_url +"' target='_blank'>" + data.results[i].title + "</a> "
										+ "<span id='publisher'>" + date + " - " + data.results[i].publisher.name + "</span>" + "<br>");
			}
		} else {
			$(".stockNews").append("<p>No recent news for this stock</p>");
		}

		sendData(stock, "news");

	}).fail(function(error) {
		alert("ERROR: " + error.responseJSON.error);
	});
}

