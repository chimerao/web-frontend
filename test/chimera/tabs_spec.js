define(['chimera/tabs', 'chimera/global'], function (Tabs, Chi) {

  return describe('Chimera Tabs', function () {

    var countKey = 'tabCount';

    beforeEach(function () {
      localStorage.removeItem('tabs');
      sessionStorage.removeItem('tabId');
    });

    afterEach(function () {
      Chi.clearProfiles();
    });

    it('should increment when loaded', function () {
      Tabs.addTab();
      expect(Tabs.tabCount()).toEqual(1);
    });

    it('should decrement when unloaded', function () {
      Tabs.addTab();
      Tabs.removeTab();
      expect(Tabs.tabCount()).toEqual(0);
    });

    it('should decrement when unload is triggered', function () {
      Tabs.addTab();
      $(window).trigger('unload');
      expect(Tabs.tabCount()).toEqual(0);
    });

    it('should persist tab ID across refreshes', function () {
      Tabs.addTab();
      var tabId = sessionStorage.getItem('tabId');
      // simulate refresh
      Tabs.removeTab();
      Tabs.addTab();
      expect(sessionStorage.getItem('tabId') === tabId).toBe(true);
    });

    it('should accurately reflect reloads', function () {
      Tabs.addTab();
      expect(Tabs.tabCount()).toEqual(1);

      // page loaded, simulate 1 refresh.
      Tabs.removeTab();
      Tabs.addTab();
      expect(Tabs.tabCount()).toEqual(1);

      // simulate another refresh
      Tabs.removeTab();
      Tabs.addTab();
      expect(Tabs.tabCount()).toEqual(1);
    });

    it('should not log someone out if they refresh in a single tab', function () {
      Tabs.addTab();
      Chi.loginProfile();
      // tab loaded, simulate 1 refresh.
      Tabs.removeTab();
      Tabs.addTab();
      expect(Chi.currentProfile.active()).toBe(true);
    });

    describe('while logged in after closing last tab', function () {
      beforeEach(function () {
        Chi.loginProfile();
        Tabs.addTab();
        Tabs.removeTab();
      });

      it('user should be logged out', function () {
        Tabs.addTab();
        expect(Chi.currentProfile.active()).toBe(false);
      });
    });
  });
});
