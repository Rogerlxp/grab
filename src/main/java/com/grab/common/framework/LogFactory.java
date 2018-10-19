package com.grab.common.framework;

import java.lang.reflect.Constructor;

@SuppressWarnings("unchecked")
public class LogFactory {

	private static Constructor logConstructor;

	static {
		tryImplementation("org.apache.log4j.Logger",
				"com.grab.common.framework.Log4jImpl");
	}

	private static void tryImplementation(String testClassName,
			String implClassName) {
		if (logConstructor == null) {
			try {
				Class.forName(testClassName);
				Class implClass = Class.forName(implClassName);
				logConstructor = implClass
						.getConstructor(new Class[] { Class.class });
			} catch (Throwable t) {
			}
		}
	}

	public static ILog getLog(Class aClass) {
		try {
			return (ILog) logConstructor.newInstance(new Object[] { aClass });
		} catch (Throwable t) {
			throw new RuntimeException("Error creating logger for class "
					+ aClass + ".  Cause: " + t, t);
		}
	}

	/**
	 * This method will switch the logging implementation to Log4J if
	 * Log4J is available on the classpath. This is useful in situations
	 * where you want to use Log4J to log iBATIS activity but
	 * commons logging is on the classpath. Note that this method is only
	 * effective for log classes obtained after calling this method. If you
	 * intend to use this method you should call it before calling any other
	 * iBATIS method.
	 * 
	 */
	public static synchronized void selectLog4JLogging() {
		try {
			Class.forName("org.apache.log4j.Logger");
			Class implClass = Class
					.forName("com.meizu.framework.impl.log.Log4jImpl");
			logConstructor = implClass
					.getConstructor(new Class[] { Class.class });
		} catch (Throwable t) {
		}
	}
}
