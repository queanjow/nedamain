import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';

function AddIndicator() {
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
                                            'https://paulaalipoyo.github.io/working-in-prorgress/'
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

export default AddIndicator;
