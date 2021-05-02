function magic(url) {
  const actions_ignore = ["разбанил", "снял", "освобожден", "комментарий"]

  let loaded = false
  let bans = []

  const xhr = new XMLHttpRequest()
  xhr.open("GET", url, true)
  xhr.send(null)
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return
    bans = xhr.responseText.split("<br>")
    bans = bans.filter(
      (str) =>
        str != "" &&
        str[0] == "[" &&
        actions_ignore.every((v) => str.indexOf(v) == -1)
    )
    loaded = true
    console.log("loaded")
    console.log(
      "Данные загружены. Количество строк: ",
      bans.length,
      "Размер в памяти:",
      roughSizeOfObject(bans)
    )
  }

  function addButton(target, text, handler, fuck) {
    var btn = document.createElement("SPAN")
    btn.style.cssText =
      "cursor: pointer; background: #ddd; margin-left: 5px; padding: " +
      (fuck ? 5 : 1) +
      "px; color: #222"
    btn.innerHTML = text
    btn.onmousedown = handler
    target.appendChild(btn)
    return btn
  }

  function addButtonA(target, text, handler, fuck) {
    var btn = document.createElement("U")
    btn.style.cssText = "cursor: pointer; color: #ddd; margin-left: 5px;"
    btn.innerHTML = text
    btn.onmousedown = function () {
      handler()
    }
    target.appendChild(btn)
    target.appendChild(document.createElement("BR"))
  }

  const MainBox = document.createElement("DIV")
  document.body.insertBefore(MainBox, document.body.firstChild)
  MainBox.style.cssText = "font-family: Century Gothic; padding: 10px"

  const Header = document.createElement("DIV")
  MainBox.appendChild(Header)

  const nickInput = document.createElement("INPUT")
  Header.appendChild(nickInput)
  nickInput.style.cssText =
    "padding: 5px; font-family: Century Gothic; background: #ddd; color: #222; border: 0; width: 150px"
  nickInput.value = ""
  nickInput.setAttribute("placeholder", "Введите ник...")

  var activeBtn = null
  var prevActive = null

  function switchActiveBtn(btn) {
    prevActive = activeBtn
    if (prevActive) prevActive.style.backgroundColor = "#ddd"
    activeBtn = btn
    btn.style.backgroundColor = "#0a0"
  }

  const chckst = addButton(
    Header,
    "Просмотр статистики",
    function () {
      if (!loaded) return alert("Дождитесь загрузки данных.")
      switchActiveBtn(this)
      showStats(nickInput.value)
    },
    1
  )

  addButton(
    Header,
    "Общая статистика",
    function () {
      if (!loaded) return alert("Дождитесь загрузки данных.")
      switchActiveBtn(this)
      showAllStats()
    },
    1
  )

  addButton(
    Header,
    "Статистика по месяцам",
    function () {
      if (!loaded) return alert("Дождитесь загрузки данных.")
      switchActiveBtn(this)
      showMonthStats()
    },
    1
  )

  const Body = document.createElement("DIV")
  MainBox.appendChild(Body)
  Body.style = "margin-top: 20px"

  const section1 = document.createElement("DIV")
  Body.appendChild(section1)
  section1.style =
    "border: 1px solid #ddd; height: 500px; overflow-y: scroll; width: 640px; float:left; padding: 5px;"

  const splitter = document.createElement("DIV")
  Body.appendChild(splitter)
  splitter.style =
    "background: #ddd; height: 500px; width: 5px; float:left; margin-left: 5px; margin-right: 5px"

  const section2 = document.createElement("DIV")
  Body.appendChild(section2)
  section2.style =
    "border: 1px solid #ddd; height: 500px; overflow-y: scroll; width: 640px; font-size: 10px; padding: 5px"

  function setpos() {
    const W = window.innerWidth,
      H = window.innerHeight
    section1.style.width = W * 0.45 + "px"
    section2.style.width = W * 0.45 + "px"
    section1.style.height = H * 0.8 + "px"
    section2.style.height = H * 0.8 + "px"
    splitter.style.height = H * 0.8 + "px"
  }

  window.onresize = setpos
  setpos()

  splitter.onmousedown = function (e) {
    const initW1 = section1.clientWidth
    const initW2 = section2.clientWidth
    document.onmousemove = function (ev) {
      const movedBy = ev.pageX - e.pageX
      section1.style.width = initW1 + movedBy + "px"
      section2.style.width = initW2 - movedBy + "px"
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onselectstart = null
      section2.style.width =
        window.innerWidth * 0.9 - 15 - section1.clientWidth + "px"
    }
    document.onselectstart = function () {
      return false
    }
  }

  function count(a) {
    return bans.filter((ban) => {
      return ban.includes(a)
    }).length
  }

  function html(id, text) {
    document.getElementById(id).innerHTML += text + "<br>"
  }

  function showStats(nick) {
    nick = nick.toLowerCase()
    if (nick == "") return alert("Введите ник.")

    section1.innerHTML = section2.innerHTML = ""

    let jail = count(nick + " в админ"),
      warn = count("предупреждение от администратора " + nick),
      rpw = count(nick + " вы"),
      ban = count(nick + ", причина: ["),
      total = jail + warn + rpw + ban

    section1.innerHTML =
      "Статистика работы администратора " +
      nick +
      ":<br /><br />" +
      "<div id='col1' style='float: left; width: 150px'></div><div id='col2' style='float: left; width: 50px'></div><div id='col3'></div>"

    html("col1", "Всего наказаний:")
    html("col2", total)
    html("col1", "Джейлов выдано:")
    html("col2", jail)
    html("col1", "Варнов выдано:")
    html("col2", warn)
    html("col1", "РПВ выдано:")
    html("col2", rpw)
    html("col1", "Банов выдано:")
    html("col2", ban)

    //addButton()

    addButtonA(
      document.getElementById("col3"),
      "Просмотреть полный список",
      function () {
        let output = ""
        bans.map((ban) => {
          if (ban.includes(nickInput.value)) output += ban + "<br>"
        })
        section2.innerHTML = output
      }
    )

    addButtonA(document.getElementById("col3"), "Подробнее...", function () {
      let output = ""
      const tokens = [
        "15 минут за нонРП нападение",
        "20 минут за нонРП убийство",
        "10 минут за нонРП описание",
        "15 минут за злоупотребление чатами",
        "30 минут за помеху при захвате",
        "1 час за ДМ",
        "20 минут за нонРП церковь",
        "5 минут за нонРП вождение",
        "10 минут за нонРП провокацию ПО",
        "5 минут за помеху RP",
        "5 минут за помеху в работе",
        "```",
        "30 минут за ДБ",
      ]
      for (let i = 0; i < tokens.length; i++)
        output += `Код ${i} ( ${tokens[i].split("за ")[1]}): ${
          bans.filter((ban) => {
            return ban.includes(
              nickInput.value + " в админ тюрьму на " + tokens[i]
            )
          }).length
        } <u style='cursor: pointer' onmousedown='lookJails(\"${
          tokens[i]
        }\")'>Просмотреть</u><br />`

      section2.innerHTML = output
    })

    addButtonA(document.getElementById("col3"), "Просмотр", function () {
      let output = ""
      bans.map((ban) => {
        if (ban.includes("предупреждение от администратора " + nickInput.value))
          output += ban + "<br>"
      })
      section2.innerHTML = output
    })
    addButtonA(
      document.getElementById("col3"),
      "<span style='text-decoration: line-through'>Просмотр</span>",
      function () {
        return
        var output = ""
        var lines = bans_split
        for (var i = 0; i < lines.length; i++)
          if (lines[i].indexOf("� " + nickInput.value) != -1)
            output += lines[i] + "<br>"
        section2.innerHTML = output
      }
    )

    addButtonA(document.getElementById("col3"), "Подробнее...", function () {
      let output = ""
      const tokens = ["HR", "HC", "R", "C"]
      for (var i = 0; i < tokens.length; i++)
        output +=
          "Категория " +
          tokens[i] +
          ": " +
          bans.filter((ban) => {
            return ban.includes(nickInput.value + ", причина: [" + tokens[i])
          }).length +
          " <u style='cursor: pointer' onmousedown='lookBans(\"" +
          tokens[i] +
          "\")'>Просмотреть</u><br />"
      section2.innerHTML = output
    })

    const activeDay = document.createElement("DIV")
    section1.appendChild(activeDay)
    activeDay.style = "margin-top: 10px"

    let days = {}
    bans.map((ban) => {
      let cday = ban.match(/(\d\d:\d\d:\d\d\d\d)/)
      if (!cday) return
      cday = cday[1]
      if (!days[cday]) days[cday] = 0
      if (ban.includes(nickInput.value)) days[cday]++
    })
    let max = -1,
      maxday = ""
    for (var i in days) if (days[i] > max) (max = days[i]), (maxday = i)

    activeDay.innerHTML =
      "Самый активный день: " + maxday + " (было выдано " + max + " наказаний)"

    addButtonA(activeDay, "Просмотреть", function () {
      var output = ""
      bans.map((ban) => {
        if (ban.includes(maxday) && ban.includes(nickInput.value))
          output += ban + "<br>"
      })
      section2.innerHTML = output
    })

    var ca1 = document.createElement("DIV")
    ca1.innerHTML = "<br>ГРАФИК АКТИВНОСТИ ПО МЕСЯЦАМ:"

    var grid = document.createElement("DIV")
    section1.appendChild(grid)
    section1.insertBefore(ca1, grid)

    var months = " Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(
      " "
    )
    var year = new Date().getFullYear()
    var month = new Date().getMonth() + 1

    function conv(month, year) {
      if (month < 10) month = "0" + month
      return month + ":" + year
    }

    var ccs = []

    for (var i = 0; i < 12; i++) {
      var m_wrap = document.createElement("DIV") // 1
      m_wrap.style.cssText = "width:10px; margin-left: 1px; float: left"
      grid.appendChild(m_wrap)
      m_wrap.onmouseover = function () {
        this.style.border = "1px solid #ddd"
      }
      m_wrap.onmouseout = function () {
        this.style.border = "none"
      }

      var m = document.createElement("DIV")
      ccs.push(m)
      m.idx = conv(month, year)
      m.sdata = {
        month: month,
        year: year,
      }
      m_wrap.appendChild(m)
      var ht = 0
      m.style =
        "width: 10px; background: #ddd; height: " +
        ht +
        "px; " +
        (i != 100 ? "float: left;" : "") +
        " margin-top: " +
        (100 - ht) +
        "px"
      m_wrap.onmousedown = function () {
        let output = ""
        bans.map((ban) => {
          if (
            ban.includes(this.firstChild.idx) &&
            ban.includes(nickInput.value)
          )
            output += ban + "<br>"
        })
        section2.innerHTML =
          output ||
          "За этот месяц данным администратором не было выдано ни одного наказания."
      }
      if (month == 1) (month = 12), year--
      else month--
    }
    var byMonths = {}
    bans.map((ban) => {
      if (ban.includes(nickInput.value)) {
        const mt = ban.match(/(\d\d:\d\d\d\d)/)[1]
        if (byMonths[mt]) byMonths[mt]++
        else byMonths[mt] = 1
      }
    })

    var ms = " Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(
      " "
    )
    var atYear = new Date().getFullYear()
    var atMonth = new Date().getMonth() + 1

    var max_p = 0,
      y_p = new Date().getFullYear(),
      m_p = new Date().getMonth() + 1
    for (var i = 0; i < 12; i++) {
      if (byMonths[fi(m_p) + ":" + y_p] > max_p)
        max_p = byMonths[fi(m_p) + ":" + y_p]
      if (m_p == 1) (m_p = 12), y_p--
      else m_p--
    }

    for (var i = 0; i < 12; i++) {
      var tm = grid.childNodes[i]
      var cntm = byMonths[fi(atMonth) + ":" + atYear]
      tm.firstChild.style.height = Math.round((cntm / max_p) * 50) + "px"
      tm.firstChild.style.marginTop =
        100 - Math.round((cntm / max_p) * 50) + "px"
      if (atMonth == 1) (atMonth = 12), atYear--
      else atMonth--
    }

    var hint = document.createElement("DIV")
    hint.id = "admstats-hint"
    section1.appendChild(hint)
    var rect = ccs[ccs.length - 1].parentNode.getBoundingClientRect()
    hint.style.cssText =
      "position: absolute; top: " +
      (rect.bottom + 15) +
      "px; left: " +
      rect.left +
      "px"
    hint.innerHTML = ""

    for (var i = 0; i < ccs.length; i++) {
      ccs[i].parentNode.addEventListener(
        "mouseover",
        function () {
          var mth_ = months[this.firstChild.sdata.month]
          var yr_ = this.firstChild.sdata.year
          var nm_ = byMonths[this.firstChild.idx]
          hint.innerHTML =
            "За " +
            mth_ +
            " " +
            yr_ +
            " было выдано " +
            (nm_ || 0) +
            " наказаний.<br>Клик по столбцу для просмотра полного списка."
        },
        false
      )
      ccs[i].parentNode.addEventListener(
        "mouseout",
        function () {
          hint.innerHTML = ""
        },
        false
      )
    }

    document.addEventListener(
      "mouseup",
      function () {
        var rect = ccs[ccs.length - 1].parentNode.getBoundingClientRect()
        hint.style.top = rect.bottom + 15 + "px"
        hint.style.left = rect.left + "px"
      },
      false
    )

    var firstEver = grid.firstChild
    while (grid.lastChild != firstEver)
      grid.insertBefore(grid.lastChild, firstEver)
  }

  function fi(n) {
    return (n < 10 ? "0" : "") + n
  }

  function lookBans(type) {
    let output = ""
    bans.map((ban) => {
      if (ban.includes(nickInput.value + ", причина: [" + type))
        output += ban + "<br>"
    })
    section2.innerHTML = output
  }

  function lookJails(type) {
    let output = ""
    bans.map((ban) => {
      if (ban.includes(nickInput.value + " в админ тюрьму на " + type))
        output += ban + "<br>"
    })
    section2.innerHTML = output
  }

  function showMonthStats() {
    var months = " Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(
      " "
    )
    var year = new Date().getFullYear()
    var month = new Date().getMonth() + 1
    section1.innerHTML =
      "Статистика активности администраторов по месяцам:<br /><br />" +
      "<div id='col1' style='float: left; width: 200px'></div><div id='col2'></div>"
    for (var i = 0; i < 12; i++) {
      html("col1", months[month] + " " + year)
      addButtonA(
        document.getElementById("col2"),
        "Показать",
        (function (a, b) {
          return function () {
            showMonth(a, b)
          }
        })(month, year)
      )
      if (month == 1) (month = 12), year--
      else month--
    }
  }

  function GetLineProps(line) {
    try {
      var type = ""
      if (line.indexOf("был забанен") != -1) type = "ban"
      if (line.indexOf("отправлен администратором") != -1) type = "jail"
      if (line.indexOf("выдал roleplay") != -1) type = "rpw"
      if (line.indexOf("получил предупреждение") != -1) type = "warn"

      var date = line.match(/\[(\d\d):(\d\d):(\d{4})\]/)

      var code = ""
      if (type === "ban") code = line.match(/причина: \[(.+) -/)[1]
      if (type === "jail") code = line.match(/в админ тюрьму.+за (.+)\./)[1]

      var nick = "",
        anon = "",
        nickMatch = ""
      if (type === "ban")
        nickMatch = line.match(/администратором (.+), причина/)
      if (type === "jail")
        nickMatch = line.match(/администратором (.+) в админ/)
      if (type === "rpw") nickMatch = line.match(/Администратор (.+) выдал/)
      if (type === "warn")
        nickMatch = line.match(/администратора (.+), причина/)
      if (nickMatch) (nick = nickMatch[1].toLowerCase()), (anon = false)
      else (nick = ""), (anon = true)

      return {
        type,
        date: date[0],
        d: date[1],
        m: date[2],
        y: date[3],
        code,
        nick,
        anon,
      }
    } catch (e) {
      return {}
    }
  }

  function showMonth(month, year) {
    var ms = " Январь Февраль Март Апрель Май Июнь Июль Август Сентябрь Октябрь Ноябрь Декабрь".split(
      " "
    )
    var output =
      "Статистика работы администраторов за " +
      ms[month] +
      " " +
      year +
      ":<br><br>"

    if (month < 10) month = "0" + month
    else month = month + ""
    var chart = {}
    for (var i = 0; i < bans.length; i++) {
      var p = GetLineProps(bans[i])
      if (p.y == year && p.m == month) {
        var n = p.nick
        if (!chart[n]) chart[n] = 1
        else chart[n]++
      }
    }
    delete chart[""]
    var sorted = []
    for (var i in chart) {
      var curMax = -1,
        max = ""
      for (var j in chart) {
        if (chart[j] > curMax) (curMax = chart[j]), (max = j)
      }
      sorted.push([max, curMax])
      chart[max] = -1
    }
    for (var i = 0; i < sorted.length; i++)
      output +=
        "<div style='float:left; width: 150px'>" +
        sorted[i][0] +
        "</div><div>" +
        sorted[i][1] +
        "</div>"
    section2.innerHTML = output
  }

  function indexOf2d(array, elem, pos) {
    for (let i = 0; i < array.length; i++) {
      if (array[i][pos].toLowerCase() == elem.toLowerCase()) return i
    }
    return -1
  }

  function showAllStats() {
    let admins = []
    bans.map((val) => {
      const anick = val.match(/(?:ра|ром|ор) (\w+?)(,|\s)/i)
      if (!anick) return

      if (
        admins.every((admin) => {
          return admin[0].toLowerCase() != anick[1].toLowerCase()
        })
      )
        admins.push([anick[1], 1])
      else {
        const idx = indexOf2d(admins, anick[1], 0)
        if (idx != -1) admins[idx][1] += 1
      }
    })

    admins.sort((a, b) => a[1] < b[1])

    section1.innerHTML =
      "Общая статистика работы всех администраторов:<br /><br />" +
      "<div id='col1' style='float: left; width: 200px'></div><div id='col2' style='float: left; width: 50px'></div><div id='col3'></div>"
    admins.map((el) => {
      html("col1", el[0])
      html("col2", el[1])
      html(
        "col3",
        "<u style='cursor: pointer' onmousedown='nickInput.value = \"" +
          el[0] +
          "\"; chckst.onmousedown()'>Подробнее...</u>"
      )
    })
  }
}
function roughSizeOfObject(object) {
  var objectList = []
  var stack = [object]
  var bytes = 0

  while (stack.length) {
    var value = stack.pop()

    if (typeof value === "boolean") {
      bytes += 4
    } else if (typeof value === "string") {
      bytes += value.length * 2
    } else if (typeof value === "number") {
      bytes += 8
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value)

      for (var i in value) {
        stack.push(value[i])
      }
    }
  }
  return bytes
}
function listener(request, sender, sendResponse) {
  browser.runtime.onMessage.removeListener(listener)
  magic(request.url)
}
browser.runtime.onMessage.addListener(listener)
