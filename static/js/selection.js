let main_select = document.getElementById('chartSelect')
if ( files != null ) {
    for(let i = 0;i<files.length;i++){
        main_select.options.add(new Option(files[i].filename + '/格式：' + files[i].filetype + '/上传日期：' + files[i].date, files[i].filename))
    }
}else {
    main_select.options.add(new Option('请上传文件','default'))
}
if(current_file != null){
    main_select.value = current_file.filename
}
let select_button = document.getElementById('confirmSelect')

let path_url = window.location.pathname;
select_button.addEventListener("click",function (){
    if(path_url === '/index'){
        window.location.href='INDEX' + '/' + main_select.options[main_select.selectedIndex].value
    }
    if(path_url === '/evaporation'){
        window.location.href='CSV' + '/' + main_select.options[main_select.selectedIndex].value
    }
    if(path_url === '/tem-hum'){
        window.location.href='ASC' + '/' + main_select.options[main_select.selectedIndex].value
    }

})
