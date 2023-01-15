import React from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import SimpleHeader from 'components/Headers/SimpleHeader.js';

function VisualGrdpIndustry() {
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
                                            'https://datastudio.google.com/embed/reporting/9dd3075f-8444-4ff0-9458-c15eaff95c39/page/UGy5C'
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

export default VisualGrdpIndustry;
