app.controller("loginController", function ($scope, $http, $window) {
  $scope.authenticate = function () {
    // Kiểm tra xem tài khoản và mật khẩu có bị bỏ trống không
    if (!$scope.taikhoan || !$scope.matkhau) {
      Swal.fire({
        title: "Error",
        text: "Tài khoản và mật khẩu không được bỏ trống!",
        icon: "error",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return; // Ngừng thực thi hàm nếu tài khoản hoặc mật khẩu bị bỏ trống
    }

    var authenticationData = {
      taikhoan: $scope.taikhoan,
      matkhau: $scope.matkhau,
    };
    // Gửi yêu cầu POST đến API
    $http
      .post(
        "http://localhost:8080/api/auth/nhanvien/dangnhapnhanvien",
        authenticationData
      )
      .then(function (response) {
        console.log("Đăng nhập thành công:", response.data);

        // Lưu AccessToken vào localStorage
        var accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        // Lưu tài khoản vào localStorage
        var taikhoan = response.data.username;
        localStorage.setItem("username", taikhoan);
        // Lưu quyền hạn
        var role = response.data.role;
        localStorage.setItem("role", role);

        // Hiển thị thông báo SweetAlert2 khi đăng nhập thành công
        Swal.fire({
          title: "Success",
          text: `Đăng nhập thành công với vai trò ${role}`,
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        // Tải lại trang sau 1.5 giây khi thông báo biến mất
        setTimeout(function () {
          if (role === "NHANVIEN") {
            $window.location.href = "#/sanpham";
          } else if (role === "ADMIN") {
            $window.location.href = "#/";
          }
        }, 1500);
      })
      .catch(function (error) {
        console.error("Lỗi khi đăng nhập:", error);

        // Hiển thị thông báo đăng nhập thất bại
        Swal.fire({
          title: "Error",
          text: "Đăng nhập thất bại. Mật khẩu hoặc tài khoản không đúng, hãy thử lại",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };
  $scope.logout = function () {
    Swal.fire({
      title: "Bạn đã đăng xuất thành công !",
      text: "Vui lòng đăng nhập để sử dụng chức năng !",
      icon: "success",
    });
    // Xóa token khỏi localStorage
    window.location.href = "#/login";
    $window.localStorage.removeItem("accessToken");
    $window.localStorage.removeItem("username");
    $window.localStorage.removeItem("role");
    $window.localStorage.removeItem("idhoadontq");
    $window.localStorage.removeItem("idkhtq");
    $window.localStorage.removeItem("mahoadontq");
    $window.localStorage.removeItem("tenkhachhang");
    $scope.isLoggedIn = false;
  };
});
