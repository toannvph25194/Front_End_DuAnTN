app.controller("danhmucController", function ($scope, $http, $route, $window, $routeParams) {
  var role = $window.localStorage.getItem("role");
  var iddanhmuc = $routeParams.id;

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

  // Check role and set isAdmin variable
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
        $scope.LoadDanhMuc();
      }
    };

    // Hàm xử lý next trang
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.LoadDanhMuc();
      }
    };

    // Get total pages
    $scope.getTotalPages = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm xử lý load danh mục
    $scope.LoadDanhMuc = function () {
      $http.get(`http://localhost:8080/api/admin/danhmuc/hien-thi?page=${$scope.currentPage - 1}&size=${$scope.itemsPerPage}`, config)
        .then((resp) => {
          $scope.DMPhanTrang = resp.data.content;
          console.log("Load danh mục :", $scope.DMPhanTrang);
          // Total items and pages
          $scope.totalItems = resp.data.totalElements;
          $scope.totalPages = $scope.getTotalPages();
          $scope.showNextButton = $scope.DMPhanTrang.length >= $scope.pageSize;
        })
        .catch((error) => {
          console.log("Lỗi load danh mục !", error);
        });
    };
    $scope.LoadDanhMuc();

    // Làm mới các ô nhập
    $scope.LamMoi = function () {
      $scope.tendanhmuc = "";
      $scope.mota = "";
      $scope.trangthai = "";
      $scope.tenvalid = "";
      $scope.trangthaivalid = "";
    }

    // Hàm xử lý thêm mới danh mục
    $scope.AddDanhMuc = function () {
      // Valide các ô nhập
      if (!$scope.tendanhmuc) {
        $scope.tenvalid = "Vui lòng nhập tên danh mục";
      } else {
        $scope.tenvalid = "";
      }
      if (!$scope.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.tendanhmuc || !$scope.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn thêm danh mục không ?",
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
            var url = "http://localhost:8080/api/admin/danhmuc/add-danhmuc";
            var data = {
              tendanhmuc: $scope.tendanhmuc,
              mota: $scope.mota,
              trangthai: $scope.trangthai,
            };

            $http.post(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Thêm danh mục thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadDanhMuc();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi thêm danh mục !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    }

    // Hàm xử lý finby danh mục theo id
    $scope.FindByIdDanhMuc = function () {
      $http.get('http://localhost:8080/api/admin/danhmuc/find-by?id=' + iddanhmuc, config)
        .then((resp) => {
          $scope.detailDM = resp.data;
          console.log("FindBy danh mục :", $scope.detailDM);
        })
        .catch((error) => {
          console.log("Lỗi finby danh mục !", error);
        });
    };
    if (iddanhmuc != null) {
      $scope.FindByIdDanhMuc();
    }

    // Hàm xử lý cập nhật danh mục
    $scope.UpdateDanhMuc = function () {
      // Valide ô nhập
      if (!$scope.detailDM.tendanhmuc) {
        $scope.tenvalid = "Vui lòng nhập tên danh mục";
      } else {
        $scope.tenvalid = "";
      }

      if (!$scope.detailDM.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.detailDM.tendanhmuc || !$scope.detailDM.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn cập nhật danh mục không ?",
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
            var url = "http://localhost:8080/api/admin/danhmuc/update-danhmuc";
            var data = {
              id: iddanhmuc,
              tendanhmuc: $scope.detailDM.tendanhmuc,
              mota: $scope.detailDM.mota,
              trangthai: $scope.detailDM.trangthai,
            };

            $http.put(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Cập nhật danh mục thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadDanhMuc();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi cập nhật danh mục !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    };

    // Hàm xử lý cập nhật trạng thái danh mục
    $scope.UpdateTrangThai = function (danhmuc) {
      var trangthai = danhmuc.trangthai == 1 ? 2 : 1;
      if (token != null) {
        var url = "http://localhost:8080/api/admin/danhmuc/update-trang-thai?id=" + danhmuc.id + '&trangthai=' + trangthai;
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
              $scope.LoadDanhMuc();
            });
          })
          .catch((error) => {
            console.log("Lỗi cập nhật trạng thái danh mục !", error);
          });
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    }
  }
});
