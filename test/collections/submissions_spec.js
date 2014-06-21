define(['collections/submissions', 'chimera/global'],
  function (Submissions, Chimera) {

  return describe('Submissions Collection', function () {

    it('should accept a profile in initialization options', function () {
      Chimera.loginProfile();
      var collection = new Submissions({
        profile: Chimera.currentProfile
      });
      expect(collection.url).toBe(Chimera.currentProfile.get('submissions_url'));
    });

    it('should default to all submissions', function () {
      var collection = new Submissions();
      expect(collection.url).toBe('/submissions');
    });
  });
});
