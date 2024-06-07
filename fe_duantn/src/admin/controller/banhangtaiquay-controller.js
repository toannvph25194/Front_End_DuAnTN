app.service("BanHangTaiQuayService", function ($http) {
  var token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("Không tìm thấy token. Hãy đăng nhập trước.");
    return Promise.reject("Unauthorized");
  }

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
});

app.controller(
  "BanHangTaiQuayController",
  function ($scope, BanHangTaiQuayService, $window) {
    var role = $window.localStorage.getItem("role");

    if (role == null) {
      Swal.fire({
        title: "Bạn cần phải đăng nhập !",
        text: "Vui lòng đăng nhập để sử dụng chức năng !",
        icon: "warning",
      });
      $window.location.href =
        "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
    }

    $scope.isAdmin = false;

    function getRole() {
      if (role === "ADMIN" || role === "NHANVIEN") {
        $scope.isAdmin = true;
      }
    }

    getRole();

    $scope.toggleShippingInfo = function () {
      const shippingForm = document.getElementById("shippingForm");
      const shippingInfo = document.getElementById("shippingInfo");

      if ($scope.showShippingInfo) {
        shippingForm.style.display = "block";
        shippingInfo.style.display = "table-row";
      } else {
        shippingForm.style.display = "none";
        shippingInfo.style.display = "none";
      }
    };
    // Mở modal
    $scope.openModal = function () {
      var modal = document.getElementById("myModal");
      modal.style.display = "block";
    };
    $scope.openModal01 = function () {
      var modal = document.getElementById("myModal01");
      modal.style.display = "block";
    };
    $scope.openModal02 = function () {
      var modal = document.getElementById("myModal02");
      modal.style.display = "block";
    };
    $scope.openModal03 = function () {
      var modal = document.getElementById("myModal03");
      modal.style.display = "block";
    };

    // Đóng modal
    $scope.closeModal = function () {
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
    };
    $scope.closeModal01 = function () {
      var modal = document.getElementById("myModal01");
      modal.style.display = "none";
    };
    $scope.closeModal02 = function () {
      var modal = document.getElementById("myModal02");
      modal.style.display = "none";
    };
    $scope.closeModal03 = function () {
      var modal = document.getElementById("myModal03");
      modal.style.display = "none";
    };
  }
);
