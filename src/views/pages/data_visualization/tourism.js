import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';

function VisualTourism() {
    return (
        <>
            <SimpleHeader />
            <Container className="mt--6" fluid>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardBody>
                                <div className="reportwrapper">
                                    <iframe title="tourism"
                                        width="100%"
                                        height="700px"
                                        src={
                                            'https://datastudio.google.com/embed/reporting/3d7ee906-fe5c-4ef8-9f54-7852456e4998/page/UGy5C'
                                        }
                                        allowFullScreen
                                        frameBorder="0"
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default VisualTourism;
