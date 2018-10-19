package com.grab.domain.grab;

import java.io.Serializable;
import java.util.List;

public class SchemaTree implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = -4421001509598324545L;
	private Schema schema;
	private List<Schema> params;
	private SchemaTree nextNode;
	private boolean spread = false;
	
	public Schema getSchema() {
		return schema;
	}
	public void setSchema(Schema schema) {
		this.schema = schema;
	}
	public List<Schema> getParams() {
		return params;
	}
	public void setParams(List<Schema> params) {
		this.params = params;
	}
	public boolean isSpread() {
		return spread;
	}
	public void setSpread(boolean spread) {
		this.spread = spread;
	}
	public SchemaTree getNextNode() {
		return nextNode;
	}
	public void setNextNode(SchemaTree nextNode) {
		this.nextNode = nextNode;
	}
	
	@Override
	public String toString() {
		return "SchemaTree [schema=" + schema + ", params=" + params + ", nextNode=" + nextNode + ", spread=" + spread
				+ "]";
	}
	
}
