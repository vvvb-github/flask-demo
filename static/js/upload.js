function addOne(){
    document.getElementById("addDiv").innerHTML+=
    "<div class=\"form-group row\">"+
    "<label class=\"col-form-label col-md-3\">上传文件</label>"+
    "<input class=\"form-control col-md-6\" type=\"file\" name=\"fileselect[]\" multiple=\"multiple\">"+
    "<input type='button' class=\"btn btn-link \"value='取消上传' onclick='delOne(this)' ></div>"
   }
function delOne(btn){
    var div=btn.parentNode;
    div.parentNode.removeChild(div);
}


document.writeln("<div class=\"modal fade\" id=\"text_upload\" aria-hidden=\"true\" role=\"dialog\">")
document.writeln("<div class=\"modal-dialog\" style=\"max-width: 40%;margin-left: 30%;margin-top: 20%;\" role=\"document\" >")
document.writeln("<div class=\"modal-content\">")
document.writeln("<div class=\"modal-header\">")
document.writeln("<h5 class=\"modal-title\">文件上传</h5>")
document.writeln("<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">")
document.writeln("<span aria-hidden=\"true\">&times;</span>")
document.writeln("</button>")
document.writeln("</div>")
document.writeln("<div class=\"modal-body\">")
document.writeln("<form>")

document.writeln("<div class=\"form-group row\">")
document.writeln("<label class=\"col-form-label col-md-4\">上传文件（同时可多个）</label>")
document.writeln("<div class=\"col-md-6\">")
document.writeln("<input class=\"form-control\" type=\"file\" name=\"fileselect[]\" multiple=\"multiple\">" )
document.writeln("</div>")
document.writeln("</div>")


document.writeln("<div class=\"form-group row\">")
document.writeln("<div class=\"col-md-12\">")
document.writeln(" <input class=\"btn btn-warning \" type=\"button\" value=\"继续添加\" onclick=\"addOne()\">")	
document.writeln(" <label class=\"col-form-label \">（提示：可多次添加）</label>")	
document.writeln("<form action=\"${pageContext.request.contextPath}/servlet/UploadServlet\" method=\"post\" enctype=\"multipart/form-data\" >")
document.writeln("<div id=\"addDiv\">")
document.writeln("</div>")
document.writeln("</form>")

document.writeln("<div class=\"form-group row\">")
document.writeln("<label class=\"col-form-label col-md-4\">文件名称</label>")
document.writeln("<div class=\"col-md-8\">")
document.writeln("<input type=\"text\" class=\"form-control\" placeholder=\"需重新命名文件名则填写\">")
document.writeln("</div>")
document.writeln("</div>")



document.writeln("<div class=\"form-group row\">")
document.writeln("<label class=\"col-form-label col-md-4\">备注</label>")
document.writeln("<div class=\"col-md-8\">")
document.writeln("<textarea rows=\"5\" cols=\"5\" class=\"form-control\" placeholder=\"请输入...\"></textarea>")
document.writeln("</div>")
document.writeln("</div>")

document.writeln("<div class=\"form-group row\">")
document.writeln("<div class=\"col-md-8\">")	

document.writeln("</div>")
document.writeln("<div class=\"col-md-4\">")
document.writeln("<button type=\"reset\" class=\"btn btn-danger \" >重置</button>")
document.writeln("<button type=\"submit\" class=\"btn btn-primary \" >确定</button>")

document.writeln("</div>")
document.writeln("</div>")


document.writeln("</form>")
document.writeln("</div>")
document.writeln("</div>")
document.writeln("</div>")
document.writeln("</div>")