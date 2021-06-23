let socket = null
let url = "ws://" + document.domain + ":" + location.port


socket = io.connect(url)
socket.on('connect', function() {
    socket.emit('state')
})

socket.on('send_state', info_data=>{
    console.log(info_data)
    state_info = info_data
    state_info_count = info_data.length
    flashNotify()
})


