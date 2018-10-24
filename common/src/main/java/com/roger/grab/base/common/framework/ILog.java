package com.roger.grab.base.common.framework;

public interface ILog {

  boolean isDebugEnabled();
  
  boolean isInfoEnabled();

  void error(String s, Throwable e);

  void error(String s);
  
  public void info(String s);

  public void debug(String s);

  public void warn(String s);

}
