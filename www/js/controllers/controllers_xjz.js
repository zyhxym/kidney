angular.module('xjz.controllers', ['ionic', 'kidney.services'])
//新建团队
.controller('NewGroupCtrl', ['$scope', '$state', '$ionicLoading', '$rootScope', 'Communication', 'Storage', 'JM', 'Doctor', function($scope, $state, $ionicLoading, $rootScope, Communication, Storage, JM, Doctor) {
    $rootScope.newMember = [];
    // $scope.group = {
    //     members: [
    //     ]
    // }
    $scope.members = [];
    $scope.team = {
        teamId: '',
        name: '',
        sponsorId: '',
        sponsorName: '',
        description: ''
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.members = $rootScope.newMember;
    });

     $scope.confirm = function(){
        console.log($rootScope.newMember);
       // return;
        if($scope.team.name=='' || $scope.team.description==''){
            $ionicLoading.show({ template: '请完整填写信息', duration: 1500 });
        }else if(!$scope.members){
            $ionicLoading.show({ template: '请至少添加一个成员', duration: 1500 });
        }else{  
            var idStr='';
                    for(i=0;i<$rootScope.newMember.length;i++){
                         window.JMessage.register($rootScope.newMember[i].userId, JM.pGen($rootScope.newMember[i].userId),function(data){
                            console.log(data);
                         },function(err){
                            console.log(err);
                         });
                        if(i==0){
                        idStr=$rootScope.newMember[i].userId}
                        else{idStr=idStr+','+$rootScope.newMember[i].userId}
                    }
                    
       
                     console.log(idStr);
            setTimeout(function(){ 
                 window.JMessage.createGroup($scope.team.name,$scope.team.description,idStr,
                function(data){
                    console.log(data);
                    upload(data);
                    // members=$rootScope.newMember;
                    
                    // window.JMessage.addGroupMembers(groupId,idStr,
                    // window.JMessage.addGroupMembers('22818577','user004',
                    //     function(data){
                    //         console.log(data);
                    //         upload();
                    //     },function(err){
                    //         $ionicLoading.show({ template: '失败addGroupMembers', duration: 1500 });
                    //         console.log(err);
                    //     })
                },function(err){
                    $ionicLoading.show({ template: '失败createGroup', duration: 1500 });
                    console.log(err);
                })
            },500); 
            // JM.newGroup($scope.team.name,$scope.team.description,$scope.members)
            // .then(function(data){
            //     console.log(data);
            //     upLoad();
            // },function(err){
            //     $ionicLoading.show({ template: '失败createGroup', duration: 1500 });
            // })
            // window.JMessage.createGroup($scope.team.name,$scope.team.description,
            //     function(data){
            //         console.log(data);
            //         // members=$rootScope.newMember;
            //         var idStr=[];
            //         for(var i in members) idStr.push(members[i].userId);
            //         idStr.join(',');
            //         window.JMessage.addGroupMembers($scope.team.name,idStr,
            //             function(data){
            //                 console.log(data);
            //                 upload();
            //             },function(err){
            //                 $ionicLoading.show({ template: '失败addGroupMembers', duration: 1500 });
            //                 console.log(err);
            //             })
            //     },function(err){
            //         $ionicLoading.show({ template: '失败createGroup', duration: 1500 });
            //         console.log(err);
            //     })
        }
    }

    function upload(gid){
        $scope.team.teamId=gid;
        $scope.team.sponsorId=Storage.get('UID');
        Doctor.getDoctorInfo({userId:$scope.team.sponsorId})
        .then(function(data){$scope.team.sponsorName=data.results.name;
        Communication.newTeam($scope.team)
        .then(function(data){
            //add members
        
                Communication.insertMember({teamId:$scope.team.teamId,members:$rootScope.newMember})
                .then(function(data){
                  console.log(data)
                },function(err){
                    console.log(err);
                })
            
            $ionicLoading.show({ template: '创建成功', duration: 1500 });
            setTimeout(function(){
                $state.go('tab.groups',{type:'0'});
            },1500);
        },function(err){
            $ionicLoading.show({ template: '失败newTeam', duration: 1500 });
            console.log(err);
        })
        })
    }
    // function onCreateOK(data){
    //     console.log(data);
    //     var idStr='';
    //     for(var i in members) idStr+=members[i].userId+',';
    //     idStr=idStr.slice(0, -1);
    //     $scope.team.teamId=data.gid;
    //     $scope.team.sponsorId=Storage.get('UID');
    //     $scope.team.sponsorName=Storage.get('USERNAME');

    //     communication.newTeam($scope.team)
    //     .then(function(data){
    //         for(var i in members){
    //             communication.insertMember({teamId:$scope.team.teamId,membersuserId:members[i].userId,membersname:members[i].name})
    //             .then(function(data){

    $scope.addMember = function() {
        $state.go('tab.group-add-member', { type: 'new' });
    }
}])
//团队查找
.controller('GroupsSearchCtrl', ['$scope', '$state','Communication','$ionicLoading', function($scope, $state,Communication,$ionicLoading) {
    $scope.search='';
    $scope.noteam=0;
  $scope.Searchgroup=function(){
    $scope.noteam=0;
    console.log($scope.search)
     Communication.getTeam({teamId:$scope.search})
                .then(function(data){
                  console.log(data.results)                 
                  
                  if(data.results==null){
                    $scope.noteam=1;
                    $ionicLoading.show({ template: '查无此群', duration: 1000 })}  
                    else{$scope.teamresult=data}     
                },function(err){
                    console.log(err);
                })
  }
    // $scope.clearSearch=function(){
    //     $scope.search='';
    //  }    


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
//医生查找
.controller('DoctorSearchCtrl', ['$scope', '$state', '$ionicHistory', 'arrTool', 'Communication', '$ionicLoading', '$rootScope', 'Patient', 'JM', 'CONFIG', function($scope, $state, $ionicHistory, arrTool, Communication, $ionicLoading, $rootScope, Patient, JM, CONFIG) {

    //get groupId via $state.params.groupId
    $scope.moredata = true;
    $scope.issearching = true;
    $scope.isnotsearching = false;
    $scope.group = {
        members: []
    }
    $scope.doctors = [];
    $scope.alldoctors = [];
    $scope.skipnum = 0;
    $scope.loadMore = function() {
        // $scope.$apply(function() {
        Patient.getDoctorLists({ skip: $scope.skipnum, limit: 10 })
            .then(function(data) {
                console.log(data.results)
                $scope.$broadcast('scroll.infiniteScrollComplete');

                $scope.alldoctors = $scope.alldoctors.concat(data.results);
                $scope.doctors = $scope.alldoctors;
                $scope.nexturl = data.nexturl;
                var skiploc = data.nexturl.indexOf('skip');
                $scope.skipnum = data.nexturl.substring(skiploc + 5);
                if (data.results.length == 0) { $scope.moredata = false } else { $scope.moredata = true };
            }, function(err) {
                console.log(err);
            })
            // });
    }
    $scope.goSearch = function() {
        $scope.isnotsearching = true;
        $scope.issearching = false;
        $scope.moredata = false;
        Patient.getDoctorLists({ skip: 0, limit: 10, name: $scope.search.name })
            .then(function(data) {
                console.log(data.results)
                $scope.doctors = data.results;
                if (data.results.length == 0) {
                    console.log("aaa")
                    $ionicLoading.show({ template: '查无此人', duration: 1000 })
                }
            }, function(err) {
                console.log(err);
            })
    }
 
    $scope.clearSearch = function() {
        $scope.search.name = '';
        $scope.issearching = true;
        $scope.isnotsearching = false;
        $scope.moredata = true;
        $scope.doctors = $scope.alldoctors;
    }
    $scope.doctorClick = function(doc) {
        console.log(doc)
        $state.go('tab.detail', { type: '2', chatId:doc });
    }
}])



//我的团队
.controller('groupsCtrl', ['$scope', '$http', '$state', '$ionicPopover', 'Doctor', 'Storage', 'Patient','arrTool','$q', function($scope, $http, $state, $ionicPopover, Doctor, Storage, Patient,arrTool,$q) {
    // $scope.teams=[];
    // $scope.doctors=[];
    $scope.query = {
        name: ''
    }
    $scope.params = {
        isTeam: true,
        showSearch: false,
        updateTime: 0
    }
    function msgNoteGen(msg){
        var fromName='',note='';
        if(msg.targetType=='group') fromName=msg.fromName+ ':';
        
        if(msg.contentType=='text'){
            note=msg.content.text;
        }else if(msg.contentType=='image'){
            note='[图片]';
        }else if(msg.contentType=='voice'){
            note='[语音]';
        }else if(msg.contentType=='custom'){
            if(msg.content.contentStringMap.type='card') note='[患者病历]';
            else if(msg.content.contentStringMap.type='contact') note='[联系人名片]';
        }
        return fromName +note;
    }
    function setSingleUnread(doctors){
        return $q(function(resolve,reject){
            if(window.JMessage){
                window.JMessage.getAllSingleConversation(
                function(data){
                    if(data!=''){
                        var conversations = JSON.parse(data);
                        for(var i in doctors){
                            var index=arrTool.indexOf(conversations,'targetId',doctors[i].doctorId.userId);
                            if(index!=-1){
                                doctors[i].unRead=conversations[index].unReadMsgCnt;
                                doctors[i].latestMsg = msgNoteGen(conversations[index].latestMessage);
                                doctors[i].lastMsgDate = conversations[index].lastMsgDate;
                            }
                        }
                    }
                    resolve(doctors);
                },function(err){
                    $scope.doctors = doctors;
                    resolve(doctors);
                });
            }else{
                resolve(doctors);
            }
        });
    }
    function setGroupUnread(teams){
        return $q(function(resolve,reject){
            if(window.JMessage){
                window.JMessage.getAllGroupConversation(
                function(data){
                    if(data!=''){
                       var conversations = JSON.parse(data);
                        for(var i in teams){
                            var index=arrTool.indexOf(conversations,'targetId',teams[i].teamId);
                            if(index!=-1) {
                                teams[i].unRead=conversations[index].unReadMsgCnt;
                                teams[i].latestMsg = msgNoteGen(conversations[index].latestMessage);
                                teams[i].lastMsgDate = conversations[index].lastMsgDate;
                            }
                        } 
                    }
                    resolve(teams);
                },function(err){
                    resolve(teams);
                });
            }else{
                resolve(teams);
            }
        });
    }
    $scope.load = function(force) {
        var time = Date.now();
        if (!force && time - $scope.params.updateTime < 60000){
            setGroupUnread($scope.teams)
            .then(function(teams){
                $scope.teams=teams;
            });
            setSingleUnread($scope.doctors)
            .then(function(doctors){
                $scope.doctors=doctors;
            });
        }else{
            $scope.params.updateTime = time;
            Doctor.getMyGroupList({ userId: Storage.get('UID') })
                .then(function(data) {
                    console.log(data);
                    setGroupUnread(data)
                    .then(function(teams){
                        $scope.teams=teams;
                    });
                });
            Doctor.getRecentDoctorList({ userId: Storage.get('UID') })
                .then(function(data) {
                    console.log(data);
                    setSingleUnread(data.results)
                    .then(function(doctors){
                        $scope.doctors=doctors;
                    });
                }, function(err) {
                    console.log(err)
                });
        }
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        //type:   '0'=team  '1'=doctor
        $scope.params.isTeam = $state.params.type == '0';
        $scope.params.showSearch = false;
    })
    $scope.$on('receiveMessage',function(event, msg) {
        $scope.load();
        // if (msg.targetType == 'single' && msg.fromName == $state.params.chatId) {
        //     viewUpdate(5);
        // }
    });
    $scope.$on('$ionicView.enter', function() {
        $scope.load(true);
    })
    $scope.doRefresh = function(){
        $scope.load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }   
    $scope.showTeams = function() {
        $scope.params.isTeam = true;
    }
    $scope.showDocs = function() {
        $scope.params.isTeam = false;
    }
    $scope.search = function() {
        $scope.params.showSearch = true;
    }
    $scope.closeSearch = function() {
        $scope.params.showSearch = false;
    }
    $scope.clearSearch = function() {
            $scope.query.name = '';
        }
    //popover option
    var options = [{
        name: '搜索团队',
        href: '#/tab/groupsearch'
    }, {
        name: '新建团队',
        href: '#/tab/newgroup'
    }, {
        name: '搜索医生',
        href: '#/tab/doctorsearch'        
    }];
    $ionicPopover.fromTemplateUrl('partials/group/pop-menu.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.options = options;
        $scope.popover = popover;
    });

    // $scope.team1 = [{
    //     photoUrl: "img/avatar.png",
    //     teamId: "22825679",
    //     name: "肾病管理团队",
    //     workUnit: "浙江XXX医院",
    //     sponsorName: '陈有维',
    //     major: "肾上腺分泌失调",
    //     number: 31
    // }, {
    //     photoUrl: "img/avatar.png",
    //     teamId: "22825863",
    //     name: "肾病小组测试",
    //     sponsorName: '陈有维',
    //     workUnit: "浙江XXX医院",
    //     major: "慢性肾炎、肾小管疾病",
    //     number: 12
    // }];

    $scope.itemClick = function(ele, team) {
        if (ele.target.id == 'discuss') $state.go("tab.group-patient", { teamId: team.teamId });
        else $state.go('tab.group-chat', { type: '0', groupId: team.teamId, teamId: team.teamId });
    }
    $scope.doctorClick = function(ele, doc) {
        if (ele.target.id == 'profile') $state.go("tab.group-profile", { memberId: doc.userId });
        else $state.go('tab.detail', { type: '2', chatId: doc.userId });
    }

    $scope.$on('$ionicView.beforeLeave', function() {
        if ($scope.popover) $scope.popover.hide();
    })
    $scope.doctorst = [{
        photoUrl: "img/avatar.png",
        userId: "U201702070041",
        name: "陈有维",
        gender: "男",
        title: "主任医生",
        workUnit: "浙江XXX医院",
        department: "泌尿科",
        major: "肾上腺分泌失调",
        score: '9.5',
        num: 2313
    }, {
        photoUrl: "img/max.png",
        userId: "U201612300431",
        name: "叶青",
        gender: "女",
        title: "主任医生",
        workUnit: "浙江XXX医院",
        department: "泌尿科2",
        major: "慢性肾炎、肾小管疾病",
        score: '9.1',
        num: 525
    }, {
        photoUrl: "img/default_user.png",
        userId: "U201702070048",
        name: "宋树斌",
        gender: "男",
        title: "主任医生",
        workUnit: "浙江XXX医院",
        department: "泌尿科3",
        major: "肾小管疾病、间质性肾炎",
        score: '8.8',
        num: 2546
    }];
}])
//团队病历
.controller('groupPatientCtrl', ['$scope', '$http', '$state', 'Storage', '$ionicHistory','Doctor','$ionicLoading', function($scope, $http, $state, Storage, $ionicHistory,Doctor,ionicLoading) {

    $scope.grouppatients0 = "";
    $scope.grouppatients1 = "";


    $scope.params = {
        teamId: ''
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        // $scope.grouppatients1 = "";
        // $scope.grouppatients2 = "";
        $scope.params.teamId = $state.params.teamId;
        console.log($scope.params);
        $scope.load();
    });
    $scope.load = function() {
        Doctor.getGroupPatientList({ teamId: $scope.params.teamId, status: 1 }) //1->进行中
            .then(function(data) {
                console.log(data)
                $scope.grouppatients0 = data.results
            }, function(err) {
                console.log(err)
            })
        Doctor.getGroupPatientList({ teamId: $scope.params.teamId, status: 0 }) //0->已处理
            .then(function(data) {
                console.log(data);
                $scope.grouppatients1 = data.results;
            }, function(err) {
                console.log(err)
            })
    }

    $scope.doRefresh = function(){
        $scope.load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.enterChat = function(type, patient) {
        $state.go('tab.group-chat', { type: type, teamId: $scope.params.teamId, groupId: patient.consultationId});
    }

    $scope.backToGroups = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.groups', { type: '0' });
    }
    $scope.grouppatients01 = [{
        'id': '22827955',
        'patientId': {
            name: '卢兴芳',
        }
    }]
}])

