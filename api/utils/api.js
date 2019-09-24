const axios = require('axios');

const defaultTimeout = 10000;

const get = url =>
  axios({
    method: 'get',
    url,
    timeout: defaultTimeout,
  });

const post = (url, data) =>
  axios({
    method: 'post',
    url,
    data,
    timeout: defaultTimeout,
  });

/**
 * @param {*} shop { domain, accessToken }
 * @param {*} method 'GET' | 'POST'
 * @param {*} endpoint '/admin/shop.json'
 * @param {*} data {}
 */
const callShopifyApi = (shop, method, endpoint, data = null) =>
  axios({
    method,
    url: `https://${shop.domain}/admin/api/${process.env.SHOPIFY_API_VERSION}/${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Access-Token': shop.accessToken,
    },
    data,
    timeout: defaultTimeout,
  });

/**
 * @param {*} method 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
 * @param {*} endpoint '/collections/subscriptions'
 * @param {*} data { query: '{ "shop.domain": "palaiseau.myshopify.com" }' }
 */
const callDataProxy = (method, endpoint, data = null) =>
  axios({
    method,
    url: `${process.env.DATAPROXY_URL}apps/${endpoint}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    auth: {
      username: process.env.DATAPROXY_USER,
      password: process.env.DATAPROXY_PASSWORD,
    },
    data,
    timeout: defaultTimeout,
  });

module.exports = { get, post, callShopifyApi, callDataProxy };
