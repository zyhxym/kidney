angular.module('kidney.directives', ['kidney.services'])
//消息模版，用于所有消息类型
//XJZ
.directive('myMessage',['Storage',function(Storage){
    var picArr=[
                {"src":"img/sky.png","hiRes":"img/start.png"},
                {"src":"img/avatar.png","hiRes":"img/bigPic.jpg"},
                {"src":"img/max.png","hiRes":"img/max.png"}
            ];
    return {
        template: '<div ng-include="getTemplateUrl()"></div>',
        scope: {
            msg:'=',
            msgindex:'@'
        },
        restrict:'AE',
        controller:function($scope){
            var type='';
            $scope.getTemplateUrl = function(){
                if($scope.msg.contentType=='custom'){
                    type=$scope.msg.content.contentStringMap.type;
                    return 'templates/msg/'+ type+'.html';
                }
                type=$scope.msg.contentType;
                return 'templates/msg/'+type+'.html';
            }
            
            $scope.emitEvent = function(code){
              $scope.$emit(code,arguments);
            }
            $scope.direct = $scope.msg.fromID==window.JMessage.username?'right':'left';
            $scope.picurl=picArr;
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
//隐藏tab栏，建议在所有二级页面上都使用
//XJZ
.directive('hideTabs',function($rootScope){ 
    return {
        restrict:'AE',
        link:function($scope){
            $rootScope.hideTabs = 'tabs-item-hide';
            $scope.$on('$destroy',function(){
                $rootScope.hideTabs = ' ';
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

// 写评论的五角星
.directive('ionicRatings',ionicRatings)
;

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

  