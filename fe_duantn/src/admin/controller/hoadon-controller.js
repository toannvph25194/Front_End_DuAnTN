app.controller(
  "QuanLyHoaDonController",
  function ($scope, $http, $route, $window) {
    var role = $window.localStorage.getItem("role");

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
     // Initialize variables for pagination and search
$scope.currentPage = 1;
$scope.itemsPerPage = 9;
$scope.pageNumber = 0;
$scope.pageSize = 9;
$scope.HoaDonLoadPhanTrang = [];
$scope.activeFilter = null; // Track the active filter
$scope.filterParams = {}; // Store parameters for the active filter

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

// Load data based on active filter
$scope.loadData = function () {
  switch ($scope.activeFilter) {
    case 'trangthai':
      $scope.locTrangThai($scope.filterParams.trangthai, true);
      break;
    case 'mahoadon':
      $scope.locMaHoaDon(true);
      break;
    case 'loaihoadon':
      $scope.locLoaiHoaDon(true);
      break;
    default:
      $scope.ShowHoaDon();
  }
};

// Fetch total counts for different invoice statuses
function fetchTotalCount(apiEndpoint, scopeVariable) {
  var token = localStorage.getItem("accessToken");
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  $http
    .get(apiEndpoint, config)
    .then(function (response) {
      $scope[scopeVariable] = response.data; // Assign response data to scope variable
    })
    .catch(function (error) {
      console.log("Error fetching data:", error);
      $scope[scopeVariable] = 0; // Default to 0 in case of error
    });
}

// Call functions to fetch total counts
fetchTotalCount("http://localhost:8080/api/admin/hoadon/tongSoHoaDonChoXacNhan", "TongSoHoaDonChoXacNhan");
fetchTotalCount("http://localhost:8080/api/admin/hoadon/tongSoHoaDonXacNhan", "TongSoHoaDonXacNhan");
fetchTotalCount("http://localhost:8080/api/admin/hoadon/tongSoHoaDonChoGiao", "TongSoHoaDonChoGiao");
fetchTotalCount("http://localhost:8080/api/admin/hoadon/tongSoHoaDonDangGiao", "TongSoHoaDonDangGiao");
fetchTotalCount("http://localhost:8080/api/admin/hoadon/tongSoHoaDonHoanThanh", "TongSoHoaDonHoanThanh");
fetchTotalCount("http://localhost:8080/api/admin/hoadon/tongSoHoaDonHuy", "TongSoHoaDonHuy");

// Load invoices with pagination
$scope.ShowHoaDon = function () {
  var token = localStorage.getItem("accessToken");
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  $http
    .get(`http://localhost:8080/api/admin/hoadon/hienthihoadon?page=${$scope.currentPage - 1}&size=${$scope.itemsPerPage}`, config)
    .then((resp) => {
      $scope.HoaDonLoadPhanTrang = resp.data.content;
      console.log("Load HĐ :", $scope.HoaDonLoadPhanTrang);

      // Total items and pages
      $scope.totalItems = resp.data.totalElements;
      $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
      $scope.showNextButton = $scope.HoaDonLoadPhanTrang.length >= $scope.pageSize;
    })
    .catch((error) => {
      console.log("Lỗi Load HĐ", error);
    });
};

// Watch for changes in currentPage to reload data
$scope.$watch("currentPage", function() {
  $scope.loadData();
});

// Filter invoices by status
$scope.locTrangThai = function (trangthaiValue, isPageChange = false) {
  var token = localStorage.getItem("accessToken");
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  var trangthai = trangthaiValue || ""; // Use passed value

  if (!isPageChange) {
    // Reset currentPage before making API call
    $scope.currentPage = 1;
  }

  if (!trangthai) {
    $scope.ShowHoaDon();
    console.log("Gọi Hàm LoadHĐ");
  } else {
    $scope.activeFilter = 'trangthai'; // Set active filter
    $scope.filterParams = { trangthai: trangthai }; // Store filter params

    $http
      .get(`http://localhost:8080/api/admin/hoadon/loc/trangthaihoadon?pageNumber=${$scope.currentPage - 1}&pageSize=${$scope.pageSize}&trangthai=${trangthai}`, config)
      .then(function (response) {
        $scope.HoaDonLoadPhanTrang = response.data.content;
        console.log("Lọc SP Theo Nhiều Tiêu Chí:", $scope.HoaDonLoadPhanTrang);

        $scope.totalItems = response.data.totalElements;
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        $scope.showNextButton = $scope.HoaDonLoadPhanTrang.length >= $scope.pageSize;
      })
      .catch(function (error) {
        console.log("Lỗi khi tìm kiếm sản phẩm", error);
      });
  }
};

// Filter invoices by invoice number
$scope.locMaHoaDon = function (isPageChange = false) {
  var token = localStorage.getItem("accessToken");
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  var mahoadon = $scope.mahoadonTK;

  if (!isPageChange) {
    // Reset currentPage before making API call
    $scope.currentPage = 1;
  }

  if (!mahoadon) {
    $scope.ShowHoaDon();
    console.log("Gọi Hàm LoadHĐ");
  } else {
    $scope.activeFilter = 'mahoadon'; // Set active filter
    $scope.filterParams = { mahoadon: mahoadon }; // Store filter params

    $http
      .get(`http://localhost:8080/api/admin/hoadon/loc/mahoadon?pageNumber=${$scope.currentPage - 1}&pageSize=${$scope.pageSize}&mahoadon=${mahoadon}`, config)
      .then(function (response) {
        $scope.HoaDonLoadPhanTrang = response.data.content;
        console.log("Lọc Hoa đơn theo ma :", $scope.HoaDonLoadPhanTrang);

        $scope.totalItems = response.data.totalElements;
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        $scope.showNextButton = $scope.HoaDonLoadPhanTrang.length >= $scope.pageSize;
      })
      .catch(function (error) {
        console.log("Lỗi khi tìm kiếm sản phẩm", error);
      });
  }
};

// Filter invoices by type
$scope.locLoaiHoaDon = function (isPageChange = false) {
  var token = localStorage.getItem("accessToken");
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  var loaihoadon = $scope.loaihoadon;

  if (!isPageChange) {
    // Reset currentPage before making API call
    $scope.currentPage = 1;
  }

  if (!loaihoadon) {
    $scope.ShowHoaDon();
    console.log("Gọi Hàm LoadHĐ");
  } else {
    $scope.activeFilter = 'loaihoadon'; // Set active filter
    $scope.filterParams = { loaihoadon: loaihoadon }; // Store filter params

    $http
      .get(`http://localhost:8080/api/admin/hoadon/loc/loaihoadon?pageNumber=${$scope.currentPage - 1}&pageSize=${$scope.pageSize}&loaihoadon=${loaihoadon}`, config)
      .then(function (response) {
        $scope.HoaDonLoadPhanTrang = response.data.content;
        console.log("Lọc Hoa đơn theo loai :", $scope.HoaDonLoadPhanTrang);

        $scope.totalItems = response.data.totalElements;
        $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        $scope.showNextButton = $scope.HoaDonLoadPhanTrang.length >= $scope.pageSize;
      })
      .catch(function (error) {
        console.log("Lỗi khi tìm kiếm sản phẩm", error);
      });
  }
};

// Redirect to invoice details
$scope.redirectToHoaDonDetails = function (hoaDonId) {
  localStorage.setItem("IDHoaDonUpdate", hoaDonId);
};

// Initialize selectedTab variable
$scope.selectedTab = 0;

// Initial load
$scope.ShowHoaDon();


      // Hàm chọn tab
      $scope.selectTab = function (tabIndex) {
        $scope.selectedTab = tabIndex;
      };

      // Hàm kiểm tra xem mục có phải là mục được chọn không
      $scope.isSelected = function (tabIndex) {
        return $scope.selectedTab === tabIndex;
      };
      $scope.getUpdateHoaDonUrl = function (trangthai) {
        switch (trangthai) {
          case 1:
            return "#/updatehoadonchoxacnhan";
          case 2:
            return "#/updatehoadondaxacnhan";
          case 3:
            return "#/updatehoadonchogiao";
          case 4:
            return "#/updatehoadondanggiao";
          case 5:
            return "#/updatehoadonhoanthanh";
          case 6:
            return "#/updatehoadonhuy";
          default:
            return "#/hoadon"; // Provide a default URL if needed
        }
      };
    }
  }
);
