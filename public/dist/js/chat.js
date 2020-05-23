const socket = io()

const $messages = document.querySelector('#messages')
socket.on('message', (message) => {
    console.log('New Message :' + message.msg)
    console.log('Email :' + message.email)
    console.log('createdAt :' + moment(message.createdAt).format('h:mm a'))
    $('messages').append('<div><h5>' + message.name + '</h5><br><h5>' + message.email + '</h5><br><h5>' + message.msg + '</h5></div>')
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    document.getElementById('sendBtn').setAttribute('disabled', 'disabled')

    const FYPID = document.getElementById('FYPID').value
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const message = document.getElementById('txtMsg').value
    const time = new Date().getTime()
    const createdAt = moment(time).format('h:mm a')


    socket.emit('sendMessage', FYPID, email, name, message, createdAt, () => {
        document.getElementById('sendBtn').removeAttribute('disabled')
        document.getElementById('txtMsg').value = ''
        document.getElementById('txtMsg').focus()
        console.log('sent')
    })

    let sent = '  <li class="media sent">\n' +
        '                                    <div class="media-body">\n' +
        '                                        <div class="msg-box">\n' +
        '                                            <div>\n' +
        '                                                <p>' + message + '</p>\n' +
        '                                                <span class="chat-time">' + createdAt + '</span>\n' +
        '                                                <div class="arrow-triangle-wrap">\n' +
        '                                                    <div class="arrow-triangle left"></div>\n' +
        '                                                </div>\n' +
        '                                            </div>\n' +
        '                                        </div>\n' +
        '                                    </div>\n' +
        '                                </li>';
    $("#messages").append(sent);
})