app.controller("homeController", function ($scope, $http, $window, $route) {

    // Load sp Mới lên trang chủ
    function loadSPMoi() {

        $http.get('http://localhost:8080/api/san-pham/show-new').then(resp => {
            $scope.sanPhamMoi = resp.data;
            console.log("Success Data SP Mới :", resp)
        }).catch(error => {
            console.log("Lỗi k load được spnew :", error)
        });
    }
    loadSPMoi();

    // Load sp giảm giá lên trang chủ
    function loadSPGiamGia() {

        $http.get('http://localhost:8080/api/san-pham/show-giam-gia').then(resp => {
            $scope.sanPhamGG = resp.data;
            console.log("Success Data SP GG :", resp)
        }).catch(error => {
            console.log("Lỗi K Load được spgg :", error)
        });
    }
    loadSPGiamGia();


    // --------------- Phân Trang SP Home --------------- //

    // khai báo biến trang đầu tiên là 1
    $scope.currentPageHome = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageHome = 12;

    // Xử lý sự kiện trang trước
    $scope.previousPageHome = function () {
        if ($scope.currentPageHome > 1) {
            $scope.currentPageHome--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageHome = function () {
        var totalPagesHome = Math.ceil($scope.totalItemsHome / $scope.itemsPerPageHome);
        if ($scope.currentPageHome < totalPagesHome) {
            $scope.currentPageHome++;
        }
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePageHome = function () {
        var totalPagesHome = Math.ceil($scope.totalItemsHome / $scope.itemsPerPageHome);
        if (!/^[1-9]\d*$/.test($scope.currentPageHome)) {
            $scope.currentPageHome = 1;
        } else if ($scope.currentPageHome > totalPagesHome) {
            $scope.currentPageHome = totalPagesHome;
        }
    };

    // Load sp lên trang chủ
    function loadSPHome() {
        $http.get(`http://localhost:8080/api/san-pham/show?page=${$scope.currentPageHome - 1}`)
            .then(resp => {
                $scope.sanPhamS = resp.data.content;
                // Tổng số bản ghi
                $scope.totalItemsHome = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesHome = Math.ceil($scope.totalItemsHome / $scope.itemsPerPageHome);

                console.log("Load Data SPHome :", resp);
            }).catch(error => {
                console.log("Lỗi k load được sphome :", error);
            });
    }

    $scope.$watch('currentPageHome', loadSPHome);



    // ---------------- Phân Trang SP Nam ---------------- //

    // khai báo biến trang đầu tiên là 1
    $scope.currentPageNamNu = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageNamNu = 12;

    // Xử lý sự kiện trang trước
    $scope.previousPageNamNu = function () {
        if ($scope.currentPageNamNu > 1) {
            $scope.currentPageNamNu--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageNamNu = function () {
        var totalPagesNamNu = Math.ceil($scope.totalItemsNamNu / $scope.itemsPerPageNamNu);
        if ($scope.currentPageNamNu < totalPagesNamNu) {
            $scope.currentPageNamNu++;
        }
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePageNamNu = function () {
        var totalPagesNamNu = Math.ceil($scope.totalItemsNamNu / $scope.itemsPerPageNamNu);
        if (!/^[1-9]\d*$/.test($scope.currentPageNamNu)) {
            $scope.currentPageNamNu = 1;
        } else if ($scope.currentPageNamNu > totalPagesNamNu) {
            $scope.currentPageNamNu = totalPagesNamNu;
        }
    };

    // Load sp Nam lên trang chủ
    $scope.loadSPNamNuHome = function(theloai) {
        const page = $scope.currentPageNamNu - 1
        $http.get(`http://localhost:8080/api/san-pham/show-nam-nu?page=${page}&theloai=${theloai}`)
            .then(resp => {
                $scope.sanPhamNamNu = resp.data.content;
                // Tổng số bản ghi
                $scope.totalItemsNamNu = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesNamNu = Math.ceil($scope.totalItemsNamNu / $scope.itemsPerPageNamNu);

                console.log("Load data SPNamNu :", resp);
            }).catch(error => {
                console.log("Lỗi K load được spnamnu :", error);
            });
    }
});