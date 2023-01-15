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
        $sql = "SELECT * FROM rsep_grdp_capita";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $rsep_grdp_capita = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $rsep_grdp_capita = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        }
        echo json_encode ($rsep_grdp_capita);
    break;
    case "POST":
        $percapita = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO rsep_grdp_capita(id, location, sub_indicators, sector, year, period, value, unit, created_at) VALUES (null, :location, :sub_indicators, :sector, :year, :period, :value, :unit, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':location',$percapita->location);
        $stmt->bindParam(':sub_indicators',$percapita->sub_indicators);
        $stmt->bindParam(':sector',$percapita->sector);
        $stmt->bindParam(':year',$percapita->year);
        $stmt->bindParam(':period',$percapita->period);
        $stmt->bindParam(':value',$percapita->value);
        $stmt->bindParam(':unit',$percapita->unit);
        $stmt->bindParam(':created_at', $created_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record created successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to create record,'];
        }
        return json_encode($response);
    break;
    case "PUT":
        $percapita = json_decode( file_get_contents('php://input') );
        $sql = " UPDATE rsep_grdp_capita SET location = :location, sub_indicators = :sub_indicators, sector = :sector , year = :year , value = :value , unit = :unit ,  updated_at = :updated_at WHERE id = :id ";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id',$percapita->id);
        $stmt->bindParam(':location',$percapita->location);
        $stmt->bindParam(':sub_indicators',$percapita->sub_indicators);
        $stmt->bindParam(':sector',$percapita->sector);
        $stmt->bindParam(':year',$percapita->year);
        $stmt->bindParam(':value',$percapita->value);
        $stmt->bindParam(':unit',$percapita->unit);
        $stmt->bindParam(':updated_at', $updated_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record updated successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to update record,'];
        }
        return json_encode($response);
    break;
    case "DELETE":
        $sql = "DELETE FROM rsep_grdp_capita WHERE id = :id";
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