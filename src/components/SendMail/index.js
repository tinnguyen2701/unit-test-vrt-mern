import React, { useEffect } from 'react';
import {
  Modal,
  Select,
  TextField,
  Stack,
  FormLayout,
  Button,
  Spinner,
  Tooltip,
  TextContainer,
  Heading,
} from '@shopify/polaris';
import { createAction } from 'dorothy/utils';
import { connect } from 'react-redux';
import {
  MAIL_DATA_REQUEST,
  MAIL_CHANGE,
  MAIL_DELETE_REQUEST,
  MAIL_ADD_REQUEST,
  MAIL_UPDATE_REQUEST,
  MAIL_STATUS_UPDATE,
  SELECTED_SUBJECT_CHANGE,
  NEW_MAIL,
  INPROGRESS,
} from './ducks';

const SendMail = ({ isSendMailVisible, appData, dispatch, selectedShops, close }) => {
  const { mails, currentMail, status, selectedSubject } = appData;

  const options =
    mails &&
    mails.map(mail => ({
      label: mail.subject,
      value: mail.subject,
    }));

  const shopsList = selectedShops.map(shop => [shop.name]).toString();

  useEffect(() => {
    dispatch(createAction(MAIL_DATA_REQUEST));
  }, []);

  const handleSendMailModal = () => {
    if (selectedSubject !== NEW_MAIL) {
      dispatch(createAction(MAIL_STATUS_UPDATE, { ...status, isNewMailActive: false }));
    }
    close();
  };

  const handleSelectChange = value => {
    const mail = mails.find(item => {
      return item.subject === value;
    });

    if (value === NEW_MAIL) {
      dispatch(
        createAction(MAIL_STATUS_UPDATE, { ...status, currentStatus: '', isNewMailActive: true }),
      );
      dispatch(createAction(MAIL_CHANGE, { ...currentMail, subject: '', body: '' }));
      dispatch(createAction(SELECTED_SUBJECT_CHANGE, value));
    } else {
      dispatch(
        createAction(MAIL_STATUS_UPDATE, { ...status, currentStatus: '', isNewMailActive: false }),
      );
      dispatch(
        createAction(MAIL_CHANGE, {
          ...currentMail,
          subject: mail.subject,
          body: mail.body,
        }),
      );
      dispatch(createAction(SELECTED_SUBJECT_CHANGE, value));
    }
  };

  const handleSubjectChange = newValue => {
    dispatch(createAction(MAIL_CHANGE, { ...currentMail, subject: newValue }));
  };

  const handleBodyChange = event => {
    dispatch(createAction(MAIL_CHANGE, { ...currentMail, body: event.target.value }));
  };

  const handleSave = () => {
    const checkAvailable = mails.filter(mail => {
      return mail.subject === currentMail.subject;
    });

    if (checkAvailable.length > 0) {
      dispatch(createAction(MAIL_STATUS_UPDATE, { ...status, subject: 'Subject already exists' }));
    } else if (currentMail.subject === '') {
      dispatch(
        createAction(MAIL_STATUS_UPDATE, { ...status, subject: 'Subject should not be empty' }),
      );
    } else {
      dispatch(
        createAction(MAIL_STATUS_UPDATE, {
          ...status,
          subject: '',
          currentStatus: INPROGRESS,
          isNewMailActive: true,
        }),
      );
      dispatch(createAction(MAIL_ADD_REQUEST, currentMail));
    }
  };

  const handleDeleteMail = () => {
    dispatch(createAction(MAIL_STATUS_UPDATE, { ...status, currentStatus: INPROGRESS }));
    dispatch(createAction(MAIL_DELETE_REQUEST, selectedSubject));
  };

  const handleUpdateMail = () => {
    dispatch(createAction(MAIL_STATUS_UPDATE, { ...status, currentStatus: INPROGRESS }));
    dispatch(createAction(MAIL_UPDATE_REQUEST, [currentMail, selectedSubject]));
  };

  return (
    <Modal open={isSendMailVisible} onClose={handleSendMailModal} title="Send Mail">
      <Modal.Section>
        <FormLayout>
          <Stack>
            <Heading>To :</Heading>

            <Tooltip content={shopsList} active={false}>
              <Heading>
                <div
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '80%',
                    textOverflow: 'ellipsis',
                    position: 'absolute',
                  }}
                >
                  {shopsList}
                </div>
              </Heading>
            </Tooltip>
          </Stack>
          <Select
            label="Email"
            options={options}
            value={selectedSubject}
            onChange={handleSelectChange}
          />
          <TextField
            label="Subject"
            value={currentMail.subject}
            onChange={handleSubjectChange}
            focused={status.isNewMailActive}
            error={status.subject}
          />
          <textarea
            onChange={handleBodyChange}
            value={currentMail.body}
            rows={6}
            style={{ width: '100%', resize: 'none' }}
          />
          <Stack spacing="extraLoose">
            <Stack.Item fill>
              <Stack>
                <Stack vertical spacing="extraTight">
                  <Stack />
                  <Heading>
                    <TextContainer>{status.currentStatus}</TextContainer>
                  </Heading>
                </Stack>
                <Stack vertical spacing="tight">
                  <Stack />
                  <Spinner
                    size={status.currentStatus !== INPROGRESS ? null : 'small'}
                    color="inkLightest"
                  />
                </Stack>
              </Stack>
            </Stack.Item>
            <Stack.Item>
              <Stack>
                <Button
                  destructive={!status.isNewMailActive}
                  onClick={handleDeleteMail}
                  disabled={status.isNewMailActive}
                >
                  Delete
                </Button>
                <Button
                  onClick={status.isNewMailActive === true ? handleSave : handleUpdateMail}
                  primary={status.isNewMailActive}
                >
                  {status.isNewMailActive === true ? 'Save' : 'Update'}
                </Button>
                <Button disabled={status.isNewMailActive}>Preview</Button>
                <Button primary={!status.isNewMailActive} disabled={status.isNewMailActive}>
                  Send
                </Button>
              </Stack>
            </Stack.Item>
          </Stack>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
};

export default connect(state => ({
  appData: state.sendMailReducer,
}))(SendMail);
