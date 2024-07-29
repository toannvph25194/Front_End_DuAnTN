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
    // Khởi tạo các biến phân trang
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10; // Số lượng nhân viên trên mỗi trang
    $scope.totalItems = 0;
    $scope.totalPages = 0;



    // Hàm để chuyển trạng thái của nhân viên
    $scope.toggleStatus = function (nhanVien) {
      var newStatus = nhanVien.trangthai === 1 ? 0 : 1;
      var apiUrl =
        "http://localhost:8080/api/admin/quan-ly-nhan-vien/" +
        nhanVien.idnv +
        "/updateTrangThai";

      $http
        .put(
          apiUrl,
          { trangthai: newStatus },
          config
        )
        .then(function (response) {
          nhanVien.trangthai = newStatus;
          Swal.fire({
            title: "Success",
            text: "Cập nhật trạng thái thành công!",
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          console.log("Cập nhật trạng thái thành công:", response.data);
        })
        .catch(function (error) {
          Swal.fire({
            title: "Error",
            text: "Lỗi khi cập nhật trạng thái!",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          console.error("Lỗi khi cập nhật trạng thái:", error);
        });
    };

    function generateUniqueId() {
      const timestamp = Date.now().toString(); // Chuyển timestamp thành chuỗi
      const lastFiveDigits = timestamp.slice(-5); // Lấy 3 số cuối cùng
      return "NV" + lastFiveDigits; // Kết hợp với tiền tố và 3 số cuối
    }

    // Hàm để tạo mật khẩu ngẫu nhiên (matkhau)
    function generateRandomPassword(length) {
      var length = 8;
      var length = 8; // Đặt độ dài mật khẩu là 8 ký tự
      var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var password = "";
      for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }
      return password;
    }

    // Hàm để tạo tên tài khoản (taikhoan) dựa trên mã nhân viên
    function generateUniqueUsername(manv) {
      return "TKNV" + manv.slice(-5); // Lấy 5 ký tự cuối của mã nhân viên
    }

    $scope.handleFileSelect = function (event) {
      const fileList = event.target.files; // Danh sách các tệp đã chọn
      if (fileList.length > 0) {
        const selectedFile = fileList[0]; // Lấy tệp đầu tiên
        $scope.selectedImageName = selectedFile.name; // Lưu tên của tệp vào $scope
        console.log("Tên tệp đã chọn:", $scope.selectedImageName);

        // Sử dụng FileReader để đọc tệp ảnh và hiển thị lên giao diện
        const reader = new FileReader();
        reader.onload = function (e) {
          $scope.$apply(function () {
            $scope.selectedImage = e.target.result; // Lưu nội dung của tệp ảnh vào $scope để hiển thị
          });
        };
        reader.readAsDataURL(selectedFile); // Đọc tệp ảnh thành URL dưới dạng Data URL
      }
    };

    // Hàm để kiểm tra định dạng email
    function validateEmail(email) {
      var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailPattern.test(email);
    }

    // Hàm để kiểm tra định dạng số điện thoại
    function validatePhoneNumber(phoneNumber) {
      var phonePattern = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      return phonePattern.test(phoneNumber);
    }

    // Hàm để tạo nhân viên mới
    $scope.createNhanVien = async function () {
      try {
        // Kiểm tra các trường bắt buộc
        if (
          !$scope.email ||
          !$scope.hovatennv ||
          !$scope.selectedgioitinh ||
          !$scope.ngaysinh ||
          !$scope.sodienthoai ||
          !$scope.mota ||
          !$scope.diachi ||
          !$scope.selectedtrangthai
        ) {
          await Swal.fire({
            title: "Error",
            text: "Vui lòng điền tất cả các trường bắt buộc!",
            icon: "error",
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
            title: "Error",
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
        if (!validatePhoneNumber($scope.sodienthoai)) {
          await Swal.fire({
            title: "Error",
            text: "Định dạng số điện thoại không hợp lệ!",
            icon: "error",
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
            title: "Error",
            text: "Địa chỉ email đã được sử dụng!",
            icon: "error",
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
            title: "Error",
            text: "Số điện thoại đã được sử dụng!",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Hiển thị hộp thoại xác nhận sau khi tất cả các kiểm tra thành công
        const confirmResult = await Swal.fire({
          title: 'Bạn có chắc chắn muốn thêm nhân viên?',
          text: 'Hãy xác nhận để tiếp tục.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Hủy bỏ'
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
          "http://localhost:8080/api/admin/quan-ly-nhan-vien/themNhanVien",
          registrationData,
          config
        );

        console.log("Thêm nhân viên thành công:", response.data);
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
          $window.location.href = "#/nhan-vien";
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

    //Hàm lấy id của để update
    $scope.initNhanVien = function () {
      // Replace with the actual employee ID you need to fetch
      $http
        .get(`http://localhost:8080/api/admin/quan-ly-nhan-vien/${idnhanvien}`, config)
        .then(function (response) {
          $scope.nhanVien = response.data;
          console.log("detai", $scope.nhanVien);
          $scope.nhanVien.ngaysinh = new Date(response.data.ngaysinh);
          $scope.nhanVien.gioitinh = $scope.nhanVien.gioitinh.toString();
        })
        .catch(function (error) {
          console.error("Error fetching employee data:", error);
        });
    };
    if (idnhanvien != null) {
      $scope.initNhanVien();
    }


    // Định nghĩa hàm handleFileSelect01 trong phạm vi $scope
    $scope.handleFileSelect01 = function (event) {
      const fileList = event.target.files;
      if (fileList.length > 0) {
        const selectedFile = fileList[0];
        const reader = new FileReader();

        reader.onload = function (e) {
          $scope.$apply(function () {
            $scope.selectedImage = e.target.result; // Cập nhật URL dữ liệu của hình ảnh
            $scope.nhanVien.image = selectedFile.name; // Cập nhật tên tệp nếu cần
          });
        };

        reader.readAsDataURL(selectedFile); // Đọc tệp và tạo URL dữ liệu
        console.log("Tên tệp đã chọn:", $scope.nhanVien.image);
      }
    };

    $scope.refreshForm = function () {
      // Giả sử $scope.originalNhanVien chứa trạng thái ban đầu của nhanVien
      //Hàm để fix lỗi làm mới vẫn update được
      $scope.nhanVien = angular.copy($scope.originalNhanVien);
    };

    // Modified updateNhanVien function
    $scope.updateNhanVien = async function () {
      try {
        // Kiểm tra các trường bắt buộc
        if (
          !$scope.nhanVien ||
          !$scope.nhanVien.hovatennv ||
          !$scope.nhanVien.email ||
          !$scope.nhanVien.sodienthoai ||
          !$scope.nhanVien.diachi ||
          !$scope.nhanVien.ngaysinh
        ) {
          await Swal.fire({
            title: "Thông Báo",
            text: "Vui lòng nhập đầy đủ thông tin !",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        // Kiểm tra định dạng email
        if (!validateEmail($scope.nhanVien.email)) {
          await Swal.fire({
            title: "Error",
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
        if (!validatePhoneNumber($scope.nhanVien.sodienthoai)) {
          await Swal.fire({
            title: "Error",
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
        const confirmResult = await Swal.fire({
          title: 'Xác Nhận',
          text: 'Bạn có muốn cập nhật nhân viên không ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Hủy bỏ'
        });

        if (!confirmResult.isConfirmed) {
          return; // Nếu người dùng chọn hủy, không thực hiện các bước tiếp theo
        }

        // Thực hiện cập nhật dữ liệu nhân viên
        let response = await $http.put(
          `http://localhost:8080/api/admin/quan-ly-nhan-vien/update-nhan-vien?id=${idnhanvien}`,
          $scope.nhanVien,
          config
        );

        // Kiểm tra phản hồi từ server
        if (response.status !== 200) {
          throw new Error('Lỗi từ server khi cập nhật dữ liệu nhân viên.');
        }

        console.log("Cập nhật nhân viên thành công:", response.data);
        await Swal.fire({
          title: "Success",
          text: "Cập nhật thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        // Cập nhật scope với dữ liệu mới
        $scope.nhanVien = response.data;
        setTimeout(function () {
          $route.reload(); // Tải lại route để cập nhật dữ liệu
        }, 1500);

      } catch (error) {
        console.error("Lỗi cập nhật dữ liệu nhân viên:", error);
        await Swal.fire({
          title: "Error",
          text: `Lỗi cập nhật dữ liệu nhân viên: ${error.message}`,
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };


    $scope.searchNhanVien = function () {
      var queryParams = {
        search: $scope.searchText || "",
        trangthai: $scope.selectedStatus,
        page: $scope.currentPage !== 0 ? $scope.currentPage - 1 : 0,
        size: $scope.itemsPerPage || 10,
      };

      $http({
        method: "GET",
        url: "http://localhost:8080/api/admin/quan-ly-nhan-vien/search",
        params: queryParams,
        headers: config.headers,
      })
        .then(function (response) {
          console.log("Kết quả tìm kiếm:", response.data);
          $scope.nhanVienList = response.data.content;

          // Update pagination information
          $scope.totalItems = response.data.totalElements;
          $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);

          // Ensure currentPage is within totalPages
          if ($scope.currentPage > $scope.totalPages) {
            $scope.currentPage = $scope.totalPages;
          }

          // If currentPage is 0 and there are pages, set currentPage to 1
          if ($scope.totalPages > 0 && $scope.currentPage === 0) {
            $scope.currentPage = 1;
          }
        })
        .catch(function (error) {
          console.error("Tìm kiếm thất bại:", error);
          alert("Tìm kiếm nhân viên thất bại");
        });
    };

    //Làm mới input tìm kiếm
    $scope.resetSearch = function () {
      $scope.searchText = '';  // Đặt lại giá trị tìm kiếm
      $scope.selectedStatus = '';  // Đặt lại trạng thái chọn
      $scope.getAllNhanVien($scope.currentPage);  // Gọi hàm tìm kiếm để cập nhật danh sách
    };

    $scope.getAllNhanVien = function (page) {
      var apiUrl = "http://localhost:8080/api/admin/quan-ly-nhan-vien/all";

      // Thêm các tham số phân trang vào URL
      var params = {
        page: page || 0, // Điều chỉnh về 0-indexed
        size: $scope.itemsPerPage,
      };

      // Gọi $http để thực hiện HTTP GET request
      $http
        .get(apiUrl, {
          params: params,
          headers: config.headers,
        })
        .then(function (response) {
          // Xử lý dữ liệu nhận được nếu request thành công
          $scope.nhanVienList = response.data.content;
          $scope.totalItems = response.data.totalElements;
          $scope.totalPages = Math.ceil(
            $scope.totalItems / $scope.itemsPerPage
          );
          console.log(response.data);
        })
        .catch(function (error) {
          // Xử lý các lỗi nếu request không thành công
          console.error("Lỗi load nhân viên : ", error);
        });
    };

    $scope.getAllNhanVien($scope.currentPage);

    $scope.previousPage = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        if ($scope.searchText || $scope.selectedStatus) {
          $scope.searchNhanVien(); // Gọi lại hàm tìm kiếm để load dữ liệu của trang trước
        } else {
          $scope.getAllNhanVien($scope.currentPage);
        }
      }
    };

    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        if ($scope.searchText || $scope.selectedStatus) {
          $scope.searchNhanVien(); // Gọi lại hàm tìm kiếm để load dữ liệu của trang tiếp theo
        } else {
          $scope.getAllNhanVien($scope.currentPage);
        }
      }
    };

    $scope.pageChanged = function () {
      if ($scope.currentPage >= 1 && $scope.currentPage <= $scope.totalPages) {
        if ($scope.searchText || $scope.selectedStatus) {
          $scope.searchNhanVien(); // Gọi lại hàm tìm kiếm để load dữ liệu của trang mới
        } else {
          $scope.getAllNhanVien($scope.currentPage);
        }
      }
    };

  }
}
);
