package com.grab;

//import org.test4j.module.database.annotations.Transactional;
import org.test4j.module.spring.annotations.SpringContext;
import org.test4j.testng.Test4J;
import org.testng.annotations.Test;
//import org.test4j.module.database.annotations.Transactional.TransactionMode;

/**
 * 
 * @author Roger
 *
 */
@Test
//@Transactional(transactionManagerName = "txManager", value = TransactionMode.COMMIT)
@SpringContext(value = "config/spring-grab.xml", share = true)
public class GrabTester extends Test4J {

	 @Test
	public void init() throws InterruptedException {
		 Thread.sleep(100000000);
	}
}