app.controller("ChatLieuController", function ($scope, $http, $route, $window, $routeParams) {
  var role = $window.localStorage.getItem("role");
  var idchatlieu = $routeParams.id;
  console.log("IdCL :", idchatlieu);

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
    $scope.pageSize = 9;
    $scope.MSPhanTrang = [];
    $scope.totalItems = 0;
    $scope.totalPages = 0;
    $scope.showNextButton = false;

    // Hàm xử lý previou trang
    $scope.previousPage = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.LoadChatLieu();
      }
    };

    // Hàm xử lý next trang
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.LoadChatLieu();
      }
    };

    // Get total pages
    $scope.getTotalPages = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm xử lý load chất liệu
    $scope.LoadChatLieu = function () {
      $http.get(`http://localhost:8080/api/admin/chatlieu/hien-thi?page=${$scope.currentPage - 1}&size=${$scope.itemsPerPage}`, config)
        .then((resp) => {
          $scope.CLPhanTrang = resp.data.content;
          console.log("Load chất liệu :", $scope.CLPhanTrang);

          // Total items and pages
          $scope.totalItems = resp.data.totalElements;
          $scope.totalPages = $scope.getTotalPages();
          $scope.showNextButton = $scope.CLPhanTrang.length >= $scope.pageSize;
        })
        .catch((error) => {
          console.log("Lỗi load chất liệu !", error);
        });
    };
    $scope.LoadChatLieu();

    // Làm mới các ô nhập
    $scope.LamMoi = function () {
      $scope.tenchatlieu = "";
      $scope.mota = "";
      $scope.trangthai = "";
      $scope.tenvalid = "";
      $scope.trangthaivalid = "";
    }

    // Hàm xử lý thêm mới chất liệu
    $scope.AddChatlieu = function () {
      // Valide các ô nhập
      if (!$scope.tenchatlieu) {
        $scope.tenvalid = "Vui lòng nhập tên chất liệu";
      } else {
        $scope.tenvalid = "";
      }
      if (!$scope.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.tenchatlieu || !$scope.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn thêm chất liệu không ?",
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
            var url = "http://localhost:8080/api/admin/chatlieu/add-chatlieu";
            var data = {
              tenchatlieu: $scope.tenchatlieu,
              mota: $scope.mota,
              trangthai: $scope.trangthai,
            };

            $http.post(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Thêm chất liệu thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadChatLieu();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi thêm chất liệu !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    }

    // Hàm xử lý finby chất liệu theo id
    $scope.FindByIdChatLieu = function () {
      $http.get('http://localhost:8080/api/admin/chatlieu/find-by?id=' + idchatlieu, config)
        .then((resp) => {
          $scope.detailCL = resp.data;
          console.log("FindBy chất liệu :", $scope.detailCL);
        })
        .catch((error) => {
          console.log("Lỗi finby chất liệu !", error);
        });
    };
    if (idchatlieu != null) {
      $scope.FindByIdChatLieu();
    }

    // Hàm xử lý cập nhật chất liệu
    $scope.UpdateChaLieu = function () {
      // Valide ô nhập
      if (!$scope.detailCL.tenchatlieu) {
        $scope.tenvalid = "Vui lòng nhập tên chất liệu";
      } else {
        $scope.tenvalid = "";
      }

      if (!$scope.detailCL.trangthai) {
        $scope.trangthaivalid = "Vui lòng chọn trạng thái";
      } else {
        $scope.trangthaivalid = "";
      }

      if (!$scope.detailCL.tenchatlieu || !$scope.detailCL.trangthai) {
        return;
      }

      Swal.fire({
        title: "Xác Nhận",
        text: "Bạn có muốn cập nhật chất liệu không ?",
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
            var url = "http://localhost:8080/api/admin/chatlieu/update-chatlieu";
            var data = {
              id: idchatlieu,
              tenchatlieu: $scope.detailCL.tenchatlieu,
              mota: $scope.detailCL.mota,
              trangthai: $scope.detailCL.trangthai,
            };

            $http.put(url, data, config)
              .then((resp) => {
                Swal.fire({
                  title: "Thành Công",
                  text: "Cập nhật chất liệu thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $scope.LoadChatLieu();
                  $scope.LamMoi();
                });
              })
              .catch((error) => {
                console.log("Lỗi cập nhật chất liệu !", error);
              });
          }
        } else {
          console.log("Bạn không có quyền truy cập !");
        }
      });
    };

    $scope.UpdateTrangThai = function (chatlieu) {
      var trangthai = chatlieu.trangthai == 1 ? 2 : 1;
      if (token != null) {
        var url = "http://localhost:8080/api/admin/chatlieu/update-trang-thai?id=" + chatlieu.id + '&trangthai=' + trangthai;
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
              $scope.LoadChatLieu();
            });
          })
          .catch((error) => {
            console.log("Lỗi cập nhật trạng thái chất liệu !", error);
          });
      } else {
        console.log("Bạn không có quyền truy cập !");
      }
    }
  }
});
