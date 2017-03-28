
var id;
function check(e) {
  id = e.id;
}
var booksController = function () {
  function all(context) {
    templates.get('books')
      .then(function (template) {
        var childData,
          data = [];

        var booksRef = firebase.database().ref('books');
        booksRef.on('value', function (snapshot) {
          var a = snapshot.val();
          console.log(a);

          // var keys = Object.keys(a);
          // console.log(keys.toString());

          // snapshot.forEach(function (childSnapshot) {
          //   childData = childSnapshot.val();
          //   console.log(childData);
          // });

          data.push(a);
          console.log(data);
          context.$element().html(template(data));

        });
      });

  }
  function add(context) {
    templates.get('book-add')
      .then(function (template) {
        context.$element().html(template());

        var title = document.getElementById('title');
        var author = document.getElementById('author');
        var description = document.getElementById('desc');

        $('#btnAdd').on('click', function () {
          firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
              var inputTitle = title.value;
              var inputAuthor = author.value;
              var inputDescription = description.value;

              var today = new Date();
              today = today.toLocaleDateString("bg-BG");
              //Get user information
              var userData;
              var userRef = firebase.database().ref('users').child(firebaseUser.uid);
              userRef.on('value', function (snapshot) {
                userData = snapshot.val();
                console.log(userData);
              });

              var refUserBooks = firebase.database().ref();
              var key = refUserBooks.push().key;
              refUserBooks.child('users/' + firebaseUser.uid).child('books/').push({
                id: key,
                title: inputTitle,
                author: inputAuthor,
                description: inputDescription,
                postedBy: userData.username,
                date: today
              });

              var refBooks = firebase.database().ref();
              // Get a key for a new Book.
              var newBookKey = refBooks.push().key;


              refBooks.child('books/' + newBookKey).push({
                id: newBookKey,
                title: inputTitle,
                author: inputAuthor,
                description: inputDescription,
                postedBy: userData.username,
                date: today
              });

              toastr.success('Book added!');
              context.redirect('#/books');

            } else {
              context.redirect('#/login');
              console.log('not logged in');

              toastr.success('Please login');

            }
          });
        });

      });
  }

  function byId(context) {
    console.log(id);
    templates.get('book')
      .then(function (template) {
        var childData,
          data = [];
        var bookRef = firebase.database().ref('books').child(id);
        bookRef.on('value', function (snapshot) {
          var a = snapshot.exists();
          console.log(a);
          snapshot.forEach(function (childSnapshot) {
            childData = childSnapshot.val();
            console.log(childData);
            data.push(childData);
          });


        });
        context.$element().html(template(data));
      });
  }

  function addPost(context) {
    templates.get('post-add')
      .then(function (template) {

        context.$element().html(template());

        var inputComment = document.getElementById('textComment');
        $('#addComment').on('click', function () {
          firebase.auth().onAuthStateChanged(firebaseUser => {
            var input = inputComment.value;
            var key;
            if (firebaseUser) {
              var booksRef = firebase.database().ref('books').child(id);
              booksRef.on('value', function (snapshot) {
                var a = snapshot.val();
                key = Object.keys(a);
              });
              var childKey = key.toString();
              var today = new Date();
              today = today.toLocaleDateString("bg-BG");
              //Get user information
              var userData;
              var userRef = firebase.database().ref('users').child(firebaseUser.uid);
              userRef.on('value', function (snapshot) {
                userData = snapshot.val();
              });
              //Save to /books/bookId/childID/posts/postID
              var bookRef = firebase.database().ref('books').child(id).child(childKey).child('posts').push({
                message: input,
                postedBy: userData.username,
                date: today,
                photoUrl: userData.photoUrl
              });
              //Save to /users/userId/posts/postId
              var refUserPosts = firebase.database().ref();
              refUserPosts.child('users/' + firebaseUser.uid).child('posts/').push({
                message: input,
                postedBy: userData.username,
                date: today,
                photoUrl: userData.photoUrl
              });

              toastr.success('Comment added!');
              context.redirect('#/books');

            } else {
              // console.log(input);
              context.redirect('#/login');
              toastr.success('To Add Comment You Have To Logged in!');

            }
          });
        });

      });
  }

  return {
    all: all,
    add: add,
    getById: byId,
    addPost: addPost
  };
} ();