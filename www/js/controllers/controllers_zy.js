angular.module('zy.controllers', ['ionic','kidney.services'])

/////////////////////////////zhangying////////////////////////
//登录
.controller('SignInCtrl', ['User','$scope','$timeout','$state','Storage','loginFactory','$ionicHistory', function(User,$scope, $timeout,$state,Storage,loginFactory,$ionicHistory) {
//.controller('SignInCtrl', ['$scope','$timeout','$state','Storage','loginFactory','$ionicHistory', function($scope, $timeout,$state,Storage,loginFactory,$ionicHistory) {
  $scope.barwidth="width:0%";
  if(Storage.get('USERNAME')!=null){
    $scope.logOn={username:Storage.get('USERNAME'),password:""};

  }else{
    $scope.logOn={username:"",password:""};
  }
  $scope.signIn = function(logOn) {  
    $scope.logStatus='';

    // //暂时写在这，交流用 XJZ
    // window.JMessage.login(logOn.username, logOn.username,
    //     function(response) {
    //         window.JMessage.username = user
    //         //gotoConversation();
    //     },
    //     function(err) {
    //         console.log(err);
    //         // JM.register($scope.useruserID, $scope.passwd);
    //     });

if((logOn.username!="") && (logOn.password!="")){
      var phoneReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      //手机正则表达式验证
      if(!phoneReg.test(logOn.username)){
            $scope.logStatus="手机号验证失败！";
            return;
        }
      else{
        var logPromise = User.logIn({username:logOn.username,password:logOn.password,role:"doctor"});
            logPromise.then(function(data){
                if(data.results==1){
                    if(data.mesg== "User doesn't Exist!"){
                        $scope.logStatus="账号不存在！";
                    }
                    else if(data.mesg== "User password isn't correct!"){
                        $scope.logStatus = "账号或密码错误！";
                    }
                }
                else if(data.results.mesg=="login success!"){
                    $scope.logStatus = "登录成功！";
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    Storage.set('USERNAME',$scope.logOn.username);
                    Storage.set('TOKEN',data.results.token);//token作用目前还不明确
                    Storage.set('isSignIn',true);
                    Storage.set('UID',data.results.userId);
                    $timeout(function(){$state.go('tab.home');},500);

                }

            },function(data){
                if(data.results==null && data.status==0){
                    $scope.logStatus = "网络错误！";
                    return;
                }
                if(data.status==404){
                    $scope.logStatus = "连接服务器失败！";
                    return;
                }

            });
      }     
    }
    else{
      $scope.logStatus="请输入完整信息！";
    }
  }

  $scope.toRegister = function(){
    console.log($state);
    Storage.set('validMode',0);//注册
    $state.go('phonevalid');     
  }

  $scope.toReset = function(){
    Storage.set('validMode',1);//修改密码
    $state.go('phonevalid');   
  } 
  
}])


