app.controller("BanHangTaiQuayController", function ($http, $scope, $window, $route) {

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
    $window.location.href = "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
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
    $scope.timkiemhoadon = '';
    $scope.LoaHoaDonTaiQuay();
  }

  // Xử lý xóa dữ liệu hóa đơn trên localStorage
  $scope.LocalStorageItem = function () {
    localStorage.removeItem("idhoadontq");
    localStorage.removeItem("idkhtq");
  }

  // Xử lý tìm kiếm hóa đơn
  $scope.TimKiemHoaDonTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/hoa-don/ban-tai-quay/tim-kiem-hoa-don?mahoadon=' + $scope.timkiemhoadon;
      $http.get(url, config).then(resp => {
        $scope.loadHoaDonTaiQuay = resp.data;
        console.log('Load tìm kiếm hóa đon tại quầy :', $scope.loadHoaDonTaiQuay);
      }).catch(error => {
        console.log("Lỗi load tìm kiếm hóa đơn tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }

  // Xử lý load hóa đơn tại quầy đã tạo
  $scope.LoaHoaDonTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/hoa-don/ban-tai-quay/load';
      $http.get(url, config).then(resp => {
        $scope.loadHoaDonTaiQuay = resp.data;
        console.log('Load hóa đon tại quầy :', $scope.loadHoaDonTaiQuay);
      }).catch(error => {
        console.log("Lỗi load hóa đơn tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
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
            var url = 'http://localhost:8080/api/admin/hoa-don/ban-tai-quay/tao-hoa-don';
            $http.post(url, {}, config).then(resp => {
              $scope.hoadonTaiQuay = resp.data;
              console.log('Hóa đơn tại quầy vừa tạo :', $scope.hoadonTaiQuay);
              localStorage.setItem("idhoadontq", $scope.hoadonTaiQuay.idhoadon);
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
            }).catch(error => {
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
          console.log('Chưa đăng nhập !');
        }
      }
    })
  }

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
          var url = 'http://localhost:8080/api/admin/hoa-don/ban-tai-quay/huy-hoa-don?idhoadon=' + idhuyhdtq;
          $http.put(url, {}, config).then(resp => {
            $scope.huyHoaDon = resp.data;
            console.log('Hủy đơn tại quầy vừa tạo :', $scope.huyHoaDon);
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
          }).catch(error => {
            console.log("Lỗi hủy hóa đơn tại quầy :", error);
          });
        } else {
          console.log('Chưa đăng nhập !');
        }
      }
    })
  }

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
      console.log('Chưa đăng nhập !');
    }
  }

  // Xử lý load danh mục combobox
  $scope.LoadDanhMucBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-danh-muc';
      $http.get(url, config).then(resp => {
        $scope.loadDMTaiQuay = resp.data;
        console.log('Load danh mục bán tại quầy :', $scope.loadDMTaiQuay);
      }).catch(error => {
        console.log("Lỗi load danh mục bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
  $scope.LoadDanhMucBanTaiQuay();

  // Xử lý load màu sắc combobox
  $scope.LoadMauSacBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-mau-sac';
      $http.get(url, config).then(resp => {
        $scope.loadMSTaiQuay = resp.data;
        console.log('Load màu sắc bán tại quầy :', $scope.loadMSTaiQuay);
      }).catch(error => {
        console.log("Lỗi load màu sắc bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
  $scope.LoadMauSacBanTaiQuay();

  // Xử lý load size combobox
  $scope.LoadSizeBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-size';
      $http.get(url, config).then(resp => {
        $scope.loadSizeTaiQuay = resp.data;
        console.log('Load size bán tại quầy :', $scope.loadSizeTaiQuay);
      }).catch(error => {
        console.log("Lỗi load size bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
  $scope.LoadSizeBanTaiQuay();

  // Xử lý load chất liệu combobox
  $scope.LoadChatLieuBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-chat-lieu';
      $http.get(url, config).then(resp => {
        $scope.loadCLTaiQuay = resp.data;
        console.log('Load chất liệu bán tại quầy :', $scope.loadCLTaiQuay);
      }).catch(error => {
        console.log("Lỗi load chất liệu bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
  $scope.LoadChatLieuBanTaiQuay();

  // Xử lý load thương hiệu combobox
  $scope.LoadThuongHieuBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-thuong-hieu';
      $http.get(url, config).then(resp => {
        $scope.loadTHTaiQuay = resp.data;
        console.log('Load thương hiệu bán tại quầy :', $scope.loadTHTaiQuay);
      }).catch(error => {
        console.log("Lỗi load thương hiệu bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
  $scope.LoadThuongHieuBanTaiQuay();

  // Xử lý load xuất xứ combobox
  $scope.LoadXuatXuBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load-xuat-xu';
      $http.get(url, config).then(resp => {
        $scope.loadXXTaiQuay = resp.data;
        console.log('Load xuất xứ bán tại quầy :', $scope.loadXXTaiQuay);
      }).catch(error => {
        console.log("Lỗi load xuất xứ bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
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
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/load?page=' + ($scope.currentPage - 1);
      $http.get(url, config).then(resp => {
        $scope.loadTTSanPham = resp.data.content;
        console.log('Load sản phẩm tại quầy :', $scope.loadTTSanPham);
        // Tổng số bản ghi
        $scope.totalItems = resp.data.totalElements;
        // Tổng số trang
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        // console.log("TST :", $scope.totalItems);
        if ($scope.currentPage == $scope.totalPages) {
          $scope.showNextButton = false;
        } else {
          $scope.showNextButton = true;
        }
      }).catch(error => {
        console.log("Lỗi load sản phẩm tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
  $scope.$watch('currentPage', $scope.LoaTTSanPhamBanTaiQuay);

  // Xử lý chức năng làm mới 
  $scope.LamMoiTKSPBanTaiQuay = function () {
    $scope.tensp = '';
    $scope.LoaTTSanPhamBanTaiQuay();
  }

  // Tìm kiếm theo tên sản phẩm bán tại quầy
  $scope.TimKiemTenSPBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/loc-ten-sp?page=' + ($scope.currentPage - 1) + '&tensp=' + $scope.tensp;
      $http.get(url, config).then(resp => {
        $scope.loadTTSanPham = resp.data.content;
        console.log('Tìm kiếm theo tên sp bán tại quầy :', $scope.loadTTSanPham);
        // Tổng số bản ghi
        $scope.totalItems = resp.data.totalElements;
        // Tổng số trang
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        // console.log("TST :", $scope.totalItems);
        if ($scope.currentPage == $scope.totalPages) {
          $scope.showNextButton = false;
        } else {
          $scope.showNextButton = true;
        }
      }).catch(error => {
        console.log("Lỗi tìm kiếm theo tên sp bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }

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

    if (tendm == "" && tenms == "" && tens == "" && tencl == "" && tenth == "" && tenxx == "") {
      $scope.LoaTTSanPhamBanTaiQuay();
    } else {
      if (token != null) {
        var url = 'http://localhost:8080/api/admin/san-pham-chi-tiet-tai-quay/loc-tieu-chi-sp?page=' + ($scope.currentPage - 1) +
          '&tendanhmuc=' + $scope.tendanhmuc + '&tenmausac=' + $scope.tenmausac + '&tensize=' + $scope.tensize +
          '&tenchatlieu=' + $scope.tenchatlieu + '&tenthuonghieu=' + $scope.tenthuonghieu + '&tenxuatxu=' + $scope.tenxuatxu
        $http.get(url, config).then(resp => {
          $scope.loadTTSanPham = resp.data.content;
          console.log('Lọc sp theo nhiều tiêu chí bán tại quầy :', $scope.loadTTSanPham);
          // Tổng số bản ghi
          $scope.totalItems = resp.data.totalElements;
          // Tổng số trang
          $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
          // console.log("TST :", $scope.totalItems);
          if ($scope.currentPage == $scope.totalPages) {
            $scope.showNextButton = false;
          } else {
            $scope.showNextButton = true;
          }
        }).catch(error => {
          console.log("Lỗi lọc sp theo nhiều tiêu chí bán tại quầy :", error);
        });
      } else {
        console.log('Chưa đăng nhập !');
      }
    }
  }

  // Lấy mã hóa đơn sau khi chọn
  $scope.mahdchon = localStorage.getItem("mahoadontq");
  // Load hóa đơn chi tiết của khách hàng bán tại quầy
  $scope.LoadHDCTKHBanTaiQuay = function () {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/load-hdct?idhoadon=' + idhdtq;
      $http.get(url, config).then(resp => {
        $scope.loadHDCTKH = resp.data;
        console.log('Load hdct khách hàng bán tại quầy :', $scope.loadHDCTKH);
      }).catch(error => {
        console.log("Lỗi load hdct khách hàng bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }
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
  }

  // Xử lý thêm sản phẩm cho khách hàng vào hóa đơn chi tiết bán tại quầy
  $scope.ThemHDCTKHBanTaiQuay = function (spct) {
    if (idhdtq != null) {
      var dongiakhigiam = spct.dongiakhigiam != null ? spct.dongiakhigiam : "";
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
            var url = 'http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/them-san-pham-hdct?idhoadon=' + idhdtq + '&idspct=' + spct.id +
              '&soluong=' + spct.soluong + '&dongiakhigiam=' + dongiakhigiam;
            $http.post(url, {}, config).then(resp => {
              $scope.addHDCTKH = resp.data;
              console.log('Thêm sp vào hdct cho khách hàng bán tại quầy :', $scope.addHDCTKH);
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
            }).catch(error => {
              console.log("Lỗi thêm sp vào hdct cho khách hàng bán tại quầy :", error);
            });
          } else {
            console.log('Chưa đăng nhập !');
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

  }

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
  }

  // update số lượng hóa đơn chi tiết của khách hàng bán tại quầy
  $scope.UpdateHDCTKHBanTaiQuay = function (idhdct, soluongmoi) {
    if (token != null) {
      var url = 'http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/update-so-luong-hdct?idhdct=' + idhdct + '&soluong=' + soluongmoi;
      $http.put(url, {}, config).then(resp => {
        $scope.updateHDCTCTKH = resp.data;
        console.log('Update hdct khách hàng bán tại quầy :', $scope.updateHDCTCTKH);
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
      }).catch(error => {
        console.log("Lỗi update hdct khách hàng bán tại quầy :", error);
      });
    } else {
      console.log('Chưa đăng nhập !');
    }
  }

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
          var url = 'http://localhost:8080/api/admin/hoa-don-chi-tiet/ban-tai-quay/delete-sp-hdct?idhdct=' + hdct.idhdct;
          $http.delete(url, config).then(resp => {
            $scope.deleteHDCTKH = resp.data;
            console.log('Delete hdct khách hàng bán tại quầy :', $scope.deleteHDCTKH);
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
          }).catch(error => {
            console.log("Lỗi delete hdct khách hàng bán tại quầy :", error);
          });
        } else {
          console.log('Chưa đăng nhập !');
        }
      }
    })
  }








  // Xử lý Modal và Dropdown
  $scope.toggleShippingInfo = function () {
    const shippingForm = document.getElementById("shippingForm");
    const shippingInfo = document.getElementById("shippingInfo");

    if ($scope.showShippingInfo) {
      shippingForm.style.display = "block";
      shippingInfo.style.display = "table-row";
    } else {
      shippingForm.style.display = "none";
      shippingInfo.style.display = "none";
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




































/// Hùng làm

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
$scope.buildAddress = function(khachHang) {
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
  var filteredParts = parts.filter(function(part) {
      return part && part.trim().length > 0;
  });

  // Nếu không có phần tử nào thỏa mãn điều kiện, trả về "Không Có Địa Chỉ"
  if (filteredParts.length === 0) {
      return 'Không có địa chỉ';
  }

  return filteredParts.join(', ');
};






});
