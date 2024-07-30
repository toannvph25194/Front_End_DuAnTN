app.controller("QuanLyNhanVien", function ($scope, $http, $window, $routeParams, $route) {
  // Lấy access token từ local storage
  var token = $window.localStorage.getItem("accessToken");
  var role = $window.localStorage.getItem("role");
  var idnhanvien = $routeParams.id;
  console.log("Idnv :", idnhanvien);
  if (role == null) {
    Swal.fire({
      title: "Bạn cần phải đăng nhập !",
      text: "Vui lòng đăng nhập để sử dụng chức năng !",
      icon: "warning",
    });
    // Chuyển hướng người dùng đến trang đăng nhập
    $window.location.href = '#/login';
  }
  if (role == "NHANVIEN") {
    Swal.fire({
      title: "Bạn không có quyền truy cập !",
      text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết !",
      icon: "warning",
    });
    $window.history.back();
  }
  $scope.isAdmin = false;
  function getRole() {
    if (role === "ADMIN") {
      $scope.isAdmin = true;
    }
  }
  getRole();

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  if (role === "ADMIN") {

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
          $scope.LocNhanVienTheoNhieuTC();
        } else if ($scope.isFilterTrangThai) {
          $scope.LocNhanVienTheoTrangThai();
        } else {
          $scope.LoadNhanVien();
        }
      }
    };

    // Hàm xử lý next trang
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        if ($scope.isFilteringTieuChi) {
          $scope.LocNhanVienTheoNhieuTC();
        } else if ($scope.isFilterTrangThai) {
          $scope.LocNhanVienTheoTrangThai();
        } else {
          $scope.LoadNhanVien();
        }
      }
    };

    // Load all nhân viên
    $scope.LoadNhanVien = function () {
      $scope.isFilteringTieuChi = false;
      $scope.isFilterTrangThai = false;
      $http.get('http://localhost:8080/api/admin/quan-ly-nhan-vien/hien-thi?page=' + ($scope.currentPage - 1), config)
        .then((resp) => {
          $scope.nhanVienList = resp.data.content;
          console.log("Load nhân viên :", $scope.nhanVienList);
          // Tổng số bản ghi
          $scope.totalItems = resp.data.totalElements;
          // Tổng số trang
          $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        })
        .catch((error) => {
          console.log("Lỗi load nhân viên !", error);
        });
    }
    if (role != null) {
      $scope.LoadNhanVien();
    }

    // Hàm làm mới ô lọc
    $scope.LamMoiLoc = function () {
      $scope.search = "";
      $scope.trangthai = "";
      $scope.LoadNhanVien();
    }

    // Hàm lọc nhân viên theo nhiều tiêu chí
    $scope.LocNhanVienTheoNhieuTC = function () {
      $scope.isFilteringTieuChi = true;
      $http.get('http://localhost:8080/api/admin/quan-ly-nhan-vien/loc-tieu-chi?page=' + ($scope.currentPage - 1) + '&search=' + $scope.search, config)
        .then((resp) => {
          $scope.nhanVienList = resp.data.content;
          console.log("Lọc nhân viên theo tiêu chí :", $scope.nhanVienList);
          // Tổng số bản ghi
          $scope.totalItems = resp.data.totalElements;
          // Tổng số trang
          $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        })
        .catch((error) => {
          console.log("Lỗi lọc nhân viên theo tiêu chí !", error);
        });
    }

    // Hàm lọc nhân viên theo trạng thái
    $scope.LocNhanVienTheoTrangThai = function () {
      $scope.isFilterTrangThai = true;
      var trangthai = $scope.trangthai || "";
      if (trangthai == "") {
        $scope.LoadNhanVien();
      } else {
        $http.get('http://localhost:8080/api/admin/quan-ly-nhan-vien/loc-trang-thai?page=' + ($scope.currentPage - 1) + '&trangthai=' + trangthai, config)
          .then((resp) => {
            $scope.nhanVienList = resp.data.content;
            console.log("Lọc nhân viên theo trạng thái :", $scope.nhanVienList);
            // Tổng số bản ghi
            $scope.totalItems = resp.data.totalElements;
            // Tổng số trang
            $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
          })
          .catch((error) => {
            console.log("Lỗi lọc nhân viên theo trạng thái !", error);
          });
      }
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


    // Hàm kiểm tra định dạng gmail
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    // Hàm kiểm tra định dạng số điện thoại
    function validatePhoneNumber(phone) {
      const phoneRegex = /^\d{10,}$/;
      return phoneRegex.test(phone);
    }



    //Hàm tạo mã nhân viên
    function generateUniqueId() {
      const timestamp = Date.now().toString(); // Chuyển timestamp thành chuỗi
      const lastFiveDigits = timestamp.slice(-5); // Lấy 5 số cuối cùng
      return "NV" + lastFiveDigits; // Kết hợp với tiền tố và 5 số cuối
    }
    // Hàm để tạo mật khẩu ngẫu nhiên (matkhau)
    function generateRandomPassword() {
      const prefix = "nv"; // Phần đầu của mật khẩu
      const numberLength = 5; // Số lượng chữ số ngẫu nhiên
      // Tạo chuỗi số ngẫu nhiên
      let numbers = "";
      for (let i = 0; i < numberLength; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Chọn số từ 0 đến 9
        numbers += randomDigit;
      }
      // Tạo mật khẩu hoàn chỉnh
      const password = prefix + numbers;
      return password;
    }
    // Hàm để tạo tên tài khoản (taikhoan) dựa trên mã nhân viên
    function generateUniqueUsername(manv) {
      return "TKNV" + manv.slice(-5); // Lấy 5 ký tự cuối của mã nhân viên
    }



    // Hàm làm mới thêm nhân viên
    $scope.LamMoi = function () {
      $scope.email = "";
      $scope.hovatennv = "";
      $scope.ngaysinh = "";
      $scope.sodienthoai = "";
      $scope.email = "";
      $scope.diachi = "";
      $scope.selectedgioitinh = "";
      $scope.selectedtrangthai = "";
      $scope.mota = "";
      $scope.LoadNhanVien();
    }
    // Hàm thêm nhân viên
    $scope.createNhanVien = async function () {
      try {
        // Kiểm tra các trường bắt buộc
        if (
          !$scope.email ||
          !$scope.hovatennv ||
          !$scope.selectedgioitinh ||
          !$scope.ngaysinh ||
          !$scope.sodienthoai ||
          !$scope.diachi ||
          !$scope.selectedtrangthai
        ) {
          await Swal.fire({
            title: "Thông báo",
            text: "Vui lòng điền đầy đủ thông tin",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        // Kiểm tra định dạng email
        if (!validateEmail($scope.email)) {
          await Swal.fire({
            title: "Thông báo",
            text: "Định dạng email không hợp lệ!",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        // Kiểm tra định dạng số điện thoại
        if (!validatePhoneNumber($scope.sodienthoai)) {
          await Swal.fire({
            title: "Thông báo",
            text: "Định dạng số điện thoại không hợp lệ!",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        // Kiểm tra sự tồn tại của email
        let response = await $http.get("http://localhost:8080/api/admin/quan-ly-nhan-vien/check-email", {
          params: { email: $scope.email },
          headers: config.headers,
        });

        if (response.data === true) {
          await Swal.fire({
            title: "Thông báo",
            text: "Địa chỉ email đã được sử dụng!",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Kiểm tra sự tồn tại của số điện thoại
        response = await $http.get("http://localhost:8080/api/admin/quan-ly-nhan-vien/check-phone", {
          params: { phone: $scope.sodienthoai },
          headers: config.headers,
        });

        if (response.data === true) {
          await Swal.fire({
            title: "Thông Báo",
            text: "Số điện thoại đã được sử dụng!",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Hiển thị hộp thoại xác nhận sau khi tất cả các kiểm tra thành công
        const confirmResult = await Swal.fire({
          title: "Xác Nhận",
          text: "Bạn có muốn thêm nhân viên không ?",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy Bỏ",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác Nhận",
          reverseButtons: true,
        });

        if (!confirmResult.isConfirmed) {
          return; // Nếu người dùng chọn hủy, không thực hiện các bước tiếp theo
        }

        // Tiếp tục quá trình tạo nhân viên nếu không có lỗi
        var email = $scope.email;
        var manv = generateUniqueId();
        var matkhau = generateRandomPassword(8);
        var taikhoan = generateUniqueUsername(manv);
        var registrationData = {
          email: email,
          manv: manv,
          hovatennv: $scope.hovatennv,
          gioitinh: $scope.selectedgioitinh,
          ngaysinh: $scope.ngaysinh,
          sodienthoai: $scope.sodienthoai,
          image: $scope.selectedImageName,
          mota: $scope.mota,
          diachi: $scope.diachi,
          trangthai: $scope.selectedtrangthai,
          chucvu: 1,
          matkhau: matkhau,
          taikhoan: taikhoan,
        };

        response = await $http.post(
          "http://localhost:8080/api/admin/quan-ly-nhan-vien/them-nhan-vien", // Ensure this URL matches your API endpoint
          registrationData,
          config
        );

        await Swal.fire({
          title: "Success",
          text: "Thêm nhân viên thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        setTimeout(function () {
          $scope.LoadNhanVien();
          $scope.LamMoi();
        }, 1500);

      } catch (error) {
        console.error("Lỗi khi thêm:", error);
        await Swal.fire({
          title: "Error",
          text: "Lỗi thêm!",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    // Hàm làm mới cập nhật nhân viên
    $scope.LamMoiCapNhatNhanVien = function () {
      $scope.FindNhanVien.hovatenkh = "";
      $scope.FindNhanVien.ngaysinh = "";
      $scope.FindNhanVien.sodienthoai = "";
      $scope.FindNhanVien.email = "";
      $scope.FindNhanVien.diachi = "";
      $scope.FindNhanVien.gioitinh = "";
      $scope.FindNhanVien.trangthai = "";
      $scope.FindNhanVien.mota = "";
    }
    // Hàm cập nhật nhân viên
    $scope.updateNhanVien = function () {
      try {
        // Đảm bảo $scope.FindNhanVien đã được khởi tạo
        $scope.FindNhanVien = $scope.FindNhanVien || {};

        // Kiểm tra các trường bắt buộc
        if (
          !$scope.FindNhanVien.hovatennv ||
          !$scope.FindNhanVien.email ||
          !$scope.FindNhanVien.sodienthoai ||
          !$scope.FindNhanVien.diachi ||
          !$scope.FindNhanVien.ngaysinh ||
          !$scope.FindNhanVien.gioitinh
        ) {
            Swal.fire({
            title: "Thông Báo",
            text: "Vui lòng nhập đầy đủ thông tin!",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Kiểm tra định dạng email
        if (!validateEmail($scope.FindNhanVien.email)) {
            Swal.fire({
            title: "Thông Báo",
            text: "Định dạng email không hợp lệ!",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        // Kiểm tra định dạng số điện thoại
        if (!validatePhoneNumber($scope.FindNhanVien.sodienthoai)) {
            Swal.fire({
            title: "Thông Báo",
            text: "Định dạng số điện thoại không hợp lệ!",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Hiển thị hộp thoại xác nhận
        const confirmResult = Swal.fire({
          title: 'Xác Nhận',
          text: 'Bạn có muốn cập nhật nhân viên không?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Hủy bỏ'
        });

        if (!confirmResult.isConfirmed) {
          return;
        }
        // Định nghĩa URL và cấu hình
        const url = `http://localhost:8080/api/admin/quan-ly-nhan-vien/update-nhan-vien?id=${idnhanvien}`;
        const config = {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        };

        var image = $scope.selectedImageName == "" ? $scope.FindNhanVien.image : $scope.selectedImageName;
        var data = {
          id: idnhanvien,
          hovatennv: $scope.FindNhanVien.hovatennv,
          image: image,
          ngaysinh: $scope.FindNhanVien.ngaysinh,
          sodienthoai: $scope.FindNhanVien.sodienthoai,
          email: $scope.FindNhanVien.email,
          diachi: $scope.FindNhanVien.diachi,
          gioitinh: $scope.FindNhanVien.gioitinh,
          mota: $scope.FindNhanVien.mota
        };

        // Gỡ lỗi: Ghi lại chi tiết yêu cầu
        console.log("Request URL:", url);
        console.log("Request Data:", data);
        console.log("Config:", config);
        // Thực hiện yêu cầu PUT
        let response = $http.put(url, data, config);
        // Kiểm tra mã phản hồi từ server
        if (response.status !== 200) {
          throw new Error(`Lỗi từ server khi cập nhật dữ liệu nhân viên. Mã lỗi: ${response.status}`);
        }
          Swal.fire({
          title: "Thành Công",
          text: "Cập nhật thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        // Cập nhật scope với dữ liệu mới
        $scope.FindNhanVien = response.data;
        setTimeout(function () {
          $scope.LoadNhanVien();
          $scope.FindByNhanVien();
        }, 1500);
      } catch (error) {
        console.error("Lỗi cập nhật dữ liệu nhân viên:", error);
          Swal.fire({
          title: "Lỗi",
          text: `Lỗi cập nhật dữ liệu nhân viên: ${error.message}`,
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };


    // Hàm find khách hàng theo id
    $scope.FindByNhanVien = function () {
      $http.get('http://localhost:8080/api/admin/quan-ly-nhan-vien/find-nhan-vien?id=' + idnhanvien, config)
        .then((resp) => {
          $scope.FindNhanVien = resp.data;
          // Chuyển đổi ngaysinh thành đối tượng Date
          if ($scope.FindNhanVien.ngaysinh) {
            $scope.FindNhanVien.ngaysinh = new Date($scope.FindNhanVien.ngaysinh);
          }
          console.log("Find Nhân Viên :", $scope.FindNhanVien);
          $scope.FindNhanVien.gioitinh = $scope.FindNhanVien.gioitinh.toString();
          $scope.FindNhanVien.trangthai = $scope.FindNhanVien.trangthai.toString();
        })
        .catch((error) => {
          console.log("Lỗi Find Nhân Viên !", error);
        });
    }
    if (idnhanvien != null) {
      $scope.FindByNhanVien();
    }


    // Hàm chuyển trạng thái khách hàng
    $scope.CapNhatTrangThai = function (nhanvien) {
      var trangthai = nhanvien.trangthai == 1 ? 0 : 1;
      var url = 'http://localhost:8080/api/admin/quan-ly-nhan-vien/update-trang-thai?id=' + nhanvien.id + '&trangthai=' + trangthai;
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
            $scope.LoadNhanVien();
          });
        })
        .catch((error) => {
          console.log("Lỗi cập nhật trạng thái nhân viên !", error);
        });
    }
  }
});
