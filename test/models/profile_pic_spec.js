define(['models/profile_pic', 'chimera/global'], function (ProfilePic, Chi) {

  var profilePicsFixture = fixture.load('profile_pics');

  return describe('ProfilePic Model', function () {

    describe('initialize', function () {
      beforeEach(function () {
        this.json = profilePicsFixture.dragonPics[0];
        this.pic = new ProfilePic(this.json);
      });

      afterEach(function () {
        delete(this.pic);
      });

      it('should set url with initial JSON object', function () {
        expect(this.pic.url).toBe(this.json.url);
      });

      it('should parse available sizes', function () {
        expect(this.pic.get('pixels_52')).toBeDefined();
        expect(this.pic.get('pixels_128')).toBeDefined();
      });
    });

    describe('makeDefault', function () {

      beforeEach(function () {
        jasmine.Ajax.install();
        jasmine.Ajax.stubRequest('/profiles/1/pics/2/make_default').andReturn({
          status: 204,
          statusText: 'No Content'
        });
        jasmine.Ajax.stubRequest('/profiles/1/pics').andReturn({
          status: 200,
          statusText: 'OK',
          responseText: JSON.stringify(profilePicsFixture.dragonPics)
        });
        Chi.loginProfile();
      });

      afterEach(function () {
        jasmine.Ajax.uninstall();
      });

      it('should set default false on old default pic', function (done) {
        var oldPic = Chi.currentProfile.profilePics.at(0),
          newPic = Chi.currentProfile.profilePics.at(1);
        expect(oldPic.get('is_default')).toBe(true);
        newPic.makeDefault();
        expect(oldPic.get('is_default')).toBe(false);
        setTimeout(function () {
          done();
        }, 250);
      });

      it('should set default true on new default pic', function (done) {
        var oldPic = Chi.currentProfile.profilePics.at(0),
          newPic = Chi.currentProfile.profilePics.at(1);
        expect(newPic.get('is_default')).toBe(false);
        newPic.makeDefault();
        expect(newPic.get('is_default')).toBe(true);
        setTimeout(function () {
          done();
        }, 250);
      });
    });
  });
});
