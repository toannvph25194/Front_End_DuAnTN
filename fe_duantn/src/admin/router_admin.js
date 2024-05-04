var app = angular.module("app", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/", {
      templateUrl: "pages/thongke.html",
    })
    .when("/sanpham", {
      templateUrl: "pages/sanpham.html",
    })
    .when("/hoadon", {
      templateUrl: "pages/hoadon.html",
    })
    .when("/login", {
      templateUrl: "pages/dangnhap.html",
    })
    .when("/themsanpham", {
      templateUrl: "pages/themsanpham.html",
    })
    .when("/themsanphamchitiet", {
      templateUrl: "pages/themsanphamchitiet.html",
    })
    .when("/updatesanpham", {
      templateUrl: "pages/updatesanpham.html",
    })
    .when("/mausac", {
      templateUrl: "pages/mausac.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});



