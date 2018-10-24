package com.roger.grab.base.common.framework;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;

/**
 * 
 * 鎻忚堪锛� 
 * 鍒涘缓鏃堕棿锛�2009-7-13涓婂崍10:56:01
 * 浣滆�咃細 hewei
 * @since v0.1
 *
 */
public interface IResource {

	// public Resource createRelative(String relativePath) throws IOException ;

	public boolean exists();

	public String getDescription();

	public File getFile() throws IOException;

	public String getFilename();

	public InputStream getInputStream() throws IOException;

	public URI getURI() throws IOException;

	public URL getURL() throws IOException;

	public boolean isOpen();

	public boolean isReadable();

	public long lastModified() throws IOException;

}
