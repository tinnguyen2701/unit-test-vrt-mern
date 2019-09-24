import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  Button,
  FormLayout,
  TextField,
  Select,
  Spinner,
  Modal,
  Stack,
  Heading,
  ResourceList,
  TextStyle,
} from '@shopify/polaris';
import { createAction, PageHeader } from 'dorothy/utils';
import {
  USERS_DATA_REQUEST,
  USER_ADD_REQUEST,
  USER_REMOVE_REQUEST,
  USER_EDIT_REQUEST,
  CHECK_BOX_CHANGE,
  ADMIN,
  MARKETER,
  MASTER,
} from './ducks';
import './index.css';

const Users = ({ dispatch, usersData }) => {
  const { users, selectedItems } = usersData;
  const [modalData, setModalData] = useState({
    isVisible: false,
    type: null,
    user: {},
    errorMessage: {},
  });

  const { errorMessage, type, user, isVisible } = modalData;
  const { email, password, name, role } = user;
  const initialUser = { email: '', password: '', name: '', role: ADMIN };
  const initialError = { email: null, password: null, name: null };

  useEffect(() => {
    dispatch(createAction(USERS_DATA_REQUEST));
  }, []);

  const handleUserChange = (field, value) => {
    setModalData({ ...modalData, user: { ...user, [field]: value } });
  };

  const handleValidation = actionType => {
    let formIsValid = true;
    errorMessage.email = null;
    errorMessage.password = null;
    errorMessage.name = null;

    if (actionType === 'Add') {
      if (!email.match(/\S+@\S+\.\S+/)) {
        errorMessage.email = 'Email is not valid.';
        formIsValid = false;
      }

      if (users.filter(item => item.email === email).length > 0) {
        errorMessage.email = 'Email already exists.';
        formIsValid = false;
      }
    }

    if (password.length < 6) {
      errorMessage.password = 'Password has to greater than or equal 6 characters';
      formIsValid = false;
    }

    if (name.length < 6) {
      errorMessage.name = 'Name has to greater than or equal 6 characters';
      formIsValid = false;
    }

    setModalData({
      ...modalData,
      errorMessage,
    });
    return formIsValid;
  };

  const handleCheckboxChange = value => {
    dispatch(createAction(CHECK_BOX_CHANGE, value));
  };

  const addUser = () => {
    setModalData({ ...modalData, isVisible: true, type: 'Add', user: initialUser });
  };

  const options = [{ label: ADMIN, value: ADMIN }, { label: MARKETER, value: MARKETER }];

  const editUser = index => {
    if (users[index].role !== MASTER)
      setModalData({
        ...modalData,
        isVisible: true,
        type: 'Edit',
        user: { ...users[index], password: '' },
      });
  };

  const updateUser = actionType => {
    if (actionType === 'Add') {
      if (handleValidation(actionType)) {
        dispatch(createAction(USER_ADD_REQUEST, user));
        setModalData({ ...modalData, isVisible: false, errorMessage: initialError });
      }
    }

    if (actionType === 'Edit') {
      if (handleValidation(actionType)) {
        dispatch(createAction(USER_EDIT_REQUEST, user));
        setModalData({ ...modalData, isVisible: false, errorMessage: initialError });
      }
    }
  };

  const removeUser = () => {
    if (
      selectedItems.length > 0 &&
      selectedItems.filter(item => users[Number(item)].role === MASTER).length === 0
    ) {
      const emails = selectedItems.map(item => users[Number(item)].email).join();
      dispatch(createAction(USER_REMOVE_REQUEST, emails));
    }
  };

  const renderItem = (item, index) => {
    return (
      <ResourceList.Item id={index}>
        <Stack>
          <Stack.Item fill>
            <h2>
              <TextStyle variation="strong"> {item.email}</TextStyle>
            </h2>
            <h2>
              {item.name} | {item.role}
            </h2>
          </Stack.Item>
          <Stack.Item>
            {item.role !== MASTER && (
              <Button plain onClick={() => editUser(index)}>
                Edit
              </Button>
            )}
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    );
  };

  const promotedBulkActions = [
    {
      content: 'Delete',
      onAction: () => removeUser(),
    },
  ];

  return users.length < 1 ? (
    <div style={{ marginLeft: '50%' }}>
      <Spinner />
    </div>
  ) : (
    <PageHeader previousPage={`${process.env.REACT_APP_BASE_URL}landingpage`}>
      <Card>
        <Card.Section>
          <Heading>User List</Heading>
        </Card.Section>
        <Card.Section>
          <div className="resource-list">
            <ResourceList
              items={users}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={handleCheckboxChange}
              promotedBulkActions={promotedBulkActions}
              alternateTool={<Button onClick={addUser}>Add</Button>}
            />
          </div>
        </Card.Section>
      </Card>
      <Modal
        open={isVisible}
        title={`${type} User`}
        onClose={() => setModalData({ ...modalData, isVisible: false, errorMessage: initialError })}
        size="small"
      >
        <Modal.Section>
          <FormLayout>
            <TextField
              label="Email"
              error={errorMessage.email}
              onChange={newValue => handleUserChange('email', newValue)}
              value={email}
              disabled={type === 'Edit'}
            />
            <TextField
              type="password"
              label="Password"
              error={errorMessage.password}
              onChange={newValue => handleUserChange('password', newValue)}
              value={password}
            />
            <TextField
              label="Name"
              error={errorMessage.name}
              onChange={newValue => handleUserChange('name', newValue)}
              value={name}
            />
            <Select
              label="Role"
              options={options}
              onChange={newValue => handleUserChange('role', newValue)}
              value={role}
            />
            <Button onClick={() => updateUser(type)}>Save</Button>
          </FormLayout>
        </Modal.Section>
      </Modal>
    </PageHeader>
  );
};

export default connect(state => ({
  usersData: state.usersData,
}))(Users);
