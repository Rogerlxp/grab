package com.roger.grab.base.domain.exception;

public class ContentsException extends Exception {

    private static final long serialVersionUID = 8352345164207000972L;

    private Integer code;

    public ContentsException() {
        super();
    }


    public ContentsException(String message, Throwable cause) {
        super(message, cause);
    }


    public ContentsException(String message) {
        super(message);
        this.code = ContentsExceptionCode.BASE_ERROR;
    }
    
    public ContentsException(Integer code,String message) {
        super(message);
        this.code = code;
    }


    public ContentsException(Throwable cause) {
        super(cause);
    }


	public Integer getCode() {
		return code;
	}

}
