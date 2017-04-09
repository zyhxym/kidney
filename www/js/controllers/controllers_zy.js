angular.module('zy.controllers', ['ionic','kidney.services'])

/////////////////////////////zhangying////////////////////////
//登录
.controller('SignInCtrl', ['$scope','$timeout','$state','Storage','loginFactory','$ionicHistory', function($scope, $timeout,$state,Storage,loginFactory,$ionicHistory) {
//.controller('SignInCtrl', ['$scope','$timeout','$state','Storage','loginFactory','$ionicHistory', function($scope, $timeout,$state,Storage,loginFactory,$ionicHistory) {
  $scope.barwidth="width:0%";
  if(Storage.get('USERNAME')!=null){
    $scope.logOn={username:Storage.get('USERNAME'),password:""};

  }else{
    $scope.logOn={username:"",password:""};
  }
  $scope.signIn = function(logOn) {  
    $scope.logStatus='';
  
   //记录登录状态
   var flag=false;
    if((logOn.username!="") && (logOn.password!="")){
      var phoneReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      //手机正则表达式验证
      if(!phoneReg.test(logOn.username)){$scope.logStatus="手机号验证失败！";}
      else{
        var usernames = Storage.get('usernames');
      usernames="13709553333,18366113563,18366113564";
      passwords="123,111,111";
        var index = usernames.indexOf(logOn.username);
        console.log(index);
      //测试
        if(index>=0){//查找手机号是否注册过，是否在数据库里
          //判断密码是否正确
          console.log(usernames[index]);
          console.log(passwords[index]);
          var passwords = Storage.get('passwords');
          //if(logOn.password != passwords[index]){$scope.logStatus = "密码错误！";}
        //if(logOn.username!="18366113562"||logOn.password!="123") {$scope.logStatus = "密码错误！";}//登录名写死
        //if(loginFactory.isLogin()==false){$scope.logStatus = "密码错误！";}
        if(loginFactory.isLogin(logOn.username,logOn.password)==false){$scope.logStatus = "密码错误！";}
          else{
          Storage.set('USERNAME',logOn.username);
          Storage.set('IsSignIn','YES');
          $scope.logStatus = "登录成功";
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $timeout(function(){$state.go('tab.home');},500);
          flag=true;//登录成功
          }
        }
        else{
          $scope.logStatus = "手机号未激活，请注册！"
        }
      }
      

    }
    else{
      $scope.logStatus="请输入完整信息！";
    }
  
  //Storage.set("isSignIN")="YES";
  console.log($state);
  //$state.go('tab.home');
    if(flag==true)$state.go('tab.home');    
  }
  $scope.toRegister = function(){
    console.log($state);
    $state.go('phonevalid');   
   
  }
  $scope.toReset = function(){
    $state.go('phonevalid');
   
  } 
  
}])


//手机号码验证
.controller('phonevalidCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.barwidth="width:0%";
  
  $scope.veriusername="" 
  $scope.verifyCode="";
  $scope.veritext="获取验证码";
  $scope.isable=false;
  var unablebutton = function(){      
     //验证码BUTTON效果
    $scope.isable=true;
    $scope.veritext="180S再次发送"; 
    var time = 179;
    var timer;
    timer = $interval(function(){
      if(time==0){
        $interval.cancel(timer);
        timer=undefined;        
        $scope.veritext="获取验证码";       
        $scope.isable=false;
      }else{
        $scope.veritext=time+"S再次发送";
        time--;
      }
    },1000);
  }
  //发送验证码
  var sendSMS = function(){
      //结果分为1、验证码发送失败;2、发送成功，获取稍后
    $scope.logStatus="您的验证码已发送，重新获取请稍后";
  }
  //点击获取验证码
  $scope.getcode=function(veriusername){
     $scope.logStatus='';
     if ($scope.veriusername=="") {$scope.logStatus="手机号码不能为空！";return;}
     var phoneReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      //手机正则表达式验证
     if(!phoneReg.test(logOn.veriusername)){$scope.logStatus="手机号验证失败！";return;}
     //先判断用户是否注册过
     var usernames = Storage.get('usernames');
      if (usernames.indexOf($scope.veriusername)>=0) {$scope.logStatus = "该手机号码已经注册！";return;}
     
  


  }

 
  
}])

