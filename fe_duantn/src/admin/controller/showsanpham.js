app.controller(
  "ShowSanPhamController",
  function ($scope, $http, $route, $window) {
    var role = $window.localStorage.getItem("role");
    var token = localStorage.getItem("accessToken");

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

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
      $scope.itemsPerPage = 10;
      $scope.sanPhamLoadPhanTrang = [];
      $scope.listDanhMuc = [];
      $scope.listSize = [];
      $scope.listMauSac = [];
      $scope.listchatlieu = [];
      $scope.listxuatxu = [];
      $scope.listthuonghieu = [];

      // khai báo 2 biến cho các hàm tìm kiếm
      $scope.pageNumber = 0;
      $scope.pageSize = 10;

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

      // Load sp shop lên trang shop
      $scope.ShowSP = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            `http://localhost:8080/api/admin/hoadonchitiet/load?page=${
              $scope.currentPage - 1
            }`,
            config
          )
          .then((resp) => {
            $scope.sanPhamLoadPhanTrang = resp.data.content;
            console.log("Load SPShop :", $scope.sanPhamLoadPhanTrang);

            // Cập nhật tổng số bản ghi và số trang
            $scope.totalItems = resp.data.totalElements;
            $scope.totalPages = $scope.getTotalPages();
            $scope.showNextButton = $scope.currentPage < $scope.totalPages;
          })
          .catch((error) => {
            console.log("Lỗi Load SPShop", error);
          });
      };
      $scope.$watch("currentPage", $scope.ShowSP);

      $scope.locTenSPShop = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var tensanpham = $scope.tensp;

        // Gán lại currentPage về 1 trước khi gọi API tìm kiếm
        $scope.currentPage = 1;

        if (tensanpham == "") {
          // Nếu giá trị là null hoặc rỗng, gọi lại danh sách đầy đủ
          $scope.ShowSP();
          console.log("Gọi Hàm LoadSPShop");
        } else {
          $http
            .get(
              "http://localhost:8080/api/admin/hoadonchitiet/loc-ten-sp?pageNumber=" +
                ($scope.currentPage - 1) +
                "&pageSize=" +
                $scope.pageSize +
                "&tensp=" +
                tensanpham,
              config
            )
            .then(function (response) {
              $scope.sanPhamLoadPhanTrang = response.data.content;
              console.log(
                "Lọc SP Theo Nhiều Tiêu Chí :",
                $scope.sanPhamLoadPhanTrang
              );

              // Cập nhật tổng số bản ghi và số trang
              $scope.totalItems = response.data.totalElements;
              $scope.totalPages = $scope.getTotalPages();
              $scope.showNextButton = $scope.currentPage < $scope.totalPages;
            })
            .catch(function (error) {
              console.log("Lỗi khi tìm kiếm sản phẩm", error);
            });
        }
      };

      // Lọc sản phẩm theo nhiều tiêu chí. tendanhmuc, tenmausac, tensize
      // Khởi tạo giá trị ban đầu cho các biến
      $scope.tendanhmuc = "";
      $scope.tenmausac = "";
      $scope.tensize = "";
      $scope.tenchatlieu = "";
      $scope.tenxuatxu = "";
      $scope.tenthuonghieu = "";

      $scope.locSPShopNhieuTC = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var tendm = $scope.tendanhmuc;
        var tenms = $scope.tenmausac;
        var tens = $scope.tensize;
        var tencl = $scope.tenchatlieu;
        var tenxx = $scope.tenxuatxu;
        var tenth = $scope.tenthuonghieu;

        // Gán lại currentPage về 1 trước khi gọi API lọc sản phẩm theo nhiều tiêu chí
        $scope.currentPage = 1;

        if (
          tendm == "" &&
          tenms == "" &&
          tens == "" &&
          tencl == "" &&
          tenxx == "" &&
          tenth == ""
        ) {
          // Nếu giá trị là null hoặc rỗng tại các trường tìm kiếm, gọi lại danh sách đầy đủ
          $scope.ShowSP();
          console.log("Gọi Hàm LoadSPShop");
        } else {
          $http
            .get(
              "http://localhost:8080/api/admin/hoadonchitiet/loc-tieu-chi-sp?pageNumber=" +
                ($scope.currentPage - 1) +
                "&pageSize=" +
                $scope.pageSize +
                "&tendanhmuc=" +
                tendm +
                "&tenmausac=" +
                tenms +
                "&tensize=" +
                tens +
                "&tenchatlieu=" +
                tencl +
                "&tenxuatxu=" +
                tenxx +
                "&tenthuonghieu=" +
                tenth,
              config
            )
            .then(function (response) {
              $scope.sanPhamLoadPhanTrang = response.data.content;
              console.log(
                "Lọc SP Theo Nhiều Tiêu Chí :",
                $scope.sanPhamLoadPhanTrang
              );

              // Cập nhật tổng số bản ghi và số trang
              $scope.totalItems = response.data.totalElements;
              $scope.totalPages = $scope.getTotalPages();
              $scope.showNextButton = $scope.currentPage < $scope.totalPages;
            })
            .catch(function (error) {
              console.log("Lỗi khi lọc sản phẩm theo nhiều tiêu chí", error);
            });
        }
      };
      $scope.resetFilters = function () {
        $scope.tendanhmuc = "";
        $scope.tenmausac = "";
        $scope.tensize = "";
        $scope.tenchatlieu = "";
        $scope.tenxuatxu = "";
        $scope.tenthuonghieu = "";
        $scope.tensp = ""; // Xóa giá trị của tensp
        $scope.isLocTNTC = false; // Reset trạng thái lọc nhiều tiêu chí

        // Gán lại currentPage về 1 trước khi gọi hàm ShowSP
        $scope.currentPage = 1;

        // Gọi hàm ShowSP để load lại dữ liệu
        $scope.ShowSP();
      };

      // Load danh mục sản phẩm shop
      $scope.getAllDanhMucSPShop = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/admin/danhmuc/hien-thi-combobox",
            config
          )
          .then(function (response) {
            $scope.danhmucs = response.data;
            console.log("ListDM :", $scope.listDanhMuc);
          });
      };
      $scope.getAllDanhMucSPShop();

      // Load màu sắc sản phẩm shop
      $scope.getAllMauSacSPShop = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/admin/mausac/hien-thi-combobox",
            config
          )
          .then(function (response) {
            $scope.MauSacs = response.data;
            console.log("Listcl :", $scope.listMauSac);
          });
      };
      $scope.getAllMauSacSPShop();

      // Load chat lieu sản phẩm shop
      $scope.getAllchatlieu = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/admin/chatlieu/hien-thi-combobox",
            config
          )
          .then(function (response) {
            $scope.Chatlieus = response.data;
            console.log("Listcl :", $scope.listchatlieu);
          });
      };
      $scope.getAllchatlieu();

      $scope.getAllxuatxu = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/admin/xuatxu/hien-thi-combobox",
            config
          )
          .then(function (response) {
            $scope.xuatXus = response.data;
            console.log("Listcl :", $scope.listxuatxu);
          });
      };
      $scope.getAllxuatxu();
      $scope.getAllthuonghieu = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get(
            "http://localhost:8080/api/admin/thuonghieu/hien-thi-combobox",
            config
          )
          .then(function (response) {
            $scope.thuongHieus = response.data;
            console.log("Listcl :", $scope.listthuonghieu);
          });
      };
      $scope.getAllthuonghieu();
      // Load danh mục sản phẩm shop
      $scope.getAllSizeSPShop = function () {
        var token = localStorage.getItem("accessToken");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        $http
          .get("http://localhost:8080/api/admin/size/hien-thi-combobox", config)
          .then(function (response) {
            $scope.Sizes = response.data;
            // Sắp xếp dữ liệu theo thứ tự mong muốn (S, M, L, XL, XXL)
            $scope.listSize.sort(function (a, b) {
              var sizesOrder = ["S", "M", "L", "XL", "XXL"];
              return (
                sizesOrder.indexOf(a.tensize) - sizesOrder.indexOf(b.tensize)
              );
            });
            console.log("ListSize :", $scope.listSize);
          });
      };

      $scope.getAllSizeSPShop();

      $scope.redirectToProductDetails = function (productId) {
        // Lưu id vào localStorage hoặc sử dụng biến trong controller
        localStorage.setItem("IDSanPhamUpdate", productId);
      };
    }
  }
);
