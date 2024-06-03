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
    .when("/size", {
      templateUrl: "pages/size.html",
    })
    .when("/chatlieu", {
      templateUrl: "pages/chatlieu.html",
    })
    .when("/xuatxu", {
      templateUrl: "pages/xuatxu.html",
    })
    .when("/thuonghieu", {
      templateUrl: "pages/thuonghieu.html",
    })
    .when("/danhmuc", {
      templateUrl: "pages/danhmuc.html",
    })
    .when("/updatechatlieu", {
      templateUrl: "pages/updatechatlieu.html",
    })
    .when("/updatedanhmuc", {
      templateUrl: "pages/updatedanhmuc.html",
    })
    .when("/updatemausac", {
      templateUrl: "pages/updatemausac.html",
    })
    .when("/updatsize", {
      templateUrl: "pages/updatesize.html",
    })
    .when("/updatethuonghieu", {
      templateUrl: "pages/updatethuonghieu.html",
    })
    .when("/updatexuatxu", {
      templateUrl: "pages/updatexuatxu.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});



