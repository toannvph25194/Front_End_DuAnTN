app.controller("MauSacController", function ($scope, $http, $route, $window) {
  var role = $window.localStorage.getItem("role");

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

  if ($scope.isAdmin) {
    // Initialize variables for pagination and search
    $scope.currentPage = 1;
    $scope.itemsPerPage = 9;
    $scope.pageNumber = 0;
    $scope.pageSize = 9;
    $scope.MSPhanTrang = [];
    $scope.totalItems = 0;
    $scope.totalPages = 0;
    $scope.showNextButton = false;

    // Handle previous page event
    $scope.previousPage = function () {
      if ($scope.currentPage > 1) {
        $scope.currentPage--;
        $scope.loadData();
      }
    };

    // Handle next page event
    $scope.nextPage = function () {
      if ($scope.currentPage < $scope.totalPages) {
        $scope.currentPage++;
        $scope.loadData();
      }
    };

    // Get total pages
    $scope.getTotalPages = function () {
      return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Load data
    $scope.loadData = function () {
      var token = localStorage.getItem("accessToken");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .get(
          `http://localhost:8080/api/admin-mausac/hienthitatcamausac?page=${
            $scope.currentPage - 1
          }&size=${$scope.itemsPerPage}`,
          config
        )
        .then((resp) => {
          $scope.MSPhanTrang = resp.data.content;
          console.log("Load MS :", $scope.MSPhanTrang);

          // Total items and pages
          $scope.totalItems = resp.data.totalElements;
          $scope.totalPages = $scope.getTotalPages();
          $scope.showNextButton = $scope.MSPhanTrang.length >= $scope.pageSize;
        })
        .catch((error) => {
          console.log("Lỗi Load màu sắc", error);
        });
    };

    // Initial data load
    $scope.loadData();
    $scope.clearErrorMessages = function () {
      for (var key in $scope.errorMessage) {
        if ($scope.errorMessage.hasOwnProperty(key)) {
          $scope.errorMessage[key] = "";
        }
      }
    };
    // Function to add new Mau Sac
    $scope.addMauSac = function () {
      // Clear previous error messages
      $scope.errorMessage = {};

      // Validate form fields
      let hasError = false;
      if (!$scope.selectedtenMS) {
        $scope.errorMessage.tenms = "Vui lòng không bỏ trống";
        hasError = true;
      }
      if (!$scope.selectedtrangthaiMS) {
        $scope.errorMessage.trangthaiMS = "Vui lòng không bỏ trống";
        hasError = true;
      }

      // If there's any validation error, stop the function
      if (hasError) {
        return;
      }

      var token = localStorage.getItem("accessToken");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var url = "http://localhost:8080/api/admin-mausac/create-mausac";
      var data = {
        tenmausac: $scope.selectedtenMS,
        mota: $scope.selectedmotaMS,
        trangthai: $scope.selectedtrangthaiMS,
      };

      $http
        .post(url, data, config)
        .then(function (response) {
          if (response.status === 200) {
            Swal.fire({
              title: "Thành Công",
              text: "Thêm màu sắc thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Reload the page after the notification is completed
              $window.location.reload();
            });
          } else {
            console.log("Lỗi xảy ra trong quá trình thêm màu sắc.");
          }
        })
        .catch(function (error) {
          console.log("Lỗi kết nối:", error);
        });
    };
    $scope.changeStatus = function (mau) {
      var token = localStorage.getItem("accessToken");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var newStatus = mau.trangthai === 1 ? 2 : 1;
      var url = `http://localhost:8080/api/admin-mausac/ctt-mausac/${mau.id}?trangthai=${newStatus}`;

      $http
        .put(url, null, config)
        .then(function (response) {
          if (response.status === 200) {
            Swal.fire({
              title: "Thành Công",
              text: "Thay đổi trạng thái thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              // Update the local status after a successful response
              $window.location.reload();
            });
          } else {
            Swal.fire({
              title: "Lỗi",
              text: "Không thể thay đổi trạng thái",
              icon: "error",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch(function (error) {
          console.log("Lỗi kết nối:", error);
          Swal.fire({
            title: "Lỗi",
            text: "Không thể thay đổi trạng thái",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    };
    $scope.redirectToProductDetails = function (productId) {
      // Lưu id vào localStorage hoặc sử dụng biến trong controller
      localStorage.setItem("IDMauSacUpdate", productId);
    };
    $scope.getMauSacById = function () {
      // Retrieve the ID from local storage
      var id = localStorage.getItem("IDMauSacUpdate");

      if (!id) {
        console.error("ID màu sắc không được tìm thấy trong local storage.");
        return;
      }

      var token = localStorage.getItem("accessToken");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      // Call the API to get Mau Sac by ID
      $http
        .get(
          `http://localhost:8080/api/admin-mausac/hienthitatcamausactheid?id=${id}`,
          config
        )
        .then(function (response) {
          if (response.status === 200) {
            $scope.selectedMauSac = response.data;
            console.log("Selected Mau Sac:", $scope.selectedMauSac);
          } else {
            console.error(
              "Không thể tải màu sắc theo ID. Status:",
              response.status
            );
          }
        })
        .catch(function (error) {
          console.error("Lỗi kết nối:", error);
        });
    };

    // Initial call to load data

    // Function to update Mau Sac
    $scope.updateMauSac = function () {
      var id = localStorage.getItem("IDMauSacUpdate");

      if (!id) {
        console.error("ID màu sắc không được tìm thấy trong local storage.");
        return;
      }

      var token = localStorage.getItem("accessToken");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $scope.errorMessage = {};

      // Validate form fields
      let hasError = false;
      if (!$scope.selectedMauSac.tenmausac) {
        $scope.errorMessage.tenms = "Vui lòng không bỏ trống";
       return;
      }
      var url = `http://localhost:8080/api/admin-mausac/update-mausac?id=${id}`;
      var data = {
        tenmausac: $scope.selectedMauSac.tenmausac,
        trangthai: $scope.selectedMauSac.trangthai,
        mota: $scope.selectedMauSac.mota,
      };

      $http
        .put(url, data, config)
        .then(function (response) {
          if (response.status === 200) {
            console.log("Cập nhật màu sắc thành công");
            Swal.fire({
                title: "Thành Công",
                text: "Update màu sắc thành công",
                icon: "success",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                // Update the local status after a successful response
                $window.location.reload();
              });
            // Optionally reload or redirect
          } else {
            console.error("Lỗi cập nhật màu sắc. Status:", response.status);
          }
        })
        .catch(function (error) {
          console.error("Lỗi kết nối:", error);
        });
    };
    $scope.getMauSacById();
  }
});
