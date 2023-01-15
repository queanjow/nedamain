import axios from 'axios';
import { useEffect, useState } from 'react';
import NotificationAlert from 'react-notification-alert';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';
import React from 'react';
import {
    Card,
    CardHeader,
    UncontrolledTooltip,
    Button,
    Container,
    Row,
    Col,
    Form,
    Input,
    Modal,
    Label,
    FormGroup
} from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, {
    Search,
    CSVExport
} from 'react-bootstrap-table2-toolkit';
import ReactToPrint from 'react-to-print';

const { REACT_APP_API_URL } = process.env;

function LandAreaPopulation() {
    const [addModalshow, setAddModal] = React.useState(false);
    const [alert, setalert] = React.useState(false);
    const [landAreas, setLandArea] = useState([]);
    const notificationAlertRef = React.useRef(false);
    const [inputs, setInputs] = useState({});
    const [editModal, setEditModal] = React.useState(false);
    const { ExportCSVButton } = CSVExport;
    const [locationLists, setLocationList] = useState([]);
    const [yearLists, setYearLists] = useState([]);
    const [periodLists, setPeriodLists] = useState([]);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const getLocations = () => {
        axios
            .get(`${REACT_APP_API_URL}/locations.php/location`)
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setLocationList(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    const getYears = () => {
        axios
            .get(`${REACT_APP_API_URL}/years.php/years`)
            .then((response) => {
                const { data } = response;
                if (response.status === 200) {
                    //check the api call is success by stats code 200,201 ...etc
                    setYearLists(data);
                } else {
                    //error handle section
                }
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getLandArea();
        getUserId();
        getLocations();
        getYears();
    }, []);

    function getUserId(id) {
        axios
            .get(`${REACT_APP_API_URL}/land-area-population.php/landarea/${id}`)
            .then(function (response) {
                console.log(response.data);
                setInputs(response.data);
            });
    }

    function getLandArea() {
        axios
            .get(`${REACT_APP_API_URL}/land-area-population.php/landarea`)
            .then(function (response) {
                console.log(response.data);
                setLandArea(response.data);
            });
    }

    const addHandleSubmit = () => {
        axios
            .post(
                `${REACT_APP_API_URL}/land-area-population.php/landarea/save`,
                inputs
            )
            .then(function (response) {
                console.log(response.data);
                getLandArea(response.data);
            });
    };

    const updateNotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        {' '}
                        Successfully Updated!
                    </span>
                    <span data-notify="message">
                        Entry Updated on Land Area and Total Population
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 4
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const addnotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        {' '}
                        Successfully Added!
                    </span>
                    <span data-notify="message">
                        Entry Added on Land Area and Total Population
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 4
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const deletenotify = (type) => {
        let options = {
            place: 'tc',
            message: (
                <div className="alert-text">
                    <span className="alert-title" data-notify="title">
                        {' '}
                        Successfully Deleted!
                    </span>
                    <span data-notify="message">
                        Entry deleted from Land Area and Total Population
                    </span>
                </div>
            ),
            type: type,
            icon: 'ni ni-check-bold',
            autoDismiss: 3
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    const questionAlert = (id) => {
        setalert(
            <ReactBSAlert
                custom
                style={{ display: 'block', marginTop: '-100px' }}
                title="Are you sure you want to delete?"
                customIcon={
                    <div
                        className="swal2-icon swal2-question swal2-animate-question-icon"
                        style={{ display: 'flex' }}>
                        <span className="swal2-icon-text">?</span>
                    </div>
                }
                onConfirm={() => {
                    getLandArea(
                        axios
                            .delete(
                                `${REACT_APP_API_URL}/land-area-population.php/${id}/delete`
                            )
                            .then(function (response) {
                                console.log(response.data);
                                getLandArea(response.data);
                            }),
                        setalert(null)
                    );
                    deletenotify('danger');
                }}
                onCancel={() => setalert(null)}
                confirmBtnBsStyle="default"
                confirmBtnText="Delete"
                showCancel
                btnSize=""></ReactBSAlert>
        );
    };

    const { SearchBar } = Search;
    const componentRef = React.useRef(null);
    const copyToClipboardAsTable = (el) => {
        var body = document.body,
            range,
            sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
            document.execCommand('copy');
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
            range.execCommand('Copy');
        }
        setalert(
            <ReactBSAlert
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="Copied data table!"
                onConfirm={() => setalert(null)}
                onCancel={() => setalert(null)}
                confirmBtnBsStyle="info"
                btnSize=""></ReactBSAlert>
        );
    };

    const pagination = paginationFactory({
        page: 1,
        alwaysShowAllBtns: true,
        showTotal: true,
        withFirstAndLast: true,
        sizePerPageRenderer: ({
            options,
            currSizePerPage,
            onSizePerPageChange
        }) => (
            <div className="dataTables_length" id="datatable-basic_length">
                <label>
                    Show{' '}
                    {
                        <select
                            name="datatable-basic_length"
                            aria-controls="datatable-basic"
                            className="form-control form-control-sm"
                            onChange={(e) =>
                                onSizePerPageChange(e.target.value)
                            }>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    }{' '}
                    entries.
                </label>
            </div>
        )
    });

    const onAfterSaveCell = (id) => {
        axios
            .put(
                `${REACT_APP_API_URL}/land-area-population.php/landarea/${id}/edit`
            )
            .then(function (response) {
                console.log(response.data);
            });
        updateNotify('success');
    };

    function afterFilter(newResult, newFilters) {
        console.log(newResult);
        console.log(newFilters);
    }

    function columnHeadFormat(
        column,
        colIndex,
        { sortElement, filterElement }
    ) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {column.text}
                {sortElement}
                {filterElement}
            </div>
        );
    }

    function amountFormatter(numberString) {
        if (numberString === null) {
            return null;
        }
        let number = parseFloat(numberString);
        return number.toLocaleString('Php');
    }

    // temporary needs rework
    const perioditems = [
        {
            group: 'Annual',
            options: [
                { value: 'Annual', label: 'Annual' },
            ]
        },
        {
            group: 'Semestral',
            options: [
                { value: '1st Sem', label: '1st Sem' },
                { value: '2nd Sem', label: '2nd Sem' }
            ]
        },
        {
            group: 'Quarterly',
            options: [
                { value: '1st Quarter', label: '1st Quarter' },
                { value: '2nd Quarter', label: '2nd Quarter' },
                { value: '3rd Quarter', label: '3rd Quarter' },
                { value: '4th Quarter', label: '4th Quarter' }
            ]
        }
    ];

    const filterEditPeriodItems = [
                { value: 'Annual', label: 'Annual' },
                { value: '1st Sem', label: 'Semestral : 1st Sem' },
                { value: '2nd Sem', label: 'Semestral : 2nd Sem' },
                { value: '1st Quarter', label: 'Quarterly : 1st Quarter' },
                { value: '2nd Quarter', label: 'Quarterly : 2nd Quarter' },
                { value: '3rd Quarter', label: 'Quarterly : 3rd Quarter' },
                { value: '4th Quarter', label: 'Quarterly : 4th Quarter' }
            
    ];
    // temporary needs rework
    
    return (
        <>
            {alert}
            <div className="rna-wrapper">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <SimpleHeader />
            <Container className="mt--6" fluid>
                <Row>
                    <div className="col">
                        <Card>
                            <CardHeader className="border-0">
                                <Row>
                                    <Col xs="6">
                                        <h3 className="mb-0">
                                            Land Area and Total Population
                                        </h3>
                                    </Col>
                                    <Col className="text-right" xs="6">
                                        <Button
                                            className="btn-round btn-icon"
                                            color="primary"
                                            id="tooltip443412080"
                                            onClick={() => setAddModal(true)}
                                            size="sm">
                                            <span className="btn-inner--icon mr-1">
                                                <i className="fas fa-user-plus" />
                                            </span>
                                            <span className="btn-inner--text">
                                                Add
                                            </span>
                                        </Button>
                                        <UncontrolledTooltip
                                            delay={0}
                                            target="tooltip443412080">
                                            Add new Entry
                                        </UncontrolledTooltip>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <ToolkitProvider
                                data={landAreas}
                                keyField="id"
                                columns={[
                                    {
                                        dataField: 'location',
                                        text: 'Location',
                                        filter: selectFilter({
                                            options: locationLists.map(
                                                (item) => ({
                                                    value: item.location_Name,
                                                    label: item.location_Name
                                                })
                                            ),
                                            withoutEmptyOption: false
                                        }),
                                        editor: {
                                            type: Type.SELECT,
                                            options: locationLists.map(
                                                (item) => ({
                                                    value: item.location_Name,
                                                    label: item.location_Name
                                                })
                                            )
                                        },
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        headerFormatter: columnHeadFormat,
                                        title: () => `Double click to edit`
                                    },
                                    {
                                        dataField: 'year',
                                        text: 'Year',
                                        editor: {
                                            type: Type.SELECT,
                                            options: yearLists.map((item) => ({
                                                value: item.year_name,
                                                label: item.year_name
                                            }))
                                        },
                                        filter: selectFilter({
                                            options: yearLists.map((item) => ({
                                                value: item.year_name,
                                                label: item.year_name
                                            })),
                                            withoutEmptyOption: false
                                        }),
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        headerFormatter: columnHeadFormat,
                                        title: () => `Double click to edit`
                                    },
                                    {
                                        dataField: 'period',
                                        text: 'Period',
                                        editor: {
                                            type: Type.SELECT,
                                            options: filterEditPeriodItems.map((item) => ({
                                                value: item.value,
                                                label: item.label,
                                            }))
                                        },
                                        filter: selectFilter({
                                            options: filterEditPeriodItems.map((item) => ({
                                                value: item.value,
                                                label: item.label,
                                            })),
                                            withoutEmptyOption: false
                                        }),
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        headerFormatter: columnHeadFormat,
                                        title: () => `Double click to edit`
                                    },
                                    {
                                        dataField: 'land_area_km',
                                        text: 'Land Area (km²)',
                                        sort: true,
                                        validator: (newValue) => {
                                            if (isNaN(newValue)) {
                                                return {
                                                    valid: false,
                                                    message:
                                                        'Value should be numeric'
                                                };
                                            }
                                            return true;
                                        },
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`,
                                        formatter: amountFormatter
                                    },
                                    {
                                        dataField: 'population',
                                        text: 'Population ',
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`,
                                        formatter: amountFormatter
                                    },
                                    {
                                        dataField: 'municipalities',
                                        text: 'Municipalities ',
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`,
                                        formatter: amountFormatter
                                    },
                                    {
                                        dataField: 'cities',
                                        text: 'Cities ',
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`,
                                        formatter: amountFormatter
                                    },
                                    {
                                        dataField: 'city_type',
                                        text: 'City Type ',
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`
                                    },
                                    {
                                        dataField: 'barangays',
                                        text: 'Barangays',
                                        sort: true,
                                        align: 'center',
                                        headerAlign: 'center',
                                        title: () => `Double click to edit`,
                                        formatter: amountFormatter
                                    },
                                    {
                                        dataField: 'id',
                                        text: '',
                                        sort: false,
                                        csvExport: false,
                                        formatter: (landarea) => {
                                            return (
                                                // eslint-disable-next-line
                                                <p
                                                    className="table-action table-action-delete"
                                                    id="deletetooltip"
                                                    color="primary"
                                                    size="sm"
                                                    onClick={() => {
                                                        questionAlert(landarea);
                                                    }}>
                                                    <i className="fas fa-trash" />
                                                    <UncontrolledTooltip
                                                        delay={0}
                                                        target="deletetooltip">
                                                        Delete entry
                                                    </UncontrolledTooltip>
                                                </p>
                                                /* <p
                                                        className="table-action table-action-delete"
                                                        id="edittooltip"
                                                        color="primary"
                                                        size="sm"
                                                        onClick={() =>
                                                            setEditModal(
                                                                povertystat
                                                            )
                                                        }>
                                                        <i className="fas fa-edit" />
                                                        <UncontrolledTooltip
                                                            delay={0}
                                                            target="edittooltip">
                                                            Edit entry
                                                        </UncontrolledTooltip>
                                                    </p> */
                                            );
                                        },
                                        align: 'right',
                                        headerAlign: 'center'
                                    }
                                ]}
                                search>
                                {(props) => (
                                    <div className="py-4 table-responsive">
                                        <Container fluid>
                                            <Row>
                                                <Col xs={12} sm={6}>
                                                    <Button
                                                        className="btn-round btn-icon"
                                                        color="primary"
                                                        size="sm"
                                                        id="copy-tooltip"
                                                        onClick={() =>
                                                            copyToClipboardAsTable(
                                                                document.getElementById(
                                                                    'react-bs-table'
                                                                )
                                                            )
                                                        }>
                                                        <span className="btn-inner--icon mr-1">
                                                            <i className="fas fa-database" />
                                                        </span>
                                                        <span>Copy </span>
                                                    </Button>
                                                    <ReactToPrint
                                                        trigger={() => (
                                                            <Button
                                                                color="primary"
                                                                size="sm"
                                                                className="buttons-copy buttons-html5"
                                                                id="print-tooltip">
                                                                <span className="btn-inner--icon mr-1">
                                                                    <i className="fas fa-print" />
                                                                </span>
                                                                <span>
                                                                    Print{' '}
                                                                </span>
                                                            </Button>
                                                        )}
                                                        content={() =>
                                                            componentRef.current
                                                        }
                                                        pageStyle={
                                                            "'@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}'"
                                                        }
                                                    />
                                                    <ExportCSVButton
                                                        id="csv-tooltip"
                                                        className="btn-round btn-icon btn btn-primary btn-sm"
                                                        {...props.csvProps}>
                                                        <span className="btn-inner--icon mr-1">
                                                            <i className="fas fa-file-export" />
                                                        </span>
                                                        <span>
                                                            Export CSV Bulk Data
                                                        </span>
                                                    </ExportCSVButton>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="csv-tooltip">
                                                        This will generate csv
                                                        file based on available
                                                        data
                                                    </UncontrolledTooltip>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="print-tooltip">
                                                        This will open a print
                                                        page with the visible
                                                        rows of the table.
                                                    </UncontrolledTooltip>
                                                    <UncontrolledTooltip
                                                        placement="top"
                                                        target="copy-tooltip">
                                                        This will copy to your
                                                        clipboard the visible
                                                        rows of the table.
                                                    </UncontrolledTooltip>
                                                </Col>
                                                <Col xs={12} sm={6}>
                                                    <div
                                                        id="datatable-basic_filter"
                                                        className="dataTables_filter px-4 pb-1 float-right">
                                                        <label>
                                                            Search:
                                                            <SearchBar
                                                                className="form-control-sm"
                                                                placeholder=""
                                                                {...props.searchProps}
                                                            />
                                                        </label>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <BootstrapTable
                                            ref={componentRef}
                                            {...props.baseProps}
                                            bootstrap4={true}
                                            pagination={pagination}
                                            hover
                                            loading={true}
                                            id="react-bs-table"
                                            keyField="id"
                                            striped
                                            data={landAreas}
                                            cellEdit={cellEditFactory({
                                                mode: 'dbclick',
                                                blurToSave: true,
                                                afterSaveCell: onAfterSaveCell
                                            })}
                                            noDataIndication="No available data"
                                            filter={filterFactory(afterFilter)}
                                        />
                                    </div>
                                )}
                            </ToolkitProvider>
                        </Card>
                        <Card></Card>
                    </div>
                </Row>
            </Container>

            {/* START - Adding new data  */}
            <Modal
                className="modal-dialog-centered"
                isOpen={addModalshow}
                toggle={() => setAddModal(false)}>
                <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                        Add new Entry
                    </h6>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setAddModal(false)}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Form>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Indicators
                            </Label>
                            <Col md="10">
                                <Input
                                    defaultValue="Land Area and Total Population"
                                    type="text"
                                    disabled
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Location
                            </Label>
                            <Col md="10">
                                <Input
                                    id="location"
                                    name="location"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <option disabled selected>
                                        Please Select
                                    </option>
                                    {locationLists.map((item) => (
                                        <option
                                            key={item.location_ID}
                                            value={item.location_Name}>
                                            {item.location_Name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                                md="2">
                                Period
                            </Label>
                            <Col md="10">
                                <Input
                                    id="period"
                                    name="period"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <optgroup>Please Select</optgroup>
                                    {perioditems.map((item) => (
                                        <optgroup
                                            key={item.group}
                                            label={item.group}>
                                            {item.options.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                                md="2">
                                Year
                            </Label>
                            <Col md="10">
                                <Input
                                    id="year"
                                    name="year"
                                    type="select"
                                    required
                                    onChange={handleChange}>
                                    <option disabled selected>
                                        Please Select
                                    </option>
                                    {yearLists.map((item) => (
                                        <option
                                            key={item.year_id}
                                            value={item.year_name}>
                                            {item.year_name}
                                        </option>
                                    ))}
                                </Input>
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Land Area
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="km²"
                                    htmlFor="example-text-input"
                                    id="land_area_km"
                                    name="land_area_km"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Population
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="(ex. 767,547)"
                                    htmlFor="example-text-input"
                                    id="population"
                                    name="population"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Mun
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="Municipalities (ex. 11) | number only"
                                    htmlFor="example-text-input"
                                    id="municipalities"
                                    name="municipalities"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Cities
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="(ex. 2) | number only"
                                    htmlFor="example-text-input"
                                    id="cities"
                                    name="cities"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                City type
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="HUC"
                                    htmlFor="example-text-input"
                                    id="city_type"
                                    name="city_type"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Barangays
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="(ex. 2) | number only"
                                    htmlFor="example-text-input"
                                    id="barangays"
                                    name="barangays"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <div className="modal-footer">
                            <Button
                                color="primary"
                                onClick={() => {
                                    addHandleSubmit();
                                    addnotify('success');
                                    setAddModal(false);
                                }}>
                                Save
                            </Button>
                            <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setAddModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
            {/* END - adding new data  */}
            {/* START - Edit existing data  */}
            <Modal
                className="modal-dialog-centered"
                isOpen={editModal}
                toggle={() => setEditModal(false)}
                // to={`povertystat/${povertystats.id}/edit`}
            >
                <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                        Edit Details
                    </h6>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setEditModal(false)}>
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <Form>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Location
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="Davao Del Sur"
                                    id="location"
                                    name="location"
                                    type="text"
                                    required
                                    value={inputs.location}
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Indicators
                            </Label>
                            <Col md="10">
                                <Input
                                    defaultValue="Poverty Statistics"
                                    id="indicators"
                                    name="indicators"
                                    type="text"
                                    value={inputs.indicators}
                                    disabled
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-text-input"
                                md="2">
                                Sub Indicators
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="Poverty Incidence of Famillies"
                                    id="sub_indicators"
                                    name="sub_indicators"
                                    type="text"
                                    value={inputs.sub_indicators}
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-date-input"
                                md="2">
                                Year
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="2022"
                                    id="year"
                                    name="year"
                                    type="text"
                                    value={inputs.year}
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-tel-input"
                                md="2">
                                Value
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder=""
                                    htmlFor="example-text-input"
                                    id="value"
                                    name="value"
                                    type="text"
                                    value={inputs.value}
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup className="row">
                            <Label
                                className="form-control-label"
                                htmlFor="example-password-input"
                                md="2">
                                Unit
                            </Label>
                            <Col md="10">
                                <Input
                                    placeholder="total"
                                    id="unit"
                                    name="unit"
                                    type="text"
                                    value={inputs.unit}
                                    required
                                    onChange={handleChange}
                                />
                            </Col>
                        </FormGroup>
                        <div className="modal-footer">
                            <Button
                                color="primary"
                                onClick={() => {
                                    setEditModal(false);
                                }}>
                                Update
                            </Button>
                            <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setEditModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
            {/* END - Edit existing data  */}
        </>
    );
}

export default LandAreaPopulation;
