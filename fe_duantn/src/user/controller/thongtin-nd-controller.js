var app = angular.module("app", []);
app.controller('thongtinndController', function ($scope, $http, $window) {

    $scope.chinhsua = false;

    var idkh = localStorage.getItem("idtk");
    console.log("idkh : ", idkh);

    // finby thông tin tài khoản
    $scope.finByTaiKhoanND = function () {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/check-out/thong-tin-nguoi-dung/fin-thong-tin?idkh=' + idkh;
            $http.get(url).then(resp => {
                $scope.ttTaiKhoan = resp.data;
                $scope.ttTaiKhoan.ngaysinh = new Date(resp.data.ngaysinh)
                console.log('Thông tin Tài khoản :', $scope.ttTaiKhoan);
            }).catch(error => {
                console.log("Lỗi finBy thông tin tài khoản người dùng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.finByTaiKhoanND();

    // finby địa chỉ tài khoản
    $scope.finByDiaChiTaiKhoanND = function () {
        if (idkh !== null) {
            var url = 'http://localhost:8080/api/ol/check-out/dia-chi-nguoi-dung/fin-dia-chi?idkh=' + idkh;
            $http.get(url).then(resp => {
                $scope.dcTaiKhoan = resp.data;
                console.log('Địa chỉ tài khoản :', $scope.dcTaiKhoan);
            }).catch(error => {
                console.log("Lỗi finBy địa chỉ tài khoản người dùng :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }
    $scope.finByDiaChiTaiKhoanND();

    // hủy cập nhật
    $scope.isHuy = function () {
        $scope.chinhsua = false;
        $scope.finByTaiKhoanND();
    }

    // update trạng thái mặc định của ghi chú ghi chú 
    $scope.updateTrangThaiDC = function (iddiachi) {
        var taikhoan = $scope.ttTaiKhoan.taikhoan;
        if (idkh != null) {
            var url = 'http://localhost:8080/api/ol/check-out/dia-chi-nguoi-dung/update-trang-thai?iddiachi=' + iddiachi + '&taikhoan=' + taikhoan;
            $http.put(url).then(resp => {
                $scope.diachimacdinh = resp.data;
                console.log('Địa chỉ mặc định :', $scope.diachimacdinh);
                Swal.fire({
                    title: "Thành công",
                    text: "Đã cập nhật địa chỉ thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                });
                // Tải lại trang sau 1.5 giây khi thông báo biến mất
                setTimeout(function () {
                    $window.location.reload();
                }, 1500);

            }).catch(error => {
                console.log("Lỗi update địa chỉ mặc định :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }
    }

    // update thông tin tài khoản 
    var sdtRegex = /^(0[2-9]{1}\d{8,9})$/;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    $scope.updateTTTaiKhoan = function () {
        // check trống các trường thuộc tính
        if (!$scope.ttTaiKhoan.hovatenkh || !$scope.ttTaiKhoan.sodienthoai || !$scope.ttTaiKhoan.email || !$scope.ttTaiKhoan.ngaysinh) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin",
                icon: "warning",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
        // check định dạng số điện thoai 
        if (!sdtRegex.test($scope.ttTaiKhoan.sodienthoai)) {
            Swal.fire({
                title: "Thông Báo",
                text: "Vui lòng kiểm tra định dạng số điện thoại",
                icon: "warning",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
        // check định dạng email
        if (!emailRegex.test($scope.ttTaiKhoan.email)) {
            Swal.fire({
                title: "Thông Báo",
                text: "Vui lòng kiểm tra định dạng email",
                icon: "warning",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }
        Swal.fire({
            title: "Xác Nhận",
            text: "Bạn có muốn cập nhật thông tin tài khoản không ?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy Bỏ",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác Nhận",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    idkh: idkh,
                    hovatenkh: $scope.ttTaiKhoan.hovatenkh,
                    email: $scope.ttTaiKhoan.email,
                    sodienthoai: $scope.ttTaiKhoan.sodienthoai,
                    ngaysinh: $scope.ttTaiKhoan.ngaysinh,
                    gioitinh: $scope.ttTaiKhoan.gioitinh
                }
                if (idkh != null) {
                    var url = 'http://localhost:8080/api/ol/check-out/thong-tin-nguoi-dung/update-thong-tin';
                    $http.put(url, data).then(resp => {
                        $scope.updatettnd = resp.data;
                        console.log('Update thông tin tài khoản :', $scope.updatettnd);

                        Swal.fire({
                            title: "Thành Công",
                            text: "Đã cập nhật thông tin tài khoản thành công",
                            icon: "success",
                            position: "top-end",
                            toast: true,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        $scope.finByTaiKhoanND();
                    }).catch(error => {
                        console.log("Lỗi update thông tin tài khoản :", error);
                    });
                } else {
                    console.log('Chưa đăng nhập !');
                }
            }
        })
    }

    // add địa chỉ tài khoản
    $scope.addDiaChiTK = function () {
        // check trống các trường thuộc tính
        if (!$scope.newphuongxa || !$scope.newquanhuyen || !$scope.newtinhthanh || !$scope.newdiachict) {
            Swal.fire({
                title: "Warning",
                text: "Vui lòng điền đủ thông tin",
                icon: "warning",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        Swal.fire({
            title: "Xác Nhận",
            text: "Bạn có muốn thêm thông địa chỉ mới không ?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy Bỏ",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác Nhận",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    idkh: idkh,
                    phuongxa: $scope.newphuongxa,
                    quanhuyen: $scope.newquanhuyen,
                    tinhthanh: $scope.newtinhthanh,
                    diachichitiet: $scope.newdiachict
                }
                if (idkh != null) {
                    var url = 'http://localhost:8080/api/ol/check-out/dia-chi-nguoi-dung/them-dia-chi';
                    $http.post(url, data).then(resp => {
                        $scope.adddiachi = resp.data;
                        console.log('Thêm mới địa chỉ tài khoản :', $scope.adddiachi);

                        Swal.fire({
                            title: "Thành Công",
                            text: "Thêm mới địa chỉ thành công",
                            icon: "success",
                            position: "top-end",
                            toast: true,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setTimeout(function () {
                            $window.location.reload();
                        }, 1500);
                    }).catch(error => {
                        console.log("Lỗi thêm mới địa chỉ tài khoản :", error);
                    });
                } else {
                    console.log('Chưa đăng nhập !');
                }
            }
        })
    }

    // getDetail địa chỉ tài khoản
    $scope.detailDiaChi = function (getDiaChi) {
        $scope.IdDCDetail = getDiaChi.id;
        $scope.hovatenkhDetail = getDiaChi.hovatenkh;
        $scope.phuongxaDetail = getDiaChi.phuongxa;
        $scope.quanhuyenDetail = getDiaChi.quanhuyen;
        $scope.tinhthanhDetail = getDiaChi.tinhthanh;
        $scope.diachictDetail = getDiaChi.diachichitiet;
    }

    // update địa chỉ tải khoản
    $scope.updateDiaChiTK = function () {
        // check trống các trường thuộc tính
        if (!$scope.phuongxaDetail || !$scope.quanhuyenDetail || !$scope.tinhthanhDetail || !$scope.diachictDetail) {
            Swal.fire({
                title: "Thông Báo",
                text: "Vui lòng điền đủ thông tin",
                icon: "warning",
                position: "top-end",
                toast: true,
                showConfirmButton: false,
                timer: 1500,
            });
            return;
        }

        Swal.fire({
            title: "Xác Nhận",
            text: "Bạn có muốn cập nhật địa chỉ không ?",
            icon: "question",
            showCancelButton: true,
            cancelButtonText: "Hủy Bỏ",
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Xác Nhận",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                var data = {
                    iddiachi: $scope.IdDCDetail,
                    phuongxa: $scope.phuongxaDetail,
                    quanhuyen: $scope.quanhuyenDetail,
                    tinhthanh: $scope.tinhthanhDetail,
                    diachichitiet: $scope.diachictDetail
                }
                if (idkh != null) {
                    var url = 'http://localhost:8080/api/ol/check-out/dia-chi-nguoi-dung/update-dia-chi';
                    $http.put(url, data).then(resp => {
                        $scope.updatediachi = resp.data;
                        console.log('Cập nhật địa chỉ tài khoản :', $scope.updatediachi);

                        Swal.fire({
                            title: "Thành Công",
                            text: "Cập nhật địa chỉ thành công",
                            icon: "success",
                            position: "top-end",
                            toast: true,
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setTimeout(function () {
                            $window.location.reload();
                        }, 1500);
                    }).catch(error => {
                        console.log("Lỗi cập nhập địa chỉ tài khoản :", error);
                    });
                } else {
                    console.log('Chưa đăng nhập !');
                }
            }
        })
    }

    // Đoạn mã xử lý lấy tên ảnh khi người dùng chọn file ảnh
    $scope.handleFileSelect = function (event) {
        const fileList = event.files;
        if (fileList.length > 0) {
            const selectedFile = fileList[0]; // Lấy tệp đầu tiên
            $scope.selectedImageName = selectedFile.name; // Lưu tên của tệp vào $scope
            console.log("Tên tệp đã chọn:", $scope.selectedImageName);
            $scope.uploadImageTK($scope.selectedImageName);
        }
    };

    // upload ảnh người dùng 
    $scope.uploadImageTK = function (imageupload) {
        var data = {
            idkh: idkh,
            image: imageupload,
        }
        if (idkh != null) {
            var url = 'http://localhost:8080/api/ol/check-out/thong-tin-nguoi-dung/upload-image';
            $http.put(url, data).then(resp => {
                $scope.uploadimage = resp.data;
                console.log('Upload ảnh tài khoản :', $scope.uploadimage);

                Swal.fire({
                    title: "Thành Công",
                    text: "Upload ảnh thành công",
                    icon: "success",
                    position: "top-end",
                    toast: true,
                    showConfirmButton: false,
                    timer: 1500,
                });
                setTimeout(function () {
                    $window.location.reload();
                }, 1500);
            }).catch(error => {
                console.log("Lỗi upload ảnh tài khoản :", error);
            });
        } else {
            console.log('Chưa đăng nhập !');
        }

    }
});