.controller('GroupAddCtrl', ['$scope', '$state','$ionicHistory','Communication','$ionicPopup', 'Storage','Doctor','$ionicLoading','CONFIG',function($scope, $state,$ionicHistory,Communication,$ionicPopup,Storage,Doctor,$ionicLoading,CONFIG) {
  $scope.$on('$ionicView.beforeEnter',function(){
          $scope.me=[{userId:'',name:'',photoUrl:''}];
         Communication.getTeam({teamId:$state.params.teamId})
                .then(function(data){
                  console.log(data)
                  $scope.group=data.results;
                 if(data.results.sponsorId==Storage.get('UID'))$scope.imnotin=false;
                 else $scope.imnotin=true;
                },function(err){
                    console.log(err);
                })
        
  
    })
    $scope.request =function(){
         var confirmPopup = $ionicPopup.confirm({
            title: '确定要加入吗?',
            // template: '确定要结束此次咨询吗?'
            okText:'确定',
            cancelText:'取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                 Doctor.getDoctorInfo({userId:Storage.get('UID')})
        .then(function(data){
            $scope.me[0].userId=data.results.userId;
            $scope.me[0].name=data.results.name;
            $scope.me[0].photoUrl=data.results.photoUrl;
            var idStr=$scope.me[0].userId;
             setTimeout(function(){ 
                  window.JMessage.addGroupMembersCrossApp($state.params.teamId,CONFIG.appKey,idStr,
                function(data){
                    console.log(data);
                  
                   
                },function(err){
                 
                    console.log(err);
                }) 
             },500);
                Communication.insertMember({teamId:$state.params.teamId,members:$scope.me})
                    .then(function(data){
                        console.log(data)
                        console.log($scope.me[0].userId)
             
                        if(data.result=="更新成员成功"){
                            $ionicLoading.show({ template: '加入成功', duration: 1500 }); 
                            $ionicHistory.nextViewOptions({disableBack: true});
                            $state.go('tab.groups',{type:'0'});
                        }
                        else {$ionicLoading.show({ template: '你已经是成员了', duration: 1500 })};

                        // setTimeout(function(){$ionicHistory.goBack();},1500);
                    })
                
        });
                
            } else {
                console.log('You are not sure');
            }
        });
    }

}])
//"咨询”问题详情
.controller('detailCtrl', ['$scope', '$state', '$rootScope', '$ionicModal', '$ionicScrollDelegate', '$ionicHistory', '$ionicPopover', '$ionicPopup', 'Camera', 'voice', '$http', 'CONFIG', 'arrTool', 'Communication','Account','Counsel','Storage','Doctor','Patient',function($scope, $state, $rootScope, $ionicModal, $ionicScrollDelegate, $ionicHistory, $ionicPopover, $ionicPopup, Camera, voice, $http, CONFIG, arrTool, Communication, Account, Counsel,Storage,Doctor,Patient) {
    $scope.input = {
        text: ''
    }
    $scope.photoUrls={}
    $scope.params = {
            //[type]:0=已结束;1=进行中;2=医生
            type: '',
            counselId:'',
            key: '',
            title: '',
            msgCount: 0,
            helpDivHeight: 60,
            realCounselType:'',
            moreMsgs: true,
            counsel:{},
            recording:false
        }
        // $scope.msgs = [];
    $scope.scrollHandle = $ionicScrollDelegate.$getByHandle('myContentScroll');
    //render msgs 
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.msgs = [];
        $scope.params.key = '';
        $scope.params.chatId = $state.params.chatId;
        $scope.params.counselId = $state.params.counselId;
        $scope.params.type = $state.params.type;
        $scope.params.msgCount = 0;
        console.log($scope.params)
        //获取counsel信息
        if ($scope.params.type != '2') {
            $scope.params.key = CONFIG.crossKey;
            //获取counsel信息
            Counsel.getStatus({doctorId:Storage.get('UID'),patientId:$scope.params.chatId})
            .then(function(data){
                console.log(data)
                $scope.params.counsel = data.result;
                $scope.params.counselId = data.result.counselId;
                $scope.counseltype= data.result.type=='3'?'2':data.result.type;
                $scope.counselstatus=data.result.status;
                $scope.params.realCounselType=data.result.type;
                Account.getCounts({doctorId:Storage.get('UID'),patientId:$scope.params.chatId})
                .then(function(res){
                    var head='',body='';
                    if($scope.counseltype!='1'){
                        head+='问诊';
                        if($scope.counselstatus=='0'){
                            head+='-已结束';
                            body='您仍可以向患者追加回答，该消息不计费';
                        }else{
                            body='患者提问不限次数，您可以手动结束';
                        }
                    }else{
                        head+='咨询';
                        if(res.result.count<=0){
                            head+='-已结束';
                            body='您仍可以向患者追加回答，该消息不计费';
                        }else{
                            body='您还需要回答'+res.result.count+'个问题';
                        }
                    }
                    var alertPopup = $ionicPopup.alert({
                        title: head,
                        template: body
                    });
                })
            
            },function(err){
                console.log(err);
            })
        }
        // Communication.getCounselReport({counselId:$state.params.counselId})
        //         .then(function(data){
        //           console.log(data)
        //           $scope.counseltype=data.results.type;
        //           $scope.counselstatus=data.results.status;
                
        //         },function(err){
        //             console.log(err);
        //         })
         Doctor.getDoctorInfo({userId:Storage.get('UID')})
            .then(function(data){
              $scope.photoUrls[data.results.userId]=data.results.photoUrl;
            });
         Doctor.getDoctorInfo({userId:$state.params.chatId})
            .then(function(data){
              $scope.photoUrls[data.results.userId]=data.results.photoUrl;
            });
         Patient.getPatientDetail({userId:$state.params.chatId})
             .then(function(data){
              $scope.photoUrls[data.results.userId]=data.results.photoUrl;
            });
        // if ($scope.params.type != '2') {
        //     $scope.params.key = CONFIG.crossKey;
        // }
        if ($scope.params.type == '2') $scope.params.title = "医生交流";
        else if ($scope.params.type == '1') $scope.params.title = "咨询-进行中";
        else $scope.params.title = "咨询详情";
        if (window.JMessage) {
            window.JMessage.enterSingleConversation($state.params.chatId, $scope.params.key);
            getMsg(15);
        }
    });

    $scope.$on('$ionicView.enter', function() {
        if ($rootScope.conversation) {
            $rootScope.conversation.type = 'single';
            $rootScope.conversation.id = $state.params.chatId;
        }
        imgModalInit();
    })

    $scope.$on('keyboardshow', function(event, height) {
        $scope.params.helpDivHeight = height + 60;
        setTimeout(function() {
            $scope.scrollHandle.scrollBottom(true);
        }, 100);
    })
    $scope.$on('keyboardhide', function(event) {
        $scope.params.helpDivHeight = 60;
    })
    $scope.$on('$ionicView.beforeLeave', function() {
        if ($scope.popover) $scope.popover.hide();
    })
    $scope.$on('$ionicView.leave', function() {
        if ($scope.params.type == '2' && $scope.msgs.length)
            Communication.updateLastTalkTime($scope.params.chatId, $scope.msgs[$scope.msgs.length - 1].createTimeInMillis);
        if (window.JMessage) window.JMessage.exitConversation();
        $scope.msgs = [];
        if ($scope.modal) $scope.modal.remove();
        $rootScope.conversation.type = null;
        $rootScope.conversation.id = '';
    })
    //receiving new massage
    $scope.$on('receiveMessage', function(event, msg) {
        if (msg.targetType == 'single' && msg.fromName == $state.params.chatId) {
            viewUpdate(5);
        }
    });
        // function msgsRender(first,last){
        //     while(first!=last){
        //         $scope.msgs[first+1].diff=($scope.msgs[first+1].createTimeInMillis-$scope.msgs[first].createTimeInMillis)>300000?true:false;
        //         first++;
        //     }
        // }
    function getMsg(num) {
        console.log('getMsg:' + num);
        window.JMessage.getHistoryMessages("single", $state.params.chatId, $scope.params.key, $scope.params.msgCount, num,
            function(response) {
                // console.log(response);
                $scope.$broadcast('scroll.refreshComplete');
                if (!response) $scope.params.moreMsgs = false;
                else {
                    var res = JSON.parse(response);
                    console.log(res);
                    $scope.$apply(function() {
                        if ($scope.msgs[0]) $scope.msgs[0].diff = ($scope.msgs[0].createTimeInMillis - res[0].createTimeInMillis) > 300000 ? true : false;
                        for (var i = 0; i < res.length - 1; ++i) {
                            res[i].diff = (res[i].createTimeInMillis - res[i + 1].createTimeInMillis) > 300000 ? true : false;
                            $scope.msgs.unshift(res[i]);
                        }
                        $scope.msgs.unshift(res[i]);
                        $scope.msgs[0].diff = true;
                    });
                    setTimeout(function() {
                        $scope.scrollHandle.scrollBottom(true);
                    }, 100);
                    $scope.params.msgCount += res.length;
                }

            },
            function(err) {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

    function viewUpdate(length, scroll) {
        console.log('viewUpdate:' + length);
        if ($scope.params.msgCount == 0) return getMsg(1);
        var num = $scope.params.msgCount < length ? $scope.params.msgCount : length;
        if (num == 0) return;
        window.JMessage.getHistoryMessages("single", $state.params.chatId, $scope.params.key, 0, num,
            function(response) {

                var res = JSON.parse(response);
                console.log(res);
                $scope.$apply(function() {
                    for (var i = res.length - 1, j = $scope.params.msgCount - res.length; i >= 0;) {
                        if (j == $scope.params.msgCount) {
                            $scope.params.msgCount += i + 1;
                            while (i > -1) {
                                if (i != res.length - 1) {
                                    res[i].diff = (res[i].createTimeInMillis - res[i + 1].createTimeInMillis) > 300000 ? true : false;
                                } else if ($scope.msgs.length) {
                                    res[i].diff = (res[i].createTimeInMillis - $scope.msgs[$scope.msgs.length - 1].createTimeInMillis) > 300000 ? true : false;
                                } else {
                                    res[i].diff = true;
                                }
                                $scope.msgs.push(res[i]);
                                i--;
                            }
                            console.log(i);
                            break;
                        } else if (j < $scope.params.msgCount && $scope.msgs[j]['_id'] == res[i]['_id']) {
                            res[i].diff = $scope.msgs[j].diff;
                            $scope.msgs[j] = res[i];
                            ++j;
                            --i;
                        } else {
                            ++j;
                        }

                    }
                });
                // if(scroll){
                setTimeout(function() {
                    $scope.scrollHandle.scrollBottom();
                }, 100);
                // }
            },
            function() {

            });
    }

    $scope.DisplayMore = function() {
        getMsg(15);
    }
    $scope.scrollBottom = function() {
        $scope.showVoice = false;
        $scope.showMore = false;
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
    function imgModalInit() {
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
            // window.JMessage.getConversationList(function(data){console.log(JSON.parse(data));},
            //   function(err){console.log(err)});
            // window.JMessage.getSingleConversation(function(data){console.log(JSON.parse(data));},
            //   function(err){console.log(err)});
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
            },
            function(err) {
                console.log(err);
            })
        $scope.sound.play();
    })

    $scope.$on('holdmsg', function(event, args) {
        $scope.holdId = args[1];
        console.log(args)
        event.stopPropagation();
        $scope.popover.show(args[2]);
    })
  
    $scope.$on('viewcard', function(event, args) {
        console.log(args[1]);
        event.stopPropagation();
        if (args[2].target.tagName == "IMG") {
            $scope.imageHandle.zoomTo(1, true);
            $scope.imageUrl = args[2].target.currentSrc;
            console.log(args[2].target.attributes.hires.nodeValue);
            $scope.modal.show();
        } else {
            Storage.set('getpatientId',args[1].content.contentStringMap.patientId);

            var statep={
            type:$scope.params.type,
            chatId:$scope.params.chatId
            }
            Storage.set('backId','tab.detail');
            Storage.set('singleChatParams',JSON.stringify(statep));
            $state.go('tab.patientDetail');
            // $state.go('tab.consult-detail',{consultId:args[1]});
        }
        // $state.go('tab.consult-detail',{consultId:args[1]});
    })
    $scope.toolChoose = function(data) {
        // console.log(data);
        var content = $scope.msgs[arrTool.indexOf($scope.msgs, '_id', $scope.holdId)].content.contentStringMap;
        if (data == 0) $state.go('tab.selectDoc', { msg: content });
        if (data == 1) $state.go('tab.selectTeam', { msg: content });
    }
    $scope.$on('profile', function(event, args) {
           event.stopPropagation();
        console.log(args[1])
        if(args[1].direct=='receive'){
            if($scope.params.type=='2'){
                return $state.go('tab.group-profile', { memberId: args[1].fromName});
            }else{
                Storage.set('getpatientId',args[1].fromName); 
                var statep={
            type:$scope.params.type,
            chatId:$scope.params.chatId
            }
            Storage.set('backId','tab.detail');
            Storage.set('singleChatParams',JSON.stringify(statep));

                return $state.go('tab.patientDetail');
            }
            
        }

          // if($scope.params.type=='2'){
        //医生
        // $state.go('tab.group-profile', { memberId: args[1].fromName });
        // }else{
            // $state.go('tab.patientDetail', { memberId: args[1] });
        // }
        event.stopPropagation();
    })

    // function endCounsel(type){
    //     Counsel.changeStatus({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,type:type,status:0})
    //     .then(function(data){

    //         var endlMsg={
    //             type:'endl',
    //             info:"咨询已结束",
    //             docId:thisDoctor.userId,
    //             counseltype:1
    //         }
    //         if(type==2) {endlMsg.info="问诊已结束";
    //         endlMsg.counseltype=2
    //         }
    //         var msgJson={
    //             contentType:'custom',
    //             fromID:thisDoctor.userId,
    //             fromName:thisDoctor.name,
    //             fromUser:{
    //                 avatarPath:CONFIG.mediaUrl+'uploads/photos/resized'+thisDoctor.userId+'_myAvatar.jpg'
    //             },
    //             targetID:$scope.params.chatId,
    //             targetName:'',
    //             targetType:'single',
    //             status:'send_going',
    //             createTimeInMillis: Date.now(),
    //             newsType:$scope.params.newsType,
    //             content:endlMsg
    //         }
    //         socket.emit('message',{msg:msgJson,to:$scope.params.chatId});
    //         $scope.counselstatus='0';
    //     });
    //     Counsel.changeCounselStatus({counselId:$state.params.counselId,status:0})
    // }
    // $scope.finishConsult = function() {
    //     var confirmPopup = $ionicPopup.confirm({
    //         title: '确定要结束此次咨询吗?',
    //         // template: '确定要结束此次咨询吗?'
    //         okText: '确定',
    //         cancelText: '取消'
    //     });
    //     confirmPopup.then(function(res) {
    //         if (res) {
    //             endCounsel($scope.params.realCounselType);
    //         } else {
    //         }
    //     });
    // }
    $scope.finishConsult = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: '确定要结束此次问诊吗?',
            // template: '确定要结束此次咨询吗?'
            okText: '确定',
            cancelText: '取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('问诊结束');
                  Counsel.changeStatus({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,type:2,status:0})
                        .then(function(data){
                            $scope.counselstatus='0';
                            $scope.params.title="问诊";
                            Account.modifyCounts({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,modify:900})
                            .then(function(data){
                              console.log(data)
                             })
                            var endlMsg={
                                type:'endl',
                                info:"问诊已结束",
                                docId:Storage.get('UID'),
                                counseltype:2,
                                counselId:$scope.params.counselId

                            }
                            window.JMessage.sendSingleCustomMessage($scope.params.chatId,endlMsg,$scope.params.key,
                                function(response){
                                    console.log(response);
                                  viewUpdate(10);
                                  Communication.postCommunication({messageType:1,sendBy:Storage.get('UID'),receiver:$scope.params.chatId,content:JSON.parse(response)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
                                },function(err){
                                    console.error(err);
                                    alert('[send msg]:err');
                                       viewUpdate(10);
                                })
                            console.log(data)
                             viewUpdate(5, true);
                        })
                        Counsel.changeCounselStatus({counselId:$scope.params.counselId,status:0})

            } else {
                console.log('You are not sure');
            }
        });
    }

    // send message--------------------------------------------------------------------------------
    //

    function onSendSuccess(res) {
        console.log(res);
        viewUpdate(10);
        Communication.postCommunication({messageType:1,sendBy:Storage.get('UID'),receiver:$scope.params.chatId,content:JSON.parse(res)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
       if($scope.counseltype==1 && scope.counselstatus=='1'){//如果是咨询
         Account.modifyCounts({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,modify:'-1'})
                 .then(function(data){
                  console.log(data)
                Account.getCounts({doctorId:Storage.get('UID'),patientId:$scope.params.chatId})
                  .then(function(data){
                     console.log(data)
                     if(data.result.count<=0){ //问题数归零
                        
                        Counsel.changeStatus({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,type:1,status:0})
                        .then(function(data){
                            $scope.counselstatus='0';
                            $scope.params.title="咨询";
                            var endlMsg={
                                type:'endl',
                                info:"咨询已结束",
                                docId:Storage.get('UID'),
                                counseltype:1,
                                counselId:$scope.params.counselId
                            }
                            window.JMessage.sendSingleCustomMessage($scope.params.chatId,endlMsg,$scope.params.key,
                                function(response){
                                    console.log(response);
                                    viewUpdate(10);
                                    Communication.postCommunication({messageType:1,sendBy:Storage.get('UID'),receiver:$scope.params.chatId,content:JSON.parse(response)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
                                },function(err){
                                    console.error(err);
                                     alert('[send msg]:err');
                                       viewUpdate(10);
                                })
                             viewUpdate(5, true);
                        })
                        Counsel.changeCounselStatus({counselId:$scope.params.counselId,status:0})
                     };
                 })
                },function(err){
                    console.log(err);
                })
             };
    }
    // state.param.consultId $scope.counseltype=data.results.type;
                //  $scope.counselstatus=data.results.status;
    // if($scope.counseltype==1)
    // 
   
       
    function onSendErr(err) {
        console.log(err);
        alert('[send msg]:err');
        viewUpdate(10);
    }
    $scope.submitMsg = function() {
        
            window.JMessage.sendSingleTextMessage($state.params.chatId, $scope.input.text, $scope.params.key, onSendSuccess, onSendErr);
            $scope.input.text = '';
            viewUpdate(5, true);
            // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);

        }
    //get image
    $scope.getImage = function(type) {
        $scope.showMore = false;
            Camera.getPicture(type)
                .then(function(url) {
                    console.log(url);

                    window.JMessage.sendSingleImageMessage($state.params.chatId, url, $scope.params.key, onSendSuccess, onSendErr);
                    viewUpdate(5, true);
                    // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);

                }, function(err) {
                    console.log(err)
                })
        }
    //get voice
    $scope.getVoice = function() {
        //voice.record() do 2 things: record --- file manipulation 
        voice.record()
            .then(function(fileUrl) {
                $scope.params.recording=false;
                window.JMessage.sendSingleVoiceMessage($state.params.chatId, fileUrl, $scope.params.key, onSendSuccess, onSendErr);
                viewUpdate(5, true);
            }, function(err) {
                console.log(err);
            });
        $scope.params.recording=true;

    }

    $scope.stopAndSend = function() {
        voice.stopRec();
    }

    $scope.goChats = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        if ($state.params.type == "1") $state.go('tab.doing');
        else if ($state.params.type == "0") $state.go('tab.did');
        else $state.go('tab.groups', { type: '1' });
    }
}])
//团队信息
.controller('GroupDetailCtrl', ['$scope', '$state', '$ionicModal', 'Communication','$ionicPopup','Storage','Doctor',function($scope, $state, $ionicModal,Communication,$ionicPopup,Storage,Doctor) {
    $scope.$on('$ionicView.beforeEnter',function(){
       
         Communication.getTeam({teamId:$state.params.teamId})
                .then(function(data){
                  
                  $scope.team=data.results;
                  $scope.members2=data.results.members;
                  console.log($scope.members2)
            Doctor.getDoctorInfo({userId:$scope.team.sponsorId})
            .then(function(data){
                console.log(data);
               // $scope.members1=data.results;
                 $scope.members=$scope.members2.concat(data.results);
                console.log($scope.members1)
            });
                  if($scope.team.sponsorId==Storage.get('UID')) $scope.ismyteam=true;
                  else $scope.ismyteam=false;
                },function(err){
                    console.log(err);
                })
        

        console.log($scope.team)
    })
    

    $scope.addMember = function() {
        console.log($scope.team.teamId)
        $state.go('tab.group-add-member', {teamId:$scope.team.teamId});
    }
    $scope.viewProfile = function(member){
        $state.go('tab.group-profile',{memberId:member.userId});
    }
    $scope.showQRCode = function() {
        $state.go('tab.group-qrcode', { team: $scope.team });
    }
    $scope.closeModal = function() {
        // $scope.imageHandle.zoomTo(1,true);
        $scope.modal.hide();
        $scope.modal.remove()
    };
    $scope.gokick=function(){
          $state.go('tab.group-kick', { teamId: $scope.team.teamId });

    }
    // $scope.leaveteam=function(){
    //        var confirmPopup = $ionicPopup.confirm({
    //         title: '确定要退出团队吗?',
    //         // template: '确定要结束此次咨询吗?'
    //         okText: '确定',
    //         cancelText: '取消'
    //     });
    //     confirmPopup.then(function(res) {
    //         if (res) {
    //             console.log('You are sure');
    //             console.log($state.params.teamId);
    //             console.log(Storage.get('UID'));
    //             Communication.removeMember({teamId:$state.params.teamId,membersuserId:Storage.get('UID')})
    //             .then(function(data){
    //               console.log(data)
    //             },function(err){
    //                 console.log(err)
    //             })
    //         } else {
    //             console.log('You are not sure');
    //         }
    //     });

    // }

    // $scope.group = {
    //     id: $state.params.groupId,
    //     name: '折翼肾病管家联盟',
    //     admin: 'ABC',
    //     number: 15,
    //     locale: '中国杭州',
    //     createAt: '2016-1-1',
    //     description: 'Material takes cues from contemporary architecture, road signs, pavement marking tape, and athletic courts. Color should be unexpected and vibrant.',
    //     members: [
    //         { url: 'img/avatar.png', name: 'Green' },
    //         { url: 'img/max.png', name: 'Gray' },
    //         { url: 'img/avatar.jpg', name: 'White' },
    //         { url: 'img/max.png', name: 'Blue' },
    //         { url: 'img/max.png', name: 'Black' },
    //         { url: 'img/avatar.png', name: 'Green' },
    //         { url: 'img/max.png', name: 'Gray' },
    //         { url: 'img/max.png', name: 'Blue' },
    //         { url: 'img/max.png', name: 'Black' },
    //         { url: 'img/max.png', name: 'Green' },
    //         { url: 'img/max.png', name: 'Gray' },
    //         { url: 'img/max.png', name: 'Blue' },
    //         { url: 'img/max.png', name: 'Nat King Cole' }
    //     ]
    // }
}])
//踢人
.controller('GroupKickCtrl', ['$scope', '$state','$ionicModal', 'Communication','$ionicPopup','Storage','CONFIG', function($scope, $state,$ionicModal,Communication,$ionicPopup,Storage,CONFIG) {
    $scope.$on('$ionicView.beforeEnter',function(){
       
         Communication.getTeam({teamId:$state.params.teamId})
                .then(function(data){
                  console.log(data)
                  $scope.teamname=data.results.name;
                  $scope.doctors=data.results.members;
                },function(err){
                    console.log(err);
                })
    }) 
     $scope.kick=function(id){
        var confirmPopup = $ionicPopup.confirm({
            title: '确定要将此人移出团队吗?',
            okText: '确定',
            cancelText: '取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                console.log('You are sure');
                console.log($state.params.teamId);
             setTimeout(function(){ 
                  window.JMessage.removeGroupMembersCrossApp($state.params.teamId,CONFIG.appKey,$scope.doctors[id].userId,
                function(data){
                    console.log(data);
                  
                   
                },function(err){
                 
                    console.log(err);
                })
             },500); 
                Communication.removeMember({teamId:$state.params.teamId,membersuserId:$scope.doctors[id].userId})
                .then(function(data){
                  console.log(data)
                    if(data.result=="更新成员成功"){
                      Communication.getTeam({teamId:$state.params.teamId})
                      .then(function(data){
                       console.log(data)
                       $scope.doctors=data.results.members;
                       },function(err){
                       console.log(err);
                      })
                    };
                },function(err){
                    console.log(err)
                })
            } else {
                console.log('You are not sure');
            }
        });
     }   



}])
//团队二维码
.controller('GroupQrcodeCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.params = {
        team: {}
    }
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.team = $state.params.team;
    })
}])
//添加成员
.controller('GroupAddMemberCtrl', ['$scope', '$state', '$ionicHistory', 'arrTool', 'Communication', '$ionicLoading', '$rootScope', 'Patient', 'JM', 'CONFIG', function($scope, $state, $ionicHistory, arrTool, Communication, $ionicLoading, $rootScope, Patient, JM, CONFIG) {

    //get groupId via $state.params.groupId
    $scope.moredata = true;
    $scope.issearching = true;
    $scope.isnotsearching = false;
    $scope.group = {
        members: []
    }
    $scope.doctors = [];
    $scope.alldoctors = [];
    $scope.skipnum = 0;
    $scope.update = function(id) {
        if ($scope.doctors[id].check) $scope.group.members.push({ photoUrl: $scope.doctors[id].photoUrl, name: $scope.doctors[id].name, userId: $scope.doctors[id].userId });
        else $scope.group.members.splice(arrTool.indexOf($scope.group.members, 'userId', $scope.doctors[id].userId), 1);
    }


    $scope.loadMore = function() {
        // $scope.$apply(function() {
        Patient.getDoctorLists({ skip: $scope.skipnum, limit: 10 })
            .then(function(data) {
                console.log(data.results)
                $scope.$broadcast('scroll.infiniteScrollComplete');

                $scope.alldoctors = $scope.alldoctors.concat(data.results);
                $scope.doctors = $scope.alldoctors;
                $scope.nexturl = data.nexturl;
                var skiploc = data.nexturl.indexOf('skip');
                $scope.skipnum = data.nexturl.substring(skiploc + 5);
                if (data.results.length == 0) { $scope.moredata = false } else { $scope.moredata = true };
            }, function(err) {
                console.log(err);
            })
            // });
    }
    $scope.goSearch = function() {
        $scope.isnotsearching = true;
        $scope.issearching = false;


        $scope.moredata = false;
        Patient.getDoctorLists({ skip: 0, limit: 10, name: $scope.search.name })
            .then(function(data) {
                console.log(data.results)
                $scope.doctors = data.results;
                if (data.results.length == 0) {
                    console.log("aaa")
                    $ionicLoading.show({ template: '查无此人', duration: 1000 })
                }
            }, function(err) {
                console.log(err);
            })
    }
    // $scope.closeSearch = function() {
    //     $scope.issearching = true;
    //     $scope.isnotsearching = false;

    //     $scope.moredata = true;
    //     $scope.doctors = $scope.alldoctors;
    //     $scope.search.name = '';

    // }
    $scope.clearSearch = function() {
        $scope.search.name = '';
         $scope.issearching = true;
        $scope.isnotsearching = false;

        $scope.moredata = true;
        $scope.doctors = $scope.alldoctors;
        $scope.search.name = '';
    }

    $scope.confirmAdd = function() {
        if ($state.params.type == 'new') {
            $rootScope.newMember = $rootScope.newMember.concat($scope.group.members);
            $ionicHistory.goBack();
        } else {
            console.log($state.params.teamId)
            var idStr = '';
            for (i = 0; i < $scope.group.members.length; i++) {
                window.JMessage.register($scope.group.members[i].userId, JM.pGen($scope.group.members[i].userId), function(data) {
                    console.log(data);
                }, function(err) {
                    console.log(err);
                });
                if (i == 0) {
                    idStr = $scope.group.members[i].userId
                } else { idStr = idStr + ',' + $scope.group.members[i].userId }
            }


            console.log(idStr);
            // setTimeout(function(){ 
            window.JMessage.addGroupMembersCrossApp($state.params.teamId, CONFIG.appKey, idStr,
                    function(data) {

                        console.log(data);
                    },
                    function(err) {
                        console.log(err);

                    })
                // },500); 
            Communication.insertMember({ teamId: $state.params.teamId, members: $scope.group.members })
                .then(function(data) {
                    console.log(data.result)
                    if (data.result == "更新成员成功") {
                        $ionicLoading.show({ template: '添加成功', duration: 1500 });
                    }
                    setTimeout(function() { $ionicHistory.goBack(); }, 1500);
                })

        }


    }

}])


