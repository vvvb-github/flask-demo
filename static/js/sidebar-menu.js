let sidebar = document.getElementById('sidebar-menu')
sidebar.innerHTML = "<ul>\n" +
    "\t\t\t\t\t\t\t<li style=\"background:#9ca8b8\"> \n" +
    "\t\t\t\t\t\t\t\t<a href=\"index\"><span><font color=\"#293c55\">波导数据与廓线数据</font></span></a>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li class=\"submenu\">\n" +
    "\t\t\t\t\t\t\t\t<a href=\"#\"><span><font color=\"#CCCCCC\"> 波导分析计算</font></span> <span class=\"menu-arrow\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t<ul style=\"display: none;\">\n" +
    "\t\t\t\t\t\t\t\t\t<li><a href=\"evaporation\"><font color=\"#CCCCCC\">蒸发波导诊断</font></a></li>\n" +
    "\t\t\t\t\t\t\t\t\t<li><a href=\"futureheight\"><font color=\"#CCCCCC\">未来波导高度预测</font></a></li>\n" +
    "\t\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\n" +
    "\t\t\t\t\t\t\t<li class=\"submenu\"> \n" +
    "\t\t\t\t\t\t\t\t<a href=\"#\"><span><font color=\"#CCCCCC\">电磁损耗计算</font></span> <span class=\"menu-arrow\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t<ul style=\"display: none;\">\n" +
    "\t\t\t\t\t\t\t\t\t<li><a href=\"electromagenetic\"> <font color=\"#CCCCCC\">电磁波传播损耗计算</font> </a></li>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li class=\"submenu\">\n" +
    "\t\t\t\t\t\t\t\t<a href=\"#\"><span><font color=\"#CCCCCC\"> 雷达有效距离探测 </font></span> <span class=\"menu-arrow\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t<ul style=\"display: none;\">\n" +
    "\t\t\t\t\t\t\t\t\t<li><a href=\"radar-valid-distance\"><font color=\"CCCCCC\">雷达有效探测性能</font> </a></li>\n" +
    "\t\t\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t\t<li class=\"submenu\">\n" +
    "\t\t\t\t\t\t\t\t<a href=\"#\"><span><font color=\"#CCCCCC\"> 用户权限管理 </font></span> <span class=\"menu-arrow\"></span></a>\n" +
    "\t\t\t\t\t\t\t\t<ul style=\"display: none;\">\n" +
    "\t\t\t\t\t\t\t\t\t<li><a href=\"profile\"><font color=\"#CCCCCC\"> 个人信息设置 </font></a></li>\n" +
    "\t\t\t\t\t\t\t\t\t<li><a href=\"user-management\"><font color=\"#CCCCCC\"> 用户管理 </font></a></li>\n" +
    "\t\t\t\t\t\t\t\t</ul>\n" +
    "\t\t\t\t\t\t\t\n" +
    "\t\t\t\t\t\t\t</li>\n" +
    "\t\t\t\t\t\t</ul>"