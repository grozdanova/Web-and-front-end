
(function () {
    var sammyApp = Sammy('#content', function () {
        this.get('#/', function(){
            this.redirect('#/home');
        });
        this.get('#/home', homeController.all);
        this.get('#/about', aboutController.all);
        this.get('#/books', booksController.all);
        this.get('#/books/add', booksController.add);
        this.get('#/books/:id', booksController.getById);
        this.get('#/books/:id/posts/add', booksController.addPost);
        this.get('#/login', usersController.login);
        this.get('#/signup', usersController.signup);
        this.get('#/logout', usersController.logout);
        this.get('#/profile', usersController.currentUser);
    });
    $(function () {
        sammyApp.run('#/');
    });
}());