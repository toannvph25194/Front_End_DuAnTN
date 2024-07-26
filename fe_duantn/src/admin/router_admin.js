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
    .when("/updatechatlieu/:id", {
      templateUrl: "pages/updatechatlieu.html",
    })
    .when("/updatedanhmuc/:id", {
      templateUrl: "pages/updatedanhmuc.html",
    })
    .when("/updatemausac/:id", {
      templateUrl: "pages/updatemausac.html",
    })
    .when("/updatsize/:id", {
      templateUrl: "pages/updatesize.html",
    })
    .when("/updatethuonghieu/:id", {
      templateUrl: "pages/updatethuonghieu.html",
    })
    .when("/updatexuatxu/:id", {
      templateUrl: "pages/updatexuatxu.html",
    }).when("/showsanpham", {
      templateUrl: "pages/showsanpham.html",
    })
    .when("/showsanphamchitiet", {
      templateUrl: "pages/chitietsanthemhoadon.html",
    })
    .when("/updatehoadonchoxacnhan", {
      templateUrl: "pages/updatehoadonchoxacnhan.html",
    })
    .when("/updatehoadondaxacnhan", {
      templateUrl: "pages/updatehoadondaxacnhan.html",
    })
    .when("/updatehoadonchogiao", {
      templateUrl: "pages/updatehoadonchogiao.html",
    })
    .when("/updatehoadondanggiao", {
      templateUrl: "pages/updatehoadondanggiao.html",
    })
    .when("/updatehoadonhoanthanh", {
      templateUrl: "pages/updatehoadonhoanthanh.html",
    })
    .when("/updatehoadonhuy", {
      templateUrl: "pages/updatehoadonhuy.html",
    }).when("/bantaiquay", {
      templateUrl: "pages/bantaiquay.html",
    }).when("/vnpaydone", {
      templateUrl: "pages/vnpaydone.html",
      controller: "BanHangTaiQuayController"
    })
    .when("/khachhang", {
      templateUrl: "pages/khachhang.html",
    })
    .when("/themkhachhang", {
      templateUrl: "pages/themkhachhang.html",
    })
    .when("/updatekhachhang/:id", {
      templateUrl: "pages/updatekhachhang.html",
    })
    .when("/giamgiatheosanpham", {
      templateUrl: "pages/giamgiatheosanpham.html",
    })
    .when("/themgiamgiatheosanpham", {
      templateUrl: "pages/themgiamgiatheosanpham.html",
    })
    .when("/themsanphamgiamgia", {
      templateUrl: "pages/themsanphamgiamgia.html",
    })
    .when("/updategiamgiatheosanphamgiaodien/:id", {
      templateUrl: "pages/updategiamgiatheosanpham.html",
    })
    .otherwise({
      redirectTo: "/",
    });
});
