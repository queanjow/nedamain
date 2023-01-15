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
        $sql = "SELECT * FROM rsep_socioeconomic_indicators";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $rsep_socioeconomic_indicators = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $rsep_socioeconomic_indicators = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        }
        echo json_encode ($rsep_socioeconomic_indicators);
    break;
    case "POST":
        $socioeconomic = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO rsep_socioeconomic_indicators(id, location, sub_indicators, sector, year, value, unit, created_at) VALUES (null, :location, :sub_indicators, :sector, :year, :value, :unit, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':location',$socioeconomic->location);
        $stmt->bindParam(':sub_indicators',$socioeconomic->sub_indicators);
        $stmt->bindParam(':sector',$socioeconomic->sector);
        $stmt->bindParam(':year',$socioeconomic->year);
        $stmt->bindParam(':value',$socioeconomic->value);
        $stmt->bindParam(':unit',$socioeconomic->unit);
        $stmt->bindParam(':created_at', $created_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record created successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to create record,'];
        }
        return json_encode($response);
    break;
    case "PUT":
        $socioeconomic = json_decode( file_get_contents('php://input') );
        $sql = " UPDATE rsep_socioeconomic_indicators SET location = :location, sub_indicators = :sub_indicators, sector = :sector , year = :year , value = :value , unit = :unit ,  updated_at = :updated_at WHERE id = :id ";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id',$socioeconomic->id);
        $stmt->bindParam(':location',$socioeconomic->location);
        $stmt->bindParam(':sub_indicators',$socioeconomic->sub_indicators);
        $stmt->bindParam(':sector',$socioeconomic->sector);
        $stmt->bindParam(':year',$socioeconomic->year);
        $stmt->bindParam(':value',$socioeconomic->value);
        $stmt->bindParam(':unit',$socioeconomic->unit);
        $stmt->bindParam(':updated_at', $updated_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record updated successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to update record,'];
        }
        return json_encode($response);
    break;
    case "DELETE":
        $sql = "DELETE FROM rsep_socioeconomic_indicators WHERE id = :id";
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