function radar_infor(){
    let RF = document.getElementById("radar-fre").value;
    let RT = document.getElementById("radar-top").value;
    let AH = document.getElementById("antenna-high").value;
    let AG = document.getElementById("antenna-gain").value;
    let BW = document.getElementById("beam-width").value;
    let LE = document.getElementById("launch-ele").value;
    let MN = document.getElementById("min-noise").value;
    let RW = document.getElementById("rec-width").value;
    let SL = document.getElementById("sys-loss").value;
    let NC = document.getElementById("noise-coe").value;
    let TH = document.getElementById("target-high").value;
    let RR = document.getElementById("rcs-radar").value;
    let R_I = "请确认以下输入信息：\n雷达频率："+RF+"   雷达峰值频率："+RT+
    "\n天线高度："+AH+"   天线增益："+AG+"\n波束宽度："+BW+"   发射仰角："+LE+
    "\n最小信噪比："+MN+"   接收机带宽："+RW+"\n系统综合损耗："+SL+"   接收机噪声系数："+
    NC+"\n目标高度："+TH+"   目标散射界面"+RR
    return confirm(R_I)
}