//手机号码验证
.controller('phonevalidCtrl', ['$scope','$state','$interval', 'Storage','User',  function($scope, $state,$interval,Storage,User) {
  $scope.barwidth="width:0%";
  $scope.Verify={Phone:"",Code:""};
  $scope.veritext="获取验证码";
  $scope.isable=false;
  var unablebutton = function(){      
     //验证码BUTTON效果
    $scope.isable=true;
    console.log($scope.isable)
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
  //点击获取验证码
  $scope.getcode=function(Verify){
    $scope.logStatus='';
    
    if (Verify.Phone=="") {
      
      $scope.logStatus="手机号码不能为空！";
      return;
    }
    var phoneReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    //手机正则表达式验证
    if(!phoneReg.test(Verify.Phone))
    {
      $scope.logStatus="请输入正确的手机号码！";
      return;
    }
    else//通过基本验证-正确的手机号
    {
      console.log(Verify.Phone)
      //验证手机号是否注册，没有注册的手机号不允许重置密码
      User.logIn({
        username:Verify.Phone,
        password:' ',
        role:'doctor'
      })
      .then(function(succ)
      {
        console.log(succ)
        if(succ.mesg=="User password isn't correct!")//存在的用户
        {
          User.sendSMS({
            mobile:Verify.Phone,
            smsType:1
          })
          .then(function(validCode)
          {
            console.log(validCode)
            if(validCode.results==0)
            {
              unablebutton()
            }
            else
            {
              $scope.logStatus="验证码发送失败！";
            }
          },function(err)
          {
            $scope.logStatus="验证码发送失败！";
          })
        }
        else
        {
          $scope.logStatus="您还没有注册呢！";
        }
      },function(err)
      {
        console.log(err)
        $scope.logStatus="网络错误！";
      })
    }
  }

  //判断验证码和手机号是否正确
  $scope.gotoReset = function(Verify){
    $scope.logStatus = '';
    if(Verify.Phone!="" && Verify.Code!=""){
      var tempVerify = 123;
      //结果分为三种：(手机号验证失败)1验证成功；2验证码错误；3连接超时，验证失败
      var phoneReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      //手机正则表达式验证
      if(phoneReg.test(Verify.Phone)){ 
        User.verifySMS({
          mobile:Verify.Phone,
          smsType:1,
          smsCode:Verify.Code
        })
        .then(function(succ)
        {
          console.log(succ)
          if(succ.results==0)//验证成功
          {
            Storage.set('phoneNumber',Verify.Phone);
            $state.go('setpassword');
          }
          else//验证码错误
          {
            $scope.logStatus="请输入正确的验证码！";
          }
        },function(err)
        {
          console.log(err)
          $scope.logStatus="网络错误！";
        })
      }
      else{$scope.logStatus="手机号验证失败！";}
        
    }
    else{$scope.logStatus = "请输入完整信息！";}
  }
  
}])



//设置密码
.controller('setPasswordCtrl', ['$scope','$state','$rootScope' ,'$timeout' ,'Storage','User',function($scope,$state,$rootScope,$timeout,Storage,User) {
  $scope.barwidth="width:0%";
  var validMode=Storage.get('validMode');//0->set;1->reset
  var phoneNumber=Storage.get('phoneNumber');
  $scope.headerText="设置密码";
  $scope.buttonText="";
  $scope.logStatus='';

  if(validMode==0)
    $scope.buttonText="下一步";
  else
    $scope.buttonText="完成";
  $scope.setPassword = function(password){
    if(password.newPass!=""&&password.confirm!="")
    {
      if(password.newPass==password.confirm)
      {
        if(password.newPass.length<6)//此处要验证密码格式，//先简单的
        {
          $scope.logStatus='密码太短了！';
        }
        else
        {
          User.changePassword({
            phoneNo:phoneNumber,
            password:password.newPass
          })
          .then(function(succ)
          {
            console.log(succ)
            if(validMode==0)
              $state.go('userdetail');
            else
              $state.go('signin')
          },function(err)
          {
            console.log(err)
          })
        }
      }
      else
      {
        $scope.logStatus='两次输入的密码不一致';
      }
    }
    else
    {
      $scope.logStatus='输入不正确!';
    }
  }
}])




//注册时填写医生个人信息
.controller('userdetailCtrl',['$scope','$state','$ionicHistory','$timeout' ,'Storage', '$ionicPopup','$ionicLoading','$ionicPopover',function($scope,$state,$ionicHistory,$timeout,Storage, $ionicPopup,$ionicLoading, $ionicPopover){
  $scope.barwidth="width:0%";
//注册时可跳过个人信息
  // $scope.CanSkip = function(){
  //   if(Storage.get('setPasswordState')=='register'){
  //     return true;
  //   }
  //   else{
  //     return false;}
  // }

  $scope.Skip = function(){
    $state.go('signin');
    //Storage.set('setPasswordState','sign');
  }


  $scope.Goback = function(){
    $ionicHistory.goBack();
  }
  
     //初始待选项出现一条空白
      // 获取性别类型
      $scope.Genders = {};// 初始化
      $scope.Genders =
        [
        {Name:"男",Type:1},
        {Name:"女",Type:2}
        ]
      ; 




var initUserDetail = function(){
  $ionicLoading.show({
          template: '<ion-spinner style="height:2em;width:2em"></ion-spinner>'
         });


    $scope.User={
    Name:"",
    Gender:{Name:"男",Type:1},//默认选项
    workUnit:"",
    department:"",
    title:"",
    birthday:"",
    IDCard:"",
    major:"",
    Numberroduction:""};

  

  setTimeout(function(){$ionicLoading.hide();},400);

}

initUserDetail();
  

  // --------datepicker设置----------------
  var  monthList=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  var weekDaysList=["日","一","二","三","四","五","六"];

  // --------出生日期----------------
  var BirthdatePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.datepickerObject3.inputDate=val;
      var dd=val.getDate();
      var mm=val.getMonth()+1;
      var yyyy=val.getFullYear();
      var d=dd<10?('0'+String(dd)):String(dd);
      var m=mm<10?('0'+String(mm)):String(mm);
      //日期的存储格式和显示格式不一致
      $scope.User.Birthday=yyyy+'/'+m+'/'+d;
    }
  };
  $scope.datepickerObject3 = {
    titleLabel: '出生日期',  //Optional
    todayLabel: '今天',  //Optional
    closeLabel: '取消',  //Optional
    setLabel: '设置',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    mondayFirst: false,    //Optional
    //disabledDates: disabledDates, //Optional
    weekDaysList: weekDaysList,   //Optional
    monthList: monthList, //Optional
    templateType: 'popup', //Optional
    showTodayButton: 'false', //Optional
    modalHeaderColor: 'bar-positive', //Optional
    modalFooterColor: 'bar-positive', //Optional
    from: new Date(1900, 1, 1),   //Optional
    to: new Date(),    //Optional
    callback: function (val) {    //Mandatory
      BirthdatePickerCallback(val);
    }
  };  
  // --------datepicker设置结束----------------


   //////////////////////////////////////////////////////////////////////////
      $scope.change = function(d)
      {
        console.log(d);
      }

      
      // 修改信息后的保存
  var InsertUserDetail = function(User){
    // console.log(User.BloodType);
    Storage.set("user.name",User.Name);
    Storage.set("user.gender",JSON.stringify(User.Gender));
    Storage.set("user.workUnit",User.workUnit);
    Storage.set("user.department",User.department);
    Storage.set("user.title",User.title);
    Storage.set("user.birthday",User.Birthday);
    Storage.set("user.idcard",User.IDCard);
    Storage.set("user.major" ,User.major);
    Storage.set("user.Numberroduction",User.Numberroduction);

    $ionicPopup.alert({
      title: '保存成功',
      template: '个人信息修改完成！'
    })
    
  }
     


  $scope.infoSetup = function(User){
    console.log($scope.User);
    //Storage.set("isSignIN")="YES";
    //console.log($state);
    $state.go('tab.home');
  }

}])














