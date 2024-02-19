class LoggerDevelopment {
    debug(message) {
      console.debug(`[DEBUG] ${message}`);
    }
  
    http(message) {
      console.log(`[HTTP] ${message}`);
    }
  
    info(message) {
      console.info(`[INFO] ${message}`);
    }
  
    warning(message) {
      console.warn(`[WARNING] ${message}`);
    }
  
    error(message) {
      console.error(`[ERROR] ${message}`);
    }
  
    fatal(message) {
      console.error(`[FATAL] ${message}`);
    }
  }
  
  module.exports = LoggerDevelopment;
  