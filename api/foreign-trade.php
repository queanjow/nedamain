<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

require __DIR__.'/classes/Database.php';
require __DIR__.'/classes/JwtHandler.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$method = $_SERVER['REQUEST_METHOD'];
switch ($method){
    case "GET":
        $sql = "SELECT * FROM rsep_foreign_trade";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $rsep_foreign_trade = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $rsep_foreign_trade = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        }
        echo json_encode ($rsep_foreign_trade);
    break;
    case "POST":
        $foreigntrade = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO rsep_foreign_trade(id, sub_indicators, year, period, value, unit, created_at) VALUES (null, :sub_indicators, :year, :period, :value, :unit, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':sub_indicators',$foreigntrade->sub_indicators);
        $stmt->bindParam(':year',$foreigntrade->year);
        $stmt->bindParam(':period',$foreigntrade->period);
        $stmt->bindParam(':value',$foreigntrade->value);
        $stmt->bindParam(':unit',$foreigntrade->unit);
        $stmt->bindParam(':created_at', $created_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record created successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to create record,'];
        }
        return json_encode($response);
    break;
    case "PUT":
        $foreigntrade = json_decode( file_get_contents('php://input') );
        $sql = " UPDATE rsep_foreign_trade SET sub_indicators = :sub_indicators, year = :year , value = :value , unit = :unit ,  updated_at = :updated_at WHERE id = :id ";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id',$foreigntrade->id);
        $stmt->bindParam(':sub_indicators',$foreigntrade->sub_indicators);
        $stmt->bindParam(':sector',$foreigntrade->sector);
        $stmt->bindParam(':year',$foreigntrade->year);
        $stmt->bindParam(':value',$foreigntrade->value);
        $stmt->bindParam(':unit',$foreigntrade->unit);
        $stmt->bindParam(':updated_at', $updated_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record updated successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to update record,'];
        }
        return json_encode($response);
    break;
    case "DELETE":
        $sql = "DELETE FROM rsep_foreign_trade WHERE id = :id";
        $path = explode('/', $_SERVER['REQUEST_URI']);

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $path[4]);

        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record deleted successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to delet record,'];
        }
        return json_encode($response);
    break;
}