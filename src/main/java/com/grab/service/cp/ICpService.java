package com.grab.service.cp;

import java.util.List;

import com.grab.domain.content.CP;


/**
 * 
 * @author Roger
 *
 */
public interface ICpService {

	List<CP> getUseCPs();
	
	void update(CP cp);
	
	void del(Integer cpId);

	CP get(Integer cpId);

	int add(CP cp);

	List<CP> getCPByUpdateTime(Integer updateTime);

	List<CP> getCps(List<Integer> cpIds);
	List<CP> find(CP cp);
}
