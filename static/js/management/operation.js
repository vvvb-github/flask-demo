function edit(num){
    var obj = eval(Infor_User)
    console.log(num)
    name_="name_"+num
    number_="num_"+num
    identity_="identity_"+num
    time_="time_"+num
    console.log(name_)		
    document.getElementById("Name").value=document.getElementById(name_).innerHTML
    document.getElementById("Number").value=document.getElementById(number_).innerHTML
    document.getElementById("Time").value=document.getElementById(time_).innerHTML
    console.log(document.getElementById(identity_).innerHTML)
    console.log(document.getElementById("Identity").innerHTML)
    document.getElementById("Identity").innerHTML=document.getElementById(identity_).innerHTML
    document.getElementById("Identity").selected = true
    document.getElementById("userpasswd").value = obj[num].password
    document.getElementById("confirmpasswd").value = obj[num].password
    
}
function sedit(num){
    obj = eval(Infor_Search)
    console.log(num)
    name_="sname_"+num
    number_="snum_"+num
    identity_="sidentity_"+num
    time_="stime_"+num
    console.log(name_)		
    document.getElementById("Name").value=document.getElementById(name_).innerHTML
    console.log(document.getElementById(number_).innerHTML)
    document.getElementById("Number").value=document.getElementById(number_).innerHTML
    console.log(document.getElementById(time_).innerHTML)
    document.getElementById("Time").value=document.getElementById(time_).innerHTML
    console.log(document.getElementById(identity_).innerHTML)
    document.getElementById("Identity").innerHTML=document.getElementById(identity_).innerHTML
    document.getElementById("userpasswd").value = obj[num].password
    document.getElementById("confirmpasswd").value = obj[num].password
}
function search_member(){
    obj = eval(Infor_Search)
    member_number = document.getElementById("members").value
    document.getElementById("searched_head").innerHTML="“"+member_number+"”"
    console.log(1)
    snumber = '#000001'
    sname = '汪宇晖'
    sidentity = '管理员'
    stime='2019年1月12日'
    i=1
    state='在线'
    if(state=="在线"){
        state_bg = "bg-success"
    }
    else{
        state_bg = "bg-outline"
    }
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
function search_name(){
    member_name = document.getElementById("names").value
    console.log(member_name)
}
function search_section(){
    member_section = document.getElementById("sections").value
    console.log(member_section)
}
function return_page(){
    
    document.getElementById('searched_content').style.display="none";
    document.getElementById('all_members').style.display=""
}