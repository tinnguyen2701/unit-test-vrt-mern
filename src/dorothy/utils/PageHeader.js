import React, { useState } from 'react';
import { Button, Page, Stack, Popover, ActionList } from '@shopify/polaris';
import {
  HorizontalDotsMinor,
  CustomersMajorMonotone,
  CircleChevronLeftMinor,
} from '@shopify/polaris-icons';
import './PageHeader.css';

const PageHeader = ({ previousPage, children, isHome }) => {
  const [toggleDown, setToggleDown] = useState(false);

  const handleToggleDown = value => setToggleDown(value);

  const activator = (
    <Button onClick={() => handleToggleDown(!toggleDown)} icon={HorizontalDotsMinor} />
  );

  return (
    <Page>
      <Stack vertical>
        <div className="header-page">
          <Stack>
            <Stack.Item fill>
              {' '}
              {!isHome ? (
                <Button url={previousPage} icon={CircleChevronLeftMinor}>
                  Back
                </Button>
              ) : (
                <Button
                  url={`${process.env.REACT_APP_BASE_URL}users`}
                  icon={CustomersMajorMonotone}
                >
                  Users
                </Button>
              )}
            </Stack.Item>
            <Stack.Item>
              <Popover
                active={toggleDown}
                activator={activator}
                onClose={() => handleToggleDown(!toggleDown)}
              >
                <ActionList
                  items={[
                    { content: 'Home', url: `${process.env.REACT_APP_BASE_URL}landingpage` },
                    { content: 'Log out' },
                  ]}
                />
              </Popover>
            </Stack.Item>
          </Stack>
        </div>
        {children}
      </Stack>
    </Page>
  );
};

export default PageHeader;
