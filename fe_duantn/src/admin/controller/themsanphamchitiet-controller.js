app.service("themsanPhamchitietService", function ($http) {
  var token = localStorage.getItem("accessToken");

  if (!token) {
    // Xử lý trường hợp không có token, có thể chuyển hướng đến trang đăng nhập
    console.error("Không tìm thấy token. Hãy đăng nhập trước.");
    return Promise.reject("Unauthorized");
  }

  // Thêm token vào header của yêu cầu
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  this.getMauSacs = function () {
    return $http
      .get("http://localhost:8080/api/admin/mausac/hien-thi-combobox", config)
      .then(function (response) {
        return response.data;
      });
  };
  this.getSIzes = function () {
    return $http
      .get("http://localhost:8080/api/admin/size/hien-thi-combobox", config)
      .then(function (response) {
        return response.data;
      });
  };
  this.getChiTieSanPhams = function (IdSP) {
    return $http
      .get(
        "http://localhost:8080/api/admin-sanphamchitiet/hienthitatcasanphamchitiet",
        { params: { IdSP: IdSP }, headers: config.headers }
      )
      .then(function (response) {
        return response.data;
      });
  };
  // thêm mới sản phẩmCT
  this.addSanPhamCT = function (sanPhamData) {
    return $http
      .post(
        "http://localhost:8080/api/admin-sanphamchitiet/add-sanphamct",
        sanPhamData,
        config
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.updateCTSPTrangthai = function (idsp, trangthai) {
    return $http
      .put(
        "http://localhost:8080/api/admin-sanphamchitiet/update-ctsp-trangthai",
        null, // Truyền tham số vào URL
        {
          params: { idsp: idsp, trangthai: trangthai },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.getThemAnh = function (images) {
    return $http
      .post("http://localhost:8080/api/admin-image/add-imge", images, config)
      .then(function (response) {
        return response.data;
      });
  };
  this.updateCTSPSoluong = function (idsp, soluongton) {
    return $http
      .put(
        "http://localhost:8080/api/admin-sanphamchitiet/update-ctsp-soluongton",
        null, // Truyền tham số vào URL
        {
          params: { idsp: idsp, soluongton: soluongton },
          headers: config.headers,
        }
      )
      .then(function (response) {
        return response.data;
      });
  };
  this.getSanPhamTheoIds = function (IdSP) {
    return $http
      .get("http://localhost:8080/api/admin-sanpham/hienthisanphamtheoid", {
        params: { IdSP: IdSP },
        headers: config.headers,
      })
      .then(function (response) {
        return response.data;
      });
  };
  this.getImageIds = function (IdSP) {
    return $http
      .get("http://localhost:8080/api/admin-image/hienthitatcaimage", {
        params: { IdSP: IdSP },
        headers: config.headers,
      })
      .then(function (response) {
        return response.data;
      });
  };
  // Thêm hàm để gọi API xóa ảnh theo imageId
  this.deleteImageById = function (imageId) {
    return $http
      .delete(
        "http://localhost:8080/api/admin-image/delete-image/" + imageId,
        config
      )
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error.data;
      });
  };
});

app.controller(
  "ThemSanPhamChiTietController",
  function ($scope, themsanPhamchitietService, $window, $route) {
    var role = $window.localStorage.getItem("role");

    if (role == null) {
      // Hiển thị thông báo khi chưa đăng nhập
      Swal.fire({
        title: "Bạn cần phải đăng nhập !",
        text: "Vui lòng đăng nhập để sử dụng chức năng !",
        icon: "warning",
      });
      // Chuyển hướng người dùng đến trang đăng nhập
      $window.location.href =
        "http://127.0.0.1:5000/src/admin/index_admin.html#/login";
    }

    // Kiểm tra quyền và đặt biến isAdmin
    $scope.isAdmin = false;
    function getRole() {
      if (role === "ADMIN" || role === "NHANVIEN") {
        $scope.isAdmin = true;
      }
    }
    getRole();
    if (role === "ADMIN" || role === "NHANVIEN") {
      // Đoạn mã xử lý khi người dùng chọn file ảnh
      $scope.handleFileSelect = function (event) {
        const fileList = event.target.files; // Danh sách các tệp đã chọn
        $scope.selectedImages = []; // Khởi tạo mảng để lưu trữ các tệp đã chọn

        if (fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            const selectedFile = fileList[i]; // Lấy từng tệp trong danh sách
            $scope.selectedImages.push({
              name: selectedFile.name,
              size: selectedFile.size,
              type: selectedFile.type,
            });
          }

          console.log("Danh sách các tệp đã chọn:", $scope.selectedImages);
        }
      };

      // Các hàm và logic khác của controller
      themsanPhamchitietService.getMauSacs().then(function (data) {
        $scope.MauSacs = data;
      });

      themsanPhamchitietService.getSIzes().then(function (data) {
        $scope.Sizes = data;
      });

      $scope.selectedMauSac = null;
      $scope.selectedSize = null;

      // Sử dụng phương thức mới trong controller
      $scope.xemChiTietSP = function () {
        var maspInput = localStorage.getItem("IdSP");

        if (maspInput) {
          themsanPhamchitietService
            .getChiTieSanPhams(maspInput)
            .then(function (data) {
              $scope.sanPhamCTList = data;
              console.log("Kết quả từ API xem chi tiết", data);
              console.log("Giá trị IdSP từ localStorage:", maspInput);

              // Xử lý dữ liệu nếu cần
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
            });
        } else {
          console.error("Không có IdSP trong localStorage");
        }
      };
      $scope.errorMessage = {
        SiZe: "",
        soluongton: "",
        MauSac: "",
        image: "",
        // Thêm các thuộc tính cho các ô input khác
      };
      $scope.xemChiTietSP();
      $scope.clearErrorMessages = function () {
        for (var key in $scope.errorMessage) {
          if ($scope.errorMessage.hasOwnProperty(key)) {
            $scope.errorMessage[key] = "";
          }
        }
      };

      $scope.hasError = function () {
        for (var key in $scope.errorMessage) {
          if (
            $scope.errorMessage.hasOwnProperty(key) &&
            $scope.errorMessage[key]
          ) {
            return true; // Nếu có thông báo lỗi, trả về true
          }
        }
        return false; // Nếu không có lỗi, trả về false
      };
      $scope.addSanPhamCT = function () {
        var IdSP = localStorage.getItem("IdSP");

        $scope.clearErrorMessages();

        // Kiểm tra và hiển thị thông báo lỗi nếu các trường không được chọn hoặc không hợp lệ
        if (!$scope.selectedsoluongton) {
          $scope.errorMessage.soluongton = "Vui lòng không bỏ trống";
        }
        if (!$scope.selectedSiZe) {
          $scope.errorMessage.SiZe = "Vui lòng không bỏ trống";
        }
        if (!$scope.selectedMauSac) {
          $scope.errorMessage.MauSac = "Vui lòng không bỏ trống";
        }
        if ($scope.selectedsoluongton <= 0) {
          $scope.errorMessage.soluongton =
            "Số lượng phải là số dương và lớn hơn 0";
        }
        if ($scope.selectedsoluongton > 10000) {
          $scope.errorMessage.soluongton = "Số lượng không được vượt quá 10000";
        }

        // Kiểm tra xem có thông báo lỗi nào không
        if ($scope.hasError()) {
          // Nếu có, hiển thị thông báo lỗi và không thực hiện thêm sản phẩm
          Swal.fire({
            title: "Error",
            text: "Vui lòng kiểm tra lại thông tin sản phẩm!",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
          });
          return;
        }

        // Hiển thị hộp thoại xác nhận trước khi thêm sản phẩm chi tiết
        Swal.fire({
          title: "Bạn có muốn thêm sản phẩm chi tiết không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Tạo đối tượng dữ liệu sản phẩm chi tiết
            var sanPhamCTData = {
              soluongton: $scope.selectedsoluongton,
              mota: $scope.selectedmota,
              size: $scope.selectedSiZe,
              mausac: $scope.selectedMauSac,
              trangthai: 1, // Trạng thái cứng bằng 1
              sanpham: IdSP,
              // Các thuộc tính khác của sản phẩm
            };

            // Gọi service để thêm sản phẩm chi tiết
            themsanPhamchitietService
              .addSanPhamCT(sanPhamCTData)
              .then(function (data) {
                console.log("Sản phẩm chi tiết đã được thêm thành công:", data);
                // Hiển thị thông báo thành công
                Swal.fire({
                  title: "Success",
                  text: "Thêm sản phẩm chi tiết thành công",
                  icon: "success",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                });
                $route.reload(); // Tải lại trang sau khi thêm thành công
              })
              .catch(function (error) {
                console.error("Lỗi khi thêm sản phẩm chi tiết:", error);
                // Hiển thị thông báo lỗi nếu thêm không thành công
                Swal.fire({
                  title: "Error",
                  text: "Thêm sản phẩm chi tiết thất bại",
                  icon: "error",
                  position: "top-end",
                  toast: true,
                  showConfirmButton: false,
                  timer: 1500,
                });
              });
          }
        });
      };

      $scope.updateCTSPTrangthaiS = function (sanPham) {
        if (!sanPham || !sanPham.id || !sanPham.trangthai) {
          console.error("Thông tin sản phẩm không hợp lệ");
          return;
        }

        var newTrangThai = sanPham.trangthai === 1 ? 2 : 1; // Đảo ngược trạng thái

        themsanPhamchitietService
          .updateCTSPTrangthai(String(sanPham.id), newTrangThai)
          .then(function (response) {
            console.log("Cập nhật trạng thái thành công", response);
            // Cập nhật trạng thái của sản phẩm ngay sau khi nhận phản hồi thành công
            sanPham.trangthai = newTrangThai;
          })
          .catch(function (error) {
            Swal.fire({
              title: "Success",
              text: "cập nhật thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            sanPham.trangthai = newTrangThai;
            // Xử lý lỗi nếu cần
          });
      };
      // thêm ảnh
      // Hàm thêm ảnh vào sản phẩm chi tiết
      $scope.themAnh = function () {
        var maspInput = localStorage.getItem("IdSP");

        // Kiểm tra người dùng đã chọn ảnh chưa
        if (!$scope.selectedImages || $scope.selectedImages.length === 0) {
          $scope.errorMessage.image = "Vui lòng chọn ít nhất một ảnh để thêm";
          return;
        }

        // Hiển thị hộp thoại xác nhận trước khi thêm ảnh
        Swal.fire({
          title: "Bạn có muốn thêm ảnh cho sản phẩm không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Kiểm tra số lượng ảnh đã chọn
            if ($scope.selectedImages.length > 0) {
              // Gọi service để lấy danh sách ảnh hiện có của sản phẩm
              themsanPhamchitietService
                .getImageIds(maspInput)
                .then(function (data) {
                  // Số lượng ảnh hiện có của sản phẩm
                  var currentImageCount = data ? data.length : 0;

                  // Số lượng ảnh muốn thêm
                  var additionalImageCount = $scope.selectedImages.length;

                  // Giới hạn số lượng ảnh cho phép thêm (ví dụ: tối đa 5 ảnh)
                  var maxImageCount = 5;

                  // Tổng số lượng ảnh sau khi thêm
                  var totalImageCount =
                    currentImageCount + additionalImageCount;

                  // Kiểm tra nếu tổng số lượng ảnh vượt quá giới hạn
                  if (totalImageCount > maxImageCount) {
                    // Hiển thị thông báo không cho phép thêm ảnh
                    Swal.fire({
                      title: "Thông báo",
                      text:
                        "Số lượng ảnh hiện có của sản phẩm là " +
                        currentImageCount +
                        ". Bạn chỉ được phép thêm tối đa " +
                        (maxImageCount - currentImageCount) +
                        " ảnh nữa.",
                      icon: "info",
                      position: "top-end",
                      toast: true,
                      showConfirmButton: false,
                      timer: 5000,
                    });
                    return;
                  }

                  // Nếu số lượng ảnh chưa vượt quá giới hạn, tiếp tục thực hiện thêm ảnh
                  var imagesData = [];
                  $scope.selectedImages.forEach(function (selectedFile, index) {
                    var newImage = {
                      tenimage: selectedFile.name,
                      trangthai: 1,
                      sanpham: maspInput,
                    };
                    imagesData.push(newImage);
                  });

                  // Gọi service để thêm danh sách ảnh vào sản phẩm chi tiết
                  themsanPhamchitietService
                    .getThemAnh(imagesData)
                    .then(function (data) {
                      console.log("Thêm ảnh thành công", data);
                      // Sau khi thêm thành công, đặt lại các giá trị và làm mới input
                      $scope.selectedImages = []; // Xóa danh sách ảnh đã chọn
                      $scope.errorMessage.image = ""; // Xóa thông báo lỗi về ảnh
                      document.getElementById("fileInput").value = ""; // Làm mới input file

                      // Hiển thị thông báo thành công
                      Swal.fire({
                        title: "Success",
                        text: "Thêm ảnh cho sản phẩm thành công",
                        icon: "success",
                        position: "top-end",
                        toast: true,
                        showConfirmButton: false,
                        timer: 1500,
                      });
                      $route.reload();

                      // Sau khi thêm ảnh, có thể tải lại dữ liệu hoặc thực hiện các thao tác khác
                    })
                    .catch(function (error) {
                      console.error("Lỗi khi thêm ảnh", error);
                    });
                })
                .catch(function (error) {
                  console.error(
                    "Lỗi khi lấy danh sách ảnh của sản phẩm",
                    error
                  );
                });
            }
          }
        });
      };

      $scope.updateCTSPSoluong = function (idsp, soluongton) {
        idsp = String(idsp);

        // Kiểm tra số lượng sản phẩm chi tiết mới
        if (soluongton < 0 || soluongton > 10000) {
          // Hiển thị thông báo lỗi nếu số lượng không hợp lệ
          Swal.fire({
            title: "Error",
            text: "Số lượng sản phẩm chi tiết phải nằm trong khoảng từ 0 đến 10000",
            icon: "error",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timer: 3000,
          });
          return; // Ngăn không cho tiếp tục gọi service nếu số lượng không hợp lệ
        }

        // Gọi service để cập nhật số lượng sản phẩm chi tiết
        themsanPhamchitietService
          .updateCTSPSoluong(idsp, soluongton)
          .then(function (response) {
            console.log("Cập nhật số lượng thành công", response);
            // Hiển thị thông báo thành công nếu cập nhật thành công
            Swal.fire({
              title: "Success",
              text: "Cập nhật số lượng thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
            // Cập nhật thông tin chi tiết sản phẩm sau khi cập nhật thành công (nếu cần)
          })
          .catch(function (error) {
            console.error("Lỗi khi cập nhật số lượng", error);
            // Hiển thị thông báo lỗi nếu cập nhật không thành công
            Swal.fire({
              title: "Success",
              text: "Cập nhật số lượng thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
          });
      };

      // Định nghĩa hàm xem sản phẩm theo IdSP từ localStorage
      $scope.xemSanPhamTheoId = function () {
        var maspInput = localStorage.getItem("IdSP");

        if (maspInput) {
          themsanPhamchitietService
            .getSanPhamTheoIds(maspInput) // Gọi API getSanPhamTheoIds từ service
            .then(function (data) {
              // Xử lý kết quả trả về từ API
              if (data && data.length > 0) {
                // Nếu có dữ liệu sản phẩm chi tiết, gán sản phẩm vào biến $scope để hiển thị trên giao diện
                $scope.sanPhamTheoId = data[0]; // Lấy sản phẩm đầu tiên (giả sử chỉ có một sản phẩm có cùng IdSP)
                console.log(
                  "Thông tin chi tiết sản phẩm:",
                  $scope.sanPhamTheoId
                );
              } else {
                console.error("Không tìm thấy sản phẩm với IdSP:", maspInput);
                // Xử lý tình huống không tìm thấy sản phẩm
                // Ví dụ: hiển thị thông báo cho người dùng
              }
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
              // Xử lý lỗi nếu gọi API không thành công
              // Ví dụ: hiển thị thông báo lỗi cho người dùng
            });
        } else {
          console.error("Không có IdSP trong localStorage");
          // Xử lý tình huống khi không tìm thấy IdSP trong localStorage
          // Ví dụ: hiển thị thông báo cho người dùng
        }
      };
      $scope.xemSanPhamTheoId();
      // Sử dụng phương thức mới trong controller
      $scope.xemImageSP = function () {
        var maspInput = localStorage.getItem("IdSP");

        if (maspInput) {
          themsanPhamchitietService
            .getImageIds(maspInput)
            .then(function (data) {
              $scope.ImageDL = data;
              console.log("Kết quả từ API image xem chi tiết", data);
              console.log("Giá trị IdSP từ localStorage:", maspInput);
              // Xử lý dữ liệu nếu cần
            })
            .catch(function (error) {
              console.error("Lỗi khi gọi API xem chi tiết", error);
            });
        } else {
          console.error("Không có IdSP trong localStorage");
        }
      };
      $scope.xemImageSP();
      // Các đoạn mã khác trong controller

      // Hàm xóa ảnh theo imageId
      $scope.deleteImage = function (imageId) {
        themsanPhamchitietService
          .deleteImageById(imageId)
          .then(function (data) {})
          .catch(function (data) {
            console.error("Lỗi khi xóa ảnh:", data);
            console.log("Đã xóa ảnh thành công:", data);
            // Thực hiện các thao tác sau khi xóa ảnh thành công (nếu cần)
            Swal.fire({
              title: "Success",
              text: "Đã xóa ảnh thành công",
              icon: "success",
              position: "top-end",
              toast: true,
              showConfirmButton: false,
              timer: 1500,
            });
            $route.reload();
          });
      };
    }
     // Load mavoucher from localStorage when the controller initializes
    
  }
  
);
