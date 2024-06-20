app.controller(
  "BanHangTaiQuayController",
  function ($http, $scope, $window, $route, $location) {
    // Lấy token trên localStorage sau khi đăng nhập
    var token = localStorage.getItem("accessToken");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    // Kiểm tra có quyền hạn để truy cập trang bán tại quầy không
    var role = $window.localStorage.getItem("role");
    if (role == null) {
      Swal.fire({
        title: "Bạn cần phải đăng nhập !",
        text: "Vui lòng đăng nhập để sử dụng chức năng !",
        icon: "warning",
      });
      $window.location.href =
        "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
    }
    $scope.isAdmin = false;
    function getRole() {
      if (role === "ADMIN" || role === "NHANVIEN") {
        $scope.isAdmin = true;
      }
    }
    getRole();

    // Lấy idhoadon và idkh bán hàng tại quầy trên localStorage sau khi tạo hóa đơn
    var idhdtq = localStorage.getItem("idhoadontq");
    var idkhTaiQuay = localStorage.getItem("idkhtq");

    // Xử lý làm mới ô tìm kiếm
    $scope.LamMoi = function () {
      $scope.timkiemhoadon = "";
      $scope.LoaHoaDonTaiQuay();
    };

    // Xử lý xóa dữ liệu hóa đơn trên localStorage
    $scope.LocalStorageItem = function () {
      localStorage.removeItem("idhoadontq");
      localStorage.removeItem("idkhtq");
    };

    // Xử lý tìm kiếm hóa đơn
    $scope.TimKiemHoaDonTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/tim-kiem-hoa-don?mahoadon=" +
          $scope.timkiemhoadon;
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadHoaDonTaiQuay = resp.data;
            console.log(
              "Load tìm kiếm hóa đon tại quầy :",
              $scope.loadHoaDonTaiQuay
            );
          })
          .catch((error) => {
            console.log("Lỗi load tìm kiếm hóa đơn tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };

    // Xử lý load hóa đơn tại quầy đã tạo
    $scope.LoaHoaDonTaiQuay = function () {
      if (token != null) {
        var url = "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/load";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadHoaDonTaiQuay = resp.data;
            console.log("Load hóa đon tại quầy :", $scope.loadHoaDonTaiQuay);
          })
          .catch((error) => {
            console.log("Lỗi load hóa đơn tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoaHoaDonTaiQuay();

    // Xử lý tạo hóa đơn tại quầy cho khách hàng
    $scope.TaoHoaDonTaiQuay = function () {
      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn tạo hóa đơn không ?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy Bỏ",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác Nhận",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          if (token != null) {
            if ($scope.loadHoaDonTaiQuay.length < 5) {
              var url =
                "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/tao-hoa-don";
              $http
                .post(url, {}, config)
                .then((resp) => {
                  $scope.hoadonTaiQuay = resp.data;
                  console.log(
                    "Hóa đơn tại quầy vừa tạo :",
                    $scope.hoadonTaiQuay
                  );
                  localStorage.setItem(
                    "idhoadontq",
                    $scope.hoadonTaiQuay.idhoadon
                  );
                  localStorage.setItem("idkhtq", $scope.hoadonTaiQuay.idkh);

                  Swal.fire({
                    title: "Thành Công",
                    text: "Tạo hóa đơn tại quầy thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  setTimeout(function () {
                    $route.reload();
                  }, 1500);
                })
                .catch((error) => {
                  console.log("Lỗi tạo hóa đơn tại quầy :", error);
                });
            } else {
              Swal.fire({
                title: "Thông Báo",
                text: "Chỉ được tạo tối đa 5 hóa đơn !",
                icon: "warning",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          } else {
            console.log("Chưa đăng nhập !");
          }
        }
      });
    };

    // Xử lý hủy hóa đơn tại quầy
    $scope.HuyHoaDonTaiQuay = function (idhuyhdtq) {
      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn hủy hóa đơn không ?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy Bỏ",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác Nhận",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          if (token != null) {
            var url =
              "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/huy-hoa-don?idhoadon=" +
              idhuyhdtq;
            $http
              .put(url, {}, config)
              .then((resp) => {
                $scope.huyHoaDon = resp.data;
                console.log("Hủy đơn tại quầy vừa tạo :", $scope.huyHoaDon);
                $scope.LocalStorageItem();

                Swal.fire({
                  title: "Thành Công",
                  text: "Hủy hóa đơn tại quầy thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                });
                setTimeout(function () {
                  $route.reload();
                }, 1500);
              })
              .catch((error) => {
                console.log("Lỗi hủy hóa đơn tại quầy :", error);
              });
          } else {
            console.log("Chưa đăng nhập !");
          }
        }
      });
    };

    // Xử lý hàm chọn hóa đơn để xử dụng
    $scope.ChonHoaDonTaiQuay = function (idhdtqchon, idkhchon, mahoadonchon) {
      if (token != null) {
        localStorage.setItem("idhoadontq", idhdtqchon);
        localStorage.setItem("idkhtq", idkhchon);
        localStorage.setItem("mahoadontq", mahoadonchon);
        Swal.fire({
          title: "Thành Công",
          text: "Đã chọn hóa đơn này",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(function () {
          $route.reload();
        }, 1500);
      } else {
        console.log("Chưa đăng nhập !");
      }
    };

    // Xử lý load danh mục combobox
    $scope.LoadDanhMucBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-danh-muc";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadDMTaiQuay = resp.data;
            console.log("Load danh mục bán tại quầy :", $scope.loadDMTaiQuay);
          })
          .catch((error) => {
            console.log("Lỗi load danh mục bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadDanhMucBanTaiQuay();

    // Xử lý load màu sắc combobox
    $scope.LoadMauSacBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-mau-sac";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadMSTaiQuay = resp.data;
            console.log("Load màu sắc bán tại quầy :", $scope.loadMSTaiQuay);
          })
          .catch((error) => {
            console.log("Lỗi load màu sắc bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadMauSacBanTaiQuay();

    // Xử lý load size combobox
    $scope.LoadSizeBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-size";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadSizeTaiQuay = resp.data;
            console.log("Load size bán tại quầy :", $scope.loadSizeTaiQuay);
          })
          .catch((error) => {
            console.log("Lỗi load size bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadSizeBanTaiQuay();

    // Xử lý load chất liệu combobox
    $scope.LoadChatLieuBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-chat-lieu";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadCLTaiQuay = resp.data;
            console.log("Load chất liệu bán tại quầy :", $scope.loadCLTaiQuay);
          })
          .catch((error) => {
            console.log("Lỗi load chất liệu bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadChatLieuBanTaiQuay();

    // Xử lý load thương hiệu combobox
    $scope.LoadThuongHieuBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-thuong-hieu";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadTHTaiQuay = resp.data;
            console.log(
              "Load thương hiệu bán tại quầy :",
              $scope.loadTHTaiQuay
            );
          })
          .catch((error) => {
            console.log("Lỗi load thương hiệu bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadThuongHieuBanTaiQuay();

    // Xử lý load xuất xứ combobox
    $scope.LoadXuatXuBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-xuat-xu";
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadXXTaiQuay = resp.data;
            console.log("Load xuất xứ bán tại quầy :", $scope.loadXXTaiQuay);
          })
          .catch((error) => {
            console.log("Lỗi load xuất xứ bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadXuatXuBanTaiQuay();

    // Khai báo biến lấy giá trị trang đầu
    $scope.currentPage = 1;
    // Xử lý sự kiện trang trước
    // Số lượng bản ghi trên mỗi trang
    $scope.itemsPerPage = 20;

    $scope.previousPage = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
      }
    };
    // Xử lý sự kiện trang tiếp theo
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
      }
    };

    // Xử lý load thông tin sản phẩm thêm và0 hóa đơn
    $scope.LoaTTSanPhamBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load?page=" +
          ($scope.currentPage - 1);
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadTTSanPham = resp.data.content;
            console.log("Load sản phẩm tại quầy :", $scope.loadTTSanPham);
            // Tổng số bản ghi
            $scope.totalItems = resp.data.totalElements;
            // Tổng số trang
            $scope.totalPages = Math.ceil(
              $scope.totalItems / $scope.itemsPerPage
            );
            // console.log("TST :", $scope.totalItems);
            if ($scope.currentPage == $scope.totalPages) {
              $scope.showNextButton = false;
            } else {
              $scope.showNextButton = true;
            }
          })
          .catch((error) => {
            console.log("Lỗi load sản phẩm tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.$watch("currentPage", $scope.LoaTTSanPhamBanTaiQuay);

    // Xử lý chức năng làm mới
    $scope.LamMoiTKSPBanTaiQuay = function () {
      $scope.tensp = "";
      $scope.LoaTTSanPhamBanTaiQuay();
    };

    // Tìm kiếm theo tên sản phẩm bán tại quầy
    $scope.TimKiemTenSPBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/loc-ten-sp?page=" +
          ($scope.currentPage - 1) +
          "&tensp=" +
          $scope.tensp;
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadTTSanPham = resp.data.content;
            console.log(
              "Tìm kiếm theo tên sp bán tại quầy :",
              $scope.loadTTSanPham
            );
            // Tổng số bản ghi
            $scope.totalItems = resp.data.totalElements;
            // Tổng số trang
            $scope.totalPages = Math.ceil(
              $scope.totalItems / $scope.itemsPerPage
            );
            // console.log("TST :", $scope.totalItems);
            if ($scope.currentPage == $scope.totalPages) {
              $scope.showNextButton = false;
            } else {
              $scope.showNextButton = true;
            }
          })
          .catch((error) => {
            console.log("Lỗi tìm kiếm theo tên sp bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };

    // Tìm kiếm sản phẩm theo nhiều tiêu chí bán tại quầy
    $scope.tendanhmuc = "";
    $scope.tenmausac = "";
    $scope.tensize = "";
    $scope.tenchatlieu = "";
    $scope.tenthuonghieu = "";
    $scope.tenxuatxu = "";

    $scope.TimKiemSPNhieuTieuChiBanTaiQuay = function () {
      var tendm = $scope.tendanhmuc;
      var tenms = $scope.tenmausac;
      var tens = $scope.tensize;
      var tencl = $scope.tenchatlieu;
      var tenth = $scope.tenthuonghieu;
      var tenxx = $scope.tenxuatxu;

      if (
        tendm == "" &&
        tenms == "" &&
        tens == "" &&
        tencl == "" &&
        tenth == "" &&
        tenxx == ""
      ) {
        $scope.LoaTTSanPhamBanTaiQuay();
      } else {
        if (token != null) {
          var url =
            "http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/loc-tieu-chi-sp?page=" +
            ($scope.currentPage - 1) +
            "&tendanhmuc=" +
            $scope.tendanhmuc +
            "&tenmausac=" +
            $scope.tenmausac +
            "&tensize=" +
            $scope.tensize +
            "&tenchatlieu=" +
            $scope.tenchatlieu +
            "&tenthuonghieu=" +
            $scope.tenthuonghieu +
            "&tenxuatxu=" +
            $scope.tenxuatxu;
          $http
            .get(url, config)
            .then((resp) => {
              $scope.loadTTSanPham = resp.data.content;
              console.log(
                "Lọc sp theo nhiều tiêu chí bán tại quầy :",
                $scope.loadTTSanPham
              );
              // Tổng số bản ghi
              $scope.totalItems = resp.data.totalElements;
              // Tổng số trang
              $scope.totalPages = Math.ceil(
                $scope.totalItems / $scope.itemsPerPage
              );
              // console.log("TST :", $scope.totalItems);
              if ($scope.currentPage == $scope.totalPages) {
                $scope.showNextButton = false;
              } else {
                $scope.showNextButton = true;
              }
            })
            .catch((error) => {
              console.log(
                "Lỗi lọc sp theo nhiều tiêu chí bán tại quầy :",
                error
              );
            });
        } else {
          console.log("Chưa đăng nhập !");
        }
      }
    };

    // Lấy mã hóa đơn sau khi chọn
    $scope.mahdchon = localStorage.getItem("mahoadontq");
    // Load hóa đơn chi tiết của khách hàng bán tại quầy
    $scope.LoadHDCTKHBanTaiQuay = function () {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/load-hdct?idhoadon=" +
          idhdtq;
        $http
          .get(url, config)
          .then((resp) => {
            $scope.loadHDCTKH = resp.data;
            console.log(
              "Load hdct khách hàng bán tại quầy :",
              $scope.loadHDCTKH
            );
          })
          .catch((error) => {
            console.log("Lỗi load hdct khách hàng bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };
    $scope.LoadHDCTKHBanTaiQuay();

    // Validate ô nhập số lượng thêm sản phẩm vào hóa đơn chi tiết
    $scope.ValidateSoLuongThem = function (ttsp) {
      if (isNaN(ttsp.soluong) || ttsp.soluong < 1) {
        ttsp.soluong = 1;
      }
      if (ttsp.soluong > ttsp.soluongton) {
        Swal.fire({
          title: "Thông Báo",
          text: "Số lượng sản phẩm tồn không đủ",
          icon: "warning",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        ttsp.soluong = 1;
      }
    };

    // Xử lý thêm sản phẩm cho khách hàng vào hóa đơn chi tiết bán tại quầy
    $scope.ThemHDCTKHBanTaiQuay = function (spct) {
      if (idhdtq != null) {
        var dongiakhigiam =
          spct.dongiakhigiam != null ? spct.dongiakhigiam : "";
        Swal.fire({
          title: "Xác Nhận",
          text: "Bạn có muốn thêm sản phẩm vào hóa đơn không ?",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy Bỏ",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác Nhận",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            if (token != null) {
              var url =
                "http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/them-san-pham-hdct?idhoadon=" +
                idhdtq +
                "&idspct=" +
                spct.id +
                "&soluong=" +
                spct.soluong +
                "&dongiakhigiam=" +
                dongiakhigiam;
              $http
                .post(url, {}, config)
                .then((resp) => {
                  $scope.addHDCTKH = resp.data;
                  console.log(
                    "Thêm sp vào hdct cho khách hàng bán tại quầy :",
                    $scope.addHDCTKH
                  );
                  Swal.fire({
                    title: "Thành Công",
                    text: "Thêm sản phẩm vào hóa đơn thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  setTimeout(function () {
                    $route.reload();
                  }, 1500);
                })
                .catch((error) => {
                  console.log(
                    "Lỗi thêm sp vào hdct cho khách hàng bán tại quầy :",
                    error
                  );
                });
            } else {
              console.log("Chưa đăng nhập !");
            }
          }
        });
      } else {
        Swal.fire({
          title: "Thông Báo",
          text: "Bạn cần chọn hóa đơn muốn thêm sản phẩm",
          icon: "warning",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    };

    // Validte cập nhật số lượng mới hóa đơn chi tiết
    $scope.validateSoLuongCN = function (hdct) {
      if (isNaN(hdct.soluong) || hdct.soluong < 1) {
        hdct.soluong = 1;
      }
      if (hdct.soluong > hdct.soluongton) {
        Swal.fire({
          title: "Thông Báo",
          text: "Số lượng sản phẩm tồn không đủ",
          icon: "warning",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        hdct.soluong = 1;
      }
    };

    // update số lượng hóa đơn chi tiết của khách hàng bán tại quầy
    $scope.UpdateHDCTKHBanTaiQuay = function (idhdct, soluongmoi) {
      if (token != null) {
        var url =
          "http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/update-so-luong-hdct?idhdct=" +
          idhdct +
          "&soluong=" +
          soluongmoi;
        $http
          .put(url, {}, config)
          .then((resp) => {
            $scope.updateHDCTCTKH = resp.data;
            console.log(
              "Update hdct khách hàng bán tại quầy :",
              $scope.updateHDCTCTKH
            );
            Swal.fire({
              title: "Thành Công",
              text: "Cập nhật sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(function () {
              $route.reload();
            }, 1500);
          })
          .catch((error) => {
            console.log("Lỗi update hdct khách hàng bán tại quầy :", error);
          });
      } else {
        console.log("Chưa đăng nhập !");
      }
    };

    // Xóa hóa đơn chi tiết của khách hàng bán tại quầy
    $scope.DeleteHDCTKHBanTaiQuay = function (hdct) {
      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn xóa sản phẩm khỏi hóa đơn không ?",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy Bỏ",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác Nhận",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          if (token != null) {
            var url =
              "http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/delete-sp-hdct?idhdct=" +
              hdct.idhdct;
            $http
              .delete(url, config)
              .then((resp) => {
                $scope.deleteHDCTKH = resp.data;
                console.log(
                  "Delete hdct khách hàng bán tại quầy :",
                  $scope.deleteHDCTKH
                );
                Swal.fire({
                  title: "Thành Công",
                  text: "Xóa sản phẩm khỏi hóa đơn tại quầy thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                });
                setTimeout(function () {
                  $route.reload();
                }, 1500);
              })
              .catch((error) => {
                console.log("Lỗi delete hdct khách hàng bán tại quầy :", error);
              });
          } else {
            console.log("Chưa đăng nhập !");
          }
        }
      });
    };

    // Xử lý Modal và Dropdown
    $scope.toggleShippingInfo = function () {
      const shippingForm = document.getElementById("shippingForm");
      const shippingInfo = document.getElementById("shippingInfo");
      const shippingBT = document.getElementById("shippingBT");
      const thanhToanButton = document.getElementById("thanhToanButton");

      if ($scope.showShippingInfo) {
        shippingForm.style.display = "block";
        shippingInfo.style.display = "table-row";
        shippingBT.style.display = "block";
        thanhToanButton.style.display = "none";
      } else {
        shippingForm.style.display = "none";
        shippingInfo.style.display = "none";
        shippingBT.style.display = "none";
        thanhToanButton.style.display = "block";
      }
    };
    // Mở modal
    $scope.openModal = function () {
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
    };
    $scope.openModal01 = function () {
      var modal = document.getElementById("myModal01");
      modal.style.display = "block";
    };
    $scope.openModal02 = function () {
      var modal = document.getElementById("myModal02");
      modal.style.display = "block";
    };
    $scope.openModal03 = function () {
      var modal = document.getElementById("myModal03");
      modal.style.display = "block";
    };
    $scope.openModal04 = function () {
      var modal = document.getElementById("myModal04");
      modal.style.display = "block";
    };
    $scope.openModal06 = function () {
      var modal = document.getElementById("myModal06");
      modal.style.display = "block";
    };

    // Đóng modal
    $scope.closeModal = function () {
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
    };
    $scope.closeModal01 = function () {
      var modal = document.getElementById("myModal01");
      modal.style.display = "none";
    };
    $scope.closeModal02 = function () {
      var modal = document.getElementById("myModal02");
      modal.style.display = "none";
    };
    $scope.closeModal03 = function () {
      var modal = document.getElementById("myModal03");
      modal.style.display = "none";
    };
    $scope.closeModal04 = function () {
      var modal = document.getElementById("myModal04");
      modal.style.display = "none";
    };
    $scope.closeModal06 = function () {
      var modal = document.getElementById("myModal06");
      modal.style.display = "none";
    };

    
    //huy làm
    $scope.loadTongtien = function () {
      var idHD = localStorage.getItem("idhoadontq");

      var url = "http://localhost:8080/api/Admin/tongtien/load";

      var params = { id: idHD };

      $http({
        method: "GET",
        url: url,
        params: params,
        headers: config.headers,
      })
        .then((resp) => {
          // If the API response is null or undefined, or does not contain tongtien, set tongtien to 0
          let tongtien =
            resp.data && resp.data.tongtien !== null ? resp.data.tongtien : 0;
          $scope.tongtiens = { tongtien: tongtien };
          console.log("Load tổng tiền :", $scope.tongtiens);
          $scope.setuplaivoucher();
          $scope.loadVoucherTheoID();
          // Call setuplaivoucher after loading total amount
        })
        .catch((error) => {
          console.log("Lỗi tổng tiền !", error);
          $scope.setuplaivoucher();
        });
    };

    $scope.loadVoucher = function () {
      var url = "http://localhost:8080/api/Admin/voucher/load";
      $http
        .get(url, config)
        .then((resp) => {
          $scope.vouChers = resp.data;
          console.log("Load VouCher :", $scope.vouChers);
        })
        .catch((error) => {
          console.log("Lỗi load voucher !", error);
        });
    };
    $scope.loadVoucher();

    $scope.chonvoucher = function (voucherhienthi) {
      let idvoucher = voucherhienthi.id;
      let mavoucher = voucherhienthi.mavoucher;
      let tenvoucher = voucherhienthi.tenvoucher;
      let dieukientoithieuhoadon = voucherhienthi.dieukientoithieuhoadon;
      let hinhthucgiam = voucherhienthi.hinhthucgiam;
      let giatrigiam = voucherhienthi.giatrigiam;

      if ($scope.tongtiens.tongtien < dieukientoithieuhoadon) {
        console.error("Lỗi khi chọn: Điều kiện không phù hợp");
        Swal.fire({
          title: "Error",
          text: "Điều kiện không phù hợp, hãy chọn voucher khác",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Success",
          text: "Chọn voucher thành công",
          icon: "success",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        localStorage.setItem("idvoucher", idvoucher);
        localStorage.setItem("mavoucher", mavoucher);
        localStorage.setItem("tenvoucher", tenvoucher);
        localStorage.setItem("dieukientoithieuhoadon", dieukientoithieuhoadon);
        localStorage.setItem("hinhthucgiam", hinhthucgiam);
        localStorage.setItem("giatrigiam", giatrigiam);
        $route.reload();
      }
    };

    $scope.setuplaivoucher = function () {
      let dieukientoithieuhoadon = parseFloat(
        localStorage.getItem("dieukientoithieuhoadon")
      );

      // Ensure tongtiens is defined and has a tongtien property
      if (
        $scope.tongtiens &&
        $scope.tongtiens.tongtien < dieukientoithieuhoadon
      ) {
        // Remove voucher-related items from localStorage
        localStorage.removeItem("idvoucher");
        localStorage.removeItem("mavoucher");
        localStorage.removeItem("tenvoucher");
        localStorage.removeItem("dieukientoithieuhoadon");
        localStorage.removeItem("hinhthucgiam");
        localStorage.removeItem("giatrigiam");
      }
    };
    $scope.loadVoucherTheoID = function () {
      var idvoucher = localStorage.getItem("idvoucher");

      var url = "http://localhost:8080/api/Admin/voucher/loadtheoid";
      var params = { id: idvoucher };
      $http({
        method: "GET",
        url: url,
        params: params,
        headers: config.headers,
      })
        .then((resp) => {
          $scope.vouCherTheoIds = resp.data;
          console.log("Load VouCher theo id :", $scope.vouCherTheoIds);
        })
        .catch((error) => {
          console.log("Lỗi load voucher theo id !", error);
        });
    };
    $scope.loadTongtien();
    $scope.xemHinhThucThanhToanTheoId = function () {
      var idhdtq = localStorage.getItem("idhoadontq");
      var url =
        "http://localhost:8080/api/admin/bantaiquay/hinhthucthanhtoan/hienthihinhthucthanhtoantheoid";
      var params = { IdHD: idhdtq };

      if (idhdtq) {
        $http({
          method: "GET",
          url: url,
          params: params,
          headers: config.headers,
        })
          .then(function (response) {
            var data = response.data;
            console.log("Dữ liệu httt trả về:", data);

            if (Array.isArray(data)) {
              if (data.length > 0) {
                $scope.HinhThucThanhToanList = data;
                console.log("Danh sách httt:", $scope.HinhThucThanhToanList);
              } else {
                console.error("Không tìm thấy httt với IdHD:", idhdtq);
              }
            } else if (data && typeof data === "object") {
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
        console.error("Không có IdHD trong localStorage");
      }
    };

    $scope.xemHinhThucThanhToanTheoId();

    $scope.loadTienKhachTraID = function () {
      var idhoadontq = localStorage.getItem("idhoadontq");

      var url =
        "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/laytienkhachtra";
      var params = { id: idhoadontq };
      $http({
        method: "GET",
        url: url,
        params: params,
        headers: config.headers,
      })
        .then((resp) => {
          $scope.TienKhachTra = resp.data;
          console.log("Load tiền khách trả theo id :", $scope.TienKhachTra);
        })
        .catch((error) => {
          console.log("Lỗi load tiền khách trả theo id !", error);
        });
    };
    $scope.loadTienKhachTraID();

    $scope.ThanhToanTienMat = function (TienCuoiCung) {
      var idhoadontq = localStorage.getItem("idhoadontq");
      var tienkhachdua = parseFloat($scope.sotienkhachdua);

      if (tienkhachdua == null || isNaN(tienkhachdua)) {
        Swal.fire({
          title: "Error",
          text: "Không được bỏ trống",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        return;
      }

      // Kiểm tra nếu tiền khách trả đủ hoặc hơn tiền cuối cùng
      if ($scope.TienKhachTra.tienkhachtra >= TienCuoiCung) {
        Swal.fire({
          title: "Error",
          text: "Bạn đã thanh toán đủ tiền",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });

        return;
      }

      var url =
        "http://localhost:8080/api/admin/bantaiquay/hinhthucthanhtoan/Addhttttienmat";
      var params = {
        idhd: idhoadontq,
        TienKhachDua: tienkhachdua,
        TienCuoiCung: TienCuoiCung,
      };

      $http({
        method: "POST",
        url: url,
        params: params, // Sử dụng data để gửi dữ liệu dưới dạng JSON object
        headers: config.headers,
      })
        .then(function (response) {
          console.log("Thanh toán thành công:");
          Swal.fire({
            title: "Success",
            text: `Thanh toán thành công`,
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          $route.reload();
          return;
        })
        .catch(function (error) {
          console.log("Lỗi thanh toán!", error);
          Swal.fire({
            title: "Error",
            text: "Thanh toán thất bại",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          $route.reload();
        });
    };
    $scope.listTransaction = []; // Khởi tạo danh sách giao dịch
    $scope.queryParams = $location.search(); // Lấy các tham số từ URL

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;
    $scope.maGiaoDinh = $scope.queryParams.vnp_TxnRef;
    $scope.tienCuoiCungVnPay = $scope.amountParamValue / 100;

    $scope.ThanhToanChuyenKhoan = function () {
      // Lấy lại hoặc tính toán các giá trị mới nhất trước khi gọi API
      var idhoadontq = localStorage.getItem("idhoadontq");
      var url =
        "http://localhost:8080/api/admin/bantaiquay/hinhthucthanhtoan/Addhtttchuyenkhoan";
      var params = {
        idhd: idhoadontq,
        TienCuoiCung: $scope.tienCuoiCungVnPay,
        magiaodich: $scope.maGiaoDinh,
      };

      return $http({
        method: "POST",
        url: url,
        params: params, // Sử dụng 'data' thay vì 'params' để gửi đối tượng JSON
        headers: config.headers,
      })
        .then(function (response) {
          console.log("Thanh toán chuyển khoản thành công:", response);
          return response; // Trả về response để tiếp tục chuỗi promise
        })
        .catch(function (error) {
          console.log("Lỗi thanh toán chuyển khoản:", error);
          throw error; // Ném lỗi để xử lý trong hàm gọi
        });
    };

    var transactionVnpayCalled = false;
    if (
      $scope.maGiaoDinh != null &&
      $scope.tienCuoiCungVnPay != null &&
      !transactionVnpayCalled
    ) {
      $scope.ThanhToanChuyenKhoan();
      transactionVnpayCalled = true;
    }

    $scope.quayVe = function () {
      $window.location.href = "#/bantaiquay";
    };

    $scope.congTTVNPay = function (tongTienAmount) {
      return $http
        .post(
          `http://localhost:8080/api/Admin/BanTaiQuay/vnpay/payment?tongtienamout=${tongTienAmount}`,
          {},
          config
        )
        .then(function (response) {
          console.log("Redirecting to VNPay URL:", response.data.url);
          return response.data.url; // Trả về URL để chuyển hướng sau khi giao dịch
        });
    };

    $scope.executePaymentProcess = function (tongTienAmount) {
      // Khởi tạo tienkhachtra nếu chưa khởi tạo
      if ($scope.TienKhachTra.tienkhachtra == null) {
        $scope.TienKhachTra.tienkhachtra = 0;
      }

      // Kiểm tra nếu tiền khách trả đủ hoặc hơn tiền cuối cùng
      if ($scope.TienKhachTra.tienkhachtra >= tongTienAmount) {
        Swal.fire({
          title: "Lỗi",
          text: "Bạn đã thanh toán đủ tiền",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      $scope.congTTVNPay(tongTienAmount)
        .then(function (url) {
          // Chỉ cần trả về URL để chuyển hướng sau khi gọi congTTVNPay
          return url;
        })
        .then(function (url) {
          $window.location.href = url; // Thực hiện chuyển hướng
        })
        .catch(function (error) {
          console.log("Lỗi trong quá trình thanh toán:", error);
        });
    };


    $scope.Updatetehoanthanh = function (TienCuoiCung, TienDuocGiam) {
      // Kiểm tra nếu tiền khách trả đủ hoặc hơn tiền cuối cùng
      if ($scope.TienKhachTra.tienkhachtra < TienCuoiCung) {
        Swal.fire({
          title: "Lỗi",
          text: "Bạn phải thanh toán trước",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      // Lấy lại hoặc tính toán các giá trị mới nhất trước khi gọi API
      var IDHD = localStorage.getItem("idhoadontq");
      var Idgg = localStorage.getItem("idvoucher");
      var url =
        "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/updatehoanthanh";

      var params = {
        IDHD: IDHD,
        TienCuoiCung: TienCuoiCung,
        TienDuocGiam: TienDuocGiam,
      };

      // Chỉ thêm Idgg nếu nó không phải null
      if (Idgg !== null) {
        params.params = Idgg;
      }
      return $http({
        method: "put",
        url: url,
        params: params, // Sử dụng 'data' thay vì 'params' để gửi đối tượng JSON
        headers: config.headers,
      })
        .then(function (response) {
          console.log("Thanh toán thành công hoá đơn:", response);
          Swal.fire({
            title: "Success",
            text: `Thanh toán hoá đơn thành công`,
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          localStorage.removeItem("idvoucher");
          localStorage.removeItem("mavoucher");
          localStorage.removeItem("tenvoucher");
          localStorage.removeItem("dieukientoithieuhoadon");
          localStorage.removeItem("hinhthucgiam");
          localStorage.removeItem("giatrigiam");
          localStorage.removeItem("idhoadontq");
          localStorage.removeItem("mahoadontq");
          localStorage.removeItem("idkhtq");

          $route.reload();

          return response; // Trả về response để tiếp tục chuỗi promise
        })
        .catch(function (error) {
          console.log("Lỗi thanh toán hoá đơn:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Thanh toán hoá đơn không thành công",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });

          throw error;
          $route.reload(); // Ném lỗi để xử lý trong hàm gọi
        });
    };
    $scope.Updatetexacnhan = function (TienCuoiCung, TienDuocGiam) {
      // Kiểm tra nếu tiền khách trả đủ hoặc hơn tiền cuối cùng
      if ($scope.TienKhachTra.tienkhachtra < TienCuoiCung) {
        Swal.fire({
          title: "Lỗi",
          text: "Bạn phải thanh toán trước",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Kiểm tra các trường thông tin khách hàng
      if (
        !$scope.tiengiaohang ||
        !$scope.KhachHangTheoId.hovatenkh ||
        !$scope.KhachHangTheoId.sodienthoai ||
        !$scope.KhachHangTheoId.diachichitiet ||
        !$scope.KhachHangTheoId.email
      ) {
        Swal.fire({
          title: "Lỗi",
          text: "Vui lòng nhập đầy đủ thông tin khách hàng",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Regular expression for validating phone number
      var phoneRegex = /^0\d{9}$/;

      if (!phoneRegex.test($scope.KhachHangTheoId.sodienthoai)) {
        Swal.fire({
          title: "Lỗi",
          text: "Số điện thoại không hợp lệ. Số điện thoại phải là 10 số và bắt đầu bằng 0.",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Regular expression for validating email format
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test($scope.KhachHangTheoId.email)) {
        Swal.fire({
          title: "Lỗi",
          text: "Email không hợp lệ. Vui lòng nhập đúng định dạng email.",
          icon: "error",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      // Continue with the rest of your logic


      var IDHD = localStorage.getItem("idhoadontq");
      var Idgg = localStorage.getItem("idvoucher");
      var url =
        "http://localhost:8080/api/admin/hoa-don/ban-tai-quay/updatexacnhan";

      var params = {
        IDHD: IDHD,
        TienCuoiCung: TienCuoiCung,
        TienDuocGiam: TienDuocGiam,
      };
      var hoaDonXacNhanRequest = {
        tiengiaohang: $scope.tiengiaohang,
        tennguoinhan: $scope.KhachHangTheoId.hovatenkh,
        sdtnguoinhan: $scope.KhachHangTheoId.sodienthoai,

        emailnguoinhan: $scope.KhachHangTheoId.email,
        diachinhanhang:
          $scope.KhachHangTheoId.diachichitiet +
          " " +
          $scope.KhachHangTheoId.phuongxa +
          " " +
          $scope.KhachHangTheoId.quanhuyen +
          " " +
          $scope.KhachHangTheoId.tinhthanh,
      };
      if (Idgg !== null) {
        params.Idgg = Idgg;
      }

      return $http({
        method: "put",
        url: url,
        params: params,
        data: hoaDonXacNhanRequest, // Sử dụng 'data' để gửi dữ liệu như một đối tượng JSON
        headers: config.headers,
      })
        .then(function (response) {
          console.log("Xác nhận thành công hoá đơn:", response);
          Swal.fire({
            title: "Success",
            text: `Xác nhận hoá đơn thành công`,
            icon: "success",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          localStorage.removeItem("idvoucher");
          localStorage.removeItem("mavoucher");
          localStorage.removeItem("tenvoucher");
          localStorage.removeItem("dieukientoithieuhoadon");
          localStorage.removeItem("hinhthucgiam");
          localStorage.removeItem("giatrigiam");
          localStorage.removeItem("idhoadontq");
          localStorage.removeItem("mahoadontq");
          localStorage.removeItem("idkhtq");
          $route.reload();
          return response.data;
        })
        .catch(function (error) {
          console.log("Lỗi xác nhận hoá đơn:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Xác nhận hoá đơn không thành công",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
          throw error;
        });
    };






    //Hùng làm
    $scope.itemsPerPage1 = 10; // Số lượng khách hàng mỗi trang
    $scope.currentPage1 = 1; // Khởi tạo trang hiện tại

    $scope.khachHangList = [];
    $scope.sodienthoaitimkiem = '';

    $scope.getLoadKhachHang = function (page) {
      var apiUrl = "http://localhost:8080/api/auth/khachhangbantaiquay/khachhang";

      // Thêm các tham số phân trang vào URL
      var params = {
        trangthai: 1,
        page: (page || 1) - 1, // Chuyển đổi sang trang bắt đầu từ 0
        size: $scope.itemsPerPage1,
      };

      // Yêu cầu GET HTTP sử dụng $http
      $http
        .get(apiUrl, {
          params: params,
          headers: { Authorization: "Bearer " + token },
        })
        .then(function (response) {
          // Xử lý dữ liệu nhận được nếu yêu cầu thành công
          $scope.khachHangList = response.data.content;
          $scope.totalItems1 = response.data.totalElements;

          // Tính toán số trang dựa trên số lượng phần tử thực tế
          $scope.totalPages1 = Math.ceil(
            $scope.totalItems1 / $scope.itemsPerPage1
          );
          console.log("Thành Công");
        })
        .catch(function (error) {
          // Xử lý lỗi nếu yêu cầu thất bại
          console.error("Error:", error);
        });
    };

    $scope.getLoadtheotenKhachHang = function (page) {
      var apiUrl = "http://localhost:8080/api/auth/khachhangbantaiquay/khachhangtimkiem";

      // Thêm các tham số phân trang vào URL
      var params = {
        keyword: $scope.keywordTimKiem, // Đổi tên tham số từ sodienthoai thành keyword
        page: (page || 1) - 1, // Chuyển đổi sang trang bắt đầu từ 0
        size: $scope.itemsPerPage1,
      };

      // Yêu cầu GET HTTP sử dụng $http
      $http
        .get(apiUrl, {
          params: params,
          headers: { Authorization: "Bearer " + token },
        })
        .then(function (response) {
          // Xử lý dữ liệu nhận được nếu yêu cầu thành công
          $scope.khachHangList = response.data.content;
          $scope.totalItems1 = response.data.totalElements;

          // Tính toán số trang dựa trên số lượng phần tử thực tế
          $scope.totalPages1 = Math.ceil(
            $scope.totalItems1 / $scope.itemsPerPage1
          );
          console.log("Thành Công");
        })
        .catch(function (error) {
          // Xử lý lỗi nếu yêu cầu thất bại
          console.error("Error:", error);
        });
    };

    // Hàm để chuyển đến trang trước
    $scope.previousPage1 = function () {
      if ($scope.currentPage1 > 1) {
        $scope.currentPage1--;
        $scope.keywordTimKiem ? $scope.getLoadtheotenKhachHang($scope.currentPage1) : $scope.getLoadKhachHang($scope.currentPage1);
      }
    };

    // Hàm để chuyển đến trang tiếp theo
    $scope.nextPage1 = function () {
      if ($scope.currentPage1 < $scope.totalPages1) {
        $scope.currentPage1++;
        $scope.keywordTimKiem ? $scope.getLoadtheotenKhachHang($scope.currentPage1) : $scope.getLoadKhachHang($scope.currentPage1);
      }
    };

    // Load dữ liệu cho trang đầu tiên khi trang được khởi tạo
    $scope.getLoadKhachHang($scope.currentPage1);


    $scope.themKhachHangVaoHD = function (khachHang) {
      // Lưu id vào localStorage hoặc sử dụng biến trong controller
      localStorage.setItem("idkhtq", khachHang.idkh);
      console.log(khachHang);
      var idhoakhoanTaiQuay = localStorage.getItem("idhoadontq");
      console.log(idhoakhoanTaiQuay);
    };



    //Hùng làm phần update thông tin khách hàng vào hóa đơn
    $scope.selectedCustomerName = "";
    $scope.themKhachHangVaoHD = function (khachHang) {
      localStorage.setItem("idkhtq", khachHang.idkh);
      localStorage.setItem("tenkhachhang", khachHang.hovatenkh);
      $scope.selectedCustomerName = khachHang.hovatenkh;
      $scope.updateKhachHang(khachHang);
    };

    $scope.updateKhachHang = function (hovatenkh) {
      var idhoadon = localStorage.getItem("idhoadontq");
      var idkh = localStorage.getItem("idkhtq");
      var url =
        "http://localhost:8080/api/auth/khachhangbantaiquay/updateKhachHang";
      var data = {
        idhoadon: idhoadon,
        idkh: idkh,
        hovatenkh: hovatenkh.hovatenkh,
      };

      $http
        .put(url, data, config)
        .then(function (response) {
          if (response.status === 200) {
            $scope.loadHoaDonTaiQuay.forEach(function (hdtq) {
              if (hdtq.id == idhoadon) {
                hdtq.tenkhachhang = hovatenkh.hovatenkh;
                hdtq.tennguoinhan = hovatenkh.hovatenkh; // Cập nhật tennguoinhan
              }
            });

            Swal.fire({
              title: "Thành Công",
              text: "Cập nhật khách hàng thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Reload trang sau khi thông báo hoàn tất
              $window.location.reload();
            });
          } else {
            console.log("Lỗi xảy ra trong quá trình cập nhật khách hàng.");
          }
        })
        .catch(function (error) {
          console.log("Lỗi kết nối:", error);
        });
    };


    //Hùng làm phần load hiển thị thông tin Giao Hàng
    $scope.getLoadKhachHangTheoID = function () {
      var Idkh = localStorage.getItem("idkhtq");
      var apiUrl = "http://localhost:8080/api/auth/khachhangbantaiquay/hienthikhtheoid";

      var params = { Idkh: Idkh };
      var token = localStorage.getItem("accessToken");

      var config = {
        params: params,
        headers: { Authorization: "Bearer " + token },
      };

      $http.get(apiUrl, config)
        .then(function (response) {
          if (response.data) {
            $scope.KhachHangTheoId = response.data;
            console.log("Dữ liệu khách hàng từ API:", $scope.KhachHangTheoId);

            // Gán dữ liệu địa chỉ
            $scope.DiaChi = {
              diachichitiet: $scope.KhachHangTheoId.diachichitiet,
              phuongxa: $scope.KhachHangTheoId.phuongxa,
              quanhuyen: $scope.KhachHangTheoId.quanhuyen,
              tinhthanh: $scope.KhachHangTheoId.tinhthanh,
              quocgia: $scope.KhachHangTheoId.quocgia
            };

            // Tạo chuỗi địa chỉ đầy đủ mới
            $scope.DiaChiDayDu = [
              $scope.DiaChi.diachichitiet,
              $scope.DiaChi.phuongxa,
              $scope.DiaChi.quanhuyen,
              $scope.DiaChi.tinhthanh,
              $scope.DiaChi.quocgia
            ].filter(Boolean).join(', ');

            console.log("Địa chỉ đầy đủ mới:", $scope.DiaChiDayDu);
          } else {
            console.error("API không trả về dữ liệu.");
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API:", error);
        });
    };

    $scope.getLoadKhachHangTheoID();

    //Hùng làm phẩn hiển thị địa chỉ
    $scope.buildAddress = function (khachHang) {
      if (!khachHang) {
        return 'Không Có Địa Chỉ';
      }
      // Lấy các phần của địa chỉ
      var parts = [
        khachHang.diachichitiet,
        khachHang.phuongxa,
        khachHang.quanhuyen,
        khachHang.tinhthanh,
        khachHang.quocgia
      ];
      // Lọc các phần có giá trị và nối chúng lại với dấu phẩy
      var filteredParts = parts.filter(function (part) {
        return part && part.trim().length > 0;
      });
      // Nếu không có phần tử nào thỏa mãn điều kiện, trả về "Không Có Địa Chỉ"
      if (filteredParts.length === 0) {
        return 'Không có địa chỉ';
      }
      return filteredParts.join(', ');
    };

    //Hùng làm thêm kh
    // Hàm sinh mật khẩu ngẫu nhiên
    function generateRandomPassword() {
      var password = Math.random().toString(36).slice(-8);  // Mật khẩu có độ dài 8 ký tự
      return password;
    }

    // Hàm sinh tài khoản ngẫu nhiên
    function generateRandomUsername() {
      var username = "TKKH" + Math.floor(Math.random() * 10000);
      return username;
    }

    // Hàm kiểm tra định dạng email
    function isValidEmail(email) {
      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    // Hàm kiểm tra định dạng số điện thoại
    function isValidPhone(phone) {
      var regex = /^[0-9]{10}$/;
      return regex.test(phone);
    }

    // Hàm kiểm tra trùng email
    function checkEmailExists(email) {
      return $http.get('http://localhost:8080/api/auth/khachhangbantaiquay/check-email', {
        params: { email: email }
      }).then(function (response) {
        return response.data;
      });
    }

    // Hàm kiểm tra trùng số điện thoại
    function checkPhoneExists(phone) {
      return $http.get('http://localhost:8080/api/auth/khachhangbantaiquay/check-phone', {
        params: { phone: phone }
      }).then(function (response) {
        return response.data;
      });
    }

    // Khởi tạo đối tượng khachHang và diaChi
    $scope.khachHang = {};
    $scope.diaChi = {};
    $scope.khachHang = {
      trangthai: 1  // Khởi tạo trạng thái mặc định cho khách hàng
    };
    $scope.diaChi = {
      trangthaiDiaChi: 1  // Khởi tạo trạng thái mặc định cho địa chỉ
    };

    // Hàm kiểm tra các trường trống
    function validateFields() {
      if (!$scope.khachHang.hovatenkh) {
        Swal.fire("Lỗi", "Vui lòng điền họ và tên khách hàng", "error");
        return false;
      }
      if (!$scope.diaChi.diachichitiet) {
        Swal.fire("Lỗi", "Vui lòng điền địa chỉ chi tiết", "error");
        return false;
      }
      if (!$scope.diaChi.phuongxa) {
        Swal.fire("Lỗi", "Vui lòng điền phường/xã", "error");
        return false;
      }
      if (!$scope.diaChi.quanhuyen) {
        Swal.fire("Lỗi", "Vui lòng điền quận/huyện", "error");
        return false;
      }
      if (!$scope.diaChi.tinhthanh) {
        Swal.fire("Lỗi", "Vui lòng điền tỉnh/thành", "error");
        return false;
      }
      if (!$scope.khachHang.sodienthoai) {
        Swal.fire("Lỗi", "Vui lòng điền số điện thoại", "error");
        return false;
      }
      if (!$scope.khachHang.email) {
        Swal.fire("Lỗi", "Vui lòng điền email", "error");
        return false;
      }
      return true;
    }

    $scope.addKhachHang = function () {
      console.log('khachHang:', $scope.khachHang);
      console.log('diaChi:', $scope.diaChi);

      // Tạo tài khoản và mật khẩu tự động
      $scope.khachHang.taikhoan = generateRandomUsername();
      $scope.khachHang.matkhau = generateRandomPassword();

      // Kiểm tra các trường trống
      if (!validateFields()) {
        return;
      }

      // Kiểm tra định dạng email và số điện thoại
      if (!isValidEmail($scope.khachHang.email)) {
        Swal.fire("Lỗi", "Email không đúng định dạng", "error");
        return;
      }

      if (!isValidPhone($scope.khachHang.sodienthoai)) {
        Swal.fire("Lỗi", "Số điện thoại không đúng định dạng", "error");
        return;
      }

      // Kiểm tra trùng email và số điện thoại
      checkEmailExists($scope.khachHang.email).then(function (emailExists) {
        if (emailExists) {
          Swal.fire("Lỗi", "Email đã tồn tại", "error");
          return;
        }

        checkPhoneExists($scope.khachHang.sodienthoai).then(function (phoneExists) {
          if (phoneExists) {
            Swal.fire("Lỗi", "Số điện thoại đã tồn tại", "error");
            return;
          }

          // Tiếp tục thêm khách hàng nếu không trùng
          var url = "http://localhost:8080/api/auth/khachhangbantaiquay/addkhachhang";
          var data = {
            diachichitiet: $scope.diaChi.diachichitiet,
            phuongxa: $scope.diaChi.phuongxa,
            quanhuyen: $scope.diaChi.quanhuyen,
            tinhthanh: $scope.diaChi.tinhthanh,
            trangthaiDiaChi: $scope.diaChi.trangthaiDiaChi,
            hovatenkh: $scope.khachHang.hovatenkh,
            taikhoan: $scope.khachHang.taikhoan,
            matkhau: $scope.khachHang.matkhau,
            trangthai: $scope.khachHang.trangthai,
            sodienthoai: $scope.khachHang.sodienthoai,
            email: $scope.khachHang.email
          };

          $http.post(url, data)
            .then(function (response) {
              if (response.status === 200) {
                Swal.fire({
                  title: "Thành Công",
                  text: "Thêm khách hàng thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  // Reload trang sau khi thông báo hoàn tất
                  $window.location.reload();
                });
              } else {
                console.log("Lỗi xảy ra trong quá trình thêm khách hàng.");
              }
            })
            .catch(function (error) {
              console.log("Lỗi kết nối:", error);
            });
        });
      });
    };
  });
