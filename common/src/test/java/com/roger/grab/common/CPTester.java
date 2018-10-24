package com.roger.grab.common;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.testng.Assert;
import org.testng.annotations.Test;

import com.roger.grab.base.dao.mapping.CpMapper;
import com.roger.grab.base.domain.content.CP;
import com.roger.grab.base.enums.CPStatusEnum;



/**
 * 
 * @author Roger
 *
 */
public class CPTester  extends GrabTester{
	@Autowired
	private  CpMapper cpMapper;
	
	@Test
	public void add() {
		CP cp = new CP();
		cp.setCpId((int) (System.currentTimeMillis()/1000)%1000);
		cp.setName("wish");
		cp.setEnName("wish");
		cp.setCreateTime(new Date());
		cp.setStatus(CPStatusEnum.USE.getValue());
		cp.setAutomatic_capture(0);
		cp.setUpdateTime(new Date());
		cp.setLevel(1);
		cp.setInsert_type(1);
		Assert.assertEquals( 1,cpMapper.add(cp));
	}
}