app.controller("thongKeController", function ($scope, $http, $window) {
  console.log("thongKeController");
 
  var token = $window.localStorage.getItem("accessToken");

  // if(token == null ){
  //   Swal.fire({
  //     title: "Xác nhận đặt hàng?",
  //     text: "Bạn có chắc chắn muốn đặt đơn hàng?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     cancelButtonColor: "#3085d6",
  //     confirmButtonText: "Đặt hàng",
  //     cancelButtonText: "Cancel",
  // })
  // }

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };



  $scope.tongtienhomnay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/tongtienhomnay", config)
    .then(function (response) {
      $scope.tongtienhomnay = response.data;
    });

  $scope.tongtientuannay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/tongtientuannay", config)
    .then(function (response) {
      $scope.tongtientuannay = response.data;
    });

  $scope.tongtienthangnay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/tongtiendonthangnay", config)
    .then(function (response) {
      $scope.tongtienthangnay = response.data;
    });

  $scope.tongtiennamnay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/tongtiennamnay", config)
    .then(function (response) {
      $scope.tongtiennamnay = response.data;
    });

  $scope.tongSoDonHnay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonhomnay", config)
    .then(function (response) {
      $scope.tongSoDonHnay = response.data;
    });

  $scope.tongSoDonTuanNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodontuannay", config)
    .then(function (response) {
      $scope.tongSoDonTuanNay = response.data;
    });

  $scope.tongSoDonThangNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonthangnay", config)
    .then(function (response) {
      $scope.tongSoDonThangNay = response.data;
    });

  $scope.tongSoDonNamNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonnamnay", config)
    .then(function (response) {
      $scope.tongSoDonNamNay = response.data;
    });

  $scope.soDonHuyHnay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonhuyhomnay", config)
    .then(function (response) {
      $scope.soDonHuyHnay = response.data;
    });

  $scope.soDonHuyTuanNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonhuytuannay", config)
    .then(function (response) {
      $scope.soDonHuyTuanNay = response.data;
    });

  $scope.soDonHuyThangNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonhuythangnay", config)
    .then(function (response) {
      $scope.soDonHuyThangNay = response.data;
    });

  $scope.soDonHuyNamNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sodonhuynamnay", config)
    .then(function (response) {
      $scope.soDonHuyNamNay = response.data;
    });

  $scope.soSanPhamBanRaHomNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sanphambanhomnay", config)
    .then(function (response) {
      $scope.soSanPhamBanRaHomNay = response.data;
    });

  $scope.soSanPhamBanRaTuanNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sanphambantuannay", config)
    .then(function (response) {
      $scope.soSanPhamBanRaTuanNay = response.data;
    });

  $scope.soSanPhamBanRaThangNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sanphambanthangnay", config)
    .then(function (response) {
      $scope.soSanPhamBanRaThangNay = response.data;
    });
  
  
  $scope.soSanPhamBanRaNamNay = 0;
  $http
    .get("http://localhost:8080/api/admin/thong-ke/sanphambannamnay", config)
    .then(function (response) {
      $scope.soSanPhamBanRaNamNay = response.data;
    });

    // Gọi hàm để lấy danh sách sản phẩm bán chạy khi controller khởi tạo
$scope.init = function() {
  $scope.getListSanPhamBanChay();
};

$scope.init = function() {
  $scope.getListSanPhamBanChay(); // Gọi hàm getListSanPhamBanChay để lấy dữ liệu
};

$scope.getListSanPhamBanChay = function() {
  $http.get("http://localhost:8080/api/admin/thong-ke/banchay", config)
      .then(function(response) {
          // Gán dữ liệu trả về vào $scope.listSanPhamBanChay
          $scope.listSanPhamBanChay = response.data;
console.log(response.data)
          // Sắp xếp danh sách theo số lượng bán giảm dần
         

          // Chỉ lấy 10 sản phẩm đầu tiên
          $scope.listSanPhamBanChay = $scope.listSanPhamBanChay.slice(0, 10);
      })
      .catch(function(error) {
          // Xử lý lỗi nếu có
          console.error("Error fetching data:", error);
      });
};

// Gọi hàm init() khi controller được khởi tạo
$scope.init(); 


  var currentDate = new Date();
  var firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  //Gán giá trị mặc định cho ngày bắt đầu và ngày kết thúc
  $scope.startDate = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth(),
    1
  );
   $scope.endDate = new Date(Date.parse(currentDate.toISOString().slice(0, 10)));

  var ctxBar = document.getElementById("myBarChart").getContext("2d");

  // Khởi tạo biểu đồ
 var ctxBar = document.getElementById("myBarChart").getContext("2d");
  var myBarChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: [], // Sẽ cập nhật labels sau
      datasets: [
        {
          label: "Doanh số",
          data: [], // Sẽ cập nhật data sau
          backgroundColor: "#36a2eb",
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  $scope.doanhThu = [];

  // Hàm xử lý dữ liệu và cập nhật biểu đồ cột
  function processDataAndDisplayChart(data) {
    var labels = [];
    var salesData = [];

    // Xử lý dữ liệu trả về từ API
    data.forEach(function (item) {
      labels.push(item.ngay); // Thêm ngày vào mảng labels
      salesData.push(item.doanhThu); // Thêm doanh số vào mảng salesData
    });

    // Cập nhật biểu đồ cột
    myBarChart.data.labels = labels;
    myBarChart.data.datasets[0].data = salesData;
    myBarChart.update();
  }

  function formatDateToYYYYMMDD(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    return year + "/" + month + "/" + day;
  }

  $scope.updateChart = function () {
    var startDate = new Date($scope.startDate);
    var endDate = new Date($scope.endDate);
    $http
      .get(
        "http://localhost:8080/api/admin/thong-ke/doanhthu?ngayBd=" +
          formatDateToYYYYMMDD(startDate) +
          "&ngayKt=" +
          formatDateToYYYYMMDD(endDate),
        config
      )
      .then(function (response) {
        processDataAndDisplayChart(response.data);
      });
  };

  $scope.updateChart();

  //Biểu Đồ Tròn
  $scope.loadData = function () {
    $http
      .get("http://localhost:8080/api/admin/thong-ke/choxacnhan", config)
      .then(function (response) {
        $scope.choXacNhan = response.data;
        return $http.get(
          "http://localhost:8080/api/admin/thong-ke/xacnhan",
          config
        );
      })
      .then(function (response) {
        $scope.xacNhan = response.data;
        return $http.get(
          "http://localhost:8080/api/admin/thong-ke/chogiaohang",
          config
        );
      })
      .then(function (response) {
        $scope.choGiaoHang = response.data;
        return $http.get(
          "http://localhost:8080/api/admin/thong-ke/danggiao",
          config
        );
      })
      .then(function (response) {
        $scope.dangGiao = response.data;
        return $http.get(
          "http://localhost:8080/api/admin/thong-ke/thanhcong",
          config
        );
      })
      .then(function (response) {
        $scope.thanhCong = response.data;
        return $http.get(
          "http://localhost:8080/api/admin/thong-ke/trahang",
          config
        );
      })
      .then(function (response) {
        $scope.traHang = response.data;
        return $http.get(
          "http://localhost:8080/api/admin/thong-ke/dahuy",
          config
        );
      })
      .then(function (response) {
        $scope.daHuy = response.data;
        updateChartData(
          $scope.choXacNhan,
          $scope.xacNhan,
          $scope.choGiaoHang,
          $scope.dangGiao,
          $scope.thanhCong,
          $scope.traHang,
          $scope.daHuy
        );
      })
      .catch(function (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      });
  };

  $scope.loadData();
  function updateChartData(
    choXacNhan,
    xacNhan,
    choGiaoHang,
    dangGiao,
    thanhCong,
    traHang,
    daHuy
  ) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Chờ xác nhận",
          "Xác nhận",
          "Chờ giao hàng",
          "Giao hàng",
          "Thành công",
          "Đã hủy",
        ],
        datasets: [
          {
            data: [
              choXacNhan,
              xacNhan,
              choGiaoHang,
              dangGiao,
              thanhCong,            
              daHuy,
            ],
            backgroundColor: [
              "#03c6fc",
              "#1ff2cb",
              "#bdae4f",
              "#f21fdd",
              "#4efc03",
              "#f21f1f",
            ],
          },
        ],
      },
      options: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    });
  }
  var token = $window.localStorage.getItem("accessToken");
});
