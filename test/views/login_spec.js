define(['views/login'], function (LoginView) {
  return describe('Login View', function () {

    it('should render a form', function () {
      new LoginView().render();
      expect($('form#login-form')).toBeInDOM();
      expect($('input#identifier')).toBeInDOM();
      expect($('input#password')).toBeInDOM();
      expect($('button[type="submit"]')).toBeInDOM();
    });

    it('should have identifier input focused', function () {
      new LoginView().render();
      expect($('input#identifier')).toBeFocused();
    });

  });
});
