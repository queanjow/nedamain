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
        $sql = "SELECT * FROM rsep_land_area";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $rsep_land_area = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $rsep_land_area = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        }
        echo json_encode ($rsep_land_area);
    break;
    case "POST":
        $landarea = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO rsep_land_area(id, location, year, period, land_area_km, population, municipalities, cities, city_type, barangays, created_at) VALUES (null, :location, :year, :period, :land_area_km, :population, :municipalities, :cities, :city_type, :barangays, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':location',$landarea->location);
        $stmt->bindParam(':year',$landarea->year);
        $stmt->bindParam(':period',$landarea->period);
        $stmt->bindParam(':land_area_km',$landarea->land_area_km);
        $stmt->bindParam(':population',$landarea->population);
        $stmt->bindParam(':municipalities',$landarea->municipalities);
        $stmt->bindParam(':cities',$landarea->cities);
        $stmt->bindParam(':city_type',$landarea->city_type);
        $stmt->bindParam(':barangays',$landarea->barangays);
        $stmt->bindParam(':created_at', $created_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record created successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to create record,'];
        }
        return json_encode($response);
    break;
    case "PUT":
        $landarea = json_decode( file_get_contents('php://input') );
        $sql = " UPDATE rsep_land_area SET location = :location, year = :year , land_area_km = :land_area_km , population = :population , municipalities = :municipalities ,  cities = :cities , city_type = :city_type , barangays =  :barangays , updated_at = :updated_at WHERE id = :id ";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id',$landarea->id);
        $stmt->bindParam(':location',$landarea->location);
        $stmt->bindParam(':year',$landarea->year);
        $stmt->bindParam(':land_area_km',$landarea->land_area_km);
        $stmt->bindParam(':population',$landarea->population);
        $stmt->bindParam(':municipalities',$landarea->municipalities);
        $stmt->bindParam(':cities',$landarea->cities);
        $stmt->bindParam(':city_type',$landarea->city_type);
        $stmt->bindParam(':barangays',$landarea->barangays);
        $stmt->bindParam(':updated_at', $updated_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record updated successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to update record,'];
        }
        return json_encode($response);
    break;
    case "DELETE":
        $sql = "DELETE FROM rsep_land_area WHERE id = :id";
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