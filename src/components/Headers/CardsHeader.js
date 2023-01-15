import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// reactstrap components
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    CardTitle,
    Container,
    Row,
    Col
} from 'reactstrap';

function CardsHeader({ name, parentName }) {
    return (
        <>
            <div className="header bg-info pb-6">
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col lg="6" xs="7">
                                <h6 className="h2 text-white d-inline-block mb-0">
                                    {name}
                                </h6>{' '}
                                <Breadcrumb
                                    className="d-none d-md-inline-block ml-md-4"
                                    listClassName="breadcrumb-links breadcrumb-dark">
                                    <BreadcrumbItem>
                                        <a
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}>
                                            <i className="fas fa-home" />
                                        </a>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <a
                                            href="#pablo"
                                            onClick={(e) => e.preventDefault()}>
                                            {parentName}
                                        </a>
                                    </BreadcrumbItem>
                                    <BreadcrumbItem
                                        aria-current="page"
                                        className="active">
                                        {name}
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                            <Col className="text-right" lg="6" xs="5">
                                <Button
                                    className="btn-neutral"
                                    color="default"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    size="sm">
                                    New
                                </Button>
                                <Button
                                    className="btn-neutral"
                                    color="default"
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                    size="sm">
                                    Filters
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    );
}

CardsHeader.propTypes = {
    name: PropTypes.string,
    parentName: PropTypes.string
};

export default CardsHeader;
