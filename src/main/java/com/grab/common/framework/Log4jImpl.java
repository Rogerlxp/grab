package com.grab.common.framework;

import org.apache.log4j.Logger;

@SuppressWarnings("unchecked")
public class Log4jImpl implements ILog {

  private Logger log;

  public Log4jImpl(Class clazz) {
    log = Logger.getLogger(clazz);
  }

  public boolean isDebugEnabled() {
    return log.isDebugEnabled();
  }
  
  public boolean isInfoEnabled() {
	    return log.isInfoEnabled();
	  }

  public void error(String s, Throwable e) {
    log.error(s, e);
  }

  public void error(String s) {
    log.error(s);
  }
  
  public void info(String s) {
	    log.info(s);
	  }
  
  public void debug(String s) {
    log.debug(s);
  }

  public void warn(String s) {
    log.warn(s);
  }

}
