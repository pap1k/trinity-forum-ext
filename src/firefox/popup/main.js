document.getElementById("btn_counter").addEventListener("click", (e) => {
  const qObj = { active: true, currentWindow: true }
  browser.tabs.query(qObj).then((tabs) => {
    console.log(tabs[0].url)
    if (/^https:\/\/\.*gta-trinity\.ru\/.*\/bans.php/.test(tabs[0].url)) {
      browser.tabs.executeScript(null, {
        file: "/content_scripts/admin.js",
      })
      browser.tabs.sendMessage(tabs[0].id, { url: tabs[0].url })
    }
  })
})
