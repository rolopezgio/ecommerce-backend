const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  };
  
  class Logger {
    constructor(level = 'info') {
      this.level = levels[level];
    }
  
    log(message, level = 'info') {
      if (levels[level] >= this.level) {
        console.log(`[${level.toUpperCase()}] ${message}`);
      }
    }
  
    debug(message) {
      this.log(message, 'debug');
    }
  
    http(message) {
      this.log(message, 'http');
    }
  
    info(message) {
      this.log(message, 'info');
    }
  
    warning(message) {
      this.log(message, 'warning');
    }
  
    error(message) {
      this.log(message, 'error');
    }
  
    fatal(message) {
      this.log(message, 'fatal');
    }
  }
  
  
  module.exports = Logger;
  