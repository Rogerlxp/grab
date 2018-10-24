package com.roger.grab.base.service.cp.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.roger.grab.base.dao.mapping.CpMapper;
import com.roger.grab.base.domain.content.CP;
import com.roger.grab.base.enums.CPStatusEnum;
import com.roger.grab.base.service.cp.ICpService;

/**
 * 
 * @author Roger
 *
 */
@Service("CpService")
public class CpService implements ICpService{
	
	@Autowired
	private CpMapper cpMapper;

	@Override
	public List<CP> getUseCPs() {
		return cpMapper.getByStatus(CPStatusEnum.USE.getValue());
	}
	
	@Override
	public List<CP> getCPByUpdateTime(Integer updateTime) {
		if(updateTime == null) {
			updateTime = 0;
		}
		return cpMapper.getByUpdate(updateTime);
	}
	
	@Override
	public List<CP> find(CP cp) {
		return cpMapper.find(cp);
	}
	
	@Override
	public void update(CP cp) {
		cpMapper.update(cp);
	}

	@Override
	public void del(Integer cpId) {
		cpMapper.del(cpId);
	}
	
	@Override
	public CP get(Integer cpId) {
		return cpMapper.get(cpId);
	}
	
	@Override
	public List<CP> getCps(List<Integer> cpIds) {
		return cpMapper.getCps(cpIds);
	}
	
	@Override
	public int add(CP cp) {
		return cpMapper.add(cp);
	}

}
