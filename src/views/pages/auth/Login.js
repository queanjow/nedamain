import { UserContext } from '../../../context/UserContext';
import React, { useState, useContext } from 'react';
import NotificationAlert from 'react-notification-alert';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
} from 'reactstrap';
import AuthHeader from 'components/Headers/AuthHeader.js';

function Login() {
    const { loginUser, wait, loggedInCheck } = useContext(UserContext);
    const [focusedEmail, setfocusedEmail] = useState(false);
    const [focusedPassword, setfocusedPassword] = useState(false);
    const notificationAlertRef = React.useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setalert] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const history = useHistory();

    console.log({ email, password });

    const onChangeInput = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const submitForm = async (e) => {
        e.preventDefault();

        if (!Object.values(formData).every((val) => val.trim() !== '')) {
            setErrMsg('Please Fill in all Required Fields!');
            return;
        }

        const data = await loginUser(formData);
        if (data.success) {
            e.target.reset();
            successAlert();
            await loggedInCheck();
            return;
        }
        setErrMsg(data.message);
    };

    const successAlert = () => {
        setalert(
            <ReactBSAlert
                custom
                success
                style={{ display: 'block', marginTop: '-100px' }}
                title="Welcome!"
                onConfirm={() => setalert(history.push('/admin'))}
                onCancel={() => setalert(history.push('/admin'))}
                confirmBtnBsStyle="default"
                confirmBtnText="Ok"
                btnSize="">
                Successfully Login
            </ReactBSAlert>
        );
    };

    return (
        <>
            {alert}
            <div className="rna-wrapper">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <AuthHeader />
            <Container className="mt--8 pb-5">
                <Row className="justify-content-center">
                    <Col lg="5" md="7">
                        <Card className="bg-secondary border-0 mb-0">
                            <CardHeader className="bg-transparent pb-5">
                                <div className="text-muted text-center mt-2 mb-3">
                                    <Col
                                        className="collapse-brand center"
                                        xs="5">
                                        <span className="App-logo center"></span>
                                        <img
                                            alt="..."
                                            width={100}
                                            height={100}
                                            src={require('assets/img/brand/argon-react.png')}
                                        />
                                    </Col>
                                </div>
                                <Row className="justify-content-center">
                                    <h2 className="text-blue">
                                        SOCIO ECONOMIC DATABASE
                                    </h2>
                                </Row>
                            </CardHeader>
                            <CardBody className="px-lg-5 py-lg-5">
                                <form role="form" onSubmit={submitForm}>
                                    <FormGroup>
                                        <InputGroup className="input-group-merge input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-email-83" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                placeholder="Email"
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={formData.email}
                                                onFocus={() =>
                                                    setfocusedEmail(true)
                                                }
                                                onBlur={() =>
                                                    setfocusedEmail(true)
                                                }
                                                required
                                                onChange={onChangeInput}
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <InputGroup className="input-group-merge input-group-alternative">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="ni ni-lock-circle-open" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                                type="password"
                                                placeholder="Password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onFocus={() =>
                                                    setfocusedPassword(true)
                                                }
                                                onBlur={() =>
                                                    setfocusedPassword(true)
                                                }
                                                onChange={onChangeInput}
                                                required
                                            />
                                        </InputGroup>
                                    </FormGroup>
                                    <div className="text-center">
                                        {errMsg && (
                                            <div className="err-msg">
                                                {errMsg}
                                            </div>
                                        )}
                                        {redirect ? (
                                            redirect
                                        ) : (
                                            <Button
                                                className="my-4"
                                                color="primary"
                                                type="submit"
                                                disabled={wait}
                                                fullWidth
                                                variant="contained">
                                                Sign in
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                        <Row className="mt-3"></Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;
