define('chimera/tabs', ['chimera/global', 'underscore'], function (Chi, _) {

  var tabKey = 'tabs';

  var Tabs = {
    tabCount: function () {
      return Object.keys(JSON.parse(localStorage.getItem(tabKey))).length;
    },

    addTab: function () {
      var tabs = localStorage.getItem(tabKey);
      if (tabs === null) {
        tabs = {};
        localStorage.setItem(tabKey, JSON.stringify(tabs));
      } else {
        tabs = JSON.parse(tabs);
      }

      var tabId = parseInt(sessionStorage.getItem('tabId'), 10);
      if (isNaN(tabId) && Tabs.tabCount() === 0) {
        Chi.clearProfiles();
      }

      var tab = tabs[tabId];

      if (tab === undefined) {
        if (isNaN(tabId)) {
          var unique = false;
          do {
            tabId = parseInt(Math.random() * 1000000, 10);
            var existingTab = _.find(Object.keys(tabs), function (tid) {
              return parseInt(tid, 10) === tabId;
            });
            if (existingTab === undefined) {
              unique = true;
            }
          } while (!unique);
        }
      }

      var expiration = new Date().getTime() + (1000 * 60 * 60 * 12); // 12 hours
      tabs[tabId] = expiration;
      sessionStorage.setItem('tabId', tabId);
      localStorage.setItem(tabKey, JSON.stringify(tabs));
    },

    removeTab: function () {
      var tabId = sessionStorage.getItem('tabId');
      var tabs = JSON.parse(localStorage.getItem(tabKey));

      delete(tabs[tabId]);
      localStorage.setItem(tabKey, JSON.stringify(tabs));
    }
  };

  return Tabs;
});
