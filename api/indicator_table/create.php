<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../classes/Database.php';
include_once '../models/IndicatorTable.php';
include_once '../models/ColumnOptions.php';

$dbconnection = new Database();
$db = $dbconnection->dbConnection();

class CreateHandler
{
    private $model;
    public function __construct($db)
    {
        $this->model = new IndicatorTable($db);
    }

    private function createTableRow($tableID, $data)
    {
        if (

            isset($data['locationID']) &&
            isset($data['subIndicatorID']) &&
            isset($data['unitID']) &&
            isset($data['yearID']) &&
            isset($data['value'])
        ) {
            $sanitizedData = [
                'tableID' => htmlspecialchars(strip_tags($tableID)),
                'locationID' => htmlspecialchars(strip_tags($data['locationID'])),
                'subIndicatorID' => htmlspecialchars(strip_tags($data['subIndicatorID'])),
                'unitID' => htmlspecialchars(strip_tags($data['unitID'])),
                'yearID' => htmlspecialchars(strip_tags($data['yearID'])),
                'value' => htmlspecialchars(strip_tags($data['value']))
            ];

            $insertRow = $this->model->createRow($sanitizedData);

            if ($insertRow != null) {
                echo json_encode($insertRow);
            } else {
                throw new Exception("Something went wrong when inserting a new row.");
            }
        } else {
            throw new Exception("Malformed sent data.");
        }
    }

    private function createNewTable($data)
    {
        /*
            Expected request JSON data example:
            {
                "createType": "table",
                "data": {
                    "name": 1,
                }
            } 
        */
        if ($data['name']) {
            $sanitizedData = htmlspecialchars(strip_tags($data['name']));
            $inserteTable = $this->model->createTable($sanitizedData);
            if ($inserteTable != null) {
                print_r(json_encode($inserteTable));
            } else {
                throw new Exception("Something went wrong when inserting a new row.");
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
                "createType": "row",
                "tableID": 1,
                "data": {
                    "locationID": 1,
                    "subIndicatorID": 2,
                    "unitID": 1,
                    "yearID": 1,
                    "value": 123123.4323
                }
            } 
        */
        $request_data = json_decode(file_get_contents("php://input"), true);;
        if (
            isset($request_data) &&
            isset($request_data['createType']) &&
            isset($request_data['data'])
        ) {
            $createType = $request_data['createType'];

            if (
                $createType  == "row" &&
                isset($request_data['tableID'])
            ) {
                $this->createTableRow($request_data['tableID'], $request_data['data']);
            } else if ($createType == "table") {
                $this->createNewTable($request_data['data']);
            }
        } else {
            throw new Exception("Oops! Request type Error");
        }
    }

    public function startPostHandlers()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $this->handleRequestType();
            }
        } catch (Exception $err) {
            http_response_code(404);
            echo json_encode(['message' => $err->getMessage()]);
            die();
        }
    }
}

$handler = new CreateHandler($db);
$handler->startPostHandlers();
