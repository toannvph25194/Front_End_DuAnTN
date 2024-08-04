app.controller('cartController', function ($scope, $http, $window, $routeParams, $route, $location, $timeout) {

    $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
    };

    // Lấy idGioHang và Idtk từ localStorage
    var IdGioHang = localStorage.getItem('idgiohang');
    console.log("ID GioHang LocalStor :", IdGioHang);
    var IdTK = localStorage.getItem('idtk');
    console.log("ID TK :" , IdTK);

    // Tạo biến lấy idtk trên localStorage để check;
    $scope.Idtaikhoan = localStorage.getItem('idtk');
    // Tạo biến lấy tentk trên localStorage để hiển thị khi dn;
    $scope.tenTK = localStorage.getItem('taikhoan');

    // Load giỏ hàng chi tiết
    $scope.loadCart = function () {
        // Check id giỏ hàng
        if (IdGioHang !== null) {
            $http.get('http://localhost:8080/api/ol/gio-hang-chi-tiet/load?idgh=' + IdGioHang)
                .then(resp => {
                    $scope.cartS = resp.data;
                    console.log("Data Cart :", resp.data);
                    // Truy cập soluongton của từng phần tử trong danh sách
                    for (let i = 0; i < $scope.cartS.length; i++) {
                        console.log("Số Lượng Tồn Click:", $scope.cartS[i].soluongton);
                    }
                    // Đếm số lượng sản phẩm
                    $scope.soLuongSanPham = $scope.cartS.length;
                    $scope.thanhtien = 0;
                    for (var i = 0; i < $scope.cartS.length; i++) {
                        if ($scope.cartS[i].dongiakhigiam) {
                            $scope.thanhtien += parseFloat($scope.cartS[i].soluong * $scope.cartS[i].dongiakhigiam);
                        } else {
                            $scope.thanhtien += parseFloat($scope.cartS[i].soluong * $scope.cartS[i].dongia);
                        }
                    }
                }).catch(error => {
                    console.log("Lỗi K load đc sp :", error);
                });
        } else {
            $scope.soLuongSanPham = 0;
            console.log('Chưa tạo giỏ Hàng');
        }
    }
    $scope.loadCart();

    // Xử lý cộng trừ số lượng 
    $scope.changeQuantity = function (product, change) {
        if (change === 'qty-up') {
            if (product.soluongton > 0 && product.soluong < product.soluongton) {
                product.soluong++;
            } else {
                Swal.fire({
                    title: "Thông Báo",
                    text: "Số Lượng Sản Phẩm Không Đủ !",
                    icon: "warning",
                    position: "top-end", // Đặt vị trí ở góc trái
                    toast: true, // Hiển thị thông báo nhỏ
                    showConfirmButton: false, // Ẩn nút xác nhận
                    timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
                })
                return;
            }
        } else if (change === 'qty-down' && product.soluong > 1) {
            product.soluong--;
        }
        // Gọi API để cập nhật số lượng
        console.log(product.idghct)
        console.log(product.soluong)
        updateQuantity(product.idghct, product.soluong);
    };


    // Validate soluong
    $scope.validateNumber = function (cart) {
        // Kiểm tra nếu không phải là số dương, có chữ hoặc là số 0
        if (!/^[1-9]\d*$/.test(cart.soluong)) {
            cart.soluong = 1;
        } else if (parseInt(cart.soluong) > 0 && parseInt(cart.soluong) <= cart.soluongton) {
            // Nếu số lượng là số dương và nhỏ hơn hoặc bằng số lượng tồn, giữ nguyên giá trị
            cart.soluong = parseInt(cart.soluong);
        } else {
            Swal.fire({
                title: "Thông Báo",
                text: "Số Lượng Sản Phẩm Không Đủ !",
                icon: "warning",
                position: "top-end", // Đặt vị trí ở góc trái
                toast: true, // Hiển thị thông báo nhỏ
                showConfirmButton: false, // Ẩn nút xác nhận
                timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            })
            cart.soluong = 1;
        }
    };


    // Xử lý nhập số lượng mới bằng tay
    $scope.handleBlur = function (product) {
        // Gọi API để cập nhật số lượng
        console.log(product.idghct);
        console.log(product.soluong);
        updateQuantity(product.idghct, product.soluong);
    };

    // Hàm gọi API cập nhật số lượng
    function updateQuantity(idghct, newQuantity) {
        var apiURL = 'http://localhost:8080/api/ol/gio-hang-chi-tiet/update-so-luong?idghct=' + idghct + '&soluong=' + newQuantity;
        $http({
            url: apiURL,
            method: 'PUT',
            transformResponse: [
                function () {
                    // Gọi lại hàm loadCart để cập nhật lại listcart trên localstorage
                    $scope.loadCart();
                    $window.location.reload();
                }
            ]

        });
    }

    // Delete 1 sp Giỏ hàng chi tiết
    $scope.deleteCart = function (idghct) {
        var apiURL = 'http://localhost:8080/api/ol/gio-hang-chi-tiet/delete-san-pham?idghct=' + idghct;
        Swal.fire({
            title: "Xác nhận xóa?",
            text: "Bạn có chắc chắn muốn xóa sản phẩm khỏi giỏ hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                $http({
                    url: apiURL,
                    method: 'DELETE',
                    transformResponse: [
                        function () {
                            // Gọi lại hàm loadCart để cập nhật lại listcart trên localstorage
                            $scope.loadCart();
                            $window.location.reload();
                        }
                    ]
                });
            }
        });
    }


    //delete tất cả sp trong giỏ hàng chi tiết
    $scope.clearCart = function () {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                var apiURL = 'http://localhost:8080/api/ol/gio-hang-chi-tiet/delete-all-san-pham?idgh=' + IdGioHang;
                $http({
                    url: apiURL,
                    method: 'DELETE',
                    transformResponse: [
                        function () {
                            // Gọi lại hàm loadCart để cập nhật lại listcart trên localstorage
                            $scope.loadCart();
                            $window.location.reload();
                        }
                    ]
                });
            }
        });
    }

    function reload() {
        $route.reload();
        // $window.location.reload();
    }

    // Reload checkout cart
    $scope.reloadCheckoutCart = function () {
        $location.path('/checkout');
        $timeout(reload, 500);
    }

    // Đăng Xuất
    $scope.logout = function () {
        // Sử dụng SweetAlert để xác nhận việc đăng xuất
        Swal.fire({
            title: "Xác nhận đăng xuất?",
            text: "Bạn có chắc chắn muốn đăng xuất?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đăng xuất",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                // Xóa các thông tin liên quan đến người dùng khỏi localStorage
                // $window.localStorage.clear();
                $window.localStorage.removeItem("idtk");
                $window.localStorage.removeItem("taikhoan");
                $window.localStorage.removeItem("listghct");
                $window.localStorage.removeItem("tongsotien");
                $window.localStorage.removeItem("idgiohang");
                $window.localStorage.removeItem("idvoucher");
                $window.localStorage.removeItem("giatrigiam");
                $window.localStorage.removeItem("mavoucher");
                $window.localStorage.removeItem("hinhthucgiam");
                $window.localStorage.removeItem("dieukientoithieuhoadon");

                // Chuyển hướng người dùng đến trang đăng nhập
                $window.location.href = '/src/user/pages/Login.html';
            }
        });
    };

});