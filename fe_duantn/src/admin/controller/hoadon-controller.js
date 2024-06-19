app.controller(
  "QuanLyHoaDonController",
  function ($scope, $http, $route, $window) {
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

    if ($scope.isAdmin) {
      // Khai báo biến lấy giá trị trang đầu
      $scope.currentPage = 1;
      // Số lượng bản ghi trên mỗi trang
      $scope.itemsPerPage = 9;
      // Biến lưu trạng thái lọc
      $scope.filterCriteria = {
        trangthai: "",
        mahoadon: "",
        loaihoadon: "",
      };

      // Xử lý sự kiện trang trước
      $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
          $scope.currentPage--;
          $scope.loadHoaDon();
        }
      };

      // Xử lý sự kiện trang tiếp theo
      $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
          $scope.currentPage++;
          $scope.loadHoaDon();
        }
      };

      // Hàm lấy tổng số trang
      $scope.getTotalPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
      };

      // Hàm để load dữ liệu hoá đơn
      $scope.loadHoaDon = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var url =
          "http://localhost:8080/api/admin/hoadon/hienthihoadon?page=" +
          ($scope.currentPage - 1) +
          "&pageSize=" +
          $scope.itemsPerPage;

        if ($scope.filterCriteria.trangthai) {
          url =
            "http://localhost:8080/api/admin/hoadon/loc/trangthaihoadon?pageNumber=" +
            ($scope.currentPage - 1) +
            "&pageSize=" +
            $scope.itemsPerPage +
            "&trangthai=" +
            $scope.filterCriteria.trangthai;
        } else if ($scope.filterCriteria.mahoadon) {
          url =
            "http://localhost:8080/api/admin/hoadon/loc/mahoadon?pageNumber=" +
            ($scope.currentPage - 1) +
            "&pageSize=" +
            $scope.itemsPerPage +
            "&mahoadon=" +
            $scope.filterCriteria.mahoadon;
        } else if ($scope.filterCriteria.loaihoadon) {
          url =
            "http://localhost:8080/api/admin/hoadon/loc/loaihoadon?pageNumber=" +
            ($scope.currentPage - 1) +
            "&pageSize=" +
            $scope.itemsPerPage +
            "&loaihoadon=" +
            $scope.filterCriteria.loaihoadon;
        }

        $http
          .get(url, config)
          .then((resp) => {
            $scope.HoaDonLoadPhanTrang = resp.data.content;
            $scope.totalItems = resp.data.totalElements;
            $scope.totalPages = Math.ceil(
              $scope.totalItems / $scope.itemsPerPage
            );
            $scope.showNextButton =
              $scope.HoaDonLoadPhanTrang.length >= $scope.itemsPerPage;
          })
          .catch((error) => {
            console.log("Lỗi Load HĐ", error);
          });
      };

      $scope.TongSoHoaDonChoXacNhan = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        $http
          .get(
            "http://localhost:8080/api/admin/hoadon/tongSoHoaDonChoXacNhan",
            config
          )
          .then(function (response) {
            $scope.TongSoHoaDonChoXacNhan = response.data; // Gán dữ liệu trả về vào biến $scope
          })
          .catch(function (error) {
            console.log("Error fetching data:", error);
            $scope.TongSoHoaDonChoXacNhan = 0; // Gán mặc định là 0 nếu có lỗi
          });
      };

      // Gọi hàm để thực hiện request
      $scope.TongSoHoaDonChoXacNhan();

      $scope.TongSoHoaDonXacNhan = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        $http
          .get(
            "http://localhost:8080/api/admin/hoadon/tongSoHoaDonXacNhan",
            config
          )
          .then(function (response) {
            $scope.TongSoHoaDonXacNhan = response.data; // Gán dữ liệu trả về vào biến $scope
          })
          .catch(function (error) {
            console.log("Error fetching data:", error);
            $scope.TongSoHoaDonXacNhan = 0; // Gán mặc định là 0 nếu có lỗi
          });
      };

      // Gọi hàm để thực hiện request
      $scope.TongSoHoaDonXacNhan();

      $scope.TongSoHoaDonChoGiao = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        $http
          .get(
            "http://localhost:8080/api/admin/hoadon/tongSoHoaDonChoGiao",
            config
          )
          .then(function (response) {
            $scope.TongSoHoaDonChoGiao = response.data; // Gán dữ liệu trả về vào biến $scope
          })
          .catch(function (error) {
            console.log("Error fetching data:", error);
            $scope.TongSoHoaDonChoGiao = 0; // Gán mặc định là 0 nếu có lỗi
          });
      };

      // Gọi hàm để thực hiện request
      $scope.TongSoHoaDonChoGiao();

      $scope.TongSoHoaDonDangGiao = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        $http
          .get(
            "http://localhost:8080/api/admin/hoadon/tongSoHoaDonDangGiao",
            config
          )
          .then(function (response) {
            $scope.TongSoHoaDonDangGiao = response.data; // Gán dữ liệu trả về vào biến $scope
          })
          .catch(function (error) {
            console.log("Error fetching data:", error);
            $scope.TongSoHoaDonDangGiao = 0; // Gán mặc định là 0 nếu có lỗi
          });
      };

      // Gọi hàm để thực hiện request
      $scope.TongSoHoaDonDangGiao();

      $scope.TongSoHoaDonHoanThanh = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        $http
          .get(
            "http://localhost:8080/api/admin/hoadon/tongSoHoaDonHoanThanh",
            config
          )
          .then(function (response) {
            $scope.TongSoHoaDonHoanThanh = response.data; // Gán dữ liệu trả về vào biến $scope
          })
          .catch(function (error) {
            console.log("Error fetching data:", error);
            $scope.TongSoHoaDonHoanThanh = 0; // Gán mặc định là 0 nếu có lỗi
          });
      };

      // Gọi hàm để thực hiện request
      $scope.TongSoHoaDonHoanThanh();

      $scope.TongSoHoaDonHuy = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        $http
          .get("http://localhost:8080/api/admin/hoadon/tongSoHoaDonHuy", config)
          .then(function (response) {
            $scope.TongSoHoaDonHuy = response.data; // Gán dữ liệu trả về vào biến $scope
          })
          .catch(function (error) {
            console.log("Error fetching data:", error);
            $scope.TongSoHoaDonHuy = 0; // Gán mặc định là 0 nếu có lỗi
          });
      };

      // Gọi hàm để thực hiện request
      $scope.TongSoHoaDonHuy();

      // lọc hoá đơn theo trạng thái
      $scope.locTrangThai = function (trangthaiValue) {
        $scope.filterCriteria.trangthai = trangthaiValue || "";
        $scope.currentPage = 1;
        $scope.loadHoaDon();
      };

      $scope.locMaHoaDon = function () {
        $scope.filterCriteria.mahoadon = $scope.mahoadonTK || "";
        $scope.currentPage = 1;
        $scope.loadHoaDon();
      };

      $scope.locLoaiHoaDon = function () {
        $scope.filterCriteria.loaihoadon = $scope.loaihoadon || "";
        $scope.currentPage = 1;
        $scope.loadHoaDon();
      };

      $scope.redirectToHoaDonDetails = function (hoaDonId) {
        // Lưu id vào localStorage hoặc sử dụng biến trong controller
        localStorage.setItem("IDHoaDonUpdate", hoaDonId);
      };
      // Hàm chọn tab
      $scope.selectTab = function (tabIndex) {
        $scope.selectedTab = tabIndex;
      };

      // Hàm kiểm tra xem mục có phải là mục được chọn không
      $scope.isSelected = function (tabIndex) {
        return $scope.selectedTab === tabIndex;
      };

      $scope.selectedTab = 0; // Mục đang được chọn ban đầu

      $scope.getUpdateHoaDonUrl = function (trangthai) {
        switch (trangthai) {
          case 1:
            return "#/updatehoadonchoxacnhan";
          case 2:
            return "#/updatehoadondaxacnhan";
          case 3:
            return "#/updatehoadonchogiao";
          case 4:
            return "#/updatehoadondanggiao";
          case 5:
            return "#/updatehoadonhoanthanh";
          case 6:
            return "#/updatehoadonhuy";
          default:
            return "#/hoadon"; // Provide a default URL if needed
        }
      };

      // Gọi hàm để thực hiện request
      $scope.loadHoaDon();
    }
  }
);
