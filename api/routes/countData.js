const countData = (data, appName) => {
  const uninstalled = data.filter(item => {
    return item === 'Uninstalled';
  });

  const trial = data.filter(item => {
    return item === 'Trial';
  });

  const paid = data.filter(item => {
    return item === 'Paid';
  });

  const expired = data.filter(item => {
    return item === 'Expired';
  });

  return {
    appName,
    paid: paid.length,
    trial: trial.length,
    expired: expired.length,
    uninstalled: uninstalled.length,
  };
};

module.exports = countData;
