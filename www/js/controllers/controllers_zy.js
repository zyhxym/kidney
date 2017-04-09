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

//"我”设置内容页
.controller('schedualCtrl', ['$scope', function($scope) {
    $("#myCalendar-schedual").ionCalendar({
        lang: "ch"
    });
}])