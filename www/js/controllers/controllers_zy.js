angular.module('zy.controllers', ['ionic','kidney.services'])

/////////////////////////////zhangying///////////////////////
//登录
.controller('SignInCtrl', ['User','$scope','$timeout','$state','Storage','loginFactory','$ionicHistory','JM','$sce','Doctor', function(User,$scope, $timeout,$state,Storage,loginFactory,$ionicHistory,JM,$sce,Doctor) {
    $scope.barwidth="width:0%";
    $scope.navigation_login=$sce.trustAsResourceUrl("http://proxy.haihonghospitalmanagement.com/member.php?mod=logging&action=logout&formhash=xxxxxx");
    if(Storage.get('USERNAME')!=null){
        $scope.logOn={username:Storage.get('USERNAME'),password:""};
    }
    else{
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
                        //jmessage
                        // JM.login(data.results.userId)
                        // .then(function(data){ 
                        //   console.log(data+" is login");
                        // },function(err){
                        //   console.log('login fail');
                        // })
                        Doctor.getDoctorInfo({userId:data.results.userId})
                        .then(function(response){
                            thisDoctor = response.results;
                        },function(err){
                            thisDoctor=null;
                        });
                        $scope.logStatus = "登录成功！";
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        Storage.set('USERNAME',$scope.logOn.username);
                        Storage.set('TOKEN',data.results.token);//token作用目前还不明确
                        Storage.set('isSignIn',true);
                        Storage.set('UID',data.results.userId);
                        User.getAgree({userId:data.results.userId}).then(function(res){
                            if(res.results.agreement=="0"){
                                $timeout(function(){$state.go('tab.home');},500);
                            }else{
                                $timeout(function(){$state.go('agreement',{last:'signin'});},500);
                            }
                        },function(err){
                            console.log(err);
                        })

                    }
                },
                function(data){
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
.controller('phonevalidCtrl', ['$scope','$state','$interval', '$stateParams','Storage','User','$timeout',  function($scope, $state,$interval,$stateParams,Storage,User,$timeout) {
    $scope.barwidth="width:0%";
    $scope.Verify={Phone:"",Code:""};
    $scope.veritext="获取验证码";
    $scope.isable=false;
    var validMode=Storage.get('validMode');//0->set;1->reset
    var unablebutton = function(){      
     //验证码BUTTON效果
        $scope.isable=true;
        //console.log($scope.isable)
        $scope.veritext="60S再次发送"; 
        var time = 59;
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
        Storage.set('RegisterNO',$scope.Verify.Phone)
        //验证手机号是否注册，没有注册的手机号不允许重置密码
        User.getUserId({
            phoneNo:Verify.Phone
        })
        .then(function(succ)
        {
            console.log(succ)
            if(validMode==0)
            {
                if (succ.mesg =="User doesn't Exist!")
                {
                    User.sendSMS({
                        mobile:Verify.Phone,
                        smsType:2
                    })
                    .then(function(data)
                    {
                        unablebutton();
                        if(data.mesg.substr(0,8)=="您的邀请码已发送"){
                            $scope.logStatus = "您的验证码已发送，重新获取请稍后";
                        }else if (data.results == 1){
                            $scope.logStatus = "验证码发送失败，请稍后再试";
                        }
                        else{
                            $scope.logStatus ="验证码发送成功！";
                        }
                    },function(err)
                    {
                        $scope.logStatus="验证码发送失败！";
                    })
                }
                else 
                {
                    if (succ.roles.indexOf('doctor') != -1)
                    {
                        $scope.logStatus="您已经注册过了";
                    }
                    else
                    {
                        User.sendSMS({
                            mobile:Verify.Phone,
                            smsType:2
                        })
                        .then(function(data)
                        {
                            unablebutton();
                            if(data.mesg.substr(0,8)=="您的邀请码已发送"){
                                $scope.logStatus = "您的验证码已发送，重新获取请稍后";
                            }else if (data.results == 1){
                                $scope.logStatus = "验证码发送失败，请稍后再试";
                            }
                            else{
                                $scope.logStatus ="验证码发送成功！";
                            }
                        },function(err)
                        {
                            $scope.logStatus="验证码发送失败！";
                        })
                    }
                }
            }
            else if(validMode==1&&succ.mesg =="User doesn't Exist!")
            {
                $scope.logStatus="您还没有注册呢！";
            }
            else
            {
                User.sendSMS({
                    mobile:Verify.Phone,
                    smsType:2
                })
                .then(function(data)
                {
                    unablebutton();
                    if(data.mesg.substr(0,8)=="您的邀请码已发送"){
                        $scope.logStatus = "您的验证码已发送，重新获取请稍后";
                    }else if (data.results == 1){
                        $scope.logStatus = "验证码发送失败，请稍后再试";
                    }
                    else{
                        $scope.logStatus ="验证码发送成功！";
                    }
                },function(err)
                {
                    $scope.logStatus="验证码发送失败！";
                })
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
        if(Verify.Phone!="" && Verify.Code!="")
        {
            var tempVerify = 123;
            //结果分为三种：(手机号验证失败)1验证成功；2验证码错误；3连接超时，验证失败
            var phoneReg=/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            //手机正则表达式验证
            if(phoneReg.test(Verify.Phone)){
                //测试用
                // if(Verify.Code==123456){
                //     $scope.logStatus = "验证成功";
                //     Storage.set('phoneNumber',Verify.Phone);
                //     if(validMode == 0){
                //         $timeout(function(){$state.go('agreement',{last:'register'});},500);
                //     }else{
                //        $timeout(function(){$state.go('setpassword')}); 
                //     }
                    
                // }else{$scope.logStatus = "验证码错误";}

                User.verifySMS({
                    mobile:Verify.Phone,
                    smsType:2,
                    smsCode:Verify.Code
                })
                .then(function(succ)
                {
                    console.log(succ)
                    if(succ.results==0)//验证成功
                    {
                        $scope.logStatus="验证成功！";
                        Storage.set('phoneNumber',Verify.Phone);
                        if(validMode == 0){
                            $timeout(function(){$state.go('agreement',{last:'register'});},500);
                        }else{
                            $timeout(function(){$state.go('setpassword')}); 
                        }
                    }
                    else //验证码错误
                    {
                        $scope.logStatus="请输入正确的验证码！";
                    }
                },
                function(err)
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

//签署协议（0为签署）
.controller('AgreeCtrl', ['User','$stateParams','$scope','$timeout','$state','Storage','$ionicHistory','$http','Data', function(User,$stateParams,$scope, $timeout,$state,Storage,$ionicHistory,$http,Data) {
    $scope.YesIdo = function(){
        console.log('yesido');
        if($stateParams.last=='signin'){
            User.updateAgree({userId:Storage.get('UID'),agreement:"0"}).then(function(data){
                if(data.results!=null){
                    $timeout(function(){$state.go('tab.home');},500);
                }else{
                    console.log("用户不存在!");
                }
            },function(err){
                console.log(err);
            })
        }
        else if($stateParams.last=='register'){
            $timeout(function(){$state.go('setpassword',0)},500);
        }
    }
    var a=document.getElementById("agreement");
    // console.log(document.body.clientHeight);
    // console.log(window.screen.height);
    a.style.height=window.screen.height*0.65+"px";
}])

//设置密码
.controller('setPasswordCtrl', ['$scope','$state','$rootScope' ,'$timeout' ,'Storage','User',function($scope,$state,$rootScope,$timeout,Storage,User) {
    $scope.barwidth="width:0%";
    var validMode=Storage.get('validMode');//0->set;1->reset
    var phoneNumber=Storage.get('RegisterNO');
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
                    if(validMode==0)
                    {
                        Storage.set('password',password.newPass);
                        $state.go('userdetail');
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
                            $state.go('signin')
                        },function(err)
                        {
                            console.log(err)
                        })
                    }
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
.controller('userdetailCtrl',['Dict','Doctor','$scope','$state','$ionicHistory','$timeout' ,'Storage', '$ionicPopup','$ionicLoading','$ionicPopover','$ionicScrollDelegate','User','$http','Camera','$ionicModal',function(Dict,Doctor,$scope,$state,$ionicHistory,$timeout,Storage, $ionicPopup,$ionicLoading, $ionicPopover,$ionicScrollDelegate,User,$http,Camera,$ionicModal){
    $scope.barwidth="width:0%";
    var phoneNumber=Storage.get('RegisterNO');
    var password=Storage.get('password');
    $scope.Titles =
    [
        {Name:"主任医师",Type:1},
        {Name:"副主任医师",Type:2},
        {Name:"主治医师",Type:3},
        {Name:"住院医师",Type:4},
        {Name:"主任护师",Type:5},
        {Name:"副主任护师",Type:6},
        {Name:"主管护师",Type:7},
        {Name:"护师",Type:8},
        {Name:"护士",Type:9}
    ]   
    $scope.doctor={
        userId:"",
        name:"",
        workUnit:"",
        department:"",
        title:"",
        IDNo:"",
        major:"",
        description:""
    };

    //------------省市医院读字典表---------------------
    Dict.getDistrict({level:"1",province:"",city:"",district:""})
    .then(
        function(data)
        {
            $scope.Provinces = data.results;
            // $scope.Province.province = "";
            console.log($scope.Provinces)
        },
        function(err)
        {
            console.log(err);
        }
    )    

    $scope.getCity = function (pro) {
        console.log(pro)
        if(pro!=null){
            Dict.getDistrict({level:"2",province:pro,city:"",district:""})
            .then(
                function(data)
                {
                    $scope.Cities = data.results;
                    console.log($scope.Cities);            
                },
                function(err)
                {
                    console.log(err);
                }
            );
        }else{
            $scope.Cities = {};
            $scope.Hospitals = {};
        }
    }

    $scope.getHospital = function (city) {
            console.log(city)
        if(city!=null){
            //var locationCode = district.province + district.city + district.district
            //console.log(locationCode)

            Dict.getHospital({city:city})
            .then(
                function(data)
                {
                    $scope.Hospitals = data.results;
                    console.log($scope.Hospitals);
                },
                function(err)
                {
                    console.log(err);
                }
            )
        }else{
            $scope.Hospitals = {};
        }
    }
    $scope.test = function(docinfo){
        console.log(docinfo)
        $scope.doctor.province = docinfo.province;
        $scope.doctor.city = docinfo.city;
        $scope.doctor.workUnit = docinfo.hospitalName;        
    }
    //------------省市医院读字典表---------------------

    $scope.infoSetup = function() 
    {
        if ($scope.doctor.name&&$scope.doctor.province&&$scope.doctor.city&&$scope.doctor.workUnit&&$scope.doctor.department&&$scope.doctor.title&&$scope.doctor.IDNo){
            //如果必填信息已填
            var IDreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  //身份证号判断
            if ($scope.doctor.IDNo!='' && IDreg.test($scope.doctor.IDNo) == false){
                // console.log("身份证");
                $ionicLoading.show({
                    template: '请输入正确的身份证号',
                    duration:1000
                });
            }
            else{
                $scope.doctor.title = $scope.doctor.title.Name
                User.register({
                    'phoneNo':phoneNumber,
                    'password':password,
                    'role':'doctor'
                })
                .then(function(succ)
                {
                    console.log(phoneNumber)
                    console.log(password)
                    console.log(succ)
                    Storage.set('UID',succ.userNo);

                    //签署协议置位0，同意协议
                    User.updateAgree({userId:Storage.get('UID'),agreement:"0"})
                    .then(function(data){
                        console.log(data);
                    },function(err){
                        console.log(err);
                    })

                    //填写个人信息
                    $scope.doctor.userId = Storage.get('UID')
                    Doctor.postDocBasic($scope.doctor)
                    .then(
                        function(data)
                        {
                            console.log(data);
                            console.log($scope.doctor)
                            //$scope.doctor = data.newResults;                  
                        },
                        function(err)
                        {
                            console.log(err)
                        }
                    );            

                    //注册论坛

                    $http({
                        method  : 'POST',
                        url     : 'http://proxy.haihonghospitalmanagement.com/member.php?mod=register&mobile=2&handlekey=registerform&inajax=1',
                        params    :{
                            'regsubmit':'yes',
                            'formhash':'',
                            'username':$scope.doctor.name+phoneNumber.slice(7),
                            'password':$scope.doctor.name+phoneNumber.slice(7),
                            'password2':$scope.doctor.name+phoneNumber.slice(7),
                            'email':phoneNumber+'@bme319.com'
                        },  // pass in data as strings
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Accept':'application/xml, text/xml, */*'
                        }  // set the headers so angular passing info as form data (not request payload)
                    }).success(function(data) {
                        // console.log(data);
                    });
                    //zxf
                    $state.go('uploadcertificate');
                    Storage.set("lt",'bme319');

                },function(err)
                {
                    console.log(err)       
                })                 
            }                         
        }
        else{
            $ionicLoading.show({
                template: '信息填写不完整,请完善必填信息(红色*)',
                duration:1000
            });            
        }
    
    };
    

    // $scope.$on('$ionicView.leave', function() {
    //     $scope.modal.remove();
    // })
}])
.controller('uploadcertificateCtrl',['CONFIG','Dict','Doctor','$scope','$state','$ionicHistory','$timeout' ,'Storage', '$ionicPopup','$ionicLoading','$ionicPopover','$ionicScrollDelegate','User','$http','Camera','$ionicModal',function(CONFIG,Dict,Doctor,$scope,$state,$ionicHistory,$timeout,Storage, $ionicPopup,$ionicLoading, $ionicPopover,$ionicScrollDelegate,User,$http,Camera,$ionicModal){
    
    $scope.doctor=""
    User.logIn({username:Storage.get('RegisterNO'),password:Storage.get('password'),role:"doctor"}).then(function(data){
        if(data.results.mesg=="login success!"){
            $scope.doctor.userId=data.results.userId
        }
    },function(err){
        console.log(err);
    })

    $scope.uploadcetify = function() {
        if($scope.doctor.userId&&$scope.doctor.certificatePhotoUrl&&$scope.doctor.practisingPhotoUrl){
            Doctor.editDoctorDetail($scope.doctor)
            .then(
                function(data)
                {
                    $state.go('signin')
                    console.log(data)
                },
                function(err)
                {
                    console.log(err)
                }
            );
        }else{
            $ionicLoading.show({
                template: '信息填写不完整,请完善必填信息(红色*)',
                duration:1000
            });  
        }
        // $scope.ProvinceObject = $scope.doctor.province;
        // console.log("123"+$scope.ProvinceObject);
      
    };
    //0516 zxf
    $scope.flag=0;//判断是给谁传图片 默认是资格证书
    //点击显示大图
    $scope.zoomMin = 1;
    $scope.imageUrl = '';
    $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        // $scope.modal.show();
        $scope.imageHandle = $ionicScrollDelegate.$getByHandle('imgScrollHandle');
    });

        

    $scope.onClickCamera = function($event,index){
        $scope.openPopover($event);
        $scope.flag=index;
    };
     // 上传照片并将照片读入页面-------------------------
    var photo_upload_display = function(imgURI){
        var temp_photoaddress;
        if($scope.flag==0){
            temp_photoaddress=Storage.get("UID") + "_" + new Date().getTime() + "certificate.jpg";
        }else{
            temp_photoaddress=Storage.get("UID") + "_" + new Date().getTime() + "practising.jpg";
        }
        Camera.uploadPicture(imgURI, temp_photoaddress)
        .then(function(res){
            var data=angular.fromJson(res)
            //图片路径
            if($scope.flag==0){
                $scope.doctor.certificatePhotoUrl=CONFIG.mediaUrl+String(data.path_resized)
            }
            else{
                $scope.doctor.practisingPhotoUrl=CONFIG.mediaUrl+String(data.path_resized)
            }
        },function(err){
            console.log(err);
            reject(err);
        })
    };
    ////-----------------------上传头像---------------------
    // ionicPopover functions 弹出框的预定义
    $ionicPopover.fromTemplateUrl('my-popover1.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
    // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
    // Execute action
    });

    
    // 相册键的点击事件---------------------------------
    $scope.onClickCameraPhotos = function(){
        // console.log("选个照片");
        $scope.choosePhotos();
        $scope.closePopover();
    };
    $scope.choosePhotos = function() {
        Camera.getPictureFromPhotos('gallery').then(function(data) {
          // data里存的是图像的地址
          // console.log(data);
          var imgURI = data;
          photo_upload_display(imgURI);
        }, function(err) {
          // console.err(err);
          var imgURI = undefined;
        });// 从相册获取照片结束
    }; // function结束


    // 照相机的点击事件----------------------------------
    $scope.getPhoto = function() {
        // console.log("要拍照了！");
        $scope.takePicture();
        $scope.closePopover();
    };

    $scope.takePicture = function() {
        Camera.getPicture('cam').then(function(data) {
          var imgURI = data;
          photo_upload_display(imgURI);
        }, function(err) {
            // console.err(err);
            var imgURI = undefined;
        })// 照相结束
    }; // function结束

    $scope.showoriginal=function(resizedpath){
        // $scope.openModal();
        // console.log(resizedpath)
        var originalfilepath=CONFIG.imgLargeUrl+resizedpath.slice(resizedpath.lastIndexOf('/')+1).substr(7)
        // console.log(originalfilepath)
        // $scope.doctorimgurl=originalfilepath;

        $scope.imageHandle.zoomTo(1, true);
        $scope.imageUrl = originalfilepath;
        $scope.modal.show();
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
}])


//首页
.controller('homeCtrl', ['Communication','$scope','$state','$interval','$rootScope', 'Storage','$http','$sce','$timeout','Doctor','New',function(Communication,$scope, $state,$interval,$rootScope,Storage,$http,$sce,$timeout,Doctor,New) {
    $scope.barwidth="width:0%";
    var windowHeight=$(window).height();
    console.log(Storage.get('USERNAME'));    
    $scope.hasUnreadMessages = false;
    var RefreshUnread;
    var GetUnread = function(){
        New.getNewsByReadOrNot({userId:Storage.get('UID'),readOrNot:0}).then(//
            function(data){
                // console.log(data.results.length)
                if(data.results.length){
                    $scope.hasUnreadMessages = true;
                    // console.log($scope.hasUnreadMessages);

                }else{
                    $scope.hasUnreadMessages = false;
                    // console.log($scope.hasUnreadMessages);
                }

                // console.log($scope.hasUnreadMessages);
            },function(err){
                    console.log(err);
            });
    }
    GetUnread();
    RefreshUnread = $interval(GetUnread,2000);
    $scope.isfullScreen=false;
    $scope.fullScreen=function()
    {
        // console.log("full")
        if($scope.isfullScreen)
        {
            $scope.isfullScreen=false;
            $scope.isWriting={'margin-top': '100px'};
        }
        else
        {
            $scope.isfullScreen=true;
            $scope.isWriting={'margin-top': '0px','z-index':'20'};
        }
    }
    $scope.isWriting={'margin-top': '100px'};
    if(!sessionStorage.addKBEvent)
    {
        // console.log("true")
        $(window).resize(function () {          //当浏览器大小变化时
            if($(window).height()<windowHeight)
                keyboardShowHandler();
            else
                keyboardHideHandler();
        });

        sessionStorage.addKBEvent=true;
    }
    function keyboardShowHandler(e){
        $scope.$apply(function(){
            $scope.isWriting={'margin-top': '-40px','z-index':'20'};
        })
    }
    function keyboardHideHandler(e){
        $scope.$apply(function(){
            if($scope.isfullScreen)
            {
                $scope.isWriting={'margin-top': '0px','z-index':'20'};
            }
            else
            {
                $scope.isWriting={'margin-top': '100px'};
            }
        })
    }
    Doctor.getDoctorInfo({
        userId:Storage.get('UID')
    })
    .then(
        function(data)
        {
            console.log(data)
            $scope.navigation_login=$sce.trustAsResourceUrl("http://proxy.haihonghospitalmanagement.com/member.php?mod=logging&action=login&loginsubmit=yes&loginhash=$loginhash&mobile=2&username="+data.results.name+Storage.get('USERNAME').slice(7)+"&password="+data.results.name+Storage.get('USERNAME').slice(7));
            $scope.navigation=$sce.trustAsResourceUrl("http://proxy.haihonghospitalmanagement.com/");
        },
        function(err)
        {
            console.log(err)
        }
    )
    $scope.options = {
        loop: false,
        effect: 'fade',
        speed: 500,
    }
    $scope.testregis=function()
    {
        // $http({
        //     method  : 'POST',
        //     url     : 'http://121.43.107.106/member.php?mod=register&mobile=2&handlekey=registerform&inajax=1',
        //     params    :{
        //         'regsubmit':'yes',
        //         'formhash':'',
        //         'D2T9s9':'test9',
        //         'O9Wi2H':"123456",
        //         'hWhtcM':'123456',
        //         'qSMA7S':'qw@qq.com'
        //     },  // pass in data as strings
        //     headers : {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Accept':'application/xml, text/xml, */*'
        //     }  // set the headers so angular passing info as form data (not request payload)
        // }).success(function(data) {
        //         // console.log(data);
        // });
    }
    var forumReg=function(phone,role)
    {
        // console.log(phone.userName+phone.phoneNo.slice(7))
        var un=phone.userName+phone.phoneNo.slice(7);
        var url='http://121.43.107.106';
        if(role=='patient')
            url+=':6699/member.php?mod=register&mobile=2&handlekey=registerform&inajax=1'
        else if(role=='doctor')
            url+='/member.php?mod=register&mobile=2&handlekey=registerform&inajax=1';
        $http({
            method  : 'POST',
            url     : url,
            params    :{
                'regsubmit':'yes',
                'formhash':'xxxxxx',
                'username':un,
                'password':un,
                'password2':un,
                'email':phone.phoneNo+'@bme319.com'
            },  // pass in data as strings
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept':'application/xml, text/xml, */*'
            }  // set the headers so angular passing info as form data (not request payload)
        }).success(function(s){
            console.log(s)
        })
    }
    $scope.importDocs=function()
    {
        $http({
            method:'GET',
            url:'http://121.196.221.44:4050/user/getPhoneNoByRole?role=patient'
        })
        .success(function(data)
        {
            console.log(data)
            var users=data.results;
            for(var i=0;i<users.length;i++)
            {
                forumReg(users[i],'patient');
            }
        })
        $http({
            method:'GET',
            url:'http://121.196.221.44:4050/user/getPhoneNoByRole?role=doctor'
        })
        .success(function(data)
        {
            console.log(data)
            var users=data.results;
            for(var i=0;i<users.length;i++)
            {
                forumReg(users[i],'doctor');
            }
        })
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
    var now=new Date();
    var year=now.getYear();
    var month=now.getMonth()+1;
    var day=now.getDate();
    var date1=month+"月"+day+"日";
    //var date1=new Date().format("MM月dd日");
    $scope.riqi=date1;
    
    var load = function()
    {
        //获取已完成
        Counsel.getCounsels({
            userId:Storage.get('UID'),
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
            userId:Storage.get('UID'),
            status:1
        })
        .then(
            function(data)
            {
                // console.log(data)
                Storage.set("consulting",angular.toJson(data.results))
                // console.log(angular.fromJson(Storage.get("consulting",data.results)))
                $scope.doctor.a=data.results.length;
            },
            function(err)
            {
                console.log(err)
            }
        )        
    }
    $scope.doRefresh = function(){
        load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }    
    // $scope.$on('$ionicView.beforeEnter', function() {
    //     $scope.params.isPatients = '1';
    // })
    $scope.$on('$ionicView.enter', function() {
        load();
    })
}])

//"咨询”进行中
.controller('doingCtrl', ['$scope','$state','$ionicLoading','$interval','$rootScope', 'Storage','$ionicPopover','Counsel','$ionicHistory','New',  function($scope, $state,$ionicLoading,$interval,$rootScope,Storage,$ionicPopover,Counsel,$ionicHistory,New) {
    var load = function(){
        Counsel.getCounsels({userId:Storage.get('UID'), status:1 })
        .then(function(data){
            $scope.allpatients=data.results;
            New.addNestNews('11',Storage.get('UID'),$scope.allpatients,'userId','patientId')
            .then(function(pats){
                $scope.patients=pats;
            })
            // $scope.patients=data.results;
        })        
    }
    $scope.$on('$ionicView.beforeEnter',function(){
        load();
    })
    $scope.doRefresh = function(){
        load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }   
    // $scope.allpatients=angular.fromJson(Storage.get("consulting"));
    // $scope.patients=$scope.allpatients;
    // console.log($scope.allpatients)
    //----------------开始搜索患者------------------
    $scope.search={
        name:''
    }
    
    $scope.goSearch = function() {
        Counsel.getCounsels({
            userId:Storage.get('UID'),
            status:1,
            name:$scope.search.name
        })
        .then(function(data) {
            $scope.patients = data.results
            if (data.results.length == 0) {
                //console.log("aaa")
                $ionicLoading.show({ template: '查无此人', duration: 1000 })
            }
        }, function(err) {
            console.log(err);
        })
    }

    // $scope.clearSearch = function() {
    //     $scope.search.name = '';
    //     $scope.patients = $scope.allpatients;
    // }
    //----------------结束搜索患者------------------
    $ionicPopover.fromTemplateUrl('partials/others/sort_popover_consult.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
        //$scope.testt=12345
    };
    $scope.filters={
        item1:true,
        item2:true
    }
    $scope.filterShow=function()
    {
        angular.forEach($scope.patients,function(value,key)
        {
            value.show=true;
            if(!$scope.filters.item1)
            {
                if(value.type==1)
                    value.show=false;
            }
            if(!$scope.filters.item2)
            {
                if(value.type==2||value.type==3)
                    value.show=false;
            }
        })
        // console.log($scope.patients)
    }

    $scope.goCounsel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.consult');
    }

    $scope.itemClick = function(ele, userId, counselId) {
        if (ele.target.id == 'doingdetail'){
            // console.log(userId)
            Storage.set('getpatientId',userId);
            $state.go('tab.patientDetail');
        }else
        {
            // Storage.set('getpatientId',userId);
            //[type]:0=已结束;1=进行中;2=医生
            $state.go('tab.detail',{type:'1',chatId:userId,counselId:counselId});
        }
    }
}])

//"咨询”已完成
.controller('didCtrl', ['$scope','$state','Counsel','$ionicLoading','$interval','$rootScope', 'Storage','$ionicPopover','$ionicHistory','New',  function($scope, $state,Counsel,$ionicLoading,$interval,$rootScope,Storage,$ionicPopover,$ionicHistory,New) {
    var load = function(){
        Counsel.getCounsels({userId:Storage.get('UID'), status:0 })
        .then(function(data){
            $scope.allpatients=data.results;
            New.addNestNews('11',Storage.get('UID'),$scope.allpatients,'userId','patientId')
            .then(function(pats){
                $scope.patients=pats;
            })

            // $scope.patients=data.results;
        })        
    }
    $scope.$on('$ionicView.beforeEnter',function(){
        load();
    })
    $scope.doRefresh = function(){
        load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }   
    // $scope.allpatients=angular.fromJson(Storage.get("consulted"));
    // $scope.patients=$scope.allpatients;
    //----------------开始搜索患者------------------
    $scope.search={
        name:''
    }
    $scope.goSearch = function() {
        Counsel.getCounsels({
            userId:Storage.get('UID'),
            status:0,
            name:$scope.search.name
        })
        .then(function(data) {
            $scope.patients = data.results
            if (data.results.length == 0) {
                //console.log("aaa")
                $ionicLoading.show({ template: '查无此人', duration: 1000 })
            }
        }, function(err) {
            console.log(err);
        })
    }

    // $scope.clearSearch = function() {
    //     $scope.search.name = '';
    //     $scope.patients = $scope.allpatients;
    // }
    //----------------结束搜索患者------------------      
    $ionicPopover.fromTemplateUrl('partials/others/sort_popover_consult.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
        //$scope.testt=12345
    };
    $scope.goCounsel = function(){
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('tab.consult');
    }
    $scope.filters={
        item1:true,
        item2:true
    }
    $scope.filterShow=function()
    {
        angular.forEach($scope.patients,function(value,key)
        {
            value.show=true;
            if(!$scope.filters.item1)
            {
                if(value.type==1)
                    value.show=false;
            }
            if(!$scope.filters.item2)
            {
                if(value.type==2||value.type==3)
                    value.show=false;
            }
        })
        // console.log($scope.patients)
    }

    $scope.itemClick = function(ele, userId, counselId) {
        if (ele.target.id == 'diddetail'){
            console.log(userId)
            Storage.set('getpatientId',userId);
            $state.go('tab.patientDetail');
        }else
        {
            // Storage.set('getpatientId',userId);
            //[type]:0=已结束;1=进行中;2=医生
            $state.go('tab.detail',{type:'0',chatId:userId,counselId:counselId});
        }
    }
    //$scope.isChecked1=true;
}])


//"患者”页
.controller('patientCtrl', ['Doctor','$scope','$state','$ionicLoading','$interval','$rootScope', 'Storage','$ionicPopover',  function(Doctor,$scope, $state,$ionicLoading,$interval,$rootScope,Storage,$ionicPopover) {
    $scope.barwidth="width:0%";
    var patients=[];
    $scope.params={
        isPatients:true,
        updateTime:0
    }

    var load = function()
    {
        Doctor.getPatientList({
            userId:Storage.get('UID')
        })
        .then(

            function(data)
            {
                console.log(data)
                if (data.results!='')
                {
                    $scope.allpatients=data.results.patients;
                    $scope.patients=$scope.allpatients;
                    //$scope.patients[1].patientId.VIP=0;
                    // $scope.patients.push(
                    //     {show:true,patientId:{IDNo:"330183199210315001",gender:1,class:"class_1",VIP:0,name:'static_01',birthday:"2017-04-18T00:00:00.000Z"}},
                    //     {show:false,patientId:{IDNo:"330183199210315002",gender:0,class:"class_2",VIP:1,name:'static_02',birthday:"2016-04-18T00:00:00.000Z"}},
                    //     {show:true,patientId:{IDNo:"330183199210315003",gender:1,class:"class_3",VIP:1,name:'static_03',birthday:"2015-04-18T00:00:00.000Z"}},
                    //     {show:true,patientId:{IDNo:"330183199210315004",gender:0,class:"class_4",VIP:0,name:'static_04',birthday:"2014-04-18T00:00:00.000Z"}},
                    //     {show:true,patientId:{IDNo:"330183199210315005",gender:1,class:"class_5",VIP:1,name:'static_05',birthday:"2013-04-18T00:00:00.000Z"}},
                    //     {show:true,patientId:{IDNo:"330183199210315006",gender:0,class:"class_6",VIP:1,name:'static_06',birthday:"2012-04-18T00:00:00.000Z"}})
                    // console.log($scope.patients)
                }
                else
                {
                    $scope.patients=''
                }
                angular.forEach($scope.patients,
                    function(value,key)
                    {
                        $scope.patients[key].show=true;
                    }
                )            
            },
            function(err)
            {
                console.log(err)
            }
        );

        Doctor.getPatientByDate({
            userId:Storage.get('UID')
        })
        .then(
            function(data)
            {
                //console.log(data)
                $scope.Todays=data.results2;
                // $scope.Todays.push(
                //         {show:true,patientId:{IDNo:"330183199210315001",gender:1,class:"class_1",VIP:0,name:'static_01',birthday:"2017-04-18T00:00:00.000Z"}},
                //         {show:false,patientId:{IDNo:"330183199210315002",gender:0,class:"class_2",VIP:1,name:'static_02',birthday:"2016-04-18T00:00:00.000Z"}},
                //         {show:true,patientId:{IDNo:"330183199210315003",gender:1,class:"class_3",VIP:1,name:'static_03',birthday:"2015-04-18T00:00:00.000Z"}},
                //         {show:true,patientId:{IDNo:"330183199210315004",gender:0,class:"class_4",VIP:0,name:'static_04',birthday:"2014-04-18T00:00:00.000Z"}},
                //         {show:true,patientId:{IDNo:"330183199210315005",gender:1,class:"class_5",VIP:1,name:'static_05',birthday:"2013-04-18T00:00:00.000Z"}},
                //         {show:true,patientId:{IDNo:"330183199210315006",gender:0,class:"class_6",VIP:1,name:'static_06',birthday:"2012-04-18T00:00:00.000Z"}})
                //console.log($scope.Todays)            
                angular.forEach($scope.Todays,
                    function(value,key)
                    {
                        $scope.Todays[key].show=true;
                    }
                )
            },
            function(err)
            {
                console.log(err)
            }
        );
    }
    //----------------开始搜索患者------------------
    $scope.search={
        name:''
    }
    $scope.goSearch = function() {
        //console.log(123)
        Doctor.getPatientList({ 
            userId:Storage.get('UID'),
            name: $scope.search.name 
        })
        .then(function(data) {
            //$scope.params.isPatients=true;
            //console.log(data.results)
            $scope.patients = data.results.patients;
            //console.log($scope.patients)
            //console.log($scope.allpatients)
            angular.forEach($scope.patients,
                function(value,key)
                {
                    $scope.patients[key].show=true;
                }
            )
            //console.log($scope.patients[0].patientId.name)
            if (data.results.patients.length == 0) {
                console.log("aaa")
                $ionicLoading.show({ template: '查无此人', duration: 1000 })
            }
        }, function(err) {
            console.log(err);
        })
    }

    $scope.clearSearch = function() {
        $scope.search.name = '';
        $scope.patients = $scope.allpatients;
    }
    //----------------结束搜索患者------------------
    $scope.doRefresh = function(){
        load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }    
    // $scope.$on('$ionicView.beforeEnter', function() {
    //     $scope.params.isPatients = '1';
    // })
    $scope.$on('$ionicView.enter', function() {
        load();
    })
    $scope.ShowPatients = function(){
        $scope.params.isPatients=true;
    }
    $scope.ShowTodays = function(){
        $scope.params.isPatients=false;
    }

    $scope.getPatientDetail = function(id) {
        console.log(id)
        Storage.set('getpatientId',id);
        $state.go('tab.patientDetail');
    }
 
    $ionicPopover.fromTemplateUrl('partials/others/sort_popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.filter={
        propertyName:'-patientId.VIP',
        choose:{
            isChecked1:true,
            isChecked2:true,
            isChecked3:true,
            isChecked4:true,
            isChecked5:true,
            isChecked6:true,
            isChecked7:true,
            isChecked8:true,
            isChecked9:false,
        }
    }
    var filterReset=angular.copy($scope.filter);
    $scope.resetFilter=function()
    {
        // console.log("reset")
        $scope.filter=angular.copy(filterReset);
        $scope.filterShow();
    }
    $scope.filterShow=function () {
        angular.forEach($scope.patients,
            function(value,key)
            {
                $scope.patients[key].show=true;
                if(!$scope.filter.choose.isChecked1)
                {
                    if(value.patientId.class=='class_1')
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked2)
                {
                    if(value.patientId.class=='class_5')
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked3)
                {
                    if(value.patientId.class=='class_6')
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked4)
                {
                    if(value.patientId.class=='class_2')
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked5)
                {
                    if(value.patientId.class=='class_3')
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked6)
                {
                    if(value.patientId.class=='class_4')
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked7)
                {
                    if(value.patientId.gender==1)
                        $scope.patients[key].show=false;
                }
                if(!$scope.filter.choose.isChecked8)
                {
                    if(value.patientId.gender==2)
                        $scope.patients[key].show=false;
                }
                if($scope.filter.choose.isChecked9)
                {
                    if(value.patientId.VIP==0)
                        $scope.patients[key].show=false;
                }
            }
        )
        angular.forEach($scope.Todays,
            function(value,key)
            {
                $scope.Todays[key].show=true;
                if(!$scope.filter.choose.isChecked1)
                {
                    if(value.patientId.class=='class_1')
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked2)
                {
                    if(value.patientId.class=='class_5')
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked3)
                {
                    if(value.patientId.class=='class_6')
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked4)
                {
                    if(value.patientId.class=='class_2')
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked5)
                {
                    if(value.patientId.class=='class_3')
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked6)
                {
                    if(value.patientId.class=='class_4')
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked7)
                {
                    if(value.patientId.gender==1)
                        $scope.Todays[key].show=false;
                }
                if(!$scope.filter.choose.isChecked8)
                {
                    if(value.patientId.gender==0)
                        $scope.Todays[key].show=false;
                }
                if($scope.filter.choose.isChecked9)
                {
                    if(value.patientId.VIP==0)
                        $scope.Todays[key].show=false;
                }
            }
        )
    }
}])

//"患者”详情子页
.controller('patientDetailCtrl', ['New','Insurance','Storage','Doctor','Patient','$scope','$ionicPopup','$ionicLoading','$ionicHistory','$state', function(New,Insurance,Storage,Doctor,Patient,$scope, $ionicPopup,$ionicLoading,$ionicHistory,$state) {
    $scope.hideTabs = true;

    // var patient = DoctorsInfo.searchdoc($stateParams.doctorId);
    // $scope.doctor = doc;
    // $scope.goback=function(){
    //     $ionicHistory.goBack();
    // }

    $scope.backview=$ionicHistory.viewHistory().backView
        $scope.backstateId=null;
        if($scope.backview!=null){
            $scope.backstateId=$scope.backview.stateId
            //console.log($scope.backstateId)
            if($scope.backstateId=="tab.doing"){
                Storage.set('backId',$scope.backstateId);
            }else if($scope.backstateId=="tab.did"){
                Storage.set('backId',$scope.backstateId);
            }else if($scope.backstateId=="tab.patient"){
                Storage.set('backId',$scope.backstateId)
            }                   
        }
        console.log(Storage.get('backId'))
        $scope.goback = function() {           
            var backId = Storage.get('backId')
            console.log(backId)
            if(backId=="tab.doing"){
              $state.go("tab.doing")
            }
            else if(backId=="tab.did"){
                $state.go('tab.did');
            }else if(backId=='tab.group-chat'){
                var p = JSON.parse(Storage.get('groupChatParams'));
                $state.go('tab.group-chat',p);
            }else if(backId=='tab.detail'){
                var q = JSON.parse(Storage.get('singleChatParams'));
                $state.go('tab.detail',q);
            }else{
              $state.go('tab.patient');
            }
        }

    $scope.gototestrecord=function(){
        $state.go('tab.TestRecord',{PatinetId:Storage.get('getpatientId')});
    }
    // console.log(Storage.get('getpatientId'))
    Patient.getPatientDetail({
         userId:Storage.get('getpatientId')
         //'U201705090001'
    })
    .then(
        function(data)
        {
            //console.log(data)
            Storage.set("latestDiagnose","");
            if(data.results.diagnosisInfo.length>0)
            {
                Storage.set("latestDiagnose",angular.toJson(data.results.diagnosisInfo[data.results.diagnosisInfo.length-1]));
                // console.log(data.results.diagnosisInfo[data.results.diagnosisInfo.length-1])
            }
            else if(data.results.diagnosisInfo.length==0)
            {
                var lD={
                    content:"",
                    hypertension:data.results.hypertension,
                    name:data.results.class,
                    operationTime:data.results.operationTime,
                    progress:data.results.class_info?data.results.class_info[0]:"",
                    time:""
                }
                Storage.set("latestDiagnose",angular.toJson(lD));
            }
            $scope.patient=data.results; 
            //console.log(data.recentDiagnosis)
            if (data.recentDiagnosis != null){
                $scope.RecentDiagnosis=data.recentDiagnosis[0];
                if($scope.RecentDiagnosis!= null) {
                    if ($scope.RecentDiagnosis.name == "class_4"){
                        $scope.RecentDiagnosis.time = null
                        $scope.RecentDiagnosis.progress = null
                    }else if ($scope.RecentDiagnosis.name == "class_2"|| $scope.RecentDiagnosis.name == "class_3"){
                        $scope.RecentDiagnosis.time = null
                    }else if ($scope.RecentDiagnosis.name == "class_5"|| $scope.RecentDiagnosis.name == "class_6" || $scope.RecentDiagnosis.name == "class_1"){
                        $scope.RecentDiagnosis.progress = null
                    }                      
                }
            }            
            //console.log($scope.RecentDiagnosis)
          
        },
        function(err)
        {
            console.log(err)
        }
    );

    Insurance.getInsMsg({
        doctorId:Storage.get('UID'),
        patientId:Storage.get('getpatientId')
    })
    .then(
        function(data)
        {
            // console.log(data.results)
            $scope.Ins=data.results||{count:0};                   
        },
        function(err)
        {
            console.log(err)
        }
    );

    $scope.SendInsMsg=function()
    {
        $ionicLoading.show({
            template: '推送成功',
            duration:1000
        });
        Insurance.updateInsuranceMsg({
            doctorId:Storage.get('UID'),
            patientId:Storage.get('getpatientId'),
            insuranceId:'ins01',
            description:'医生给您发送了一条保险消息'
            //type:5  //保险type=5
        })
        .then(
            function(data)
            {
                //console.log(data)
                $scope.Ins.count=$scope.Ins.count + 1;
                console.log(data)
                Storage.set('MessId',data.newResults.message.messageId)
                New.insertNews({
                    sendBy:Storage.get('UID'),
                    userId:Storage.get('getpatientId'),
                    type:5,
                    readOrNot:'0',
                    description:'医生给您发送了一条保险消息',
                    messageId:Storage.get('MessId')                    
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
                );
            },
            function(err)
            {
                console.log(err)
            }
        );
    }

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
.controller('meCtrl', ['CONFIG','Camera','Doctor','$scope','$state','$interval','$rootScope', 'Storage','$ionicPopover','$http', function(CONFIG,Camera,Doctor,$scope, $state,$interval,$rootScope,Storage,$ionicPopover,$http) {
  $scope.barwidth="width:0%";
   
    //$scope.userid=Storage.get('userid');
    // $scope.$on('$ionicView.beforeEnter', function() {
    //     $scope.doRefresh();
    // });
    
    Doctor.getDoctorInfo({
        userId:Storage.get('UID')
    })
    .then(
        function(data)
        {
          // console.log(data)
            $scope.doctor=data.results;
        },
        function(err)
        {
            console.log(err)
        }
    )

    //$scope.loadData(); 
    $scope.params = {
        // groupId:$state.params.groupId
        userId:Storage.get('UID')
    }

    // 上传头像的点击事件----------------------------
    $scope.onClickCamera = function($event){
        $scope.openPopover($event);
    };
    $scope.reload=function(){
        var t=$scope.doctor.photoUrl; 
        $scope.doctor.photoUrl=''
        $scope.$apply(function(){
            $scope.doctor.photoUrl=t;
        })
    }
 
    // 上传照片并将照片读入页面-------------------------
    var photo_upload_display = function(imgURI){
    // 给照片的名字加上时间戳
        var temp_photoaddress = Storage.get("UID") + "_" +  "doctor.photoUrl.jpg";
        console.log(temp_photoaddress)
        Camera.uploadPicture(imgURI, temp_photoaddress)
        .then(function(res){
            var data=angular.fromJson(res)
            //res.path_resized
            //图片路径
            $scope.doctor.photoUrl=CONFIG.mediaUrl+String(data.path_resized)+'?'+new Date().getTime();
            console.log($scope.doctor.photoUrl)
            // $state.reload("tab.mine")
            // Storage.set('doctor.photoUrlpath',$scope.doctor.photoUrl);
            Doctor.editDoctorDetail({userId:Storage.get("UID"),photoUrl:$scope.doctor.photoUrl}).then(function(r){
            console.log(r);
        })
        },function(err){
            console.log(err);
            reject(err);
        })
    };
    //-----------------------上传头像---------------------
    // ionicPopover functions 弹出框的预定义
    //--------------------------------------------
    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
        // Execute action
    });

    // 相册键的点击事件---------------------------------
    $scope.onClickCameraPhotos = function(){        
        // console.log("选个照片"); 
        $scope.choosePhotos();
        $scope.closePopover();
    };      
    $scope.choosePhotos = function() {
        Camera.getPictureFromPhotos('gallery').then(function(data) {
            // data里存的是图像的地址
            // console.log(data);
            var imgURI = data; 
            photo_upload_display(imgURI);
        }, function(err) {
            // console.err(err);
            var imgURI = undefined;
        });// 从相册获取照片结束
    }; // function结束

    // 照相机的点击事件----------------------------------
    $scope.getPhoto = function() {
        // console.log("要拍照了！");
        $scope.takePicture();
        $scope.closePopover();
    };
    $scope.isShow=true;
    $scope.takePicture = function() {
        Camera.getPicture('cam').then(function(data) {
            console.log(data)
            photo_upload_display(data);
      }, function(err) {
            // console.err(err);
            var imgURI = undefined;
        })// 照相结束
    }; // function结束

}])

//"我”二维码页
.controller('QRcodeCtrl', ['Doctor','$scope','$state','$interval','$rootScope', 'Storage',  function(Doctor,$scope, $state,$interval,$rootScope,Storage) {
    //$scope.hideTabs = true;
    //$scope.userid=Storage.get('userid');
    // $scope.doctor=meFactory.GetDoctorInfo($scope.userid);
  

    //  $scope.qrscan= function(){
    //   QRScan.getCode({
    //   userId:'doc01'
    // })
    //   .then(function(data){
    //     console.log(data);
    //   },function(err){
    //     console.log(err);
    //   })
    // };

    $scope.params = {
        // groupId:$state.params.groupId
        userId:Storage.get('UID')
    }

    Doctor.getDoctorInfo({
        userId:Storage.get('UID')
    })
    .then(
        function(data)
        {
            // console.log(data)
            $scope.doctor=data.results;
        },
        function(err)
        {
            console.log(err)
        }
    );
}])


//我的个人资料页
.controller('myinfoCtrl', ['CONFIG','Dict','Camera','Doctor','$scope','Storage','$ionicPopover','$ionicModal','$ionicScrollDelegate', function(CONFIG,Dict,Camera,Doctor,$scope, Storage,$ionicPopover,$ionicModal,$ionicScrollDelegate) {
    $scope.hideTabs = true;
    $scope.updateDiv=false;
    $scope.myDiv=true;
    $scope.ProvinceObject={};
    $scope.CityObject={};
    $scope.HosObject={};
    $scope.Titles =
    [
        {Name:"主任医师",Type:1},
        {Name:"副主任医师",Type:2},
        {Name:"主治医师",Type:3},
        {Name:"住院医师",Type:4},
        {Name:"主任护师",Type:5},
        {Name:"副主任护师",Type:6},
        {Name:"主管护师",Type:7},
        {Name:"护师",Type:8},
        {Name:"护士",Type:9}
    ]
    console.log(Storage.get('UID'))
    Doctor.getDoctorInfo({
        userId:Storage.get('UID')
    })
    .then(
        function(data)
        {
            // console.log(data)
            $scope.doctor=data.results;
        },
        function(err)
        {
            console.log(err)
        }
    )


    $scope.editinfo = function() {
        // $scope.ProvinceObject = $scope.doctor.province;
        // console.log("123"+$scope.ProvinceObject);
        $scope.doctor.title = $scope.doctor.title.Name
        Doctor.editDoctorDetail($scope.doctor)
        .then(
            function(data)
            {
                console.log(data)
            },
            function(err)
            {
                console.log(err)
            }
        );
        $scope.myDiv = !$scope.myDiv;
        $scope.updateDiv = !$scope.updateDiv;       
    };
    
    $scope.toggle = function() {
        $scope.myDiv = !$scope.myDiv;
        $scope.updateDiv = !$scope.updateDiv;
        //$scope.ProvinceObject = $scope.doctor.province;
        //console.log($scope.ProvinceObject);
        var searchObj = function(code,array){
            if(array && array.length){
                for (var i = 0; i < array.length; i++) {
                    if(array[i].name == code || array[i].hospitalName == code|| array[i].Name == code) return array[i];
                };
            }
            return "未填写";           
        }
        //读职称
        if ($scope.doctor.title != null){
            console.log($scope.doctor.title)
            console.log($scope.Titles)
            $scope.doctor.title = searchObj($scope.doctor.title,$scope.Titles)
        } 
        //-------------点击编辑省市医院读字典表--------------
        if ($scope.doctor.province != null){
            //console.log($scope.doctor.province)
            //console.log($scope.Provinces)
            $scope.ProvinceObject = searchObj($scope.doctor.province,$scope.Provinces)

        }
        if ($scope.doctor.city != null){
            //console.log($scope.ProvinceObject.province)
            Dict.getDistrict({level:"2",province:$scope.ProvinceObject.province,city:"",district:""})
            .then(
                function(data)
                {
                    $scope.Cities = data.results;
                    //console.log($scope.Cities);
                    $scope.CityObject = searchObj($scope.doctor.city,$scope.Cities)
                    console.log($scope.CityObject)
                    console.log($scope.CityObject.name)
                    if ($scope.doctor.workUnit != null){
                        //console.log($scope.Hospitals)
                        console.log($scope.doctor.workUnit)
                        console.log($scope.CityObject)
                        console.log($scope.CityObject.name)
                        Dict.getHospital({city:$scope.CityObject.name})
                        .then(
                            function(data)
                            {
                                $scope.Hospitals = data.results;
                                //console.log($scope.Hospitals);
                                $scope.HosObject = searchObj($scope.doctor.workUnit,$scope.Hospitals)
                            },
                            function(err)
                            {
                                console.log(err);
                            }
                        )                   
                    }
                },
                function(err)
                {
                    console.log(err);
                }
            );                       
        }
        //-------------点击编辑省市医院读字典表--------------

    };

    //--------------省市医院读字典表---------------------
    Dict.getDistrict({level:"1",province:"",city:"",district:""})
    .then(
        function(data)
        {
            $scope.Provinces = data.results;
            //$scope.Province.province = "";
            //console.log($scope.Provinces)
        },
        function(err)
        {
            console.log(err);
        }
    )    

    $scope.getCity = function (pro) {
        console.log(pro)
        if(pro!=null){
            Dict.getDistrict({level:"2",province:pro,city:"",district:""})
            .then(
                function(data)
                {
                    $scope.Cities = data.results;
                    console.log($scope.Cities);            
                },
                function(err)
                {
                    console.log(err);
                }
            );
        }else{
            $scope.Cities = {};
            $scope.Hospitals = {};
        }
    }

    $scope.getHospital = function (city) {
            console.log(city)
        if(city!=null){
            //var locationCode = district.province + district.city + district.district
            //console.log(locationCode)

            Dict.getHospital({city:city})
            .then(
                function(data)
                {
                    $scope.Hospitals = data.results;
                    console.log($scope.Hospitals);
                },
                function(err)
                {
                    console.log(err);
                }
            )
        }else{
            $scope.Hospitals = {};
        }
    }

    $scope.trans = function(docinfo){
        console.log(docinfo)
        if (docinfo !=null)
        {
            $scope.doctor.province = docinfo.province;
            $scope.doctor.city = docinfo.city;
            $scope.doctor.workUnit = docinfo.hospitalName;    
        }
      
    }

    //执照照片



    $scope.zoomMin = 1;
    $scope.imageUrl = '';
    $ionicModal.fromTemplateUrl('templates/msg/imageViewer.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
        // $scope.modal.show();
        $scope.imageHandle = $ionicScrollDelegate.$getByHandle('imgScrollHandle');
    });
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
    //0516 zxf
    $scope.flag=0;//判断是给谁传图片 默认是资格证书
    //点击显示大图
    $scope.doctorimgurl="";
    // $ionicModal.fromTemplateUrl('partials/others/doctorimag.html', {
    //     scope: $scope,
    //     animation: 'slide-in-up'
    // }).then(function(modal) {
    //     console.log(2222)
    //     $scope.modal = modal;
    // });

    $scope.onClickCamera = function($event,index){
        $scope.openPopover($event);
        $scope.flag=index;
    };
     // 上传照片并将照片读入页面-------------------------
    var photo_upload_display = function(imgURI){
        var temp_photoaddress;
        if($scope.flag==0){
            temp_photoaddress=Storage.get("UID") + "_" + new Date().getTime() + "certificate.jpg";
        }else{
            temp_photoaddress=Storage.get("UID") + "_" + new Date().getTime() + "practising.jpg";
        }
        Camera.uploadPicture(imgURI, temp_photoaddress)
        .then(function(res){
            var data=angular.fromJson(res)
            //图片路径
            if($scope.flag==0){
                $scope.doctor.certificatePhotoUrl=CONFIG.mediaUrl+String(data.path_resized)
            }
            else{
                $scope.doctor.practisingPhotoUrl=CONFIG.mediaUrl+String(data.path_resized)
            }
        },function(err){
            console.log(err);
            reject(err);
        })
    };
    ////-----------------------上传头像---------------------
    // ionicPopover functions 弹出框的预定义
    $ionicPopover.fromTemplateUrl('my-popover1.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(popover) {
        $scope.popover = popover;
    });
    $scope.openPopover = function($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function() {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function() {
    // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function() {
    // Execute action
    });

    
    // 相册键的点击事件---------------------------------
    $scope.onClickCameraPhotos = function(){
        // console.log("选个照片");
        $scope.choosePhotos();
        $scope.closePopover();
    };
    $scope.choosePhotos = function() {
        Camera.getPictureFromPhotos('gallery').then(function(data) {
          // data里存的是图像的地址
          // console.log(data);
          var imgURI = data;
          photo_upload_display(imgURI);
        }, function(err) {
          // console.err(err);
          var imgURI = undefined;
        });// 从相册获取照片结束
    }; // function结束


    // 照相机的点击事件----------------------------------
    $scope.getPhoto = function() {
        // console.log("要拍照了！");
        $scope.takePicture();
        $scope.closePopover();
    };
    $scope.isShow=true;
    $scope.takePicture = function() {
        Camera.getPicture('cam').then(function(data) {
          var imgURI = data;
          photo_upload_display(imgURI);
        }, function(err) {
            // console.err(err);
            var imgURI = undefined;
        })// 照相结束
    }; // function结束



    // $scope.openModal = function() {
    //   $scope.modal.show();
    // };
    // $scope.closeModal = function() {
    //   $scope.modal.hide();
    // };
    // //Cleanup the modal when we're done with it!
    // $scope.$on('$destroy', function() {
    //   $scope.modal.remove();
    // });
    // // Execute action on hide modal
    // $scope.$on('modal.hidden', function() {
    //   // Execute action
    // });
    // // Execute action on remove modal
    // $scope.$on('modal.removed', function() {
    //   // Execute action
    // });

    // //点击图片返回
    // $scope.imggoback = function(){
    //     $scope.modal.hide();
    // };
    $scope.showoriginal=function(resizedpath){
        // $scope.openModal();
        // console.log(resizedpath)
        var originalfilepath=CONFIG.imgLargeUrl+resizedpath.slice(resizedpath.lastIndexOf('/')+1).substr(7)
        // console.log(originalfilepath)
        // $scope.doctorimgurl=originalfilepath;

        $scope.imageHandle.zoomTo(1, true);
        $scope.imageUrl = originalfilepath;
        $scope.modal.show();
    }
    // $scope.deleteimg=function(index){
    //     //somearray.removeByValue("tue");
    //     console.log($scope.health.imgurl)
    //     $scope.health.imgurl.splice(index, 1)
    //     // Storage.set('tempimgrul',angular.toJson($scope.images));
    // }
    //------------省市医院读字典表--------------------

}])

//"我”个人收费页
.controller('myfeeCtrl', ['Account','Doctor','$scope','$ionicPopup','$state','Storage' ,function(Account,Doctor,$scope, $ionicPopup,$state,Storage) {
    $scope.hideTabs = true;
    var load = function(){
        Doctor.getDoctorInfo({
            userId:Storage.get('UID')
        })
        .then(
            function(data)
            {
            // console.log(data)
                $scope.doctor=data.results;
            },
            function(err)
            {
                console.log(err)
            }
        )

        Account.getAccountInfo({
            userId:Storage.get('UID')
        })
        .then(
            function(data)
            {
                //console.log(data)
                //console.log(data.results[0].money)
                $scope.account={money:data.results.length==0?0:data.results[0].money};
                // if (data.results.length!=0)
                // {
                //     $scope.account=data.results
                // }
                // else
                // {
                //     $scope.account={money:0}
                // }
            },
            function(err)
            {
                console.log(err)
            }
        )        
    }
    $scope.$on('$ionicView.enter', function() {
        load();
    })
    $scope.doRefresh = function(){
        load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }   

    $scope.savefee = function() {
        if($scope.doctor.charge2<$scope.doctor.charge1){
            $scope.SaveStatus="咨询收费不得低于问诊收费，请重新设置"
            return;
        }
        Doctor.editDoctorDetail($scope.doctor)
        .then(
            function(data)
            {
                // console.log(data)
                // $scope.doctor=data.result;
            },
            function(err)
            {
                console.log(err)
            }
        )
        $state.go('tab.me');              

    };

    $scope.getBill=function()
    {
        // console.log("bill");
        $state.go("tab.bill")
    }


  
}])


//"我”的评价
.controller('feedbackCtrl', ['Patient','Doctor','$scope','$ionicPopup','$state', 'Storage',function(Patient,Doctor,$scope, $ionicPopup,$state,Storage) {
    $scope.hideTabs = true;
    var commentlength='';
    //var commentlist=[];
    var load = function(){
        Doctor.getDoctorInfo({
            userId:Storage.get('UID')
        })
        .then(
            function(data)
            {
                // console.log(data)
                $scope.feedbacks=data.comments;
                $scope.doctor=data.results;
                //console.log($scope.feedbacks.length)
                //commentlength=data.comments.length;
                //   for (var i=0; i<commentlength; i++){
                //       commentlist[i]=$scope.feedbacks[i].pateintId.userId;
            },
            function(err)
            {
                console.log(err)
            }
        );

        // for (var i=0; i<commentlength; i++){
        //     Patient.getPatientDetail({
        //     userId:$scope.feedbacks[i].pateintId.userId
        // })
        //     .then(
        //         function(data)
        //         {
        //         // console.log(data)
        //             $scope.feedbacks[i].photoUrl=data.results.photoUrl;
        //         },
        //         function(err)
        //         {
        //             console.log(err)
        //         }
        //     );
        // }
    }
    $scope.$on('$ionicView.enter', function() {
        load();
    })

    $scope.doRefresh = function(){
        load();
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
    }
    $scope.gocommentdetail=function(score,content){
        console.log(score+content)
        $state.go('tab.commentdetail',{rating:score,content:content})
    }

}])
//"我”的评价详情
.controller('SetCommentCtrl', ['$scope','$state', '$stateParams','$ionicHistory','Storage',function($scope,$state,$stateParams,$ionicHistory,Storage) {
      $scope.comment={score:$stateParams.rating, commentContent:$stateParams.content};
      // console.log($stateParams.rating+$stateParams.content)
      $scope.editable=true;
       
      // //  //评论星星初始化
      $scope.ratingsObject = {
        iconOn: 'ion-ios-star',
        iconOff: 'ion-ios-star-outline',
        iconOnColor: '#FFD700',//rgb(200, 200, 100)
        iconOffColor: 'rgb(200, 100, 100)',
        rating: $scope.comment.score/2, 
        minRating: 1,
        readOnly:true
        // callback: function(rating) {
        //   $scope.ratingsCallback(rating);
        // }
      };
      //$stateParams.counselId
       //获取历史评论
      // if($stateParams.counselId!=undefined&&$stateParams.counselId!=""&&$stateParams.counselId!=null){
      //   console.log($stateParams.counselId)
      //   Comment.getCommentsByC({counselId:$stateParams.counselId}).then(function(data){
      //     if(data.results.length!=0){
      //       // //初始化
      //       $scope.comment.score=data.results[0].totalScore/2
      //       $scope.comment.commentContent=data.results[0].content
      //        //评论星星初始化
      //        $scope.$broadcast('changeratingstar',$scope.comment.score,true);
      //        $scope.editable=true;
      //     }
      //   }, function(err){
      //     console.log(err)
      //   })
      // }

      $scope.Goback=function(){
        $ionicHistory.goBack();
      }

      
}])

//"我”设置页
.controller('setCtrl', ['$scope','$ionicPopup','$state','$timeout','$stateParams', 'Storage','$sce',function($scope, $ionicPopup,$state,$timeout,$stateParams,Storage,$sce) {
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
        $scope.navigation_login=$sce.trustAsResourceUrl("http://proxy.haihonghospitalmanagement.com/member.php?mod=logging&action=logout&formhash=xxxxxx");
        $timeout(function(){$state.go('signin');},500);
    };
  
}])


//"我”设置内容修改密码页
.controller('set-contentCtrl', ['$timeout','$scope','$ionicPopup','$state','$stateParams','Storage','User', function($timeout,$scope, $ionicPopup,$state,$stateParams,Storage,User) {
    $scope.hideTabs = true; 
    $scope.type = $stateParams.type;
    $scope.resetPassword=function(oldPW,newPW,confirmPW)
    {
        // console.log("resetpw")
        // console.log(oldPW)
        // console.log(newPW)
        // console.log(confirmPW)
        if(oldPW==undefined)
        {
            $scope.changePasswordStatus="请输入旧密码"
            return;
        }
        if(oldPW==newPW)
        {
            $scope.changePasswordStatus="不能重置为之前的密码"
            return;
        }
        if(newPW==undefined||newPW.length<6)
        {
            $scope.changePasswordStatus="新密码不能为空且必须大于6位"
            return;
        }
        if(newPW!=confirmPW)
        {
            $scope.changePasswordStatus="两次输入不一致"
            return;
        }
        User.logIn({username:Storage.get('USERNAME'),password:oldPW,role:'doctor'})
        .then(function(succ)
        {
            // console.log(Storage.get('USERNAME'))
            if(succ.results.mesg=="login success!")
            {
                User.changePassword({phoneNo:Storage.get('USERNAME'),password:newPW})
                .then(function(succ)
                {
                    // console.log(succ)
                    var phoneNo=Storage.get('USERNAME')
                    //Storage.clear();
                    Storage.set('USERNAME',phoneNo)
                    $scope.changePasswordStatus = "修改成功！";
                    //$state.go('signin');
                    $timeout(function(){$state.go('tab.set');},500);
                },function(err)
                {
                    console.log(err)
                })
            }
            else
            { 
                $scope.changePasswordStatus="旧密码不正确"
            }
        },function(err)
        {
            console.log(err)
        })
    }
  
}])
//“我”设置内容查看协议页
.controller('viewAgreeCtrl', ['$scope','$state','Storage','$ionicHistory', function($scope,$state,Storage,$ionicHistory) {
     
}])

//"我”排班页
.controller('schedualCtrl', ['$scope','ionicDatePicker','$ionicPopup','Doctor','Storage','$interval', function($scope,ionicDatePicker,$ionicPopup,Doctor,Storage,$interval) {
    $scope.dateC=new Date();
    var getSchedual=function()
    {
        Doctor.getSchedules({userId:Storage.get('UID')})
        .then(function(data)
        {
            // console.log(data)
            angular.forEach(data.results.schedules,function(value,key)
            {
                // console.log(value)
                var index=value.day-'0';
                if(value.time==1)
                    index+=7;
                $scope.workStatus[index].status=1;
                $scope.workStatus[index].style={'background-color':'red'};
            })
        },function(err)
        {
            console.log(err)
        })
        Doctor.getSuspendTime({userId:Storage.get('UID')})
        .then(function(data)
        {
            console.log(data.results.suspendTime)
            if(data.results.suspendTime.length==0)
            {
                $scope.stausText="接诊中..."
                $scope.stausButtontText="设置停诊"
            }
            else
            {
                var date=new Date();
                var dateNow=''+date.getFullYear();
                (date.getMonth()+1)<10?dateNow+='0'+(date.getMonth()+1):dateNow+=(date.getMonth()+1)
                date.getDate()<10?dateNow+='0'+date.getDate():dateNow+=date.getDate();
                console.log(dateNow)

                $scope.begin=data.results.suspendTime[0].start;
                $scope.end=data.results.suspendTime[0].end;

                date=new Date($scope.begin);
                var dateB=''+date.getFullYear();
                (date.getMonth()+1)<10?dateB+='0'+(date.getMonth()+1):dateB+=(date.getMonth()+1)
                date.getDate()<10?dateB+='0'+date.getDate():dateB+=date.getDate();
                date=new Date($scope.end);
                var dateE=''+date.getFullYear();
                (date.getMonth()+1)<10?dateE+='0'+(date.getMonth()+1):dateE+=(date.getMonth()+1)
                date.getDate()<10?dateE+='0'+date.getDate():dateE+=date.getDate();

                if(dateNow>=dateB&&dateNow<=dateE)
                {
                    $scope.stausText="停诊中..."
                }
                else
                {
                    $scope.stausText="接诊中..."
                }
                $scope.stausButtontText="取消停诊"
            }
        },function(err)
        {
            console.log(err)
        })
    }
    $scope.workStatus=[
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
        {status:0,style:{'background-color':'white'}},
    ]
    $scope.stausButtontText="停诊"
    $scope.stausText="接诊中..."
    $scope.showSchedual=true;
    getSchedual();
    $interval(function(){
        var getD=new Date();
        if(getD.getDate()!=$scope.dateC.getDate())
        {
            $scope.dateC=new Date();
            getSchedual();
        }
    },1000);
    var ipObj1 = {
        callback: function (val) {  //Mandatory
            // console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            if($scope.flag==1)
            {
                $scope.begin=val;
                if($scope.end==undefined||$scope.begin>new Date($scope.end))
                        $scope.end=$scope.begin;
            }
            else
            {
                $scope.end=val;
                if($scope.begin!=undefined&&$scope.begin>new Date($scope.end))
                    $scope.begin=$scope.end;
            }
        },
        titleLabel: '',
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
        monthsList:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        from:new Date()
    };

    $scope.openDatePicker = function(params){
        ipObj1.titleLabel=params==1?'停诊开始日期':'停诊结束日期';
        if(params==1)
        {
            if($scope.begin!=undefined)
                ipObj1.inputDate=new Date($scope.begin);
        }
        else
        {
            if($scope.end!=undefined)
                ipObj1.inputDate=new Date($scope.end);
        }
        ionicDatePicker.openDatePicker(ipObj1);
        $scope.flag=params;//标识选定时间用于开始时间还是结束时间
    };

    $scope.showSch=function()
    {
        if($scope.stausButtontText=="设置停诊")
        {
            $scope.showSchedual=false;
        }
        else
        {
            var param={
                userId:Storage.get('UID'),
                start:$scope.begin,
                end:$scope.end
            }
            // console.log(param)
            Doctor.deleteSuspendTime(param)
            .then(function(data)
            {
                console.log(data)
                $scope.stausButtontText="设置停诊"
                $scope.stausText="接诊中..."
            },function(err)
            {
                console.log(err)
            })
        }
    }
    $scope.stopWork=function(cancel)
    {
        if(cancel)
        {
            $scope.showSchedual=true;
            return;
        }
        if($scope.begin!=undefined&&$scope.end!=undefined)
        {
            var param={
                userId:Storage.get('UID'),
                start:$scope.begin,
                end:$scope.end
            }
            // console.log(param)
            Doctor.insertSuspendTime(param)
            .then(function(data)
            {
                $scope.showSchedual=true;
                getSchedual();
            },function(err)
            {
                console.log(err)
            })
        }
    }
    $scope.changeWorkStatus=function(index)
    {
        // console.log("changeWorkStatus"+index)
        var text=''
        if($scope.workStatus[index].status==0)
        {
            text = '此时间段将更改为工作状态！'
        }
        else
        {
            text = '此时间段将更改为空闲状态！'
        }
        var confirmPopup = $ionicPopup.confirm({
            title: '修改工作状态',
            template: text,
            cancelText:'取消',
            okText:'确定'
        });

        confirmPopup.then(function(res) {
            if(res) {
                // console.log('You are sure');
                var param={
                    userId:Storage.get('UID'),
                    day:index.toString(),
                    time:'0'
                }
                if(index>6)
                {
                    param.time='1';
                    param.day=(index-7).toString();
                }
                // console.log(param)
                if($scope.workStatus[index].status==0)
                {
                    Doctor.insertSchedule(param)
                    .then(function(data)
                    {
                        // console.log(data)
                        $scope.workStatus[index].status=1;
                        $scope.workStatus[index].style={'background-color':'red'};
                    },function(err)
                    {
                        console.log(err)
                    })
                }
                else
                {
                    Doctor.deleteSchedule(param)
                    .then(function(data)
                    {
                        // console.log(data)
                        $scope.workStatus[index].status=0;
                        $scope.workStatus[index].style={'background-color':'white'};
                    },function(err)
                    {
                        console.log(err)
                    })
                }
            }
            else {
                // console.log('You are not sure');
            }
        });
    }

}])

.controller('aboutCtrl', ['$scope','$state','Storage','$ionicHistory', function($scope,$state,Storage,$ionicHistory) {
     
}])
.controller('billCtrl', ['$scope','Storage','$http','$ionicScrollDelegate','Expense',function($scope,Storage,$http,$ionicScrollDelegate,Expense) {
    var doc={
        doctorId:Storage.get('UID'),
        skip:0,
        limit:10
    }
    $scope.doc={
        bills:[],
        hasMore:false
    }
    $scope.doRefresh=function()
    {
        doc.skip=0;
        $scope.doc.hasMore=false
        Expense.getDocRecords(doc)
        .then(function(data)
        {
            $scope.doc.bills=data.results;
            doc.skip+=data.results.length;
            data.results.length==doc.limit?$scope.doc.hasMore=true:$scope.doc.hasMore=false;
            $scope.$broadcast('scroll.refreshComplete');
        },function(err)
        {
            console.log(err)
            $scope.$broadcast('scroll.refreshComplete');
        })
    }
    $scope.doRefresh();
    $scope.loadMore=function()
    {
        Expense.getDocRecords(doc)
        .then(function(data)
        {
            $scope.doc.bills=$scope.doc.bills.concat(data.results);
            doc.skip+=data.results.length;
            data.results.length==doc.limit?$scope.doc.hasMore=true:$scope.doc.hasMore=false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        },function(err)
        {
            console.log(err)
            $scope.$broadcast('scroll.infiniteScrollComplete');
        })
    }
    $scope.scroll2Top=function()
    {
        $ionicScrollDelegate.scrollTop(true);
    }
}])
