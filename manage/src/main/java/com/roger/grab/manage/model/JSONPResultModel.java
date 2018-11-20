package com.roger.grab.manage.model;

public class JSONPResultModel extends ResponseEntity {

	private String function;
	
	private BaseResultModel model;

	public JSONPResultModel() {
		model = new BaseResultModel();
	}
	
	public JSONPResultModel( String function, Object result ) {
		this.function = function;
		this.model = new BaseResultModel( result );
	}
	
	public String getFunction() {
		return function;
	}

	public void setFunction( String function ) {
		this.function = function;
	}

	public BaseResultModel getModel() {
		return model;
	}

	public void setModel( BaseResultModel model ) {
		this.model = model;
	}
	
}
