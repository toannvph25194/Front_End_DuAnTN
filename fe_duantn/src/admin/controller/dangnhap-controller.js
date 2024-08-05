app.controller("loginController", function ($scope, $http, $window, $route) {
  // Lấy username từ localStorage để kiểm tra
  $scope.taikhoancheck = localStorage.getItem("username");
  // Lấy role từ localStorage để kiểm tra
  $scope.role = localStorage.getItem("role");
  // Lấy role từ localStorage để kiểm tra
  $scope.image = localStorage.getItem("image");
  // Hàm xác thực đăng nhập
  $scope.authenticate = function () {
    // Kiểm tra tài khoản và mật khẩu có bị bỏ trống không
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

        // Lưu thông tin vào localStorage
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("image", response.data.image);

        // Hiển thị thông báo thành công
        Swal.fire({
          title: "Success",
          text: `Đăng nhập thành công với vai trò ${response.data.role}`,
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          // Điều hướng và tải lại trang sau khi thông báo biến mất
          if (response.data.role === "NHANVIEN") {
            $window.location.href = "#/sanpham";
          } else if (response.data.role === "ADMIN") {
            $window.location.href = "#/";
          }

          // Tải lại trang sau khi điều hướng
          $window.location.reload();
        });
      })
      .catch(function (error) {
        console.error("Lỗi khi đăng nhập:", error);

        // Hiển thị thông báo lỗi
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

  // Hàm đăng xuất
  $scope.logout = function () {
    // Hiển thị thông báo đăng xuất thành công
    Swal.fire({
      title: "Success",
      text: "Bạn đã đăng xuất thành công!",
      icon: "success",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      // Xóa dữ liệu khỏi localStorage
      $window.localStorage.clear();

      // Thiết lập trạng thái đăng nhập
      $scope.isLoggedIn = false;

      // Điều hướng đến trang đăng nhập và tải lại trang ngay lập tức
      $window.location.href = "#/login";
      $window.location.reload();
    });
  };
});
