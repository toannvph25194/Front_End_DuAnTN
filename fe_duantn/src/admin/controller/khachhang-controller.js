app.controller("QuanLyKhachHang", function ($scope, $http, $window, $routeParams) {
  // Lấy access token từ local storage
  var token = $window.localStorage.getItem("accessToken");
  var role = $window.localStorage.getItem("role");
  var idkhachhang = $routeParams.id;
  console.log("idkh : ", idkhachhang);

  if (!role) {
    // Display alert if not logged in
    Swal.fire({
      title: "Bạn cần phải đăng nhập !",
      text: "Vui lòng đăng nhập để sử dụng chức năng !",
      icon: "warning",
    });
    // Redirect to login page
    $window.location.href = "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
  }

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  $scope.currentPage = 1;
  $scope.itemsPerPage = 10;
  $scope.totalPages = 0;
  $scope.isFilteringTieuChi = false;
  $scope.isFilterTrangThai = false;

  // Hàm xử lý previou trang
  $scope.previousPage = function () {
    if ($scope.currentPage > 1) {
      $scope.currentPage--;
      if ($scope.isFilteringTieuChi) {
        $scope.LocKhachHangTheoNhieuTC();
      } else if ($scope.isFilterTrangThai) {
        $scope.LocKhachHangTheoTrangThai();
      } else {
        $scope.LoadKhachHang();
      }
    }
  };

  // Hàm xử lý next trang
  $scope.nextPage = function () {
    if ($scope.currentPage < $scope.totalPages) {
      $scope.currentPage++;
      if ($scope.isFilteringTieuChi) {
        $scope.LocKhachHangTheoNhieuTC();
      } else if ($scope.isFilterTrangThai) {
        $scope.LocKhachHangTheoTrangThai();
      } else {
        $scope.LoadKhachHang();
      }
    }
  };

  // Load all khách hàng
  $scope.LoadKhachHang = function () {
    $scope.isFilteringTieuChi = false;
    $scope.isFilterTrangThai = false;
    $http.get('http://localhost:8080/api/admin/quan-ly-khach-hang/hien-thi?page=' + ($scope.currentPage - 1), config)
      .then((resp) => {
        $scope.KhachHangPT = resp.data.content;
        console.log("Load khách hàng :", $scope.KhachHangPT);

        // Tổng số bản ghi
        $scope.totalItems = resp.data.totalElements;
        // Tổng số trang
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      })
      .catch((error) => {
        console.log("Lỗi load khách hàng !", error);
      });
  }
  if (role != null) {
    $scope.LoadKhachHang();
  }


  // Hàm lọc khách hàng theo nhiều tiêu chí
  $scope.LocKhachHangTheoNhieuTC = function () {
    $scope.isFilteringTieuChi = true;
    $http.get('http://localhost:8080/api/admin/quan-ly-khach-hang/loc-tieu-chi?page=' + ($scope.currentPage - 1) + '&keyword=' + $scope.keyword, config)
      .then((resp) => {
        $scope.KhachHangPT = resp.data.content;
        console.log("Lọc khách hàng theo tiêu chí :", $scope.KhachHangPT);
        // Tổng số bản ghi
        $scope.totalItems = resp.data.totalElements;
        // Tổng số trang
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      })
      .catch((error) => {
        console.log("Lỗi lọc khách hàng theo tiêu chí !", error);
      });
  }

  // Hàm lọc khách hàng theo trạng thái
  $scope.LocKhachHangTheoTrangThai = function () {
    $scope.isFilterTrangThai = true;
    var trangthai = $scope.trangthai || "";
    if (trangthai == "") {
      $scope.LoadKhachHang();
    } else {
      $http.get('http://localhost:8080/api/admin/quan-ly-khach-hang/loc-trang-thai?page=' + ($scope.currentPage - 1) + '&trangthai=' + trangthai, config)
        .then((resp) => {
          $scope.KhachHangPT = resp.data.content;
          console.log("Lọc khách hàng theo trạng thái :", $scope.KhachHangPT);
          // Tổng số bản ghi
          $scope.totalItems = resp.data.totalElements;
          // Tổng số trang
          $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        })
        .catch((error) => {
          console.log("Lỗi lọc khách hàng theo trạng thái !", error);
        });
    }
  }

  // Hàm làm mới các ô lọc
  $scope.LamMoi = function () {
    $scope.keyword = "";
    $scope.hovatenkh = "";
    $scope.ngaysinh = "";
    $scope.sodienthoai = "";
    $scope.email = "";
    $scope.diachichitiet = "";
    $scope.phuongxa = "";
    $scope.quanhuyen = "";
    $scope.tinhthanh = "";
    $scope.gioitinh = "";
    $scope.trangthai = "";
    $scope.mota = "";
    $scope.LoadKhachHang();
  }

  // Hàm chuyển trạng thái khách hàng
  $scope.CapNhatTrangThai = function (khachhang) {
    var trangthai = khachhang.trangthai == 1 ? 0 : 1;
    var url = 'http://localhost:8080/api/admin/quan-ly-khach-hang/update-trang-thai?id=' + khachhang.id + '&trangthai=' + trangthai;
    $http.put(url, {}, config)
      .then((resp) => {
        Swal.fire({
          title: "Thành Công",
          text: "Cập nhật trạng thái thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          $scope.LoadKhachHang();
        });
      })
      .catch((error) => {
        console.log("Lỗi cập nhật trạng thái khách hàng !", error);
      });
  }

  // Đoạn mã xử lý lấy tên ảnh khi người dùng chọn file ảnh
  $scope.selectedImageName = "";
  $scope.handleFileSelect = function (event) {
    const fileList = event.files;
    if (fileList.length > 0) {
      // Lấy tệp đầu tiên
      const selectedFile = fileList[0];
      // Lưu tên của tệp vào $scope
      $scope.selectedImageName = selectedFile.name;
      console.log("Tên tệp đã chọn:", $scope.selectedImageName);
      // Tạo URL để hiển thị ảnh đã chọn
      const reader = new FileReader();
      reader.onload = function (e) {
        $scope.$apply(function () {
          $scope.showImage = e.target.result;
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Định dạng email và số điện thoại
  var sdtRegex = /^(0[2-9]{1}\d{8,9})$/;
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Hàm thêm mới khách hàng
  $scope.ThemMoiKhachHang = function () {
    // check trống các trường thuộc tính
    if (!$scope.hovatenkh || !$scope.ngaysinh || !$scope.sodienthoai || !$scope.email ||
      !$scope.diachichitiet || !$scope.phuongxa || !$scope.quanhuyen || !$scope.tinhthanh ||
      !$scope.gioitinh || !$scope.trangthai
    ) {
      Swal.fire({
        title: "Warning",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    // check định dạng số điện thoai 
    if (!sdtRegex.test($scope.sodienthoai)) {
      Swal.fire({
        title: "Thông Báo",
        text: "Vui lòng kiểm tra định dạng số điện thoại",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    // check định dạng email
    if (!emailRegex.test($scope.email)) {
      Swal.fire({
        title: "Thông Báo",
        text: "Vui lòng kiểm tra định dạng email",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    Swal.fire({
      title: "Xác Nhận",
      text: "Bạn có muốn thêm khách hàng không ?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Hủy Bỏ",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Xác Nhận",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (role != null) {
          var url = "http://localhost:8080/api/admin/quan-ly-khach-hang/them-khach-hang";
          var data = {
            hovatenkh: $scope.hovatenkh,
            image: $scope.selectedImageName,
            ngaysinh: $scope.ngaysinh,
            sodienthoai: $scope.sodienthoai,
            email: $scope.email,
            diachichitiet: $scope.diachichitiet,
            phuongxa: $scope.phuongxa,
            quanhuyen: $scope.quanhuyen,
            tinhthanh: $scope.tinhthanh,
            gioitinh: $scope.gioitinh,
            trangthai: $scope.trangthai,
            mota: $scope.mota
          };

          $http.post(url, data, config)
            .then((resp) => {
              Swal.fire({
                title: "Thành Công",
                text: "Thêm khách hàng thành công",
                icon: "success",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                $scope.LoadKhachHang();
                $scope.LamMoi();
              });
            })
            .catch((error) => {
              console.log("Lỗi thêm khách hàng !", error);
            });
        }
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    });
  }

  // Hàm làm mới cập nhật
  $scope.LamMoiCapNhat = function(){
    $scope.FindKhachHang.hovatenkh = "";
    $scope.FindKhachHang.ngaysinh = "";
    $scope.FindKhachHang.sodienthoai = "";
    $scope.FindKhachHang.email = "";
    $scope.FindKhachHang.diachichitiet = "";
    $scope.FindKhachHang.phuongxa = "";
    $scope.FindKhachHang.quanhuyen = "";
    $scope.FindKhachHang.tinhthanh = "";
    $scope.FindKhachHang.gioitinh = "";
    $scope.FindKhachHang.trangthai = "";
    $scope.FindKhachHang.mota = "";
  }

  // Hàm find khách hàng theo id
  $scope.FindByKhachHang = function () {
    $http.get('http://localhost:8080/api/admin/quan-ly-khach-hang/find-khach-hang?id=' + idkhachhang, config)
      .then((resp) => {
        $scope.FindKhachHang = resp.data;
        // Chuyển đổi ngaysinh thành đối tượng Date
        if ($scope.FindKhachHang.ngaysinh) {
          $scope.FindKhachHang.ngaysinh = new Date($scope.FindKhachHang.ngaysinh);
        }
        console.log("Find khách hàng :", $scope.FindKhachHang);
        $scope.FindKhachHang.gioitinh = $scope.FindKhachHang.gioitinh.toString();
        $scope.FindKhachHang.trangthai = $scope.FindKhachHang.trangthai.toString();
      })
      .catch((error) => {
        console.log("Lỗi Find khách hàng !", error);
      });
  }
  if (idkhachhang != null) {
    $scope.FindByKhachHang();
  }

  // Hàm cập nhật khách hàng
  $scope.CapNhatKhachHang = function(){
    // check trống các trường thuộc tính
    if (!$scope.FindKhachHang.hovatenkh || !$scope.FindKhachHang.ngaysinh || !$scope.FindKhachHang.sodienthoai || !$scope.FindKhachHang.email ||
      !$scope.FindKhachHang.diachichitiet || !$scope.FindKhachHang.phuongxa || !$scope.FindKhachHang.quanhuyen || !$scope.FindKhachHang.tinhthanh ||
      !$scope.FindKhachHang.gioitinh || !$scope.FindKhachHang.trangthai
    ) {
      Swal.fire({
        title: "Warning",
        text: "Vui lòng điền đầy đủ thông tin",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    // check định dạng số điện thoai 
    if (!sdtRegex.test($scope.FindKhachHang.sodienthoai)) {
      Swal.fire({
        title: "Thông Báo",
        text: "Vui lòng kiểm tra định dạng số điện thoại",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    // check định dạng email
    if (!emailRegex.test($scope.FindKhachHang.email)) {
      Swal.fire({
        title: "Thông Báo",
        text: "Vui lòng kiểm tra định dạng email",
        icon: "warning",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    Swal.fire({
      title: "Xác Nhận",
      text: "Bạn có muốn cập nhật khách hàng không ?",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Hủy Bỏ",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Xác Nhận",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if (role != null) {
          var url = "http://localhost:8080/api/admin/quan-ly-khach-hang/update-khach-hang";
          var image = $scope.selectedImageName == "" ? $scope.FindKhachHang.image : $scope.selectedImageName;
          var data = {
            id: idkhachhang,
            hovatenkh: $scope.FindKhachHang.hovatenkh,
            image: image,
            ngaysinh: $scope.FindKhachHang.ngaysinh,
            sodienthoai: $scope.FindKhachHang.sodienthoai,
            email: $scope.FindKhachHang.email,
            diachichitiet: $scope.FindKhachHang.diachichitiet,
            phuongxa: $scope.FindKhachHang.phuongxa,
            quanhuyen: $scope.FindKhachHang.quanhuyen,
            tinhthanh: $scope.FindKhachHang.tinhthanh,
            gioitinh: $scope.FindKhachHang.gioitinh,
            trangthai: $scope.FindKhachHang.trangthai,
            mota: $scope.FindKhachHang.mota
          };

          $http.put(url, data, config)
            .then((resp) => {
              Swal.fire({
                title: "Thành Công",
                text: "Cập nhật khách hàng thành công",
                icon: "success",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                $scope.LoadKhachHang();
                $scope.FindByKhachHang();
                $scope.LamMoiCapNhat();
              });
            })
            .catch((error) => {
              console.log("Lỗi cập nhật khách hàng !", error);
            });
        }
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    });
  }
});
