angular.module('MainCtrl',[])

.controller('MainController',['$scope','$cookieStore','$window','$state', '$location','$http','$rootScope','$modal','$modalStack','appAlert','flash','AuthenticationService','socket', function($scope,$cookieStore,$window,$state, $location,$http,$rootScope,$modal,$modalStack,appAlert,flash,AuthenticationService,socket) {
		$scope.$on('$viewContentLoaded', function ()
         {
	         /*Dùng cho nút ghi nhớ mật khẩu*/
	         $("a.your-remember").click(function(event) {
	                event.preventDefault();
	                if (!$(this).hasClass('clicked')) {
	                    $(this).addClass('clicked');
	                    $("input#remember").val(1);
	                } else {
	                    $(this).removeClass('clicked');
	                    $("input#remember").val(0);
	                }
	            });
	         /*Thiết lập thời gian tương đối*/
	         moment.locale('vi', {});
	    });
		$scope.fbLike="https://www.facebook.com/toiyeulaptrinhfanpage";
		/*Lấy đường dẫn hiện tại để tiến hành hightlight menu.*/
		 $scope.getClass = function (path) {
		 	if ($location.path().substr(0, $location.path().length) == path){
		 		if (path == "/" && $location.path() == "/")
		 			return "current-menu-item";
		 		else
		 			if (path == "/")
		 				return "";
		 			else
		 				return "current-menu-item";
		 		}
		 		else
		 			 return "";
		};
		/*Lấy thông tin đăng nhập nếu đăng nhập bằng mạng xã hội*/
		$http.get('/loggedin').success(function(data){
    		 if(data!=="0" && data.status==1){
    		 	$cookieStore.put('currentUser',data);
             	$rootScope.currentUser=$cookieStore.get('currentUser');
             	AuthenticationService.isLogged = true;
                $window.sessionStorage.token = data.token;
    		 }
    		 else{
    		 	$rootScope.currentUser=null;
    		 }
    	});
		$scope.showForm = function(type){
			$http.get('/loggedin').success(function(data){
	    		if(data!=='0'){
					$('.show-form.'+type).fadeIn(500);
				}
				else{
					flash.error='Bạn cần đăng nhập để thực hiện hành động này !';
				}
			});
		};
		socket.on('new answer', function(data){
			console.log('Câu trả lời mới được đăng!');
		});
		socket.on('new message', function(data){
			if(!$modalStack.getTop()){
            $http.get('/loggedin').success(function(user){
              if(user!=='0'){
                var modalInstance = $modal.open({
                  templateUrl: '/views/modal/chat.html',
                  controller: 'modal.chat',
                  backdrop: 'static',
                  resolve: {
                    userData: function () {
                       return data;
                     }
                  }
                });
                modalInstance.result.then(function (dataFromOkModal) {
                  console.log(dataFromOkModal);
                }, function (dataFromDissmissModal) {
                  console.log(dataFromDissmissModal);
                });
            }
          });
        }
		});
}]);