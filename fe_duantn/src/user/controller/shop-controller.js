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

    // khai báo 2 biến cho các hàm tìm kiếm
    $scope.pageNumber = 0;
    $scope.pageSize = 9

    // Xử lý sự kiện trang trước
    $scope.previousPage = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
        }
    };

    // Xử lý sự kiện trang tiếp theo
    $scope.nextPage = function () {
        if ($scope.currentPage <  $scope.totalPages) {
            $scope.currentPage++;
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
    };

    // Load sp shop lên trang shop
    $scope.loadSPShop = function () {
        $http.get(`http://localhost:8080/api/san-pham-shop/load?page=${$scope.currentPage - 1}`).then(resp => {
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
    $scope.$watch('currentPage',$scope.loadSPShop);

    // Load danh mục sản phẩm shop
    $scope.getAllDanhMucSPShop = function () {
        $http
            .get("http://localhost:8080/api/san-pham-shop/load-danh-muc")
            .then(function (response) {
                $scope.listDanhMuc = response.data;
                console.log("ListDM :", $scope.listDanhMuc);
            });
    };
    $scope.getAllDanhMucSPShop();

    // Load màu sắc sản phẩm shop
    $scope.getAllMauSacSPShop = function () {
        $http
            .get("http://localhost:8080/api/san-pham-shop/load-mau-sac")
            .then(function (response) {
                $scope.listMauSac = response.data;
                console.log("ListMS :", $scope.listMauSac);
            });
    };
    $scope.getAllMauSacSPShop();

    // Load danh mục sản phẩm shop
    $scope.getAllSizeSPShop = function () {
        $http
            .get("http://localhost:8080/api/san-pham-shop/load-size")
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

    // kéo thả gias
    var sliderrange = $('#slider-range');
    var amountprice = $('#amount');
    $(function () {
        sliderrange.slider({
            range: true,
            min: 9000,
            max: 1000000,
            values: [0, 300000],
            slide: function (event, ui) {
                amountprice.val(ui.values[0] + "đ" + " - " + ui.values[1] + "đ");
            },
            stop: function (event, ui) {
                $scope.locSPShopKhoangGia();
            }
        });
        amountprice.val(sliderrange.slider("values", 0) + "đ" +
            " - " + sliderrange.slider("values", 1) + "đ");
    });


    // Lọc sản phẩm theo khoảng giá
    $scope.locSPShopKhoangGia = function () {
        var key1 = sliderrange.slider("values", 0);
        var key2 = sliderrange.slider("values", 1);

        $http.get(
            "http://localhost:8080/api/san-pham-shop/loc/khoang-gia?pageNumber=" + $scope.pageNumber + "&pageSize=" + $scope.pageSize +
            "&key1=" + key1 +
            "&key2=" + key2
        )
            .then(function (response) {
                $scope.sanPhamShop = response.data.content;
                console.log("Lọc SP Theo khoảng giá :", $scope.sanPhamShop);
                if ($scope.sanPhamShop.length < $scope.pageSize) {
                    $scope.showNextButton = false; // Ẩn nút "Next"
                } else {
                    $scope.showNextButton = true; // Hiển thị nút "Next"
                }
            });
    };

    // Lọc sản phẩm theo tensp
    $scope.locTenSPShop = function () {
        var tensanpham = $scope.tensp;
        if (tensanpham == "") {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            $scope.loadSPShop();
            console.log("Gọi Hàm LoadSPShop");
        } else {
            $http.get(
                "http://localhost:8080/api/san-pham-shop/loc/ten-san-pham?pageNumber=" + $scope.pageNumber + "&pageSize=" + $scope.pageSize +
                "&tensp=" + tensanpham 
            )
                .then(function (response) {
                    $scope.sanPhamShop = response.data.content;
                    console.log("Lọc SP Theo Nhiều Tiêu Chí :", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
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

        if (tendm == "" && tenms == "" && tens == "") {
            // Nếu giá trị là null, gọi lại danh sách đầy đủ
            $scope.loadSPShop();
            console.log("Gọi Hàm LoadSPShop");
        } else {
            $http.get(
                "http://localhost:8080/api/san-pham-shop/loc/san-pham?pageNumber=" + $scope.pageNumber + "&pageSize=" + $scope.pageSize +
                "&tendanhmuc=" + tendm + "&tenmausac=" + tenms + "&tensize=" + tens
            )
                .then(function (response) {
                    $scope.sanPhamShop = response.data.content;
                    console.log("Lọc SP Theo Nhiều Tiêu Chí :", $scope.sanPhamShop);
                    if ($scope.sanPhamShop.length < $scope.pageSize) {
                        $scope.showNextButton = false; // Ẩn nút "Next"
                    } else {
                        $scope.showNextButton = true; // Hiển thị nút "Next"
                    }
                });
        }
    };

});