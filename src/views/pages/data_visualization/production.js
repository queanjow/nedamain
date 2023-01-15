import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';

function VisualProduction() {
    return (
        <>
            <SimpleHeader />
            <Container className="mt--6" fluid>
                <Row>
                    <Col xl="12">
                        <Card>
                            <CardBody>
                                <div className="reportwrapper">
                                    <iframe title="production"
                                        width="100%"
                                        height="700px"
                                        src={
                                            'https://datastudio.google.com/embed/reporting/c8b718fc-dedd-49a5-82bf-e1b90d231a2e/page/UGy5C'
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

export default VisualProduction;
