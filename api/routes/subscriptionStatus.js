const subscriptionStatus = document => {
  if (document.charge && document.charge.status === 'active') {
    return 'Paid';
  }

  if (document.accessToken && !document.charge) {
    if (new Date() <= new Date(document.expiredAt)) return 'Trial';
    return 'Expired';
  }

  return 'Uninstalled';
};

module.exports = subscriptionStatus;
