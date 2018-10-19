package com.grab.dao.redis;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.grab.dao.mapping.GrabMappingMapper;
import com.grab.domain.grab.GrabResultParamString;
import com.grab.domain.redis.RedisKeys;

@Service("GrabMappingDao")
public class GrabMappingDao implements GrabMappingMapper{
	@Autowired
	private GrabMappingMapper mapper;
	
	@Cacheable(value = RedisKeys.Grab.GRAB_MAPPING,key="'grab_mapping:'+#grabId")
	public GrabResultParamString get(Integer grabId ) {
		return mapper.get(grabId);
	}
	
	@CacheEvict(value= {RedisKeys.Grab.GRAB_MAPPING},key="'grab_mapping:'+#grabId")
	public void delCache(Integer grabId) {
	}
	
	public int add( GrabResultParamString schemaString ) {
		return mapper.add(schemaString);
	}

	@Override
	public void update(GrabResultParamString schemaString) {
		mapper.update(schemaString);
	}

	@Override
	public void del(Integer grabId) {
		mapper.del(grabId);
	}

	@Override
	public List<GrabResultParamString> find(GrabResultParamString grabResultParamString) {
		return mapper.find(grabResultParamString);
	}
}