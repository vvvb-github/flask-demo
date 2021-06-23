let state_info = null
let state_info_count = 0

function flashNotify() {
    let obj = eval(state_info)
    let notify_message = ""
    for (let i = 0; i < state_info_count; i++) {
        let writeString = "<li class=\"notification-message\">"
        writeString += "<a href=\"#\">"
        writeString += "<div class=\"media\">"
        writeString += "<span class=\"avatar avatar-sm\">"
        writeString += "<img class=\"avatar-img rounded-circle\" alt=\"User Image\" src=\"static/assets/img/profiles/" + obj[i].senderID + ".jpg\">"
        writeString += "</span>"
        writeString += "<div class=\"media-body\">"
        writeString += "<p class=\"noti-details\"><span class=\"noti-title\">" + obj[i].senderID + "</span> 发布一则<span class=\"noti-title\">" + obj[i].subject + "</span></p>"
        writeString += "<p class=\"noti-time\"><span class=\"notification-time\">" + obj[i].sendDate + "</span></p>"
        writeString += "</div>"
        writeString += "</div>"
        writeString += "</a>"
        writeString += "</li>"
        notify_message += writeString
    }
    document.getElementsByClassName("notification-list")[0].innerHTML = notify_message
}
