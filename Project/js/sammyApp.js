
(function () {
    var sammyApp = Sammy('#content', function () {
        this.get('#/', function () {
            this.redirect('#/home');
        });
        this.get('#/home', homeController.all);
        this.get('#/about', aboutController.all);
        
        this.get('#/login', usersController.login);
        this.get('#/signup', usersController.signup);
        this.get('#/logout', usersController.logout);
        this.get('#/profile', usersController.currentUser);

        this.get('#/books', booksController.all);
        this.get('#/books/add', booksController.add);
        this.get('#/books/:page', booksController.all);
        this.get('#/books/id/:id', booksController.getById);
        this.get('#/books/id/:id/posts/add', booksController.addPost);


    });
    $(function () {
        sammyApp.run('#/');
    });
} ());