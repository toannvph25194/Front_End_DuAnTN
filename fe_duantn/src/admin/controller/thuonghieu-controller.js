app.controller("ThuongHieuController", function ($scope, $http, $route, $window, $routeParams) {
  var role = $window.localStorage.getItem("role");
  var idthuonghieu = $routeParams.id;
  console.log("Idth :", idthuonghieu);

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
        $scope.LoadThuongHieu();
      }
    };

    // Hàm xử lý next trang
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.LoadThuongHieu();
      }
    };

    // Get total pages
    $scope.getTotalPages = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm xử lý load thương hiệu
    $scope.LoadThuongHieu = function () {
      $http.get(`http://localhost:8080/api/admin/thuonghieu/hien-thi?page=${$scope.currentPage - 1}&size=${$scope.itemsPerPage}`, config)
        .then((resp) => {
          $scope.THPhanTrang = resp.data.content;
          console.log("Load thương hiệu :", $scope.THPhanTrang);
          // Total items and pages
          $scope.totalItems = resp.data.totalElements;
          $scope.totalPages = $scope.getTotalPages();
          $scope.showNextButton = $scope.THPhanTrang.length >= $scope.pageSize;
        })
        .catch((error) => {
          console.log("Lỗi load thương hiệu !", error);
        });
    };
    $scope.LoadThuongHieu();

    // Làm mới các ô nhập
    $scope.LamMoi = function () {
      $scope.tenthuonghieu = "";
      $scope.mota = "";
      $scope.trangthai = "";
      $scope.tenvalid = "";
      $scope.trangthaivalid = "";
    }

    // Hàm xử lý thêm mới thương hiệu
    $scope.AddThuongHieu = function () {
      // Valide các ô nhập
      if (!$scope.tenthuonghieu) {
        $scope.tenvalid = "Vui lòng nhập tên thương hiệu";
      } else {
        $scope.tenvalid = "";
      }
      if (!$scope.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.tenthuonghieu || !$scope.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn thêm thương hiệu không ?",
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
            var url = "http://localhost:8080/api/admin/thuonghieu/add-thuonghieu";
            var data = {
              tenthuonghieu: $scope.tenthuonghieu,
              mota: $scope.mota,
              trangthai: $scope.trangthai,
            };

            $http.post(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Thêm thương hiệu thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadThuongHieu();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi thêm thương hiệu!", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    }

    // Hàm xử lý finby thương hiệu theo id
    $scope.FindByIdThuongHieu = function () {
      $http.get('http://localhost:8080/api/admin/thuonghieu/find-by?id=' + idthuonghieu, config)
        .then((resp) => {
          $scope.detailTH = resp.data;
          console.log("FindBy thương hiệu :", $scope.detailCL);
        })
        .catch((error) => {
          console.log("Lỗi finby thương hiệu !", error);
        });
    };
    if (idthuonghieu != null) {
      $scope.FindByIdThuongHieu();
    }

    // Hàm xử lý cập nhật thương hiệu
    $scope.UpdateThuongHieu = function () {
      // Valide ô nhập
      if (!$scope.detailTH.tenthuonghieu) {
        $scope.tenvalid = "Vui lòng nhập tên thương hiệu";
      } else {
        $scope.tenvalid = "";
      }

      if (!$scope.detailTH.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.detailTH.tenthuonghieu || !$scope.detailTH.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn cập nhật thương hiệu không ?",
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
            var url = "http://localhost:8080/api/admin/thuonghieu/update-thuonghieu";
            var data = {
              id: idthuonghieu,
              tenthuonghieu: $scope.detailTH.tenthuonghieu,
              mota: $scope.detailTH.mota,
              trangthai: $scope.detailTH.trangthai,
            };

            $http.put(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Cập nhật thương hiệu thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadThuongHieu();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi cập nhật thương hiệu !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    };

    // Hàm xử lý cập nhật trạng thái thương hiệu
    $scope.UpdateTrangThai = function (thuonghieu) {
      var trangthai = thuonghieu.trangthai == 1 ? 2 : 1;
      if (token != null) {
        var url = "http://localhost:8080/api/admin/thuonghieu/update-trang-thai?id=" + thuonghieu.id + '&trangthai=' + trangthai;
        $http.put(url, {}, config)
          .then((resp) => {
            Swal.fire({
              title: "Thành Công",
              text: "Cập nhật trạng thái thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              $scope.LoadThuongHieu();
            });
          })
          .catch((error) => {
            console.log("Lỗi cập nhật trạng thái thương hiệu !", error);
          });
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    }
  }
});
