app.controller("QuanLyKhachHang",function ($scope, $http, $window, $routeParams) {
    // Lấy access token từ local storage
    var token = $window.localStorage.getItem("accessToken");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

   
});
