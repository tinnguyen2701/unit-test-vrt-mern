/**
 * true | false | # of trial days left
 */
module.exports = subscription => {
  const createdAt = Date.parse(subscription.createdAt);
  const trialDaysLeft =
    process.env.TRIAL_DAYS - Math.floor((Date.now() - createdAt) / (1000 * 3600 * 24));

  if (subscription.charge) return true;

  return trialDaysLeft < 0 ? false : trialDaysLeft;
};
