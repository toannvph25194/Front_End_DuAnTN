app.controller("danhmucController", function ($scope, $http, $route, $window) {
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
            `http://localhost:8080/api/admin-danhmuc/hienthitatcadanhmuc?page=${
              $scope.currentPage - 1
            }&size=${$scope.itemsPerPage}`,
            config
          )
          .then((resp) => {
            $scope.DMPhanTrang = resp.data.content;
            console.log("Load DM :", $scope.DMPhanTrang);
  
            // Total items and pages
            $scope.totalItems = resp.data.totalElements;
            $scope.totalPages = $scope.getTotalPages();
            $scope.showNextButton = $scope.DMPhanTrang.length >= $scope.pageSize;
          })
          .catch((error) => {
            console.log("Lỗi Load DM", error);
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
      $scope.adddanhmuc = function () {
        // Clear previous error messages
        $scope.errorMessage = {};
  
        // Validate form fields
        let hasError = false;
        if (!$scope.selectedtendanhmuc) {
          $scope.errorMessage.ten = "Vui lòng không bỏ trống";
          hasError = true;
        }
        if (!$scope.selectedtrangthai) {
          $scope.errorMessage.trangthai = "Vui lòng không bỏ trống";
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
  
        var url = "http://localhost:8080/api/admin-danhmuc/add-danhmuc";
        var data = {
          tendanhmuc: $scope.selectedtendanhmuc,
          mota: $scope.selectedmota,
          trangthai: $scope.selectedtrangthai,
        };
  
        $http
          .post(url, data, config)
          .then(function (response) {
            if (response.status === 200) {
              Swal.fire({
                title: "Thành Công",
                text: "Thêm danh mục thành công",
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
        if (!token) {
          console.error("Token không được tìm thấy trong local storage.");
          return;
        }
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
  
        var newStatus = mau.trangthai === 1 ? 2 : 1;
        var url = `http://localhost:8080/api/admin-danhmuc/ctt-danhmuc/${mau.id}?trangthai=${newStatus}`;
  
        $http
          .put(url, null, config)
          .then(function (response) {
            console.log("HTTP response:", response);
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
          })
          .catch(function (error) {
            console.error("Lỗi kết nối:", error);
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
          });
      };
      $scope.redirectToProductDetails = function (productId) {
        // Lưu id vào localStorage hoặc sử dụng biến trong controller
        localStorage.setItem("IDDanhMucUpdate", productId);
      };
      $scope.getTTById = function () {
        // Retrieve the ID from local storage
        var id = localStorage.getItem("IDDanhMucUpdate");
  
        if (!id) {
          console.error(
            "ID thương hiệu không được tìm thấy trong local storage."
          );
          return;
        }
  
        var token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Token không được tìm thấy trong local storage.");
          return;
        }
  
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
  
        // Call the API to get Thuong Hieu by ID
        $http
          .get(
            `http://localhost:8080/api/admin-danhmuc/hienthitatcadanhmuctheoid?id=${id}`,
            config
          )
          .then(function (response) {
            if (response.status === 200) {
              $scope.selectedDM = response.data;
              console.log("Selected DM:", $scope.selectedDM);
            } else {
              console.error(
                "Không thể tải thương hiệu theo ID. Status:",
                response.status
              );
            }
          })
          .catch(function (error) {
            console.error("Lỗi kết nối:", error);
          });
      };
  
      $scope.getTTById();
  
      $scope.updateDM = function () {
        var id = localStorage.getItem("IDDanhMucUpdate");
      
        if (!id) {
          console.error("ID chất liệu không được tìm thấy trong local storage.");
          return;
        }
      
        var token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Token không được tìm thấy trong local storage.");
          return;
        }
      
        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
      
        $scope.errorMessage = {};
      
        if (!$scope.selectedDM || !$scope.selectedDM.tendanhmuc) {
          $scope.errorMessage.ten = "Vui lòng không bỏ trống ";
          return;
        }
      
        var url = `http://localhost:8080/api/admin-danhmuc/update-danhmuc/${id}`;
        var data = {
          tendanhmuc: $scope.selectedDM.tendanhmuc,
          trangthai: $scope.selectedDM.trangthai,
          mota: $scope.selectedDM.mota,
        };
      
        $http
          .put(url, data, config)
          .then(function (response) {
         
              console.log("Cập nhật chất liệu thành công");
              Swal.fire({
                title: "Thành Công",
                text: "Cập nhật chất liệu thành công",
                icon: "success",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                $window.location.reload();
              });
            
          })
          .catch(function (error) {
            Swal.fire({
              title: "Thành Công",
              text: "Cập nhật chất liệu thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
                $window.location.reload();
            });
          });
      };
      
    }
  });
  