app.controller('productDetailController', function ($scope, $http, $window, $routeParams, $location, $route) {

    // Lấy Id Từ $RouteParams
    var idsanpham = $routeParams.id;
    console.log("IdSP :", idsanpham);

    // Lấy idtk từ localstorage 
    var idtaikoan = localStorage.getItem("idtk");
    console.log("IdTK :", idtaikoan);

    // Load top 4 spct new 
    $scope.getAllSPCTNew = function () {

        $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/load/san-pham-new')
            .then(function (response) {
                $scope.sanPhamNewCTSP = response.data;
                console.log('Data SP New CTSP :', $scope.sanPhamNewCTSP);
            })
            .catch(function (error) {
                console.error('Lỗi K Load được SP New !', error);
            });
    }
    $scope.getAllSPCTNew();

    // detail spct theo idsp 
    $scope.getDetailProduct = function () {

        $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/findbyid/san-pham?idsp=' + idsanpham)
            .then(function (response) {
                $scope.detailProduct = response.data;
                console.log('Data load SPCT :', $scope.detailProduct);
                $scope.loadListImageSP();
            })
            .catch(function (error) {
                console.error('Lỗi load spc !', error);
            });
    }

    $scope.getDetailProduct();

    // load list image sp
    $scope.loadListImageSP = function () {

        $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/load-list/image-san-pham?idsp=' + idsanpham)
            .then(function (response) {
                $scope.loadlistImgSP = response.data;
                $scope.selectedImage = $scope.detailProduct.imagedefaul;
                console.log('Data loadlist ImgSP :', $scope.loadlistImgSP);
            })
            .catch(function (error) {
                console.error('Lỗi load listImage !', error);
            });
    }

    // Click show ảnh
    $scope.selectImage = function (list) {
        if (list && list.tenimage) {
            $scope.selectedImage = list.tenimage;
        }
        else {
            console.error('Lỗi click show image !', list);
        }
    };

    // tính tổng số lượng tồn spct theo idsp
    $scope.getTongSoLuongSP = function () {

        $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/tong-so-luong-ton/san-pham?idsp=' + idsanpham)
            .then(function (response) {
                $scope.tongSoLuongTonSP = response.data;
                console.log('Tổng Số Lượng SP :', $scope.tongSoLuongTonSP);
            })
            .catch(function (error) {
                console.error('Lỗi K Load Tổng Số Lượng SP !', error);
            });
    }

    $scope.getTongSoLuongSP();


    // Load MauSac theo idsp
    $scope.loadMauSacByIdSP = function () {

        $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/load-mau-sac?idsp=' + idsanpham)
            .then(function (response) {
                $scope.detailMauSac = response.data;
                console.log('Load MauSac theo idsp :', $scope.detailMauSac);

                // Khởi tạo trạng thái isActive
                $scope.detailMauSac.forEach(function (mausac) {
                    mausac.isActive = false;
                });
            })
            .catch(function (error) {
                console.error('Lỗi Load Màu Sắc theo idsp !', error);
            });
    }
    $scope.loadMauSacByIdSP();

    // Load size theo idsp
    $scope.loadSizeByIdSP = function () {

        $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/load-size?idsp=' + idsanpham)
            .then(function (response) {
                $scope.detailSize = response.data;
                console.log('Load Size theo idsp :', $scope.detailSize);

                // Khởi tạo trạng thái isActive
                $scope.detailSize.forEach(function (size) {
                    size.isActive = false;
                });

                // Sắp xếp dữ liệu theo thứ tự mong muốn (S, M, L, XL, XXL)
                $scope.detailSize.sort(function (a, b) {
                    var sizesOrder = ['S', 'M', 'L', 'XL', 'XXL'];
                    return sizesOrder.indexOf(a.tensize) - sizesOrder.indexOf(b.tensize);
                });
            })
            .catch(function (error) {
                console.error('Lỗi Load size theo idsp !', error);
            });
    }
    $scope.loadSizeByIdSP();

    
    // FinByMauSac theo idsp và id size
    // Biến theo dõi màu sắc nếu chưa chọn size thì sẽ mở khóa màu sắc
    $scope.isSizeSelected = false;
    $scope.FinMauSacByIdSPAndIdSize = function (clickedSize) {

        // Tìm size được chọn trong list detailSize
        var selectedSize = $scope.detailSize.find(function (size) {
            return size === clickedSize;;
        });
        // Đảo trạng thái "isActive" của size được click vào
        selectedSize.isActive = !selectedSize.isActive;
        // Chỉ cho phép một size được chọn vào một thời điểm
        $scope.detailSize.forEach(function (s) {
            if (s !== selectedSize) {
                s.isActive = false;
            }
        });

        if (selectedSize && selectedSize.isActive) {
            var idsize = selectedSize.id;
            console.log('IdSize đang chọn để tìm kiếm màu sắc : ' + idsize);
            $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/finby-mau-sac?idsp=' + idsanpham + '&idsize=' + idsize)
                .then(function (response) {

                    // Lấy danh sách màu sắc từ server
                    var mauSacFromServer = response.data;
                    // Cập nhật trạng thái của màu sắc dựa trên dữ liệu nhận được
                    $scope.detailMauSac.forEach(function (ms) {
                        // Kiểm tra xem màu sắc có trong danh sách nhận được từ server không
                        var matchingColor = mauSacFromServer.find(function (availableMs) {
                            // Điều này có thể phụ thuộc vào cách bạn so sánh màu sắc
                            return availableMs.tenmausac === ms.tenmausac; 
                        });

                        // Cập nhật isSelectable của màu sắc. Nếu màu sắc nào có theo size thì sẽ không bị khóa
                        // ms.isAvailable = !!matchingColor;
                        ms.isSelectable = !!matchingColor;
                    });

                    // Đã chọn size thì sẽ khóa những màu sắc nào k có theo size
                    $scope.isSizeSelected = true;

                })
                .catch(function (error) {
                    console.error('Lỗi K thể tìm kiếm Màu Sắc !', error);
                });
        } else {
            $scope.detailMauSac.forEach(function (ms) {
                // Trả lại true. Mở khóa tất cả màu sắc
                ms.isSelectable = true;
            });
            console.error('Chưa chọn size !');
        }
    };


    // FinBySize theo idsp và id mausac
    // Biến theo dõi size nếu chưa chọn màu sắc thì sẽ mở khóa size
    $scope.isMauSacSelected = false;
    $scope.FinSizeByIdSPAndIdMauSac = function (clickedMS) {

        // Tìm mausac được chọn trong list detailMauSac
        var selectedMauSac = $scope.detailMauSac.find(function (mausac) {
            return mausac === clickedMS;;
        });
        // Đảo trạng thái "isActive" của mausac được click vào
        selectedMauSac.isActive = !selectedMauSac.isActive;
        // Chỉ cho phép một mausac được chọn vào một thời điểm
        $scope.detailMauSac.forEach(function (ms) {
            if (ms !== selectedMauSac) {
                ms.isActive = false;
            }
        });

        if (selectedMauSac && selectedMauSac.isActive) {
            var idmausac = selectedMauSac.id;
            console.log('IdMauSac đang chọn để tìm kiếm size :' + idmausac);
            $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/finby-size?idsp=' + idsanpham + '&idmausac=' + idmausac)
                .then(function (response) {

                    // Lấy danh sách size từ server
                    var sizeFromServer = response.data;
                    // Cập nhật trạng thái của size dựa trên dữ liệu nhận được
                    $scope.detailSize.forEach(function (s) {
                        // Kiểm tra xem size có trong danh sách nhận được từ server không
                        var matchingSize = sizeFromServer.find(function (availableS) {
                            // Điều này có thể phụ thuộc vào cách bạn so sánh size
                            return availableS.tensize === s.tensize; 
                        });

                        // Cập nhật isSelectable của size. Nếu size nào có theo mausac thì sẽ không bị khóa
                        // s.isAvailable = !!matchingSize;
                        s.isSelectable = !!matchingSize;
                    });

                    // Đã chọn mausac thì sẽ khóa những size nào k có theo màu sắc
                    $scope.isMauSacSelected = true;

                })
                .catch(function (error) {
                    console.error('Lỗi K thể tìm kiếm Size !', error);
                });
        } else {
            $scope.detailSize.forEach(function (s) {
                // Trả lại true. Mở khóa tất cả size
                s.isSelectable = true;
            });
            console.error('Chưa chọn mausac !');
        }
    };

    // finby idspct and soluongton theo idsp, idmausac và idsize
    // Khi chưa chọn màu sắc và size sẽ load tổng số lượng sản phẩm
    $scope.isSoLuongTonAndTongSoLuongSP = false;
    $scope.finByIdSPCTAndSoLuongTon = function () {

        // Tìm Màu Sắc được chọn
        var timKiemMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });
        // Tìm kiếm Size được chọn
        var timKiemSize = $scope.detailSize.find(function (s) {
            return s.isActive;
        });

        // Check Nếu màu sắc hoặc size chưa được chọn thì sẽ k tìm kiếm ra idctsp
        if (timKiemMauSac && timKiemSize) {

            // Nếu đã chọn màu sắc và size thì sẽ reset soluong tại ô inut về 1
            $scope.soluong = 1;
            // Khai báo biến lấy idmausac
            var idMauSac = timKiemMauSac.id;
            // Khai báo biến lấy idsize
            var idSize = timKiemSize.id;
            // Khi đã chọn màu sắc và size sẽ load số lượng sản phẩm theo màu sắc và size
            $scope.isSoLuongTonAndTongSoLuongSP = true;
            console.log('IdMauSac để tìm Idspct :', idMauSac);
            console.log('IdSize để tìm Idspct :', idSize);

            $http.get('http://localhost:8080/api/ol/san-pham-chi-tiet/finby-idspct-soluongton?idsp=' + idsanpham + '&idmausac=' + idMauSac + '&idsize=' + idSize)
                .then(function (response) {

                    $scope.chiTietSP = response.data;
                    console.log('Idspct và soluongton :', $scope.chiTietSP);
                })
                .catch(function (error) {
                    console.error('Lỗi K Tìm Được Idspct và soluongton !', error);
                });
        } else {
            // Chưa chọn mausac và size thì trả về tổng số lượng sp
            $scope.isSoLuongTonAndTongSoLuongSP = false;
            // Bỏ chọn mausac và size thì đưa soluong tại ô input về 1 
            $scope.soluong = 1;
            $scope.messageShowSoLuongTon = false;
            console.error('Chưa chọn đủ Màu Sắc và Size !');
        }
    }

    // Xử lý cộng trừ số lượng sản phầm để thêm vào giỏ
    // Mặc định số lượng là 1
    $scope.soluong = 1;
    $scope.changeQuantitySPCT = function (action) {

        // Tìm Màu Sắc được chọn
        var timKiemMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });
        // Tìm kiếm Size được chọn
        var timKiemSize = $scope.detailSize.find(function (s) {
            return s.isActive;
        });
        // Check soluong tăng phải nhỏ hơn số lượng sản phẩm theo màu sắc và size
        if (timKiemMauSac && timKiemSize) {
            // Cộng số lượng
            if (action === 'qty-up') {
                $scope.soluong++;
                // Nếu tăng số lượng vượt quá số lượng sản phẩm theo màu sắc và size thì nó sẽ thông báo
                if ($scope.soluong > $scope.chiTietSP.soluongton) {
                    $scope.messageShowSoLuongTon = true;
                    $scope.soluong = $scope.chiTietSP.soluongton;
                } else {
                    $scope.messageShowSoLuongTon = false;
                }
            } else {
                // Nếu số lượng nhỏ hơn số lượng sản phẩm theo màu sắc và size thì nó tắt thông báo
                $scope.messageShowSoLuongTon = false;
            }
            // Trừ số lượng
            if (action === 'qty-down' && $scope.soluong > 1) {
                $scope.soluong--;
            }

        } else {
            // Check soluong tăng phải nhỏ hơn tổng số lượng sản phẩm
            if (action === 'qty-up' && $scope.soluong < $scope.tongSoLuongTonSP.tongsoluongtonsp) {
                $scope.soluong++;
            } else if (action === 'qty-down' && $scope.soluong > 1) {
                $scope.soluong--;
            }
        }

    };

    // Validate ô nhập số lượng
    $scope.validateNumber = function () {

        // Tìm Màu Sắc được chọn
        var timKiemMauSac = $scope.detailMauSac.find(function (ms) {
            return ms.isActive;
        });
        // Tìm kiếm Size được chọn
        var timKiemSize = $scope.detailSize.find(function (s) {
            return s.isActive;
        });
        // Kiểm tra nếu không phải là số dương, có chữ hoặc là số 0
        if (!/^[1-9]\d*$/.test($scope.soluong)) {
            $scope.soluong = 1;
        }
        // Check soluong lớn hơn số lượng sản phẩm theo màu sắc và size thì trả ra thông báo
        if (timKiemMauSac && timKiemSize) {
            if ($scope.soluong > $scope.chiTietSP.soluongton) {
                $scope.messageShowSoLuongTon = true;
                $scope.soluong = $scope.chiTietSP.soluongton;
            } else {
                $scope.messageShowSoLuongTon = false;
            }
        } else {
            // Check soluong lớn hơn tổng số lượng sản phẩm thì đưa số lượng nhiều nhất tại ô input
            if ($scope.soluong > $scope.tongSoLuongTonSP.tongsoluongtonsp) {
                $scope.soluong = $scope.tongSoLuongTonSP.tongsoluongtonsp;
            }
        }
    };

    // // Tạo Giỏ Hàng Mới
    // $scope.taoGioHang = function () {

    //     if (idtaikoan !== null) {
    //         $http.post('http://localhost:8080/api/gio-hang/add?idtk=' + idtaikoan)
    //             .then(function (response) {
    //                 $scope.addGioHang = response.data;
    //                 console.log("DATA GH :", $scope.addGioHang);
    //                 // Lưu idgiohang vào localStorage
    //                 localStorage.setItem('idgiohang', $scope.addGioHang.idgiohang);

    //                 // Gọi hàm taoGioHangCT sau khi tạo giỏ hàng mới
    //                 $scope.taoGioHangCT();
    //             })
    //             .catch(function (error) {
    //                 console.error(error.data.message);
    //             });
    //     } else {
    //         // console.log("IdTK Không Có ");
    //         $http.post('http://localhost:8080/api/gio-hang/khong-dang-nhap')
    //             .then(function (response) {
    //                 $scope.addGioHangKhongDN = response.data;
    //                 console.log("DATA GH :", $scope.addGioHangKhongDN);
    //                 // Lưu idgiohang vào localStorage
    //                 localStorage.setItem('idgiohang', $scope.addGioHangKhongDN.idgiohang);

    //                 // Gọi hàm taoGioHangCT sau khi tạo giỏ hàng mới
    //                 $scope.taoGioHangCT();
    //             })
    //             .catch(function (error) {
    //                 console.log("Lỗi K Tạo Được Giỏ Hàng !");
    //             });
    //     }

    // };

    // // Tạo Giỏ Hàng CT và thêm sản phẩm vào giỏ hàng
    // $scope.taoGioHangCT = function () {

    //     // Lấy idGioHang từ localStorage
    //     var IdGioHang = localStorage.getItem('idgiohang');

    //     // Lấy idct quan hàm tìm chiTietSP và soluong ở ô input
    //     var idctsp = $scope.chiTietSP.id;
    //     var soluong = $scope.soluong

    //     // Hiển thị Sweet Alert để xác nhận
    //     Swal.fire({
    //         title: "Thêm Vào Giỏ Hàng",
    //         text: "Bạn có chắc chắn muốn thêm vào giỏ hàng ?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: "#28a745",
    //         cancelButtonColor: "#d33",
    //         confirmButtonText: "Add To Cart",
    //         cancelButtonText: "Cancel",
    //     }).then((result) => {

    //         if (result.isConfirmed) {
    //             $http.post('http://localhost:8080/api/ghct/add-san-pham?idgiohang=' + IdGioHang + '&idctsp=' + idctsp + '&soluong=' + soluong)
    //                 .then(function (response) {
    //                     $scope.ghct = response.data;
    //                     console.log('Data GHCT :', $scope.ghct);
    //                     $window.location.reload();
    //                     // $route.reload();
    //                 })
    //                 .catch(function (error) {
    //                     console.error('Lỗi K Thêm Được SP Vào Giỏ Hàng CT : ', error);
    //                 });


    //             // Sử dụng $location để thay đổi địa chỉ URL
    //             // $location.path('/cart/' + idctsp + '&soluong=' + soluong);
    //         }

    //     });
    // }


    // // Hàm lấy IDCTSP , SL và chuyển sang trang cart   
    // $scope.layIdCTSPAndSL = function () {

    //     // if (idtaikoan !== null) {


    //     // Tìm Màu Sắc được chọn
    //     var isMauSacSelected = $scope.detailMauSac.find(function (ms) {
    //         return ms.isActive;
    //     });

    //     // Tìm kiếm Size được chọn
    //     var isSizeSelected = $scope.detailSize.find(function (s) {
    //         return s.isActive;
    //     });

    //     // Check khi chưa chọn màu sắc và size
    //     if (isMauSacSelected && isSizeSelected) {

    //         // Lấy idGioHang từ localStorage
    //         var IdGioHang = localStorage.getItem('idgiohang');

    //         // Gọi hàm taoGioHang nếu không có idGioHang trong localStorage
    //         if (!IdGioHang) {

    //             $scope.taoGioHang()

    //         } else {

    //             // Nếu có idGioHang trong localStorage, thực hiện thêm vào giỏ hàng và chuyển trang
    //             $scope.taoGioHangCT();

    //         }

    //     } else {
    //         Swal.fire({
    //             title: "Thông Báo",
    //             text: "Vui Lòng Chọn Đủ Màu Sắc Và Size",
    //             icon: "warning",
    //             position: "top-end", // Đặt vị trí ở góc trái
    //             toast: true, // Hiển thị thông báo nhỏ
    //             showConfirmButton: false, // Ẩn nút xác nhận
    //             timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
    //         })
    //         // alert('Vui lòng chọn đủ màu sắc và size.');
    //     }
    //     // }else{

    //     //     Swal.fire({
    //     //         title: "Đăng Nhập",
    //     //         text: "Bạn Cần Phải Đăng Nhập !",
    //     //         icon: "warning",
    //     //         showCancelButton: true,
    //     //         confirmButtonColor: "#28a745",
    //     //         cancelButtonColor: "#d33",
    //     //         confirmButtonText: "Đăng Nhập",
    //     //         cancelButtonText: "Cancel",
    //     //     }).then((result) => {

    //     //         if(result.isConfirmed){
    //     //             $window.location.href = "/src/Page/Login.html";
    //     //         }
    //     //     });


    //     // }
    // };

})
