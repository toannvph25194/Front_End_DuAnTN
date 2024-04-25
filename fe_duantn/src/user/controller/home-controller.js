app.controller("homeController", function ($scope, $http, $window, $route) {

    // Load sp Mới lên trang chủ
    function loadSPMoi() {

        $http.get('http://localhost:8080/api/ol/san-pham/show-new').then(resp => {
            $scope.sanPhamMoi = resp.data;
            console.log("Success Data SP Mới :", resp)
        }).catch(error => {
            console.log("Lỗi k load được spnew :", error)
        });
    }
    loadSPMoi();

    // Load sp giảm giá lên trang chủ
    function loadSPGiamGia() {

        $http.get('http://localhost:8080/api/ol/san-pham/show-giam-gia').then(resp => {
            $scope.sanPhamGG = resp.data;
            console.log("Success Data SP GG :", resp)
        }).catch(error => {
            console.log("Lỗi K Load được spgg :", error)
        });
    }
    loadSPGiamGia();


    // Load và phân trang sp lên home
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
        if ($scope.currentPageHome < $scope.totalPagesHome) {
            $scope.currentPageHome++;
        }
    };
    // Hàm cập nhật trang từ ô input
    $scope.updatePageHome = function () {
        if (!/^[1-9]\d*$/.test($scope.currentPageHome)) {
            $scope.currentPageHome = 1;
        } else if ($scope.currentPageHome > $scope.totalPagesHome) {
            $scope.currentPageHome = $scope.totalPagesHome;
        }
    };
    // Load sp lên trang chủ
    function loadSPHome() {
        $http.get(`http://localhost:8080/api/ol/san-pham/show?page=${$scope.currentPageHome - 1}`)
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


    // Load và phân trang spnam lên home
    // khai báo biến trang đầu tiên là 1
    $scope.currentPageNam = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageNam = 12;
    // Xử lý sự kiện trang trước
    $scope.previousPageNam = function () {
        if ($scope.currentPageNam > 1) {
            $scope.currentPageNam--;
        }
    };
    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageNam = function () {
        if ($scope.currentPageNam < $scope.totalPagesNam) {
            $scope.currentPageNam++;
        }
    };
    // Hàm cập nhật trang từ ô input
    $scope.updatePageNam = function () {
        if (!/^[1-9]\d*$/.test($scope.currentPageNam)) {
            $scope.currentPageNam = 1;
        } else if ($scope.currentPageNam > $scope.totalPagesNam) {
            $scope.currentPageNam = $scope.totalPagesNam;
        }
    };
    // Load sp Nam lên trang chủ
    $scope.loadSPNamHome = function() {
        const page = $scope.currentPageNam - 1
        $http.get(`http://localhost:8080/api/ol/san-pham/show-nam?page=${page}`)
            .then(resp => {
                $scope.sanPhamNam = resp.data.content;
                // Tổng số bản ghi
                $scope.totalItemsNam = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesNam = Math.ceil($scope.totalItemsNam / $scope.itemsPerPageNam);
                console.log("Load data SPNam :", resp);
            }).catch(error => {
                console.log("Lỗi K load được spnam :", error);
            });
    }
    $scope.$watch('currentPageNam',$scope.loadSPNamHome);


    // Load và phân trang spnu lên home
    // khai báo biến trang đầu tiên là 1
    $scope.currentPageNu = 1;
    // khai báo biến có 12 sp trên 1 trang
    $scope.itemsPerPageNu = 12;

    // Xử lý sự kiện trang trước
    $scope.previousPageNu = function () {
        if ($scope.currentPageNu > 1) {
            $scope.currentPageNu--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPageNu = function () {
        if ($scope.currentPageNu < $scope.totalPagesNu) {
            $scope.currentPageNu++;
        }
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePageNu = function () {
        if (!/^[1-9]\d*$/.test($scope.currentPageNu)) {
            $scope.currentPageNu = 1;
        } else if ($scope.currentPageNu > $scope.totalPagesNu) {
            $scope.currentPageNu = $scope.totalPagesNu;
        }
    };

    // Load sp Nam lên trang chủ
    $scope.loadSPNuHome = function() {
        const page = $scope.currentPageNu - 1
        $http.get(`http://localhost:8080/api/ol/san-pham/show-nu?page=${page}`)
            .then(resp => {
                $scope.sanPhamNu = resp.data.content;
                // Tổng số bản ghi
                $scope.totalItemsNu = resp.data.totalElements;
                // Tổng số trang
                $scope.totalPagesNu = Math.ceil($scope.totalItemsNu / $scope.itemsPerPageNu);
                console.log("Load data SPNu :", resp);
            }).catch(error => {
                console.log("Lỗi K load được spnu :", error);
            });
    }
    $scope.$watch('currentPageNu',$scope.loadSPNuHome);
});