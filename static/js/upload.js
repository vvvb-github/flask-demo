// function addOne(){
//     document.getElementById("addDiv").innerHTML+=
//     "<div class=\"form-group row\">"+
//     "<label class=\"col-form-label col-md-3\">上传文件</label>"+
//     "<input class=\"form-control col-md-6\" type=\"file\" name=\"fileselect[]\" multiple=\"multiple\">"+
//     "<input type='button' class=\"btn btn-link \"value='取消上传' onclick='delOne(this)' ></div>"
//    }
function delOne(btn){
    var div=btn.parentNode;
    div.parentNode.removeChild(div);
}

document.writeln("<div class=\"modal fade\" id=\"text_upload\" aria-hidden=\"true\" role=\"dialog\">")
document.writeln("<div class=\"modal-dialog\" style=\"max-width: 40%;margin-left: 30%;margin-top: 20%;\" role=\"document\" >")
document.writeln("<div class=\"modal-content\">")
document.writeln("<div class=\"modal-header\">")
document.writeln("<h5 class=\"modal-title\">数据上传</h5>")
document.writeln("<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">")
document.writeln("<span aria-hidden=\"true\">&times;</span>")
document.writeln("</button>")
document.writeln("</div>")
document.writeln("<div class=\"modal-body\">")
document.writeln("<form id=\"upload-form\" method=\"post\" action=\"upload\" enctype=\"multipart/form-data\">")

document.writeln("<div class=\"form-group row\">")
document.writeln("<label class=\"col-form-label col-md-4\">上传数据文件</label>")
document.writeln("<div class=\"col-md-6\">")
document.writeln("<input class=\"form-control\" type=\"file\" id=\"file-data\" name=\"file-data\">" )
document.writeln("</div>")
document.writeln("</div>")


let now = new Date()
let formatDate = now.getFullYear() + "-" + (now.getMonth() + 1).toString().padStart(2, '0')  + "-" + now.getDate() + "-" + now.getHours().toString().padStart(2, '0') + "-" + now.getMinutes().toString().padStart(2, '0') + "-" + now.getSeconds().toString().padStart(2, '0')
document.writeln("<div class=\"form-group row\">")
document.writeln("<label class=\"col-form-label col-md-4\">备注</label>")
document.writeln("<div class=\"col-md-8\">")
document.writeln("<textarea form=\"upload-form\" rows=\"5\" cols=\"5\" id=\"data-subject\" name=\"data-subject\" class=\"form-control\">数据上传于" + formatDate + "</textarea>")
document.writeln("</div>")
document.writeln("</div>")

document.writeln("<div class=\"form-group row\">")
document.writeln("<div class=\"col-md-8\">")	

document.writeln("</div>")
document.writeln("<div class=\"col-md-4\">")
document.writeln("<button type=\"reset\" class=\"btn btn-danger \" >重设</button>")
document.writeln("<button type=\"submit\" class=\"btn btn-primary \" >确定</button>")

document.writeln("</div>")
document.writeln("</div>")
document.writeln("</form>")
document.writeln("</div>")
document.writeln("</div>")
document.writeln("</div>")
document.writeln("</div>")


current_form = document.getElementById('upload-form')
