angular.module('kidney.directives', ['kidney.services'])
// 输入框清除按钮
.directive("buttonClearInput", function () {
    return {
        restrict: "AE",
        scope: {
            input: "=",  //这里可以直接用input获取父scope(包括兄弟元素)中ng-model的值, 传递给本directive创建的isolate scope使用, template也属于当前isolate scope
            origin: "=",
            curr:"="
        },
        // replace: true,   //使用replace之后, 本元素的click不能删除输入框中的内容, 原因大致可以理解为: 父元素被替换后, scope.$apply没有执行对象
        template:"<span ng-if='input' class='icon ion-android-close placeholder-icon' on-tap='clearInput()'></span>",
        controller: function ($scope, $element, $attrs) {
            $scope.clearInput = function () {
                $scope.input = "";
                $scope.curr=$scope.origin
            };
        }
    };
})
//消息模版，用于所有消息类型
//XJZ
.directive('myMessage',['Storage',function(Storage){
    var picArr=[
                {"src":"img/default_user.png","hiRes":"img/avatar.png"},
                {"src":"img/ionic.png","hiRes":"img/avatar.jpg"},
                {"src":"img/max.png","hiRes":"img/avatar.png"}
            ];
    return {
        template: '<div ng-include="getTemplateUrl()"></div>',
        scope: {
            msg:'=',
            photourls:'=',
            msgindex:'@'
        },
        restrict:'AE',
        controller:function($scope){
            var type='';
            $scope.getTemplateUrl = function(){
                if($scope.msg.contentType=='custom'){
                    type=$scope.msg.content.contentStringMap.type;
                    if(type=='card'){
                        try{
                            // console.log($scope.msg.content.contentStringMap);
                            // console.log(JSON.parse($scope.msg.content.contentStringMap.counsel));
                            $scope.counsel=JSON.parse($scope.msg.content.contentStringMap.counsel);
                            if($scope.counsel.type==1){$scope.counsel.counseltype="咨询服务，医生只有三次回答机会"}
                            else if($scope.counsel.type==2){$scope.counsel.counseltype="问诊服务，医生可以不限次回答问题，点击结束按钮结束问诊"};
                            $scope.picurl=picArr;
                        }catch(e){
                            
                        }
                    }
                    return 'templates/msg/'+ type+'.html';
                }
                // type=$scope.msg.contentType=='custom'?$scope.msg.content.contentStringMap.type:$scope.msg.contentType;
                type=$scope.msg.contentType;
                return 'templates/msg/'+type+'.html';
            }
            
            $scope.emitEvent = function(code){
              $scope.$emit(code,arguments);
            }
            // $scope.direct = $scope.msg.fromID==window.JMessage.username?'right':'left';
            
            // $scope.showProfile = function(){
            //     console.log($scope.msg.fromID);
            // }
            // $scope.viewImage= function(thumb,url){
            //     if(type=='image'){
            //         //image massage
            //         $scope.$emit('viewImage',type,thumb,$scope.msg.serverMessageId);
            //     }else{
            //         //image in card
            //         $scope.$emit('viewImage',type,thumb,url);
            //     }
            // };
            $scope.picurl=picArr;
            // $scope.playVoice = function(){

            // }
        }
    }
}])
//聊天输入框的动态样式，如高度自适应，focus|blur状态
//XJZ
.directive('dynamicHeight', [function() {
    return {
        restrict: 'A',
        link: function(scope, elem) {
            elem.bind('keyup', function() {
                this.style.height = "1px";
                var h = 4 + this.scrollHeight;
                this.style.height = (h < 70 ? h : 70) + 'px';

            });
            elem.bind('focus', function() {
                console.log(this.style)
                this.style.borderBottomColor = '#64DD17';
            });
            elem.bind('blur', function() {
                this.style.borderBottomColor = '#AAA';
                // this.setAttribute("style", "border-color: #AAA");
            });
        }
    }
}])
//加载数据的loading spin
    //xjz
    .directive('mySpin',[function(){
          var opts = {
        lines: 9 // The number of lines to draw
      , length: 0 // The length of each line
      , width: 8 // The line thickness
      , radius: 10 // The radius of the inner circle
      , scale: 1 // Scales overall size of the spinner
      , corners: 1 // Corner roundness (0..1)
      , color: '#FFF' // #rgb or #rrggbb or array of colors
      , opacity: 0.35 // Opacity of the lines
      , rotate: 0 // The rotation offset
      , direction: 1 // 1: clockwise, -1: counterclockwise
      , speed: 1 // Rounds per second
      , trail: 44 // Afterglow percentage
      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
      , zIndex: 2e9 // The z-index (defaults to 2000000000)
      , className: 'spinner' // The CSS class to assign to the spinner
      , top: '50%' // Top position relative to parent
      , left: '50%' // Left position relative to parent
      , shadow: true // Whether to render a shadow
      , hwaccel: false // Whether to use hardware acceleration
      , position: 'absolute' // Element positioning
      };
        return{
            restrict:'A',
            link:function(scope,elem,attr){
                scope.$watch(attr.mySpin, function(value) {
                    if(value=='send_going'){
                        scope.spin=new Spinner(opts).spin(elem[0]);
                    }else if(scope.spin){
                        scope.spin.stop();
                        scope.spin=null;
                    }
                  });
            }
        }
    }])
    .directive('mySmallSpin',[function(){
          var opts = {
        lines: 9 // The number of lines to draw
      , length: 0 // The length of each line
      , width: 6 // The line thickness
      , radius: 7 // The radius of the inner circle
      , scale: 1 // Scales overall size of the spinner
      , corners: 1 // Corner roundness (0..1)
      , color: '#000' // #rgb or #rrggbb or array of colors
      , opacity: 0.35 // Opacity of the lines
      , rotate: 0 // The rotation offset
      , direction: 1 // 1: clockwise, -1: counterclockwise
      , speed: 1 // Rounds per second
      , trail: 44 // Afterglow percentage
      , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
      , zIndex: 2e9 // The z-index (defaults to 2000000000)
      , className: 'spinner' // The CSS class to assign to the spinner
      , top: '50%' // Top position relative to parent
      , left: '50%' // Left position relative to parent
      , shadow: false // Whether to render a shadow
      , hwaccel: false // Whether to use hardware acceleration
      , position: 'absolute' // Element positioning
      };

        return{
            restrict:'A',
            link:function(scope,elem,attr){
                scope.$watch(attr.mySmallSpin, function(value) {
                    if(value=='send_going'){
                        scope.spin=new Spinner(opts).spin(elem[0]);
                    }else if(scope.spin){
                        scope.spin.stop();
                        scope.spin=null;
                    }
                  });
            }
        }
    }])
