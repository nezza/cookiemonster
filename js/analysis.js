

analysis_methods = {
    
    
    "decode base64" : function(cookie) {
        try {
            // hexdump + raw output from decoded base64
            decoded = atob(cookie.value);
            return hexdump(decoded)+rawOutput(decoded);
        } catch(e) { 
            return error("error decoding: "+e.message);	
        }
    },
    
    
    "hexdump" : function(cookie) {
        // hexdump + raw output
        return hexdump(cookie.value)+rawOutput(cookie.value);
    },
    
    
    "json" : function(cookie) {
        try {
            return "<p><pre>"+JSON.stringify(JSON.parse(cookie.value),' ',4)+"</p></pre>";
        } catch(e) {
            return error("error parsing: "+e.message);  
        }
    },

    "timestamp" : function(cookie) {
        try {
            return "<p><pre>"+(new Date(parseInt(cookie.value)*1000)).toUTCString()+"</p></pre>";
        } catch(e) {
            return error("error parsing: "+e.message);  
        }
    },
    
}

// Those function create HTML output for the 'ng-bind-html-unsafe' analysis output.
// Maybe not the nicest solution, but it seems the best to keep this analysis more generic
// to be able to adapt for other analysises like json outputs in a nice format and so forth.

hexdump = function(data) {
    /* example:
    00000000  63 6f 6f 6b 69 65 20 6d  6f 6e 73 74 65 72 0a 3d  |cookie monster.=|
    00000010  3d 3d 3d 3d 3d 3d 3d 3d  3d 3d 3d 3d 3d 0a 0a 63  |=============..c|
    00000020  6f 6f 6b 69 65 20 66 69  6e 67 65 72 70 72 69 6e  |ookie fingerprin|
    00000030  74 69 6e 67 20 63 68 72  6f 6d 65 20 65 78 74 65  |ting chrome exte|
    00000040  6e 73 69 6f 6e                                    |nsion|
    */
    var out = "<p><pre>";
    var hexline = "";
    var charline = "";
    
    for (var i=0; i < data.length; i++) {
        var character = data.substr(i, 1);
        var charcode = data.charCodeAt(i);
        character = character.replace('<','&lt;').replace( '>','&gt;');

        var hex = (charcode < 16) ? "0" + charcode.toString(16) : charcode.toString(16);
        var address = parseInt(i/16)*16;
        
        hexline += hex+" ";
        charline += character;
        address = ("00000000" + address.toString(16)).slice(-8);
        
        if((i+1)%8==0) hexline+= " ";
        if((i+1)%16==0) {
            out += address+"  "+hexline+"|"+charline+"|\n";
            hexline = "";
            charline = "";
        }
    }
    // nice padding trick http://stackoverflow.com/a/14760377/1233844
    
    
    if(hexline && charline) {
        for(i=hexline.length;i<49;++i) hexline+= " ";
        for(i=charline.length;i<16;++i) charline+= " ";
        out += address+"  "+hexline+" |"+charline+"|\n";
    }
    out += "</pre></p>";
    return out;
}

rawOutput = function(data) {
    return ' <div class="input-prepend input-xxlarge"> \
                <span class="add-on">raw</span> \
                <input class="input-xxlarge" type="text" value="'+data.replace( '"','&quot;')+'"> \
            </div>';
}

error = function(data) {
    return '<p><li class="icon-exclamation-sign"></li> <span class="text-error">'+data+'</span></p>';
}