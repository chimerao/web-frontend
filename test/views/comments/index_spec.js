define(['views/comments/index', 'chimera/global', 'models/journal'],
  function (CommentsView, Chimera, Journal) {

  var journalsFixture = fixture.load('journals');
  var commentsFixture = fixture.load('comments');

  return describe('Comments View', function () {

    beforeEach(function () {
      jasmine.Ajax.install();
      // Make sure we have a clean slate
      $('#content').empty();
      $('#content').html('<ul id="comments"></ul>');

      // set up comments
      this.model = new Journal(journalsFixture.dragonJournal);
      jasmine.Ajax.stubRequest(this.model.get('comments_url')).andReturn({
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(commentsFixture.dragonJournalComments)
      });

      this.commentsView = new CommentsView(this.model);
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      Chimera.clearProfiles();
    });

    it('should display comments', function () {
      this.commentsView.collection.fetch({reset: true});
      expect($('#comment-1')).toBeInDOM();
      expect($('#comment-2')).toBeInDOM();
    });

    it('should nest child comments', function () {
      this.commentsView.collection.fetch({reset: true});
      expect($('#comment-2').parents('#comment-1')).toHaveLength(1);
    });

    it('for logged out users should not display comment form', function () {
      this.commentsView.collection.fetch({reset: true});
      expect($('#comment-form')).not.toBeInDOM();
    });

    it('for logged in users should display comment form', function () {
      Chimera.loginProfile();
      this.commentsView.collection.fetch({reset: true});
      expect($('#comment-form')).toBeInDOM();
    });
  });
});
