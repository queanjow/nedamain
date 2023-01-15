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
        $sql = "SELECT * FROM rsep_internal_revenue";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $rsep_internal_revenue = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $rsep_internal_revenue = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        }
        echo json_encode ($rsep_internal_revenue);
    break;
    case "POST":
        $internalrev = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO rsep_internal_revenue(id, location, year, period, business_tax, income_tax, others, created_at) VALUES (null, :location, :year, :period, :business_tax, :income_tax, :others, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':location',$internalrev->location);
        $stmt->bindParam(':year',$internalrev->year);
        $stmt->bindParam(':period',$internalrev->period);
        $stmt->bindParam(':business_tax',$internalrev->business_tax);
        $stmt->bindParam(':income_tax',$internalrev->income_tax);
        $stmt->bindParam(':others',$internalrev->others);
        $stmt->bindParam(':created_at', $created_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record created successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to create record,'];
        }
        return json_encode($response);
    break;
    case "PUT":
        $internalrev = json_decode( file_get_contents('php://input') );
        $sql = " UPDATE rsep_internal_revenue SET location = :location, year = :year , business_tax = :business_tax , income_tax = :income_tax , others = :others ,  updated_at = :updated_at WHERE id = :id ";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id',$povertystat->id);
        $stmt->bindParam(':location',$internalrev->location);
        $stmt->bindParam(':year',$internalrev->year);
        $stmt->bindParam(':business_tax',$internalrev->business_tax);
        $stmt->bindParam(':income_tax',$internalrev->income_tax);
        $stmt->bindParam(':others',$internalrev->others);
        $stmt->bindParam(':updated_at', $updated_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record updated successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to update record,'];
        }
        return json_encode($response);
    break;
    case "DELETE":
        $sql = "DELETE FROM rsep_internal_revenue WHERE id = :id";
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