angular.module('xjz.controllers', ['ionic', 'kidney.services'])
//新建团队
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
//团队查找
.controller('GroupsSearchCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.teams=[
          {
              photoUrl:"img/avatar.png",
              groupId:"D201703240001",
              name:"浙一肾病管理团队",
              workUnit:"浙江XXX医院",
              major:"肾上腺分泌失调",
              num:31
          },
          {
              photoUrl:"img/avatar.png",
              groupId:"D201703240002",
              name:"浙一间质性肾炎讨论小组",
              workUnit:"浙江XXX医院",
              major:"慢性肾炎、肾小管疾病",
              num:12
          },
           {
              photoUrl:"img/default_user.png",
              groupId:"D201703240004",
              name:"BME319小组",
              workUnit:"浙江XXX医院",
              major:"HIT",
              num:16
          }];
}])
//我的团队
.controller('groupsCtrl', ['$scope', '$http', '$state', '$ionicPopover', function($scope, $http, $state, $ionicPopover) {
    $scope.mygroups = ""
    $scope.query={
        name:'测试'
    }
    $scope.params={
        isTeam:null,
        showSearch:false
    }

    // $scope.test = function(k){
    //   console.log(k.target);
    // }
    $scope.doctors=[
          {
              photoUrl:"img/avatar.png",
              userId:"D201703240001",
              name:"小丁",
              gender:"男",
              title:"主任医生",
              workUnit:"浙江XXX医院",
              department:"泌尿科",
              major:"肾上腺分泌失调",
              score:'9.5',
              num:2313
          },
          {
              photoUrl:"img/max.png",
              userId:"D201703240002",
              name:"小李",
              gender:"女",
              title:"主任医生",
              workUnit:"浙江XXX医院",
              department:"泌尿科2",
              major:"慢性肾炎、肾小管疾病",
              score:'9.1',
              num:525
          },
           {
              photoUrl:"img/default_user.png",
              userId:"wds",
              name:"小P",
              gender:"男",
              title:"主任医生",
              workUnit:"浙江XXX医院",
              department:"泌尿科3",
              major:"肾小管疾病、间质性肾炎",
              score:'8.8',
              num:2546
          }];
          $scope.showTeams= function(){

          }
          $scope.showDocs= function(){
            
          }
    $http.get("data/grouplist.json").success(function(data) {
        $scope.mygroups = data
    })
    var options = [{
        name: '搜索团队',
        href: '#/tab/groups/search'
    }, {
        name: '新建团队',
        href: '#/tab/newgroup'
    }];
    $scope.$on('$ionicView.beforeEnter', function() {
        console.log($state.params.type);
        $scope.params.isTeam = $state.params.type=='0';
    })
    $scope.$on('$ionicView.enter', function() {
        
    })
    $scope.showTeams = function(){
        $scope.params.isTeam=true;
    }
    $scope.showDocs = function(){
        $scope.params.isTeam=false;
    }
    $scope.search= function(){
        $scope.params.showSearch=true;
    }
     $scope.closeSearch= function(){
        $scope.params.showSearch=false;
    }
    $scope.clearSearch = function(){
        $scope.query.name='';
    }
    $ionicPopover.fromTemplateUrl('partials/group/pop-menu.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.options = options;
        $scope.popover = popover;
    });
    $scope.enterChat = function(id) {
        $state.go('tab.group-chat', { groupId: id });
    }
    $scope.$on('$ionicView.beforeLeave', function() {
        if ($scope.popover) $scope.popover.hide();
    })

    $scope.itemClick = function(ele, id) {
        if (ele.target.innerHTML == '会诊') $state.go("tab.group-patient", { teamId: id });
        else $state.go('tab.group-chat', { type: '0', groupId: id, teamId: id });
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
//团队病历
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
            { url: 'img/avatar.png', name: 'Green' },
            { url: 'img/max.png', name: 'Gray' },
            { url: 'img/ionic.png', name: 'White' },
            { url: 'img/max.png', name: 'Blue' },
            { url: 'img/ben.png', name: 'Black' }
        ]
    }
}])
//"咨询”问题详情
.controller('detailCtrl', ['$scope', '$state', '$rootScope', '$ionicModal', '$ionicScrollDelegate', '$ionicHistory','$ionicPopover','$ionicPopup', 'Camera', 'voice','$http', function($scope, $state, $rootScope, $ionicModal, $ionicScrollDelegate, $ionicHistory,$ionicPopover,$ionicPopup, Camera, voice,$http) {
    $scope.input = {
        text: ''
    }
    $scope.params = {
        //[type]:0=已结束;1=进行中;2=医生
        type:'',
        title:'',
        msgCount: 0,
        helpDivHeight: 30,
        moreMsgs:true
    }
    $scope.msgs = [];
    $scope.scrollHandle = $ionicScrollDelegate.$getByHandle('myContentScroll');
    //render msgs 
    $scope.$on('$ionicView.beforeEnter', function() {
        // if (window.JMessage) {
        //     window.JMessage.enterSingleConversation($state.params.chatId, "");
        //     getMsg(30);
        // }
        $scope.params.chatId=$state.params.chatId;
        $scope.params.type=$state.params.type;
        console.log($state.params);
        if($scope.params.type=='2') $scope.params.title="医生交流";
        else if($scope.params.type=='1') $scope.params.title="咨询-进行中";
        else $scope.params.title="咨询详情";
    });

    $scope.$on('$ionicView.enter', function() {
        if($rootScope.conversation){
            $rootScope.conversation.type = 'single';
            $rootScope.conversation.id = $state.params.chatId;
        }
        imgModalInit();
    })

    $scope.$on('keyboardshow', function(event, height) {
        $scope.params.helpDivHeight = height + 30;
        setTimeout(function() {
            $scope.scrollHandle.scrollBottom();
        }, 100);
    })
    $scope.$on('keyboardhide', function(event) {
        $scope.params.helpDivHeight = 30;
        // $ionicScrollDelegate.scrollBottom();
    })
    $scope.$on('$ionicView.beforeLeave', function() {
        if ($scope.popover) $scope.popover.hide();
    })
    $scope.$on('$ionicView.leave', function() {
        $scope.modal.remove();
        $rootScope.conversation.type = null;
        $rootScope.conversation.id = '';
        if(window.JMessage) window.JMessage.exitConversation();
    })
    // function msgsRender(first,last){
    //     while(first!=last){
    //         $scope.msgs[first+1].diff=($scope.msgs[first+1].createTimeInMillis-$scope.msgs[first].createTimeInMillis)>300000?true:false;
    //         first++;
    //     }
    // }
    function msgsRender(first,last){
        while(first!=last){
            $scope.msgs[first+1].diff=($scope.msgs[first+1].createTimeInMillis-$scope.msgs[first].createTimeInMillis)>300000?true:false;
            first++;
        }
    }
    $http.get("data/sampleMsgsShort.json").success(function(data) {
        $scope.msgs = data;
        if($scope.msgs[0]) $scope.msgs[0].diff=true;
        msgsRender(0,data.length-1);
    });
    function getMsg(num){
        window.JMessage.getHistoryMessages("single",$state.params.chatId,"",$scope.params.msgCount,num,
            function(response){
                // console.log(response);
                $scope.$broadcast('scroll.refreshComplete');
                if(!response) $scope.params.moreMsgs=false;
                else{
                    var res=JSON.parse(response);
                    // console.log(res);
                    $scope.$apply(function(){
                        if($scope.msgs[0]) $scope.msgs[0].diff=($scope.msgs[0].createTimeInMillis-res[0].createTimeInMillis)>300000?true:false;
                        for(var i=0;i<res.length-1;++i){
                            res[i].diff=(res[i].createTimeInMillis-res[i+1].createTimeInMillis)>300000?true:false;
                            $scope.msgs.unshift(res[i]);
                        }
                        $scope.msgs.unshift(res[i]);
                        $scope.msgs[0].diff=true;
                    });
                    console.log($scope.msgs);
                    setTimeout(function(){
                        $scope.scrollHandle.scrollBottom(true);
                    },100);
                    // $ionicScrollDelegate.scrollBottom();
                    $scope.params.msgCount+=res.length;
                }
                
            },
            function(err){
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

    function viewUpdate(length,scroll){
        if($scope.params.msgCount==0) getMsg(1);
        var num = $scope.params.msgCount<length?$scope.params.msgCount:length;
        if(num==0) return;
         window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,num,
            function(response){

                var res=JSON.parse(response);
                $scope.$apply(function(){
                    for(var i=res.length-1,j=$scope.params.msgCount-res.length;i>=0;){
                        if(j==$scope.params.msgCount){
                            $scope.params.msgCount+=i+1;
                        while(i>-1){
                            res[i].diff= (res[i].createTimeInMillis-res[i+1].createTimeInMillis)>300000?true:false;
                            $scope.msgs.push(res[i]);
                            i--;
                        }
                            // for(var k=0;k<i)
                            // $scope.msgs=$scope.msgs.concat(res.slice(0,i+1));
                            // msgsRender($scope.msgs.length-res.length,$scope.msgs.length-1);
                            // break;
                        }else if($scope.msgs[j]['_id']==res[i]['_id']){
                            $scope.msgs[j].status=res[i].status;
                            ++j;--i;
                        }else{
                             ++j;
                        }

                    }   
                });
                // if(scroll){
                    setTimeout(function(){
                        $scope.scrollHandle.scrollBottom();
                    },100);
                // }
            },function(){

            });
    }
    //receiving new massage
    $scope.$on('receiveMessage', function(event, msg) {
        if (msg.targetType == 'single' && msg.fromName == $state.params.chatId) {
            viewUpdate(5);
        }
    });

    $scope.DisplayMore = function() {
        getMsg(30);
    }
    $scope.scrollBottom = function() {
        $scope.scrollHandle.scrollBottom(true);
    }
    //长按工具条
    var options = [{
        name: '转发医生',
    }, {
        name: '转发团队',
    }]
    $ionicPopover.fromTemplateUrl('partials/others/toolbox-pop.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.options = options;
        $scope.popover = popover;
    });
    //view image
    function imgModalInit(){
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
    }
    

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
        $scope.imageHandle.zoomTo(1, true);
        $scope.imageUrl = args[2];
        $scope.modal.show();
        // if (args[1] == 'img') {
            window.JMessage.getOriginImageInSingleConversation($state.params.chatId, args[3], onImageLoad, onImageLoadFail);
        // } else {
            // getImage(url,onImageLoad,onImageLoadFail)
            // $scope.imageUrl = args[3];
        // }
        // $scope.image={src:$scope.msgs[msgIndex].content.localThumbnailPath +'.'+ $scope.msgs[msgIndex].content.format};
        // console.log($scope.allImage);
        // $scope.imageUrl=imageUrl;
        // $scope.showModal('templates/msg/imageViewer.html');
    })
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
    $scope.$on('holdmsg', function(event, args) {
        console.log(args)
        event.stopPropagation();
        $scope.popover.show(args[2]);
    })
    $scope.$on('viewcard', function(event, args) {
        console.log(args[2]);
        event.stopPropagation();
        if(args[2].target.tagName=="IMG"){
            $scope.imageHandle.zoomTo(1, true);
            $scope.imageUrl = args[2].target.currentSrc;
            console.log(args[2].target.attributes.hires.nodeValue);
            $scope.modal.show();
        }else{
            $state.go('tab.consult-detail',{consultId:args[1]});
        }
        // $state.go('tab.consult-detail',{consultId:args[1]});
    })
    $scope.toolChoose =function(data){
        // console.log(data);
        if(data==0) $state.go('tab.selectDoc');
        if(data==1) $state.go('tab.selectTeam');
    }
    $scope.$on('profile', function(event, args) {
            console.log(args)
            event.stopPropagation();
        })
    $scope.finishConsult = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定要结束此次咨询吗?',
            // template: '确定要结束此次咨询吗?'
            okText:'确定',
            cancelText:'取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    }

    // send message--------------------------------------------------------------------------------
        //
    function onSendSuccess(res) {
        viewUpdate(10);
    }

    function onSendErr(err) {
        console.log(err);
        alert('[send msg]:err');
        viewUpdate(20);
    }
    $scope.submitMsg = function() {
            window.JMessage.sendSingleTextMessage($state.params.chatId, $scope.input.text, '', onSendSuccess, onSendErr);
            $scope.input.text = '';
            viewUpdate(5, true);
            // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);
            
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
    $scope.getVoice = function(){
        //voice.record() do 2 things: record --- file manipulation 
        voice.record()
        .then(function(fileUrl){
            window.JMessage.sendSingleVoiceMessage($state.params.chatId,fileUrl,'',
            function(res){
                console.log(res);
                viewUpdate(5,true);
            },function(err){
                console.log(err);
            });
            viewUpdate(5,true);
        },function(err){
            console.log(err);
        });

    }
    $scope.stopAndSend = function() {
        voice.stopRec();
    }

    $scope.goChats = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        if($state.params.type=="1") $state.go('tab.doing');
        else if($state.params.type=="0") $state.go('tab.did');
        else  $state.go('tab.groups',{type:'1'});
    }
}])
//团队信息
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
            { url: 'img/avatar.png', name: 'Green' },
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
//团队二维码
.controller('GroupQrcodeCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.params = {
        // groupId:$state.params.groupId
        groupId: '123123123'

    }
}])
//添加成员
.controller('GroupAddMemberCtrl', ['$scope', '$state', function() {
    //get groupId via $state.params.groupId

}])
//团队聊天
.controller('GroupChatCtrl', ['$scope', '$state', '$rootScope', '$ionicHistory','$http','$ionicModal','$ionicScrollDelegate','$rootScope', function($scope, $state, $rootScope, $ionicHistory,$http,$ionicModal,$ionicScrollDelegate,$rootScope) {
    $scope.params = {
        type: '',//'0':团队交流  '1': 未结束病历  '2':已结束病历
        groupId: '',
        teamId: '',
        msgCount: 0,
        helpDivHeight: 30,
        hidePanel: true,
        isDiscuss: false,
        isOver: false
    }
    $rootScope.patient = {
        name: '李峰',
        age: '23',
        teamId: 'team111',
        groupId:'group111',
        undergo: true,
        gender: '男',
        time: '4/9/17 12:17',
        discription: '现在口服药有，早上拜新同两片，中午47.5mg的倍他乐克一片'
    }
    // $rootScope.goConclusion =function(){
    //     if(params.type=='2') location.hash = "#conclusion";
    //     else $state.go('tab.group-conclusion',{teamId:params.teamId,groupId:params.groupId,type:params.type});
    // }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.params.type = $state.params.type;
        $scope.params.groupId = $state.params.groupId;
        $scope.params.teamId = $state.params.teamId;
        if ($scope.params.type !='0') {
            $scope.params.isDiscuss = true;
            $scope.params.hidePanel = false;
        }
        if ($scope.params.type =='2'){
            $rootScope.patient.undergo=false;
            $scope.params.isOver = true;
        }
    })
    $scope.$on('$ionicView.enter', function() {
        $rootScope.conversation.type = 'group';
        $rootScope.conversation.id = $state.params.groupId;
        // if (window.JMessage) {
        //     window.JMessage.enterSingleConversation($state.params.chatId, "");
        //     getMsg();
        // }
    })
    function msgsRender(first,last){
        while(first!=last){
            $scope.msgs[first+1].diff=($scope.msgs[first+1].createTimeInMillis-$scope.msgs[first].createTimeInMillis)>300000?true:false;
            first++;
        }
    }
    $http.get("data/sampleMsgs.json").success(function(data) {
        $scope.msgs = data;
        // $scope.$apply(function(){
            msgsRender(0,data.length-1);
        // });
        // 

    });
    
    
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
        $scope.imageHandle.zoomTo(1, true);
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
    $scope.goChats = function() {
        console.log($ionicHistory);
        console.log($scope.params);

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        if ($scope.params.type == '0') $state.go('tab.groups');
        else $state.go('tab.group-patient', { teamId: $scope.params.teamId });
    }

}])
//病历结论
.controller('GroupConclusionCtrl',['$state','$scope',function($state,$scope){
    $scope.params = {
        type: '',
        groupId: '',
        teamId: '',
        hidePanel:true
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.params.type = $state.params.type;
        $scope.params.groupId = $state.params.groupId;
        $scope.params.teamId = $state.params.teamId;
    })
    $scope.togglePanel = function() {
        $scope.params.hidePanel = !$scope.params.hidePanel;
    }
}])
.controller('selectDocCtrl',['$state','$scope',function($state,$scope){
    $scope.doctors=[
          {
              photoUrl:"img/avatar.png",
              userId:"D201703240001",
              name:"小丁",
              gender:"男",
              title:"主任医生",
              workUnit:"浙江XXX医院",
              department:"泌尿科",
              major:"肾上腺分泌失调",
              score:'9.5',
              num:2313
          },
          {
              photoUrl:"img/max.png",
              userId:"D201703240002",
              name:"小李",
              gender:"女",
              title:"主任医生",
              workUnit:"浙江XXX医院",
              department:"泌尿科2",
              major:"慢性肾炎、肾小管疾病",
              score:'9.1',
              num:525
          },
           {
              photoUrl:"img/default_user.png",
              userId:"wds",
              name:"小P",
              gender:"男",
              title:"主任医生",
              workUnit:"浙江XXX医院",
              department:"泌尿科3",
              major:"肾小管疾病、间质性肾炎",
              score:'8.8',
              num:2546
          }];

}])
.controller('selectTeamCtrl',['$state','$scope',function($state,$scope){
    $scope.teams=[
          {
              photoUrl:"img/avatar.png",
              groupId:"D201703240001",
              name:"浙一肾病管理团队",
              workUnit:"浙江XXX医院",
              major:"肾上腺分泌失调",
              num:31
          },
          {
              photoUrl:"img/avatar.png",
              groupId:"D201703240002",
              name:"浙一间质性肾炎讨论小组",
              workUnit:"浙江XXX医院",
              major:"慢性肾炎、肾小管疾病",
              num:12
          },
           {
              photoUrl:"img/default_user.png",
              groupId:"D201703240004",
              name:"BME319小组",
              workUnit:"浙江XXX医院",
              major:"HIT",
              num:16
          }];

}])
.controller('consultDetailCtrl',['$state','$scope','$ionicModal','$ionicScrollDelegate',function($state,$scope,$ionicModal,$ionicScrollDelegate){
    $scope.consult={
        name:'李大山',
        age:'56',
        gender:'男',
        time:'4/11/17 8:57',
        discription:'现在口服药有，早上拜新同两片，中午47.5mg的倍他乐克一片',

    }
    $scope.content={
        pics:[
            'img/avatar.png',
            'img/max.png',
            'img/ionic.png'
        ]
    }
    //view image
    $scope.zoomMin=1;
    $scope.imageUrl='';
    $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        // $scope.modal.show();
        $scope.imageHandle=$ionicScrollDelegate.$getByHandle('imgScrollHandle');
    });
    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $scope.imageHandle=$ionicScrollDelegate.$getByHandle('imgScrollHandle');
        });
    }
    $scope.closeModal = function() {
        $scope.imageHandle.zoomTo(1,true);
        $scope.modal.hide();
        // $scope.modal.remove()
    };
    $scope.switchZoomLevel = function(){
      if($scope.imageHandle.getScrollPosition().zoom!=$scope.zoomMin) 
        $scope.imageHandle.zoomTo(1,true);
      else{
        $scope.imageHandle.zoomTo(5,true);
      }
    }
    $scope.viewPic = function(url){
        $scope.imageUrl=url;
        $scope.modal.show();
    }
    $scope.$on('$ionicView.leave',function(){
        if($scope.modal)$scope.modal.remove();
    })
}])