//首页
.controller('homeCtrl', [
    'Doctors','$scope','$state','$interval','$rootScope', 'Storage','$http','$sce',
     function(Doctors,$scope, $state,$interval,$rootScope,Storage,$http,$sce) {
  $scope.barwidth="width:0%";
  $scope.navigation=$sce.trustAsResourceUrl("http://121.43.107.106/");
  console.log(123)
  ionic.DomUtil.ready(function(){
      $http({
        method  : 'POST',
        url     : 'http://121.43.107.106/member.php?mod=logging&action=login&loginsubmit=yes&loginhash=$loginhash&mobile=2',
        params    : {'username':'admin','password':'bme319'},  // pass in data as strings
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
      }).success(function(data) {
            //console.log(data);
      });
  })

  $scope.testRestful=function()
  {
    console.log("test for restful")
      Doctors.createDoctor({
        userId:'docpostTest1',
        name:'姓名',
        birthday:'1956-05-22',
        gender:1,
        workUnit:'浙江省人民医院',
        department:'肾内科',
        title:'副主任医师',
        major:'慢性肾炎',
        description:'经验丰富',
        photoUrl:'http://photo/docpost3.jpg',
        charge1:150,
        charge2:50
      })
    .then(
      function(data)
      {
        console.log(data)
      },
      function(err)
      {
        console.log(err)
      }
    )
  }
}])

//咨询
.controller('consultCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.barwidth="width:0%";
  //变量a 等待患者数量 变量b 已完成咨询患者数量
  $scope.doctor={a:3,b:3};
  var now=new Date();
  var year=now.getYear();
  var month=now.getMonth()+1;
  var day=now.getDate();
  var date1=month+"月"+day+"日";
  //var date1=new Date().format("MM月dd日");
  $scope.riqi=date1;
}])

//"咨询”进行中
.controller('doingCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.patients=[
    {
      head:"default_user.png",
      name:"王大头",
      gender:"男",
      age:"32",
      time:"2017/3/27 9:32",
      qs:"问题1" 
    },
    {
      head:"default_user.png",
      name:"王二头",
      gender:"男",
      age:"32",
      time:"2017/3/28 10:32",
      qs:"问题2" 
    },
    {
      head:"default_user.png",
      name:"王三头",
      gender:"男",
      age:"29",
      time:"2017/3/28 10:32",
      qs:"问题2" 
    }
    ];
}])

//"咨询”已完成
.controller('didCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.patients=[
    {
      head:"default_user.png",
      name:"王大头",
      gender:"男",
      age:"32",
      time:"2017/3/27 9:32",
      qs:"问题1" 
    },
    {
      head:"default_user.png",
      name:"王二头",
      gender:"男",
      age:"32",
      time:"2017/3/28 10:32",
      qs:"问题2" 
    },
    {
      head:"default_user.png",
      name:"王三头",
      gender:"男",
      age:"29",
      time:"2017/3/28 10:32",
      qs:"问题2" 
    }
    ];
}])

