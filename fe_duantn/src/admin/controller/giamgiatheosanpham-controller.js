app.controller(
  "GiamGiaTheoSanPhamController",
  function ($scope, $http, $route, $window, $routeParams, $timeout) {
    var role = $window.localStorage.getItem("role");
    var idGGUpdate = $routeParams.id;
    console.log("IdGG :", idGGUpdate);
    if (!role) {
      // Display alert if not logged in
      Swal.fire({
        title: "Bạn cần phải đăng nhập !",
        text: "Vui lòng đăng nhập để sử dụng chức năng !",
        icon: "warning",
      });
      // Redirect to login page
      $window.location.href =
        "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
    }

    // Khai báo quyền và lấy token
    $scope.isAdmin = role === "ADMIN" || role === "NHANVIEN";
    var token = localStorage.getItem("accessToken");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    // Nếu chưa đăng nhập không thực hiện các hàm bên dưới
    if ($scope.isAdmin) {
      // Load tất cả mã giảm giá
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;
      $scope.pageNumber = 0;
      $scope.pageSize = 10;
      $scope.MSPhanTrang = [];
      $scope.totalItems = 0;
      $scope.totalPages = 0;
      $scope.showNextButton = false;

      // Hàm xử lý previou trang
      $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
          $scope.currentPage--;
          $scope.loadData();
        }
      };

      // Hàm xử lý next trang
      $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
          $scope.currentPage++;
          $scope.LoadGiamGia();
        }
      };

      // Get total pages
      $scope.getTotalPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
      };

      // Hàm xử lý load giam gia
      $scope.LoadGiamGia = function () {
        $http
          .get(
            `http://localhost:8080/api/admin/giamgia/hien-thi?page=${
              $scope.currentPage - 1
            }&size=${$scope.itemsPerPage}`,
            config
          )
          .then((resp) => {
            $scope.GGPhanTrang = resp.data.content;
            console.log("Load giảm giá :", $scope.GGPhanTrang);

            // Total items and pages
            $scope.totalItems = resp.data.totalElements;
            $scope.totalPages = $scope.getTotalPages();
            $scope.showNextButton =
              $scope.GGPhanTrang.length >= $scope.pageSize;
          })
          .catch((error) => {
            console.log("Lỗi load giảm giá !", error);
          });
      };
      $scope.LoadGiamGia();
      // lọc mã giảm giá theo mã
      $scope.locMaggShop = function () {
        var magiamgia = $scope.magiamgia;

        // Gán lại currentPage về 1 trước khi gọi API tìm kiếm
        $scope.currentPage = 1;

        if (magiamgia === "") {
          // Nếu giá trị là null hoặc rỗng, gọi lại danh sách đầy đủ
          $scope.LoadGiamGia();
          console.log("Gọi Hàm LoadGiamGiaDaApDung");
        } else {
          $http
            .get(
              "http://localhost:8080/api/admin/giamgia/loc/magiamgia?page=" +
                ($scope.currentPage - 1) + // Giảm 1 vì API tính page từ 0
                "&size=" +
                $scope.itemsPerPage +
                "&magiamgia=" +
                magiamgia,
              config
            )
            .then(function (response) {
              $scope.GGPhanTrang = response.data.content;
              console.log("Lọc Ma giam gia:", $scope.GGPhanTrang);

              // Cập nhật tổng số bản ghi và số trang
              $scope.totalItems = response.data.totalElements;
              $scope.totalPages = $scope.getTotalPages();

              // Hiển thị hoặc ẩn nút "Next"
              $scope.showNextButton = $scope.currentPage < $scope.totalPages;
            })
            .catch(function (error) {
              console.log("Lỗi khi tìm kiếm sản phẩm", error);
            });
        }
      };
      // lọc khoảng ngày tạo giảm giá

      $scope.locTheoKhoangNgay = function () {
        var startDate = $scope.startDate ? new Date($scope.startDate) : null;
        var endDate = $scope.endDate ? new Date($scope.endDate) : null;

        // Kiểm tra nếu ngày kết thúc phải lớn hơn ngày bắt đầu
        if (startDate && endDate) {
          var startDateObj = new Date(startDate);
          var endDateObj = new Date(endDate);

          if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
            Swal.fire({
              title: "Lỗi",
              text: "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.",
              icon: "error",
              confirmButtonText: "OK",
            });
            return; // Dừng hàm nếu ngày không hợp lệ
          }

          if (endDateObj < startDateObj) {
            Swal.fire({
              title: "Lỗi",
              text: "Ngày kết thúc phải lớn hơn ngày bắt đầu.",
              icon: "error",
              confirmButtonText: "OK",
            });
            return; // Dừng hàm nếu điều kiện không được đáp ứng
          }
        } else {
          Swal.fire({
            title: "Lỗi",
            text: "Cả ngày bắt đầu và ngày kết thúc đều phải được nhập.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return; // Dừng hàm nếu ngày bắt đầu hoặc ngày kết thúc bị thiếu
        }

        // Chuyển đổi ngày thành định dạng YYYY-MM-DD
        var formattedStartDate = startDate
          ? $scope.formatDateToYYYYMMDD(startDate)
          : null;
        var formattedEndDate = endDate
          ? $scope.formatDateToYYYYMMDD(endDate)
          : null;

        // Gán lại currentPage về 1 trước khi gọi API tìm kiếm
        $scope.currentPage = 1;

        if (!formattedStartDate || !formattedEndDate) {
          // Nếu ngày bắt đầu hoặc ngày kết thúc không được chọn, gọi lại danh sách đầy đủ
          $scope.LoadGiamGia();
          console.log("Gọi Hàm LoadGiamGia với khoảng ngày");
        } else {
          var url = "http://localhost:8080/api/admin/giamgia/loc/khoangngay";
          var params = {
            pageNumber: $scope.currentPage - 1, // Giảm 1 vì API tính pageNumber từ 0
            pageSize: $scope.pageSize,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          };

          $http
            .get(url, { params: params, ...config })
            .then(function (response) {
              $scope.GGPhanTrang = response.data.content;
              console.log("Lọc Theo Khoảng Ngày:", $scope.GGPhanTrang);

              // Cập nhật tổng số bản ghi và số trang
              $scope.totalItems = response.data.totalElements;
              $scope.totalPages = $scope.getTotalPages();

              // Hiển thị hoặc ẩn nút "Next"
              $scope.showNextButton = $scope.currentPage < $scope.totalPages;
            })
            .catch(function (error) {
              console.log("Lỗi khi lọc theo khoảng ngày", error);
            });
        }
      };

      // Hàm chuyển đổi ngày thành định dạng YYYY-MM-DD
      $scope.formatDateToYYYYMMDD = function (date) {
        if (date) {
          var d = new Date(date);
          var year = d.getFullYear();
          var month = ("0" + (d.getMonth() + 1)).slice(-2);
          var day = ("0" + d.getDate()).slice(-2);
          return year + "-" + month + "-" + day;
        }
        return "";
      };
      // Hàm load dữ liệu chung
      $scope.loadData = function () {
        switch ($scope.currentFilter) {
          case "CODE":
            $scope.locMaggShop(false); // Gọi hàm locMaggShop mà không reset currentPage
            break;
          case "DATE":
            $scope.locTheoKhoangNgay(false); // Gọi hàm locTheoKhoangNgay mà không reset currentPage
            break;
          default:
            $scope.LoadGiamGia(); // Nếu không có bộ lọc, load toàn bộ dữ liệu
        }
      };
      $scope.selectedmaGG = "";

      function generateProductCode() {
        const randomNumbers = Math.floor(
          1000000000 + Math.random() * 9000000000
        ); // Tạo chuỗi số ngẫu nhiên gồm 10 ký tự
        const productCode = "GG_" + randomNumbers; // Tạo mã sản phẩm với tiền tố "TH_"

        // Gán giá trị mã sản phẩm vào biến selectedmaSP trong $scope
        $scope.selectedmaGG = productCode;

        // Đặt giá trị mã sản phẩm vào input có id là "inputText"
        const inputElement = document.getElementById("inputText");
        if (inputElement) {
          inputElement.value = productCode;
        }
      }
      $scope.generateProductCode = generateProductCode;

      $scope.clearErrorMessages = function () {
        $scope.errorMessage = {};
      };
      $scope.AddGiamGia = function () {
        $scope.clearErrorMessages();
        let hasError = false;

        if (!$scope.selectedmaGG) {
          $scope.errorMessage.selectedmaGG = "Vui lòng không bỏ trống";
          hasError = true;
        }
        if (!$scope.selectedtenGG) {
          $scope.errorMessage.selectedtenGG = "Vui lòng không bỏ trống";
          hasError = true;
        }
        if (!$scope.selectedNgayBatDau) {
          $scope.errorMessage.selectedNgayBatDau = "Vui lòng chọn ngày bắt đầu";
          hasError = true;
        } else {
          var today = new Date();
          var ngayBatDau = new Date($scope.selectedNgayBatDau);

          // Đặt giờ, phút, giây và mili giây về 0 để chỉ so sánh ngày
          today.setHours(0, 0, 0, 0);
          ngayBatDau.setHours(0, 0, 0, 0);

          if (ngayBatDau < today) {
            $scope.errorMessage.selectedNgayBatDau =
              "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại";
            hasError = true;
          }
        }
        if (!$scope.selectedNgayKetThuc) {
          $scope.errorMessage.selectedNgayKetThuc =
            "Vui lòng chọn ngày kết thúc";
          hasError = true;
        } else if ($scope.selectedNgayBatDau && $scope.selectedNgayKetThuc) {
          var ngayBatDau = new Date($scope.selectedNgayBatDau);
          var ngayKetThuc = new Date($scope.selectedNgayKetThuc);

          if (ngayKetThuc <= ngayBatDau) {
            $scope.errorMessage.selectedNgayKetThuc =
              "Ngày kết thúc phải lớn hơn ngày bắt đầu";
            hasError = true;
          }
        }
        if (!$scope.selectedHinhThuc) {
          $scope.errorMessage.selectedHinhThuc = "Vui lòng chọn hình thức giảm";
          hasError = true;
        }

        if (!$scope.selectedSoTienGiam) {
          $scope.errorMessage.selectedSoTienGiam = "Vui lòng nhập số tiền giảm";
          hasError = true;
        } else if ($scope.selectedHinhThuc == 1) {
          var soTienGiam = parseFloat($scope.selectedSoTienGiam);

          // Kiểm tra xem số tiền giảm có nằm trong khoảng từ 0 đến 50 không
          if (isNaN(soTienGiam) || soTienGiam < 0 || soTienGiam > 50) {
            $scope.errorMessage.selectedSoTienGiam =
              "Số tiền giảm phải từ 0 đến 50 khi chọn hình thức giảm là %";
            hasError = true;
          }
        }

        if (hasError) {
          return;
        }

        Swal.fire({
          title: "Xác Nhận",
          text: "Bạn có muốn thêm mã giảm giá không?",
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
              var url = "http://localhost:8080/api/admin/giamgia/add-giamgia";
              var data = {
                magiamgia: $scope.selectedmaGG,
                tengiamgia: $scope.selectedtenGG,
                ngaybatdau: $scope.selectedNgayBatDau,
                ngayketthuc: $scope.selectedNgayKetThuc,
                hinhthucgiam: $scope.selectedHinhThuc,
                giatrigiam: $scope.selectedSoTienGiam,
                ghichu: $scope.selectedMoTaGG,
              };

              $http
                .post(url, data, config)
                .then((response) => {
                  // Kiểm tra cấu trúc của response
                  console.log("Response:", response);

                  // Giả sử idgiamgia nằm trong response.data
                  $window.localStorage.setItem(
                    "IdGGKhiThem",
                    response.data.idgiamgia
                  );

                  Swal.fire({
                    title: "Thành Công",
                    text: "Thêm giảm giá thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  setTimeout(function () {
                    $window.location.href = "#/themsanphamgiamgia";
                  }, 1500);
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Lỗi",
                    text: "Đã xảy ra lỗi khi thêm mã giảm giá",
                    icon: "error",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  console.log("Lỗi thêm mã giảm giá !", error);
                });
            } else {
              Swal.fire({
                title: "Lỗi",
                text: "Bạn không có quyền truy cập!",
                icon: "error",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              });
              console.log("Bạn không có quyền truy cập !");
            }
          }
        });
      };
      $scope.getLoadMaGiamGiaTheoID = function () {
        var id = localStorage.getItem("IdGGKhiThem");
        var apiUrl = "http://localhost:8080/api/admin/giamgia/find-by";

        var params = { id: id };
        var token = localStorage.getItem("accessToken");

        var config = {
          params: params,
          headers: { Authorization: "Bearer " + token },
        };

        $http
          .get(apiUrl, config)
          .then(function (response) {
            if (response.data) {
              $scope.GGTheoId = response.data;
              console.log("Dữ liệu GG từ API:", $scope.GGTheoId);
            } else {
              console.error("API không trả về dữ liệu.");
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
          });
      };
      $scope.getLoadMaGiamGiaTheoID();
      // Khai báo các biến cho phân trang 1

      $scope.currentPage1 = 1;
      $scope.itemsPerPage1 = 10;
      $scope.pageNumber1 = 0;
      $scope.pageSize1 = 9;
      $scope.GGPhanTrang1 = [];
      $scope.totalItems1 = 0;
      $scope.totalPages1 = 0;
      $scope.showNextButton1 = false;

      $scope.showNextButton2 = false;

      // Hàm xử lý previous trang cho phân trang 1
      $scope.previousPage1 = function () {
        if ($scope.currentPage1 > 1) {
          $scope.currentPage1--;
          $scope.LoadSanPhamGiamGia();
        }
      };

      // Hàm xử lý next trang cho phân trang 1
      $scope.nextPage1 = function () {
        if ($scope.currentPage1 < $scope.totalPages1) {
          $scope.currentPage1++;
          $scope.LoadSanPhamGiamGia();
        }
      };

      // Get total pages cho phân trang 1
      $scope.getTotalPages1 = function () {
        return Math.ceil($scope.totalItems1 / $scope.itemsPerPage1);
      };

      // Load danh sách giảm giá sản phẩm cho phân trang 1
      $scope.LoadSanPhamGiamGia = function () {
        var idGGKhiThem = localStorage.getItem("IdGGKhiThem");
        if (!idGGKhiThem) {
          console.log("ID giảm giá chưa được xác định.");
          return;
        }

        console.log("ID lấy từ localStorage:", idGGKhiThem); // Kiểm tra giá trị

        $http
          .get(
            `http://localhost:8080/api/admin/giamgia/hien-thi-sanpham-giamgia?page=${
              $scope.currentPage1 - 1
            }&id=${idGGKhiThem}`,
            config
          )
          .then((resp) => {
            $scope.GGPhanTrang1 = resp.data.content;
            console.log("Load giảm giá:", $scope.GGPhanTrang1);

            // Tổng số mục và trang
            $scope.totalItems1 = resp.data.totalElements;
            $scope.totalPages1 = $scope.getTotalPages1();
            $scope.showNextButton1 =
              $scope.GGPhanTrang1.length >= $scope.itemsPerPage1;
          })
          .catch((error) => {
            console.log("Lỗi load giảm giá:", error);
          });
      };

      // Load danh sách giảm giá sản phẩm cho phân trang 2

      // Gọi hàm để tải dữ liệu khi trang được khởi tạo
      $scope.LoadSanPhamGiamGia();

      // Hàm mở modal
      $scope.openModal02 = function () {
        var modal = document.getElementById("myModal02");
        if (modal) {
          modal.style.display = "block";
        }
      };

      // Hàm đóng modal
      $scope.closeModal02 = function () {
        var modal = document.getElementById("myModal02");
        if (modal) {
          modal.style.display = "none";
        }
      };
      $scope.openModal03 = function () {
        var modal = document.getElementById("myModal03");
        if (modal) {
          modal.style.display = "block";
        }
      };

      // Hàm đóng modal
      $scope.closeModal03 = function () {
        var modal = document.getElementById("myModal03");
        if (modal) {
          modal.style.display = "none";
        }
      };
      // Khai báo các biến cho phân trang 2
      $scope.currentPage2 = 1;
      $scope.itemsPerPage2 = 10;
      $scope.GGPhanTrang2 = [];
      $scope.totalItems2 = 0;
      $scope.totalPages2 = 0;
      $scope.showNextButton2 = false;

      // Hàm xử lý previous trang cho phân trang 2
      $scope.previousPage2 = function () {
        if ($scope.currentPage2 > 1) {
          $scope.currentPage2--;
          $scope.LoadSanPhamGiamGiaThem();
        }
      };

      // Hàm xử lý next trang cho phân trang 2
      $scope.nextPage2 = function () {
        if ($scope.currentPage2 < $scope.totalPages2) {
          $scope.currentPage2++;
          $scope.LoadSanPhamGiamGiaThem();
        }
      };

      // Get total pages cho phân trang 2
      $scope.getTotalPages2 = function () {
        return Math.ceil($scope.totalItems2 / $scope.itemsPerPage2);
      };

      // Load danh sách giảm giá sản phẩm cho phân trang 2
      $scope.LoadSanPhamGiamGiaThem = function () {
        var idGGKhiThem = localStorage.getItem("IdGGKhiThem");
        if (!idGGKhiThem) {
          console.log("ID giảm giá chưa được xác định.");
          return;
        }

        console.log("ID lấy từ localStorage:", idGGKhiThem); // Kiểm tra giá trị

        $http
          .get(
            `http://localhost:8080/api/admin/giamgia/hien-thi-them?page=${
              $scope.currentPage2 - 1
            }&size=${$scope.itemsPerPage2}&id=${idGGKhiThem}`,
            config
          )
          .then((resp) => {
            $scope.GGPhanTrang2 = resp.data.content;
            console.log("Load giảm giá thêm:", $scope.GGPhanTrang2);

            // Tổng số mục và trang
            $scope.totalItems2 = resp.data.totalElements;
            $scope.totalPages2 = $scope.getTotalPages2();
            $scope.showNextButton2 =
              $scope.GGPhanTrang2.length >= $scope.itemsPerPage2;
          })
          .catch((error) => {
            console.log("Lỗi load giảm giá thêm:", error);
          });
      };

      // Gọi hàm để tải dữ liệu khi trang được khởi tạo
      $scope.LoadSanPhamGiamGiaThem();

      // Hàm mở modal
      $scope.openModal02 = function () {
        var modal = document.getElementById("myModal02");
        if (modal) {
          modal.style.display = "block";
        }
      };

      // Hàm đóng modal
      $scope.closeModal02 = function () {
        var modal = document.getElementById("myModal02");
        if (modal) {
          modal.style.display = "none";
        }
      };
      // Hàm để thêm sản phẩm giảm giá
      $scope.addSanPhamGiamGia = function (idsp) {
        var idgg = localStorage.getItem("IdGGKhiThem"); // Lấy ID giảm giá từ localStorage

        if (!idgg) {
          Swal.fire("Lỗi", "ID giảm giá chưa được xác định.", "error");
          return;
        }

        // Gọi API thêm sản phẩm giảm giá
        $http
          .put(
            `http://localhost:8080/api/admin/giamgia/add-sanpham-giamgia?idsp=${idsp}&idgg=${idgg}`,
            null,
            config
          )
          .then(function (response) {
            Swal.fire({
              title: "Success",
              text: "Thêm sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
          })
          .catch(function (error) {
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi thêm sản phẩm giảm giá.",
              "error"
            );
          });
      };
      $scope.deleteSanPhamGiamGia = function (idsp) {
        $http
          .put(
            `http://localhost:8080/api/admin/giamgia/delet-sanpham-giamgia?idsp=${idsp}`,
            null,
            config
          )
          .then(function (response) {
            Swal.fire({
              title: "Success",
              text: "Xoá sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
          })
          .catch(function (error) {
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi xoá sản phẩm giảm giá.",
              "error"
            );
          });
      };
      $scope.UpdateTrangThaiGiamGia = function (idgg) {
        // Xác định trạng thái mới
        var newTrangThai = idgg.trangthai === 1 ? 2 : 1;

        // Gửi yêu cầu PUT để cập nhật trạng thái
        $http
          .put(
            `http://localhost:8080/api/admin/giamgia/trangthai-giamgia?idgg=${idgg.id}`,
            null,
            config
          )
          .then(function (response) {
            // Cập nhật trạng thái trong giao diện người dùng
            idgg.trangthai = newTrangThai;

            // Hiển thị thông báo thành công
            Swal.fire({
              title: "Success",
              text: "Cập nhật trạng thái giảm giá thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch(function (error) {
            // Hiển thị thông báo lỗi
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi cập nhật trạng thái giảm giá.",
              "error"
            );
          });
      };

      $scope.quayLai = function () {
        $window.location.href = "#/giamgiatheosanpham";
      };
      // update
      $scope.addSanPhamGiamGiaUpdate = function (idsp) {
        // Gọi API thêm sản phẩm giảm giá
        $http
          .put(
            `http://localhost:8080/api/admin/giamgia/add-sanpham-giamgia?idsp=${idsp}&idgg=${idGGUpdate}`,
            null,
            config
          )
          .then(function (response) {
            Swal.fire({
              title: "Success",
              text: "Thêm sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
          })
          .catch(function (error) {
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi thêm sản phẩm giảm giá.",
              "error"
            );
          });
      };
      $scope.deleteSanPhamGiamGiaUpdate = function (idsp) {
        $http
          .put(
            `http://localhost:8080/api/admin/giamgia/delet-sanpham-giamgia?idsp=${idsp}`,
            null,
            config
          )
          .then(function (response) {
            Swal.fire({
              title: "Success",
              text: "Xoá sản phẩm thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
          })
          .catch(function (error) {
            Swal.fire(
              "Lỗi",
              "Đã xảy ra lỗi khi xoá sản phẩm giảm giá.",
              "error"
            );
          });
      };
      $scope.currentPage3 = 1;
      $scope.itemsPerPage3 = 10;
      $scope.pageNumber3 = 0;
      $scope.pageSize3 = 9;
      $scope.GGPhanTrang3 = [];
      $scope.totalItems3 = 0;
      $scope.totalPages3 = 0;
      $scope.showNextButton3 = false;

      // Hàm xử lý previous trang cho phân trang 3
      $scope.previousPage3 = function () {
        if ($scope.currentPage3 > 1) {
          $scope.currentPage3--;
          $scope.LoadSanPhamGiamGiaUpdate(); // Sửa tên hàm ở đây
        }
      };

      // Hàm xử lý next trang cho phân trang 3
      $scope.nextPage3 = function () {
        if ($scope.currentPage3 < $scope.totalPages3) {
          $scope.currentPage3++;
          $scope.LoadSanPhamGiamGiaUpdate(); // Sửa tên hàm ở đây
        }
      };

      // Get total pages cho phân trang 3
      $scope.getTotalPages3 = function () {
        return Math.ceil($scope.totalItems3 / $scope.itemsPerPage3);
      };

      // Load danh sách giảm giá sản phẩm cho phân trang 3
      $scope.LoadSanPhamGiamGiaUpdate = function () {
        $http
          .get(
            `http://localhost:8080/api/admin/giamgia/hien-thi-sanpham-giamgia?page=${
              $scope.currentPage3 - 1
            }&id=${idGGUpdate}`,
            config
          )
          .then((resp) => {
            $scope.GGPhanTrang3 = resp.data.content;
            console.log("Load giảm giá:", $scope.GGPhanTrang3);

            // Tổng số mục và trang
            $scope.totalItems3 = resp.data.totalElements;
            $scope.totalPages3 = $scope.getTotalPages3();
            $scope.showNextButton3 =
              $scope.GGPhanTrang3.length >= $scope.itemsPerPage3;
          })
          .catch((error) => {
            console.log("Lỗi load giảm giá:", error);
          });
      };

      // Gọi hàm để tải dữ liệu khi trang được khởi tạo

      $scope.getLoadMaGiamGiaTheoIDUpdate = function () {
        var id = idGGUpdate;
        var apiUrl = "http://localhost:8080/api/admin/giamgia/find-by";

        var params = { id: id };
        var token = localStorage.getItem("accessToken");

        var config = {
          params: params,
          headers: { Authorization: "Bearer " + token },
        };

        $http
          .get(apiUrl, config)
          .then(function (response) {
            if (response.data) {
              $scope.GGTheoIdUpdate = response.data;
              console.log("Fin by giam gia :", $scope.GGTheoIdUpdate);
            } else {
              console.error("API không trả về dữ liệu.");
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
          });
      };
      $scope.hamLoadUpdate = function () {
        $scope.LoadSanPhamGiamGiaUpdate();
        $scope.getLoadMaGiamGiaTheoIDUpdate();
      };
      $scope.errorMessage = {}; // Để lưu trữ thông báo lỗi
      $scope.validateForm = function () {
        $scope.errorMessage = {}; // Reset error messages
        var isValid = true;
        var hasError = false; // Thêm biến này để kiểm tra lỗi cho số tiền giảm

        // Kiểm tra tên giảm giá
        if (!$scope.GGTheoIdUpdate.tengiamgia) {
          $scope.errorMessage.selectedtenGG =
            "Tên giảm giá không được để trống.";
          isValid = false;
        }

        // Kiểm tra hình thức giảm
        if (!$scope.GGTheoIdUpdate.hinhthucgiam) {
          $scope.errorMessage.selectedHinhThuc =
            "Hình thức giảm không được để trống.";
          isValid = false;
        }

        // Kiểm tra giá trị giảm
        if (
          !$scope.GGTheoIdUpdate.giatrigiam ||
          $scope.GGTheoIdUpdate.giatrigiam <= 0
        ) {
          $scope.errorMessage.selectedSoTienGiam =
            "Số tiền giảm phải lớn hơn 0.";
          isValid = false;
        }

        // Kiểm tra ngày bắt đầu
        if (!$scope.GGTheoIdUpdate.ngaybatdau) {
          $scope.errorMessage.selectedNgayBatDau =
            "Ngày bắt đầu không được để trống.";
          isValid = false;
        }

        // Kiểm tra ngày kết thúc
        if (!$scope.GGTheoIdUpdate.ngayketthuc) {
          $scope.errorMessage.selectedNgayKetThuc =
            "Ngày kết thúc không được để trống.";
          isValid = false;
        }

        // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
        if (
          new Date($scope.GGTheoIdUpdate.ngaybatdau) >
          new Date($scope.GGTheoIdUpdate.ngayketthuc)
        ) {
          $scope.errorMessage.selectedNgayKetThuc =
            "Ngày kết thúc phải sau ngày bắt đầu.";
          isValid = false;
        }

        // Kiểm tra số tiền giảm dựa trên hình thức giảm
        if (!$scope.GGTheoIdUpdate.giatrigiam) {
          $scope.errorMessage.selectedSoTienGiam =
            "Vui lòng nhập số tiền giảm.";
          hasError = true;
        } else if ($scope.GGTheoIdUpdate.hinhthucgiam == 1) {
          // Giả sử 1 là hình thức % giảm
          var soTienGiam = parseFloat($scope.GGTheoIdUpdate.giatrigiam);

          // Kiểm tra xem số tiền giảm có nằm trong khoảng từ 0 đến 50 không
          if (isNaN(soTienGiam) || soTienGiam < 0 || soTienGiam > 50) {
            $scope.errorMessage.selectedSoTienGiam =
              "Số tiền giảm phải từ 0 đến 50 khi chọn hình thức giảm là %";
            hasError = true;
          }
        }

        return isValid && !hasError;
      };

      $scope.updateGiamGia = function () {
        var idgg = idGGUpdate; // Đảm bảo rằng idGGUpdate đã được gán giá trị UUID thực tế

        var data = {
          tengiamgia: $scope.GGTheoIdUpdate.tengiamgia,
          ngaybatdau: $scope.GGTheoIdUpdate.ngaybatdau,
          ngayketthuc: $scope.GGTheoIdUpdate.ngayketthuc,
          hinhthucgiam: $scope.GGTheoIdUpdate.hinhthucgiam,
          giatrigiam: $scope.GGTheoIdUpdate.giatrigiam,
          ghichu: $scope.GGTheoIdUpdate.ghichu,
        };
        if ($scope.validateForm()) {
          var token = localStorage.getItem("accessToken");
          var config = {
            headers: {
              Authorization: "Bearer " + token,
            },
            params: { idgg: idgg },
          };
          Swal.fire({
            title: "Xác Nhận",
            text: "Bạn có muốn sửa mã giảm giá không?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy Bỏ",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác Nhận",
            reverseButtons: true,
          }).then((result) => {
            $http
              .put(
                "http://localhost:8080/api/admin/giamgia/updtae-giamgia",
                data,
                config
              )
              .then(function (response) {
                Swal.fire({
                  title: "Thành Công",
                  text: "Sửa giảm giá thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $route.reload();
                });
              })
              .catch(function (error) {
                Swal.fire(
                  "Lỗi!",
                  "Có lỗi xảy ra khi cập nhật giảm giá.",
                  "error"
                );
                // Xử lý lỗi ở đây
              });
          });
        }
      };
      // load những sản phẩm đã được áp dụng giảm giá
      $scope.currentPage4 = 1;
      $scope.itemsPerPage4 = 10;
      $scope.totalItems4 = 0;
      $scope.totalPages4 = 0;
      $scope.showNextButton4 = false;

      // Hàm xử lý previou trang
      $scope.previousPage4 = function () {
        if ($scope.currentPage4 > 1) {
          $scope.currentPage4--;
          $scope.LoadGiamGiaDaApDung();
        }
      };

      // Hàm xử lý next trang
      $scope.nextPage4 = function () {
        if ($scope.currentPage4 < $scope.totalPages4) {
          $scope.currentPage4++;
          $scope.LoadGiamGiaDaApDung();
        }
      };

      // Get total pages
      $scope.getTotalPages4 = function () {
        return Math.ceil($scope.totalItems4 / $scope.itemsPerPage4);
      };

      // Hàm xử lý load giảm giá
      $scope.LoadGiamGiaDaApDung = function () {
        $http
          .get(
            `http://localhost:8080/api/admin/giamgia/hien-thi-sanpham-daapdung-giamgia?page=${
              $scope.currentPage4 - 1
            }&size=${$scope.itemsPerPage4}`,
            config
          )
          .then((resp) => {
            $scope.GGPhanTrang4 = resp.data.content;
            console.log(
              "Load sản phẩm giảm giá đã được áp dụng:",
              $scope.GGPhanTrang4
            );

            // Total items and pages
            $scope.totalItems4 = resp.data.totalElements;
            $scope.totalPages4 = $scope.getTotalPages4();
            $scope.showNextButton4 = $scope.currentPage4 < $scope.totalPages4;
          })
          .catch((error) => {
            console.log("Lỗi load giảm giá!", error);
          });
      };

      $scope.LoadGiamGiaDaApDung();
    }
  }
);
