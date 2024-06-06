// Khai báo service
app.service("updateshoadonService", function ($http) {
  var token = localStorage.getItem("accessToken");

  // Thêm token vào header của yêu cầu
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  this.getHoaDonTheoIds = function (IdHD) {
    return $http
      .get("http://localhost:8080/api/admin/hoadon/hienthihoadontheoid", {
        params: { IdHD: IdHD },
        headers: config.headers,
      })
      .then(function (response) {
        return response.data;
      });
  };
  this.getHoaDonCHiTietTheoIds = function (IdHD) {
    return $http
      .get(
        "http://localhost:8080/api/admin/hoadonchitiet/hienthihoadonchitiettheoid",
        {
          params: { IdHD: IdHD },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.getHinhThucThanhToanTheoIds = function (IdHD) {
    return $http
      .get(
        "http://localhost:8080/api/admin/hinhthucthanhtoan/hienthihinhthucthanhtoantheoid",
        {
          params: { IdHD: IdHD },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateHoaDonThongTin = function (IdHD, hoaDonTrangThaiAdminRequest) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hoadon/updatethongtinhoadon/" + IdHD,
        hoaDonTrangThaiAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateHoaDonTrangThai = function (IdHD, hoaDonTrangThaiAdminRequest) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hoadon/updatetrangthaihoadon/" + IdHD,
        hoaDonTrangThaiAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateThongTinNguoiGiao = function (IdHD, hoaDonTrangThaiAdminRequest) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hoadon/updatethongtinnguoigiao/" +
          IdHD,
        hoaDonTrangThaiAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateHoaDonHoanThanh = function (IdHD, hoaDonTrangThaiAdminRequest) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hoadon/updatehoadonhoanthanh/" + IdHD,
        hoaDonTrangThaiAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updatehinhthucthanhtoan = function (
    idhttt,
    hoaDonTrangThaiAdminRequest
  ) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hinhthucthanhtoan/updatehinhthucthanhtoan/" +
          idhttt,
        hoaDonTrangThaiAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
});

// Khai báo controller
app.controller(
  "updatehoadonController",
  function ($scope, updateshoadonService, $window, $route, $document) {
    var role = $window.localStorage.getItem("role");

    if (role == null) {
      // Hiển thị thông báo khi chưa đăng nhập
      Swal.fire({
        title: "Bạn cần phải đăng nhập !",
        text: "Vui lòng đăng nhập để sử dụng chức năng !",
        icon: "warning",
      });
      // Chuyển hướng người dùng đến trang đăng nhập
      $window.location.href =
        "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
    }

    // Kiểm tra quyền và đặt biến isAdmin
    $scope.isAdmin = false;
    function getRole() {
      if (role === "ADMIN" || role === "NHANVIEN") {
        $scope.isAdmin = true;
      }
    }
    getRole();

    // Thực hiện các hành động khác nếu người dùng là admin hoặc nhân viên
    if (role === "ADMIN" || role === "NHANVIEN") {
      // Sử dụng $document.ready() của AngularJS để thực hiện mã sau khi DOM đã được tải hoàn toàn
      $document.ready(function () {
        var showFormButton = document.getElementById("showFormButton");
        var editForm = document.getElementById("editForm");

        if (showFormButton && editForm) {
          showFormButton.addEventListener("click", function () {
            editForm.classList.toggle("hidden");
          });
        }
      });
      // hiển thị hoá đơn theo id hoá đơn
      $scope.xemHoaDonTheoId = function () {
        var maspInput = localStorage.getItem("IDHoaDonUpdate");

        if (maspInput) {
          updateshoadonService
            .getHoaDonTheoIds(maspInput)
            .then(function (data) {
              console.log("Dữ liệu hoá đơn trả về:", data);
              // Kiểm tra nếu data là một mảng và có ít nhất một phần tử
              if (Array.isArray(data) && data.length > 0) {
                $scope.HoaDonTheoId = data[0];
                console.log("Thông tin chi tiết hoá đơn:", $scope.HoaDonTheoId);
              } else if (
                data &&
                typeof data === "object" &&
                Object.keys(data).length > 0
              ) {
                // Kiểm tra nếu data là một đối tượng và không rỗng
                $scope.HoaDonTheoId = data;
                console.log("Thông tin chi tiết hoá đơn:", $scope.HoaDonTheoId);
              } else {
                console.error("Không tìm thấy hoá đơn với IdSP:", maspInput);
              }
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
            });
        } else {
          console.error("Không có IdSP trong localStorage");
        }
      };
      $scope.xemHoaDonTheoId();

      // hiển thị hoá đơn chi tiết theo id hoá đơn
      $scope.xemHoaDonChiTietTheoId = function () {
        var maspInput = localStorage.getItem("IDHoaDonUpdate");

        if (maspInput) {
          updateshoadonService
            .getHoaDonCHiTietTheoIds(maspInput)
            .then(function (data) {
              console.log("Dữ liệu hoá đơn chi tiết trả về:", data);
              // Kiểm tra nếu data là một mảng và có ít nhất một phần tử
              if (Array.isArray(data) && data.length > 0) {
                $scope.HoaDonCTList = data;
                console.log("Danh sách chi tiết hoá đơn:", $scope.HoaDonCTList);
              } else if (
                data &&
                typeof data === "object" &&
                Object.keys(data).length > 0
              ) {
                // Kiểm tra nếu data là một đối tượng và không rỗng
                $scope.HoaDonCTList = [data];
                console.log("Danh sách chi tiết hoá đơn:", $scope.HoaDonCTList);
              } else {
                console.error("Không tìm thấy hoá đơn với IdSP:", maspInput);
              }
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
            });
        } else {
          console.error("Không có IdSP trong localStorage");
        }
      };
      $scope.xemHoaDonChiTietTheoId();

      $scope.xemHinhThucThanhToanTheoId = function () {
        var maspInput = localStorage.getItem("IDHoaDonUpdate");

        if (maspInput) {
          updateshoadonService
            .getHinhThucThanhToanTheoIds(maspInput)
            .then(function (data) {
              console.log("Dữ liệu hoá đơn chi tiết trả về:", data);
              // Kiểm tra nếu data là một mảng và có ít nhất một phần tử
              if (Array.isArray(data) && data.length > 0) {
                $scope.HinhThucThanhToanList = data;
                console.log("Danh sách HTTT:", $scope.HinhThucThanhToanList);
              } else if (
                data &&
                typeof data === "object" &&
                Object.keys(data).length > 0
              ) {
                // Kiểm tra nếu data là một đối tượng và không rỗng
                $scope.HinhThucThanhToanList = [data];
                console.log("Danh sách HTTT:", $scope.HinhThucThanhToanList);
              } else {
                console.error("Không tìm thấy hoá đơn với IdSP:", maspInput);
              }
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
            });
        } else {
          console.error("Không có IdSP trong localStorage");
        }
      };
      $scope.xemHinhThucThanhToanTheoId();
      // Hàm lấy thông tin hình thức thanh toán theo ID hóa đơn
      $scope.xemHinhThucThanhToanTheoId = function () {
        var maspInput = localStorage.getItem("IDHoaDonUpdate");

        if (maspInput) {
          updateshoadonService
            .getHinhThucThanhToanTheoIds(maspInput)
            .then(function (data) {
              console.log("Dữ liệu hoá đơn chi tiết trả về:", data);
              if (
                data &&
                typeof data === "object" &&
                Object.keys(data).length > 0
              ) {
                $scope.HinhThucThanhToan = data;
                console.log("Hình thức thanh toán:", $scope.HinhThucThanhToan);
              } else {
                console.error("Không tìm thấy hoá đơn với IdSP:", maspInput);
              }
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
            });
        } else {
          console.error("Không có IdSP trong localStorage");
        }
      };
      $scope.xemHinhThucThanhToanTheoId();

      $scope.validateHoaDon = function () {
        if (
          !$scope.HoaDonTheoId.tiengiaohang ||
          isNaN($scope.HoaDonTheoId.tiengiaohang)
        ) {
          Swal.fire({
            title: "Lỗi!",
            text: "Tiền ship phải là một số và không được để trống.",
            icon: "error",
          });
          return false;
        }
        // Add other validation checks if needed
        return true;
      };

      $scope.updateThongTinHoaDon = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy thông tin hóa đơn để cập nhật.",
            icon: "error",
          });
          return;
        }

        if (!$scope.validateHoaDon()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          sdtnguoinhan: $scope.HoaDonTheoId.sdtnguoinhan,
          emailnguoinhan: $scope.HoaDonTheoId.emailnguoinhan,
          tiengiaohang: $scope.HoaDonTheoId.tiengiaohang,
          diachinhanhang: $scope.HoaDonTheoId.diachinhanhang,
        };

        updateshoadonService
          .updateHoaDonThongTin(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log("Cập nhật thông tin hóa đơn thành công:", data);
            Swal.fire({
              title: "Thành công!",
              text: "Thông tin hóa đơn đã được cập nhật.",
              icon: "success",
            });

            // Gọi hàm isTiengiaohangNull sau khi quá trình cập nhật hoàn tất
            $route.reload();
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin hóa đơn:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra khi cập nhật thông tin hóa đơn.",
              icon: "error",
            });
          });
      };

      $scope.validateHoaDonTrangThai = function () {
        if ($scope.HoaDonTheoId.tiengiaohang === null) {
          Swal.fire({
            title: "Lỗi!",
            text: "Bạn phải cập nhật tiền ship trước để có thể cập nhật hoá đơn.",
            icon: "error",
          });
          return false;
        }
        if (!$scope.GhiChu || $scope.GhiChu.length <= 30) {
          Swal.fire({
            title: "Lỗi!",
            text: "Ghi chú phải có ít nhất 30 ký tự.",
            icon: "error",
          });
          return false;
        }

        // Add other validation checks if needed
        return true;
      };

      $scope.updateTrangThaiHoaDon = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy thông tin hóa đơn để cập nhật.",
            icon: "error",
          });
          return;
        }

        if (!$scope.validateHoaDonTrangThai()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: $scope.GhiChu,
          trangthai: 2, // Đặt trạng thái mặc định thành 2
        };

        updateshoadonService
          .updateHoaDonTrangThai(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log(
              "Cập nhật trạng thái hóa đơn sang đã xác nhận thành công:",
              data
            );
            Swal.fire({
              title: "Thành công!",
              text: "Trạng thái hóa đơn đã được cập nhật sang đã xác nhận.",
              icon: "success",
            });

            // Chờ 2 giây trước khi chuyển hướng
            setTimeout(function () {
              window.location.href = "#/updatehoadondaxacnhan";
            }, 2000);
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn.",
              icon: "error",
            });
          });
      };

      $scope.updateTrangThaiHoaDonDaXAcNhan = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy thông tin hóa đơn để cập nhật.",
            icon: "error",
          });
          return;
        }

        if (!$scope.validateHoaDonTrangThai()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: $scope.GhiChu,
          trangthai: 3, // Đặt trạng thái mặc định thành 2
        };

        updateshoadonService
          .updateHoaDonTrangThai(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log(
              "Cập nhật trạng thái hóa đơn sang chờ giao thành công:",
              data
            );
            Swal.fire({
              title: "Thành công!",
              text: "Trạng thái hóa đơn đã được cập nhật sang chờ giao hàng.",
              icon: "success",
            });

            // Chờ 2 giây trước khi chuyển hướng
            setTimeout(function () {
              window.location.href = "#/updatehoadonchogiao";
            }, 2000);
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn.",
              icon: "error",
            });
          });
      };

      $scope.validateTTNguoiGiao = function () {
        if (
          !$scope.HoaDonTheoId.tennguoigiao ||
          $scope.HoaDonTheoId.tennguoigiao.length === 0
        ) {
          Swal.fire({
            title: "Lỗi!",
            text: "Tên người giao không được để trống.",
            icon: "error",
          });
          return false;
        }

        if (
          !$scope.HoaDonTheoId.sdtnguoigiao ||
          $scope.HoaDonTheoId.sdtnguoigiao.length === 0
        ) {
          Swal.fire({
            title: "Lỗi!",
            text: "Số điện thoại người giao không được để trống.",
            icon: "error",
          });
          return false;
        }

        // Kiểm tra định dạng số điện thoại (bắt đầu bằng số 0 và có đúng 10 chữ số)
        var phoneRegex = /^(0\d{9})$/;
        if (!phoneRegex.test($scope.HoaDonTheoId.sdtnguoigiao)) {
          Swal.fire({
            title: "Lỗi!",
            text: "Số điện thoại người giao không hợp lệ. Vui lòng nhập số điện thoại bắt đầu bằng số 0 và có đúng 10 chữ số.",
            icon: "error",
          });
          return false;
        }

        if (
          !$scope.HoaDonTheoId.donvigiaohang ||
          $scope.HoaDonTheoId.donvigiaohang.length === 0
        ) {
          Swal.fire({
            title: "Lỗi!",
            text: "Đơn vị giao hàng không được để trống.",
            icon: "error",
          });
          return false;
        }

        // Add other validation checks if needed
        return true;
      };

      $scope.UpdateThongTinNguoiGiao = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy thông tin hóa đơn để cập nhật.",
            icon: "error",
          });
          return;
        }

        if (!$scope.validateTTNguoiGiao()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          tennguoigiao: $scope.HoaDonTheoId.tennguoigiao,
          sdtnguoigiao: $scope.HoaDonTheoId.sdtnguoigiao,
          donvigiaohang: $scope.HoaDonTheoId.donvigiaohang,
        };

        updateshoadonService
          .updateThongTinNguoiGiao(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log("Cập nhật thông tin hóa đơn thành công:", data);
            Swal.fire({
              title: "Thành công!",
              text: "Thông tin hóa đơn đã được cập nhật.",
              icon: "success",
            });

            // Gọi hàm isTiengiaohangNull sau khi quá trình cập nhật hoàn tất
            $route.reload();
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin hóa đơn:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra khi cập nhật thông tin hóa đơn.",
              icon: "error",
            });
          });
      };
      $scope.validateHoaDonTrangThaichogiao = function () {
        if ($scope.HoaDonTheoId.sdtnguoigiao === null) {
          Swal.fire({
            title: "Lỗi!",
            text: "Bạn phải cập nhật thông tin người giao hàng trước để có thể cập nhật hoá đơn.",
            icon: "error",
          });
          return false;
        }
        if ($scope.HoaDonTheoId.tennguoigiao === null) {
          Swal.fire({
            title: "Lỗi!",
            text: "Bạn phải cập nhật thông tin người giao hàng trước để có thể cập nhật hoá đơn.",
            icon: "error",
          });
          return false;
        }
        if ($scope.HoaDonTheoId.donvigiaohang === null) {
          Swal.fire({
            title: "Lỗi!",
            text: "Bạn phải cập nhật thông tin người giao hàng trước để có thể cập nhật hoá đơn.",
            icon: "error",
          });
          return false;
        }
        if (!$scope.GhiChu || $scope.GhiChu.length <= 30) {
          Swal.fire({
            title: "Lỗi!",
            text: "Ghi chú phải có ít nhất 30 ký tự.",
            icon: "error",
          });
          return false;
        }

        // Add other validation checks if needed
        return true;
      };

      $scope.updateTrangThaiHoaDonDanggiao = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy thông tin hóa đơn để cập nhật.",
            icon: "error",
          });
          return;
        }

        if (!$scope.validateHoaDonTrangThaichogiao()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: $scope.GhiChu,
          trangthai: 4, // Đặt trạng thái mặc định thành 2
        };

        updateshoadonService
          .updateHoaDonTrangThai(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log(
              "Cập nhật trạng thái hóa đơn sang đã xác nhận thành công:",
              data
            );
            Swal.fire({
              title: "Thành công!",
              text: "Trạng thái hóa đơn đã được cập nhật sang đang giao hàng.",
              icon: "success",
            });

            // Chờ 2 giây trước khi chuyển hướng
            setTimeout(function () {
              window.location.href = "#/updatehoadondanggiao";
            }, 2000);
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn.",
              icon: "error",
            });
          });
      };
      $scope.validateHoaDonTrangThaihoanthanh = function () {
        if (!$scope.GhiChu || $scope.GhiChu.length <= 30) {
          Swal.fire({
            title: "Lỗi!",
            text: "Ghi chú phải có ít nhất 30 ký tự.",
            icon: "error",
          });
          return false;
        }

        // Add other validation checks if needed
        return true;
      };
      $scope.updateTrangThaiHoaDonHoanThanh = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          Swal.fire({
            title: "Lỗi!",
            text: "Không tìm thấy thông tin hóa đơn để cập nhật.",
            icon: "error",
          });
          return;
        }

        if (!$scope.validateHoaDonTrangThaihoanthanh()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: $scope.GhiChu,
          trangthai: 5, // Đặt trạng thái mặc định thành 5
        };

        updateshoadonService
          .updateHoaDonHoanThanh(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log(
              "Cập nhật trạng thái hóa đơn sang đã xác nhận thành công:",
              data
            );
            Swal.fire({
              title: "Thành công!",
              text: "Trạng thái hóa đơn đã được cập nhật sang hoàn thành.",
              icon: "success",
            });

            // Chạy hàm Updatehinhthucthanhtoan sau khi cập nhật trạng thái hóa đơn thành công
            $scope.Updatehinhthucthanhtoan();

            // Chờ 2 giây trước khi chuyển hướng
            setTimeout(function () {
              window.location.href = "#/updatehoadonhoanthanh";
            }, 2000);
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Có lỗi xảy ra khi cập nhật trạng thái hóa đơn.",
              icon: "error",
            });
          });
      };

      // Hàm cập nhật hình thức thanh toán
      $scope.Updatehinhthucthanhtoan = function () {
        if (!$scope.HoaDonTheoId) {
          console.error("HoaDonTheoId is not defined");
          return;
        }

        // Lấy IDHTT từ HinhThucThanhToan hiện tại
        var IDHTT = $scope.HinhThucThanhToan
          ? $scope.HinhThucThanhToan.id
          : null;

        if (!IDHTT) {
          console.error("Không có IDHTT để cập nhật");
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: "Khách hàng đã thanh toán",
          ngaycapnhat: new Date().toISOString(),
          ngaythanhtoan: new Date().toISOString(),
        };

        updateshoadonService
          .updatehinhthucthanhtoan(IDHTT, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log(
              "Cập nhật trạng thái hóa đơn sang đã xác nhận thành công:",
              data
            );
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
          });
      };
    }
  }
);
