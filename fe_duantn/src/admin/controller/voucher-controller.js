app.controller(
  "VouCherController",
  function ($scope, $http, $route, $window, $routeParams, $timeout) {
    var role = $window.localStorage.getItem("role");
    var idVCUpdate = $routeParams.id;
    console.log("IdVC :", idVCUpdate);
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
      $scope.currentPage = 1;
      $scope.itemsPerPage = 10;
      $scope.totalItems = 0;
      $scope.totalPages = 0;
      $scope.showNextButton = false;
      $scope.currentFilter = ""; // Lưu bộ lọc hiện tại

      // Hàm load dữ liệu chung
      $scope.loadData = function () {
        if ($scope.startDate && $scope.endDate) {
          $scope.locTheoKhoangNgay();
        } else if ($scope.mavoucher) {
          $scope.locMaVoucher();
        } else {
          $scope.LoadVoucher();
          console.log("ApplyFilters");
        }
      };

      // Hàm xử lý trang trước
      $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
          $scope.currentPage--;
          $scope.loadData(); // Gọi lại loadData khi chuyển trang
        }
      };

      // Hàm xử lý trang tiếp theo
      $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
          $scope.currentPage++;
          $scope.loadData(); // Gọi lại loadData khi chuyển trang
        }
      };

      // Lấy tổng số trang
      $scope.getTotalPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
      };

      // Hàm xử lý tải voucher
      $scope.LoadVoucher = function () {
        $http
          .get(
            `http://localhost:8080/api/admin/quan-ly-voucher/hien-thi?page=${
              $scope.currentPage - 1
            }&size=${$scope.itemsPerPage}`,
            config
          )
          .then((resp) => {
            $scope.VCPhanTrang = resp.data.content;
            console.log("Load voucher:", $scope.VCPhanTrang);

            // Cập nhật tổng số bản ghi và số trang
            $scope.totalItems = resp.data.totalElements;
            $scope.totalPages = $scope.getTotalPages();
            $scope.showNextButton = $scope.currentPage < $scope.totalPages;

            console.log("Total Items:", $scope.totalItems);
            console.log("Total Pages:", $scope.totalPages);
            console.log("Current Page:", $scope.currentPage);
            console.log("Show Next Button:", $scope.showNextButton);
          })
          .catch((error) => {
            console.log("Lỗi load voucher!", error);
          });
      };

      // Hàm lọc theo mã voucher
      $scope.locMaVoucher = function () {
        var mavoucher = $scope.mavoucher;

        console.log("Lọc theo mã giảm giá, Mã giảm giá:", mavoucher);

        if (!mavoucher) {
          // Nếu giá trị là null hoặc rỗng, gọi lại danh sách đầy đủ
          $scope.LoadVoucher();
          $scope.currentFilter = ""; // Không áp dụng bộ lọc
          console.log("Gọi Hàm LoadVoucher");
        } else {
          $http
            .get(
              `http://localhost:8080/api/admin/quan-ly-voucher/loc/ma?page=${
                $scope.currentPage - 1
              }&size=${$scope.itemsPerPage}&mavoucher=${mavoucher}`,
              config
            )
            .then(function (response) {
              $scope.VCPhanTrang = response.data.content;
              console.log("Lọc Mã Giảm Giá:", $scope.VCPhanTrang);

              // Cập nhật tổng số bản ghi và số trang
              $scope.totalItems = response.data.totalElements;
              $scope.totalPages = $scope.getTotalPages();
              $scope.showNextButton = $scope.currentPage < $scope.totalPages;

              console.log("Total Items:", $scope.totalItems);
              console.log("Total Pages:", $scope.totalPages);
              console.log("Current Page:", $scope.currentPage);
              console.log("Show Next Button:", $scope.showNextButton);
            })
            .catch(function (error) {
              console.log("Lỗi khi tìm kiếm mã giảm giá", error);
            });
        }
      };

      // Hàm lọc theo khoảng ngày
      $scope.locTheoKhoangNgay = function () {
        var startDate = $scope.startDate ? new Date($scope.startDate) : null;
        var endDate = $scope.endDate ? new Date($scope.endDate) : null;

        // Kiểm tra nếu ngày kết thúc phải lớn hơn ngày bắt đầu
        if (startDate && endDate) {
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            Swal.fire({
              title: "Lỗi",
              text: "Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.",
              icon: "error",
              confirmButtonText: "OK",
            });
            return; // Dừng hàm nếu ngày không hợp lệ
          }

          if (endDate < startDate) {
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

        var url =
          "http://localhost:8080/api/admin/quan-ly-voucher/loc/khoangngay";
        var params = {
          pageNumber: $scope.currentPage - 1, // Giảm 1 vì API tính pageNumber từ 0
          pageSize: $scope.itemsPerPage, // Đảm bảo dùng itemsPerPage
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        console.log("Request URL:", url);
        console.log("Request Params:", params);

        $http
          .get(url, { params: params, ...config })
          .then(function (response) {
            $scope.VCPhanTrang = response.data.content;
            console.log("Lọc Theo Khoảng Ngày:", $scope.VCPhanTrang);

            // Cập nhật tổng số bản ghi và số trang
            $scope.totalItems = response.data.totalElements;
            $scope.totalPages = $scope.getTotalPages();
            $scope.showNextButton = $scope.currentPage < $scope.totalPages;

            console.log("Total Items:", $scope.totalItems);
            console.log("Total Pages:", $scope.totalPages);
            console.log("Current Page:", $scope.currentPage);
            console.log("Show Next Button:", $scope.showNextButton);
          })
          .catch(function (error) {
            console.log("Lỗi khi lọc theo khoảng ngày", error);
          });
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

      // Gọi hàm LoadVoucher khi bắt đầu để tải dữ liệu mặc định
      $scope.loadData();

      // Hàm reset trường lọc
      $scope.resetFields = function () {
        $scope.mavoucher = "";
        $scope.startDate = null;
        $scope.endDate = null;
        $scope.currentPage = 1;
        $scope.loadData(); // Gọi lại loadData để tải dữ liệu mặc định
      };

      $scope.selectedmaVC = "";

      function generateProductCode() {
        const randomNumbers = Math.floor(
          1000000000 + Math.random() * 9000000000
        ); // Tạo chuỗi số ngẫu nhiên gồm 10 ký tự
        const productCode = "VC_" + randomNumbers; // Tạo mã sản phẩm với tiền tố "TH_"

        // Gán giá trị mã sản phẩm vào biến selectedmaSP trong $scope
        $scope.selectedmaVC = productCode;

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
      $scope.AddVoucher = function () {
        $scope.clearErrorMessages();
        let hasError = false;

        if (!$scope.selectedmaVC) {
          $scope.errorMessage.selectedmaVC = "Vui lòng không bỏ trống";
          hasError = true;
        }
        if (!$scope.selectedtenVC) {
          $scope.errorMessage.selectedtenVC = "Vui lòng không bỏ trống";
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
        if (!$scope.selectedSoluongma) {
          $scope.errorMessage.selectedSoluongma = "Vui lòng không bỏ trống";
          hasError = true;
        }
        if (!$scope.selecteddieukiengiam) {
          $scope.errorMessage.selecteddieukiengiam = "Vui lòng không bỏ trống";
          hasError = true;
        }

        if (hasError) {
          return;
        }

        Swal.fire({
          title: "Xác Nhận",
          text: "Bạn có muốn thêmvoucher không?",
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
                "http://localhost:8080/api/admin/quan-ly-voucher/add-voucher";
              var data = {
                mavoucher: $scope.selectedmaVC,
                tenvoucher: $scope.selectedtenVC,
                ngaybatdau: $scope.selectedNgayBatDau,
                ngayketthuc: $scope.selectedNgayKetThuc,
                hinhthucgiam: $scope.selectedHinhThuc,
                giatrigiam: $scope.selectedSoTienGiam,
                dieukientoithieuhoadon: $scope.selecteddieukiengiam,
                soluongma: $scope.selectedSoluongma,
                ghichu: $scope.selectedMoTa,
              };

              $http
                .post(url, data, config)
                .then((response) => {
                  // Kiểm tra cấu trúc của response
                  console.log("Response:", response);
                  Swal.fire({
                    title: "Thành Công",
                    text: "Thêm voucher thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  setTimeout(function () {
                    $window.location.href = "#/voucher";
                  }, 1500);
                })
                .catch((error) => {
                  Swal.fire({
                    title: "Lỗi",
                    text: "Đã xảy ra lỗi khi thêm voucher",
                    icon: "error",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  console.log("Lỗi thêm voucher !", error);
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
      $scope.resetInputs = function () {
        $scope.selectedmaVC = "";
        $scope.selectedtenVC = "";
        $scope.selectedNgayBatDau = null;
        $scope.selectedNgayKetThuc = null;
        $scope.selectedHinhThuc = "";
        $scope.selectedSoTienGiam = "";
        $scope.selecteddieukiengiam = "";
        $scope.selectedSoluongma = "";
        $scope.selectedMoTa = "";
      };
      $scope.quayLai = function () {
        $window.location.href = "#/voucher";
      };
      $scope.UpdateTrangThaiVoucher = function (id) {
        // Xác định trạng thái mới
        var newTrangThai = id.trangthai === 1 ? 2 : 1;

        // Gửi yêu cầu PUT để cập nhật trạng thái
        $http
          .put(
            `http://localhost:8080/api/admin/quan-ly-voucher/trangthai-voucher?id=${id.id}`,
            null,
            config
          )
          .then(function (response) {
            // Cập nhật trạng thái trong giao diện người dùng
            id.trangthai = newTrangThai;

            // Hiển thị thông báo thành công
            Swal.fire({
              title: "Success",
              text: "Cập nhật trạng thái voucher thành công",
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
              "Đã xảy ra lỗi khi cập nhật trạng thái voucher.",
              "error"
            );
          });
      };
      $scope.getLoadVoucherTheoID = function () {
        var id = idVCUpdate; // ID của voucher cần cập nhật

        $http
          .get(
            `http://localhost:8080/api/admin/quan-ly-voucher/find-by?id=${id}`,
            config
          )
          .then(function (response) {
            if (response.data) {
              var data = response.data;
              $scope.VCTheoId = data;

              console.log("detai", $scope.VCTheoId);

              // Chuyển đổi ngày thành đối tượng Date
              $scope.VCTheoId.ngaybatdau = new Date(data.ngaybatdau);
              $scope.VCTheoId.ngayketthuc = new Date(data.ngayketthuc);

              // Chuyển đổi hinhthucgiam thành chuỗi nếu cần thiết
              $scope.VCTheoId.hinhthucgiam = data.hinhthucgiam.toString();

              // Cập nhật các biến tương ứng
              $scope.selectedmaVC = data.mavoucher;
              $scope.selectedtenVC = data.tenvoucher;
              $scope.selectedNgayBatDau = $scope.VCTheoId.ngaybatdau;
              $scope.selectedNgayKetThuc = $scope.VCTheoId.ngayketthuc;
              $scope.selectedHinhThuc = $scope.VCTheoId.hinhthucgiam;
              $scope.selectedSoTienGiam = data.giatrigiam;
              $scope.selecteddieukiengiam = data.dieukientoithieuhoadon;
              $scope.selectedSoluongma = data.soluongma;
              $scope.selectedMoTa = data.ghichu;

              console.log("Fin by giam gia update:", $scope.GGTheoIdUpdate);
            } else {
              console.error("API không trả về dữ liệu.");
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi gọi API:", error);
          });
      };

      
      $scope.resetInputsUpdate = function () {
        $scope.selectedtenVC = "";
        $scope.selectedNgayBatDau = null;
        $scope.selectedNgayKetThuc = null;
        $scope.selectedHinhThuc = "";
        $scope.selectedSoTienGiam = "";
        $scope.selecteddieukiengiam = "";
        $scope.selectedSoluongma = "";
        $scope.selectedMoTa = "";
      };
      $scope.validateInputs = function () {
        $scope.errorMessage = {};

        if (!$scope.selectedtenVC) {
          $scope.errorMessage.selectedtenVC =
            "Tên voucher không được để trống.";
        }
        if (!$scope.selectedHinhThuc) {
          $scope.errorMessage.selectedHinhThuc =
            "Hình thức giảm không được để trống.";
        }
        if (!$scope.selectedSoTienGiam) {
          $scope.errorMessage.selectedSoTienGiam =
            "Số tiền giảm không được để trống.";
        } else {
          if ($scope.selectedHinhThuc == "1") {
            // Khi hình thức giảm là phần trăm
            if (
              $scope.selectedSoTienGiam < 0 ||
              $scope.selectedSoTienGiam > 50
            ) {
              $scope.errorMessage.selectedSoTienGiam =
                "Số tiền giảm phải từ 0 đến 50%.";
            }
          } else if ($scope.selectedSoTienGiam <= 0) {
            // Khi hình thức giảm không phải phần trăm
            $scope.errorMessage.selectedSoTienGiam =
              "Số tiền giảm phải lớn hơn 0.";
          }
        }
        if (!$scope.selectedNgayBatDau) {
          $scope.errorMessage.selectedNgayBatDau =
            "Ngày bắt đầu không được để trống.";
        }
        if (!$scope.selectedNgayKetThuc) {
          $scope.errorMessage.selectedNgayKetThuc =
            "Ngày kết thúc không được để trống.";
        } else {
          var ngayBatDau = new Date($scope.selectedNgayBatDau);
          var ngayKetThuc = new Date($scope.selectedNgayKetThuc);

          if (ngayKetThuc < ngayBatDau) {
            $scope.errorMessage.selectedNgayKetThuc =
              "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.";
          }
        }
        if (!$scope.selectedSoluongma || $scope.selectedSoluongma <= 0) {
          $scope.errorMessage.selectedSoluongma = "Số lượng mã phải lớn hơn 0.";
        }
        if (!$scope.selecteddieukiengiam || $scope.selecteddieukiengiam <= 0) {
          $scope.errorMessage.selecteddieukiengiam =
            "Điều kiện giảm phải lớn hơn 0.";
        }

        return Object.keys($scope.errorMessage).length === 0;
      };

      $scope.UpdateVoucher = function () {
        if (!$scope.validateInputs()) {
          return; // Ngừng nếu có lỗi
        }

        const voucherData = {
          mavoucher: $scope.selectedmaVC,
          tenvoucher: $scope.selectedtenVC,
          ngaybatdau: $scope.formatDateToYYYYMMDD($scope.selectedNgayBatDau),
          ngayketthuc: $scope.formatDateToYYYYMMDD($scope.selectedNgayKetThuc),
          hinhthucgiam: $scope.selectedHinhThuc,
          giatrigiam: $scope.selectedSoTienGiam,
          dieukientoithieuhoadon: $scope.selecteddieukiengiam,
          soluongma: $scope.selectedSoluongma,
          ghichu: $scope.selectedMoTa,
        };

        $http
          .put(
            "http://localhost:8080/api/admin/quan-ly-voucher/updtae-voucher",
            voucherData,
            {
              params: { id: idVCUpdate },
              ...config,
            }
          )
          .then(function (response) {
            Swal.fire({
              title: "Thành công",
              text: "Cập nhật voucher thành công.",
              icon: "success",
              confirmButtonText: "OK",
            });
            $route.reload();
            // Thực hiện hành động khác nếu cần
          })
          .catch(function (error) {
            Swal.fire({
              title: "Lỗi",
              text: "Có lỗi xảy ra khi cập nhật voucher.",
              icon: "error",
              confirmButtonText: "OK",
            });
            console.error("Lỗi khi cập nhật voucher:", error);
          });
      };

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
    }
  }
);
