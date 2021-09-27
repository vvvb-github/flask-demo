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
select_button.addEventListener("click",function (){
    window.location.href=main_select.options[main_select.selectedIndex].value
})
