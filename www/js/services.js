angular.module('ionic-datepicker.service', [])

  .service('IonicDatepickerService', function () {

    this.monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    this.getYearsList = function (from, to) {
      console.log(from, to)
      var yearsList = [];
      var minYear = 1900;
      var maxYear = new Date().getFullYear() + 1;

      minYear = from ? new Date(from).getFullYear() : minYear;
      maxYear = to ? new Date(to).getFullYear() : maxYear;

      for (var i = maxYear; i >= minYear; i--) {
        yearsList.push(i);
      }

      return yearsList;
    };
});

angular.module('kidney.services', ['ionic','ngResource'])

// 本地存储函数
.factory('Storage', ['$window', function ($window) {
  return {
    set: function(key, value) {
      $window.localStorage.setItem(key, value);
    },
    get: function(key) {
      return $window.localStorage.getItem(key);
    },
    rm: function(key) {
      $window.localStorage.removeItem(key);
    },
    clear: function() {
      $window.localStorage.clear();
    }
  };
}])
.constant('CONFIG', {
    baseUrl: 'http://121.43.107.106:4050/',
    mediaUrl: 'http://121.43.107.106:8052/',
    socketServer:'ws://121.43.107.106:4050/',
    imgThumbUrl: 'http://121.43.107.106:8052/uploads/photos/resize',
    imgLargeUrl: 'http://121.43.107.106:8052/uploads/photos/',
    cameraOptions: {
        cam: {
            quality: 70,
            destinationType: 1,
            sourceType: 1,
            allowEdit: true,
            encodingType: 0,
            targetWidth: 1000,
            targetHeight: 1000,
            popoverOptions: false,
            saveToPhotoAlbum: false
        },
        gallery: {
            quality: 70,
            destinationType: 1,
            sourceType: 0,
            allowEdit: true,
            encodingType: 0,
            targetWidth: 1000,
            targetHeight: 1000
        }
    }
})

