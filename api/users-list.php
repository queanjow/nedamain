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
        $sql = "SELECT * FROM users";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if(isset($path[3]) && is_numeric($path[3])) {
            $sql .= " WHERE id = :id ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);
            $stmt->execute();
            $users_list = $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $users_list = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        echo json_encode ($users_list);
    break;
    case "POST":
        $users = json_decode( file_get_contents('php://input') );
        $sql = "INSERT INTO users(id, name, type, email, password, created_at) VALUES (null, :name, :type, :email, :password, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d');
        $stmt->bindParam(':name',$users->name);
        $stmt->bindParam(':type',$users->type);
        $stmt->bindParam(':email',$users->email);
        $stmt->bindParam(':password',$users->password);
        $stmt->bindParam(':created_at', $created_at);
        if($stmt->execute()) {
            $response = ['status' =>1, 'message' => 'Record created successfully,'];
        }else{
            $response = ['status' =>0, 'message' => 'Failed to create record,'];
        }
        return json_encode($response);
    break;
}