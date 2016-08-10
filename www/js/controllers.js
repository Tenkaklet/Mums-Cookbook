angular.module('cookBook.controllers', [])

.controller('MenuCtrl', [ '$scope', '$ionicModal', '$ionicPopup', '$firebaseAuth', '$firebaseArray', 'Firebase', '$firebaseObject', '$rootScope', '$location', function($scope, $ionicModal, $ionicPopup, $firebaseAuth, $firebaseArray, Firebase, $firebaseObject, $rootScope, $location) {


  var login = $firebaseAuth();
  var ref = firebase.database().ref('users');
  var userRef = $firebaseObject(ref);
  function newUser (name) {
    firebase.database().ref('users/' + name).set({
      name: name
    });
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signUpModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  $scope.showSignUp = function () {
    $scope.signUpModal.show();
  };
  $scope.closeSignUp = function () {
    $scope.signUpModal.hide();
  };


  $scope.loginData = {};

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    var email = $scope.loginData.email;
    var password = $scope.loginData.password;
    login.$signInWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log(user);
      $scope.user = user;
      var loggedIn = $ionicPopup.alert({
        title: 'Hey You!',
        template: 'Welcome back, you are now logged in as ' + user.displayName + '!'
      });
      $scope.loginModal.hide();
    })
    .catch(function(error) {
      console.log(error);

      $scope.message = error.message;
    });
  };
  $scope.signUp = {};
  // Here we sign up the user
  $scope.signUp = function () {
    var email = $scope.signUp.email;
    var password = $scope.signUp.password;
    var name = $scope.signUp.username;
    login.$createUserWithEmailAndPassword(email, password)
    .then(function (userInfo) {
      console.log(userInfo);
      ref.child(userInfo.uid).set({
        name: name
      });
      var theUser = firebase.auth().currentUser;
      console.log(theUser);
      theUser.updateProfile({
        displayName: name
      });
      $scope.signUpModal.hide();
      $scope.loginModal.hide();
      var signedUp = $ionicPopup.alert({
        title: 'Welcome ' + name,
        template: 'You are now ready to save recipes, cool!'
      });
    }).catch(function (err) {
      console.log(err);
      $scope.signUpMessage = err.message;
    });
  };


  $scope.close = function () {
    $scope.modal.hide();
  };

  $scope.signOut = function () {
    login.$signOut();
    var signedOut = $ionicPopup.alert({
      title: 'Signed Out',
      template: "You've been signed out. Bye Bye!"
    });
    $location.path('/');
    var firebaseUser = login.$getAuth();
    console.log(firebaseUser);
  };
  login.$onAuthStateChanged(function(user) {
    console.log(user);
      $scope.user = user;
    if ($scope.user !== null) {
      $scope.loggedIn = true;
    } else {
      $scope.loggedIn = false;
      $scope.loggedOut = true;
    }
  });
}])

