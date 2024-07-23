app.controller("MauSacController", function ($scope, $http, $route, $window, $routeParams) {
  var role = $window.localStorage.getItem("role");
  var idmausac = $routeParams.id;
  console.log("Idms :", idmausac);


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
        $scope.LoadMauSac();
      }
    };

    // Hàm xử lý next trang
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.LoadMauSac();
      }
    };

    // Get total pages
    $scope.getTotalPages = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm xử lý load màu sắc
    $scope.LoadMauSac = function () {
      $http.get(`http://localhost:8080/api/admin/mausac/hien-thi?page=${$scope.currentPage - 1}&size=${$scope.itemsPerPage}`, config)
        .then((resp) => {
          $scope.MSPhanTrang = resp.data.content;
          console.log("Load màu sắc :", $scope.MSPhanTrang);
          // Total items and pages
          $scope.totalItems = resp.data.totalElements;
          $scope.totalPages = $scope.getTotalPages();
          $scope.showNextButton = $scope.MSPhanTrang.length >= $scope.pageSize;
        })
        .catch((error) => {
          console.log("Lỗi load màu sắc !", error);
        });
    };
    $scope.LoadMauSac();

    // Làm mới các ô nhập
    $scope.LamMoi = function () {
      $scope.tenmausac = "";
      $scope.mota = "";
      $scope.trangthai = "";
      $scope.tenvalid = "";
      $scope.trangthaivalid = "";
    }

    // Hàm xử lý thêm mới màu sắc
    $scope.AddMauSac = function () {
      // Valide các ô nhập
      if (!$scope.tenmausac) {
        $scope.tenvalid = "Vui lòng nhập tên màu sắc";
      } else {
        $scope.tenvalid = "";
      }
      if (!$scope.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.tenmausac || !$scope.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn thêm màu sắc không ?",
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
            var url = "http://localhost:8080/api/admin/mausac/add-mausac";
            var data = {
              tenmausac: $scope.tenmausac,
              mota: $scope.mota,
              trangthai: $scope.trangthai,
            };

            $http.post(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Thêm màu sắc thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadMauSac();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi thêm màu sắc !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    }

    // Hàm xử lý finby màu sắc theo id
    $scope.FindByIdMauSac = function () {
      $http.get('http://localhost:8080/api/admin/mausac/find-by?id=' + idmausac, config)
        .then((resp) => {
          $scope.detailMS = resp.data;
          console.log("FindBy màu sắc :", $scope.detailMS);
        })
        .catch((error) => {
          console.log("Lỗi finby màu sắc !", error);
        });
    };
    if (idmausac != null) {
      $scope.FindByIdMauSac();
    }

    // Hàm xử lý cập nhật màu sắc
    $scope.UpdateMauSac = function () {
      // Valide ô nhập
      if (!$scope.detailMS.tenmausac) {
        $scope.tenvalid = "Vui lòng nhập tên màu sắc";
      } else {
        $scope.tenvalid = "";
      }

      if (!$scope.detailMS.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.detailMS.tenmausac || !$scope.detailMS.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn cập nhật màu sắc không ?",
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
            var url = "http://localhost:8080/api/admin/mausac/update-mausac";
            var data = {
              id: idmausac,
              tenmausac: $scope.detailMS.tenmausac,
              mota: $scope.detailMS.mota,
              trangthai: $scope.detailMS.trangthai,
            };

            $http.put(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Cập nhật màu sắc thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadMauSac();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi cập nhật màu sắc !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    };

    // Hàm xử lý cập nhật trạng thái màu sắc
    $scope.UpdateTrangThai = function (mausac) {
      var trangthai = mausac.trangthai == 1 ? 2 : 1;
      if (token != null) {
        var url = "http://localhost:8080/api/admin/mausac/update-trang-thai?id=" + mausac.id + '&trangthai=' + trangthai;
        $http.put(url,{},config)
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
              $scope.LoadMauSac();
            });
          })
          .catch((error) => {
            console.log("Lỗi cập nhật trạng thái màu sắc !", error);
          });
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    }
  }
});
