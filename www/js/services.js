var service = angular.module('cookBook.services', ['firebase']);
var appId = '166eaff1';
var apiKey = 'd06e1190d65ddb24380e5c0195138deb';
service.factory('Search', [function () {
  return {
    query: ''
  };
}]);
service.factory('Yummi', [ '$http', function ($http) {
  var Yummi = {
    search: function (food) {
      var searchURL = 'http://api.yummly.com/v1/api/recipes?_app_id=' + appId + '&_app_key=' + apiKey + '&q=' + food + '&maxResult=100&start=1';
      return $http.get(searchURL)
      .then(function (res) {
        return res.data;
      });
    },
    recipeId: function (id) {
      var recipeIdUrl = 'http://api.yummly.com/v1/api/recipe/' + id + '?_app_id=' + appId + '&_app_key=' + apiKey;
      return $http.get(recipeIdUrl)
      .then(function(idData) {
        return idData.data;
      });
    }
  };
  return Yummi;
}]);

service.factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {
  return $firebaseAuth();
}]);