//团队聊天
.controller('GroupChatCtrl', ['$scope', '$state', '$rootScope', '$ionicHistory', '$http', '$ionicModal', '$ionicScrollDelegate', '$rootScope', '$stateParams', '$ionicPopover', '$ionicPopup', 'Camera', 'voice', 'Communication','Storage','Doctor', function($scope, $state, $rootScope, $ionicHistory, $http, $ionicModal, $ionicScrollDelegate, $rootScope, $stateParams, $ionicPopover, $ionicPopup, Camera, voice, Communication,Storage,Doctor) {
    $scope.input = {
        text: ''
    }
    $scope.photoUrls={}
    $scope.params = {
        type: '', //'0':团队交流  '1': 未结束病历  '2':已结束病历
        groupId: '',
        teamId: '',
        team: {},
        msgCount: 0,
        title: '',
        helpDivHeight: 60,
        hidePanel: true,
        isDiscuss: false,
        isOver: false,
        undergo:true,
        moreMsgs: true,
        ismyturn:0 //是我转发到群里的，具有结论权限
    }
    $rootScope.patient = {}
        // $rootScope.goConclusion =function(){
        //     if(params.type=='2') location.hash = "#conclusion";
        //     else $state.go('tab.group-conclusion',{teamId:params.teamId,groupId:params.groupId,type:params.type});
        // }
    $scope.scrollHandle = $ionicScrollDelegate.$getByHandle('myContentScroll');
    $scope.$on('$ionicView.beforeEnter', function() {
        console.log()
        $rootScope.patient = {
                // name: '卢兴芳',
                // age: '23',
                // teamId: 'team111',
                // groupId: 'group111',
                // undergo: true,
                // gender: '男',
                // time: '4/9/17 12:17',
                // discription: '现在口服药有，早上拜新同两片，中午47.5mg的倍他乐克一片'
            }
            // $rootScope.patient = $state.params.
            //发送信息的extra字段，传递teamId
        $scope.msgExtra = {
            teamId: $state.params.teamId
        };
        $scope.msgs = [];
        $scope.params.msgCount = 0;
        console.log($state.params);
        $scope.params.type = $state.params.type;
        $scope.params.groupId = $state.params.groupId;
        $scope.params.teamId = $state.params.teamId;
        if ($scope.params.type == '0') {
            Communication.getTeam({ teamId: $scope.params.teamId })
                .then(function(data) {
                    console.log(data)
                    $scope.params.team = data.results;
                    for(i=0;i<data.results.members.length;i++){
                        $scope.photoUrls[data.results.members[i].userId]=data.results.members[i].photoUrl;
                    }
                    $scope.params.title = $scope.params.team.name + '(' + ($scope.params.team.number) + ')';
                })
             Doctor.getDoctorInfo({userId:Storage.get('UID')})
            .then(function(data){
              $scope.photoUrls[data.results.userId]=data.results.photoUrl;
            });

        } else if ($scope.params.type == '1') {//进行中
            getConsultation();
          
            $scope.params.hidePanel = false;
            $scope.params.title = '病历讨论';
            $scope.params.isDiscuss = true;
            $scope.params.undergo = true;
            $scope.params.isOver = false;
        } else if ($scope.params.type == '2') {//已处理
            getConsultation();
             
            $scope.params.hidePanel = false;
            $scope.params.title = '病历讨论';
            $scope.params.isDiscuss = true;
            $scope.params.undergo = false;
            $scope.params.isOver = true;
        }



        //  Communication.getConsultation({ consultationId: $scope.params.groupId })
        //         .then(function(data) {
        //             console.log(data)
        //             $rootScope.patient = data.result;
        //             if(data.result.sponsorId.userId==Storage.get('UID')){
        //                 $scope.params.ismyturn=1;
        //             }else{$scope.params.ismyturn=0}
        //          if (data.result.status==1) {//进行中
           
        //     $scope.params.type == '1';
        //     $scope.params.hidePanel = false;
        //     $scope.params.title = '病历讨论';
        //     $scope.params.isDiscuss = true;
        //     $scope.params.undergo = true;
        //     $scope.params.isOver = false;
        //     } else if (data.result.status==0) {//已处理
         
        //     $scope.params.type == '2'; 
        //     $scope.params.hidePanel = false;
        //     $scope.params.title = '病历讨论';
        //     $scope.params.isDiscuss = true;
        //     $scope.params.undergo = false;
        //     $scope.params.isOver = true;
        // }
                    
        //         })
           
        //     }

    })
    $scope.$on('$ionicView.enter', function() {
         console.log($scope.photoUrls);
            $rootScope.conversation.type = 'group';
            $rootScope.conversation.id = $scope.params.groupId;
            if (window.JMessage) {
                window.JMessage.enterGroupConversation($scope.params.groupId);
                getMsg(15);
            }
            imgModalInit();
        })
        //receiving new massage
    $scope.$on('receiveMessage', function(event, msg) {
        console.log(event);
        console.log(msg);
        if (msg.targetType == 'group' && msg.targetID == $scope.params.groupId) {
            viewUpdate(5);
        }
    });
    $scope.$on('keyboardshow', function(event, height) {
        $scope.params.helpDivHeight = height + 60;
        setTimeout(function() {
            $scope.scrollHandle.scrollBottom();
        }, 100);
    })
    $scope.$on('keyboardhide', function(event) {
        $scope.params.helpDivHeight = 60;
        // $ionicScrollDelegate.scrollBottom();
    })
    $scope.$on('$ionicView.beforeLeave', function() {
        if ($scope.popover) $scope.popover.hide();
    })
    $scope.$on('$ionicView.leave', function() {
        $scope.msgs = [];
        if ($scope.modal) $scope.modal.remove();
        $rootScope.conversation.type = null;
        $rootScope.conversation.id = '';
        if (window.JMessage) window.JMessage.exitConversation();
    })
    function getConsultation(){
        Communication.getConsultation({ consultationId: $scope.params.groupId })
                .then(function(data) {
                    console.log(data)
                    $rootScope.patient = data.result;
                    if(data.result.sponsorId.userId==Storage.get('UID')){
                        $scope.params.ismyturn=1;

                    }else{$scope.params.ismyturn=0}
                    if(data.result.status==1){$scope.params.type == '1'}else if(data.result.status==0){$scope.params.type == '2'}
                    
                })
                 Communication.getTeam({ teamId: $scope.params.teamId })
                .then(function(data) {
                    console.log(data)
                    
                    for(i=0;i<data.results.members.length;i++){
                        $scope.photoUrls[data.results.members[i].userId]=data.results.members[i].photoUrl;
                    }
                   
                })
              Doctor.getDoctorInfo({userId:Storage.get('UID')})
            .then(function(data){
              $scope.photoUrls[data.results.userId]=data.results.photoUrl;
            });
    }
    $scope.DisplayMore = function() {
        getMsg(15);
    }
    $scope.scrollBottom = function() {
        $scope.showVoice = false;
        $scope.showMore = false;
        $scope.scrollHandle.scrollBottom(true);
    }

    function getMsg(num) {
        console.log('getMsg:' + num);
        window.JMessage.getHistoryMessages("group", $scope.params.groupId, "", $scope.params.msgCount, num,
            function(response) {
                // console.log(response);
                $scope.$broadcast('scroll.refreshComplete');
                if (!response) $scope.params.moreMsgs = false;
                else {
                    var res = JSON.parse(response);
                    console.log(res);
                    $scope.$apply(function() {
                        if ($scope.msgs[0]) $scope.msgs[0].diff = ($scope.msgs[0].createTimeInMillis - res[0].createTimeInMillis) > 300000 ? true : false;
                        for (var i = 0; i < res.length - 1; ++i) {
                            res[i].diff = (res[i].createTimeInMillis - res[i + 1].createTimeInMillis) > 300000 ? true : false;
                            $scope.msgs.unshift(res[i]);
                        }
                        $scope.msgs.unshift(res[i]);
                        $scope.msgs[0].diff = true;
                    });
                    setTimeout(function() {
                        $scope.scrollHandle.scrollBottom(true);
                    }, 100);
                    $scope.params.msgCount += res.length;
                }
            },
            function(err) {
                $scope.$broadcast('scroll.refreshComplete');
            });
    }

    function viewUpdate(length, scroll) {
        console.log('viewUpdate:' + length);
        if ($scope.params.msgCount == 0) return getMsg(1);
        var num = $scope.params.msgCount < length ? $scope.params.msgCount : length;
        if (num == 0) return;
        window.JMessage.getHistoryMessages("group", $scope.params.groupId, "", 0, num,
            function(response) {

                var res = JSON.parse(response);
                console.log(res);
                $scope.$apply(function() {
                    for (var i = res.length - 1, j = $scope.params.msgCount - res.length; i >= 0;) {
                        if (j == $scope.params.msgCount) {
                            $scope.params.msgCount += i + 1;
                            while (i > -1) {
                                if (i != res.length - 1) {
                                    res[i].diff = (res[i].createTimeInMillis - res[i + 1].createTimeInMillis) > 300000 ? true : false;
                                } else if ($scope.msgs.length) {
                                    res[i].diff = (res[i].createTimeInMillis - $scope.msgs[$scope.msgs.length - 1].createTimeInMillis) > 300000 ? true : false;
                                } else {
                                    res[i].diff = true;
                                }
                                $scope.msgs.push(res[i]);
                                i--;
                            }
                            console.log(i);
                            break;
                        } else if (j < $scope.params.msgCount && $scope.msgs[j]['_id'] == res[i]['_id']) {
                            res[i].diff = $scope.msgs[j].diff;
                            $scope.msgs[j] = res[i];
                            ++j;
                            --i;
                        } else {
                            ++j;
                        }

                    }
                });
                // if(scroll){
                setTimeout(function() {
                    $scope.scrollHandle.scrollBottom();
                }, 100);
                // }
            },
            function() {

            });
    }

    // function msgsRender(first,last){
    //     while(first!=last){
    //         $scope.msgs[first+1].diff=($scope.msgs[first+1].createTimeInMillis-$scope.msgs[first].createTimeInMillis)>300000?true:false;
    //         first++;
    //     }
    // }
    // $http.get("data/sampleMsgs.json").success(function(data) {
    //     $scope.msgs = data;
    //     // $scope.$apply(function(){
    //         msgsRender(0,data.length-1);
    //     // });
    //     // 

    // });


    $scope.togglePanel = function() {
        $scope.params.hidePanel = !$scope.params.hidePanel;
    }
    $scope.viewGroup = function(){
        $state.go('tab.group-detail',{teamId:$scope.params.teamId});
    }

    $scope.content = {
            pics: [
                'img/avatar.png',
                'img/ben.png',
                'img/mike.png'
            ]
        }
        //长按工具条
    // var options = [{
    //     name: '转发医生',
    // }, {
    //     name: '转发团队',
    // }]
    // $ionicPopover.fromTemplateUrl('partials/others/toolbox-pop.html', {
    //     scope: $scope,
    // }).then(function(popover) {
    //     $scope.options = options;
    //     $scope.popover = popover;
    // });
     $scope.$on('holdmsg', function(event, args) {
        console.log(args)
        event.stopPropagation();

        // $scope.popover.show(args[2]);
    })
    //view image
    function imgModalInit() {
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

    function onImageLoad(path) {
        $scope.$apply(function() {
            $scope.imageUrl = path;
        })
    }

    function onImageLoadFail(err) {

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
   
    $scope.$on('image', function(event, args) {
        console.log(args)
        event.stopPropagation();
        $scope.imageHandle.zoomTo(1, true);
        $scope.imageUrl = args[2];
        $scope.modal.show();
        // if (args[1] == 'img') {
        window.JMessage.getOriginImageInSingleConversation($state.params.chatId, args[3], onImageLoad, onImageLoadFail);
        // } else {
        // $scope.imageUrl = args[3];
        // }
    })
    $scope.$on('profile', function(event, args) {
        console.log(args)
        event.stopPropagation();
        $state.go('tab.group-profile', { memberId: args[1] });
    })
    // $scope.$on('viewcard', function(event, args) {
    //     console.log(args);
    //     event.stopPropagation();
    //     Storage.set('getpatientId',args[1]);
    //     $state.go('tab.patientDetail');
    //     // if (args[2].target.tagName == "IMG") {
    //     //     $scope.imageHandle.zoomTo(1, true);
    //     //     $scope.imageUrl = args[2].target.currentSrc;
    //     //     console.log(args[2].target.attributes.hires.nodeValue);
    //     //     $scope.modal.show();
    //     // }
    //     // else{
    //     //     $state.go('tab.consult-detail',{consultId:args[1]});
    //     // }
    //     // $state.go('tab.consult-detail',{consultId:args[1]});
    // })

     $scope.$on('viewcard', function(event, args) {
        console.log(args[1]);
        event.stopPropagation();
        if (args[2].target.tagName == "IMG") {
            $scope.imageHandle.zoomTo(1, true);
            $scope.imageUrl = args[2].target.currentSrc;
            console.log(args[2].target.attributes.hires.nodeValue);
            $scope.modal.show();
        }
         else if ($scope.params.type == '0') {
            // getConsultation();
            Communication.getConsultation({ consultationId: args[1].content.contentStringMap.consultationId })
                .then(function(data) {
                    var stype;
                    if(data.result.status==1){stype = '1'}else{stype = '2'}
                    // setTimeout(function() {
                        $state.go('tab.group-chat', { type: stype,  groupId:args[1].content.contentStringMap.consultationId, teamId: $scope.params.teamId });
                    // }, 500);  
                    
                })
     
         }
        // $state.go('tab.consult-detail',{consultId:args[1]});
    })

    $scope.toolChoose = function(data) {
        // console.log(data);
        if (data == 0) $state.go('tab.selectDoc');
        if (data == 1) $state.go('tab.selectTeam');
    }
    $scope.viewPic = function(src) {
        $scope.imageUrl = src;
        $scope.modal.show();
    }
    $scope.viewPatient = function(pid){
        Storage.set('getpatientId',pid);
        var statep={
            type:$scope.params.type,
            groupId:$scope.params.groupId,
            teamId:$scope.params.teamId
        }
        Storage.set('backId','tab.group-chat');
        Storage.set('groupChatParams',JSON.stringify(statep));
        $state.go('tab.patientDetail');

    }
    function onSendSuccess(res) {
        console.log(res);
        viewUpdate(10);
         Communication.postCommunication({messageType:2,sendBy:Storage.get('UID'),receiver:$scope.params.groupId,content:JSON.parse(res)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
    }

    function onSendErr(err) {
        console.log(err);
        alert('[send msg]:err');
        viewUpdate(20);
    }
    $scope.submitMsg = function() {
            window.JMessage.sendGroupTextMessageWithExtras($scope.params.groupId, $scope.input.text, $scope.msgExtra, onSendSuccess, onSendErr);
            $scope.input.text = '';
            viewUpdate(5, true);
            // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);

        }
        //get image
    $scope.getImage = function(type) {
        $scope.showMore = false;
            Camera.getPicture(type)
                .then(function(url) {
                    console.log(url);

                    window.JMessage.sendGroupImageMessageWithExtras($scope.params.groupId, url, $scope.msgExtra, onSendSuccess, onSendErr);
                    viewUpdate(5, true);
                    // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);

                }, function(err) {
                    console.log(err)
                })
        }
        //get voice
    $scope.getVoice = function() {
        //voice.record() does 2 things: record --- file manipulation 
        voice.record()
            .then(function(fileUrl) {
                window.JMessage.sendGroupVoiceMessageWithExtras($scope.params.groupId, fileUrl, $scope.msgExtra,
                    function(res) {
                        console.log(res);
                        $scope.params.recording=false;
                        viewUpdate(5, true);
                        Communication.postCommunication({messageType:2,sendBy:Storage.get('UID'),receiver:$scope.params.groupId,content:JSON.parse(res)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
                    },
                    function(err) {
                        console.log(err);
                    });
                viewUpdate(5, true);
            }, function(err) {
                console.log(err);
            });
        $scope.params.recording=true;
    }
    $scope.stopAndSend = function() {
        voice.stopRec();
    }
    $scope.goChats = function() {
        console.log($ionicHistory);
        console.log($scope.params);

        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        if ($scope.params.type == '0') $state.go('tab.groups', { type: '0' });
        else $state.go('tab.group-patient', { teamId: $scope.params.teamId });
    }
    $scope.goConclusion =function(){
        $state.go('tab.group-conclusion',{groupId:$scope.params.groupId,teamId:$scope.params.teamId});
    }
}])
//病历结论
.controller('GroupConclusionCtrl',['$state','$scope','$ionicModal','$ionicScrollDelegate','Communication','$ionicLoading','CONFIG','Storage',function($state,$scope,$ionicModal,$ionicScrollDelegate,Communication,$ionicLoading,CONFIG,Storage){
   
   $scope.input = {
        text: ''
    }
     $scope.params = {
        type: '',
        groupId: '',
        teamId: '',
        chatId:''///回复患者讨论结论
    }
    $scope.content = {
        pics: [
            'img/avatar.png',
            'img/ben.png',
            'img/mike.png'
        ]
    }
   
    $scope.$on('$ionicView.beforeEnter', function() {
            $scope.params.type = $state.params.type;
            $scope.params.groupId = $state.params.groupId;
            $scope.params.teamId = $state.params.teamId;
             Communication.getConsultation({ consultationId: $state.params.groupId })
                .then(function(data) {
                    console.log(data)
                    $scope.patient = data.result;
                    
                })
        })
        // $scope.save = function() {
        //     var confirmPopup = $ionicPopup.confirm({
        //         title: '确定要结束此次咨询吗?',
        //         // template: '确定要结束此次咨询吗?'
        //         okText:'确定',
        //         cancelText:'取消'
        //     });
        //     confirmPopup.then(function(res) {
        //         if (res) {
        //             console.log('You are sure');
        //         } else {
        //             console.log('You are not sure');
        //         }
        //     });
        // }
        //view image
    $scope.zoomMin = 1;
    $scope.imageUrl = '';
    $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.imageHandle = $ionicScrollDelegate.$getByHandle('imgScrollHandle');
    });
    $scope.closeModal = function() {
        $scope.imageHandle.zoomTo(1, true);
        $scope.modal.hide();
        // $scope.modal.remove()
    };
    $scope.viewPic = function(src) {
        $scope.imageUrl = src;
        $scope.modal.show();
        // $scope.modal.remove()
    };
    $scope.switchZoomLevel = function() {
        if ($scope.imageHandle.getScrollPosition().zoom != $scope.zoomMin)
            $scope.imageHandle.zoomTo(1, true);
        else {
            $scope.imageHandle.zoomTo(3, true);
        }
    }
    $scope.save = function(){
       
         Communication.conclusion({consultationId:$state.params.groupId,conclusion:$scope.input.text,status:0})
                .then(function(data){
                  console.log(data)
                  Communication.getCounselReport({ counselId: $scope.patient.diseaseInfo.counselId })
                    .then(function(data) {
                        console.log(data.results)
                        $scope.counseltype=data.results.type;
                        $scope.counselstatus=data.results.status;
                        $scope.params.chatId=data.results.patientId.userId;
                        window.JMessage.sendSingleTextMessage(data.results.patientId.userId, $scope.input.text, CONFIG.crossKey,
                         function(response){
                        console.log(response);
                         Communication.postCommunication({messageType:1,sendBy:Storage.get('UID'),receiver:$scope.params.chatId,content:JSON.parse(response)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
                  if($scope.counseltype==1){//如果是咨询
                  Account.modifyCounts({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,modify:'-1'})
                 .then(function(data){
                  console.log(data)
                  Account.getCounts({doctorId:Storage.get('UID'),patientId:$scope.params.chatId})
                  .then(function(data){
                     console.log(data)
                     if(data.result<=0){ //问题数归零
                         $scope.counselstatus='0';
                        $scope.params.title="咨询";
                        Counsel.changeStatus({doctorId:Storage.get('UID'),patientId:$scope.params.chatId,type:1,status:0})
                        .then(function(data){
                            var endlMsg={
                                type:'endl',
                                info:"咨询已结束",
                                docId:Storage.get('UID'),
                                counseltype:1
                            }
                            window.JMessage.sendSingleCustomMessage($scope.params.chatId,endlMsg,CONFIG.crossKey,
                                function(response){
                                    console.log(response);
                                   Communication.postCommunication({messageType:1,sendBy:Storage.get('UID'),receiver:$scope.params.chatId,content:JSON.parse(response)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
                                },function(err){
                                    console.error(err);
                                     alert('[send msg]:err');
                                      
                                })
                             
                        })
                        Counsel.changeCounselStatus({counselId:$state.params.counselId,status:0})
                     };
                 })
                },function(err){
                    console.log(err);
                })
             };
                                },function(err){
                                    console.error(err);
                                    alert('[send msg]:err');
                                  })

                    })

                 $ionicLoading.show({ template: '回复成功', duration: 1500 }); 
                   setTimeout(function(){
                $state.go('tab.groups',{type:'0'});
            },1500);                
                },function(err){
                    console.log(err);
                })
    }

    $scope.$on('$ionicView.leave', function() {
        if ($scope.modal) $scope.modal.remove();
    })
}])
.controller('selectDocCtrl', ['$state', '$scope', 'JM', '$ionicPopup','$ionicLoading','$ionicScrollDelegate','Patient', 'Storage', 'Communication',function($state, $scope, JM, $ionicPopup,$ionicLoading,$ionicScrollDelegate,Patient, Storage,Communication) {
    $scope.params={
        moredata:true,
        skip:0,
        limit:20,
        query:'',
        isSearch:false
    }
    var allDoctors=[];
    $scope.doctors=[];
    $scope.$on('$ionicView.beforeEnter',function(){
        $ionicScrollDelegate.scrollTop();
        $scope.params.query='';
        $scope.params.isSearch=false;
        console.log($scope.params.moredata);
        console.log($scope.params.isSearch);
    })
    
    $scope.loadMore = function() {
        Patient.getDoctorLists({ skip: $scope.params.skip, limit: $scope.params.limit })
            .then(function(data) {
                console.log(data.results)
                $scope.$broadcast('scroll.infiniteScrollComplete');
                allDoctors = $scope.doctors.concat(data.results);
                $scope.doctors = allDoctors;
                $scope.params.skip+=data.results.length;
                if (data.results.length <$scope.params.limit) 
                    $scope.moredata = false;
            }, function(err) {
                console.log(err);
            })
    }

    // $scope.clearSearch = function(){
    //     $scope.params.query='';
    //     console.log('clearSearch');

    // }
    $scope.$watch('params.query',function(val,val1){
        if($scope.params.query==''){
            $scope.doctors=allDoctors;
            $scope.params.isSearch=false;
            // angular.element('#searchBox').focus();
        }
    })
    $scope.docSearch = function(){
        if(!$scope.params.isSearch){
             $ionicLoading.show();
            Patient.getDoctorLists({ skip: 0, limit: 100, name: $scope.params.query })
            .then(function(data){
                if (data.results.length == 0) {
                        $ionicLoading.show({ template: '结果为空', duration: 1000 });
                    }else{
                        $ionicLoading.hide();
                        allDoctors=$scope.doctors;
                        $scope.doctors = data.results;
                        $scope.params.isSearch=true;
                    }
            }, function(err) {
                    console.log(err);
                })
        }else{
            $scope.doctors = allDoctors;
            $scope.params.query='';

        }
    }
    $scope.sendTo = function(doc) {
        var confirmPopup = $ionicPopup.confirm({
            title: '转发给：' + doc.name,
            // template: '确定要结束此次咨询吗?'
            okText: '确定',
            cancelText: '取消'
        });
        confirmPopup.then(function(res) {
            if (res) {
                var msgdata = $state.params.msg;
                msgdata.fromId = Storage.get('UID');
                msgdata.targetId = doc.userId;
                // window.JMessage.sendGroupTextMessageWithExtras(doc.userId,'[咨询转发]',msgdata,'',
                //     function(m){
                //         console.log(m);
                //         setTimeout(function() { $state.go('tab.detail', { type: '2', chatId: doc.userId }); }, 200);
                //     },function(err){
                //         console.error(err);
                //     });
                JM.sendCustom('single', doc.userId, '', msgdata)
                    .then(function(data) {
                        console.log(data)
                        Communication.postCommunication({messageType:1,sendBy:Storage.get('UID'),receiver:doc.userId,content:JSON.parse(data)})
                                  .then(function(data){
                                    console.log(data);
                                  },function(err){
                                    console.error(err);
                                    })
                        setTimeout(function() { $state.go('tab.detail', { type: '2', chatId: doc.userId }); }, 200);
                    }, function(err) {
                        console.info('转发失败');
                        console.log(err);
                    })
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    }
}])
.controller('selectTeamCtrl', ['$state', '$scope', 'JM', '$ionicPopup', 'Doctor', 'Communication', 'Storage', function($state, $scope, JM, $ionicPopup, Doctor, Communication, Storage) {
    $scope.params={
        // isSearch:false,
    }
    $scope.query={
        name:'',
    }
    console.log($state.params);
    Doctor.getMyGroupList({ userId: Storage.get('UID') })
        .then(function(data) {
            $scope.teams = data;
        }, function(err) {
            console.log(err);
        });
    // $scope.clearSearch = function(){
    //     $scope.query.name='';
    // }
    // $scope.$watch('query.name',function(newVal,oldVal){
    //     if(newVal==''){
    //         $scope.params.isSearch=false;
    //     }
    // })
    $scope.sendTo = function(team) {
            var confirmPopup = $ionicPopup.confirm({
                title: '转发给：' + team.name,
                // template: '确定要结束此次咨询吗?'
                okText: '确定',
                cancelText: '取消'
            });
            confirmPopup.then(function(res) {
                if (res) {
                    window.JMessage.getGroupMembers(team.teamId,
                        function(response) {
                            var res = JSON.parse(response);
                            console.log(res);
                            var u = [];
                            for (var i = 1; i < res.length; i++) u.push(res[i].userName);
                            u = u.join(',');
                            // var gn = md5($state.params.msg.counsel.counselId + team.teamId, "kidney").substr(4, 8) $state.params.msg.patientName+'-'+team.name
                            window.JMessage.createGroup($state.params.msg.patientName+'-'+team.name, 'consultatioin_open', u,
                                function(gid) {
                                    console.log(gid);
                                    var d = {
                                        teamId: team.teamId,
                                        counselId: $state.params.msg.counselId,
                                        sponsorId: $state.params.msg.doctorId,
                                        patientId: $state.params.msg.patientId,
                                        consultationId: gid,
                                        status: '1'
                                    }
                                    var msgdata = {
                                        counsel: $state.params.msg.counsel,
                                        type: 'card',
                                        counselId: $state.params.msg.counselId,
                                        patientId: $state.params.msg.patientId,
                                        doctorId: $state.params.msg.doctorId,
                                        targetId: team.teamId,
                                        fromId: Storage.get('UID'),
                                        consultationId: gid
                                    }
                                    Communication.newConsultation(d)
                                        .then(function(con) {
                                            // window.JMessage.sendGroupTextMessageWithExtras(d.consultationId,'[团队咨询]',msgdata,
                                            //     function(m){
                                            //         console.log(m);
                                            //         setTimeout(function(){
                                            //             $state.go('tab.group-chat', { type: '1', groupId: gid, teamId: team.teamId });
                                            //         },200);
                                            //     },function(err){
                                            //         console.error(err);
                                            //     });
                                            console.log(con)
                                            window.JMessage.sendGroupCustomMessage(team.teamId, msgdata,
                                                function(m) {
                                                    console.log(m);
                                                     Communication.postCommunication({messageType:2,sendBy:Storage.get('UID'),receiver:team.teamId,content:JSON.parse(m)})
                                                      .then(function(data){
                                                           console.log(data);
                                                          },function(err){
                                                         console.error(err);
                                                          })
                                                    $state.go('tab.group-chat', { type: '0', teamId: team.teamId, groupId:team.teamId });
                                                },
                                                function(err) {
                                                    console.log(err);
                                                });
                                        }, function(err) {
                                            console.log(err);
                                        })

                                },
                                function(err) {
                                    console.log(err);
                                })
                        },
                        function(err) {
                            console.log(err);
                        })
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        }
}])
.controller('consultDetailCtrl', ['$state', '$scope', '$ionicModal', '$ionicScrollDelegate', function($state, $scope, $ionicModal, $ionicScrollDelegate) {
    $scope.consult = {
        name: '李大山',
        age: '56',
        gender: '男',
        time: '4/11/17 8:57',
        discription: '现在口服药有，早上拜新同两片，中午47.5mg的倍他乐克一片',

    }
    $scope.content = {
            pics: [
                'img/avatar.png',
                'img/max.png',
                'img/ionic.png'
            ]
        }
        //view image
    $scope.zoomMin = 1;
    $scope.imageUrl = '';
    $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        // $scope.modal.show();
        $scope.imageHandle = $ionicScrollDelegate.$getByHandle('imgScrollHandle');
    });
    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
            $scope.imageHandle = $ionicScrollDelegate.$getByHandle('imgScrollHandle');
        });
    }
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
    $scope.viewPic = function(url) {
        $scope.imageUrl = url;
        $scope.modal.show();
    }
    $scope.$on('$ionicView.leave', function() {
        if ($scope.modal) $scope.modal.remove();
    })
}])
.controller('doctorProfileCtrl',['$scope','$state','Doctor','Storage',function($scope,$state,Doctor,Storage){
    $scope.doctor={};
    $scope.goChat = function(){
        $state.go('tab.detail',{type:'2',chatId:$state.params.memberId});
    }
    $scope.$on('$ionicView.beforeEnter',function(){
        console.log($state.params.memberId)
        if($state.params.memberId==Storage.get('UID'))$scope.isme=true;
        else $scope.isme=false;
        // if($scope.doctor.userId!=$state.params.member.userId){
        //     $scope.doctor=$state.params.member;

            Doctor.getDoctorInfo({userId:$state.params.memberId})
            .then(function(data){
                console.log(data);
                $scope.doctor=data.results;
            });
        // }
    })
    // $scope.teams=[
    //       {
    //           photoUrl:"img/avatar.png",
    //           groupId:"D201703240001",
    //           name:"浙一肾病管理团队",
    //           workUnit:"浙江XXX医院",
    //           major:"肾上腺分泌失调",
    //           num:31
    //       }];
}])
