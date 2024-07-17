var app = angular.module("app", []);
app.controller('donhangchitietcontroller', function ($scope, $http, $location, $window) {

    var idhoadon = new URLSearchParams(window.location.search).get('id');
    console.log("idhoadon : ", idhoadon);

    var idkh = localStorage.getItem("idtk");
    $scope.selectedTrangThai = null;

    // Find thông tin hóa đơn chi tiết của khách hàng
    $scope.FindTTHoaDonCTKhachHang = function () {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/find-hoa-don/chi-tiet?idhoadon=' + idhoadon;
            $http.get(url).then(resp => {
                $scope.ttHoaDonCT = resp.data;
                console.log('Find thông tin hóa đơn chi tiết khách hàng :', $scope.ttHoaDonCT);
            }).catch(error => {
                console.log("Lỗi find hóa đơn chi tiết khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.FindTTHoaDonCTKhachHang();

    // Find thông tin hình thức thanh toán của khách hàng
    $scope.FindTTHinhThucTTKhachHang = function () {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/find-hinh-thuc/thanh-toan?idhoadon=' + idhoadon;
            $http.get(url).then(resp => {
                $scope.ttHTTT = resp.data;
                console.log('Find thông tin httt khách hàng :', $scope.ttHTTT);
                $scope.ttHTTT.forEach(item => {
                    if (item.ngaythanhtoan) {
                        let date = new Date(item.ngaythanhtoan);
                        item.ngaythanhtoan = date.toLocaleString('vi-VN');
                    }
                });
            }).catch(error => {
                console.log("Lỗi find thông tin httt khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.FindTTHinhThucTTKhachHang();

    // Find thông tin sản phẩm trong hdct của khách hàng
    $scope.FindTTSPHDCTKhachHang = function () {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/find-san-pham-hdct?idhoadon=' + idhoadon;
            $http.get(url).then(resp => {
                $scope.ttSPHDCT = resp.data;
                console.log('Find thông tin sp hdct khách hàng :', $scope.ttSPHDCT);
                // Tính tổng số tiền sản phẩm
                $scope.tongsotiensp = $scope.ttSPHDCT.reduce((total, sp) => {
                    var donGia = sp.dongiakhigiam !== null ? sp.dongiakhigiam : sp.dongia;
                    return total + (donGia * sp.soluong);
                }, 0);
            }).catch(error => {
                console.log("Lỗi find thông tin httt khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.FindTTSPHDCTKhachHang();

    // Find thông tin lịch sử ngày của hóa đơn khách hàng
    $scope.FinTTLichSuNgayHDKhachHang = function () {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/find-lich-su-ngay?idhoadon=' + idhoadon;
            $http.get(url).then(resp => {
                $scope.ttLichSuHD = resp.data;
                console.log('Find thông tin lịch sử ngày hóa của đơn khách hàng :', $scope.ttLichSuHD);
                // Định dạng ngày
                function formatDateField(fieldName) {
                    if ($scope.ttLichSuHD[fieldName]) {
                        let date = new Date($scope.ttLichSuHD[fieldName]);
                        $scope.ttLichSuHD[fieldName] = date.toLocaleString('vi-VN');
                    }
                }
                // Gọi hàm formatDateField cho các trường ngày tháng cần định dạng
                formatDateField('ngaytao');
                formatDateField('ngayxacnhan');
                formatDateField('ngaychogiaohang');
                formatDateField('ngaygiaohang');
                formatDateField('ngaynhanhang');
            }).catch(error => {
                console.log("Lỗi find thông tin lịch sử ngày của hóa đơn khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.FinTTLichSuNgayHDKhachHang();

    // Xử lý khách hàng hủy đơn hàng online
    $scope.HuyDonHangKhacHang = function () {
        Swal.fire({
            title: "Xác Nhận",
            text: "Bạn có muốn hủy đơn hàng không ?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy Bỏ",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác Nhận",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                if (idkh != null) {
                    var httt = $scope.ttHTTT.some(tt => tt.hinhthucthanhtoan === 1);
                    if (httt) {
                        var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/huy-don-hang-online?idhoadon=' + idhoadon;
                        $http.put(url).then(resp => {
                            $scope.huyDonHang = resp.data;
                            console.log('Khách hàng hủy đơn hàng online thành công !', $scope.huyDonHang);
                            Swal.fire({
                                title: "Thành Công",
                                text: "Đơn hàng của bạn đã hủy thành công !",
                                icon: "success",
                                position: "top-end",
                                toast: true,
                                showConfirmButton: false,
                                timer: 2000,
                            });
                            setTimeout(function () {
                                window.location.href = '/src/user/pages/DonHang.html';
                            }, 1500);
                        }).catch(error => {
                            console.log("Lỗi khách hàng hủy đơn hàng online", error);
                        });

                    } else {
                        Swal.fire({
                            title: "Thông Báo Hủy Đơn",
                            html: ` <ul style='text-align: left;'>
                                        <li><span style='color : #FF5733;'>*</span> Bạn đã thanh toán đơn hàng.</li>
                                        <li><span style='color : #FF5733;'>*</span> Nếu bạn muốn hủy đơn hàng, hãy liên hệ với shop để xác nhận !</li>
                                        <li><span style='color : #FF5733;'>*</span> Thông tin liên hệ : </li>
                                        <ul>
                                            <li>
                                                <span style='color : #FF5733;'>-</span> <strong>Email</strong> : 2thshoppoly@gmail.com
                                            </li>
                                            <li> 
                                                <span style='color : #FF5733;'>-</span> <strong>SĐT</strong> : 0982544290
                                            </li>
                                        </ul>
                                    </ul>
                                  `,
                            icon: "warning",
                            showConfirmButton: true,
                            confirmButtonText: "OK",
                            confirmButtonColor: "#FF5733"
                        });
                    }

                } else {
                    console.log("Chưa đăng nhập !");
                }
            }
        });
    }
})