.controller('SpecificRecipe', [ '$scope', '$stateParams', 'Yummi', '$rootScope', 'Auth', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$timeout', '$ionicModal', '$firebaseAuth', function($scope, $stateParams, Yummi, $rootScope, Auth, $firebaseArray, $firebaseObject, $ionicPopup, $timeout, $ionicModal, $firebaseAuth) {




  $rootScope.history = true;
  console.log($stateParams.recipeId);
  var recipeId = $stateParams.recipeId;
  Yummi.recipeId(recipeId)
  .then(function (data) {
    console.log(data);
    $scope.name = data.name;

    // Creates the Background Image
    var RecipeHeader = document.getElementById('RecipeHeader');
    var recipeImageUrl = data.images[0].hostedLargeUrl;
    var RecipeImage = 'url('+ recipeImageUrl  +')';
    RecipeHeader.style.backgroundImage = RecipeImage;
    RecipeHeader.style.height = '200px';

    // Puts the specifics of cooking time and favoriete
    $scope.time = data.totalTime;
    $scope.servings = data.numberOfServings;
    $scope.ingredients = data.ingredientLines;


    $scope.favorite = false;

    // A function to delete a specific recipe.

    // Toggles the food as favorite or not
    $scope.isFavorite = function (name) {
      console.log(name);
      console.log(recipeImageUrl);
      console.log(recipeId);
      var theUser = firebase.auth().currentUser;
      console.log(theUser);
      if (theUser === null) {
        var loginPopup = $ionicPopup.confirm({
          title: 'Login',
          template: 'Please login to save this recipe'
        });
        loginPopup
        .then(function(res) {
          //Login & Signup
          if (res) {
            var login = $firebaseAuth();
            var ref = firebase.database().ref('users');
            var userRef = $firebaseObject(ref);

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
              scope: $scope
            }).then(function(modal) {
              $scope.loginModal = modal;
            });
            $ionicModal.fromTemplateUrl('templates/signup.html', {
              scope: $scope
            }).then(function(modal) {
              $scope.signUpModal = modal;
            });
            $scope.loginModal.show();
            // Triggered in the login modal to close it
            $scope.closeLogin = function() {
              $scope.loginModal.hide();
            };

            // Open the login modal
            $scope.login = function() {

            };

            $scope.showSignUp = function () {
              $scope.signUpModal.show();
            };
            $scope.closeSignUp = function () {
              $scope.signUpModal.hide();
            };


            $scope.loginData = {};

            // Perform the login action when the user submits the login form
            $scope.doLogin = function() {
              var email = $scope.loginData.email;
              var password = $scope.loginData.password;
              login.$signInWithEmailAndPassword(email, password)
              .then(function (user) {
                console.log(user);
                $scope.user = user;
                var loggedIn = $ionicPopup.alert({
                  title: 'Hey You!',
                  template: 'Welcome back, you are now logged in as ' + user.displayName + '!'
                });
                $scope.loginModal.hide();
              })
              .catch(function(error) {
                console.log(error);

                $scope.message = error.message;
              });
            };
            $scope.signUp = {};
            // Here we sign up the user
            $scope.signUp = function () {
              var email = $scope.signUp.email;
              var password = $scope.signUp.password;
              var name = $scope.signUp.username;
              login.$createUserWithEmailAndPassword(email, password)
              .then(function (userInfo) {
                console.log(userInfo);
                ref.child(userInfo.uid).set({
                  name: name
                });
                var theUser = firebase.auth().currentUser;
                console.log(theUser);
                theUser.updateProfile({
                  displayName: name
                });
                $scope.signUpModal.hide();
                $scope.loginModal.hide();
                var signedUp = $ionicPopup.alert({
                  title: 'Welcome ' + name,
                  template: 'You are now ready to save recipes, cool!'
                });
              }).catch(function (err) {
                console.log(err);
                $scope.signUpMessage = err.message;
              });
            };


            $scope.close = function () {
              $scope.modal.hide();
            };
          } else {

          }

        });
      } else {
        $scope.favorite = true;
        var uid = theUser.uid;
        var reference = firebase.database().ref().child('users/' + uid + '/recipes');
        var list = $firebaseArray(reference);
        console.log(list);
        list.$add({
          recipeName: name,
          id: recipeId,
          image: recipeImageUrl
        }).then(function (ref) {
          var id = ref.key;
          console.log('added recipe with id (key)' + id);
          list.$indexFor(id);
        });
        var favPopUp = $ionicPopup.alert({
          title: 'Recipe added!',
          template: name + ' has been added to favorites!'
        });
      }
    };
    var recipe = data.source.sourceRecipeUrl;

    $scope.showRecipe = function () {
      window.open(recipe, '_system', 'location=yes');
    };
  });
}])

.controller('TopCtrl', ['$scope', '$ionicSideMenuDelegate', '$location', 'Search', '$rootScope', '$ionicHistory', function ($scope, $ionicSideMenuDelegate, $location, Search, $rootScope, $ionicHistory) {
  $rootScope.history = false;
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.search = function (item) {
    $rootScope.history = false;
    Search.query = item;
    $rootScope.item = Search.query;
  };
  $scope.back = function () {
    $ionicHistory.goBack();
  };
}])

.controller('SearchCtrl', ['$scope', 'Search', '$rootScope', 'Yummi', function($scope, Search, $rootScope, Yummi) {
  $scope.emptyPage = true;
  $rootScope.history = false;
  $scope.$watch('item', function (input) {
    $rootScope.history = false;
    if (typeof input === 'undefined') {
      return;
    } else if (input === '') {
      $scope.emptyPage = true;
    } else {
      $scope.emptyPage = false;
      Yummi.search(Search.query)
      .then(function (res) {
        $scope.foodList = res.matches;
      });
    }
  });

}])

.controller('savedRecipes', [ '$scope', '$stateParams', 'Yummi', 'Auth', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$location', function($scope, $stateParams, Yummi, Auth, $firebaseArray, $firebaseObject, $ionicPopup, $location) {
  Auth.$onAuthStateChanged(function(user) {
    console.log(user);
    var uid = user.uid;
    var reference = firebase.database().ref().child('users/' + uid + '/recipes');
    var list = $firebaseArray(reference);
    console.log(list);
    $scope.recipeList = list;

    $scope.view = function (id) {
      console.log(id);
      $location.path('/menu/search/' + id);
    };
    $scope.delete = function (item) {
      var deltePopup = $ionicPopup.alert({
        title: 'Deleted',
        template: 'This recipe has now been deleted.'
      });
      list.$remove(item)
      .then(function(result) {
        //The item is removed now
      });
    };

  });

}]);