//首页
.controller('homeCtrl', [
    'Communication','$scope','$state','$interval','$rootScope', 'Storage','$http','$sce',
     function(Communication,$scope, $state,$interval,$rootScope,Storage,$http,$sce) {
    $scope.barwidth="width:0%";
    $scope.navigation=$sce.trustAsResourceUrl("http://121.43.107.106/");

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
    $scope.options = {
        loop: false,
        effect: 'fade',
        speed: 500,
    }
    // $scope.testRestful=function()
    // {
    //     Communication.removeMember({
    //              teamId:'teampost2',
    //              membersuserId:'id2'
    //          })
    //     .then(function(data){
    //         console.log(data)
    //     },function(err){
    //         console.log(err);
    //     })
    // }
}])

//咨询
.controller('consultCtrl', ['$scope','$state','$interval','$rootScope', 'Storage','QRScan','Counsel',  function($scope, $state,$interval,$rootScope,Storage,QRScan,Counsel) {
  $scope.barwidth="width:0%";
  //变量a 等待患者数量 变量b 已完成咨询患者数量
  $scope.doctor={a:0,b:0};
  $scope.qrscan= function(){
    QRScan.getCode()
    .then(function(data){
      console.log(data);
    },function(err){
      console.log(err);
    })
  }
  var now=new Date();
  var year=now.getYear();
  var month=now.getMonth()+1;
  var day=now.getDate();
  var date1=month+"月"+day+"日";
  //var date1=new Date().format("MM月dd日");
  $scope.riqi=date1;

  //获取在等待
  Counsel.getCounsels({
    userId:'doc01',
    status:0
  })
  .then(
    function(data)
    {
      // console.log(data)
      Storage.set("consulted",angular.toJson(data.results))
      // console.log(angular.fromJson(Storage.get("consulted",data.results)))
      $scope.doctor.b=data.results.length;
    },
    function(err)
    {
      console.log(err)
    }
  )
  //获取进行中
  Counsel.getCounsels({
    userId:'doc01',
    status:1
  })
  .then(
    function(data)
    {
      console.log(data)
      Storage.set("consulting",angular.toJson(data.results))
      // console.log(angular.fromJson(Storage.get("consulting",data.results)))
      $scope.doctor.a=data.results.length;
    },
    function(err)
    {
      console.log(err)
    }
  )

}])

//"咨询”进行中
.controller('doingCtrl', ['$scope','$state','$interval','$rootScope', 'Storage','$ionicPopover','Counsel',  function($scope, $state,$interval,$rootScope,Storage,$ionicPopover,Counsel) {
  // $scope.patients=[
  //   {
  //     head:"default_user.png",
  //     name:"赵大头",
  //     id:18868800011,
  //     gender:"男",
  //     age:"32",
  //     time:"2017/3/27 9:32",
  //     qs:"问题1" 
  //   }
  // ];
  $scope.patients=angular.fromJson(Storage.get("consulting"));

  $ionicPopover.fromTemplateUrl('partials/others/sort_popover_consult.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event) {
    $scope.popover.show($event);
    //$scope.testt=12345
  };
  //$scope.isChecked1=true;

}])

