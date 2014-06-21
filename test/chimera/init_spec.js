define(['chimera/init', 'chimera/global', 'models/profile', 'views/header', 'chimera/tabs'],
  function(Init, Chimera, Profile, Header, Tabs) {

  return describe('Chimera Init', function () {

    var profilesFixture = fixture.load('profiles');
    var tokenName = 'sessionToken';

    beforeEach(function () {
      jasmine.Ajax.install();
      this.requestUrl = '/profiles';
      // make sure to reset the necessary DOM elements before each test is run.
      localStorage.removeItem('tabs');
      sessionStorage.removeItem('tabId');
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      Chimera.clearProfiles();
    });

    it('should have onunload listener on window', function () {
      expect($(window)).toHandle('unload');
    });

    describe('for logged out users', function () {
      
      beforeEach(function () {
        // setup default XHR response, to be specified differently in tests if necessary.
        this.ajaxResponse = {
          status: 401,
          statusText: "Unauthorized"
        };
        jasmine.Ajax.stubRequest(this.requestUrl).andReturn(this.ajaxResponse);
      });

      it('should not set profiles', function () {
        Init.run();
        expect(Chimera.allProfiles.length).toEqual(0);
      });

      it('should not set current profile', function () {
        Init.run();
        expect(Chimera.currentProfile.active()).toBe(false);
      });

      it('should render the header', function () {
        Init.run();
        expect($('.logo')).toBeInDOM();
        expect($('#nav-login')).toBeInDOM();
        expect($('#nav-signup')).toBeInDOM();
        expect($('#settings')).not.toBeInDOM();
        expect($('#nav-profile')).not.toBeInDOM();
      });
    });

//    describe('for logged in users', function () {
//
//      // We don't want to use the loginProfile helper here.
//      beforeEach(function () {
//        this.profilesUrl = '/profiles';
//        this.profileUrl = '/profiles/1';
//        var profilesResponse = {
//          status: 200,
//          statusText: 'OK',
//          responseText: JSON.stringify(profilesFixture.profiles)
//        };
//        jasmine.Ajax.stubRequest(this.profilesUrl).andReturn(profilesResponse);
//        var profileResponse = {
//          status: 200,
//          statusText: 'OK',
//          responseText: JSON.stringify(profilesFixture.dragonProfile)
//        };
//        jasmine.Ajax.stubRequest(this.profileUrl).andReturn(profileResponse);
//        localStorage.setItem('sessionToken', 'testtoken');
//      });
//
//      it('should set profiles', function () {
//        Init.run();
//        expect(Chimera.allProfiles.length).toEqual(2);
//      });
//
//      it('should set current profile', function () {
//        Init.run();
//        var request = jasmine.Ajax.requests.mostRecent();
//        expect(request.url).toMatch('profiles');
//        expect(request.status).toBe(200);
//        expect(Chimera.currentProfile.active()).toBe(true);
//      });
//
//      it('should render the header with profile options', function () {
//        Init.run();
//        expect($('.logo')).toBeInDOM();
//        expect($('#nav-login')).not.toBeInDOM();
//        expect($('#nav-signup')).not.toBeInDOM();
//        expect($('#settings')).toBeInDOM();
//        expect($('#nav-profile')).toBeInDOM();
//      });
//    });
  });
});
