define(['models/profile', 'chimera/global'], function (Profile, Chimera) {

  var profilesFixture = fixture.load('profiles');
  var profilePicsFixture = fixture.load('profile_pics');

  return describe('Profile Model', function () {

    it('should not be active by default', function () {
      var profile = new Profile();
      expect(profile.get('active')).toBe(false);
      expect(profile.active()).toBe(false);
    });

    describe('initialize', function () {

      beforeEach(function () {
        jasmine.Ajax.install();
        Chimera.clearProfiles();
      });

      afterEach(function () {
        jasmine.Ajax.uninstall();
      });

      it('should parse default profile pic into a ProfilePic object', function () {
        var profile = new Profile(profilesFixture.profiles[0]);
        expect(profile.profilePics.length).toEqual(1);
        expect(profile.profilePics.at(0).get('pixels_52')).toBeDefined();
      });

      it('should load profile pics into profilePics collection', function (done) {
        jasmine.Ajax.stubRequest(profilesFixture.dragonProfile.url).andReturn({
          status: 200,
          statusText: 'OK',
          responseText: JSON.stringify(profilesFixture.dragonProfile)
        });
        jasmine.Ajax.stubRequest(profilesFixture.dragonProfile.profile_pics_url).andReturn({
          status: 200,
          statusText: 'OK',
          responseText: JSON.stringify(profilePicsFixture.dragonPics)
        });
        var profile = new Profile(profilesFixture.dragonProfile);
        expect(profile.profilePics.length).toEqual(2);
        setTimeout(function () {
          done();
        }, 250);
      });
    });
  });
});