//"咨询”已完成
.controller('didCtrl', ['$scope','$state','$interval','$rootScope', 'Storage','$ionicPopover',  function($scope, $state,$interval,$rootScope,Storage,$ionicPopover) {
  // $scope.patients=[
  //   {
  //     head:"default_user.png",
  //     name:"王大头",
  //     id:18868800001,
  //     gender:"男",
  //     age:"32",
  //     time:"2017/3/27 9:32",
  //     qs:"问题1" 
  //   }
  // ];
  $scope.patients=angular.fromJson(Storage.get("consulted"));
  
    $ionicPopover.fromTemplateUrl('partials/others/sort_popover_consult.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
      $scope.popover.show($event);
      //$scope.testt=12345
    };
    //$scope.isChecked1=true;
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
.controller('patientCtrl', ['$scope','$state','$interval','$rootScope', 'Storage','$ionicPopover',  function($scope, $state,$interval,$rootScope,Storage,$ionicPopover) {
  $scope.barwidth="width:0%";
  $scope.order="VIP";
  $scope.abc=false;
  $scope.index=0;
  $scope.turn=0;
  $scope.orderGroup=new Array("VIP","class");
  $scope.reorder = function() { 
  
     if(($scope.turn%2)==0)
   {
     $scope.abc=!$scope.abc;
     $scope.turn=$scope.turn+1;
     console.log('index:'+$scope.index);
     console.log('turn:'+$scope.turn);
     console.log('abc:'+$scope.abc);
   }
   else{
     $scope.index=($scope.index+1)%2;
     $scope.turn=$scope.turn+1;
     $scope.order=$scope.orderGroup[$scope.index];
     console.log('index:'+$scope.index);
     console.log('turn:'+$scope.turn);
     console.log('order:'+$scope.order);
   }
    
  };

  $scope.patients=[
    {
      head:"max.png",
      name:"王大头",
      gender:"男",
      age:"32",
      time:"2017/3/27 9:32",
      //appoint:"3/29 10:00-11:00",
      qs:"问题1" ,
      labels:"高血压、糖尿病",
      symptom:"肾内科障碍",
      type:"肾内科",
      VIP:"1",
      class:"danger"
    },
    {
      head:"mike.png",
      name:"王二头",
      gender:"男",
      age:"32",
      time:"2017/3/28 10:32",
      //appoint:"3/29 10:00-11:00",
      qs:"问题2" ,
      labels:"高血压、糖尿病",
      symptom:"肾内科障碍",
      type:"肾内科",
      VIP:"2",
      class:"danger"
    },
    {
      head:"adam.jpg",
      name:"王三头",
      gender:"男",
      age:"29",
      time:"2017/3/28 10:32",
      //appoint:"3/29 10:00-11:00",
      qs:"问题2" ,
      labels:"高血压、糖尿病",
      symptom:"肾内科障碍",
      type:"肾内科",
      VIP:"3",
      class:""
    }
    ];

    $ionicPopover.fromTemplateUrl('partials/others/sort_popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
      $scope.popover.show($event);
      $scope.testt=12345
    };
    $scope.isChecked1=true;
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
    charge2:100,
    sum:1000
  };
  
    $scope.save = function() {
    $state.go('tab.me');  
    };
  
  
}])


//"我”的评价
.controller('feedbackCtrl', ['$scope','$ionicPopup','$state', function($scope, $ionicPopup,$state) {
  $scope.hideTabs = true;
  $scope.doctor={
    score:9.6
  };
  
  $scope.feedbacks=[
  {
    content : "温柔亲切我喜欢", 
    PatientId:"P201703240012",
    patient:"患者甲",
    time:"2017-03-22",
    score:"9.7"
  },
  {
    content : "还耐心", 
    PatientId:"P201703240015",
    patient:"患者乙",
    time:"2017-03-24",
    score:"9.5"
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

//"我”设置内容页
.controller('schedualCtrl', ['$scope','$ionicPopover','ionicDatePicker', function($scope,$ionicPopover,ionicDatePicker) {
    var ipObj1 = {
        callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            if($scope.flag==1)
            {
                console.log(1)
                var date=new Date(val)
                $scope.begin=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            }
            else
            {
                console.log(2);
                var date=new Date(val)
                $scope.end=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
            }
        },
        titleLabel: '停诊开始',
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup',
        setLabel: '确定',
        todayLabel: '今天',
        closeLabel: '取消',
        showTodayButton: true,
        dateFormat: 'yyyy MMMM dd',
        weeksList: ["周日","周一","周二","周三","周四","周五","周六"],
        monthsList:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
    };

    $scope.openDatePicker = function(params){
        ionicDatePicker.openDatePicker(ipObj1);
        $scope.flag=params;
    };

    $scope.showSchedual=true;
    $scope.showSch=function()
    {
        $scope.showSchedual=!$scope.showSchedual;
    }
}])