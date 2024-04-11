var app = angular.module("app", []);
app.controller("registerController", function ($scope, $http, $window) {
  $scope.taikhoan = "";
  $scope.email = "";
  $scope.matkhau = "";

  $scope.taikhoanLoginValid = true;
  $scope.matkhauLoginValid = true;

  $scope.taikhoanRegisValid = true;
  $scope.taikhoanRegisLeng = true;
  $scope.taikhoanRegisForcus = true;
  var taikhoanRegexp = /^[a-zA-Z0-9]+$/;
  $scope.matkhauRegisValid = true;
  $scope.matkhauRegisLeng = true;
  $scope.emailRegisValid = true;
  $scope.emailRegisForcus = true;
  var emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  $scope.authenticate = function () {

    if (!$scope.taikhoan && !$scope.matkhau) {
      $scope.taikhoanLoginValid = false;
      $scope.matkhauLoginValid = false;
      return;
    } else if (!$scope.taikhoan) {
      $scope.taikhoanLoginValid = false;
      $scope.matkhauLoginValid = true;
      return;
    } else if (!$scope.matkhau) {
      $scope.taikhoanLoginValid = true;
      $scope.matkhauLoginValid = false;
      return;
    } else {
      $scope.taikhoanLoginValid = true;
      $scope.matkhauLoginValid = true;
    }

    var authenticationData = {
      taikhoan: $scope.taikhoan,
      matkhau: $scope.matkhau,
    };

    // Gửi yêu cầu POST đến API localhost:8080/ban/hang/login
    $http.post("http://localhost:8080/api/auth/khachhang/dangnhapkhachhang", authenticationData)
      .then(function (response) {
        console.log("Đăng nhập thành công:", response.data);

        //Lưu Id TaiKhoan Và localstorage
        var idtk = response.data.idtk;
        localStorage.setItem("idtk", idtk);

        var taikhoan = response.data.username;
        localStorage.setItem("taikhoan", taikhoan);

        // Hiển thị thông báo SweetAlert2 khi đăng nhập thành công
        if (taikhoan != null) {
          Swal.fire({
            title: "Success",
            text: "Đăng nhập thành công tài khoản user",
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });

          // Lấy IdTK sau khi đăng nhập
          // var idtaikhoantimkiem = localStorage.getItem('idtk');
          // console.log("IdTKDangNhap :", idtaikhoantimkiem);
          // // Hàm tìm kiếm id giỏ hàng của người dùng khi đăng nhập
          // $scope.finByIdGioHang = function () {

          //   $http.get('http://localhost:8080/api/gio-hang/tim-kiem/gio-hang?idtk=' + idtaikhoantimkiem)
          //     .then(resp => {
          //       $scope.timKiemIdGH = resp.data;

          //       if ($scope.timKiemIdGH && $scope.timKiemIdGH.id !== null && $scope.timKiemIdGH.id !== "") {
          //         localStorage.setItem("idgiohang", $scope.timKiemIdGH.id);
          //         console.log("Đã Tìm Thấy IdGH :", resp)
          //       } else {
          //         console.log("K Tìm Thấy IdGH Hoặc Chưa Tạo !");
          //       }

          //     }).catch(error => {
          //       console.log("Lỗi K Load DC IDGH !")
          //     });
          // }
          // $scope.finByIdGioHang();

          // Tải lại trang sau 1.5 giây khi thông báo biến mất
          setTimeout(function () {
            $window.location.href = "/src/user/index_user.html";
          }, 1500);

        } else {
          Swal.fire({
            title: "Đăng nhập thất bại",
            text: "Sai tài khoản hoặc mật khẩu. Hãy thử lại!",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
        }

      })
      .catch(function (error) {

        console.error("Lỗi khi đăng nhập:", error);

        // Hiển thị thông báo đăng nhập thất bại (bạn có thể sử dụng thư viện thông báo thay vì alert)
        Swal.fire({
          title: "Error",
          text: "Lỗi Đăng Nhập!",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };




  $scope.register = function () {

    if (!$scope.taikhoan) {
      $scope.taikhoanRegisValid = false;
      $scope.taikhoanRegisForcus = true;
      $scope.taikhoanRegisLeng = true;
    } else if ($scope.taikhoan.length < 7 || $scope.taikhoan.length > 13) {
      $scope.taikhoanRegisLeng = false;
      $scope.taikhoanRegisValid = true;
      $scope.taikhoanRegisForcus = true;
      return;
    } else if (!taikhoanRegexp.test($scope.taikhoan)){
      $scope.taikhoanRegisForcus = false;
      $scope.taikhoanRegisLeng = true;
      $scope.taikhoanRegisValid = true;
    } else {
      $scope.taikhoanRegisLeng = true;
      $scope.taikhoanRegisValid = true;
      $scope.taikhoanRegisForcus = true;
    }

    if (!$scope.email) {
      $scope.emailRegisForcus = true;
      $scope.emailRegisValid = false;
    } else if (!emailRegexp.test($scope.email)) {
      $scope.emailRegisForcus = false;
      $scope.emailRegisValid = true;
      return;
    } else {
      $scope.emailRegisForcus = true;
      $scope.emailRegisValid = true;
    }

    if (!$scope.matkhau) {
      $scope.matkhauRegisLeng = true;
      $scope.matkhauRegisValid = false;
    } else if($scope.matkhau.length < 6 || $scope.matkhau.length > 15){
      $scope.matkhauRegisValid = true;
      $scope.matkhauRegisLeng = false;
      return;
    } else { 
      $scope.matkhauRegisValid = true;
      $scope.matkhauRegisLeng = true;
    }

    // Thông báo không được để trống
    if (
      !$scope.taikhoanRegisValid ||
      !$scope.matkhauRegisValid ||
      !$scope.emailRegisValid 
    ) {
      // Swal.fire({
      //   title: "Warning",
      //     text: "Vui lòng nhập đầy đủ thông tin !",
      //     icon: "warning",
      //     position: "top-end",
      //     toast: true,
      //     showConfirmButton: false,
      //     timer: 1500,
      // });
      return;
    }


    var registrationData = {
      taikhoan: $scope.taikhoan,
      email: $scope.email,
      matkhau: $scope.matkhau,
    };

    // Gửi yêu cầu POST đến API localhost:8080/ban/hang/register
    $http
      .post("http://localhost:8080/api/auth/khachhang/dangkykhachhang", registrationData)
      .then(function (response) {
        console.log("Đăng ký thành công:", response.data);

        // Hiển thị thông báo SweetAlert2 khi đăng ký thành công
        Swal.fire({
          title: "Success",
          text: "Đăng ký thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        // Tải lại trang sau 1.5 giây khi thông báo biến mất
        setTimeout(function () {
          $window.location.reload();
        }, 1500);
      })
      .catch(function (error) {
        console.error("Lỗi khi đăng ký:", error);

        // Hiển thị thông báo đăng ký thất bại (bạn có thể sử dụng thư viện thông báo thay vì alert)
        Swal.fire({
          title: "Error",
          text: "Lỗi đăng kí !",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

});
