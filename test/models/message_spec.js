define(['models/message'], function (Message) {

  return describe('Message Model', function () {

    beforeEach(function () {
      jasmine.Ajax.install();
      this.message = new Message({
        id: 1,
        subject: 'Test message',
        body: 'This is a test',
        url: '/profiles/1/messages/1',
        sender: {
          id: 2
        }
      });
    });

    afterEach(function () {
      jasmine.Ajax.uninstall();
    });

    it('should set url with url in initial JSON object', function () {
      expect(this.message.url).toBe('/profiles/1/messages/1');
    });

    it('should default unread to true', function () {
      expect(this.message.get('unread')).toBe(true);
    });

    it('should default deleted to false', function () {
      expect(this.message.get('deleted')).toBe(false);
    });

    describe('mark read', function () {
      it('should mark a message as read', function () {
        jasmine.Ajax.stubRequest('/profiles/1/messages/1/mark_read').andReturn({
          status: 204,
          statusText: 'No Content'
        });
        this.message.markRead();
        expect(this.message.get('unread')).toBe(false);
      });
    });
  });
});
