document.writeln("<div class=\"modal fade\" id=\"loadingPage\" aria-hidden=\"true\" role=\"dialog\">")
    document.writeln("<div class=\"modal-dialog\" style=\"max-width: 40%;margin-left: 30%;margin-top: 20%; text-align: center;\" role=\"document\" >")
            document.writeln("<style>\n" +
                ".loader {\n" +
                "  position: absolute;\n" +
                "  left: 40%;\n" +
                "  border: 16px solid #f3f3f3;\n" +
                "  border-radius: 50%;\n" +
                "  border-top: 16px solid #3498db;\n" +
                "  width: 160px;\n" +
                "  height: 160px;\n" +
                "  -webkit-animation: spin 2s linear infinite; /* Safari */\n" +
                "  animation: spin 2s linear infinite;\n" +
                "}\n" +
                "\n" +
                "/* Safari */\n" +
                "@-webkit-keyframes spin {\n" +
                "  0% { -webkit-transform: rotate(0deg); }\n" +
                "  100% { -webkit-transform: rotate(360deg); }\n" +
                "}\n" +
                "\n" +
                "@keyframes spin {\n" +
                "  0% { transform: rotate(0deg); }\n" +
                "  100% { transform: rotate(360deg); }\n" +
                "}\n" +
                "</style>")
            document.writeln("<h1 style=\"color: white;\" class=\"modal-title\">此页面加载较慢，请稍等</h1>")
            document.writeln("<p>")
            document.writeln("<p>")
            document.writeln("<div class=\"loader\"></div>")
    document.writeln("</div>")
document.writeln("</div>")




function pageLoading(){
    window.location.href="evaporation"
}