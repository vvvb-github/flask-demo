function del(num){
    console.log(num)
    let name_="name_"+num
    let name_infor = document.getElementById(name_).innerHTML
    document.getElementById("del_infor").innerHTML = "删除文件：" + name_infor + "?"
}

function return_page(){
    
    document.getElementById('searched_content').style.display="none";
    document.getElementById('all_members').style.display=""
}