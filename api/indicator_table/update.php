<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../classes/Database.php';
include_once '../models/IndicatorTable.php';
include_once '../models/ColumnOptions.php';

$dbconnection = new Database();
$db = $dbconnection->dbConnection();

class CreateHandler
{
    private $indicatorTableModel;
    public function __construct($db)
    {
        $this->indicatorTableModel = new IndicatorTable($db);
    }

    private function updateTableRow($tableID, $data)
    {
        if (

            isset($data['id']) &&
            isset($data['locationID']) &&
            isset($data['subIndicatorID']) &&
            isset($data['unitID']) &&
            isset($data['yearID']) &&
            isset($data['value'])
        ) {
            $sanitizedData = [
                'tableID' => htmlspecialchars(strip_tags($tableID)),
                'rowID' => htmlspecialchars(strip_tags($data['id'])),
                'locationID' => htmlspecialchars(strip_tags($data['locationID'])),
                'subIndicatorID' => htmlspecialchars(strip_tags($data['subIndicatorID'])),
                'unitID' => htmlspecialchars(strip_tags($data['unitID'])),
                'yearID' => htmlspecialchars(strip_tags($data['yearID'])),
                'value' => htmlspecialchars(strip_tags($data['value']))
            ];

            $updatedRow = $this->indicatorTableModel->updateRow($sanitizedData);

            if ($updatedRow != null) {
                print_r(json_encode($updatedRow));
            } else {
                throw new Exception("Something went wrong when updating a new row.");
            }
        } else {
            throw new Exception("Malformed sent data.");
        }
    }

    private function updateTableName($tableID, $data)
    {
        /*
            Expected request JSON data example:
            {
                "updateType": "table",
                "tableID": 1,
                "data": {
                    "name": "Table Name"
                }
            } 
        */
        if ($data['name']) {
            $sanitizedTableID = htmlspecialchars(strip_tags($tableID));
            $sanitizedName = htmlspecialchars(strip_tags($data['name']));
            $updatedTable = $this->indicatorTableModel->updateTableName($sanitizedName, $sanitizedTableID);

            if ($updatedTable != null) {
                print_r(json_encode($updatedTable));
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
                "updateType": "row",
                "tableID": 1,
                "data": {
                    "id": 2,
                    "locationID": 1,
                    "subIndicatorID": 2,
                    "unitID": 1,
                    "yearID": 3,
                    "value": 123123.4323
                }
            } 
        */
        $request_data = json_decode(file_get_contents("php://input"), true);

        if (
            isset($request_data) &&
            isset($request_data['updateType']) &&
            isset($request_data['tableID']) &&
            isset($request_data['data'])
        ) {
            $updateType = $request_data['updateType'];

            if ($updateType  == "table") {
                $this->updateTableName($request_data['tableID'], $request_data['data']);
            } else if ($updateType == "row") {
                $this->updateTableRow($request_data['tableID'], $request_data['data']);
            }
        } else {
            throw new Exception("Oops! Request type Error");
        }
    }

    public function startPostHandlers()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] == "PUT") {
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
