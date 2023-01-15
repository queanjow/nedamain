<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../DbConnect.php';
include_once '../models/IndicatorTable.php';
include_once '../models/ColumnOptions.php';

$database = new DbConnect();
$db = $database->connect();

class RequestHandler
{
    private $model;
    public function __construct($db)
    {
        $this->model = new IndicatorTable($db);
    }

    private function deleteRow($data)
    {
        if (
            isset($data['tableID']) &&
            isset($data['rowID'])

        ) {
            $sanitizedTableID = htmlspecialchars(strip_tags($data['tableID']));
            $sanitizedRowID = htmlspecialchars(strip_tags($data['rowID']));

            $isDeleted =  $this->model->deleteRow($sanitizedTableID, $sanitizedRowID);

            if ($isDeleted) {
                echo json_encode(["message" => "deleted"]);
            } else {
                throw new Exception("something went wrong when deleting row.");
            }
        } else {
            throw new Exception("Malformed sent data.");
        }
    }

    private function deleteTable($data)
    {
        /*
            Expected request JSON data example:
            {
                "data": {
                    "tableID": 1,
                }
            } 
        */
        if ($data['tableID']) {
            $sanitizedTableID = htmlspecialchars(strip_tags($data['tableID']));
            $deletedTable = $this->model->deleteTable($sanitizedTableID);

            if ($deletedTable) {
                echo json_encode(["message" => "deleted"]);
            } else {
                throw new Exception("Something went wrong when deleting a table");
            }
        } else {
            throw new Exception("Malformed sent data.");
        }
    }

    private function handleRequestType()
    {
        /*
            Expected request JSON data example:
            {
                "type": "row" | "table",
                "data": {
                    "tableID": 1,
                    "rowID": 1 | null,
                }
            } 
        */

        $request_data = json_decode(file_get_contents("php://input"), true);

        if (
            isset($request_data) &&
            isset($request_data['type']) &&
            isset($request_data['data'])
        ) {
            $deleteType = $request_data['type'];

            if ($deleteType  == "table") {
                $this->deleteTable($request_data['data']);
            } else if ($deleteType == "row") {
                $this->deleteRow($request_data['data']);
            }
        } else {
            throw new Exception("Oops! Request type Error");
        }
    }

    public function startDeleteHandler()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
                $this->handleRequestType();
            }
        } catch (Exception $err) {
            http_response_code(404);
            echo json_encode(['message' => $err->getMessage()]);
            die();
        }
    }
}

$handler = new RequestHandler($db);
$handler->startDeleteHandler();
