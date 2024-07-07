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
  this.getLichSuThaoTacheoIds = function (IdHD) {
    return $http
      .get(
        "http://localhost:8080/api/admin/lichsuthaotac/hienthilichsuthaotactheoid",
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
  this.Addhinhthucthanhtoan = function (idhd, hinhThucThanhToanAdminRequest) {
    return $http
      .post(
        "http://localhost:8080/api/admin/hinhthucthanhtoan/Addhinhthucthanhtoan/" +
          idhd,
        hinhThucThanhToanAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateHoaDonHuy = function (IdHD, hoaDonTrangThaiAdminRequest) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hoadon/updatehuyhoadon/" + IdHD,
        hoaDonTrangThaiAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.AddhinhthucthanhtoanKhiHoanThanh = function (
    idhd,
    hinhThucThanhToanAdminRequest
  ) {
    return $http
      .post(
        "http://localhost:8080/api/admin/hinhthucthanhtoan/Addhinhthucthanhtoankhihoanthanh/" +
          idhd,
        hinhThucThanhToanAdminRequest,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.AddSanPhamMoi = function (idhd, idspct, soluong, dongiakhigiam) {
    return $http
      .post(
        "http://localhost:8080/api/admin/hoadonchitiet/add-san-pham",
        null,
        {
          params: {
            idhd: idhd,
            idspct: idspct,
            soluong: soluong,
            dongiakhigiam: dongiakhigiam,
          },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.deleteHDct = function (idhdct,idhd) {
    return $http
      .delete("http://localhost:8080/api/admin/hoadonchitiet/delete-san-pham", {
        params: {
          idhdct: idhdct,
          idhd: idhd
        },
        headers: config.headers,
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error.data;
      });
  };
  this.updatesoluong = function (idhdct, soluong,idhd) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hoadonchitiet/update-so-luong",
        null,
        {
          params: { idhdct: idhdct, soluong: soluong, idhd: idhd },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        // Return the entire error response
        return Promise.reject(error.response.data);
      });
  };
  this.updatethanhtien = function (idhoadon) {
    return $http
      .put("http://localhost:8080/api/admin/hoadon/updatehanhtien", null, {
        params: { idhoadon: idhoadon },
        headers: config.headers,
      })
      .then(function (response) {
        return response.data;
      });
  };
  this.getNhanViens = function () {
    return $http
      .get(
        "http://localhost:8080/api/admin/hinhthucthanhtoan/hienthinhanvien",
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateNguoixacnhan = function (idhoadon, idnv) {
    return $http
      .put(
        "http://localhost:8080/api/admin/hinhthucthanhtoan/updatenguoixacnhan",
        null,
        {
          params: { idhoadon: idhoadon, idnv: idnv },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        // Return the entire error response
        return Promise.reject(error.response.data);
      });
  };
  var token = localStorage.getItem("accessToken");

  

  this.generatePDF = function (id) {
    // Thêm token vào header của yêu cầu
  var config01 = {
      headers: {
          Authorization: "Bearer " + token,
      },
      responseType: 'arraybuffer' // Đặt responseType là 'arraybuffer' để nhận dữ liệu PDF
  };
      return $http
          .get("http://localhost:8080/api/v1/pdf/pdf/generate/" + id, config01)
          .then(function (response) {
              return response.data;
          })
          .catch(function (error) {
              console.error("Failed to generate PDF:", error);
              throw error; // Ném lỗi để xử lý ở controller hoặc view
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
      // Hiển thị hoá đơn chi tiết theo id hoá đơn
      $scope.xemHoaDonChiTietTheoId = function () {
        var maspInput = localStorage.getItem("IDHoaDonUpdate");

        if (maspInput) {
          updateshoadonService
            .getHoaDonCHiTietTheoIds(maspInput)
            .then(function (data) {
              console.log("Dữ liệu hoá đơn chi tiết trả về:", data);
              if (Array.isArray(data)) {
                // Nếu data là một mảng
                if (data.length > 0) {
                  $scope.HoaDonCTList = data;
                  console.log(
                    "Danh sách hoá đơn chi tiết:",
                    $scope.HoaDonCTList
                  );
                } else {
                  console.error("Không tìm thấy hoá đơn với IdSP:", maspInput);
                }
              } else if (data && typeof data === "object") {
                // Nếu data là một đối tượng
                $scope.HoaDonCTList = [data];
                console.log("Danh sách hoá đơn chi tiết:", $scope.HoaDonCTList);
              } else {
                console.error("Dữ liệu trả về không hợp lệ");
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
      // hiển thị hình thức thanh toán theo id hoá đơn
      $scope.xemHinhThucThanhToanTheoId = function () {
        var maspInput = localStorage.getItem("IDHoaDonUpdate");

        if (maspInput) {
          updateshoadonService
            .getHinhThucThanhToanTheoIds(maspInput)
            .then(function (data) {
              console.log("Dữ liệu httt trả về:", data);
              if (Array.isArray(data)) {
                // Nếu data là một mảng
                if (data.length > 0) {
                  $scope.HinhThucThanhToanList = data;
                  console.log("Danh sách httt:", $scope.HinhThucThanhToanList);
                } else {
                  console.error("Không tìm thấy httt với IdSP:", maspInput);
                }
              } else if (data && typeof data === "object") {
                // Nếu data là một đối tượng
                $scope.HinhThucThanhToanList = [data];
                console.log("Danh sách httt:", $scope.HinhThucThanhToanList);
              } else {
                console.error("Dữ liệu trả về không hợp lệ");
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
      //validate hoá đơn chờ xác nhận
      $scope.validateHoaDonchoxacnhan = function () {
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
      //update hoá đơn chờ xác nhận
      $scope.updateThongTinHoaDonchoxacnhan = function () {
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

        if (!$scope.validateHoaDonchoxacnhan()) {
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
      //validate trạng thái hoá đơn chờ xác nhận
      $scope.validateHoaDonTrangThaiChoXacNhan = function () {
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
      //Update trạng thái hoá đơn chờ xác nhận
      $scope.updateTrangThaiHoaDonChoXacNhan = function () {
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

        if (!$scope.validateHoaDonTrangThaiChoXacNhan()) {
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
      //Update trạng thái hoá đơn đã xác nhận
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

        if (!$scope.validateHoaDonTrangThaiChoXacNhan()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: $scope.GhiChu,
          trangthai: 3, // Đặt trạng thái mặc định thành 3
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
      //validate thông tin người giao
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
      //Update thông tin người giao
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
      //validate trạng thái chờ giao
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
      //update trạng thái chờ giao
      $scope.updateTrangThaiHoaDonChoGiao = function () {
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
      //Tạo mới 1 httt khi huỷ hoá đơn
      $scope.Addhinhthucthanhtoan = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");

        var hoaDonTrangThaiAdminRequest = {};

        updateshoadonService
          .Addhinhthucthanhtoan(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log("Tạo httt thành công:", data);
          })
          .catch(function (error) {
            console.error("Lỗi khi tạo httt:", error);
          });
      };
      //validate trạng thái huỷ hoá đơn
      $scope.validateHoaDonTrangThaiHuy = function () {
        if (!$scope.GhiChu || $scope.GhiChu.length <= 30) {
          Swal.fire({
            title: "Lỗi!",
            text: "Ghi chú phải có ít nhất 30 ký tự.",
            icon: "error",
          });
          return false;
        }
        return true;
      };
      //update huỷ hoá đơn
      $scope.updateTrangThaiHoaDonHuy = function () {
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

        if (!$scope.validateHoaDonTrangThaiHuy()) {
          return;
        }

        var hoaDonTrangThaiAdminRequest = {
          ghichu: $scope.GhiChu,
          trangthai: 6, // Đặt trạng thái mặc định thành 2
        };

        updateshoadonService
          .updateHoaDonHuy(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            console.log(
              "Cập nhật trạng thái hóa đơn sang đã xác nhận thành công:",
              data
            );
            Swal.fire({
              title: "Thành công!",
              text: "Huỷ hoá đơn thành công.",
              icon: "success",
            });
            // Chạy hàm Updatehinhthucthanhtoan sau khi cập nhật trạng thái hóa đơn thành công
            $scope.Addhinhthucthanhtoan();
            // Chờ 2 giây trước khi chuyển hướng
            setTimeout(function () {
              window.location.href = "#/updatehoadonhuy";
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
      //Tạo mới 1 httt khi hoan thanh hoá đơn
      $scope.Addhinhthucthanhtoankhithanhcong = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");
        if (!$scope.validateHoaDonTrangThaiDangGiao()) {
          return;
        }
        var hoaDonTrangThaiAdminRequest = {};

        updateshoadonService
          .AddhinhthucthanhtoanKhiHoanThanh(IdHD, hoaDonTrangThaiAdminRequest)
          .then(function (data) {
            // Chạy hàm Updatehinhthucthanhtoan sau khi cập nhật trạng thái hóa đơn thành công
            $scope.updateTrangThaiHoaDonDangGiao();
            console.log("Tạo httt thành công:", data);
          })
          .catch(function (error) {
            console.error("Lỗi khi tạo httt:", error);
          });
      };

      // validate đang giao
      $scope.validateHoaDonTrangThaiDangGiao = function () {
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
      // update đang giao
      $scope.updateTrangThaiHoaDonDangGiao = function () {
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

        if (!$scope.validateHoaDonTrangThaiDangGiao()) {
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
      $scope.isModalOpen = false;
      $scope.openModal = function () {
        var modal = document.getElementById("myModal");
        var overlay = document.getElementById("overlay");
        overlay.style.display = "block";
        setTimeout(function () {
          overlay.classList.add("active");
          modal.classList.add("active");
        }, 10);
        $scope.isModalOpen = true;
      };
      $scope.openModal01 = function () {
        var modal = document.getElementById("myModal01");
        var overlay = document.getElementById("overlay01");
        overlay.style.display = "block";
        setTimeout(function () {
          overlay.classList.add("active");
          modal.classList.add("active");
        }, 10);
        $scope.isModalOpen = true;
      };
      $scope.openModal02 = function () {
        var modal = document.getElementById("myModal02");
        var overlay = document.getElementById("overlay02");
        overlay.style.display = "block";
        setTimeout(function () {
          overlay.classList.add("active");
          modal.classList.add("active");
        }, 10);
        $scope.isModalOpen = true;
      };
      $scope.openModal03 = function () {
        var modal = document.getElementById("myModal03");
        var overlay = document.getElementById("overlay03");
        overlay.style.display = "block";
        setTimeout(function () {
          overlay.classList.add("active");
          modal.classList.add("active");
        }, 10);
        $scope.isModalOpen = true;
      };
      $scope.openModal04 = function () {
        var modal = document.getElementById("myModal04");
        var overlay = document.getElementById("overlay04");
        overlay.style.display = "block";
        setTimeout(function () {
          overlay.classList.add("active");
          modal.classList.add("active");
        }, 10);
        $scope.isModalOpen = true;
      };
      $scope.openModal05 = function () {
        var modal = document.getElementById("myModal05");
        var overlay = document.getElementById("overlay05");
        overlay.style.display = "block";
        setTimeout(function () {
          overlay.classList.add("active");
          modal.classList.add("active");
        }, 10);
        $scope.isModalOpen = true;
      };
      // Đóng modal với hiệu ứng mờ dần
      $scope.closeModal = function (event) {
        if (event.target.id === "overlay") {
          var modal = document.getElementById("myModal");
          var overlay = document.getElementById("overlay");
          overlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(function () {
            overlay.style.display = "none";
          }, 300); // Thời gian trùng với thời gian của animation
          $scope.isModalOpen = false;
        }
      };
      $scope.closeModal01 = function (event) {
        if (event.target.id === "overlay01") {
          var modal = document.getElementById("myModal01");
          var overlay = document.getElementById("overlay01");
          overlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(function () {
            overlay.style.display = "none";
          }, 300); // Thời gian trùng với thời gian của animation
          $scope.isModalOpen = false;
        }
      };
      $scope.closeModal02 = function (event) {
        if (event.target.id === "overlay02") {
          var modal = document.getElementById("myModal02");
          var overlay = document.getElementById("overlay02");
          overlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(function () {
            overlay.style.display = "none";
          }, 300); // Thời gian trùng với thời gian của animation
          $scope.isModalOpen = false;
        }
      };
      $scope.closeModal03 = function (event) {
        if (event.target.id === "overlay03") {
          var modal = document.getElementById("myModal03");
          var overlay = document.getElementById("overlay03");
          overlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(function () {
            overlay.style.display = "none";
          }, 300); // Thời gian trùng với thời gian của animation
          $scope.isModalOpen = false;
        }
      };
      $scope.closeModal04 = function (event) {
        if (event.target.id === "overlay04") {
          var modal = document.getElementById("myModal04");
          var overlay = document.getElementById("overlay04");
          overlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(function () {
            overlay.style.display = "none";
          }, 300); // Thời gian trùng với thời gian của animation
          $scope.isModalOpen = false;
        }
      };
      $scope.closeModal05 = function (event) {
        if (event.target.id === "overlay05") {
          var modal = document.getElementById("myModal05");
          var overlay = document.getElementById("overlay05");
          overlay.classList.remove("active");
          modal.classList.remove("active");
          setTimeout(function () {
            overlay.style.display = "none";
          }, 300); // Thời gian trùng với thời gian của animation
          $scope.isModalOpen = false;
        }
      };
      // Phần cập nhật sản ohaamr ở hoá đơn
      $scope.addSanPham = function (sanPham) {
        let IdHD = localStorage.getItem("IDHoaDonUpdate"); // Retrieve the ID from localStorage
        let idspct = sanPham.id; // Assume idspct is a property of sanPham
        let dongiakhigiam = sanPham.dongiakhigiam
          ? sanPham.dongiakhigiam
          : null; // Check if dongiakhigiam exists, otherwise set to null
        let soluong = 1; // Use the bound soluong or default to 1

        updateshoadonService
          .AddSanPhamMoi(IdHD, idspct, soluong, dongiakhigiam)
          .then(function (data) {
            console.log("Product added successfully", data);

            Swal.fire({
              title: "Success",
              text: "Thêm sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $scope.Updatethanhtien1();

            // $route.reload();
            return;
          })
          .catch(function (error) {
            console.error("Error adding product", error);
            // Handle error (e.g., show an error message)
          });
      };
      $scope.HoaDonCTList = [];

      $scope.deleteHoaDonCHiTiet = function (hoaDon) {
        if ($scope.HoaDonCTList.length <= 1) {
          Swal.fire({
            title: "Warning",
            text: "Không thể xóa. Phải có ít nhất một sản phẩm.",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }

        let idspct = hoaDon.id; // Assume idspct is a property of hoaDon
        let IdHD = localStorage.getItem("IDHoaDonUpdate"); // Retrieve the ID from localStorage

        updateshoadonService
          .deleteHDct(idspct,IdHD)
          .then(function (data) {
            console.log("Đã xóa sản phẩm thành công:", data);
            // Remove the deleted item from the array
            $scope.HoaDonCTList = $scope.HoaDonCTList.filter(
              (item) => item.id !== idspct
            );
            Swal.fire({
              title: "Success",
              text: "Đã xóa thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $scope.Updatethanhtien1();
            // Optionally, you can reload the route if needed
            // $route.reload();
            return;
          })
          .catch(function (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            Swal.fire({
              title: "Error",
              text: "Xảy ra lỗi khi xóa sản phẩm",
              icon: "error",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      };
      // Assume HoaDonCTList is already loaded into the scope
      // Assume HoaDonCTList is already loaded into the scope
      $scope.HoaDonCTList = [
        // your initial data here
      ];

      $scope.updateSoLuong01 = function (hoaDon) {
        let IdHD = localStorage.getItem("IDHoaDonUpdate"); // Retrieve the ID from localStorage

        if (hoaDon.soluong <= 0 || !Number.isInteger(hoaDon.soluong)) {
          Swal.fire({
            title: "Warning",
            text: "Số lượng phải là số nguyên dương.",
            icon: "warning",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          // Optionally, you can reload the route if needed
          $scope.Updatethanhtien1();
          // $route.reload();
          return;
        }

        updateshoadonService
          .updatesoluong(hoaDon.id, hoaDon.soluong,IdHD)
          .then(function (data) {
            console.log("Cập nhật số lượng thành công:", data);
            Swal.fire({
              title: "Success",
              text: "Cập nhật số lượng thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $scope.Updatethanhtien1();
            // Optionally, you can reload the route if needed
            // $route.reload();
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
            Swal.fire({
              title: "Error",
              text: "Số lượng sản phẩm không đủ  ",
              icon: "error",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $scope.Updatethanhtien1();
          });
      };

      $scope.Updatethanhtien1 = function () {
        var IdHD = localStorage.getItem("IDHoaDonUpdate");
        updateshoadonService
          .updatethanhtien(IdHD)
          .then(function (data) {
            $route.reload();

            console.log(" thành công:", data);
          })
          .catch(function (error) {
            console.error(" số lượng:", error);
          });
      };
      updateshoadonService.getNhanViens().then(function (data) {
        $scope.NhanViens = data;
      });
      $scope.selectedNhanVien = null;
      $scope.errorMessage = {}; // Khởi tạo đối tượng errorMessage

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

      $scope.updateNguoiXacNhan = function () {
        $scope.clearErrorMessages();

        var IdHD = localStorage.getItem("IDHoaDonUpdate");
        let IDNV = $scope.selectedNhanVien;

        if (!$scope.selectedNhanVien) {
          $scope.errorMessage.nhanvien = "Vui lòng không bỏ trống";
        }

        if ($scope.hasError()) {
          // Nếu có lỗi, không thực hiện cập nhật
          return;
        }

        updateshoadonService
          .updateNguoixacnhan(IdHD, IDNV)
          .then(function (data) {
            console.log("Cập nhật thành công:", data);
            Swal.fire({
              title: "Success",
              text: "Cập nhật người xác nhận thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            // $scope.Updatethanhtien1();
            // // Optionally, you can reload the route if needed
            $route.reload();
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật người xác nhận:", error);
            Swal.fire({
              title: "Error",
              text: "Cập nhật người xác nhận thất bại",
              icon: "error",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      };
      // in hoa don
      // Hàm generatePDF đã được định nghĩa ở trước
      $scope.generatePDF = function () {
        var id = localStorage.getItem("IDHoaDonUpdate");

        if (id) {
            updateshoadonService.generatePDF(id)
            .then(function (pdfData) {
                var file = new Blob([pdfData], { type: "application/pdf" });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL, "_blank");
            })
            .catch(function (error) {
                console.error("Failed to generate PDF:", error);
                // Xử lý lỗi khi không thể tải PDF
                // Ví dụ: thông báo cho người dùng biết là không thể tải PDF
                // hoặc log lỗi để theo dõi và xử lý sau này
            });
        } else {
            console.error("IDHoaDonUpdate is not available.");
            // Xử lý khi không có IDHoaDonUpdate trong localStorage
            // Ví dụ: thông báo lỗi cho người dùng
        }
    };
    // lịch sử thao tác

    $scope.xemLichsuthaotacId = function () {
      var maspInput = localStorage.getItem("IDHoaDonUpdate");

      if (maspInput) {
        updateshoadonService
          .getLichSuThaoTacheoIds(maspInput)
          .then(function (data) {
            console.log("LSTT:", data);
            if (Array.isArray(data)) {
              // Nếu data là một mảng
              if (data.length > 0) {
                $scope.LSTT = data;
                console.log(
                  "LSTT:",
                  $scope.LSTT
                );
              } else {
                console.error("Không tìm thấy LSTT với IdSP:", maspInput);
              }
            } else if (data && typeof data === "object") {
              // Nếu data là một đối tượng
              $scope.LSTT = [data];
              console.log("Danh sách LSTT chi tiết:", $scope.LSTT);
            } else {
              console.error("Dữ liệu trả về không hợp lệ");
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi gọi API xem chi tiết", error);
          });
      } else {
        console.error("Không có IdSP trong localStorage");
      }
    };
    $scope.xemLichsuthaotacId();
    }
  }
);
