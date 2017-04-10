angular.module('zy.controllers', ['ionic','kidney.services'])

/////////////////////////////zhangying////////////////////////
//登录
.controller('SignInCtrl', ['$scope','$timeout','$state','Storage','loginFactory','$ionicHistory', function($scope, $timeout,$state,Storage,loginFactory,$ionicHistory) {
//.controller('SignInCtrl', ['$scope','$timeout','$state','Storage','loginFactory','$ionicHistory', function($scope, $timeout,$state,Storage,loginFactory,$ionicHistory) {
  $scope.barwidth="width:0%";
  if(Storage.get('USERNAME')!=null){
    $scope.logOn={username:Storage.get('USERNAME'),password:""};

  }else{
    $scope.logOn={username:"",password:"123"};
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
.controller('phonevalidCtrl', ['$scope','$state','$interval', 'Storage',  function($scope, $state,$interval,Storage) {
  $scope.barwidth="width:0%";
  $scope.Verify={Phone:"",Code:""};
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
    unablebutton();
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
     if(!phoneReg.test(Verify.Phone)){$scope.logStatus="手机号验证失败！";return;}
     //如果为注册，注册过的用户不能获取验证码；如果为重置密码，没注册过的用户不能获取验证码
      var usernames = Storage.get('usernames').split(",");
      if(Storage.get('setPasswordState')=='register'){
        if(usernames.indexOf(Verify.Phone)>=0){
          $scope.logStatus = "该手机号码已经注册！";
        }
        else{sendSMS();}
      }
      else if(Storage.get('setPasswordState')=='reset'){
        if(usernames.indexOf(Verify.Phone)<0){
          $scope.logStatus = "该手机号码尚未注册！";
        }
        else{sendSMS();}
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
        if (Verify.Code == tempVerify) {
        logStatus = "验证成功！";
        Storage.set('USERNAME',Verify.Phone);
        $state.go('setpassword');
        }
        else{$scope.logStatus = "验证码错误！";}
      }
      else{$scope.logStatus="手机号验证失败！";}
        
    }
    else{$scope.logStatus = "请输入完整信息！";}
  }
  
}])



//设置密码
.controller('setPasswordCtrl', ['$scope','$state','$rootScope' ,'$timeout' ,'Storage',function($scope,$state,$rootScope,$timeout,Storage) {
  $scope.barwidth="width:0%";
  // var setPassState=Storage.get('setPasswordState');
  // if(setPassState=='reset'){
  //   $scope.headerText="重置密码";
  //   $scope.buttonText="确认修改";
  // }else{
    $scope.headerText="设置密码";
    $scope.buttonText="下一步";
  // }
  $scope.setPassword = function(){
    $state.go('userdetail');
    //Storage.set('setPasswordState','sign');
  }
  //$scope.setPassword={newPass:"" , confirm:""};
  // $scope.resetPassword=function(setPassword){
  //   $scope.logStatus='';
  //   if((setPassword.newPass!="") && (setPassword.confirm!="")){
  //     if(setPassword.newPass == setPassword.confirm){
  //       var username = Storage.get('USERNAME');
  //       //如果是注册
  //       if(setPassState=='register'){
  //         //结果分为连接超时或者注册成功
  //         $rootScope.password=setPassword.newPass;
          
  //         //把新用户和密码写入
  //         var usernames = Storage.get('usernames');
  //         var passwords = Storage.get('passwords');
  //         if(usernames == "" || usernames == null){
  //           usernames = new Array();
  //           passwords = new Array();            
  //         }else{
  //           usernames = usernames.split(",");
  //           passwords = passwords.split(",");}
                    
  //         usernames.push(username);          
  //         passwords.push(setPassword.newPass);
  //         Storage.set('usernames',usernames);
  //         Storage.set('passwords',passwords);
  //         $scope.logStatus ="注册成功！";
  //         $timeout(function(){$state.go('userdetail');} , 100);
  //       }
  //       else if(setPasswordState== 'reset'){
  //         //如果是重置密码

          
  //         //结果分为连接超时或者修改成功
  //          $scope.logStatus ="重置密码成功！";
  //         //把新用户和密码写入
  //         var usernames = Storage.get('usernames').split(",");
  //         var index = usernames.indexOf(username);
  //         var passwords = Storage.get('passwords').split(",");
  //         passwords[index] = setPassword.newPass;
         
  //         Storage.set('passwords',passwords);
  //         $timeout(function(){$state.go('signin');} , 100);
          
  //       }
  //     }else{
  //       $scope.logStatus="两次输入的密码不一致";
  //     }
  //   }else{
  //     $scope.logStatus="请输入两遍新密码"
  //   }
  // }

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
.controller('consultCtrl', ['$scope','$state','$interval','$rootScope', 'Storage','QRScan',  function($scope, $state,$interval,$rootScope,Storage,QRScan) {
  $scope.barwidth="width:0%";
  //变量a 等待患者数量 变量b 已完成咨询患者数量
  $scope.doctor={a:3,b:3};
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
}])

//"咨询”进行中
.controller('doingCtrl', ['$scope','$state','$interval','$rootScope', 'Storage',  function($scope, $state,$interval,$rootScope,Storage) {
  $scope.patients=[
    {
      head:"default_user.png",
      name:"赵大头",
      id:18868800011,
      gender:"男",
      age:"32",
      time:"2017/3/27 9:32",
      qs:"问题1" 
    },
    {
      head:"default_user.png",
      name:"钱二头",
      id:18868800012,
      gender:"男",
      age:"32",
      time:"2017/3/28 10:32",
      qs:"问题2" 
    },
    {
      head:"default_user.png",
      name:"孙三头",
      id:18868800013,
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
      id:18868800001,
      gender:"男",
      age:"32",
      time:"2017/3/27 9:32",
      qs:"问题1" 
    },
    {
      head:"default_user.png",
      name:"王二头",
      id:18868800002,
      gender:"男",
      age:"32",
      time:"2017/3/28 10:32",
      qs:"问题2" 
    },
    {
      head:"default_user.png",
      name:"王三头",
      id:18868800003,
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