//自定义函数
//登录
.service("loginFactory",function(Storage){
  var service={};
  var flag=false;
  var userid;//用户ID
  
  this.isLogin=function(user,pwd){
    //账户写死
    if(user=="13709553333"&&pwd=="123") 
    {
      userid="D201703240001";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(user=="13709553334"&&pwd=="123") 
    {
      userid="D201703240002";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(user=="18868800021"&&pwd=="123") 
    {
      userid="D201703240091";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(user=="18868800022"&&pwd=="123") 
    {
      userid="D201703240092";
      Storage.set('userid',userid);//存储全局变量userid,通过本地存储
      flag=true;
    }
    if(window.jmessage)
    {
        window.JMessage.login(user, user,
        function(response) {
            window.JMessage.username = user
            //gotoConversation();
        },
        function(err) {
            console.log(err);
            // JM.register($scope.useruserID, $scope.passwd);
        });
    }
    return flag;
  }
  
  //return service;
})

//media文件操作 XJZ
.factory('fs',['$q','$cordovaFile','$filter',function($q,$cordovaFile,$filter){
    return {
        mvMedia:function(type,fileName,ext){
            return $q(function(resolve, reject) {
                if(type=='voice') var path=cordova.file.externalRootDirectory;
                else if(type=='image') var path=cordova.file.externalCacheDirectory;
                else reject("type must be voice or image");
                var time=new Date();
                var newName= $filter('date')(time,'yyyyMMddHHmmss')+ext;
                $cordovaFile.moveFile(path, fileName, cordova.file.dataDirectory,newName)
                  .then(function (success) {
                    // console.log(success);
                    resolve(success.nativeURL);
                  }, function (error) {
                    console.log(error);
                    reject(error);
                  });
              });
        }
    }

}])
//voice recorder XJZ
.factory('voice', ['$filter', '$q', '$ionicLoading', '$cordovaFile', 'CONFIG', 'Storage', 'fs', function($filter, $q, $ionicLoading, $cordovaFile, CONFIG, Storage, fs) {
    //funtion audio(){};
    var audio = {};
    audio.src = '';
    audio.media = {};

    audio.record = function(receiver, onSuccess, onError) {
        return $q(function(resolve, reject) {
            if (audio.media.src) audio.media.release();
            var time = new Date();
            audio.src = $filter('date')(time, 'yyyyMMddHHmmss') + '.amr';
            audio.media = new Media(audio.src,
                function() {
                    console.info("recordAudio():Audio Success");
                    console.log(audio.media);
                    $ionicLoading.hide();

                    fs.mvMedia('voice', audio.src, '.amr')
                        .then(function(fileUrl) {
                            console.log(fileUrl);
                            resolve(fileUrl);
                            // window.JMessage.sendSingleVoiceMessage(receiver, fileUrl, CONFIG.appKey,
                            //     function(res) {
                            //         resolve(res);
                            //     },
                            //     function(err) {
                            //         reject(err)
                            //     });
                            // resolve(fileUrl.substr(fileUrl.lastIndexOf('/')+1));
                        }, function(err) {
                            console.log(err);
                            reject(err);
                        });
                },
                function(err) {
                    console.error("recordAudio():Audio Error");
                    console.log(err);
                    reject(err);
                });
            audio.media.startRecord();
            $ionicLoading.show({ template: '开始说话',noBackdrop:true});
        });
    }
    audio.stopRec = function() {
        audio.media.stopRecord();
    }
    audio.open = function(fileUrl) {
        if(audio.media.src)audio.media.release();
        return $q(function(resolve, reject) {
            audio.media = new Media(fileUrl,
                function(success) {
                    resolve(audio.media)
                },
                function(err) {
                    reject(err);
                })
        });

    }
    audio.play = function(src) {
        audio.media.play();
    }
    audio.stop = function() {
        audio.media.stop();
    }
    audio.sendAudio = function(fileUrl, receiver) {
        // return $q(function(resolve, reject) {
        window.JMessage.sendSingleVoiceMessage(receiver, cordova.file.externalRootDirectory + fileUrl, CONFIG.appKey,
            function(response) {
                console.log("audio.send():OK");
                console.log(response);
                //$ionicLoading.show({ template: 'audio.send():[OK] '+response,duration:1500});
                // resolve(response);
            },
            function(err) {
                //$ionicLoading.show({ template: 'audio.send():[failed] '+err,duration:1500});
                console.log("audio.send():failed");
                console.log(err);
                // reject(err);
            });
        // });
    }
    return audio;
}])

//获取图片，拍照or相册，见CONFIG.cameraOptions。return promise。xjz
.factory('Camera', ['$q','$cordovaCamera','$cordovaFileTransfer','CONFIG','fs',function($q,$cordovaCamera,$cordovaFileTransfer,CONFIG,fs) { 
  return {
    getPicture: function(type,noCrop){
      console.log(type);
        return $q(function(resolve, reject) {
            var opt = CONFIG.cameraOptions[type];
            if(noCrop) opt.allowEdit = false;
            $cordovaCamera.getPicture(opt).then(function(imageUrl) {
              console.log(imageUrl)
              resolve(imageUrl)
              // file manipulation
              // var tail=imageUrl.lastIndexOf('?');
              // if(tail!=-1) var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1,tail);
              // else var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1);
              // fs.mvMedia('image',fileName,'.jpg')
              // .then(function(res){
              //   console.log(res);
              //   //res: file URL
              //   resolve(res);
              // },function(err){
              //   console.log(err);
              //   reject(err);
              // })
          }, function(err) {
            console.log(err);
              reject('fail to get image');
          });
      })
    },
    getPictureFromPhotos: function(type){
      console.log(type);
        return $q(function(resolve, reject) {
            $cordovaCamera.getPicture(CONFIG.cameraOptions[type]).then(function(imageUrl) {
              console.log(imageUrl)
              resolve(imageUrl)
              // file manipulation
              // var tail=imageUrl.lastIndexOf('?');
              // if(tail!=-1) var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1,tail);
              // else var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1);
              // fs.mvMedia('image',fileName,'.jpg')
              // .then(function(res){
              //   console.log(res);
              //   //res: file URL
              //   resolve(res);
              // },function(err){
              //   console.log(err);
              //   reject(err);
              // })
          }, function(err) {
            console.log(err);
              reject('fail to get image');
          });
      })
    },
    uploadPicture : function(imgURI, temp_photoaddress){
        return $q(function(resolve, reject) {
          var uri = encodeURI(CONFIG.baseUrl + "upload")
            // var photoname = Storage.get("UID"); // 取出病人的UID作为照片的名字
            var options = {
              fileKey : "file",
              fileName : temp_photoaddress,
              chunkedMode : true,
              mimeType : "image/jpeg"
            };
            // var q = $q.defer();
            //console.log("jinlaile");
            $cordovaFileTransfer.upload(uri,imgURI,options)
              .then( function(r){
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
                // var result = "上传成功";
                resolve(r.response);        
              }, function(error){
                console.log(error);
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
                reject(error);          
              }, function (progress) {
                console.log(progress);
              })
        })
    },

    uploadVoice : function(voiURI, temp_voiceaddress){
        return $q(function(resolve, reject) {
          var uri = encodeURI("http://121.43.107.106:4050/upload")
            // var photoname = Storage.get("UID"); // 取出病人的UID作为照片的名字
            var options = {
              fileKey : "file",
              fileName : temp_voiceaddress,
              chunkedMode : true,
              mimeType : "audio/mpeg"
            };
            // var q = $q.defer();
            //console.log("jinlaile");
            $cordovaFileTransfer.upload(uri,voiURI,options)
              .then( function(r){
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
                // var result = "上传成功";
                resolve(r.response);        
              }, function(error){
                console.log(error);
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
                reject(error);          
              }, function (progress) {
                console.log(progress);
              })
        })
    }
  }
}])

.factory('Data',['$resource', '$q','$interval' ,'CONFIG' , function($resource,$q,$interval ,CONFIG){
    var serve={};
    var abort = $q.defer();

    var Dict = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'dict'},{
            getDiseaseType:{method:'GET', params:{route: 'typeTWO'}, timeout: 100000},
            getDistrict:{method:'GET', params:{route: 'district'}, timeout: 100000},
            getHospital:{method:'GET', params:{route: 'hospital'}, timeout: 100000},
            getHeathLabelInfo:{method:'GET', params:{route: 'typeOne'}, timeout: 100000},
            typeOne:{method:'GET', params:{route: 'typeOne'}, timeout: 100000}
        });
    };

    var Task1 = function(){
        return $resource(CONFIG.baseUrl + ':path',{path:'tasks'},{
            getTask:{method:'GET', params:{}, timeout: 100000}
        });
    };

    var Task2 = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'tasks'},{
            changeTaskstatus:{method:'GET', params:{route: 'status'}, timeout: 100000},
            changeTasktime:{method:'GET', params:{route: 'time'}, timeout: 100000},
            insertTask:{method:'POST', params:{route: 'insertTaskModel'}, timeout: 100000},
            getUserTask:{method:'GET', params:{route: 'getUserTask'}, timeout: 100000},
            updateUserTask:{method:'POST', params:{route: 'updateUserTask'}, timeout: 100000}
        });
    };

    var Compliance = function(){
        return $resource(CONFIG.baseUrl + ':path',{path:'compliance'},{
            postcompliance:{method:'POST', params:{}, timeout: 100000},
            getcompliance:{method:'GET', params:{}, timeout: 100000}
        });
    };

    var Counsel = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'counsel'},{
            getCounsels:{method:'GET', params:{route: 'getCounsels'}, timeout: 100000},
            questionaire:{method:'POST', params:{route: 'questionaire'}, timeout: 100000},
            changeCounselStatus:{method:'POST', params:{route: 'changeCounselStatus'}, timeout: 100000},
            getStatus:{method:'GET', params:{route: 'getStatus'}, timeout: 100000},
            changeStatus:{method:'POST', params:{route: 'changeStatus'}, timeout: 100000}
        });
    };

    var Patient =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'patient'},{
            getPatientDetail:{method:'GET', params:{route: 'getPatientDetail'}, timeout: 100000},
            getMyDoctors:{method:'GET',params:{route:'getMyDoctors'},timeout:10000},
            getDoctorLists:{method:'GET',params:{route:'getDoctorLists'},timeout:10000},
            getCounselRecords:{method:'GET',params:{route:'getCounselRecords'},timeout:10000},
            insertDiagnosis:{method:'POST',params:{route:'insertDiagnosis'},timeout:10000},
            newPatientDetail:{method:'POST',params:{route:'newPatientDetail'},timeout:10000},
            editPatientDetail:{method:'POST',params:{route:'editPatientDetail'},timeout:10000}
        });
    }

    var Doctor =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'doctor'},{
            postDocBasic:{method:'POST', params:{route: 'postDocBasic'}, timeout: 100000},
            getPatientList:{method:'GET', params:{route: 'getPatientList'}, timeout: 100000},
            getDoctorInfo:{method:'GET', params:{route: 'getDoctorInfo'}, timeout: 100000},
            getMyGroupList:{method:'GET', params:{route: 'getMyGroupList'}, timeout: 100000},
            getGroupPatientList:{method:'GET', params:{route: 'getGroupPatientList'}, timeout: 100000},
            getRecentDoctorList:{method:'GET', params:{route: 'getRecentDoctorList'}, timeout: 100000},
            editDoctorDetail:{method:'POST',params:{route:'editDoctorDetail'},timeout:10000},
            insertSchedule:{method:'POST',params:{route:'insertSchedule'},timeout:10000},
            getSchedules:{method:'GET',params:{route:'getSchedules'},timeout:10000},
            deleteSchedule:{method:'POST',params:{route:'deleteSchedule'},timeout:10000},
            getSuspendTime:{method:'GET',params:{route:'getSuspendTime'},timeout:10000},
            insertSuspendTime:{method:'POST',params:{route:'insertSuspendTime'},timeout:10000},
            deleteSuspendTime:{method:'POST',params:{route:'deleteSuspendTime'},timeout:10000},
            getPatientByDate:{method:'GET',params:{route:'getPatientByDate'},timeout:10000},
            getDocNum:{method:'GET',params:{route:'getDocNum'},timeout:10000},
            getAliPayAccount:{method:'GET', params:{route: 'getAliPayAccount'},timeout:10000},
            editAliPayAccount:{method:'POST', params:{route: 'editAliPayAccount'},timeout:10000}
        });
    }

    var User = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'user'},{
            register:{method:'POST', params:{route: 'register',phoneNo:'@phoneNo',password:'@password',role:'@role'}, timeout: 100000},
            changePassword:{method:'POST', params:{route: 'reset',phoneNo:'@phoneNo',password:'@password'}, timeout: 100000},
            logIn:{method:'POST', params:{route: 'login'}, timeout: 100000},
            logOut:{method:'POST', params:{route: 'logout',userId:'@userId'}, timeout: 100000},
            getUserId:{method:'GET', params:{route: 'getUserID',phoneNo:'@phoneNo'}, timeout: 100000},
            sendSMS:{method:'POST', params:{route: 'sendSMS',mobile:'@mobile',smsType:'@smsType'}, timeout: 100000},//第一次验证码发送成功返回结果为”User doesn't exist“，如果再次发送才返回”验证码成功发送“
            verifySMS:{method:'GET', params:{route: 'verifySMS',mobile:'@mobile',smsType:'@smsType',smsCode:'@smsCode'}, timeout: 100000},
            getAgree:{method:'GET', params:{route: 'getUserAgreement',userId:'@userId'}, timeout: 100000},
            updateAgree:{method:'POST', params:{route: 'updateUserAgreement'}, timeout: 100000},
            getUserIDbyOpenId:{method:'GET', params:{route: 'getUserIDbyOpenId'}, timeout: 100000},
            setOpenId:{method:'POST', params:{route: 'setOpenId'}, timeout: 100000},
            One:{method:'GET', params:{route: 'one'}, timeout: 10000}
        });
    }

    var Health = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'healthInfo'},{
            createHealth:{method:'POST', params:{route: 'insertHealthInfo',userId:'@userId',type:'@type',time:'@time',url:'@url',label:'@label',description:'@description',comments:'@comments'}, timeout: 100000},
            modifyHealth:{method:'POST', params:{route:'modifyHealthDetail',userId:'@userId',type:'@type',time:'@time',url:'@url',label:'@label',description:'@description',comments:'@comments',insertTime:'@insertTime'},timeout:100000},
            getHealthDetail:{method:'GET', params:{route:'getHealthDetail',userId:'@userId',insertTime:'@insertTime'},timeout:100000},
            getAllHealths:{method:'GET', params:{route:'getAllHealthInfo',userId:'@userId'},timeout:100000},
            deleteHealth:{method:'POST', params:{route:'deleteHealthDetail',userId:'@userId',insertTime:'@insertTime'},timeout:100000}

        });
    }

    var Comment =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'comment'},{
            getComments:{method:'GET', params:{route: 'getComments'}, timeout: 100000}
        });
    }

    var VitalSign =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'vitalSign'},{
            getVitalSigns:{method:'GET', params:{route: 'getVitalSigns'}, timeout: 100000}
        });
    }

    var Account =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'account'},{
            getAccountInfo:{method:'GET', params:{route: 'getAccountInfo'}, timeout: 100000},
            modifyCounts:{method:'POST', params:{route:'modifyCounts'}, timeout: 100000},
            getCounts:{method:'GET', params:{route: 'getCounts'}, timeout: 100000}
        });
    }

    var Message =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'message'},{
            getMessages:{method:'GET', params:{route: 'getMessages'}, timeout: 100000}
        });
    }

    var Communication =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'communication'},{
            conclusion:{method:'POST', params:{route: 'conclusion'}, timeout: 100000},
            getCommunication:{method:'GET', params:{route: 'getCommunication'}, timeout: 100000},
            getCounselReport:{method:'GET', params:{route: 'getCounselReport'}, timeout: 100000},
            getTeam:{method:'GET', params:{route: 'getTeam'}, timeout: 100000},
            insertMember:{method:'POST', params:{route: 'insertMember'}, timeout: 100000},
            newConsultation:{method:'POST', params:{route: 'newConsultation'}, timeout: 100000},
            newTeam:{method:'POST', params:{route: 'newTeam'}, timeout: 100000},
            removeMember:{method:'POST', params:{route: 'removeMember'}, timeout: 100000},
            updateLastTalkTime:{method:'POST', params:{route: 'updateLastTalkTime'}, timeout: 100000},
            getConsultation:{method:'GET', params:{route: 'getConsultation'}, timeout: 100000},
            postCommunication:{method:'POST', params:{route: 'postCommunication'}, timeout: 100000}
        });
    }


    var Insurance =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'insurance'},{
            getInsMsg:{method:'GET', params:{route: 'getInsMsg'}, timeout: 100000},
            updateInsuranceMsg:{method:'POST', params:{route: 'updateInsuranceMsg'}, timeout: 100000}
        });
    }

    var New =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'new'},{
            getNews:{method:'GET', params:{route: 'getNews'}, timeout: 100000},
            insertNews:{method:'POST', params:{route: 'insertNews'}, timeout: 100000},
            getNewsByReadOrNot:{method:'GET', params:{route: 'getNewsByReadOrNot'}, timeout: 100000}
        });
    }  

    var Expense =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'expense'},{
            getDocRecords:{method:'GET', params:{route: 'getDocRecords'}, timeout: 100000}
        });
    }

    var Mywechat = function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'wechat'},{
            messageTemplate:{method:'POST', params:{route: 'messageTemplate'}, timeout: 100000},
            gettokenbycode:{method:'GET', params:{route: 'gettokenbycode'}, timeout: 100000},
            getUserInfo:{method:'GET', params:{route: 'getUserInfo'}, timeout: 100000},
            createTDCticket:{method:'POST', params:{route: 'createTDCticket'}, timeout: 100000}
        })
    }

    var Advice =function(){
        return $resource(CONFIG.baseUrl + ':path/:route',{path:'advice'},{
            postAdvice:{method:'POST', params:{route: 'postAdvice'}, timeout: 100000}
        });
    }    

    serve.abort = function ($scope) {
        abort.resolve();
        $interval(function () {
            abort = $q.defer();
            serve.Dict = Dict();
            serve.Task1 = Task1();
            serve.Task2 = Task2();
            serve.Compliance = Compliance();
            serve.Counsel = Counsel();
            serve.Patient = Patient();
            serve.Doctor = Doctor();
            serve.Health = Health();
            serve.Comment = Comment();
            serve.VitalSign = VitalSign();
            serve.Account = Account();
            serve.Message = Message();
            serve.Communication = Communication();
            serve.User = User();
            serve.Mywechat = Mywechat();
            serve.Insurance = Insurance();
            serve.New = New();          
            serve.Expense = Expense();   
            serve.Advice = Advice();  
        }, 0, 1);
    };
    serve.Dict = Dict();
    serve.Task1 = Task1();
    serve.Task2 = Task2();
    serve.Compliance = Compliance();
    serve.Counsel = Counsel();
    serve.Patient = Patient();
    serve.Doctor = Doctor();
    serve.Health = Health();
    serve.Comment = Comment();
    serve.VitalSign = VitalSign();
    serve.Account = Account();
    serve.Message = Message();
    serve.Communication = Communication();
    serve.User = User();
    serve.Mywechat = Mywechat();
    serve.Insurance = Insurance();
    serve.New = New();  
    serve.Expense = Expense();    
    serve.Advice = Advice();    
    return serve;
}])
.factory('Dict', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            //  category:'patient_class'
            // }   
    self.getDiseaseType = function(params){
        var deferred = $q.defer();
        Data.Dict.getDiseaseType(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  level:'3',//1获取省份，2获取城市，3获取区县
            //  province:"33", //定位到某个具体省份时需要输入
            //  city:'01',  //定位到某个具体城市时需要输入
            //  district:'02' //定位到某个具体区县时需要输入
            // }
    self.getDistrict = function(params){
        var deferred = $q.defer();
        Data.Dict.getDistrict(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  locationCode:'330103',//输入全部为空时获取全部医院信息，需要定位到某个具体地区时需要输入locationCode，定位到某个具体医院时需要输入hospitalCode
            //  hostipalCode:"001"
           // }
    self.getHospital = function(params){
        var deferred = $q.defer();
        Data.Dict.getHospital(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  category:'healthInfoType'
           // }
    self.getHeathLabelInfo = function(params){
        var deferred = $q.defer();
        Data.Dict.getHeathLabelInfo(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
    //    category:'MessageType'
    //}
    self.typeOne = function(params){
        var deferred = $q.defer();
        Data.Dict.typeOne(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])

.factory('Task', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            //  userId:'U201704050002',//usderId="Admin"，sortNo为空时获取系统全部任务模板，sortNo="1"时获取指定任务模板，userId为用户ID时获取指定用户的任务信息
            //  sortNo:'1'
           // }
    self.getTask = function(params){
        var deferred = $q.defer();
        Data.Task1.getTask(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  userId:'U201704050002',//unique
            //  sortNo:1,
            //  type:'Measure',
            //  code:'BloodPressure',
            //  status:'0'
           // }
    self.changeTaskstatus = function(params){
        var deferred = $q.defer();
        Data.Task2.changeTaskstatus(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  userId:'U201704050002',//unique
            //  sortNo:1,
           // }
    self.insertTask = function(params){
        var deferred = $q.defer();
        Data.Task2.insertTask(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };    
    //params->{
            //  userId:'U201704050002',//unique
            //  sortNo:1,
            //  type:'Measure',
            //  code:'BloodPressure',
            //  startTime:'2017-12-12'
           // }
    self.changeTasktime = function(params){
        var deferred = $q.defer();
        Data.Task2.changeTasktime(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.getUserTask = function(params){
        var deferred = $q.defer();
        Data.Task2.getUserTask(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.updateUserTask = function(params){
        var deferred = $q.defer();
        Data.Task2.updateUserTask(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    
    return self;
}])
.factory('Compliance', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            // "userId": "U201704050002",
            // "type": "Measure",
            // "code": "Weight",
            // "date": "2017-12-13",
            // "status": 0,
            // "description": ""
           // }
    self.postcompliance = function(params){
        var deferred = $q.defer();
        Data.Compliance.postcompliance(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
            //  userId:'U201704050002',//date为空时获取指定用户的全部任务执行记录，date不为空时获取指定用户某一天的任务执行记录
            //  date:'2017-12-13'
           // }
    self.getcompliance = function(params){
        var deferred = $q.defer();
        Data.Compliance.getcompliance(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Communication', ['$q', 'Data','Storage', function($q, Data,Storage){
    var self = this;
    //params->0:{
            //      teamId:'teampost2',
            //      name:'id1',
            //      sponsorId:'id'
            //      sponsorName:'DOCname'
            //      description:''
            //  }
    self.newTeam = function(params){
        var deferred = $q.defer();
        Data.Communication.newTeam(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.conclusion = function(params){
        var deferred = $q.defer();
        Data.Communication.conclusion(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params-> messageType=2&id2=teamOrConsultation&limit=1&skip=0
    //         messageType=1&id1=doc&id2=pat&limit=1&skip=0
    self.getCommunication = function(params){
        var deferred = $q.defer();
        Data.Communication.getCommunication(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{counselId:'counsel01'}
    self.getCounselReport = function(params){
        var deferred = $q.defer();
        Data.Communication.getCounselReport(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{teamId:'team1'}
    self.getTeam = function(params){
        var deferred = $q.defer();
        Data.Communication.getTeam(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.postCommunication = function(params){
        var deferred = $q.defer();
        Data.Communication.postCommunication(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.getConsultation = function(params){
        var deferred = $q.defer();
        Data.Communication.getConsultation(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //      teamId:'teampost2',
            //      membersuserId:'id1',
            //      membersname:'name2'
            //  }
    self.insertMember = function(params){
        var deferred = $q.defer();
        Data.Communication.insertMember(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //      teamId:'teampost2',
            //      membersuserId:'id2'
            //  }
    self.removeMember = function(params){
        var deferred = $q.defer();
        Data.Communication.removeMember(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    // {
    //     teamId,
    //     counselId,
    //     sponsorId,
    //     patientId,
    //     consultationId,
    //     status:'1'-进行中,'0'-已结束
    // }
    self.newConsultation = function(params){
        var deferred = $q.defer();
        Data.Communication.newConsultation(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    // {
    //     "doctorId":"doc01", 
    //     "doctorId2":"doc03", 
    //     "lastTalkTime":"2017-04-09T10:00:00"
    // }
    self.updateLastTalkTime = function(id2,millis){
        var params={
            "doctorId":Storage.get('UID'), 
            "doctorId2":id2, 
            "lastTalkTime":(new Date(millis)).toISOString().substr(0,19)
        }
        var deferred = $q.defer();
        Data.Communication.updateLastTalkTime(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    

    return self;
}])
.factory('User', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
        // phoneNo:"18768113669",
        // password:"123456",
        // role:"patient"
        //}
        //000
    self.register = function(params){
        var deferred = $q.defer();
        Data.User.register(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{
        // phoneNo:"18768113669",
        // password:"123",
        //}
        //001
    self.changePassword = function(params){
        var deferred = $q.defer();
        Data.User.changePassword(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{userId:"U201702070041"}
    //036
    self.getAgree = function(params){
        var deferred = $q.defer();
        Data.User.getAgree(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    
    //params->{userId:"U201702070041",agreement:"0"}
    //037
    self.updateAgree = function(params){
        var deferred = $q.defer();
        Data.User.updateAgree(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        // username:"18768113669",
        // password:"123456",
        // role:"patient"
        //}
        //002
    self.logIn = function(params){
        var deferred = $q.defer();
        Data.User.logIn(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }


    //params->{userId:"U201704010002"}
    //003
    self.logOut = function(params){
        var deferred = $q.defer();
        Data.User.logOut(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{phoneNo:"18768113668"}
    //004
    self.getUserId = function(params){
        var deferred = $q.defer();
        Data.User.getUserId(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        //mobile:"18768113660",
        //smsType:1}
    //005
    self.sendSMS = function(params){
        var deferred = $q.defer();
        Data.User.sendSMS(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        //mobile:"18868186038",
        //smsType:1
        //smsCode:234523}
    //006
    self.verifySMS = function(params){
        var deferred = $q.defer();
        Data.User.verifySMS(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    self.getUserIDbyOpenId = function(params){
        var deferred = $q.defer();
        Data.User.getUserIDbyOpenId(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    
    self.setOpenId  = function(params){
        var deferred = $q.defer();
        Data.User.setOpenId (
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params-> username:'doc01'
    self.One = function(params)
    {
        var deferred = $q.defer();
        Data.User.One(
            params,
            function(data, headers)
            {
                deferred.resolve(data);
            },
            function(err)
            {
                deferred.reject(err);
            }
        );
        return deferred.promise;
    }
    
    return self;
}])

.factory('Health', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->{
            //  userId:'U201704010003',//unique
            //  type:1,
            //  time:'2014/02/22 11:03:37',
            //  url:'c:/wf/img.jpg',
            //  label:'abc',
            //  description:'wf',
            //  comments:''
           // }
    self.createHealth = function(params){
        var deferred = $q.defer();
        Data.Health.createHealth(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{
        // userId:"U201704010003",
        //}
        //011
    self.getAllHealths = function(params){
        var deferred = $q.defer();
        Data.Health.getAllHealths(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{
        // userId:"U201704010003",
        // insertTime:"2017-04-11T05:43:36.965Z",
        //}
        //012
    self.getHealthDetail = function(params){
        var deferred = $q.defer();
        Data.Health.getHealthDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    //params->{
        // userId:"U201704010003",
        // insertTime:"2017-04-11T05:43:36.965Z",
        // type:3,
        // time:"2014/02/22",
        // url:"c:/wf/img.jpg",
        // description:"修改晕厥入院，在医院住了3天，双侧颈动脉无异常搏动，双侧颈静脉怒张，肝颈静脉回流征阳性，气管居中，甲状腺不肿大，未触及结节无压痛、震颤，上下均为闻及血管杂音。",
        // }
        //014
    self.modifyHealth = function(params){
    var deferred = $q.defer();
        Data.Health.modifyHealth(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }

    //params->{
        // userId:"U201704010003",
        // insertTime:"2017-04-11T05:43:36.965Z",
        //}
        //015
    self. deleteHealth = function(params){
        var deferred = $q.defer();
        Data.Health. deleteHealth(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    }
    return self;
}])
.factory('Message', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{
    //    userId:'U201704120001',
    //    type:1//option
    //}
    self.getMessages = function(params){
        var deferred = $q.defer();
        Data.Message.getMessages(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Account', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'p01'}
    self.getAccountInfo = function(params){
        var deferred = $q.defer();
        Data.Account.getAccountInfo(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    self.modifyCounts = function(params){
        var deferred = $q.defer();
        Data.Account.modifyCounts(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    self.getCounts = function(params){
        var deferred = $q.defer();
        Data.Account.getCounts(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('VitalSign', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'p01',type:'type1'}
    self.getVitalSigns = function(params){
        var deferred = $q.defer();
        Data.VitalSign.getVitalSigns(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Comment', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'doc01'}
    self.getComments = function(params){
        var deferred = $q.defer();
        Data.Comment.getComments(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('Patient', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'p01'}
    self.getPatientDetail = function(params){
        var deferred = $q.defer();
        Data.Patient.getPatientDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{userId:'p01'}
    self.getMyDoctors = function(params){
        var deferred = $q.defer();
        Data.Patient.getMyDoctors(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{workUnit:'浙江省人民医院'}
    //        1:{workUnit:'浙江省人民医院',name:'医生01'}
    self.getDoctorLists = function(params){
        var deferred = $q.defer();
        Data.Patient.getDoctorLists(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{userId:'p01'}
    self.getCounselRecords = function(params){
        var deferred = $q.defer();
        Data.Patient.getCounselRecords(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //     patientId:'ppost01',
            //     doctorId:'doc01',
            //     diagname:'慢性肾炎',
            //     diagtime:'2017-04-06',
            //     diagprogress:'吃药',
            //     diagcontent:'blabla啥啥啥的'
            // }
    self.insertDiagnosis = function(params){
        var deferred = $q.defer();
        Data.Patient.insertDiagnosis(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
            //     userId:'ppost01',
            //     name:'患者xx',
            //     birthday:'1987-03-25',
            //     gender:2,
            //     IDNo:123456123456781234,
            //     height:183,
            //     weight:70,
            //     bloodType:2,
            //     class:'class1',
            //     class_info:'info_1',
            //     operationTime:'2017-04-05',
            //     hypertension:1,
            //     photoUrl:'http://photo/ppost01.jpg'
            // }
    self.newPatientDetail = function(params){
        var deferred = $q.defer();
        Data.Patient.newPatientDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
                // userId:'ppost01',
                // name:'新名字2',
                // birthday:1987-03-03,
                // gender:1,
                // IDNo:123456123456781234,
                // height:183,
                // weight:70,
                // bloodType:2,
                // class:'class1',
                // class_info:'info3',
                // hypertension:1,
                // photoUrl:'http://photo/ppost01.jpg'
            // }
    self.editPatientDetail = function(params){
        var deferred = $q.defer();
        Data.Patient.editPatientDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    return self;
}])
.factory('Doctor', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{
           //   userId:'docpostTest',//unique
           //   name:'姓名',
           //   birthday:'1956-05-22',
           //   gender:1,
           //   workUnit:'浙江省人民医院',
           //   department:'肾内科',
           //   title:'副主任医师',
           //   major:'慢性肾炎',
           //   description:'经验丰富',
           //   photoUrl:'http://photo/docpost3.jpg',
           //   charge1:150,
           //   charge2:50
           // }
    self.postDocBasic = function(params){
        var deferred = $q.defer();
        Data.Doctor.postDocBasic(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
       //   userId:'doc01'
       // }
    self.getPatientList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getPatientList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
       //   userId:'doc01'
       // }
    self.getRecentDoctorList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getRecentDoctorList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    
    //params->0:{
           //   userId:'doc01'
           // }
    self.getDoctorInfo = function(params){
        var deferred = $q.defer();
        Data.Doctor.getDoctorInfo(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->0:{
           //   userId:'doc01'
           // }
    self.getMyGroupList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getMyGroupList(
            params,
            function(data, headers){

                deferred.resolve(data.results);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01'
           // }
    self.getRecentDoctorList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getRecentDoctorList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };



    //params->0:{
           //   teamId:'team1',
           //   status:1
           // }
    self.getGroupPatientList = function(params){
        var deferred = $q.defer();
        Data.Doctor.getGroupPatientList(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.editDoctorDetail = function(params){
        var deferred = $q.defer();
        Data.Doctor.editDoctorDetail(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01',
           //   day:0,//0-6->周一，周二...周日
           //   time:0//0->上午 1->下午
           // }
    self.insertSchedule = function(params){
        var deferred = $q.defer();
        Data.Doctor.insertSchedule(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01'
           // }
    self.getSchedules = function(params){
        var deferred = $q.defer();
        Data.Doctor.getSchedules(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01',
           //   day:0,//0-6->周一，周二...周日
           //   time:0//0->上午 1->下午
           // }
    self.deleteSchedule = function(params){
        var deferred = $q.defer();
        Data.Doctor.deleteSchedule(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
    //   userId:'doc01'
    // }
    self.getSuspendTime = function(params){
        var deferred = $q.defer();
        Data.Doctor.getSuspendTime(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01',
           //   start:new Date(),
           //   end:new Date(),
           // }
    self.insertSuspendTime = function(params){
        var deferred = $q.defer();
        Data.Doctor.insertSuspendTime(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    
    //params->0:{
           //   userId:'doc01',
           //   start:new Date(),
           //   end:new Date(),
           // }
    self.deleteSuspendTime = function(params){
        var deferred = $q.defer();
        Data.Doctor.deleteSuspendTime(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->0:{
           //   userId:'doc01',
           // }
    self.getPatientByDate = function(params){
        var deferred = $q.defer();
        Data.Doctor.getPatientByDate(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    //params->empty
    self.getDocNum = function(){
        var deferred = $q.defer();
        Data.Doctor.getDocNum(
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->userId:'doc01'
    self.getAliPayAccount = function(params){
        var deferred = $q.defer();
        Data.Doctor.getAliPayAccount(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->{userId:'doc01',aliPayAccount:'abc@def.com'}
    self.editAliPayAccount = function(params){
        var deferred = $q.defer();
        Data.Doctor.editAliPayAccount(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
            }
        );
        return deferred.promise;
    };

    return self;
}])
.factory('Counsel', ['$q', 'Data', function($q, Data){
    var self = this;
    //params->0:{userId:'doc01',status:1}
    //        1:{userId:'doc01'}
    //        2:{userId:'doc01',type:1}
    //        3:{userId:'doc01',status:1,type:1}
    self.getCounsels = function(params){
        var deferred = $q.defer();
        Data.Counsel.getCounsels(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->0:{
    //              counselId:'counselpost02',
    //              patientId:'p01',
    //              doctorId:'doc01',
    //              sickTime:'3天',
    //              symptom:'腹痛',
    //              symptomPhotoUrl:'http://photo/symptom1',
    //              help:'帮助'
    //          }
    self.questionaire = function(params){
        var deferred = $q.defer();
        Data.Counsel.questionaire(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    self.getStatus = function(params){
        var deferred = $q.defer();
        Data.Counsel.getStatus(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    self.changeCounselStatus = function(params){
        var deferred = $q.defer();

        Data.Counsel.changeCounselStatus(

            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    self.changeStatus = function(params){
        var deferred = $q.defer();
        Data.Counsel.changeStatus(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])

.factory('Insurance', ['$q', 'Data', function($q, Data){
    var self = this;
    // //params->0:{
    //                 doctorId:'doc01',
    //                 patientId:'p01'
    //             }
    self.getInsMsg = function(params){
        var deferred = $q.defer();
        Data.Insurance.getInsMsg(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    //params->0:{
                    // doctorId:'doc01', 
                    // patientId:'p02', 
                    // insuranceId:'ins01'
    //          }
    self.updateInsuranceMsg = function(params){
        var deferred = $q.defer();
        Data.Insurance.updateInsuranceMsg(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])


.factory('Advice', ['$q', 'Data', function($q, Data){
    var self = this;
    self.postAdvice = function(params){
        var deferred = $q.defer();
        Data.Advice.postAdvice(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    return self;
}])

.factory('New', ['$q', 'Data', function($q, Data){
    var self = this;
    self.getNews = function(params){
        var deferred = $q.defer();
        Data.New.getNews(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.insertNews = function(params){
        var deferred = $q.defer();
        Data.New.insertNews(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
     self.getNewsByReadOrNot = function(params){
        var deferred = $q.defer();
        Data.New.getNewsByReadOrNot(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };
    function getIndex(arr,val){
        for(var i in arr){
            if(arr[i].userId==val || arr[i].sendBy==val) return i;
        }
        return -1;
    }
    function addLastMsg(type,userId,msg){
        // item.lastMsg=msg;
        try{
            msg.url=JSON.parse(msg.url);
            if(type!='11' && type!='12' && msg.url.fromID!=userId) {
                msg.description=msg.url.fromName + ':' + msg.description;
            }
            if(type=='11' || type=='12') msg.readOrNot = msg.readOrNot || (userId==msg.url.fromID?1:0);
        }catch(e){}
        return msg;
    }
    self.addNews = function(type,userId,arr,idName){
        return $q(function(resolve,reject){
            if(!Array.isArray(arr) || arr.length==0) return resolve(arr);
            var q={
                userId:userId,
                type:type
            }
            self.getNews(q)
            .then(function(res){
                var msgs=res.results;
                arr.map(function(item){
                    var pos = getIndex(msgs,item[idName]);
                    if(pos!=-1){
                        item.lastMsg= addLastMsg(type,userId,msgs[pos]);
                    }
                    return item;
                })
                resolve(arr);
            },function(err){
                resolve(arr);
            });
        });

    }
    self.addNestNews = function(type,userId,arr,idName,keyName){
        return $q(function(resolve,reject){
            if(!Array.isArray(arr) || arr.length==0) return resolve(arr);
            var q={
                userId:userId,
                type:type
            }
            self.getNews(q)
            .then(function(res){
                var msgs=res.results;
                arr.map(function(item){
                    var pos = getIndex(msgs,item[keyName][idName]);
                    if(pos!=-1){
                        item.lastMsg= addLastMsg(type,userId,msgs[pos]);
                    }
                    return item;
                });
                resolve(arr);
            },function(err){
                resolve(arr);
            });
        });
    }
    return self;
}])

.factory('QRScan', ['$cordovaBarcodeScanner', '$ionicLoading', '$q', function($cordovaBarcodeScanner, $ionicLoading, $q) {
    return {
        getCode: function() {
            return $q(function(resolve, reject) {
                $cordovaBarcodeScanner
                .scan()
                .then(function(data) {
                    // Success! Barcode data is here
                    // var s = "Result: " + data.text + "<br/>" +
                    // "Format: " + data.format + "<br/>" +
                    // "Cancelled: " + data.cancelled;
                    if (data.cancelled != true) {
                        //返回code
                        resolve(data.text);
                    } else {
                        $ionicLoading.show({ template: '请重试', duration: 1500 });
                        reject('cancel');
                    }
                }, function(error) {
                    $ionicLoading.show({ template: '请重试', duration: 1500 });
                    reject('fail');
                });
            });
        }
    }

}])
.factory('Mywechat', ['$q', 'Data', function($q, Data){
    var self = this;

    self.messageTemplate = function(params){
        var deferred = $q.defer();
        Data.Mywechat.messageTemplate(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.gettokenbycode = function(params){
        var deferred = $q.defer();
        Data.Mywechat.gettokenbycode(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.getUserInfo = function(params){
        var deferred = $q.defer();
        Data.Mywechat.getUserInfo(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    self.createTDCticket = function(params){
        var deferred = $q.defer();
        Data.Mywechat.createTDCticket(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    return self;
}])

.factory('arrTool',function(){
    return {
        indexOf:function(arr,key,val,binary){
            if(binary){
                //已排序，二分,用于消息
                // var first=0,last=arr.length,mid=(first+last)/2;
                // while(arr[mid][key]!=val){
                //     if(arr[mid])
                // }
            }else{
                for(var i=0, len=arr.length;i<len;i++){
                    if(arr[i][key]==val) return i;
                }
                return -1;
            }
        }
    }
})
.factory('Expense', ['$q', 'Data', function($q, Data){
    var self = this;

    //params->0:{
                    // doctorId:'U201705050009', 
                    // limit:3, 
                    // skip:0
    //          }
    self.getDocRecords = function(params){
        var deferred = $q.defer();
        Data.Expense.getDocRecords(
            params,
            function(data, headers){
                deferred.resolve(data);
            },
            function(err){
                deferred.reject(err);
        });
        return deferred.promise;
    };

    return self;
}])
.factory('socket',['$rootScope','socketFactory','CONFIG',function($rootScope,socketFactory,CONFIG){
    var myIoSocket = io.connect(CONFIG.socketServer+'chat');

    // return io.connect(CONFIG.socketServer+'chat');
    // return {
    //     on: function(eventName, callback) {
    //         socket.on(eventName, function() {
    //             var args = arguments;
    //             // $rootScope.$apply(function() {
    //                 callback.apply(socket, args);
    //             // });
    //         });
    //     },
    //     emit: function(eventName, data, callback) {
    //         socket.emit(eventName, data, function() {
    //             var args = arguments;
    //             // $rootScope.$apply(function() {
    //                 if (callback) {
    //                     callback.apply(socket, args);
    //                 }
    //             // });
    //         })
    //     }
    // };

    var mySocket = socketFactory({
        ioSocket: myIoSocket,
        prefix: 'im:'
    });
    mySocket.forward(['getMsg','messageRes','err','disconnect']);
    return mySocket;
}])
.factory('notify',['$cordovaLocalNotification','$cordovaFileTransfer','CONFIG','arrTool',function($cordovaLocalNotification,$cordovaFileTransfer,CONFIG,arrTool){
    var COUNT_REG = /^\[([1-9]+[0-9]*)\]/;
    function nextCount(text){
        var matchs = text.match(COUNT_REG);
        return matchs===null?2:Number(matchs[1])+1;
    }
    function noteGen(msg){
        var note = msg.fromName+':',
            type = msg.contentType;
        if(type=='text'){
            note += msg.content.text;
        }else if(type == 'image'){
            note += '[图片]';
        }else if(type == 'voice'){
            note += '[语音]';
        }else{
            var subT = msg.content.type;
            if(subT=='card'){
                if(msg.newsType=='11') note += msg.content.counsel.type=='1'?'[新咨询]':'[新问诊]';
                else if(msg.newsType=='12') note += '[病历转发]';
                else note += '[团队病历]';
            }else if(subT == 'contact'){
                note += '[联系人名片]'
            }else if(subT == 'endl'){
                note += msg.content.counseltype==1?'[咨询结束]':'[问诊结束]';
            }else{
                note+='[新消息]';
            }
        }
        return note;
    }
    function schedulNote(msg,note){
        if(note){
            note.text = '[' + nextCount(note.text) + ']' + noteGen(msg);
            // opt.text = '[' + nextCount(note.text) + ']' + opt.text;
        }else{
            var noteid = msg.targetType=='single'?msg.fromID:msg.targetID;
            noteid=Number(noteid.slice(1));
            var note = {
                id:noteid,
                title:msg.targetType=='single'?msg.fromName:msg.targetName,
                text:noteGen(msg),
                data:msg,
                led:'1199dd',
                icon:'',
                smallIcon:'texticon',
                color:'1199dd'
            }
        }
        return $cordovaLocalNotification.schedule(note);
    }
    return {
        add:function(msg){
            if(msg.contentType=='custom' && (msg.content.type=='counsel-upgrade' || msg.content.type=='count-notice')) return;

            var matchId = msg.targetType=='single'?msg.fromID:msg.targetID;
            matchId=Number(matchId.slice(1));
            return $cordovaLocalNotification.getAll()
                .then(function(notes){
                    var pos=arrTool.indexOf(notes,'id',matchId);
                    if(pos==-1) return null;
                    return notes[pos];
                }).then(function(note){
                    if(note==null){
                        return schedulNote(msg);
                    }else{
                        return schedulNote(msg,note);
                    }
                });
        },
        remove:function(id){
            var matchId=Number(id.slice(1));
            return $cordovaLocalNotification.cancel(matchId);
        }
    }
}])
.factory('mySocket',['socket','$interval',function(socket,$interval){
    var timer = null;
    var currentUser ={
        id:'',
        name:''
    };
    function newUserOnce(userId,name){
        if(userId=='') return;
        var n = name || '';
        socket.emit('newUser',{ user_name:n , user_id: userId, client:'doctor'});
    }
    return {
        newUser:function(userId,name){
            socket.connect();
            currentUser.id=userId;
            currentUser.name = name;
            timer = $interval(function newuser(){
                newUserOnce(userId,name);
                // socket.emit('newUser',{ user_name:n , user_id: userId, client:'app'});
                return newuser;
            }(),60000);
        },
        newUserOnce:newUserOnce,
        newUserForTempUse:function(userId,name){
            $interval.cancel(timer);
            newUserOnce(userId,name);
            return function(){
                socket.emit('disconnect');
                setTimeout(function(){
                    newUser(currentUser.id,currentUser.name);
                },1000);
                // socket.emit('newUser',{ user_name:currentUser.name , user_id: currentUser.id, client:'app'});
            }
        },
        cancelAll:function(){
            if(timer!=null){
                $interval.cancel(timer);
                timers = null;
            }
            currentUser.id = '';
        }
    }
}])


