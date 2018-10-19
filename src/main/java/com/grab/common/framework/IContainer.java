package com.grab.common.framework;

import java.lang.annotation.Annotation;
import java.util.Locale;
import java.util.Map;

@SuppressWarnings("unchecked")
public interface IContainer {
	
	/**
	 * 鏌ユ壘Bean鍦ㄨ繖涓狢ontainer閲岄潰鏄惁瀛樺湪, 濡傛灉鎵句笉鍒帮紝 鍒欏湪涓婄骇Container閲岄潰鏌ユ壘 锛堢洰鍓嶄笉鏀寔澶氱骇鐨凜ontainer锛夈��<br>
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:02:12
	 * @since v0.1
	 * @param name 鏌ヨ鐨刡ean name
	 * @return
	 *
	 */
	public abstract boolean containsBean(String name);
	
	/**
	 * 妫�鏌ュ綋鍓岰ontainer鏄惁瀛樺湪鎸囧畾bean鐨勫畾涔夈��<br>
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:04:38
	 * @since v0.1
	 * @param beanName 鏌ヨ鐨刡ean name
	 * @return
	 *
	 */
	public abstract boolean containsBeanDefinition(String beanName);
	
	/**
	 * 鏌ユ壘Bean鍦ㄨ繖涓狢ontainer閲岄潰鏄惁瀛樺湪銆傚鏋滄壘涓嶅埌锛屼笉浼氫粠涓婄骇Container閲岄潰鏌ユ壘<br>
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:06:30
	 * @since v0.1
	 * @param name
	 * @return
	 *
	 */
	public abstract boolean containsLocalBean(String name);
	
	/**
	 * 鍦╞eanName杩欎釜Bean閲岄潰鏌ユ壘涓�涓� 鎸囧畾annotationType鐨凙nnotation .<br> 
	 * 浼氶亶鍘嗚繖涓狟ean鐨勬帴鍙ｅ拰鐖剁被锛屾潵鏌ユ壘Annotation<br>
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:09:10
	 * @since v0.1
	 * @param <A>
	 * @param beanName
	 * @param annotationType
	 * @return
	 *
	 */
	public abstract <A extends Annotation> A findAnnotationOnBean(
			String beanName, Class<A> annotationType);

	/**
	 * 杩斿洖鎸囧畾Bean鐨勬墍鏈夊埆鍚嶃��<br>
	 * 濡傛灉缁欏畾鐨凚ean name鏄竴涓埆鍚嶏紝閭ｄ箞浼氳繑鍥炲搴斿師濮嬪悕绉板拰鍏朵粬鎵�鏈夌殑鍒悕銆�<br>
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:11:22
	 * @since v0.1
	 * @param name
	 * @return
	 *
	 */
	public abstract String[] getAliases(String name);

//	public abstract AutowireCapableBeanFactory getAutowireCapableBeanFactory()
//			throws IllegalStateException;
	
	/**
	 * 杩斿洖涓�涓狟ean瀹炰緥锛� 鍙兘鏄叡浜殑鎴栬�呯嫭绔嬬殑銆�<br>
	 * 鍜実etBean(String)鏂规硶鐨勮涓轰竴鑷达紝浣嗘槸鎻愪緵浜嗛澶栫殑绫诲瀷妫�鏌ワ紝 
	 * 濡傛灉杩斿洖鐨刡ean涓嶆槸璇锋眰鐨勭被鍨嬶紝鍒欐姏鍑哄紓甯窧eanNotOfRequiredTypeException
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:11:22
	 * @since v0.1
	 * @param name
	 * @return 闇�瑕佺殑bean
	 */
	public abstract <T> T getBean(String name, Class<T> requiredType)
			throws ContainerException;

	/**
	 * 杩斿洖涓�涓狟ean瀹炰緥锛� 鍙兘鏄叡浜殑鎴栬�呯嫭绔嬬殑銆�<br>
     * 鍏佽鏄惧紡鐨勪紶鍏ユ瀯閫犲嚱鏁扮殑鍙傛暟鎴栬�呭伐鍘傛柟娉曠殑闃愯堪<br>
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:20:41
	 * @since v0.1
	 * @param name
	 * @param args
	 * @return
	 * @throws ContainerException
	 */
	public abstract Object getBean(String name, Object[] args)
			throws ContainerException;
	
	/**
	 * 杩斿洖涓�涓狟ean瀹炰緥锛� 鍙兘鏄叡浜殑鎴栬�呯嫭绔嬬殑銆�<br>
	 * 
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:23:00
	 * @since v0.1
	 * @param name
	 * @return
	 * @throws ContainerException
	 *
	 */
	public abstract Object getBean(String name) throws ContainerException;
	
	/**
	 * 杩斿洖bean瀹氫箟鐨勪釜鏁�<br>
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:23:47
	 * @since v0.1
	 * @return
	 *
	 */
	public abstract int getBeanDefinitionCount();
	
	/**
	 * 鑾峰彇鎵�鏈夊畾涔夌殑bean鐨勫悕绉般��<br>
	 *
	 * 浣滆�咃細 hewei
	 * 鏃堕棿锛� 2009-7-13涓婂崍11:24:24
	 * @since v0.1
	 * @return
	 */
	public abstract String[] getBeanDefinitionNames();
	
	public abstract String[] getBeanNamesForType(Class type,
			boolean includeNonSingletons, boolean allowEagerInit);

	public abstract String[] getBeanNamesForType(Class type);

	public abstract <T> Map<String, T> getBeansOfType(Class<T> type,
			boolean includeNonSingletons, boolean allowEagerInit)
			throws ContainerException;

	public abstract <T> Map<String, T> getBeansOfType(Class<T> type)
			throws ContainerException;

//	public abstract Map<String, Object> getBeansWithAnnotation(
//			Class<? extends Annotation> annotationType,
//			boolean includeNonSingletons, boolean allowEagerInit)
//			throws ContainerException;

	public abstract Map<String, Object> getBeansWithAnnotation(
			Class<? extends Annotation> annotationType) throws ContainerException;

	public abstract ClassLoader getClassLoader();

	public abstract String getDisplayName();

	public abstract String getId();

//	public abstract String getMessage(MessageSourceResolvable resolvable,
//			Locale locale) throws NoSuchMessageException;

    public abstract String getMessage(String code, Object[] args, Locale locale)
            throws MessageException;

    public abstract String getMessage(String code, Object[] args, String defaultMessage,
            Locale locale);

    public abstract String getMessage(String code) throws MessageException;
    
    public abstract String getMessage(String code, Object[] args) throws MessageException;

    public abstract String getMessage(String code, Object[] args, String defaultMessage);

//	public abstract ApplicationContext getParent();

//	public abstract BeanFactory getParentBeanFactory();

	public abstract IResource getResource(String location);

//	public abstract IResource[] getResources(String locationPattern)
//			throws IOException;

	public abstract long getStartupDate();

	public abstract Class getType(String name)
			throws BeanDefinitionMissingException;

	public abstract boolean isPrototype(String name)
			throws BeanDefinitionMissingException;

	public abstract boolean isSingleton(String name)
			throws BeanDefinitionMissingException;

	public abstract boolean isTypeMatch(String name, Class targetType)
			throws BeanDefinitionMissingException;

	//public abstract void publishEvent(ApplicationEvent event);

}