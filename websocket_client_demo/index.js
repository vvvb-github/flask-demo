let socket = null

document.querySelector('#connect-btn').onclick = ()=>{
    let url = 'ws://localhost:8085'
    socket = io.connect(url)
    socket.on('connect', ()=>{
        alert('成功连接服务器！')
    })
    socket.on('disconnect', ()=>{
        alert('已断开连接！')
    })
    socket.on('new data', data=>{
        alert('接收到新数据！')
        console.log(data)
    })
    socket.on('connect_error', err=>{
        console.log(err)
    })
}

document.querySelector('#disconnect-btn').onclick = ()=>{
    socket.disconnect()
}
