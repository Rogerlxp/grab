package com.grab.grab.spider;

import java.util.UUID;

import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Task;

public class GrabTask implements Task {
	
	private Site site;
	protected String uuid;
	
	@Override
	public String getUUID() {
		if (uuid != null) {
			return uuid;
		}
		if (site != null) {
			return site.getDomain();
		}
		uuid = UUID.randomUUID().toString();
		return uuid;
	}
	@Override
	public Site getSite() {
		return site;
	}
	public void setSite(Site site) {
		this.site = site;
	}
}