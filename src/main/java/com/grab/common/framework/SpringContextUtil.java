package com.grab.common.framework;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class SpringContextUtil implements ApplicationContextAware{
    private static ApplicationContext applicationContext;

    /**
     * 瀹炵幇ApplicationContextAware鎺ュ彛鐨勫洖璋冩柟娉曪紝璁剧疆涓婁笅鏂囩幆澧�
     * @param applicationContext
     * @throws BeansException
     */
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextUtil.applicationContext = applicationContext;
    }

    /**
     * @return ApplicationContext
     */
    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    /**
     * 鑾峰彇瀵硅薄
     * @param name
     * @return Object 涓�涓互鎵�缁欏悕瀛楁敞鍐岀殑bean鐨勫疄渚�
     * @throws BeansException
     */
    public static Object getBean(String name) throws BeansException {
        return applicationContext.getBean(name);
    }

    /**
     * 濡傛灉bean涓嶈兘琚被鍨嬭浆鎹紝鐩稿簲鐨勫紓甯稿皢浼氳鎶涘嚭锛圔eanNotOfRequiredTypeException锛�
     * @param name       bean娉ㄥ唽鍚�
     * @param requiredType 杩斿洖瀵硅薄绫诲瀷
     * @return Object 杩斿洖requiredType绫诲瀷瀵硅薄
     * @throws BeansException
     */
    public static Object getBean(String name, Class requiredType) throws BeansException {
        return applicationContext.getBean(name, requiredType);
    }

    /**
     * 濡傛灉BeanFactory鍖呭惈鎵�缁欏悕绉板尮閰嶇殑bean杩斿洖true
     * @param name
     * @return boolean
     */
    public static boolean containsBean(String name) {
        return applicationContext.containsBean(name);
    }

    /**
     * 鍒ゆ柇娉ㄥ唽鐨刡ean鏄痵ingleton杩樻槸prototype銆�
     * 濡傛灉涓庣粰瀹氬悕瀛楃浉搴旂殑bean瀹氫箟娌℃湁琚壘鍒帮紝灏嗕細鎶涘嚭涓�涓紓甯革紙NoSuchBeanDefinitionException锛�
     * @param name
     * @return boolean
     * @throws NoSuchBeanDefinitionException
     */
    public static boolean isSingleton(String name) throws NoSuchBeanDefinitionException {
        return applicationContext.isSingleton(name);
    }

    /**
     * @param name
     * @return Class 娉ㄥ唽瀵硅薄鐨勭被鍨�
     * @throws NoSuchBeanDefinitionException
     */
    public static Class getType(String name) throws NoSuchBeanDefinitionException {
        return applicationContext.getType(name);
    }

    /**
     * 鏍规嵁绫诲瀷鑾峰彇鎸囧畾bean
     * @param clazz
     * @return
     */
    public static <T> T getType(Class<T> clazz) {
        return (T) applicationContext.getBeansOfType(clazz);
    }

    /**
     * @param name
     * @return
     * @throws NoSuchBeanDefinitionException
     */
    public static String[] getAliases(String name) throws NoSuchBeanDefinitionException {
        return applicationContext.getAliases(name);
    }}
