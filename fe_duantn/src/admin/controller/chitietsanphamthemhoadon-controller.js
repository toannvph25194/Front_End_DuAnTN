app.service("ChitietsanphamThemHDService", function ($http) {
  var token = localStorage.getItem("accessToken");

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  this.getSanPhamTheoIds = function (IdSP) {
    console.log("Gửi yêu cầu với IdSP:", IdSP);
    return $http
      .get("http://localhost:8080/api/admin-sanphamchitiet/findbyid/san-pham", {
        params: { IdSP: IdSP },
        headers: config.headers,
      })
      .then(function (response) {
        console.log("Dữ liệu trả về từ API:", response.data);
        return response.data;
      });
  };

  this.getImageIds = function (IdSP) {
    console.log("Gửi yêu cầu với IdSP:", IdSP);
    return $http
      .get("http://localhost:8080/api/admin-image/hienthitatcaimage", {
        params: { IdSP: IdSP },
        headers: config.headers,
      })
      .then(function (response) {
        console.log("Dữ liệu trả về từ API:", response.data);
        return response.data;
      });
  };
});



app.controller("ChitietsanphamThemHDController", function ($scope, ChitietsanphamThemHDService, $window) {
  var role = $window.localStorage.getItem("role");

  if (role == null) {
    Swal.fire({
      title: "Bạn cần phải đăng nhập !",
      text: "Vui lòng đăng nhập để sử dụng chức năng !",
      icon: "warning",
    });
    $window.location.href = "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
    return;
  }

  $scope.isAdmin = (role === "ADMIN" || role === "NHANVIEN");

  function xemSanPhamTheoId() {
    var maspInput = localStorage.getItem("IDSanPhamLayChiTiet");
    console.log("IDSanPhamLayChiTiet từ localStorage:", maspInput);

    if (maspInput) {
      ChitietsanphamThemHDService.getSanPhamTheoIds(maspInput)
        .then(function (data) {
          console.log("Dữ liệu sản phẩm chi tiết trả về:", data);
          // Kiểm tra nếu data là một mảng và có ít nhất một phần tử
          if (Array.isArray(data) && data.length > 0) {
            $scope.sanPhamTheoId = data[0];
            console.log("Thông tin chi tiết sản phẩm:", $scope.sanPhamTheoId);
          } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            // Kiểm tra nếu data là một đối tượng và không rỗng
            $scope.sanPhamTheoId = data;
            console.log("Thông tin chi tiết sản phẩm:", $scope.sanPhamTheoId);
          } else {
            console.error("Không tìm thấy sản phẩm với IdSP:", maspInput);
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API xem chi tiết", error);
        });
    } else {
      console.error("Không có IdSP trong localStorage");
    }
  }

  function xemImageSP() {
    var maspInput = localStorage.getItem("IDSanPhamLayChiTiet");
    console.log("IDSanPhamLayChiTiet từ localStorage:", maspInput);

    if (maspInput) {
      ChitietsanphamThemHDService.getImageIds(maspInput)
        .then(function (data) {
          console.log("Dữ liệu ảnh chi tiết trả về:", data);
          $scope.ImageDL = data;
          console.log("Kết quả từ API image xem chi tiết", data);
          console.log("Giá trị IdSP từ localStorage:", maspInput);
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API xem chi tiết", error);
        });
    } else {
      console.error("Không có IdSP trong localStorage");
    }
  }

  if ($scope.isAdmin) {
    xemSanPhamTheoId();
    xemImageSP();
  }
});


  
  