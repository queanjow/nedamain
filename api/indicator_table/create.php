<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once  '../classes/Database.php';
// include_once '../classes/JwtHandler.php';
include_once '../models/IndicatorTable.php';
include_once '../models/ColumnOptions.php';

$db_connection = new Database();
$db = $db_connection->dbConnection();


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
            isset($data['periodID']) &&
            isset($data['value'])
        ) {
            $sanitizedData = [
                'tableID' => htmlspecialchars(strip_tags($tableID)),
                'locationID' => htmlspecialchars(strip_tags($data['locationID'])),
                'subIndicatorID' => htmlspecialchars(strip_tags($data['subIndicatorID'])),
                'unitID' => htmlspecialchars(strip_tags($data['unitID'])),
                'yearID' => htmlspecialchars(strip_tags($data['yearID'])),
                'periodID' => htmlspecialchars(strip_tags($data['periodID'])),
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

    private function proccessAssocKeys($assocArray)
    {
        $keys = str_replace(' ', '', array_keys($assocArray));
        $results = array_combine($keys, array_values($assocArray));
        return array_change_key_case($results, CASE_LOWER);
    }
    private function checkImportRow($rowData, $rowIndex)
    {
        $status = [
            'isValid' => true,
            'message' => ''
        ];
        $expectedHeaders = [
            'location',
            'subindicator',
            'unit',
            'year',
            'period',
            'value'
        ];
        $proccessedAssocKeyRowData = $this->proccessAssocKeys($rowData);

        foreach ($expectedHeaders as $header) {
            if (!isset($proccessedAssocKeyRowData[$header])) {
                $indexInExcel = $rowIndex + 2;
                $status = [
                    'isValid' => false,
                    'message' => "No \"{$header}\" value found at index: {$indexInExcel} in CSV. 
                    Make sure all the values are present in every row and must suffice with the available options 
                    provided in every column respectively."
                ];
                break;
            }
        }

        return $status;
    }

    private function checkImportedContents($tableName, $rowsData)
    {
        foreach ($rowsData as $index => $row) {
            if (isset($tableName)) {
                $status =   $this->checkImportRow($row, $index);

                if (!$status['isValid']) {
                    http_response_code(203);
                    echo json_encode(['message' => $status['message']]);
                    die();
                }
            } else {
                http_response_code(203);
                echo json_encode(['message' => "No table name found."]);
                die();
            }
        }
    }

    private function importCSV($tableName, $rowsData)
    {

        if (is_array($rowsData)) {
            $this->checkImportedContents($tableName, $rowsData);
            $sanitizedRows = array();
            $sanitzedTableName = htmlspecialchars(strip_tags(preg_replace('/\\.[^.\\s]{3,4}$/', '', $tableName)));

            foreach ($rowsData as $row) {
                $proccessedAssocKeyRowData = $this->proccessAssocKeys($row);

                array_push($sanitizedRows, [
                    'location' => strtolower(htmlspecialchars(strip_tags($proccessedAssocKeyRowData['location']))),
                    'subIndicator' => strtolower(htmlspecialchars(strip_tags($proccessedAssocKeyRowData['subindicator']))),
                    'unit' => strtolower(htmlspecialchars(strip_tags($proccessedAssocKeyRowData['unit']))),
                    'year' => strtolower(htmlspecialchars(strip_tags($proccessedAssocKeyRowData['year']))),
                    'period' => strtolower(htmlspecialchars(strip_tags($proccessedAssocKeyRowData['period']))),
                    'value' => htmlspecialchars(strip_tags($proccessedAssocKeyRowData['value']))
                ]);
            }

            $insertedTable =  $this
                ->model
                ->importCreateTable($sanitzedTableName, $sanitizedRows);

            if ($insertedTable != null) {
                echo json_encode($insertedTable);
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
        $request_data = json_decode(file_get_contents("php://input"), true);

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
            } else if (
                $createType == 'import' &&
                isset($request_data['tableName']) &&
                isset($request_data['data']) &&
                is_array($request_data['data'])
            ) {
                /*
                    Expected request JSON data example:
                    {
                        "createType": "import",
                        "tableName": "Sample Name",
                        "data":[
                            {
                                "location": "Davao City",
                                "subIndicator": "Sub Indicator",
                                "unit": "Total",
                                "year": "2020",
                                "value": 123123.4323
                            },
                            {
                                "location": "Davao City",
                                "subIndicator": "Sub Indicator",
                                "unit": "Total",
                                "year": "2020",
                                "value": 123123.4323
                            },
                        ]
                    } 
                */

                $this->importCSV(
                    $request_data['tableName'],
                    $request_data['data']
                );
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
        } catch (Error $err) {
            echo json_encode(['message' => $err->getMessage()]);
            http_response_code(404);
            die();
        } catch (PDOException $err) {
            echo json_encode(['message' => "Somethin went wrong in SQL"]);
            http_response_code(404);
            die();
        }
    }
}

$handler = new CreateHandler($db);
$handler->startPostHandlers();
