<?php
class IndicatorTable
{
    // DB Stuff
    private $conn;
    private $table = 'indicator_table';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getTableLists()
    {
        $SQL_QUERY = "SELECT id, title FROM {$this->table};";
        $result = [];
        $stmt = $this->conn->prepare($SQL_QUERY);
        $isSelected = $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $item = array(
                'id' => $id,
                'name' => $title
            );

            array_push($result, $item);
        }

        if ($isSelected) {
            return  $result;
        } else {
            return null;
        }
    }

    public function getTableName($tableID)
    {
        $SQL_QUERY = "SELECT title FROM {$this->table} WHERE id={$tableID} LIMIT 1;";
        $stmt = $this->conn->query($SQL_QUERY);
        $res = $stmt->fetch();

        return $res['title'];
    }
    // Read Region
    public  function getRows($tableID)
    {
        $SQL_QUERY = "SELECT
        ir.id as 'id',
        loc.title as 'location',
        si.title as 'subIndicator',
        iu.title as 'unit',
        ir.indicator_value as 'value',
        yo.title as 'year'
    FROM
        indicator_rows ir
        INNER JOIN admin_location loc ON loc.id = ir.location_id
        INNER JOIN sub_indicator si ON ir.sub_indicator_id = si.id
        INNER JOIN indicator_unit iu ON ir.unit_id = iu.id
        INNER JOIN year_options yo ON ir.year_id = yo.id
    WHERE
        indicator_table_id = {$tableID}
    ORDER BY
        iu.id ASC;";

        $result = [];
        $stmt = $this->conn->prepare($SQL_QUERY);
        $isSelected =  $stmt->execute();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);

            $item = array(
                'id' => $id,
                'location' => $location,
                'subIndicator' => $subIndicator,
                'unit' => $unit,
                'year' => $year,
                'value' => $value,
            );

            array_push($result, $item);
        }
        if ($isSelected) {
            return $result;
        } else {
            return null;
        }
    }

    public function getSingleRow($tableID, $rowID)
    {
        $SQL_QUERY = "SELECT
        ir.id as 'id',
        loc.title as 'location',
        si.title as 'subIndicator',
        iu.title as 'unit',
        ir.indicator_value as 'value',
        yo.title as 'year'
    FROM
        indicator_rows ir
        INNER JOIN admin_location loc ON loc.id = ir.location_id
        INNER JOIN sub_indicator si ON ir.sub_indicator_id = si.id
        INNER JOIN indicator_unit iu ON ir.unit_id = iu.id
        INNER JOIN year_options yo ON ir.year_id = yo.id
    WHERE indicator_table_id = {$tableID} AND ir.id = {$rowID} LIMIT 1;";

        $stmt = $this->conn->query($SQL_QUERY);
        $res = $stmt->fetch();
        extract($res);

        return array(
            'id' => $id,
            'location' => $location,
            'subIndicator' => $subIndicator,
            'unit' => $unit,
            'year' => $year,
            'value' => $value,
        );
    }

    public function getSingleTable($tableID)
    {
        $SQL_QUERY = "SELECT id, title FROM indicator_table WHERE id={$tableID} LIMIT 1;";
        $stmt = $this->conn->prepare($SQL_QUERY);
        $stmt->execute();
        $res = $stmt->fetch();

        extract($res);

        return array(
            "id" => $id,
            "name" => $title
        );
    }
    // Creater Region
    public function createTable($tableName)
    {
        $SQL_INSERT = "INSERT INTO indicator_table (title) VALUES ('{$tableName}');";
        $stmt = $this->conn->prepare($SQL_INSERT);
        $isInserted =  $stmt->execute();
        $insertedTable = $this->getSingleTable($this->conn->lastInsertId());

        if ($isInserted &&  $insertedTable !== null) {
            return $insertedTable;
        } else {
            return null;
        }
    }
    public function createRow($data)
    {
        $tableID = $data['tableID'];
        $locationID = $data['locationID'];
        $subIndicatorID = $data['subIndicatorID'];
        $unitID = $data['unitID'];
        $yearID = $data['yearID'];
        $value = $data['value'];
      
        $SQL_INSERT =  "INSERT INTO indicator_rows (
            indicator_table_id,
            location_id,
            sub_indicator_id,
            unit_id,
            year_id,
            indicator_value
        ) 
        VALUES ({$tableID},{$locationID},{$subIndicatorID},{$yearID},{$unitID},{$value});";

        $stmt = $this->conn->prepare($SQL_INSERT);
        $isInserted =  $stmt->execute();
        $insertedRow = $this->getSingleRow($tableID, $this->conn->lastInsertId());

        if ($isInserted &&  $insertedRow !== null) {
            return $insertedRow;
        } else {
            return null;
        }
    }

    // Update Region
    public function updateTableName($tableName, $tableID)
    {
        $SQL_INSERT = "UPDATE indicator_table SET title = '{$tableName}' WHERE id = {$tableID};";

        $stmt = $this->conn->prepare($SQL_INSERT);
        $isInserted =  $stmt->execute();
        $insertedTable = $this->getSingleTable($tableID);

        if ($isInserted &&  $insertedTable !== null) {
            return $insertedTable;
        } else {
            return null;
        }
    }

    public function updateRow($data)
    {
        $tableID = $data['tableID'];
        $rowID = $data['rowID'];
        $locationID = $data['locationID'];
        $subIndicatorID = $data['subIndicatorID'];
        $unitID = $data['unitID'];
        $yearID = $data['yearID'];
        $value = $data['value'];

        $SQL_UPDATE = "UPDATE indicator_rows SET
            location_id = {$locationID},
            sub_indicator_id = {$subIndicatorID},
            unit_id = {$unitID},
            year_id = {$yearID},
            indicator_value={$value} 
        WHERE indicator_table_id ={$tableID} AND id={$rowID};";

        $stmt = $this->conn->prepare($SQL_UPDATE);
        $isInserted =  $stmt->execute();
        $updated_table = $this->getSingleRow($tableID, $rowID);

        if ($isInserted &&  $updated_table !== null) {
            return $updated_table;
        } else {
            return null;
        }
    }

    // Delete Region
    public function deleteTable($tableID)
    {
        $SQL_DELETE_ROWS = "DELETE FROM indicator_rows WHERE indicator_table_id={$tableID};";
        $SQL_DELETE_TABLE = "DELETE FROM indicator_table WHERE id={$tableID};";

        $stmt = $this->conn->prepare($SQL_DELETE_ROWS . $SQL_DELETE_TABLE);
        return  $stmt->execute();
    }

    public function deleteRow($tableID, $tableRow)
    {
        $SQL_DELETE = "DELETE FROM indicator_rows 
        WHERE indicator_table_id={$tableID} AND id={$tableRow}";

        $stmt = $this->conn->prepare($SQL_DELETE);
        return  $stmt->execute();
    }
}
