app.controller("XuatXuController", function ($scope, $http, $route, $window, $routeParams) {
  var role = $window.localStorage.getItem("role");
  var idxuatxu = $routeParams.id;
  console.log("IdXX :", idxuatxu);

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
        $scope.LoadXuatXu();
      }
    };

    // Hàm xử lý next trang
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.LoadXuatXu();
      }
    };

    // Get total pages
    $scope.getTotalPages = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm xử lý load xuất xứ
    $scope.LoadXuatXu = function () {
      $http.get(`http://localhost:8080/api/admin/xuatxu/hien-thi?page=${$scope.currentPage - 1}&size=${$scope.itemsPerPage}`, config)
        .then((resp) => {
          $scope.XXPhanTrang = resp.data.content;
          console.log("Load xuất xứ :", $scope.XXPhanTrang);
          // Total items and pages
          $scope.totalItems = resp.data.totalElements;
          $scope.totalPages = $scope.getTotalPages();
          $scope.showNextButton = $scope.XXPhanTrang.length >= $scope.pageSize;
        })
        .catch((error) => {
          console.log("Lỗi load xuất xứ !", error);
        });
    };
    $scope.LoadXuatXu();

    // Làm mới các ô nhập
    $scope.LamMoi = function () {
      $scope.tenxuatxu = "";
      $scope.mota = "";
      $scope.trangthai = "";
      $scope.tenvalid = "";
      $scope.trangthaivalid = "";
    }

    // Hàm xử lý thêm mới xuất xứ
    $scope.AddXuatXu = function () {
      // Valide các ô nhập
      if (!$scope.tenxuatxu) {
        $scope.tenvalid = "Vui lòng nhập tên xuất xứ";
      } else {
        $scope.tenvalid = "";
      }
      if (!$scope.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.tenxuatxu || !$scope.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn thêm xuất xứ không ?",
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
            var url = "http://localhost:8080/api/admin/xuatxu/add-xuatxu";
            var data = {
              tenxuatxu: $scope.tenxuatxu,
              mota: $scope.mota,
              trangthai: $scope.trangthai,
            };

            $http.post(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Thêm xuất xứ thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadXuatXu();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi thêm xuất xứ !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    }

    // Hàm xử lý finby xuất xứ theo id
    $scope.FindByIdXuatXu = function () {
      $http.get('http://localhost:8080/api/admin/xuatxu/find-by?id=' + idxuatxu, config)
        .then((resp) => {
          $scope.detailXX = resp.data;
          console.log("FindBy xuất xứ :", $scope.detailXX);
        })
        .catch((error) => {
          console.log("Lỗi finby xuất xứ !", error);
        });
    };
    if (idxuatxu != null) {
      $scope.FindByIdXuatXu();
    }

    // Hàm xử lý cập nhật xuất xứ
    $scope.UpdateXuatXu = function () {
      // Valide ô nhập
      if (!$scope.detailXX.tenxuatxu) {
        $scope.tenvalid = "Vui lòng nhập tên xuất xứ";
      } else {
        $scope.tenvalid = "";
      }

      if (!$scope.detailXX.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.detailXX.tenxuatxu || !$scope.detailXX.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn cập nhật xuất xứ không ?",
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
            var url = "http://localhost:8080/api/admin/xuatxu/update-xuatxu";
            var data = {
              id: idxuatxu,
              tenxuatxu: $scope.detailXX.tenxuatxu,
              mota: $scope.detailXX.mota,
              trangthai: $scope.detailXX.trangthai,
            };

            $http.put(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Cập nhật xuất xứ thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadXuatXu();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi cập nhật xuất xứ !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    };

    // Hàm xử lý cập nhật trạng thái xuất xứ
    $scope.UpdateTrangThai = function (xuatxu) {
      var trangthai = xuatxu.trangthai == 1 ? 2 : 1;
      if (token != null) {
        var url = "http://localhost:8080/api/admin/xuatxu/update-trang-thai?id=" + xuatxu.id + '&trangthai=' + trangthai;
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
              $scope.LoadXuatXu();
            });
          })
          .catch((error) => {
            console.log("Lỗi cập nhật trạng thái xuất xứ !", error);
          });
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    }
  }
});
