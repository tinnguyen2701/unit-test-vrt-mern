import axios from 'axios';
import uuid from 'uuid/v4';

const defaultTimeout = 30000;

const callApi = (method, url, data = {}) => {
  const config = {
    method,
    url,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      correlationId: uuid(),
      Authorization: `Bearer ${window.localStorage.getItem('jwtToken')}`,
    },
    timeout: data.timeout || defaultTimeout,
    data,
  };

  // config.credentials = 'include';
  // if (data.headers) config.headers = { ...config.headers, ...data.headers };
  // if (data.queryParams) config.params = data.queryParams;
  // if (data.body) {
  //   // config.headers = {
  //   //   ...config.headers,
  //   //   RequestVerificationToken: getCookie(document.cookie, 'XSRF-TOKEN')
  //   // };
  //   config.data = data.body;
  // }

  // if we need to check response status, should do it here
  axios.interceptors.response.use(
    response => response,
    error => {
      Promise.reject(error);
      if (error.response.status === 401) window.location.href = process.env.REACT_APP_BASE_URL;
    },
  );

  return axios(config);
};

export default callApi;
