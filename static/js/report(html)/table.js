function showtable(){
    var obj = eval(Infor)
    infor_length = Infor.length
    for(i=0;i<infor_length;i++){
        document.writeln("<tr>")
        document.writeln("<td><a id='num_"+i+"' href=\"invoice.html\">"+obj[i].KeyID+"</a></td>")
        document.writeln("<td id=\"time_"+i+"\">"+obj[i].sendData+"</td>")
        document.writeln("<td>")
        document.writeln("<h2 class=\"table-avatar\">")
        document.writeln("<a href=\"profile.html\" class=\"avatar avatar-sm mr-2\"><img class=\"avatar-img rounded-circle\" src=\"static/assets/img/user/歼灭.jpg\" alt=\"User Image\"></a>")
        document.writeln("<a id='name_"+i+"' href=\"profile.html\">"+obj[i].name+"</a>")
        document.writeln("</h>")
        document.writeln("</td>")
        document.writeln("<td id=\"topic_"+i+"\">"+obj[i].subject+"</td>")
        document.writeln("<td class=\"text-center\">")
        sign = obj[i].result
        if(sign == 0){
            document.writeln("<span id=\"state_"+i+"\" class=\"badge badge-pill bg-warning inv-badge\">未审核</span>")
        }
        else if(sign == 1){
            document.writeln("<span id=\"state_"+i+"\" class=\"badge badge-pill bg-success inv-badge\">已通过</span>")
        }
        else{
            document.writeln("<span id=\"state_"+i+"\" class=\"badge badge-pill bg-danger inv-badge\">已驳回</span>")
        }
        document.writeln("</td>")
        document.writeln("<td class=\"text-right\">")
        document.writeln("<div class=\"actions\">")
        document.writeln("<a data-toggle=\"modal\" onclick=\"detail("+i+")\" class=\"btn btn-sm bg-success-light mr-2\">")
        document.writeln("<i class=\"fe fe-pencil\">详情</i>")
        document.writeln("</a>")
        document.writeln("<a class=\"btn btn-sm bg-danger-light\" onclick=\"del("+i+")\" data-toggle=\"modal\" href=\"#delete_modal\">")
        document.writeln("<i class=\"fe fe-trash\">删除</i>")
        document.writeln("</a>")
        document.writeln("</div>")
        document.writeln("</td>")
        document.writeln("</tr>")
    }
}