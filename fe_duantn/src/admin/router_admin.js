var app = angular.module('app',['ngRoute']);
app.config(function ($routeProvider,  $locationProvider){
    $locationProvider.hashPrefix("");
    
    $routeProvider.when('/',{
        templateUrl:'pages/thongke.html'
    }).when('/sanpham',{
        templateUrl:'pages/sanpham.html'
    }).when('/hoadon',{
        templateUrl:'pages/hoadon.html'
    }).otherwise({
        redirectTo: '/' 
    });
});