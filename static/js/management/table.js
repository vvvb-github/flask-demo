
function showtable(){
    var obj = eval(Infor_User)
    infor_length = Infor.length
    for(i=0;i<infor_length;i++){
        identity = obj[i].permission
        state = obj[i].status
        document.writeln("<tr>")
        document.writeln("<td><a href=\"invoice.html\" id=\"num_"+i+"\">"+obj[i].account+"</a></td>")
        document.writeln("<td>#"+i+"</td>")
        document.writeln("<td>")
        document.writeln("<h2 class=\"table-avatar\">")
        document.writeln("<a href=\"profile.html\" class=\"avatar avatar-sm mr-2\"><img class=\"avatar-img rounded-circle\" src=\"static/assets/img/user/user0.jpg\" alt=\"User Image\"></a>")
        document.writeln("<a id=\"name_"+i+"\" href=\"profile.html\">"+obj[i].name+"</a>")
        document.writeln("</h2>")
        document.writeln("</td>")
        if(identity == 2)
            document.writeln("<td id=\"identity_"+i+"\">超级管理员</td>")
        else if(identity == 1)
            document.writeln("<td id=\"identity_"+i+"\">"+obj[i].department+"门管理员</td>")
        else
        document.writeln("<td id=\"identity_"+i+"\">值班用户</td>")
        document.writeln("<td id=\"time_"+i+"\">"+obj[i].date+"</td>")
        document.writeln("<td class=\"text-center\">")
        if(state == 1)
            document.writeln("<span class=\"badge badge-pill bg-success inv-badge\">在线</span>")
        else
            document.writeln("<span class=\"badge badge-pill bg-outline inv-badge\">离线</span>")
            document.writeln("</td>")
        document.writeln("<td class=\"text-right\">")
        document.writeln("<div class=\"actions\">")
        document.writeln("<a href=\"#edit_invoice_report\" data-toggle=\"modal\" onclick=\"edit("+i+")\" class=\"btn btn-sm bg-success-light mr-2\">")
        document.writeln("<i class=\"fe fe-pencil\"></i> 编辑")
        document.writeln("</a>")
        document.writeln("<a class=\"btn btn-sm bg-danger-light\" data-toggle=\"modal\" href=\"#delete_modal\">")
        document.writeln("<i class=\"fe fe-trash\"></i> 删除")
        document.writeln("</a>")
        document.writeln("</div>")
        document.writeln("</td>")
        document.writeln("</tr>")
    }
}

													
													
													
														
															
															
														
													
													
													
													
														
													
													
														
															
															
																
															
															
																
															
														
													
												