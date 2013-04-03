analysis_methods = {
    
    
    "decode base64" : function(cookie) {
        try {
            return atob(cookie.value);
        } catch(e) { 
            return "error decoding"	
        }
    },
    
    
    
    "hexdump" : function(cookie) {
        return "hexdump todo";
    }
}