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
                localStorage.setItem("tongsotien",$scope.tongSoTien.tongsotien);
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
    $scope.vouCherApDung = function (){

            var tstbandau = parseFloat(localStorage.getItem("tongsotien"));
            var dieukientoithieuhoadon = parseFloat(localStorage.getItem("dieukientoithieuhoadon"));
            if(tstbandau >= dieukientoithieuhoadon){
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
            }else{
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
            $scope.idvoucher = '11111111-1111-1111-1111-1111111111';
        } else {
            // Ngược lại, gán giá trị mới từ localStorage
            $scope.idvoucher = newIdVoucher;
            console.log("IdVoucher mới đang áp dụng :", $scope.idvoucher);
        }
    });
   

    

    

    

    // // Khai báo biến để lưu các giá trị đã binding
    // $scope.hovaten = "";
    // $scope.sodienthoai = "";
    // $scope.email = "";
    // $scope.diachi = "";
    // $scope.tinh = "";
    // $scope.huyen = "";
    // $scope.xa = "";
    // $scope.phuongThucThanhToan = 1;
    // $scope.tongTien = 0; // Để tránh lỗi nếu không có giá trị tổng tiền
    // $scope.tienKhachTra = 0; // Để tránh lỗi nếu không có giá trị tiền khách trả
    // $scope.gioHangChiTietList = [];


    // var idctsp = $window.localStorage.getItem("listCart");

    // if (idctsp !== null) {

    //     var gioHangChiTietList = idctsp.split(",");
    //     console.log("IDCTSP :", gioHangChiTietList);

    // } else {
    //     console.log("K thấy IdCTSP");
    //     // loadcheckout();
    //     // loadTongSoTien();
    // }


    // // Lấy giá trị tổng tiền từ localStorage
    // var tongSoTien = parseFloat($window.localStorage.getItem("tongsotien"));
    // console.log('TST LocalStrore :', tongSoTien);

    // // Lấy accessToken trên localSotrage
    // var token = localStorage.getItem("accessToken")
    // console.log("ToKen :", token);

    // // Nếu có token gửi header lên sever để tìm kiếm thông tin người dùng
    // if (token) {
    //     // Nếu có token, gọi API để lấy thông tin khách hàng
    //     var apiEndpoint = "http://localhost:8080/api/thong-tin/tim-kiem/nguoi-dung";
    //     var apiAddress = "http://localhost:8080/api/thong-tin/dia-chi/hien-thi";
    //     var config = {
    //         headers: {
    //             Authorization: "Bearer " + token,
    //         },
    //     };

    //     $http.get(apiEndpoint, config).then(
    //         function (response) {
    //             console.log("DaTa Token :", response.data);
    //             // Lấy thông tin từ server và gán vào các biến $scope
    //             $scope.hovaten = response.data.hovaten;
    //             $scope.email = response.data.email;
    //             $scope.sodienthoai = response.data.sodienthoai;

    //             // Gọi API địa chỉ
    //             $http.get(apiAddress, config).then(
    //                 function (diachiReponse) {
    //                     $scope.diachiND = diachiReponse.data;
    //                     console.log("DaTa DCND :", $scope.diachiND);
    //                     // Lọc các địa chỉ có trạng thái là 1
    //                     $scope.filteredAddresses = diachiReponse.data.filter(function (address) {
    //                         return address.trangthai === "1";
    //                     });

    //                     // Lấy địa chỉ đầu tiên từ danh sách đã lọc và gán vào $scope.diaChi
    //                     $scope.diachi =
    //                         $scope.filteredAddresses.length > 0
    //                             ? $scope.filteredAddresses[0].diachi
    //                             : "";
    //                 },
    //                 function (diaChiError) {
    //                     console.error("Lỗi khi gọi API địa chỉ: " + diaChiError);
    //                 }
    //             );
    //         },
    //         function (error) {
    //             console.error("Lỗi khi gọi API thông tin cá nhân: " + error);
    //         }
    //     );
    // }


    // // Hàm xử lý khi người dùng click nút "Đặt Hàng"
    // // ---------- Thanh Toán Khi Nhận Hàng ---------- //
    // $scope.hovatenValid = true;
    // $scope.sodienthoaiValid = true;
    // $scope.emailValid = true;
    // $scope.diachiValid = true;
    // $scope.sodienthoaiFomart = true;
    // $scope.emailFomart = true;

    // var sdtRegex = /^(0[2-9]{1}\d{8,9})$/;
    // var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // $scope.thanhToan = function () {

    //     // Check trống họ và tên
    //     if (!$scope.hovaten) {
    //         $scope.hovatenValid = false;
    //     } else {
    //         $scope.hovatenValid = true;
    //     }

    //     // Check trống địa chỉ
    //     if (!$scope.diachi) {
    //         $scope.diachiValid = false;
    //     } else {
    //         $scope.diachiValid = true;
    //     }

    //     // Check trống số điện thoại và định dạng sdt
    //     if (!$scope.sodienthoai) {
    //         $scope.sodienthoaiValid = false;

    //     } else if (!sdtRegex.test($scope.sodienthoai)) {
    //         $scope.sodienthoaiValid = true;
    //         $scope.sodienthoaiFomart = false;
    //         return;
    //     } else {
    //         $scope.hovatenValid = true;
    //         $scope.sodienthoaiFomart = true;
    //     }

    //     // Check trống email và định dạng email
    //     if (!$scope.email) {
    //         $scope.emailValid = false;
    //     } else if (!emailRegex.test($scope.email)) {
    //         $scope.emailValid = true;
    //         $scope.emailFomart = false;
    //         return;
    //     } else {
    //         $scope.emailValid = true;
    //         $scope.emailFomart = true;
    //     }

    //     // Thông báo không được để trống
    //     if (
    //         !$scope.hovatenValid ||
    //         !$scope.sodienthoaiValid ||
    //         !$scope.emailValid ||
    //         !$scope.diachiValid
    //     ) {
    //         Swal.fire({
    //             title: "Warning",
    //             text: "Vui lòng điền đủ thông tin",
    //             icon: "error",
    //             showConfirmButton: false,
    //             timer: 1500,
    //         });
    //         return;
    //     }


    //     if (IdTK !== null) {

    //         // Hiển thị Sweet Alert để xác nhận
    //         Swal.fire({
    //             title: "Xác nhận đặt hàng?",
    //             text: "Bạn có chắc chắn muốn đặt đơn hàng?",
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#d33",
    //             cancelButtonColor: "#3085d6",
    //             confirmButtonText: "Đặt hàng",
    //             cancelButtonText: "Cancel",
    //         }).then((result) => {

    //             if (idctsp !== null && tongSoTien !== null) {


    //                 if (result.isConfirmed) {
    //                     // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
    //                     var data = {
    //                         hovaten: $scope.hovaten,
    //                         sodienthoai: $scope.sodienthoai,
    //                         email: $scope.email,
    //                         diachi: $scope.diachi,
    //                         tinh: $('#province option:selected').text(),
    //                         huyen: $('#district option:selected').text(),
    //                         xa: $('#ward option:selected').text(),
    //                         phuongThucThanhToan: $scope.phuongThucThanhToan,
    //                         idvoucher: $scope.idVoucher,
    //                         giatrigiam: $scope.giamGiaVoucher,
    //                         tongTien: $scope.tongCong,
    //                         tienKhachTra: $scope.tienKhachTra,
    //                         gioHangChiTietList: gioHangChiTietList,
    //                     };

    //                     console.log("DATA ThanhToan : ", data);

    //                     // Gửi dữ liệu POST đến Server
    //                     $http.post("http://localhost:8080/api/hoa-don/thanh-toan/dang-nhap", data, config)
    //                         .then(

    //                             function (resp) {

    //                                 // Chuyển hướng người dùng đến trang thanh toán thành công 
    //                                 function reload() {
    //                                     $window.location.reload();
    //                                     // $window.location.reload();
    //                                 }

    //                                 $location.path('/thanhyou');
    //                                 $timeout(reload, 100);

    //                                 // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
    //                                 $window.localStorage.removeItem("idgiohang");
    //                                 $window.localStorage.removeItem("idVoucher");
    //                                 $window.localStorage.removeItem("maVoucher");
    //                                 $window.localStorage.removeItem("giatritoithieuhoadon");
    //                                 $window.localStorage.removeItem("giatrigiam");
    //                                 $window.localStorage.removeItem("listCart");
    //                                 $window.localStorage.removeItem("tongsotien");
    //                                 $window.localStorage.removeItem("hinhthucgiam");

    //                             },

    //                             function (eror) {
    //                                 // Xử lý lỗi nếu có
    //                             }


    //                         );
    //                 }
    //             } else {

    //                 console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
    //             }

    //         });

    //     } else {

    //         // Thanh Toán Không Đăng Nhập
    //         // Hiển thị Sweet Alert để xác nhận
    //         Swal.fire({
    //             title: "Xác nhận đặt hàng?",
    //             text: "Bạn có chắc chắn muốn đặt đơn hàng?",
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#d33",
    //             cancelButtonColor: "#3085d6",
    //             confirmButtonText: "Đặt hàng",
    //             cancelButtonText: "Cancel",
    //         }).then((result) => {

    //             if (idctsp !== null && tongSoTien !== null) {


    //                 if (result.isConfirmed) {
    //                     // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
    //                     var data = {
    //                         hovaten: $scope.hovaten,
    //                         sodienthoai: $scope.sodienthoai,
    //                         email: $scope.email,
    //                         diachi: $scope.diachi,
    //                         tinh: $('#province option:selected').text(),
    //                         huyen: $('#district option:selected').text(),
    //                         xa: $('#ward option:selected').text(),
    //                         phuongThucThanhToan: $scope.phuongThucThanhToan,
    //                         idvoucher: $scope.idVoucher,
    //                         giatrigiam: $scope.giamGiaVoucher,
    //                         tongTien: $scope.tongCong,
    //                         tienKhachTra: $scope.tienKhachTra,
    //                         gioHangChiTietList: gioHangChiTietList,
    //                     };

    //                     console.log("DATA ThanhToan : ", data);

    //                     // Gửi dữ liệu POST đến Server
    //                     $http({
    //                         method: "Post",
    //                         url: "http://localhost:8080/api/hoa-don/thanh-toan",
    //                         data: data,
    //                     }).then(

    //                         function (resp) {

    //                             // Chuyển hướng người dùng đến trang thanh toán thành công 
    //                             function reload() {
    //                                 $window.location.reload();
    //                                 // $window.location.reload();
    //                             }

    //                             $location.path('/thanhyou');
    //                             $timeout(reload, 100);

    //                             // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
    //                             $window.localStorage.removeItem("idgiohang");
    //                             $window.localStorage.removeItem("idVoucher");
    //                             $window.localStorage.removeItem("maVoucher");
    //                             $window.localStorage.removeItem("giatritoithieuhoadon");
    //                             $window.localStorage.removeItem("giatrigiam");
    //                             $window.localStorage.removeItem("listCart");
    //                             $window.localStorage.removeItem("tongsotien");
    //                             $window.localStorage.removeItem("hinhthucgiam");

    //                         },

    //                         function (eror) {
    //                             // Xử lý lỗi nếu có
    //                         }


    //                     );
    //                 }
    //             } else {

    //                 console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
    //             }

    //         });

    //     }

    // }

    // // ---------- Thanh Toán VNPay ---------- //
    // $scope.thanhToanVNPay = function () {

    //     // Check trống họ và tên
    //     if (!$scope.hovaten) {
    //         $scope.hovatenValid = false;
    //     } else {
    //         $scope.hovatenValid = true;
    //     }

    //     // Check trống địa chỉ
    //     if (!$scope.diachi) {
    //         $scope.diachiValid = false;
    //     } else {
    //         $scope.diachiValid = true;
    //     }

    //     // Check trống số điện thoại và định dạng sdt
    //     if (!$scope.sodienthoai) {
    //         $scope.sodienthoaiValid = false;

    //     } else if (!sdtRegex.test($scope.sodienthoai)) {
    //         $scope.sodienthoaiValid = true;
    //         $scope.sodienthoaiFomart = false;
    //         return;
    //     } else {
    //         $scope.hovatenValid = true;
    //         $scope.sodienthoaiFomart = true;
    //     }

    //     // Check trống email và định dạng email
    //     if (!$scope.email) {
    //         $scope.emailValid = false;
    //     } else if (!emailRegex.test($scope.email)) {
    //         $scope.emailValid = true;
    //         $scope.emailFomart = false;
    //         return;
    //     } else {
    //         $scope.emailValid = true;
    //         $scope.emailFomart = true;
    //     }

    //     // Thông báo không được để trống
    //     if (
    //         !$scope.hovatenValid ||
    //         !$scope.sodienthoaiValid ||
    //         !$scope.emailValid ||
    //         !$scope.diachiValid
    //     ) {
    //         Swal.fire({
    //             title: "Warning",
    //             text: "Vui lòng điền đủ thông tin",
    //             icon: "error",
    //             showConfirmButton: false,
    //             timer: 1500,
    //         });
    //         return;
    //     }

    //     if (IdTK !== null) {

    //         // Hiển thị Sweet Alert để xác nhận
    //         Swal.fire({
    //             title: "Xác nhận đặt hàng?",
    //             text: "Bạn có chắc chắn muốn đặt đơn hàng?",
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#d33",
    //             cancelButtonColor: "#3085d6",
    //             confirmButtonText: "Đặt hàng",
    //             cancelButtonText: "Cancel",
    //         }).then((result) => {

    //             if (idctsp !== null && tongSoTien !== null) {


    //                 if (result.isConfirmed) {
    //                     // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
    //                     var data = {
    //                         hovaten: $scope.hovaten,
    //                         sodienthoai: $scope.sodienthoai,
    //                         email: $scope.email,
    //                         diachi: $scope.diachi,
    //                         tinh: $('#province option:selected').text(),
    //                         huyen: $('#district option:selected').text(),
    //                         xa: $('#ward option:selected').text(),
    //                         phuongThucThanhToan: $scope.phuongThucThanhToan,
    //                         idvoucher: $scope.idVoucher,
    //                         giatrigiam: $scope.giamGiaVoucher,
    //                         tongTien: $scope.tongCong,
    //                         tienKhachTra: $scope.tongCong,
    //                         gioHangChiTietList: gioHangChiTietList,
    //                     };

    //                     console.log("DATA ThanhToan : ", data);

    //                     // Gửi dữ liệu POST đến Server
    //                     $http.post("http://localhost:8080/api/hoa-don/thanh-toan/dang-nhap", data, config)
    //                         .then(

    //                             function (resp) {
    //                                 // Lưu id hóa đơn lên LocalStorage
    //                                 $window.localStorage.setItem("idHoaDonLogin", resp.data.idhoadon);

    //                                 // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
    //                                 $window.localStorage.removeItem("idgiohang");
    //                                 $window.localStorage.removeItem("idVoucher");
    //                                 $window.localStorage.removeItem("maVoucher");
    //                                 $window.localStorage.removeItem("giatritoithieuhoadon");
    //                                 $window.localStorage.removeItem("giatrigiam");
    //                                 $window.localStorage.removeItem("listCart");
    //                                 $window.localStorage.removeItem("tongsotien");
    //                                 $window.localStorage.removeItem("hinhthucgiam");

    //                                 // Gọi hàm congTTVNPay() để tạo cổng thanh toán
    //                                 $scope.congTTVNPay($scope.tongCong);

    //                             },

    //                             function (eror) {
    //                                 // Xử lý lỗi nếu có
    //                             }


    //                         );
    //                 }
    //             } else {

    //                 console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
    //             }

    //         });

    //     } else {

    //         // Thanh Toán Không Đăng Nhập
    //         // Hiển thị Sweet Alert để xác nhận
    //         Swal.fire({
    //             title: "Xác nhận đặt hàng?",
    //             text: "Bạn có chắc chắn muốn đặt đơn hàng?",
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonColor: "#d33",
    //             cancelButtonColor: "#3085d6",
    //             confirmButtonText: "Đặt hàng",
    //             cancelButtonText: "Cancel",
    //         }).then((result) => {

    //             if (idctsp !== null && tongSoTien !== null) {


    //                 if (result.isConfirmed) {
    //                     // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
    //                     var data = {
    //                         hovaten: $scope.hovaten,
    //                         sodienthoai: $scope.sodienthoai,
    //                         email: $scope.email,
    //                         diachi: $scope.diachi,
    //                         tinh: $('#province option:selected').text(),
    //                         huyen: $('#district option:selected').text(),
    //                         xa: $('#ward option:selected').text(),
    //                         phuongThucThanhToan: $scope.phuongThucThanhToan,
    //                         idvoucher: $scope.idVoucher,
    //                         giatrigiam: $scope.giamGiaVoucher,
    //                         tongTien: $scope.tongCong,
    //                         tienKhachTra: $scope.tongCong,
    //                         gioHangChiTietList: gioHangChiTietList,
    //                     };

    //                     console.log("DATA ThanhToan : ", data);

    //                     // Gửi dữ liệu POST đến Server
    //                     $http({
    //                         method: "Post",
    //                         url: "http://localhost:8080/api/hoa-don/thanh-toan",
    //                         data: data,
    //                     }).then(

    //                         function (resp) {

    //                             // Lưu id hóa đơn lên LocalStorage
    //                             $window.localStorage.setItem("idHoaDonLogin", resp.data.idhoadon);
    //                             // Sau khi thanh toán thành công xáo hết dữ liệu trên localStorage
    //                             $window.localStorage.removeItem("idgiohang");
    //                             $window.localStorage.removeItem("idVoucher");
    //                             $window.localStorage.removeItem("maVoucher");
    //                             $window.localStorage.removeItem("giatritoithieuhoadon");
    //                             $window.localStorage.removeItem("giatrigiam");
    //                             $window.localStorage.removeItem("listCart");
    //                             $window.localStorage.removeItem("tongsotien");
    //                             $window.localStorage.removeItem("hinhthucgiam");

    //                             // Gọi hàm congTTVNPay() để tạo cổng thanh toán
    //                             $scope.congTTVNPay($scope.tongCong);


    //                         },

    //                         function (eror) {
    //                             // Xử lý lỗi nếu có
    //                         }


    //                     );
    //                 }
    //             } else {

    //                 console.log("Chưa Tìm Thấy IDCTSP Và SoLuong");
    //             }

    //         });

    //     }


    // }

    // // Tạo Cổng Thanh Toán VNPay
    // $scope.congTTVNPay = function (tongTienAmout) {
    //     $http
    //         .post(
    //             "http://localhost:8080/api/payment/vnpay?tongTienAmout=" +
    //             tongTienAmout
    //         )
    //         .then(function (response) {
    //             $window.location.href = response.data.url;
    //             console.log("URL :", response.data.url);
    //         });
    // };

    // // Lưu Giá trị từ cổng thanh toán trả ra url
    // $scope.queryParams = $location.search();
    // console.log("Query :", $scope.queryParams);
    // // Lấy giá trị của tham số từ url congTTVNPay trả ra
    // $scope.amountVNPayParamValue = $scope.queryParams.vnp_Amount;
    // console.log("amountVNPayParamValue :", $scope.amountVNPayParamValue);
    // $scope.maGiaoDinh = $scope.queryParams.vnp_TxnRef;
    // console.log("maGiaoDinh :", $scope.maGiaoDinh);
    // $scope.tienCuoiCungVnPay = $scope.amountVNPayParamValue / 100;
    // console.log("tienCuoiCungVnPay :", $scope.tienCuoiCungVnPay);

    // // Lấy idhoadon sau khi đã tạo hoadon ở hàm thanhToanVNPay
    // var idHoaDonLogin = $window.localStorage.getItem("idHoaDonLogin");
    // console.log("Đây là id hóa đơn " + idHoaDonLogin);

    // // TODO: thanh toán chuyển khoản
    // $scope.taoHTTTVNPay = function () {
    //     $http
    //         .post(
    //             "http://localhost:8080/api/hoa-don/hinh-thuc-tt/vn-pay?idhoadon=" + idHoaDonLogin + "&sotientra=" + $scope.tienCuoiCungVnPay + "&magiaodinh=" + $scope.maGiaoDinh
    //         )
    //         .then(function (response) {
    //             console.log("HTTT DaTa :", response.data);
    //         });
    // };


    // var taoHTTTVNPayCalled = false;
    // // Check Nếu magiaodich and tiencuoicung != null thì k chạy
    // if (
    //     $scope.maGiaoDinh != null &&
    //     $scope.tienCuoiCungVnPay != null &&
    //     !taoHTTTVNPayCalled
    // ) {
    //     console.log("Có vào đây không");
    //     $scope.taoHTTTVNPay();
    //     taoHTTTVNPayCalled = true;
    //     $window.localStorage.removeItem("idHoaDonLogin");
    // }




});