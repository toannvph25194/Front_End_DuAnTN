app.controller('checkoutController', function ($scope, $http, $window, $location, $timeout, $route, $routeParams) {

    // Lấy idGioHang từ localStorage
    var IdGioHang = localStorage.getItem('idgiohang');
    console.log("ID GioHang LocalStor :", IdGioHang);

    var IdTK = localStorage.getItem('idtk');
    console.log("ID TK : ", IdTK);


    // finBy thông tin người dùng theo idkh
    function finByTTNguoiDung() {
        // Check idkh
        if (IdTK !== null) {
            var url = 'http://localhost:8080/api/ol/check-out/thong-tin-nguoi-dung/load/thong-tin?idkh=' + IdTK;
            $http.get(url).then(resp => {
                $scope.ttNguoiDung = resp.data;
                console.log('TT người dùng :', $scope.ttNguoiDung);
                // Lấy thông tin từ server và gán vào các biến $scope
                $scope.hovaten = $scope.ttNguoiDung.hovatenkh;
                $scope.email = $scope.ttNguoiDung.email;
                $scope.sodienthoai = $scope.ttNguoiDung.sodienthoai;
            }).catch(error => {
                console.log("Lỗi finBy thông tin người dùng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    finByTTNguoiDung();

    // finBy địa chỉ người dùng theo idkh
    function finByDCNguoiDung() {
        // Check idkh
        if (IdTK !== null) {
            var url = 'http://localhost:8080/api/ol/check-out/dia-chi-nguoi-dung/load/dia-chi?idkh=' + IdTK;
            $http.get(url).then(resp => {
                $scope.dcNguoiDung = resp.data;
                console.log('DC người dùng :', $scope.dcNguoiDung);
                // Lấy địa chỉ đầu tiên từ danh sách và gán vào $scope.diaChi
                $scope.diachi = $scope.dcNguoiDung.length > 0 ? $scope.dcNguoiDung[0].diachichitiet : "";
                $scope.xa = $scope.dcNguoiDung.length > 0 ? $scope.dcNguoiDung[0].phuongxa : "";
                $scope.huyen = $scope.dcNguoiDung.length > 0 ? $scope.dcNguoiDung[0].quanhuyen : "";
                $scope.thanhpho = $scope.dcNguoiDung.length > 0 ? $scope.dcNguoiDung[0].tinhthanh : "";

            }).catch(error => {
                console.log("Lỗi finBy địa chỉ người dùng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    finByDCNguoiDung();

    // finbt ghct lên trang checkout
    function loadGHCTcheckout() {

        // Check id giỏ hàng
        if (IdGioHang !== null) {
            var url = "http://localhost:8080/api/ol/gio-hang-chi-tiet/load?idgh=" + IdGioHang;
            $http.get(url).then(resp => {
                $scope.ghctcheckout = resp.data;
                console.log('DaTa ghct checkout :', $scope.ghctcheckout);
                $window.localStorage.setItem(
                    "listghct",
                    $scope.ghctcheckout.map((item) => item.idghct)
                );

                // Tính tổng tiền tất cả sản phẩm
                $scope.tongtiensp = 0;
                for (var i = 0; i < $scope.cartS.length; i++) {
                    if ($scope.ghctcheckout[i].dongiakhigiam) {
                        $scope.tongtiensp += parseFloat($scope.ghctcheckout[i].soluong * $scope.ghctcheckout[i].dongiakhigiam);
                    } else {
                        $scope.tongtiensp += parseFloat($scope.ghctcheckout[i].soluong * $scope.ghctcheckout[i].dongia);
                    }
                }

            }).catch(error => {
                console.log("Lỗi load ghct checkout !", error);
            });
        } else {
            console.log('Chưa tạo giỏ hàng !');
        }
    }
    loadGHCTcheckout();

    // load tổng tất cả số tiền của sản phẩm trong ghct
    function loadTongSoTien() {

        // Check id giỏ hàng
        if (IdGioHang !== null) {
            var url = 'http://localhost:8080/api/ol/gio-hang-chi-tiet/tong-so-tien-san-pham?idgh=' + IdGioHang;
            $http.get(url).then(resp => {
                $scope.tongSoTien = resp.data;
                console.log('Load Tổng Số Tiền SP :', $scope.tongSoTien);
                localStorage.setItem("tongsotien", $scope.tongSoTien.tongsotien);
            }).catch(error => {
                console.log("Chưa Có SP để tính TST !", error);
            });
        } else {
            console.log('Chưa tạo giỏ hàng !');
        }
    }
    loadTongSoTien();


    // Xử Lý VouCher
    // Load VouCher
    $scope.loadVoucher = function () {
        var url = 'http://localhost:8080/api/ol/voucher/load';
        $http.get(url).then(resp => {
            $scope.vouChers = resp.data;
            console.log('Load VouCher :', $scope.vouChers);
            $scope.vouCherApDung();
        }).catch(error => {
            console.log("Lỗi load voucher !", error);
        });
    }
    $scope.loadVoucher();

    // Xử lý giữ giá trị của voucher khi đã áp dụng
    $scope.vouCherApDung = function () {

        var tstbandau = parseFloat(localStorage.getItem("tongsotien"));
        var dieukientoithieuhoadon = parseFloat(localStorage.getItem("dieukientoithieuhoadon"));
        if (tstbandau >= dieukientoithieuhoadon) {
            var magiamgia = localStorage.getItem('mavoucher');
            // Nếu magiamgia, đánh dấu voucher đó là đã áp dụng
            if (magiamgia) {
                $scope.vouChers.forEach(function (voucher) {
                    if (voucher.mavoucher === magiamgia) {
                        voucher.isapdung = true;
                    } else {
                        voucher.isapdung = false;
                    }
                });
            }
            // Xử lý giữ tongsotien và sotiengiam khi đã áp dụng voucher
            var hinhThucGiam = localStorage.getItem("hinhthucgiam");
            var giatrigiam = parseFloat(localStorage.getItem("giatrigiam"));
            // Kiểm tra hình thức giảm giá
            if (hinhThucGiam === "1") {
                // Giảm giá theo tỷ lệ %
                $scope.giamGiaVoucher = (tstbandau * giatrigiam) / 100;
            } else if (hinhThucGiam === "2") {
                // Giảm giá theo giá trị VNĐ
                $scope.giamGiaVoucher = giatrigiam;
            }
            // Tính tổng cộng số tiền khi đã sử dụng voucher
            $scope.tongtatca = $scope.tstbandau - $scope.giamGiaVoucher;
        } else {
            // khi update tổng tiền k đủ điều kiện dùng voucher thì remove voucher
            $window.localStorage.removeItem("idvoucher");
            $window.localStorage.removeItem("giatrigiam");
            $window.localStorage.removeItem("mavoucher");
            $window.localStorage.removeItem("hinhthucgiam");
            $window.localStorage.removeItem("dieukientoithieuhoadon");
        }
    }


    // Xử lý khi áp dụng voucher
    // tổng tiền khi chưa apdung voucher;
    $scope.tstbandau = parseFloat(localStorage.getItem("tongsotien"));
    var dieukientoithieuhoadon = parseFloat(dieukientoithieuhoadon);
    // Biến lấy giá trị ban đầu nếu k áp dụng voucher
    $scope.tongtatca = $scope.tstbandau;
    $scope.giamGiaVoucher = 0;
    // Hàm Xử lý khi chọn voucher
    $scope.voucherId = function (id, magiamgia, giatrigiam, hinhthucgiam, dieukientoithieuhoadon) {

        if ($scope.tstbandau >= dieukientoithieuhoadon) {
            // Lưu thông tin voucher lên localStorage
            localStorage.setItem("idvoucher", id);
            localStorage.setItem("mavoucher", magiamgia);
            localStorage.setItem("giatrigiam", giatrigiam);
            localStorage.setItem("hinhthucgiam", hinhthucgiam);
            localStorage.setItem("dieukientoithieuhoadon", dieukientoithieuhoadon);

            // Lấy thông tin voucher từ localStorage
            var idGiamGiaVoucher = localStorage.getItem("idvoucher");
            var magiamgia = localStorage.getItem("mavoucher");
            var hinhThucGiam = localStorage.getItem("hinhthucgiam");
            var giatrigiam = parseFloat(localStorage.getItem("giatrigiam"));
            // Kiểm tra hình thức giảm giá
            if (hinhThucGiam === "1") {
                // Giảm giá theo tỷ lệ %
                $scope.giamGiaVoucher = ($scope.tstbandau * giatrigiam) / 100;
            } else if (hinhThucGiam === "2") {
                // Giảm giá theo giá trị VNĐ
                $scope.giamGiaVoucher = giatrigiam;
            }

            // Tính tổng cộng số tiền khi đã sử dụng voucher
            $scope.tongtatca = $scope.tstbandau - $scope.giamGiaVoucher;
            Swal.fire({
                title: "Thành công",
                text: "Đã áp dụng voucher",
                icon: "success",
                position: "top-end", // Đặt vị trí ở góc trái
                toast: true, // Hiển thị thông báo nhỏ
                showConfirmButton: false, // Ẩn nút xác nhận
                timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });
            // Cập nhật trạng thái isApplied của voucher đã áp dụng
            $scope.vouChers.forEach(function (voucher) {
                if (voucher.mavoucher === magiamgia) {
                    voucher.isapdung = true;
                } else {
                    voucher.isapdung = false;
                }
            });
        } else {
            Swal.fire({
                title: "Sorry",
                text: "Giá trị đơn hàng chưa đủ ",
                icon: "error",
                position: "top-end", // Đặt vị trí ở góc trái
                toast: true, // Hiển thị thông báo nhỏ
                showConfirmButton: false, // Ẩn nút xác nhận
                timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });

        }
    };

    // Hàm để nắng nghe sự thay đổi của LocalStorage
    $scope.$watch(function () {
        // Lấy IdVoucher trên localStorage
        return $window.localStorage.getItem('idvoucher');
    }, function (newIdVoucher) {

        if (newIdVoucher === null || newIdVoucher === undefined) {
            // Nếu giá trị mới từ localStorage là null hoặc undefined,
            $scope.idvoucher = '11111111-1111-1111-1111-1111111111DD';
        } else {
            // Ngược lại, gán giá trị mới từ localStorage
            $scope.idvoucher = newIdVoucher;
            console.log("IdVoucher mới đang áp dụng :", $scope.idvoucher);
        }
    });


    // Khai báo biến để lưu các giá trị đã binding
    $scope.hovatenkh = "";
    $scope.sodienthoai = "";
    $scope.email = "";
    $scope.diachi = "";
    $scope.xa = "";
    $scope.huyen = "";
    $scope.thanhpho = "";
    $scope.thanhtien = 0;
    $scope.tienkhachtra = 0;
    $scope.phuongthucthanhtoan = 1;
    $scope.idvoucher = "";
    $scope.giatrigiam = 0;
    $scope.giohangchitietlist = [];

    var idghct = $window.localStorage.getItem("listghct");
    if (idghct !== null) {

        var gioHangChiTietList = idghct.split(",");
        console.log("Idghct :", gioHangChiTietList);

    } else {
        console.log("K thấy idghct");;
    }

    // Hàm xử lý khi người dùng click nút "Đặt Hàng"
    // ---------- Thanh Toán Khi Nhận Hàng ---------- //
    $scope.hovatenValid = true;
    $scope.sodienthoaiValid = true;
    $scope.emailValid = true;
    $scope.diachiValid = true;
    $scope.xaValid = true;
    $scope.huyenValid = true;
    $scope.thanhphoValid = true;
    $scope.sodienthoaiFomart = true;
    $scope.emailFomart = true;

    var sdtRegex = /^(0[2-9]{1}\d{8,9})$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $scope.thanhToan = function () {

        // Check trống họ và tên
        if (!$scope.hovaten) {
            $scope.hovatenValid = false;
        } else {
            $scope.hovatenValid = true;
        }

        // Check trống địa chỉ
        if (!$scope.diachi) {
            $scope.diachiValid = false;
        } else {
            $scope.diachiValid = true;
        }

        // Check trống phường xa
        if (!$scope.xa) {
            $scope.xaValid = false;
        } else {
            $scope.xaValid = true;
        }

        // Check trống quận huyện
        if (!$scope.huyen) {
            $scope.huyenValid = false;
        } else {
            $scope.huyenValid = true;
        }

        // Check trống tỉnh thành
        if (!$scope.thanhpho) {
            $scope.thanhphoValid = false;
        } else {
            $scope.thanhphoValid = true;
        }

        // Check trống số điện thoại và định dạng sdt
        if (!$scope.sodienthoai) {
            $scope.sodienthoaiValid = false;
            $scope.sodienthoaiFomart = true;
        } else if (!sdtRegex.test($scope.sodienthoai)) {
            $scope.sodienthoaiValid = true;
            $scope.sodienthoaiFomart = false;
            return;
        } else {
            $scope.sodienthoaiValid = true;
            $scope.sodienthoaiFomart = true;
        }

        // Check trống email và định dạng email
        if (!$scope.email) {
            $scope.emailValid = false;
            $scope.emailFomart = true;
        } else if (!emailRegex.test($scope.email)) {
            $scope.emailValid = true;
            $scope.emailFomart = false;
            return;
        } else {
            $scope.emailValid = true;
            $scope.emailFomart = true;
        }

        // Thông báo không được để trống
        if (
            !$scope.hovatenValid ||
            !$scope.sodienthoaiValid ||
            !$scope.emailValid ||
            !$scope.xaValid ||
            !$scope.huyenValid ||
            !$scope.thanhphoValid ||
            !$scope.diachiValid
        ) {
            Swal.fire({
                title: "Thông Báo",
                text: "Vui lòng điền đủ thông tin",
                icon: "warning",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        var checkslt = false;
        angular.forEach($scope.ghctcheckout, function (item) {
            if (item.soluong > item.soluongton) {
                checkslt = true;
                Swal.fire({
                    title: "Thông Báo",
                    text: "Số lượng tồn sản phẩm không đủ !",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1800,
                })
            }
        });
        if (checkslt) {
            return;
        }

        if (IdTK !== null) {
            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idghct !== null && $scope.tstbandau !== null) {
                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovatenkh: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachichitiet: $scope.diachi,
                            phuongxa: $scope.xa,
                            quanhuyen: $scope.huyen,
                            tinhthanh: $scope.thanhpho,
                            thanhtien: $scope.tongtatca,
                            tienkhachtra: $scope.tongtatca,
                            phuongthucthanhtoan: $scope.phuongthucthanhtoan,
                            idvoucher: $scope.idvoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            giohangchitietlist: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);
                        // Gửi dữ liệu POST đến Server
                        // Gắn tham số idkh vào URL
                        var url = "http://localhost:8080/api/ol/hoa-don/thanh-toan-login?idkh=" + IdTK;
                        $http.post(url, data)
                            .then(

                                function (resp) {

                                    // Chuyển hướng người dùng đến trang thanh toán thành công 
                                    function reload() {
                                        $window.location.reload();
                                        // $window.location.reload();
                                    }

                                    $location.path('/thanhyou');
                                    $timeout(reload, 100);

                                    // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                    $window.localStorage.removeItem("idgiohang");
                                    $window.localStorage.removeItem("idvoucher");
                                    $window.localStorage.removeItem("mavoucher");
                                    $window.localStorage.removeItem("dieukientoithieuhoadon");
                                    $window.localStorage.removeItem("giatrigiam");
                                    $window.localStorage.removeItem("listghct");
                                    $window.localStorage.removeItem("tongsotien");
                                    $window.localStorage.removeItem("hinhthucgiam");

                                },

                                function (eror) {
                                    // Xử lý lỗi nếu có
                                }
                            );
                    }
                } else {
                    console.log("Chưa Tìm Thấy Idghct Và SoLuong");
                }
            });
        } else {

            // Thanh Toán Không Đăng Nhập
            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idghct !== null && $scope.tstbandau !== null) {

                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovatenkh: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachichitiet: $scope.diachi,
                            phuongxa: $scope.xa,
                            quanhuyen: $scope.huyen,
                            tinhthanh: $scope.thanhpho,
                            thanhtien: $scope.tongtatca,
                            tienkhachtra: $scope.tongtatca,
                            phuongthucthanhtoan: $scope.phuongthucthanhtoan,
                            idvoucher: $scope.idvoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            giohangchitietlist: gioHangChiTietList,
                        };
                        console.log("DATA ThanhToan : ", data);

                        // Gửi dữ liệu POST đến Server
                        $http({
                            method: "Post",
                            url: "http://localhost:8080/api/ol/hoa-don/thanh-toan-not-login",
                            data: data,
                        }).then(
                            function (resp) {
                                // Chuyển hướng người dùng đến trang thanh toán thành công 
                                function reload() {
                                    $window.location.reload();
                                    // $window.location.reload();
                                }
                                $location.path('/thanhyou');
                                $timeout(reload, 100);

                                // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                $window.localStorage.removeItem("idgiohang");
                                $window.localStorage.removeItem("idvoucher");
                                $window.localStorage.removeItem("mavoucher");
                                $window.localStorage.removeItem("dieukientoithieuhoadon");
                                $window.localStorage.removeItem("giatrigiam");
                                $window.localStorage.removeItem("listghct");
                                $window.localStorage.removeItem("tongsotien");
                                $window.localStorage.removeItem("hinhthucgiam");

                            },
                            function (eror) {
                                // Xử lý lỗi nếu có
                            }
                        );
                    }
                } else {
                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }
            });
        }
    }

    console.log("Tiền Khách Trả !", $scope.tienkhachtra);

    // ---------- Thanh Toán VNPay ---------- //
    $scope.thanhToanVNPay = function () {

        // Check trống họ và tên
        if (!$scope.hovaten) {
            $scope.hovatenValid = false;
        } else {
            $scope.hovatenValid = true;
        }

        // Check trống địa chỉ
        if (!$scope.diachi) {
            $scope.diachiValid = false;
        } else {
            $scope.diachiValid = true;
        }

        // Check trống phường xa
        if (!$scope.xa) {
            $scope.xaValid = false;
        } else {
            $scope.xaValid = true;
        }

        // Check trống quận huyện
        if (!$scope.huyen) {
            $scope.huyenValid = false;
        } else {
            $scope.huyenValid = true;
        }

        // Check trống tỉnh thành
        if (!$scope.thanhpho) {
            $scope.thanhphoValid = false;
        } else {
            $scope.thanhphoValid = true;
        }

        // Check trống số điện thoại và định dạng sdt
        if (!$scope.sodienthoai) {
            $scope.sodienthoaiValid = false;
            $scope.sodienthoaiFomart = true;
        } else if (!sdtRegex.test($scope.sodienthoai)) {
            $scope.sodienthoaiValid = true;
            $scope.sodienthoaiFomart = false;
            return;
        } else {
            $scope.sodienthoaiValid = true;
            $scope.sodienthoaiFomart = true;
        }

        // Check trống email và định dạng email
        if (!$scope.email) {
            $scope.emailValid = false;
            $scope.emailFomart = true;
        } else if (!emailRegex.test($scope.email)) {
            $scope.emailValid = true;
            $scope.emailFomart = false;
            return;
        } else {
            $scope.emailValid = true;
            $scope.emailFomart = true;
        }

        // Thông báo không được để trống
        if (
            !$scope.hovatenValid ||
            !$scope.sodienthoaiValid ||
            !$scope.emailValid ||
            !$scope.xaValid ||
            !$scope.huyenValid ||
            !$scope.thanhphoValid ||
            !$scope.diachiValid
        ) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin",
                icon: "error",
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        var checkslt = false;
        angular.forEach($scope.ghctcheckout, function (item) {
            if (item.soluong > item.soluongton) {
                checkslt = true;
                Swal.fire({
                    title: "Thông Báo",
                    text: "Số lượng tồn sản phẩm không đủ !",
                    icon: "warning",
                    showConfirmButton: false,
                    timer: 1800,
                })
            }
        });
        if (checkslt) {
            return;
        }

        if (IdTK !== null) {

            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (idghct !== null && $scope.tstbandau !== null) {
                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovatenkh: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachichitiet: $scope.diachi,
                            phuongxa: $scope.xa,
                            quanhuyen: $scope.huyen,
                            tinhthanh: $scope.thanhpho,
                            thanhtien: $scope.tongtatca,
                            tienkhachtra: $scope.tongtatca,
                            phuongthucthanhtoan: $scope.phuongthucthanhtoan,
                            idvoucher: $scope.idvoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            giohangchitietlist: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);

                        // Gửi dữ liệu POST đến Server
                        var url = "http://localhost:8080/api/ol/hoa-don/thanh-toan-login?idkh=" + IdTK;
                        $http.post(url, data)
                            .then(

                                function (resp) {
                                    // Lưu id hóa đơn lên LocalStorage
                                    $window.localStorage.setItem("idhoadon", resp.data.idhoadon);

                                    // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                    $window.localStorage.removeItem("idgiohang");
                                    $window.localStorage.removeItem("idvoucher");
                                    $window.localStorage.removeItem("mavoucher");
                                    $window.localStorage.removeItem("dieukientoithieuhoadon");
                                    $window.localStorage.removeItem("giatrigiam");
                                    $window.localStorage.removeItem("listghct");
                                    $window.localStorage.removeItem("tongsotien");
                                    $window.localStorage.removeItem("hinhthucgiam");;

                                    // Gọi hàm congTTVNPay() để tạo cổng thanh toán
                                    $scope.congTTVNPay($scope.tongtatca);

                                },

                                function (eror) {
                                    // Xử lý lỗi nếu có
                                }
                            );
                    }
                } else {
                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }
            });

        } else {

            // Thanh Toán Không Đăng Nhập
            // Hiển thị Sweet Alert để xác nhận
            Swal.fire({
                title: "Xác nhận đặt hàng?",
                text: "Bạn có chắc chắn muốn đặt đơn hàng?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Đặt hàng",
                cancelButtonText: "Cancel",
            }).then((result) => {

                if (idghct !== null && $scope.tstbandau !== null) {
                    if (result.isConfirmed) {
                        // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                        var data = {
                            hovatenkh: $scope.hovaten,
                            sodienthoai: $scope.sodienthoai,
                            email: $scope.email,
                            diachichitiet: $scope.diachi,
                            phuongxa: $scope.xa,
                            quanhuyen: $scope.huyen,
                            tinhthanh: $scope.thanhpho,
                            thanhtien: $scope.tongtatca,
                            tienkhachtra: $scope.tongtatca,
                            phuongthucthanhtoan: $scope.phuongthucthanhtoan,
                            idvoucher: $scope.idvoucher,
                            giatrigiam: $scope.giamGiaVoucher,
                            giohangchitietlist: gioHangChiTietList,
                        };

                        console.log("DATA ThanhToan : ", data);
                        // Gửi dữ liệu POST đến Server
                        $http({
                            method: "Post",
                            url: "http://localhost:8080/api/ol/hoa-don/thanh-toan-not-login",
                            data: data,
                        }).then(
                            function (resp) {
                                // Lưu id hóa đơn lên LocalStorage
                                $window.localStorage.setItem("idhoadon", resp.data.idhoadon);
                                // Lưu idkh đã tạo hoặc idkh mới tạo lên LocalStorage
                                $window.localStorage.setItem("idkhdataoandkhmoi", resp.data.idkhdataoandkhmoi);
                                // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
                                $window.localStorage.removeItem("idgiohang");
                                $window.localStorage.removeItem("idvoucher");
                                $window.localStorage.removeItem("mavoucher");
                                $window.localStorage.removeItem("dieukientoithieuhoadon");
                                $window.localStorage.removeItem("giatrigiam");
                                $window.localStorage.removeItem("listghct");
                                $window.localStorage.removeItem("tongsotien");
                                $window.localStorage.removeItem("hinhthucgiam");
                                // Gọi hàm congTTVNPay() để tạo cổng thanh toán
                                $scope.congTTVNPay($scope.tongtatca);
                            },
                            function (eror) {
                                // Xử lý lỗi nếu có
                            }
                        );
                    }
                } else {
                    console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
                }
            });
        }
    }
    // Tạo Cổng Thanh Toán VNPay
    $scope.congTTVNPay = function (tongTienAmout) {
        $http
            .post(
                "http://localhost:8080/api/ol/vnpay/payment?tongtienamout=" +
                tongTienAmout
            )
            .then(function (response) {
                $window.location.href = response.data.url;
                console.log("URL :", response.data.url);
            });
    };

    // Lưu Giá trị từ cổng thanh toán trả ra url
    $scope.queryParams = $location.search();
    console.log("Query :", $scope.queryParams);
    // Lấy giá trị của tham số từ url congTTVNPay trả ra
    $scope.amountVNPayParamValue = $scope.queryParams.vnp_Amount;
    console.log("amountVNPayParamValue :", $scope.amountVNPayParamValue);
    $scope.maGiaoDinh = $scope.queryParams.vnp_TxnRef;
    console.log("maGiaoDinh :", $scope.maGiaoDinh);
    $scope.tienCuoiCungVnPay = $scope.amountVNPayParamValue / 100;
    console.log("tienCuoiCungVnPay :", $scope.tienCuoiCungVnPay);

    // Lấy idhoadon sau khi đã tạo hoadon ở hàm thanhToanVNPay
    var idhoadon = $window.localStorage.getItem("idhoadon");
    console.log("Đây là id hóa đơn " + idhoadon);

    // TODO: thanh toán chuyển khoản
    // Lấy idkh không đăng nhập đã tạo hoặc vừa mới tạo từ localstorage
    var idkhnotlogin = localStorage.getItem("idkhdataoandkhmoi");
    var idkhachhang = IdTK != null ? IdTK : idkhnotlogin;
    if (idkhachhang == null || idkhachhang == undefined) {
        idkhachhang = "";
    }
    $scope.taoHTTTVNPay = function () {
        var datahttt = {
            email: $scope.email,
            sodienthoai: $scope.sodienthoai
        }
        var url = "http://localhost:8080/api/ol/hoa-don/hinh-thuc-tt/vn-pay?idhoadon=" + idhoadon + "&sotientra=" + $scope.tienCuoiCungVnPay + "&magiaodinh=" + $scope.maGiaoDinh
            + "&idkh=" + idkhachhang
        $http
            .post(url, datahttt)
            .then(function (response) {
                console.log("HTTT DaTa :", response.data);
                $window.localStorage.removeItem("idkhdataoandkhmoi");
            });
    };

    var taoHTTTVNPayCalled = false;
    // Check Nếu magiaodich and tiencuoicung != null thì k chạy
    if (
        $scope.maGiaoDinh != null &&
        $scope.tienCuoiCungVnPay != null &&
        !taoHTTTVNPayCalled
    ) {
        console.log("Có vào đây không");
        $scope.taoHTTTVNPay();
        taoHTTTVNPayCalled = true;
        $window.localStorage.removeItem("idhoadon");
    }

});