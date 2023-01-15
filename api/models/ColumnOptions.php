<?php
class ColumnOptions
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    private function queryOptions($tableName)
    {
        $SQL_QUERY = "SELECT id,title FROM {$tableName};";

        $result = [];
        $stmt = $this->conn->prepare($SQL_QUERY);
        $isSelected =  $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $item = array(
                'id' => $id,
                'name' => $title,
            );

            array_push($result, $item);
        }
        if ($isSelected) {
            return $result;
        } else {
            return null;
        }
    }

    public function getColumnOptions($optionType)
    {
        $result = null;

        switch ($optionType) {
            case 'locations':
                $result = $this->queryOptions('admin_location');
                break;
            case 'subIndicators':
                $result = $this->queryOptions('sub_indicator');
                break;
            case 'units':
                $result = $this->queryOptions('indicator_unit');
                break;
            case 'years':
                $result = $this->queryOptions('year_options');
                break;
        }

        return $result;
    }
}
