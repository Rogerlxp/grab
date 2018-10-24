package com.roger.grab.base.common.framework;

import java.lang.reflect.Method;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class ContainerLocation {
	/**
	 * 淇濆瓨ClassLoader鍒癐Container鐨勬槧灏勶紝
	 * 濡傛灉Listener鏄�氳繃web app 鐨凜lassloader閮ㄧ讲鐨勶紝 閫氬父鍙細鏈変竴涓��
	 */
	private static final Map<ClassLoader, IContainer> currentContainerPerThread =
		new ConcurrentHashMap<ClassLoader, IContainer>(1);
	
	public static IContainer getContainer(){
		IContainer c = currentContainerPerThread.get(Thread.currentThread().getContextClassLoader());
		return c;
	}
	
	/**
	 * 瀹瑰櫒鍒濆鍖栵紝渚沀nitTest涓撶敤銆備娇鐢ㄥ畬姣曢渶瑕佸強浣跨敤鏂规硶{@link ContainerLocation#destoryContainer}鍙婃椂閿�姣佸鍣�
	 * <p>
	 * 浣滆�咃細 hewei </br>
	 * 鏃堕棿锛� 2009-7-28涓婂崍10:36:11 </br>
	 * @since v0.1 </br>
	 * @param configpath
	 * @return </br>
	 *
	 */
	public static IContainer getContainerForUnitTest(String configpath){
		try {
			Class<?> clazz = Class.forName("com.meizu.framework.impl.container.ContainerImpl");
			Object obj = clazz.newInstance();
			Method method = clazz.getMethod("initContainer", String.class);
			method.invoke(obj, configpath);
			IContainer ic = (IContainer)obj;
			initContainer(ic);
			return ic;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
	
	/**
	 * web瀹瑰櫒鍒濆鍖栨椂鍒濆鍖栧鍣ㄣ��
	 * </br>
	 * 浣滆�咃細 hewei </br>
	 * 鏃堕棿锛� 2009-7-16涓嬪崍05:25:41 </br>
	 * @since v0.1 </br>
	 * @param ic </br>
	 *
	 */
	public static void initContainer(IContainer ic){
		if(currentContainerPerThread.containsKey(Thread.currentThread().getContextClassLoader())){
			throw new RuntimeException("State error when initialize Container");			
		}else{
			currentContainerPerThread.put(Thread.currentThread().getContextClassLoader(), ic);
		}
	}
	
	/**
	 * 閿�姣佸鍣ㄣ�備竴涓簲鐢ㄥ彧鍏佽鏈変竴涓鍣ㄣ��
	 * <p>
	 * 浣滆�咃細 hewei </br>
	 * 鏃堕棿锛� 2009-7-28涓婂崍10:35:41 </br>
	 * @since v0.1 </br> </br>
	 *
	 */
	public static void destoryContainer(){
		if(!currentContainerPerThread.containsKey(Thread.currentThread().getContextClassLoader())){
			throw new RuntimeException("State error when destory Container");			
		}else{
			currentContainerPerThread.remove(Thread.currentThread().getContextClassLoader());
		}
	}
}
