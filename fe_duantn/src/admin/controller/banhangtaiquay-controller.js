app.controller("BanHangTaiQuayController", function ($http, $scope, $window) {

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
  var idhoakhoanTaiQuay = localStorage.getItem("idhoadontq");
  var idkhTaiQuay = localStorage.getItem("idkhtq");

  // Xử lý làm mới ô tìm kiếm
  $scope.LamMoi = function () {
    $scope.timkiemhoadon = '';
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
                $window.location.reload();
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
  $scope.HuyHoaDonTaiQuay = function (idhuyhdtq, idhuykh) {
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
          var url = 'http://localhost:8080/api/admin/hoa-don/ban-tai-quay/huy-hoa-don?idhoadon=' + idhuyhdtq + '&idkh=' + idhuykh;
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
              $window.location.reload();
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
  $scope.ChonHoaDonTaiQuay = function (idhdtqchon, idkhchon) {
    if (token != null) {
      localStorage.setItem("idhoadontq", idhdtqchon);
      localStorage.setItem("idkhtq", idkhchon);
      Swal.fire({
        title: "Thành Công",
        text: "Đã chọn hóa đơn này",
        icon: "success",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timer: 1500,
      });
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

  // Xử lý load thồng tin sản phẩm thêm và giỏ hàng
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
}
);
