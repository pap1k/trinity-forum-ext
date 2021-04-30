function addNewStyle(newStyle) {
  var styleElement = document.getElementById("styles_js")
  if (!styleElement) {
    styleElement = document.createElement("style")
    styleElement.type = "text/css"
    styleElement.id = "styles_js"
    document.getElementsByTagName("head")[0].appendChild(styleElement)
  }
  styleElement.appendChild(document.createTextNode(newStyle))
}

var e = document.getElementsByClassName("swiper-container")
if (e[0]) {
  e[0].remove()
  addNewStyle(
    ".v-slider-on #ipsLayout_contentArea {margin-top: 0px !important}"
  )
}
