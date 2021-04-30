// chrome.tabs.onActivated.addListener(({ tabId }) => {
//   chrome.tabs.get(tabId, (tab) => {
//     console.log(tab)
//     if (
//       /^https:\/\/\.*gta-trinity\.ru/.test(tab.url) &&
//       !/Loading/.test(tab.title)
//     ) {
//       chrome.tabs.executeScript(null, { file: "main.js" }, () => {
//         console.log("injected")
//       })
//     }
//   })
// })onUpdated

chrome.tabs.onUpdated.addListener((tabId, changeInfo, Tab) => {
  chrome.tabs.get(tabId, (tab) => {
    if (/^https:\/\/\.*gta-trinity\.ru/.test(tab.url)) {
      console.log(tab.title)
      if (
        changeInfo.status == "complete" &&
        tab.title != "Loading..." &&
        tab.title != tab.url
      ) {
        chrome.tabs.executeScript(tabId, { file: "main.js" })
      }
    }
  })
})
