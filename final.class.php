<!--Garrett Laverty, 5/11/2023, CSE383, Final Assignment-->
<?php 
class final_rest
{

	public static function setStock ($stockTicker, $queryType, $jsonData)

	{
		if ($queryType != "detail" && $queryType != "news") {
			$retData["status"]=1;
			$retData["message"]="'$queryType' is not 'detail' or 'news'";
		}
		else {
			try {
				EXEC_SQL("insert into stock (stockTicker, queryType, jsonData, dateTime) values (?,?,?,CURRENT_TIMESTAMP)",$stockTicker, $queryType, $jsonData);
				$retData["status"]=0;
				$retData["message"]="insert of '$stockTicker' with query type: '$queryType' and json data: '$jsonData'";
			}
			catch  (Exception $e) {
				$retData["status"]=1;
				$retData["message"]=$e->getMessage();
			}
		}

		return json_encode ($retData);
	}
	public static function getStock ($date)

	{
		try {
			$retData["result"] = Get_SQL("select * from stock where dateTime like ? order by dateTime", $date . "%");
			
			
			$retData["status"]=0;
			$retData["message"]="selected all elements of stock file that match: $date";
		}
		catch  (Exception $e) {
			$retData["status"]=1;
			$retData["message"]=$e->getMessage();
		}

		return json_encode ($retData);
	}
}

