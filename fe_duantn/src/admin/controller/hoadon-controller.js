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
    if (role === "ADMIN" || role === "NHANVIEN") {
      // Khai báo biến lấy giá trị trang đầu
      $scope.currentPage = 1;
      // Số lượng bản ghi trên mỗi trang
      $scope.itemsPerPage = 9;
      // khai báo 2 biến cho các hàm tìm kiếm
      $scope.pageNumber = 0;
      $scope.pageSize = 9;
      $scope.HoaDonLoadPhanTrang = [];

      // Xử lý sự kiện trang trước
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

      // Hàm lấy tổng số trang
      $scope.getTotalPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
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

      // Load sp shop lên trang shop
      $scope.ShowHoaDon = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            `http://localhost:8080/api/admin/hoadon/hienthihoadon?page=${
              $scope.currentPage - 1
            }`,
            config
          )
          .then((resp) => {
            $scope.HoaDonLoadPhanTrang = resp.data.content;
            console.log("Load HĐ :", $scope.HoaDonLoadPhanTrang);

            // Tổng số bản ghi
            $scope.totalItems = resp.data.totalElements;
            // Tổng số trang
            $scope.totalPages = Math.ceil(
              $scope.totalItems / $scope.itemsPerPage
            );
            // console.log("TST :", $scope.totalItems);
            if ($scope.HoaDonLoadPhanTrang.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          })
          .catch((error) => {
            console.log("Lỗi Load HĐ", error);
          });
      };

      $scope.$watch("currentPage", $scope.ShowHoaDon);
      // lọc hoá đơn theo trạng thái

      $scope.locTrangThai = function (trangthaiValue) {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var trangthai = trangthaiValue || ""; // Sử dụng giá trị truyền vào

        // Đặt lại currentPage về 1 trước khi gọi API tìm kiếm
        $scope.currentPage = 1;

        if (!trangthai) {
          // Nếu giá trị là null hoặc rỗng, gọi lại danh sách đầy đủ
          $scope.ShowHoaDon();
          console.log("Gọi Hàm Loadhđ");
        } else {
          $http
            .get(
              "http://localhost:8080/api/admin/hoadon/loc/trangthaihoadon?pageNumber=" +
                ($scope.currentPage - 1) +
                "&pageSize=" +
                $scope.pageSize +
                "&trangthai=" +
                trangthai,
              config
            )
            .then(function (response) {
              $scope.HoaDonLoadPhanTrang = response.data.content;
              console.log(
                "Lọc SP Theo Nhiều Tiêu Chí:",
                $scope.HoaDonLoadPhanTrang
              );

              $scope.showNextButton =
                $scope.HoaDonLoadPhanTrang.length >= $scope.pageSize;
            })
            .catch(function (error) {
              console.log("Lỗi khi tìm kiếm sản phẩm", error);
            });
        }
      };

      $scope.locMaHoaDon = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var mahoadon = $scope.mahoadonTK;

        // Gán lại currentPage về 1 trước khi gọi API tìm kiếm
        $scope.currentPage = 1;

        if (mahoadon == "") {
          // Nếu giá trị là null hoặc rỗng, gọi lại danh sách đầy đủ
          $scope.ShowHoaDon();
          console.log("Gọi Hàm LoadHĐ");
        } else {
          $http
            .get(
              "http://localhost:8080/api/admin/hoadon/loc/mahoadon?pageNumber=" +
                ($scope.currentPage - 1) + // Giảm 1 vì API tính pageNumber từ 0
                "&pageSize=" +
                $scope.pageSize +
                "&mahoadon=" +
                mahoadon,
              config
            )
            .then(function (response) {
              $scope.HoaDonLoadPhanTrang = response.data.content;
              console.log("Lọc Hoa đơn theo ma :", $scope.HoaDonLoadPhanTrang);

              if ($scope.HoaDonLoadPhanTrang.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            })
            .catch(function (error) {
              console.log("Lỗi khi tìm kiếm sản phẩm", error);
            });
        }
      };

      $scope.loaihoadon = "";
      $scope.locLoaiHoaDon = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var loaihoadon = $scope.loaihoadon;

        // Gán lại currentPage về 1 trước khi gọi API tìm kiếm
        $scope.currentPage = 1;

        if (loaihoadon == "") {
          // Nếu giá trị là null hoặc rỗng, gọi lại danh sách đầy đủ
          $scope.ShowHoaDon();
          console.log("Gọi Hàm LoadHĐ");
        } else {
          $http
            .get(
              "http://localhost:8080/api/admin/hoadon/loc/loaihoadon?pageNumber=" +
                ($scope.currentPage - 1) + // Giảm 1 vì API tính pageNumber từ 0
                "&pageSize=" +
                $scope.pageSize +
                "&loaihoadon=" +
                loaihoadon,
              config
            )
            .then(function (response) {
              $scope.HoaDonLoadPhanTrang = response.data.content;
              console.log(
                "Lọc Hoa đơn theo loai :",
                $scope.HoaDonLoadPhanTrang
              );

              if ($scope.HoaDonLoadPhanTrang.length < $scope.pageSize) {
                $scope.showNextButton = false; // Ẩn nút "Next"
              } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
              }
            })
            .catch(function (error) {
              console.log("Lỗi khi tìm kiếm sản phẩm", error);
            });
        }
      };
      $scope.redirectToHoaDonDetails = function (hoaDonId) {
        // Lưu id vào localStorage hoặc sử dụng biến trong controller
        localStorage.setItem("IDHoaDonUpdate", hoaDonId);
      };

      $scope.selectedTab = 0; // Mục đang được chọn ban đầu

      // Hàm chọn tab
      $scope.selectTab = function (tabIndex) {
        $scope.selectedTab = tabIndex;
      };

      // Hàm kiểm tra xem mục có phải là mục được chọn không
      $scope.isSelected = function (tabIndex) {
        return $scope.selectedTab === tabIndex;
      };
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
    }
  }
);