//隐藏tab栏，建议在所有二级页面上都使用
//XJZ
.directive('hideTabs',function($rootScope){ 
    return {
        restrict:'AE',
        link:function($scope){
            $scope.$on('$ionicView.beforeEnter',function(){
                $rootScope.hideTabs = 'tabs-item-hide';
            })
        }
    }
})
.directive('showTabs',function($rootScope){ 
    return {
        restrict:'AE',
        link:function($scope){
            $scope.$on('$ionicView.beforeEnter',function(){
                $rootScope.hideTabs = '';
            })
        }
    }
})
//地图
.directive("appMap", function() {
    return {
        restrict: "E",
        replace: true,
        template: "<div id='allMap'></div>",
        scope: {
            center: "=", // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).  
            markers: "=", // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).  
            width: "@", // Map width in pixels.  
            height: "@", // Map height in pixels.  
            zoom: "@", // Zoom level (one is totally zoomed out, 25 is very much zoomed in).  
            zoomControl: "@", // Whether to show a zoom control on the map.  
            scaleControl: "@", // Whether to show scale control on the map.  
            address: "@"
        },
        link: function(scope, element, attrs) {
            var map;
            // 百度地图API功能  
            map = new BMap.Map("allMap");
            map.addControl(new BMap.ZoomControl());
            // 创建地址解析器实例  
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野  
            myGeo.getPoint(scope.address, function(point) {
                if (point) {
                    map.centerAndZoom(point, 16);
                    map.addOverlay(new BMap.Marker(point));
                }
            }, "");
        }
    };
})

