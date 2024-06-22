app.service("themsanPhamService", function ($http) {
  var token = localStorage.getItem("accessToken");
  
  if (!token) {
    // Xử lý trường hợp không có token, có thể chuyển hướng đến trang đăng nhập
    console.error("Không tìm thấy token. Hãy đăng nhập trước.");
    return Promise.reject("Unauthorized");
  }

  // Thêm token vào header của yêu cầu
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  this.getChatLieus = function () {
    return $http
      .get(
        "http://localhost:8080/api/admin-chatlieu/hienthitatcachatlieu",
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.getThuongHieus = function () {
    return $http
      .get(
        "http://localhost:8080/api/admin-thuonghieu/hienthitatcathuonghieu",
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.getDanhMucs = function () {
    return $http
      .get(
        "http://localhost:8080/api/admin-danhmuc/hienthitatcadanhmuc",
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.getXuatXus = function () {
    return $http
      .get("http://localhost:8080/api/admin-xuatxu/hienthitatcaxuatxu", config)
      .then(function (response) {
        return response.data;
      });
  };
  // thêm mới sản phẩm
  this.addSanPham = function (sanPhamData) {
    return $http
      .post(
        "http://localhost:8080/api/admin-sanpham/add-sanpham",
        sanPhamData,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };

});

app.controller("ThemSanPhamController",function ($scope, themsanPhamService, $window) {
  var role = $window.localStorage.getItem("role");

  if (role == null) {
    // Hiển thị thông báo khi chưa đăng nhập
    Swal.fire({
      title: "Bạn cần phải đăng nhập !",
      text: "Vui lòng đăng nhập để sử dụng chức năng !",
      icon: "warning",
    });
    // Chuyển hướng người dùng đến trang đăng nhập
    $window.location.href = "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
  }

  // Kiểm tra quyền và đặt biến isAdmin
  $scope.isAdmin = false;
  function getRole() {
    if (role === "ADMIN" || role === "NHANVIEN") {
      $scope.isAdmin = true;
    }
  }
  getRole();
  if (role === "ADMIN"|| role === "NHANVIEN") {
    // Khởi tạo $scope.selectedmaSP là một chuỗi rỗng ban đầu
    $scope.selectedmaSP = "";
    $scope.selectedImageName = ""; // Khởi tạo biến lưu trữ tên file ảnh đã chọn

    // Hàm để tạo mã sản phẩm ngẫu nhiên và gán vào selectedmaSP
    function generateProductCode() {
      const randomNumbers = Math.floor(1000000000 + Math.random() * 9000000000); // Tạo chuỗi số ngẫu nhiên gồm 10 ký tự
      const productCode = "TH_" + randomNumbers; // Tạo mã sản phẩm với tiền tố "TH_"

      // Gán giá trị mã sản phẩm vào biến selectedmaSP trong $scope
      $scope.selectedmaSP = productCode;

      // Đặt giá trị mã sản phẩm vào input có id là "inputText"
      const inputElement = document.getElementById("inputText");
      if (inputElement) {
        inputElement.value = productCode;
      }
    }

    // Đoạn mã xử lý khi người dùng chọn file ảnh
    $scope.handleFileSelect = function (event) {
      const fileList = event.target.files; // Danh sách các tệp đã chọn
      if (fileList.length > 0) {
        const selectedFile = fileList[0]; // Lấy tệp đầu tiên
        $scope.selectedImageName = selectedFile.name; // Lưu tên của tệp vào $scope
        console.log("Tên tệp đã chọn:", $scope.selectedImageName);
      }
    };

    // Gán hàm generateProductCode vào $scope để có thể gọi từ HTML
    $scope.generateProductCode = generateProductCode;

    // Các hàm và logic khác của controller
    themsanPhamService.getChatLieus().then(function (data) {
      $scope.chatLieus = data;
    });

    themsanPhamService.getThuongHieus().then(function (data) {
      $scope.thuongHieus = data;
    });

    themsanPhamService.getDanhMucs().then(function (data) {
      $scope.danhmucs = data;
    });

    themsanPhamService.getXuatXus().then(function (data) {
      $scope.xuatxus = data;
    });

    $scope.selectedChatLieu = null;
    $scope.selectedThuongHieu = null;
    $scope.selectedDanhMuc = null;
    $scope.selectedXuatXu = null;

    $scope.errorMessage = {
      masp: "",
      tensp: "",
      theloai: "",
      trangthai: "",
      gianhap: "",
      giaban: "",
      danhmuc: "",
      chatlieu: "",
      thuonghieu: "",
      xuatxu: "",
      imagedefaul: "",
      // Thêm các thuộc tính cho các ô input khác
    };

    $scope.clearErrorMessages = function () {
      for (var key in $scope.errorMessage) {
        if ($scope.errorMessage.hasOwnProperty(key)) {
          $scope.errorMessage[key] = "";
        }
      }
    };

    $scope.hasError = function () {
      for (var key in $scope.errorMessage) {
        if (
          $scope.errorMessage.hasOwnProperty(key) &&
          $scope.errorMessage[key]
        ) {
          return true; // Nếu có thông báo lỗi, trả về true
        }
      }
      return false; // Nếu không có lỗi, trả về false
    };

    // Hàm thêm mới sản phẩm
    $scope.addSanPhamMoi = function() {
      $scope.clearErrorMessages();
    
      // Kiểm tra và hiển thị thông báo lỗi nếu các trường không được chọn hoặc không hợp lệ
      if (!$scope.selectedmaSP) {
        $scope.errorMessage.masp = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedtenSP) {
        $scope.errorMessage.tensp = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedTheLoai) {
        $scope.errorMessage.theloai = "Vui lòng không bỏ trống";
      }
      // if (!$scope.selectedGiaNhap) {
      //   $scope.errorMessage.gianhap = "Vui lòng không bỏ trống";
      // }
      if (!$scope.selectedGiaBan) {
        $scope.errorMessage.giaban = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedDanhMuc) {
        $scope.errorMessage.danhmuc = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedChatLieu) {
        $scope.errorMessage.chatlieu = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedThuongHieu) {
        $scope.errorMessage.thuonghieu = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedXuatXu) {
        $scope.errorMessage.xuatxu = "Vui lòng không bỏ trống";
      }
      if (!$scope.selectedImageName) {
        $scope.errorMessage.imagedefaul = "Vui lòng không bỏ trống";
      }
      
      // Kiểm tra điều kiện nhập số âm cho giá nhập và giá bán
      // if ($scope.selectedGiaNhap <= 0) {
      //   $scope.errorMessage.gianhap = "Giá nhập phải là số dương và lớn hơn 0";
      // }
      if ($scope.selectedGiaBan <= 0) {
        $scope.errorMessage.giaban = "Giá bán phải là số dương và lớn hơn 0";
      }
      if ($scope.selectedtenSP.length > 20) {
        $scope.errorMessage.tensp = "Tên sản phẩm không được quá 20 ký tự";
      }
    
      // Kiểm tra xem có thông báo lỗi nào không
      if ($scope.hasError()) {
        // Nếu có, hiển thị thông báo lỗi và không thực hiện thêm sản phẩm
        Swal.fire({
          title: "Error",
          text: "Vui lòng kiểm tra lại thông tin sản phẩm!",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 3000
        });
        return;
      }
    
      // Hiển thị hộp thoại xác nhận trước khi thêm sản phẩm mới
      Swal.fire({
        title: "Bạn có muốn thêm sản phẩm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Tạo đối tượng dữ liệu sản phẩm
          var sanPhamData = {
            masp: $scope.selectedmaSP,
            tensp: $scope.selectedtenSP,
            theloai: $scope.selectedTheLoai,
            motasp: $scope.selectedMoTasp,
            trangthai: 1,
            // gianhap: $scope.selectedGiaNhap,
            giaban: $scope.selectedGiaBan,
            danhmuc: $scope.selectedDanhMuc,
            chatlieu: $scope.selectedChatLieu,
            thuonghieu: $scope.selectedThuongHieu,
            xuatxu: $scope.selectedXuatXu,
            imagedefaul: $scope.selectedImageName
          };
    
          // Gọi service để thêm sản phẩm
          themsanPhamService.addSanPham(sanPhamData).then(function(data) {
            console.log("Sản phẩm đã được thêm thành công:", data);
            // Lưu id và masp vào local storage
            $window.localStorage.setItem("IdSP", data.idsp);
            $window.localStorage.setItem("Masp", data.masp);
            // Hiển thị thông báo thành công
            Swal.fire({
              title: "Success",
              text: "Thêm sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500
            });
    
            // Chuyển hướng đến trang thêm sản phẩm chi tiết sau khi thêm thành công
            setTimeout(function() {
              $window.location.href = "#/themsanphamchitiet";
            }, 1500);
          }).catch(function(error) {
            console.error("Lỗi khi thêm sản phẩm hoặc mã sản phẩm đã tồn tại:", error);
            // Hiển thị thông báo lỗi nếu thêm không thành công
            Swal.fire({
              title: "Error",
              text: "Thêm sản phẩm thất bại",
              icon: "error",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500
            });
          });
        }
      });
    };
    
    
  }
}
);
