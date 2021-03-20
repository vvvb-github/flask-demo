function readJson(){
    var obj = eval(Infor)
    console.log(obj)
    infor_length = Infor.length
    console.log(count)
    //count = 0
    thiscount = 0
    for(i=0;i<infor_length;i++){
        if(obj[i].result != 0){
            continue
        }
        else if(thiscount<=3){
            document.writeln("<li class=\"notification-message\">")
            document.writeln("<a href=\"#\">")
            document.writeln("<div class=\"media\">")
            document.writeln("<span class=\"avatar avatar-sm\">")
            document.writeln("<img class=\"avatar-img rounded-circle\" alt=\"User Image\" src=\"static/assets/img/user/user13.jpg\">")
            document.writeln("</span>")
            document.writeln("<div class=\"media-body\">")
            document.writeln("<p class=\"noti-details\"><span class=\"noti-title\">"+obj[i].sender_name+"</span> 发布一则<span class=\"noti-title\">"+obj[i].subject+"</span></p>")
            document.writeln("<p class=\"noti-time\"><span class=\"notification-time\">"+obj[i].sendData +"</span></p>")
            document.writeln("</div>")
            document.writeln("</div>")
            document.writeln("</a>")
            document.writeln("</li>")
            thiscount += 1
        }
    }

    document.getElementById("infor_count").innerHTML = count
}