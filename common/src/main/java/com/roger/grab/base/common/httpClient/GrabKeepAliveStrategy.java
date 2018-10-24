package com.roger.grab.base.common.httpClient;

import org.apache.http.HttpResponse;
import org.apache.http.impl.client.DefaultConnectionKeepAliveStrategy;
import org.apache.http.protocol.HttpContext;

public class GrabKeepAliveStrategy extends DefaultConnectionKeepAliveStrategy{
	@Override
    public long getKeepAliveDuration(final HttpResponse response, final HttpContext context) {
        long keepAlive = super.getKeepAliveDuration(response, context);
        if (keepAlive == -1) {
            keepAlive = 5000;
        }
        return keepAlive;
    }
}
