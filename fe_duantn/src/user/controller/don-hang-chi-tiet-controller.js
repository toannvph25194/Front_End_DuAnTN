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
                console.log("Lỗi fin hóa đơn chi tiết khách hàng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.FindTTHoaDonCTKhachHang();

//     SELECT httt.MaGiaoDich, httt.TrangThai, httt.SoTienTra, httt.NgayThanhToan, httt.HinhThucThanhToan, httt.GhiChu, nv.HoVaTenNV FROM HinhThucThanhToan httt
// LEFT JOIN NhanVien nv on nv.Id = httt.IdNV
// Where httt.IdHD = 'FB20CAF5-E188-4860-BEFC-7A46C41D9F72'
})