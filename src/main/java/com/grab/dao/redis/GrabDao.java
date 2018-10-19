package com.grab.dao.redis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.grab.dao.mapping.GrabMapper;
import com.grab.domain.grab.GrabParamString;
import com.grab.domain.redis.RedisKeys;

@Service("GrabDao")
public class GrabDao implements GrabMapper{
	@Autowired
	private GrabMapper mapper;
	
	@Cacheable(value = RedisKeys.Grab.GRAB,key="'grab:'+#id")
	public GrabParamString get(Integer id ) {
		return mapper.get(id);
	}
	
	@CacheEvict(value= {RedisKeys.Grab.GRAB},key="'grab:'+#grabId")
	public void delCache(Integer grabId) {
	}
	
	public int add( GrabParamString grabParamString ) {
		return mapper.add(grabParamString);
	}

	public List<GrabParamString> getList(List<Integer> grabIds){
		return mapper.getList(grabIds);
	}

	@Override
	public void update(GrabParamString grabParamString) {
		mapper.update(grabParamString);
	}

	@Override
	public void del(Integer id) {
		mapper.del(id);
	}

	@Override
	public List<GrabParamString> find(GrabParamString grabParamString) {
		return mapper.find(grabParamString);
	}
}
