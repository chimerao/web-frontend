define(['views/journals/show', 'models/journal', 'chimera/global', 'chimera/page'],
  function (JournalView, Journal, Chimera, Page) {

  var journalsFixture = fixture.load('journals');
  var commentsFixture = fixture.load('comments');

  return describe('Journal View', function () {

    beforeEach(function () {
      jasmine.Ajax.install();
      Chimera.loginProfile();
      this.journal = new Journal(journalsFixture.dragonJournal);

      // set up comments
      jasmine.Ajax.stubRequest(this.journal.get('comments_url')).andReturn({
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(commentsFixture.dragonJournalComments)
      });

      this.view = new JournalView({
        model: this.journal
      });
      Page.showView(this.view);
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      Chimera.clearProfiles();
    });

    it('should display the journal body', function () {
      expect($('.journal > .body')).toBeInDOM();
    });

    it('should display comments', function () {
      expect($('li.comment').length).toBeGreaterThan(0);
    });

    it('for logged in profiles should display a new comment form', function () {
      expect($('#comment-form')).toBeInDOM();
    });

  });
});