//"咨询”问题详情
.controller('detailCtrl', ['$scope','$state','$rootScope', '$ionicModal','$ionicScrollDelegate','$ionicHistory','$cordovaFile','Camera','voice',function($scope,$state,$rootScope, $ionicModal,$ionicScrollDelegate,$ionicHistory,$cordovaFile,Camera,voice) {
    $scope.test= function(){alert('abc');};
    $scope.input={
        text:''
    }
    $scope.params={
        msgCount:0,
        helpDivHeight:40,
        hidePanel:true
        // helpDivStyle:"{'padding-top':'100px'}"
    }
    $scope.msgs=[];
    $scope.scrollHandle=$ionicScrollDelegate.$getByHandle('myContentScroll');
    //render msgs 
    $scope.$on('$ionicView.beforeEnter',function(){
        getMsg(30);
    });
    $scope.$on('$ionicView.enter',function(){
        $rootScope.conversation.type='single';
        $rootScope.conversation.id=$state.params.chatId;
        if(window.JMessage){
            window.JMessage.enterSingleConversation($state.params.chatId,"");
        }
    })
    function getMsg(num){
        window.JMessage.getHistoryMessages("single",$state.params.chatId,"",$scope.params.msgCount,num,
            function(response){

                var res=JSON.parse(response);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$apply(function(){
                    for(var i=0;i<res.length;++i) $scope.msgs.unshift(res[i]);    
                });
                console.log($scope.msgs);
                setTimeout(function(){
                    $scope.scrollHandle.scrollBottom();
                },100);
                // $ionicScrollDelegate.scrollBottom();
                $scope.params.msgCount+=res.length;
            },
            function(err){
            });
    }
    function viewUpdate(length,scroll){
        var num = $scope.params.msgCount<length?$scope.params.msgCount:length;
         window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,num,
            function(response){

                var res=JSON.parse(response);
                $scope.$apply(function(){
                    for(var i=res.length-1,j=$scope.params.msgCount-res.length;i>=0;){
                        if(j==$scope.params.msgCount){
                            $scope.params.msgCount+=i+1;
                            $scope.msgs=$scope.msgs.concat(res.slice(0,i+1));
                            break;
                        }else if($scope.msgs[j]['_id']==res[i]['_id']){
                            $scope.msgs[j]=res[i];
                            ++j;--i;
                        }else{
                             ++j;
                        }

                    }   
                });
                if(scroll){
                    setTimeout(function(){
                        $scope.scrollHandle.scrollBottom();
                    },100);
                }
            },function(){

            });
    }
    // function updateOne(msg){

    // }
    // function addOne(){

    // }
    //receiving new massage
    $scope.$on('receiveMessage',function(event,msg){
        if(msg.targetType=='single' && msg.fromName==$state.params.chatId){
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
    $scope.DisplayMore = function(){
        getMsg(30);
    }
    $scope.scrollBottom = function(){
        $scope.scrollHandle.scrollBottom();
    }
    

    //view image
    $scope.zoomMin=1;
    $scope.imageUrl='';
    $scope.sound={};
    $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        // $scope.modal.show();
        $scope.imageHandle=$ionicScrollDelegate.$getByHandle('imgScrollHandle');
    });
    function onImageLoad(path){
        $scope.$apply(function(){
            $scope.imageUrl=path;
        })
        
    }
    function onImageLoadFail(err){

    }
    $scope.$on('image', function(event, args) {
        console.log(args)
        event.stopPropagation();
        $scope.imageUrl=args[2];
        $scope.modal.show();
        if(args[1]=='img'){
            window.JMessage.getOriginImageInSingleConversation($state.params.chatId,args[3],onImageLoad,onImageLoadFail);
        }else{
            // getImage(url,onImageLoad,onImageLoadFail)
            $scope.imageUrl=args[3];
        }
        // $scope.image={src:$scope.msgs[msgIndex].content.localThumbnailPath +'.'+ $scope.msgs[msgIndex].content.format};
        // console.log($scope.allImage);
        // $scope.imageUrl=imageUrl;
        // $scope.showModal('templates/msg/imageViewer.html');
    })
    $scope.$on('voice', function(event, args) {
        console.log(args)
        event.stopPropagation();
        $scope.sound= new Media(args[1],
              function(){
                // resolve(audio.media)
              },function(err){
                console.log(err);
                // reject(err);
              })
        $scope.sound.play();
    })
    $scope.$on('profile', function(event,args) {
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
    
    //病例Panel
    $scope.togglePanel = function(){
        $scope.params.hidePanel=!$scope.params.hidePanel;
    }
    $scope.content={
        pics:[
            'img/avatar.png',
            'img/ben.png',
            'img/mike.png'
        ]
    }
    $scope.viewPic = function(url){
        $scope.imageUrl=url;
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
    function onSendSuccess(res){

        // res=JSON.parse(res);
        // console.log(res);
        // $scope.$apply(function(){
        //     $scope.msgs.push(res);
        // });
        // $ionicScrollDelegate.scrollBottom();
        // $scope.params.msgCount+=1;
        viewUpdate(10);
    }
    function onSendErr(err){
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
    $scope.submitMsg = function(){
        window.JMessage.sendSingleTextMessage($state.params.chatId, $scope.input.text, '', onSendSuccess, onSendErr);
        viewUpdate(5,true);
        // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);
        $scope.input.text='';
    }
    //get image
    $scope.getImage = function(type){
        Camera.getPicture(type)
        .then(function(url){
            console.log(url);

            window.JMessage.sendSingleImageMessage($state.params.chatId, url, '', onSendSuccess, onSendErr);
            viewUpdate(5,true);
            // window.JMessage.getHistoryMessages("single",$state.params.chatId,"",0,3,addNewSend,null);

        },function(err){
            console.log(err)
        })
    }
    //get voice
    $scope.getVoice = function(){
        //voice.record() do 3 things: record --- file manipulation --- send
        voice.record($state.params.chatId)
        .then(function(res){
            console.log(res);
            viewUpdate(5,true);
        },function(err){
            console.log(err);
        });
    }
    $scope.stopAndSend =function(){
        voice.stopRec();
    }



    $scope.goChats = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.doing');
    }
    

    $scope.$on('keyboardshow',function(event,height){
        $scope.params.helpDivHeight=height+40;
        setTimeout(function(){
            $scope.scrollHandle.scrollBottom();
        },100);
        
    })
    $scope.$on('keyboardhide',function(event){
        $scope.params.helpDivHeight=40;
        // $ionicScrollDelegate.scrollBottom();
    })
    $scope.$on('$ionicView.leave',function(){
        $scope.modal.remove();
        $rootScope.conversation.type=null;
        $rootScope.conversation.id='';
      window.JMessage.exitConversation();
    })
}])
// .controller('detailCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
//   $scope.barwidth="width:0%";
//   $scope.detail={
//        head:"mike.png",
//      name:"王二头",
//      gender:"男",
//      age:"32",
//      time:"2017/3/28 10:32",
//      qs:"问题2" ,
//      symptom:"肾内科障碍",
//      type:"肾内科",
//      desc:"医生你好，我想咨询一下"
//         };
// }])

//"患者”页
.controller('patientCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.barwidth="width:0%";
  $scope.patients=[
    {
      head:"default_user.png",
      name:"王大头",
      gender:"男",
      age:"32",
      time:"2017/3/27 9:32",
      appoint:"3/29 10:00-11:00",
      qs:"问题1" ,
      labels:"高血压、糖尿病",
      symptom:"肾内科障碍",
      type:"肾内科",
      class:"danger"
    },
    {
      head:"default_user.png",
      name:"王二头",
      gender:"男",
      age:"32",
      time:"2017/3/28 10:32",
      appoint:"3/29 10:00-11:00",
      qs:"问题2" ,
      labels:"高血压、糖尿病",
      symptom:"肾内科障碍",
      type:"肾内科",
      class:"danger"
    },
    {
      head:"default_user.png",
      name:"王三头",
      gender:"男",
      age:"29",
      time:"2017/3/28 10:32",
      appoint:"3/29 10:00-11:00",
      qs:"问题2" ,
      labels:"高血压、糖尿病",
      symptom:"肾内科障碍",
      type:"肾内科",
      class:"danger"
    }
    ];
}])

//"患者”详情子页
.controller('patientDetailCtrl', ['$scope','$ionicPopup','$state', function($scope, $ionicPopup,$state) {
  $scope.hideTabs = true;
  $scope.p=
    {
      head:"default_user.png",
      name:"王大头",
      gender:"男",
      birthday:"1990-02-03",
      IDNo:"330175147528475189",
      provice:"浙江",
      city:"杭州",
      VIP:"1",
      hypertension:"1",
      type:"肾内科"
      //class:"danger"
    };
    
  $scope.diagnosisInfo=[
    { 
      time: "2017-03-22", 
      hospital: "浙江省第一医院", 
      department:"肾内科",
      diagnosis: "blabla"
    }, 
    {
      time: "2017-03-23", 
      hospital: "安徽省第二医院", 
      department:"肾内科",
      diagnosis: "blabla"
    }   
  ];
  $scope.goToDiagnose=function()
  {
    $state.go("tab.DoctorDiagnose");
  }
  
  
  
}])


//"交流”页
.controller('communicationCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.barwidth="width:0%";
  

}])

