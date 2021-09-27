function showtable(){
    var obj = eval(files)
    infor_length = files.length
    for(i=0;i<infor_length;i++){
        document.writeln("<tr>")
        document.writeln("<td id=\"name_"+i+"\">"+obj[i].filename+"</td>")
        document.writeln("<td>#"+obj[i].filetype+"</td>")
        document.writeln("<td id=\"identity_"+i+"\">"+obj[i].date+"</td>")
        document.writeln("<td>")
        document.writeln("<h2 class=\"table-avatar\">")
        document.writeln("<a href=\"profile" + "/" + obj[i].owner + "\"" + " class=\"avatar avatar-sm mr-2\"><img class=\"avatar-img rounded-circle\" src=\"static/assets/img/profiles/" + obj[i].owner +".jpg\" alt=\"User Image\"></a>")
        document.writeln("<a href=\"profile" + "/" + obj[i].owner + "\"" +">"+obj[i].owner+"</a>")
        document.writeln("</h2>")
        document.writeln("</td>")

        document.writeln("<td id=\"time_"+i+"\">"+obj[i].subject+"</td>")
        document.writeln("<td class=\"text-right\">")
        document.writeln("<div class=\"actions\">")
        document.writeln("<a href=\"download/" + obj[i].filename + "\" class=\"btn btn-sm bg-success-light mr-2\">")
        document.writeln("<i class=\"fe fe-pencil\"></i> 下载")
        document.writeln("</a>")
        document.writeln("<a class=\"btn btn-sm bg-danger-light\" data-toggle=\"modal\" onclick=\"del("+i+")\" href=\"#delete_modal\">")
        document.writeln("<i class=\"fe fe-trash\"></i> 删除")
        document.writeln("</a>")
        document.writeln("</div>")
        document.writeln("</td>")
        document.writeln("</tr>")
    }
}

													
													
													
														
															
															
														
													
													
													
													
														
													
													
														
															
															
																
															
															
																
															
														
													
												