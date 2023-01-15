<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../classes/Database.php';
include_once '../models/IndicatorTable.php';
include_once '../models/ColumnOptions.php';

$dbconnection = new Database();
$db = $dbconnection->dbConnection();

class ReadHandler
{
    private $indicatorTableModel;
    private $indicatorColOptionsModel;

    public function __construct($db)
    {
        $this->indicatorTableModel = new IndicatorTable($db);
        $this->indicatorColOptionsModel = new ColumnOptions($db);
    }

    private function responseTableData($tableID)
    {
        $sanitized_ID = htmlspecialchars(strip_tags($tableID));
        $res_name =  $this->indicatorTableModel->getTableName($sanitized_ID);
        $res_rows = $this->indicatorTableModel->getRows($sanitized_ID);

        if ($res_name !== null && $res_rows !== null) {
            $tableBody = array(
                'id' => $sanitized_ID,
                'name' => $res_name,
                'rows' => $res_rows
            );
            echo json_encode($tableBody);
        } else {
            throw new Exception("Something went wrong when getting a table.");
        }
    }

    private function responseTableLists()
    {
        $tableLists = $this->indicatorTableModel->getTableLists();
        if ($tableLists !== null) {
            echo json_encode($tableLists);
        } else {
            throw new Exception("Something went wrong when getting the lists of table.");
        }
    }

    private function responseColumnOptions($columnType)
    {
        $sanitized_column_type = htmlspecialchars(strip_tags($columnType));
        $result =  $this->indicatorColOptionsModel->getColumnOptions($sanitized_column_type);

        if ($result !== null) {
            echo  json_encode($result);
        } else {
            throw new Exception("Something went wrong when getting column options.");
        }
    }
    private function handleRequestType()
    {
        if (
            isset($_GET['id']) &&
            isset($_GET['type']) &&
            $_GET['type'] == 'table'
        ) {
            $this->responseTableData($_GET['id']);
        } else if (
            !isset($_GET['id']) &&
            isset($_GET['type']) &&
            $_GET['type'] == 'lists'
        ) {
            $this->responseTableLists();
        } else if (
            isset($_GET['columnType']) &&
            isset($_GET['type']) &&
            $_GET['type'] == 'columnOptions'
        ) {
            $this->responseColumnOptions($_GET['columnType']);
        } else {
            throw new Exception("Oops! Request type Error");
        }
    }

    public function startRequestHandling()
    {
        try {
            if ($_SERVER["REQUEST_METHOD"] == "GET") {
                $this->handleRequestType();
            }
        } catch (\Exception | \PDOException  $err) {
            http_response_code(404);
            echo json_encode(['message' => $err->getMessage()]);
            die();
        }
    }
}

$handler = new ReadHandler($db);
$handler->startRequestHandling();