//"我”页
.controller('meCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',"meFactory", function($scope, $state,$interval,$rootScope,Storage,meFactory) {
  $scope.barwidth="width:0%";
   
   $scope.userid=Storage.get('userid');
   $scope.doctor=meFactory.GetDoctorInfo($scope.userid);
   //$scope.doctor=meFactory.GetDoctorInfo('D201703240001');
   /*{
      name:"小丁",
      gender:"男",
      title:"主任医生",
      workUnit:"浙江XXX医院",
      department:"泌尿科"
    };*/
 
    $scope.user={
    photoUrl:"default_user.png"
  };
  
}])

//"我”二维码页
.controller('QRcodeCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',"meFactory",  function($scope, $state,$interval,$rootScope,Storage,meFactory) {
    //$scope.hideTabs = true;
  $scope.userid=Storage.get('userid');
    $scope.doctor=meFactory.GetDoctorInfo($scope.userid);
  /*$scope.doctor={
      name:"小丁",
      gender:"男",
      title:"主任医生",
      workUnit:"浙江XXX医院",
      department:"泌尿科"
    };*/
  
  $scope.user={
    photoUrl:"default.png"
  };
}])


//"我”个人资料页
.controller('myinfoCtrl', ['$scope','Storage',"meFactory", function($scope, Storage,meFactory) {
  $scope.hideTabs = true;
  $scope.userid=Storage.get('userid');
    $scope.doctor=meFactory.GetDoctorInfo($scope.userid);
  /*$scope.doctor={
      name:"小丁",
      gender:"男",
      title:"主任医生",
      workUnit:"浙江XXX医院",
      department:"肾内科",
      major:"肾小管疾病、间质性肾炎"
    };
  */
  $scope.user={
    photoUrl:"default.png"
  };
  
  $scope.updateDiv=false;
  $scope.myDiv=true;
    $scope.toggle = function() {
    $scope.myDiv = !$scope.myDiv;
        $scope.updateDiv = !$scope.updateDiv;   
    };
  
}])

