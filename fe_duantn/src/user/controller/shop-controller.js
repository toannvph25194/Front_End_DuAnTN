app.controller('shopController', function ($scope, $http) {

    // Khai báo biến lấy giá trị trang đầu
    $scope.currentPage = 1;
    // Số lượng bản ghi trên mỗi trang
    $scope.itemsPerPage = 9;
    // Biến mảng
    $scope.sanPhamShop = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];
    $scope.listMauSac = [];

    // Biến để kiểm tra trạng thái lọc theo nhiều tiêu chí và khoảng giá
    $scope.isLocTNTC = false;

    // Xử lý sự kiện trang trước
    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.ApplyFilters();
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.currentPage++;
            $scope.ApplyFilters();
        }
    };

    // Hàm lấy tổng số trang
    $scope.getTotalPages = function () {
        return Math.ceil($scope.totalItems / $scope.itemsPerPage);
    };

    // Hàm cập nhật trang từ ô input
    $scope.updatePage = function () {
        if (!/^[1-9]\d*$/.test($scope.currentPage)) {
            $scope.currentPage = 1;
        } else if ($scope.currentPage > $scope.totalPages) {
            $scope.currentPage = $scope.totalPages;
        }
        $scope.ApplyFilters();
    };

    // Hàm áp dụng tất cả các bộ lọc
    $scope.ApplyFilters = function () {
        if ($scope.isLocTNTC) {
            $scope.locSPShopNhieuTC();
        } else if ($scope.tensp && $scope.tensp !== "") {
            $scope.locTenSPShop();
        } else if ($scope.khoanggia && $scope.khoanggia !== "") {
            $scope.locSPShopKhoangGia();
        } else {
            $scope.loadSPShop();
            console.log("ApplyFilters");
        }
    };

    // Load sp shop lên trang shop
    $scope.loadSPShop = function () {
        $http.get(`http://localhost:8080/api/ol/san-pham-shop/load?page=${$scope.currentPage - 1}`).then(resp => {
            $scope.sanPhamShop = resp.data.content;
            console.log("Load SPShop :", $scope.sanPhamShop);

            // Tổng số bản ghi
            $scope.totalItems = resp.data.totalElements;
            // Tổng số trang
            $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
            // console.log("TST :", $scope.totalItems);

            if ($scope.sanPhamShop.length < $scope.itemsPerPage) {
                $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
                $scope.showNextButton = true; // Hiển thị nút "Next"
            }
        }).catch(error => {
            console.log("Lỗi Load SPShop", error);
        });
    }
    // Theo dõi sự thay đổi của currentPage
    $scope.$watch('currentPage', function () {
        $scope.ApplyFilters();
    });

    // Load danh mục sản phẩm shop
    $scope.getAllDanhMucSPShop = function () {
        $http
            .get("http://localhost:8080/api/ol/san-pham-shop/load-danh-muc")
            .then(function (response) {
                $scope.listDanhMuc = response.data;
                console.log("ListDM :", $scope.listDanhMuc);
            });
    };
    $scope.getAllDanhMucSPShop();

    // Load màu sắc sản phẩm shop
    $scope.getAllMauSacSPShop = function () {
        $http
            .get("http://localhost:8080/api/ol/san-pham-shop/load-mau-sac")
            .then(function (response) {
                $scope.listMauSac = response.data;
                console.log("ListMS :", $scope.listMauSac);
            });
    };
    $scope.getAllMauSacSPShop();

    // Load danh mục sản phẩm shop
    $scope.getAllSizeSPShop = function () {
        $http
            .get("http://localhost:8080/api/ol/san-pham-shop/load-size")
            .then(function (response) {
                $scope.listSize = response.data;
                // Sắp xếp dữ liệu theo thứ tự mong muốn (S, M, L, XL, XXL)
                $scope.listSize.sort(function (a, b) {
                    var sizesOrder = ['S', 'M', 'L', 'XL', 'XXL'];
                    return sizesOrder.indexOf(a.tensize) - sizesOrder.indexOf(b.tensize);
                });
                console.log("ListSize :", $scope.listSize);
            });
    };
    $scope.getAllSizeSPShop();

    // Lọc sản phẩm theo khoảng giá
    $scope.locSPShopKhoangGia = function () {
        var lockhoangia = $scope.khoanggia;
        var key1, key2;

        // Tách giá trị của option thành khoảng giá key1 và key2
        if (lockhoangia) {
            var kgvalues = lockhoangia.split("-");
            key1 = kgvalues[0];
            key2 = kgvalues.length > 1 ? kgvalues[1] : null;
        }

        if (!lockhoangia) {
            $scope.loadSPShop();
        } else {
            $http.get("http://localhost:8080/api/ol/san-pham-shop/loc/khoang-gia?pageNumber=" + ($scope.currentPage - 1) + "&pageSize=" + $scope.itemsPerPage + "&key1=" + key1 + "&key2=" + key2)
                .then(function (response) {
                    $scope.sanPhamShop = response.data.content;
                    console.log("Lọc SP Theo khoảng giá :", $scope.sanPhamShop);
                    // Tổng số bản ghi
                    $scope.totalItems = response.data.totalElements;
                    // Tổng số trang
                    $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
                    if ($scope.sanPhamShop.length < $scope.itemsPerPage) {
                        $scope.showNextButton = false;
                    } else {
                        $scope.showNextButton = true;
                    }
                });
        }
    };

    // Lọc sản phẩm theo tensp
    $scope.locTenSPShop = function () {
        var tensanpham = $scope.tensp;
        if (tensanpham == "") {
            $scope.loadSPShop();
        } else {
            $http.get(
                "http://localhost:8080/api/ol/san-pham-shop/loc/ten-san-pham?pageNumber=" + ($scope.currentPage - 1) + "&pageSize=" + $scope.itemsPerPage +
                "&tensp=" + tensanpham
            )
                .then(function (response) {
                    $scope.sanPhamShop = response.data.content;
                    console.log("Lọc SP Theo Tên :", $scope.sanPhamShop);
                    // Tổng số bản ghi
                    $scope.totalItems = response.data.totalElements;
                    // Tổng số trang
                    $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
                    if ($scope.sanPhamShop.length < $scope.itemsPerPage) {
                        $scope.showNextButton = false;
                    } else {
                        $scope.showNextButton = true;
                    }
                });
        }
    };

    // Lọc sản phẩm theo nhiều tiêu chí. tendanhmuc, tenmausac, tensize
    // Khởi tạo giá trị ban đầu cho các biến
    $scope.tendanhmuc = "";
    $scope.tenmausac = "";
    $scope.tensize = "";
    $scope.locSPShopNhieuTC = function () {
        var tendm = $scope.tendanhmuc;
        var tenms = $scope.tenmausac;
        var tens = $scope.tensize;
        $scope.isLocTNTC = true;
        if (tendm == "" && tenms == "" && tens == "") {
            $scope.loadSPShop();
             $scope.isLocTNTC = true;
        } else {
            $http.get("http://localhost:8080/api/ol/san-pham-shop/loc/san-pham?pageNumber=" + ($scope.currentPage - 1) + "&pageSize=" + $scope.itemsPerPage +
                "&tendanhmuc=" + tendm + "&tenmausac=" + tenms + "&tensize=" + tens)
                .then(function (response) {
                    $scope.sanPhamShop = response.data.content;
                    console.log("Lọc SP Theo Nhiều Tiêu Chí :", $scope.sanPhamShop);
                    // Tổng số bản ghi
                    $scope.totalItems = response.data.totalElements;
                    // Tổng số trang
                    $scope.totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
                    if ($scope.sanPhamShop.length < $scope.itemsPerPage) {
                        $scope.showNextButton = false;
                    } else {
                        $scope.showNextButton = true;
                    }
                });
        }
    };

});