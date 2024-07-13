var app = angular.module("app", []);
app.controller('thongtindonhangcontroller', function ($scope, $http, $window) {

    var idkh = localStorage.getItem("idtk");
    $scope.selectedTrangThai = null;

    // Load thông tin hóa đơn của khách hàng
    $scope.LoadTTHoaDonKhachHang = function (trangthai) {
        $scope.selectedTrangThai = trangthai;
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/load-hoa-don?idkh=' + idkh + '&trangthai=' + trangthai;
            $http.get(url).then(resp => {
                $scope.ttHoaDon = resp.data;
                console.log('Thông tin hóa đơn khách hàng :', $scope.ttHoaDon);
                // Lặp qua danh sách hóa đơn và load thông tin sản phẩm
                $scope.ttSPHoaDon = {};
                $scope.ttHoaDon.forEach(function (hoadon) {
                    $scope.LoadTTSPHoaDonKhachHang(hoadon.id);
                });
            }).catch(error => {
                console.log("Lỗi load thông tin hóa đơn khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }

    // Load thông tin sản phẩm hóa đơn của khách hàng
    $scope.LoadTTSPHoaDonKhachHang = function (idhoadon) {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/load-san-pham?idhoadon=' + idhoadon;
            $http.get(url).then(resp => {
                // Thêm thông tin sản phẩm của hóa đơn vào đối tượng ttSPHoaDon
                $scope.ttSPHoaDon[idhoadon] = resp.data;
                console.log('Thông tin sản phẩm trong hóa đơn khách hàng:', $scope.ttSPHoaDon[idhoadon]);
            }).catch(error => {
                console.log("Lỗi load ttsp trong hóa đơn khách hàng:", error);
            });
        } else {
            console.log('Chưa đăng nhập!');
        }
    }

    // Tìm kiếm thông tin hóa đơn của khách hàng theo tennguoinhan, tensanpham, mahoadon
    $scope.TimKiemTTHoaDonKhachHang = function(){
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/thong-tin/hoa-don-khach-hang/tim-kiem-hoa-don?idkh=' + idkh + '&keyword=' + $scope.keyword + '&trangthai='+ $scope.selectedTrangThai;
            $http.get(url).then(resp => {
                $scope.ttHoaDon = resp.data;
                console.log('Tìm kiếm thông tin hóa đơn khách hàng :', $scope.ttHoaDon);
            }).catch(error => {
                console.log("Lỗi tìm thông tin hóa đơn khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }

    $scope.ViewDonHangChiTiet = function(idhoadon) {
        $window.location.href = '/src/user/pages/DonHangCT.html?id=' + idhoadon;
    };
})