//"我”个人收费页
.controller('myfeeCtrl', ['$scope','$ionicPopup','$state', function($scope, $ionicPopup,$state) {
  $scope.hideTabs = true;
  
  $scope.doctor={
    charge1:20,
    charge2:100
  };
  
    $scope.save = function() {
    $state.go('tab.me');  
    };
  
  
}])


//"我”的评价
.controller('feedbackCtrl', ['$scope','$ionicPopup','$state', function($scope, $ionicPopup,$state) {
  $scope.hideTabs = true;
  
  $scope.feedbacks=[
  {
    content : "温柔亲切我喜欢", 
    PatientId:"P201703240012",
    patient:"患者甲",
    time:"2017-03-22"
  },
  {
    content : "还耐心", 
    PatientId:"P201703240015",
    patient:"患者乙",
    time:"2017-03-24"
  }
  ];
}])


//"我”设置页
.controller('setCtrl', ['$scope','$ionicPopup','$state','$timeout','$stateParams', 'Storage',function($scope, $ionicPopup,$state,$timeout,$stateParams,Storage) {
  $scope.hideTabs = true; 
  $scope.logout = function() {
    //Storage.set('IsSignIn','NO');
    $state.logStatus="用户已注销";
    //清除登陆信息
    Storage.rm('IsSignIn');
    //Storage.rm('USERNAME');
    Storage.rm('PASSWORD');
    Storage.rm('userid');
    console.log($state);
    $timeout(function(){$state.go('signin');},500);
    };
  
}])


//"我”设置内容页
.controller('set-contentCtrl', ['$scope','$ionicPopup','$state','$stateParams', function($scope, $ionicPopup,$state,$stateParams) {
  $scope.hideTabs = true; 
  $scope.type = $stateParams.type;
  
}])