define(['collections/journals', 'chimera/global'],
  function (Journals, Chimera) {

  return describe('Journals Collection', function () {

    it('should accept a profile in initialization options', function () {
      Chimera.loginProfile();
      var collection = new Journals({
        profile: Chimera.currentProfile
      });
      expect(collection.url).toBe(Chimera.currentProfile.get('journals_url'));
    });

    it('should default to all journals', function () {
      var collection = new Journals();
      expect(collection.url).toBe('/journals');
    });
  });
});
