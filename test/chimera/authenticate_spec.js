define(['chimera/authenticate', 'chimera/global', 'models/profile', 'views/header'],
  function (Auth, Chimera, Profile, Header) {

  return describe('Chimera Authenticate', function () {

    var loginFixture = fixture.load('login');
    var profilesFixture = fixture.load('profiles');
    var tokenName = 'sessionToken';

    beforeEach(function () {
      jasmine.Ajax.install();
      this.loginUrl = '/login';
      this.profilesUrl = '/profiles';
      this.profileUrl = '/profiles/1';
      loginResponse = {
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(loginFixture.success)
      };
      jasmine.Ajax.stubRequest(this.loginUrl).andReturn(loginResponse);
      var profilesResponse = {
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(profilesFixture.profiles)
      };
      jasmine.Ajax.stubRequest(this.profilesUrl).andReturn(profilesResponse);
      var profileResponse = {
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(profilesFixture.dragonProfile)
      };
      jasmine.Ajax.stubRequest(this.profileUrl).andReturn(profileResponse);
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      Chimera.clearProfiles();
    });

    describe('login', function () {
      describe('success', function () {
        it('should set profiles', function () {
          expect(Chimera.currentProfile.active()).toBe(false);
          expect(Chimera.allProfiles.length).toEqual(0);
          Auth.login('user@example.com', 'password');
          expect(Chimera.currentProfile.active()).toBe(true);
          expect(Chimera.allProfiles.length).toEqual(2);
        });

        it('should set session token in local storage', function () {
          expect(localStorage.getItem(tokenName)).toBe(null);
          Auth.login('user@example.com', 'password');
          expect(localStorage.getItem(tokenName)).not.toBe(null);
        });

        it('should set the profile in the header', function () {
          expect($('#nav-login')).toBeInDOM();
          expect($('#nav-signup')).toBeInDOM();
          expect($('#settings')).not.toBeInDOM();
          expect($('#nav-profile')).not.toBeInDOM();
          Auth.login('user@example.com', 'password');
          expect($('#nav-login')).not.toBeInDOM();
          expect($('#nav-signup')).not.toBeInDOM();
          expect($('#settings')).toBeInDOM();
          expect($('#nav-profile')).toBeInDOM();
        });
      });
    });

    describe('logout', function () {
      beforeEach(function () {
        Chimera.loginProfile();
        jasmine.Ajax.stubRequest('/logout').andReturn({
          status: 204,
          statusText: 'No Content'
        });
      });

      it('should clear profiles', function () {
        expect(Chimera.currentProfile.active()).toBe(true);
        expect(Chimera.allProfiles.length).toEqual(2);
        Auth.logout();
        expect(Chimera.currentProfile.active()).toBe(false);
        expect(Chimera.allProfiles.length).toEqual(0);
      });

      it('should remove session token from local storage', function () {
        expect(localStorage.getItem(tokenName)).not.toBe(null);
        Auth.logout();
        expect(localStorage.getItem(tokenName)).toBe(null);
      });

      it('should reset the header', function () {
          expect($('#nav-login')).not.toBeInDOM();
          expect($('#nav-signup')).not.toBeInDOM();
          expect($('#settings')).toBeInDOM();
          expect($('#nav-profile')).toBeInDOM();
          Auth.logout();
          expect($('#nav-login')).toBeInDOM();
          expect($('#nav-signup')).toBeInDOM();
          expect($('#settings')).not.toBeInDOM();
          expect($('#nav-profile')).not.toBeInDOM();
      });

      it('should send logout ajax request', function () {
        Auth.logout();
        expect(jasmine.Ajax.requests.count()).toBeGreaterThan(0);
        expect(jasmine.Ajax.requests.mostRecent().url).toBe('/logout');
      });
    });

    describe('get current profile', function () {

      it('should not attempt to get profiles from server if no local session key exists', function () {
        forbiddenResponse = {
          status: 401,
          statusText: "Unauthorized"
        };
        jasmine.Ajax.stubRequest(this.profilesUrl).andReturn(forbiddenResponse);
        jasmine.Ajax.stubRequest(this.profileUrl).andReturn(forbiddenResponse);

        Auth.getCurrentProfile();
        expect(jasmine.Ajax.requests.count()).toEqual(0);
        expect(Chimera.currentProfile.active()).toBe(false);
      });

      it('should get profiles from server if there is a local session key', function () {
        localStorage.setItem(tokenName, 'testtoken');

        Auth.getCurrentProfile();
        expect(jasmine.Ajax.requests.count()).toBeGreaterThan(0);
        expect(Chimera.currentProfile.active()).toBe(true);
      });
    });
  });
});
