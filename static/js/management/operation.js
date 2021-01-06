function edit(num){
    form = document.getElementById("EorA")
    form.action = "user/edit"

    var obj = eval(Infor_User)
    console.log(num)
    name_="name_"+num
    number_="num_"+num
    identity_="identity_"+num
    time_="time_"+num
    console.log(name_)
    document.getElementById("infor-title").innerHTML = "用户信息编辑"
    document.getElementById("infor-title").style = "color:#1e88e5"
    document.getElementById("Name").value=document.getElementById(name_).innerHTML
    document.getElementById("Number").value=document.getElementById(number_).innerHTML
    document.getElementById("Time").value=document.getElementById(time_).innerHTML
    console.log(document.getElementById(identity_).innerHTML)
    console.log(document.getElementById("Identity")[0])

    document.getElementById("Identity")[0].value=document.getElementById(identity_).innerHTML
    document.getElementById("Identity").selected = true
    document.getElementById("userpasswd").value = obj[num].password
    document.getElementById("confirmpasswd").value = obj[num].password
    document.getElementById("Number").readOnly = true
    document.getElementById("Save").style = "background:#1e88e5; border: 1px solid #1e88e5"
}
function add_user(){
    form = document.getElementById("EorA")
    form.action = "user/add"

    console.log('add user')
    today = new Date()
    Year = today.getYear() + 1900
    Month = today.getMonth()+1
    Day = today.getDate()
    Hour = today.getHours()
    Min = today.getMinutes()
    Time = Year + "-" + Month + "-" + Day + " "+ Hour + ":" + Min
    document.getElementById("infor-title").innerHTML = "新增用户信息"
    document.getElementById("infor-title").style = "color:#43CD80"
    document.getElementById("Time").value = Time
    document.getElementById("Number").readOnly = false
    document.getElementById("Save").style = "background:#43CD80; border: 1px solid #43CD80"
}
function sedit(num){
    form = document.getElementById("EorA")
    form.action = "user/edit"

    obj = eval(Infor_Search)
    console.log(num)
    name_="sname_"+num
    number_="snum_"+num
    identity_="sidentity_"+num
    time_="stime_"+num
    console.log(name_)
    document.getElementById("infor-title").innerHTML = "用户信息编辑"
    document.getElementById("infor-title").style = "color:#1e88e5"
    document.getElementById("Name").value=document.getElementById(name_).innerHTML
    console.log(document.getElementById(number_).innerHTML)
    document.getElementById("Number").value=document.getElementById(number_).innerHTML
    console.log(document.getElementById(time_).innerHTML)
    document.getElementById("Time").value=document.getElementById(time_).innerHTML
//    console.log(document.getElementById(identity_).innerHTML)
    document.getElementById("Identity")[0].innerHTML=document.getElementById(identity_).innerHTML
    document.getElementById("userpasswd").value = obj[num].password
    document.getElementById("confirmpasswd").value = obj[num].password
    document.getElementById("Number").readOnly = true
    document.getElementById("Save").style = "background:#1e88e5; border: 1px solid #1e88e5"
}
function search_member(){
    member_number = document.getElementById("members").value
    Infor_Search = []
    for(var i = 0;i<Infor_User.length;i++){
        if(Infor_User[i].account.search(member_number) !== -1){
            Infor_Search.push(Infor_User[i])
        }
    }
    obj = eval(Infor_Search)
    document.getElementById("searched_head").innerHTML="“"+member_number+"”"
    $("#searched").empty()
    lens = obj.length
    //查询结果这里加循环即可
    for(i=0;i<lens;i++)
    {
        if(obj[i].permission == 0)
            sidentity = "值班用户"
        else if(obj[i].permission == 1)
            sidentity = obj[i].department +"门管理员"
        else
            sidentity = "超级管理员"
        if(obj[i].status == 0){
            state_bg = "bg-outline"
            states = "离线"
        }
        else{
            state_bg = "bg-success"
            states = "在线"
        }
        var searched_content ='<tr>'+'<td><a href="invoice.html" id="snum_'+i+'">'+ obj[i].account + '</a></td>'+'<td>'+'#'+i+'</td>'+
        '<td><h2 class="table-avatar"><a href="profile.html" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="static/assets/img/user/user0.jpg" alt="User Image"></a><a id="sname_'+i+'" href="profile.html">'+obj[i].name+
        '</a></h2></td><td id="sidentity_' +i+'">'+sidentity+'</td><td id="stime_'+i+'">'+obj[i].date+'</td><td class="text-center"><span class="badge '+state_bg+ ' badge-pill inv-badge">'+states+'</span></td><td class="text-right"><div class="actions">'+
        '<a href="#edit_invoice_report" data-toggle="modal" onclick="sedit('+i+')" class="btn btn-sm bg-success-light mr-2"><i class="fe fe-pencil"></i> 编辑</a><a class="btn btn-sm bg-danger-light" data-toggle="modal" href="#delete_modal" onclick="del('+i+')">' +
        '<i class="fe fe-trash"></i> 删除</a></div></td></tr>'
        $("#searched").append(searched_content)
    }
    document.getElementById('searched_content').style.display="";
    document.getElementById('all_members').style.display="none"
}
function del(num){
    console.log('del')
    name_="name_"+num
    number_="num_"+num
    identity_="identity_"+num
    time_="time_"+num
    name_infor = document.getElementById(name_).innerHTML
    number_infor = document.getElementById(number_).innerHTML
    document.getElementById("del_infor").innerHTML = "删除：" + name_infor + "," + number_infor + "?"
}
function search_name(){
    member_name = document.getElementById("names").value
    console.log(member_name)
    Infor_Search = []
    for(var i = 0;i<Infor_User.length;i++){
        if(Infor_User[i].name.search(member_name) !== -1){
            Infor_Search.push(Infor_User[i])
        }
    }
    obj = eval(Infor_Search)
    document.getElementById("searched_head").innerHTML="“"+member_name+"”"
    $("#searched").empty()
    lens = obj.length
    //查询结果这里加循环即可
    for(i=0;i<lens;i++)
    {
        if(obj[i].authorityLevel == 0)
            sidentity = "值班用户"
        else if(obj[i].authorityLevel == 1)
            sidentity = obj[i].department +"门管理员"
        else
            sidentity = "超级管理员"
        if(obj[i].status == 0){
            state_bg = "bg-outline"
            states = "离线"
        }
        else{
            state_bg = "bg-success"
            states = "在线"
        }
        var searched_content ='<tr>'+'<td><a href="invoice.html" id="snum_'+i+'">'+ obj[i].account + '</a></td>'+'<td>'+'#'+i+'</td>'+
        '<td><h2 class="table-avatar"><a href="profile.html" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="static/assets/img/user/user0.jpg" alt="User Image"></a><a id="sname_'+i+'" href="profile.html">'+obj[i].name+
        '</a></h2></td><td id="sidentity_1">'+sidentity+'</td><td id="stime_'+i+'">'+obj[i].date+'</td><td class="text-center"><span class="badge '+state_bg+ ' badge-pill inv-badge">'+states+'</span></td><td class="text-right"><div class="actions">'+
        '<a href="#edit_invoice_report" data-toggle="modal" onclick="sedit('+i+')" class="btn btn-sm bg-success-light mr-2"><i class="fe fe-pencil"></i> 编辑</a><a class="btn btn-sm bg-danger-light" data-toggle="modal" href="#delete_modal" onclick="del('+i+')">'+
        '<i class="fe fe-trash"></i> 删除</a></div></td></tr>'
        $("#searched").append(searched_content)
    }
    document.getElementById('searched_content').style.display="";
    document.getElementById('all_members').style.display="none"
}
function search_section(){
    member_section = document.getElementById("sections").value
    console.log(member_section)
    Infor_Search = []
    for(var i = 0;i<Infor_User.length;i++){
        if(Infor_User[i].department.search(member_section) !== -1){
            Infor_Search.push(Infor_User[i])
        }
    }
    obj = eval(Infor_Search)
    document.getElementById("searched_head").innerHTML="“"+member_section+"”"
    $("#searched").empty()
    lens = obj.length
    //查询结果这里加循环即可
    for(i=0;i<lens;i++)
    {
        if(obj[i].permission == 0)
            sidentity = "值班用户"
        else if(obj[i].permission == 1)
            sidentity = obj[i].department +"门管理员"
        else
            sidentity = "超级管理员"
        if(obj[i].status == 0)
            state_bg = "bg-outline"
        else
            state_bg = "bg-success"
        var searched_content ='<tr>'+'<td><a href="invoice.html" id="snum_'+i+'">'+ obj[i].account + '</a></td>'+'<td>'+'#'+i+'</td>'+
        '<td><h2 class="table-avatar"><a href="profile.html" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="static/assets/img/user/user0.jpg" alt="User Image"></a><a id="sname_'+i+'" href="profile.html">'+obj[i].name+
        '</a></h2></td><td id="sidentity_1">'+sidentity+'</td><td id="stime_'+i+'">'+obj[i].date+'</td><td class="text-center"><span class="badge '+state_bg+ ' badge-pill inv-badge">'+obj[i].status+'</span></td><td class="text-right"><div class="actions">'+
        '<a href="#edit_invoice_report" data-toggle="modal" onclick="sedit('+i+')" class="btn btn-sm bg-success-light mr-2"><i class="fe fe-pencil"></i> 编辑</a><a class="btn btn-sm bg-danger-light" data-toggle="modal" href="#delete_modal">'+
        '<i class="fe fe-trash"></i> 删除</a></div></td></tr>'
        $("#searched").append(searched_content)
    }
    document.getElementById('searched_content').style.display="";
    document.getElementById('all_members').style.display="none"
}
function return_page(){
    
    document.getElementById('searched_content').style.display="none";
    document.getElementById('all_members').style.display=""
}