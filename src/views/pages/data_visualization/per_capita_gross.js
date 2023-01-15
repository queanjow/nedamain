import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';

function VisualPerCapita() {
    return (
        <>
            <SimpleHeader />
            <Container className="mt--6" fluid>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardBody>
                                <div className="reportwrapper">
                                    <iframe title="Poverty Statistics"
                                        width="100%"
                                        height="700px"
                                        src={
                                            'https://datastudio.google.com/embed/reporting/1728f215-86de-4a2d-b2b4-1d1d0a3810e6/page/UGy5C'
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

export default VisualPerCapita;
