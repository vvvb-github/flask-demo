let socket = null

document.querySelector('#connect-btn').onclick = ()=>{
    let url = 'ws://localhost:5000'
    socket = io.connect(url);
    socket.emit('event1',{myData:'114514'});

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
    socket.on('event1',data=>{
        alert('my event1')
        console.log(data)
    })
    socket.on('connect_error', err=>{
        console.log(err)
    })
}

document.querySelector('#disconnect-btn').onclick = ()=>{
    socket.disconnect()
}
