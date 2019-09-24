import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, DescriptionList, Spinner, Heading } from '@shopify/polaris';

import { createAction, PageHeader } from 'dorothy/utils';

import { LOAD_DATA_SHOPVIEW } from './ducks';

const ShopView = ({ shopView, dispatch, match }) => {
  useEffect(() => {
    dispatch(
      createAction(LOAD_DATA_SHOPVIEW, `${match.params.appName},${match.params.shopDomain}`),
    );
  }, []);

  const { shopViewData } = shopView;

  const items = shopViewData && [
    { term: 'ID', description: shopViewData[0].shop.id },
    { term: 'Name', description: shopViewData[0].shop.name },
    { term: 'Email', description: shopViewData[0].shop.email },
    { term: 'Domain', description: shopViewData[0].shop.domain },
    { term: 'Province', description: shopViewData[0].shop.province },
    { term: 'Country', description: shopViewData[0].shop.country },
    { term: 'Address1', description: shopViewData[0].shop.address1 },
    { term: 'Zip', description: shopViewData[0].shop.zip },
    { term: 'City', description: shopViewData[0].shop.city },
    { term: 'Access Token', description: shopViewData[0].accessToken },
  ];

  return (
    <div>
      {shopViewData === null ? (
        <div style={{ marginLeft: '50%' }}>
          <Spinner size="large" />
        </div>
      ) : (
        <PageHeader
          previousPage={`${process.env.REACT_APP_BASE_URL}appview/${match.params.appName}`}
        >
          <Card>
            <Card.Section>
              <Heading>Shop Details</Heading>
            </Card.Section>
            <Card.Section>
              <DescriptionList items={shopViewData === null ? [{}] : items} />
            </Card.Section>
          </Card>
        </PageHeader>
      )}
    </div>
  );
};

export default connect(state => ({
  shopView: state.shopView,
}))(ShopView);
