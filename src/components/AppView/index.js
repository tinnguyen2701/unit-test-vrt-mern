import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  ResourceList,
  Stack,
  Select,
  TextField,
  Icon,
  Heading,
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { createAction, PageHeader } from 'dorothy/utils';
import SendMail from '../SendMail';

import { CHECKBOX_CHANGE, SEARCH_VALUE_CHANGE, CATEGORY_CHANGE, SHOPS_DATA_REQUEST } from './ducks';
import './index.css';

const AppView = ({ appViewData, dispatch, match }) => {
  const [isSendMailVisible, setIsSendMailVisible] = useState(false);
  const [selectedShops, setSelectedShops] = useState([]);

  const {
    currentShopData,
    allShopData,
    selectedItems,
    searchValue,
    selectedCategory,
  } = appViewData;

  useEffect(() => {
    dispatch(createAction(SHOPS_DATA_REQUEST, match.params.app));
  }, []);

  const handleCheckboxChange = value => {
    dispatch(createAction(CHECKBOX_CHANGE, value));
  };

  const handleSearchChange = value => {
    dispatch(createAction(SEARCH_VALUE_CHANGE, value));
  };
  const handleCategoryChange = value => {
    dispatch(createAction(CATEGORY_CHANGE, value));
  };

  const showSendMailDialog = () => {
    setSelectedShops(
      currentShopData.filter(item => {
        return selectedItems.includes(item.id);
      }),
    );
    setIsSendMailVisible(!isSendMailVisible);
  };

  const closeSendMail = () => {
    setIsSendMailVisible(false);
  };

  const renderItem = (shop, index) => {
    const { name, email, domain } = shop;

    return (
      <ResourceList.Item id={index}>
        <Stack spacing="extraLoose" alignment="center">
          <Stack.Item fill>
            <Stack vertical>
              <Button
                plain
                url={`${process.env.REACT_APP_BASE_URL}shopview/${match.params.app}/${domain}`}
              >
                {name}
              </Button>
              <h2>
                {shop.created_at && shop.created_at.replace('T', ' ').substr(0, 19)} | {email}
              </h2>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Stack vertical>
              <Button
                url={`${process.env.REACT_APP_BASE_URL}api/dashboard?application=${
                  match.params.app
                }&shop=${domain}&jwtToken=${window.localStorage.getItem('jwtToken')}`}
              >
                Admin Dashboard
              </Button>
            </Stack>
          </Stack.Item>
        </Stack>
      </ResourceList.Item>
    );
  };

  const resourceName = {
    singular: 'shop',
    plural: 'shops',
  };

  const promotedBulkActions = [
    {
      content: 'Send mail',
      url: '',
      onAction: showSendMailDialog,
    },
    {
      content: 'Update',
      url: '',
    },
  ];

  const options = [
    { label: 'All', value: 'All' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Trial', value: 'Trial' },
    { label: 'Expired', value: 'Expired' },
    { label: 'Uninstalled', value: 'Uninstalled' },
  ];

  const filterControl = (
    <Stack spacing="none">
      <Stack.Item>
        <Select options={options} onChange={handleCategoryChange} value={selectedCategory} />
      </Stack.Item>
      <Stack.Item fill>
        <TextField
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search shops"
          prefix={<Icon source={SearchMinor} color="inkLightest" />}
        />
      </Stack.Item>
    </Stack>
  );

  return (
    <PageHeader previousPage={`${process.env.REACT_APP_BASE_URL}landingpage`}>
      <Card>
        <Card.Section>
          <Heading>
            {match.params.app[0].toUpperCase()}
            {match.params.app.slice(1)} App
          </Heading>
        </Card.Section>
        <Card.Section>
          <div className="resource-list">
            <ResourceList
              resourceName={resourceName}
              items={currentShopData}
              renderItem={renderItem}
              selectedItems={selectedItems}
              onSelectionChange={handleCheckboxChange}
              promotedBulkActions={promotedBulkActions}
              filterControl={filterControl}
              loading={allShopData.length === 0}
            />
          </div>
        </Card.Section>
        <SendMail
          isSendMailVisible={isSendMailVisible}
          selectedShops={selectedShops}
          close={closeSendMail}
        />
      </Card>
    </PageHeader>
  );
};

export default connect(state => ({
  appViewData: state.appViewData,
}))(AppView);
