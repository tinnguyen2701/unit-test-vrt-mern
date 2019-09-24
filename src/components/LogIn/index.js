import React, { useState } from 'react';
import {
  Page,
  Card,
  Form,
  FormLayout,
  TextField,
  Button,
  TextStyle,
  Spinner,
} from '@shopify/polaris';
import { connect } from 'react-redux';
import './index.css';
import { LOGIN_REQUEST, VERIFY_CODE_REQUEST } from './ducks';

const Login = ({ isAuthenticate, isLoading, isCheckCode, dispatch }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [code, setCode] = useState(null);

  const handleLogin = event => {
    event.preventDefault();
    dispatch({ type: LOGIN_REQUEST, payload: { email, password } });
  };

  const onSubmitCodeHandler = event => {
    event.preventDefault();
    dispatch({ type: VERIFY_CODE_REQUEST, payload: { email, code } });
  };

  const handleChange = (field, value) => {
    const mapping = { email: setEmail, password: setPassword };
    mapping[field](value);
  };

  return (
    <div id="login-container">
      <Page>
        <Card>
          <Card.Section>
            {isAuthenticate === false && (
              <TextStyle variation="negative">Email or Password was wrong!</TextStyle>
            )}
            {isCheckCode === false && (
              <TextStyle variation="negative">Code verify was wrong!</TextStyle>
            )}
            {isAuthenticate ? (
              <Form onSubmit={event => onSubmitCodeHandler(event)}>
                <FormLayout>
                  <TextField
                    value={code}
                    onChange={value => setCode(value)}
                    label="Code"
                    type="text"
                    placeholder="Check code sent to your email"
                  />
                  <Button submit>
                    {isLoading ? <Spinner size="small" color="teal" /> : 'Verify'}
                  </Button>
                </FormLayout>
              </Form>
            ) : (
              <Form onSubmit={event => handleLogin(event)}>
                <FormLayout>
                  <TextField
                    value={email}
                    onChange={newEmail => handleChange('email', newEmail)}
                    label="Email"
                    type="text"
                  />
                  <TextField
                    value={password}
                    onChange={newPassword => handleChange('password', newPassword)}
                    label="Password"
                    type="password"
                  />
                  <Button submit>
                    {isLoading ? <Spinner size="small" color="teal" /> : 'Log in'}
                  </Button>
                </FormLayout>
              </Form>
            )}
          </Card.Section>
        </Card>
      </Page>
    </div>
  );
};

export default connect(state => ({
  isAuthenticate: state.login.user,
  isLoading: state.login.isLoading,
  isCheckCode: state.login.isCheckCode,
}))(Login);
