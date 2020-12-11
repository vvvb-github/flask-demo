function readJson(){
    var obj = eval(Infor)
    infor_length = Infor.length
    console.log(111111111)
    count = 0
    for(i=0;i<infor_length;i++){
        if(obj[i].result != 0){
            continue
        }
        else{
            document.writeln("<li class=\"notification-message\">")
            document.writeln("<a href=\"#\">")
            document.writeln("<div class=\"media\">")
            document.writeln("<span class=\"avatar avatar-sm\">")
            document.writeln("<img class=\"avatar-img rounded-circle\" alt=\"User Image\" src=\"static/assets/img/user/user13.jpg\">")
            document.writeln("</span>")
            document.writeln("<div class=\"media-body\">")
            document.writeln("<p class=\"noti-details\"><span class=\"noti-title\">"+obj[i].name+"</span> 发布一则<span class=\"noti-title\">"+obj[i].subject+"</span></p>")
            document.writeln("<p class=\"noti-time\"><span class=\"notification-time\">"+obj[i].sendData +"</span></p>")
            document.writeln("</div>")
            document.writeln("</div>")
            document.writeln("</a>")
            document.writeln("</li>")
            count += 1
        }
        if(count>=3){
            break
        }
    }
    document.getElementById("infor_count").innerHTML = count
}