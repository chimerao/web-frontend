define(['models/filter'], function (Filter) {

  return describe('Filter Model', function () {
    it('should set url with initial JSON object', function () {
      this.filterUrl = '/profiles/1/filters/1';
      var newFilter = new Filter({url: this.filterUrl});
      expect(newFilter.url).toBe(this.filterUrl);
    });
  });
});
