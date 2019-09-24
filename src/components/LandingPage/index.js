import React, { useEffect } from 'react';
import { Card, Stack, Spinner, Button, TextStyle } from '@shopify/polaris';

import { connect } from 'react-redux';
import { PageHeader } from 'dorothy/utils';
import { FETCH_DATA_APP_REQUEST } from './ducks';
import './index.css';

const LandingPage = ({ appData, dispatch }) => {
  useEffect(() => {
    dispatch({ type: FETCH_DATA_APP_REQUEST });
  }, []);

  const { data } = appData;

  return (
    <div>
      {data === null ? (
        <div style={{ marginLeft: '50%' }}>
          <Spinner size="large" />
        </div>
      ) : (
        <PageHeader isHome="true">
          <Card>
            <Card.Section>
              <div className="table">
                <Stack distribution="fillEvenly">
                  <Stack vertical alignment="center">
                    {data.map(item => (
                      <Button
                        url={`${process.env.REACT_APP_BASE_URL}appview/${item.appName}`}
                        plain
                      >
                        {item.appName}
                      </Button>
                    ))}
                  </Stack>
                  <Stack vertical alignment="center">
                    {data.map((item, index) =>
                      index === 0 ? (
                        <h2>
                          <TextStyle variation="strong"> {item.paid}</TextStyle>
                        </h2>
                      ) : (
                        <h2>{item.paid}</h2>
                      ),
                    )}
                  </Stack>
                  <Stack vertical alignment="center">
                    {data.map((item, index) =>
                      index === 0 ? (
                        <h2>
                          <TextStyle variation="strong"> {item.trial}</TextStyle>
                        </h2>
                      ) : (
                        <h2>{item.trial}</h2>
                      ),
                    )}
                  </Stack>
                  <Stack vertical alignment="center">
                    {data.map((item, index) =>
                      index === 0 ? (
                        <h2>
                          <TextStyle variation="strong"> {item.expired}</TextStyle>
                        </h2>
                      ) : (
                        <h2>{item.expired}</h2>
                      ),
                    )}
                  </Stack>
                  <Stack vertical alignment="center">
                    {data.map((item, index) =>
                      index === 0 ? (
                        <h2>
                          <TextStyle variation="strong"> {item.uninstalled}</TextStyle>
                        </h2>
                      ) : (
                        <h2>{item.uninstalled}</h2>
                      ),
                    )}
                  </Stack>
                </Stack>
              </div>
            </Card.Section>
          </Card>
        </PageHeader>
      )}
    </div>
  );
};

export default connect(state => ({
  appData: state.landingData,
}))(LandingPage);
