'use strict';
module.exports = function(code, error, res) {

    this.code = code;

    var exceptionName = "UserException";

    if(typeof error == 'string'){
        this.name = exceptionName;

        this.message = error;
    }else{
        var message = "";

        if(error.message != undefined){
            message = error.message;
        }else{
            message = error;
        }
        this.message = message;

        if(error.name == "ValidationError" || error.name == "CastError"){
            this.name = exceptionName;
            this.data = error;
        }else{
            this.name = "SystemException";
            if(process.env.NODE_ENV != "production"){
                this.data = error;
            }
        }
    }

    //braintree的错误信息会绕过express
    if(res != undefined){
    	this.res = res;
    }
}