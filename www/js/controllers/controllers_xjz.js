angular.module('xjz.controllers', ['ionic', 'kidney.services'])
    // .controller('GroupsCtrl', ['$scope','$state','$ionicPopover',function($scope,$state,$ionicPopover) {
    //     var options=[{
    //         name:'搜索团队',
    //         href:'#/tab/groups/search'
    //     },{
    //         name:'新建团队',
    //         href:'#/tab/newgroup'
    //     }]
    //     $scope.$on('$ionicView.enter',function(){
    //         $ionicPopover.fromTemplateUrl('templates/pop-menu.html', {
    //           scope: $scope,
    //         }).then(function(popover) {
    //           $scope.options=options;
    //           $scope.popover = popover;
    //         });
    //         // $rootScope.conversation.type='single';
    //         // $rootScope.conversation.id=$state.params.chatId;
    //         // if(window.JMessage){
    //         //     window.JMessage.enterSingleConversation($state.params.chatId,"");
    //         //     getMsg();
    //         // }
    //     })
    //     $scope.enterChat = function(id){
    //         $state.go('tab.group-chat',{groupId:id});
    //     }
    //     $scope.$on('$ionicView.beforeLeave',function(){
    //         $scope.popover.hide();
    //     })
    // }])
    .controller('NewGroupCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.addMember = function() {
            $state.go('tab.group-add-member');
        }
        $scope.group = {
            id: $state.params.groupId,
            name: '折翼肾病管家联盟',
            admin: 'ABC',
            number: 15,
            locale: '中国杭州',
            createAt: '2016-1-1',
            description: 'Material takes cues from contemporary architecture, road signs, pavement marking tape, and athletic courts. Color should be unexpected and vibrant.',
            members: [
                { url: 'img/ben.png', name: 'Green' },
                { url: 'img/perry.png', name: 'Gray' },
                { url: 'img/adam.jpg', name: 'White' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/ben.png', name: 'Black' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/ben.png', name: 'Nat King Cole' }
            ]
        }
    }])
    .controller('GroupsSearchCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.viewGroupInfo = function(id) {
            $state.go('tab.group-add', { groupId: id });
        }
    }])
    .controller('groupsCtrl', ['$scope', '$http', '$state', '$ionicPopover', function($scope, $http, $state, $ionicPopover) {
        $scope.mygroups = ""

        // $scope.test = function(k){
        //   console.log(k.target);
        // }
        $http.get("data/grouplist.json").success(function(data) {
            $scope.mygroups = data
        })
        var options = [{
            name: '搜索团队',
            href: '#/tab/groups/search'
        }, {
            name: '新建团队',
            href: '#/tab/newgroup'
        }]
        $scope.$on('$ionicView.enter', function() {
            $ionicPopover.fromTemplateUrl('partials/group/pop-menu.html', {
                scope: $scope,
            }).then(function(popover) {
                $scope.options = options;
                $scope.popover = popover;
            });
        })
        $scope.enterChat = function(id) {
            $state.go('tab.group-chat', { groupId: id });
        }
        $scope.$on('$ionicView.beforeLeave', function() {
            if ($scope.popover) $scope.popover.hide();
        })

        $scope.itemClick = function(ele, id) {
            if (ele.target.innerHTML == '会诊') $state.go("tab.group-patient", { teamId: id });
            else $state.go('tab.group-chat', { type: 1, groupId: id, teamId: id });
        }

        // $scope.groupcommunication = function(group){
        //   $state.go('tab.group-chat',{groupId:group.groupID,type:1});
        //   // Storage.set("groupId",group.groupID) 
        //   // $state.go("tab.groupQRCode")
        //   //alert(group.groupID)
        // }

        // $scope.grouppatients = function(group){
        //   // Storage.set("groupId",group.groupID) 
        //    $state.go("tab.grouppatient")
        //   //alert(group.groupID)
        // }
    }])
    .controller('groupPatientCtrl', ['$scope', '$http', '$state', 'Storage', '$ionicHistory', function($scope, $http, $state, Storage, $ionicHistory) {

        $scope.grouppatients1 = "";
        $scope.grouppatients2 = "";

        $scope.params = {
            teamId: ''
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.grouppatients1 = "";
            $scope.grouppatients2 = "";
            $scope.params.teamId = $state.params.teamId;
            console.log($scope.params);
            $http.get("data/grouppatient1.json").success(function(data) {
                $scope.grouppatients1 = data
            })

            $http.get("data/grouppatient2.json").success(function(data) {
                $scope.grouppatients2 = data
            })
        })



        $scope.goChat = function(groupId) {
            $state.go('tab.group-chat', { type: 2, groupId: groupId, teamId: $scope.params.teamId });
        }
        $scope.backToGroups = function() {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('tab.groups');
            }
            // $scope.addgroup = function(){
            //   // $state.go()
            // }

        // $scope.groupcommunication = function(grouppatient){
        //   $state.go('tab.group-chat',{groupId:grouppatient.patientID,type:2});
        //   // Storage.set("grouppatientID",grouppatient.patientID)
        //   // $state.go()

        //   // alert(goruppatient.patientID)
        // }
    }])
    .controller('GroupAddCtrl', ['$scope', '$state', function($scope, $state) {
        console.log($state);
        $scope.group = {
            id: $state.params.groupId,
            name: '折翼肾病管家联盟',
            admin: 'ABC',
            number: 15,
            locale: '中国杭州',
            createAt: '2016-1-1',
            description: 'Material takes cues from contemporary architecture, road signs, pavement marking tape, and athletic courts. Color should be unexpected and vibrant.',
            members: [
                { url: 'img/ben.png', name: 'Green' },
                { url: 'img/perry.png', name: 'Gray' },
                { url: 'img/adam.jpg', name: 'White' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/ben.png', name: 'Black' }
            ]
        }
    }])
    //"咨询”问题详情
    .controller('detailCtrl', ['$scope', '$state', '$rootScope', '$ionicModal', '$ionicScrollDelegate', '$ionicHistory', '$cordovaFile', 'Camera', 'voice', function($scope, $state, $rootScope, $ionicModal, $ionicScrollDelegate, $ionicHistory, $cordovaFile, Camera, voice) {
        $scope.input = {
            text: ''
        }
        $scope.params = {
            msgCount: 0,
            helpDivHeight: 40,
            hidePanel: true
                // helpDivStyle:"{'padding-top':'100px'}"
        }
        $scope.msgs = [];
        $scope.scrollHandle = $ionicScrollDelegate.$getByHandle('myContentScroll');
        //render msgs 
        $scope.$on('$ionicView.beforeEnter', function() {
            getMsg(30);
        });
        $scope.$on('$ionicView.enter', function() {
            $rootScope.conversation.type = 'single';
            $rootScope.conversation.id = $state.params.chatId;
            if (window.JMessage) {
                window.JMessage.enterSingleConversation($state.params.chatId, "");
            }
        })

        function getMsg(num) {
            window.JMessage.getHistoryMessages("single", $state.params.chatId, "", $scope.params.msgCount, num,
                function(response) {

                    var res = JSON.parse(response);
                    $scope.$broadcast('scroll.refreshComplete');
                    $scope.$apply(function() {
                        for (var i = 0; i < res.length; ++i) $scope.msgs.unshift(res[i]);
                    });
                    console.log($scope.msgs);
                    setTimeout(function() {
                        $scope.scrollHandle.scrollBottom();
                    }, 100);
                    // $ionicScrollDelegate.scrollBottom();
                    $scope.params.msgCount += res.length;
                },
                function(err) {});
        }

        function viewUpdate(length, scroll) {
            var num = $scope.params.msgCount < length ? $scope.params.msgCount : length;
            window.JMessage.getHistoryMessages("single", $state.params.chatId, "", 0, num,
                function(response) {

                    var res = JSON.parse(response);
                    $scope.$apply(function() {
                        for (var i = res.length - 1, j = $scope.params.msgCount - res.length; i >= 0;) {
                            if (j == $scope.params.msgCount) {
                                $scope.params.msgCount += i + 1;
                                $scope.msgs = $scope.msgs.concat(res.slice(0, i + 1));
                                break;
                            } else if ($scope.msgs[j]['_id'] == res[i]['_id']) {
                                $scope.msgs[j] = res[i];
                                ++j;
                                --i;
                            } else {
                                ++j;
                            }

                        }
                    });
                    if (scroll) {
                        setTimeout(function() {
                            $scope.scrollHandle.scrollBottom();
                        }, 100);
                    }
                },
                function() {

                });
        }
        // function updateOne(msg){

        // }
        // function addOne(){

        // }
        //receiving new massage
        $scope.$on('receiveMessage', function(event, msg) {
            if (msg.targetType == 'single' && msg.fromName == $state.params.chatId) {
                // event.stopPropagation();
                // msg=JSON.parse(msg);
                viewUpdate(5);
                // $scope.$apply(function(){
                //     $scope.msgs.push(msg);
                // });
                // $scope.params.msgCount+=1;
                // setTimeout(function(){
                //     $ionicScrollDelegate.scrollBottom();
                // },100);
                // $ionicScrollDelegate.scrollBottom();
            }
        });

        // function onGetMsg(res){
        //     res=JSON.parse(res);
        //     $scope.$apply(function(){
        //         for(var i=0;i<res.length;++i) $scope.msgs.unshift(res[i]);    
        //     });
        //     console.log($scope.msgs);
        //     setTimeout(function(){
        //         $ionicScrollDelegate.scrollBottom();
        //     },100);
        //     // $ionicScrollDelegate.scrollBottom();
        //     $scope.params.msgCount+=res.length;
        // }
        // function onGetMsgErr(){
        //     // getMsg();
        // }
        $scope.DisplayMore = function() {
            getMsg(30);
        }
        $scope.scrollBottom = function() {
            $scope.scrollHandle.scrollBottom();
        }


        //view image
        $scope.zoomMin = 1;
        $scope.imageUrl = '';
        $scope.sound = {};
        $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            // $scope.modal.show();
            $scope.imageHandle = $ionicScrollDelegate.$getByHandle('imgScrollHandle');
        });

        function onImageLoad(path) {
            $scope.$apply(function() {
                $scope.imageUrl = path;
            })

        }

        function onImageLoadFail(err) {

        }
        $scope.$on('image', function(event, args) {
            console.log(args)
            event.stopPropagation();
            $scope.imageUrl = args[2];
            $scope.modal.show();
            if (args[1] == 'img') {
                window.JMessage.getOriginImageInSingleConversation($state.params.chatId, args[3], onImageLoad, onImageLoadFail);
            } else {
                // getImage(url,onImageLoad,onImageLoadFail)
                $scope.imageUrl = args[3];
            }
            // $scope.image={src:$scope.msgs[msgIndex].content.localThumbnailPath +'.'+ $scope.msgs[msgIndex].content.format};
            // console.log($scope.allImage);
            // $scope.imageUrl=imageUrl;
            // $scope.showModal('templates/msg/imageViewer.html');
        })
        $scope.$on('voice', function(event, args) {
            console.log(args)
            event.stopPropagation();
            $scope.sound = new Media(args[1],
                function() {
                    // resolve(audio.media)
                },
                function(err) {
                    console.log(err);
                    // reject(err);
                })
            $scope.sound.play();
        })
        $scope.$on('profile', function(event, args) {
                console.log(args)
                event.stopPropagation();
            })
            // $scope.showModal = function(templateUrl) {
            // $ionicModal.fromTemplateUrl(templateUrl, {
            // scope: $scope
            // }).then(function(modal) {
            // $scope.modal = modal;
            // $scope.modal.show();
            // $scope.imageHandle=$ionicScrollDelegate.$getByHandle('imgScrollHandle');
            // });
            // }
            // $scope.getStyle = function(){
            //   let imgHeight=window.document.getElementById('bigPic').height;
            //   let vieheight=
            // }
        $scope.closeModal = function() {
            $scope.imageHandle.zoomTo(1, true);
            $scope.modal.hide();
            // $scope.modal.remove()
        };
        $scope.switchZoomLevel = function() {
            if ($scope.imageHandle.getScrollPosition().zoom != $scope.zoomMin)
                $scope.imageHandle.zoomTo(1, true);
            else {
                $scope.imageHandle.zoomTo(5, true);
            }
        }

        //病例Panel
        $scope.togglePanel = function() {
            $scope.params.hidePanel = !$scope.params.hidePanel;
        }
        $scope.content = {
            pics: [
                'img/avatar.png',
                'img/ben.png',
                'img/mike.png'
            ]
        }
        $scope.viewPic = function(url) {
                $scope.imageUrl = url;
                $scope.modal.show();
            }
            // function onSuccess(data){
            //   console.log(data);
            //   alert('[send image]:OK')
            // }
            // function onErr(err){
            //     console.log(err);-
            //     alert('[send image]:err');
            // }
            // send message--------------------------------------------------------------------------------
            //
        function onSendSuccess(res) {

            // res=JSON.parse(res);
            // console.log(res);
            // $scope.$apply(function(){
            //     $scope.msgs.push(res);
            // });
            // $ionicScrollDelegate.scrollBottom();
            // $scope.params.msgCount+=1;
            viewUpdate(10);
        }

        function onSendErr(err) {
            console.log(err);
            alert('[send msg]:err');
            viewUpdate(20);
        }
        // function addNewSend(msgs){
        //     msgs=msgs.JSON.parse(data);
        //     console.log(JSON.parse(data));
        //     for(var i in msgs){
        //         if(msgs[i].fromName==window.JMessage.username)
        //             return addOne(msgs[i]);
        //     }
        // }
        $scope.submitMsg = function() {
                window.JMessage.sendSingleTextMessage($state.params.chatId, $scope.input.text, '', onSendSuccess, onSendErr);
                viewUpdate(5, true);
                // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);
                $scope.input.text = '';
            }
            //get image
        $scope.getImage = function(type) {
                Camera.getPicture(type)
                    .then(function(url) {
                        console.log(url);

                        window.JMessage.sendSingleImageMessage($state.params.chatId, url, '', onSendSuccess, onSendErr);
                        viewUpdate(5, true);
                        // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);

                    }, function(err) {
                        console.log(err)
                    })
            }
            //get voice
        $scope.getVoice = function() {
            //voice.record() do 3 things: record --- file manipulation --- send
            voice.record($state.params.chatId)
                .then(function(res) {
                    console.log(res);
                    viewUpdate(5, true);
                }, function(err) {
                    console.log(err);
                });
        }
        $scope.stopAndSend = function() {
            voice.stopRec();
        }



        $scope.goChats = function() {
            $ionicHistory.nextViewOptions({
                disableBack: false
            });
            $state.go('tab.doing');
        }


        $scope.$on('keyboardshow', function(event, height) {
            $scope.params.helpDivHeight = height + 40;
            setTimeout(function() {
                $scope.scrollHandle.scrollBottom();
            }, 100);

        })
        $scope.$on('keyboardhide', function(event) {
            $scope.params.helpDivHeight = 40;
            // $ionicScrollDelegate.scrollBottom();
        })
        $scope.$on('$ionicView.leave', function() {
            $scope.modal.remove();
            $rootScope.conversation.type = null;
            $rootScope.conversation.id = '';
            window.JMessage.exitConversation();
        })
    }])
    .controller('GroupDetailCtrl', ['$scope', '$state', '$ionicModal', function($scope, $state, $ionicModal) {
        $scope.addMember = function() {
                $state.go('tab.group-add-member', { groupId: $scope.group.id });
            }
            // $scope.showQRCode = function(){

        // }
        // $scope.zoomMin=1;
        // $scope.imageUrl='';
        // $ionicModal.fromTemplateUrl('templates/qr-code.html', {
        //     scope: $scope
        // }).then(function(modal) {
        //     $scope.modal = modal;
        //     // $scope.modal.show();
        //     // $scope.imageHandle=$ionicScrollDelegate.$getByHandle('imgScrollHandle');
        // });
        $scope.showQRCode = function() {
            $state.go('tab.group-qrcode', { groupId: $scope.group.id });
        }
        $scope.closeModal = function() {
            // $scope.imageHandle.zoomTo(1,true);
            $scope.modal.hide();
            $scope.modal.remove()
        };
        $scope.group = {
            id: $state.params.groupId,
            name: '折翼肾病管家联盟',
            admin: 'ABC',
            number: 15,
            locale: '中国杭州',
            createAt: '2016-1-1',
            description: 'Material takes cues from contemporary architecture, road signs, pavement marking tape, and athletic courts. Color should be unexpected and vibrant.',
            members: [
                { url: 'img/ben.png', name: 'Green' },
                { url: 'img/perry.png', name: 'Gray' },
                { url: 'img/adam.jpg', name: 'White' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/ben.png', name: 'Black' },
                { url: 'img/ben.png', name: 'Green' },
                { url: 'img/perry.png', name: 'Gray' },
                { url: 'img/adam.jpg', name: 'White' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/ben.png', name: 'Black' },
                { url: 'img/ben.png', name: 'Green' },
                { url: 'img/perry.png', name: 'Gray' },
                { url: 'img/adam.jpg', name: 'White' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/adam.jpg', name: 'White' },
                { url: 'img/max.png', name: 'Blue' },
                { url: 'img/ben.png', name: 'Nat King Cole' }
            ]
        }
    }])
    .controller('GroupQrcodeCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.params = {
            // groupId:$state.params.groupId
            groupId: '123123123'

        }
    }])
    .controller('GroupAddMemberCtrl', ['$scope', '$state', function() {
        //get groupId via $state.params.groupId

    }])
    .controller('GroupChatCtrl', ['$scope', '$state', '$rootScope', '$ionicHistory', function($scope, $state, $rootScope, $ionicHistory) {
        $scope.params = {
            type: '',
            groupId: '',
            teamId: '',
            msgCount: 0,
            helpDivHeight: 40,
            hidePanel: true,
            isDiscuss: false
                // helpDivStyle:"{'padding-top':'100px'}"
        }
        $scope.$on('$ionicView.beforeEnter', function() {
            $scope.params.type = $state.params.type;
            $scope.params.groupId = $state.params.groupId;
            $scope.params.teamId = $state.params.teamId;
            console.log($scope.params);
            if ($scope.params.type == 2) $scope.params.isDiscuss = true;

        })
        $scope.$on('$ionicView.enter', function() {
            $rootScope.conversation.type = 'group';
            $rootScope.conversation.id = $state.params.groupId;
            if (window.JMessage) {
                window.JMessage.enterSingleConversation($state.params.chatId, "");
                getMsg();
            }
        })
        $scope.togglePanel = function() {
            $scope.params.hidePanel = !$scope.params.hidePanel;
        }
        $scope.content = {
            pics: [
                'img/avatar.png',
                'img/ben.png',
                'img/mike.png'
            ]
        }
        $scope.group = {
            name: 'BME319',
            id: $state.params.groupId,

        }
        $scope.goChats = function() {
            console.log($ionicHistory);
            console.log($scope.params);

            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            if ($scope.params.type == 2) $state.go('tab.group-patient', { teamId: $scope.params.teamId });
            else $state.go('tab.groups');
        }

    }])
