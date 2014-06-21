define(['views/submissions/show', 'models/submission', 'chimera/global', 'chimera/page'],
  function (SubmissionView, Submission, Chimera, Page) {

  var submissionsFixture = fixture.load('submissions');
  var commentsFixture = fixture.load('comments');

  return describe('Submission View', function () {

    beforeEach(function () {
      jasmine.Ajax.install();
      Chimera.loginProfile();
      this.submission = new Submission(submissionsFixture.dragonSubmission);

      // set up comments
      jasmine.Ajax.stubRequest(this.submission.get('comments_url')).andReturn({
        status: 200,
        statusText: 'OK',
        responseText: JSON.stringify(commentsFixture.dragonSubmissionComments)
      });

      this.view = new SubmissionView({
        model: this.submission
      });
      Page.showView(this.view);
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
      Chimera.clearProfiles();
    });

    it('should display the submission title', function () {
      expect($('.submission.title')).toBeInDOM();
    });

    it('should display the submission image', function () {
      expect($('.image > img')).toBeInDOM();
    });

    it('should display comments', function () {
      expect($('li.comment')).toHaveLength(2);
    });

    it('for logged in profiles should display a new comment form', function () {
      expect($('#comment-form')).toBeInDOM();
    });

  });
});
