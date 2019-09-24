/* eslint-disable no-console */
const logError = (...messages) => console.error(`[${process.env.REACT_APP_NAME}]`, ...messages);
const logWarning = (...messages) => console.warn(`[${process.env.REACT_APP_NAME}]`, ...messages);
const logInfo = (...messages) => console.info(`[${process.env.REACT_APP_NAME}]`, ...messages);
const logDebug = (...messages) => console.log(`[${process.env.REACT_APP_NAME}]`, ...messages);

module.exports = { logError, logWarning, logInfo, logDebug };