//未读消息的小红点
.directive('headRedPoint', function($compile, $timeout){
   // Runs during compile
   return {
      restrict: 'A', 
      replace: false,
      link: function(scope, element, attrs, controller) {
          var key = attrs.headRedPoint || false;
          var template ="<span ng-class={true:'head-red-point',false:''}["+key+"]></span>";
          var html = $compile(template)(scope);  
          $timeout(function() {
            var test = angular.element(element).parent().append(html)
          },100)
                     
       }
   };
})

.directive('imageRedPoint', function($compile, $timeout){
   // Runs during compile
   return {
      restrict: 'A', 
      replace: false,
      link: function(scope, element, attrs, controller) {
          var key = attrs.imageRedPoint || false;
          var template ="<span ng-class={true:'image-red-point',false:''}["+key+"]></span>";
          var html = $compile(template)(scope);  
          $timeout(function() {
            var test = angular.element(element).parent().append(html)
          },100)
                     
       }
   };
})
// 写评论的五角星
.directive('ionicRatings',ionicRatings);


function ionicRatings() {
    return {
        restrict: 'AE',
        replace: true,
        template: '<div class="text-center ionic_ratings">' +
            '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(1)" ng-show="rating < 1" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(1)" ng-show="rating > 0" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(2)" ng-show="rating < 2" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(2)" ng-show="rating > 1" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(3)" ng-show="rating < 3" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(3)" ng-show="rating > 2" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(4)" ng-show="rating < 4" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(4)" ng-show="rating > 3" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOff}} ionic_rating_icon_off" ng-style="iconOffColor" ng-click="ratingsClicked(5)" ng-show="rating < 5" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '<span class="icon {{iconOn}} ionic_rating_icon_on" ng-style="iconOnColor" ng-click="ratingsUnClicked(5)" ng-show="rating > 4" ng-class="{\'read_only\':(readOnly)}"></span>' +
            '</div>',
        scope: {
            ratingsObj: '=ratingsobj'
        },
        link: function(scope, element, attrs) {

            //Setting the default values, if they are not passed
            scope.iconOn = scope.ratingsObj.iconOn || 'ion-ios-star';
            scope.iconOff = scope.ratingsObj.iconOff || 'ion-ios-star-outline';
            scope.iconOnColor = scope.ratingsObj.iconOnColor || 'rgb(200, 200, 100)';
            scope.iconOffColor = scope.ratingsObj.iconOffColor || 'rgb(200, 100, 100)';
            scope.rating = scope.ratingsObj.rating || 1;
            scope.minRating = scope.ratingsObj.minRating || 1;
            scope.readOnly = scope.ratingsObj.readOnly || false;

            //Setting the color for the icon, when it is active
            scope.iconOnColor = {
                color: scope.iconOnColor
            };

            //Setting the color for the icon, when it is not active
            scope.iconOffColor = {
                color: scope.iconOffColor
            };

            //Setting the rating
            scope.rating = (scope.rating > scope.minRating) ? scope.rating : scope.minRating;

            //Setting the previously selected rating
            scope.prevRating = 0;

            //Called when he user clicks on the rating
            scope.ratingsClicked = function(val) {
                if (scope.minRating !== 0 && val < scope.minRating) {
                    scope.rating = scope.minRating;
                } else {
                    scope.rating = val;
                }
                scope.prevRating = val;
                scope.ratingsObj.callback(scope.rating);
            };

            //Called when he user un clicks on the rating
            scope.ratingsUnClicked = function(val) {
                if (scope.minRating !== 0 && val < scope.minRating) {
                    scope.rating = scope.minRating;
                } else {
                    scope.rating = val;
                }
                if (scope.prevRating == val) {
                    if (scope.minRating !== 0) {
                        scope.rating = scope.minRating;
                    } else {
                        scope.rating = 0;
                    }
                }
                scope.prevRating = val;
                scope.ratingsObj.callback(scope.rating);
            };
        }
    }
}

