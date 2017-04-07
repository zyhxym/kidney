angular.module('kidney.services', ['ionic'])

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
    cameraOptions: {
        cam: {
            quality: 60,
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
            quality: 60,
            destinationType: 1,
            sourceType: 0,
            allowEdit: true,
            encodingType: 0,
            targetWidth: 1000,
            targetHeight: 1000
        }
    },
    appKey: 'b4ad7a831d5f3273acca5025',
    path: {
        base: 'media/b4ad7a831d5f3273acca5025/',
        img: 'images/thumbnails/',
        voice: 'voice/'
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
    return flag;
  }
  
  //return service;
})

//我
.factory("meFactory",function(){
  var service={};
  // var flag=false;
  // var userid;//用户ID
  // if(Storage.get('userid')!=null){
    // userid=Storage.get('userid');
  // }; 
  service.GetDoctorInfo=function(uid){
      var  result;//待返回json
      var doctors=[
      {
        photoUrl:"max.png",
        userId:"D201703240001",
        name:"小丁",
        gender:"男",
        title:"主任医生",
        workUnit:"浙江XXX医院",
        department:"泌尿科",
        major:"肾上腺分泌失调"
          },
      {
        photoUrl:"ben.png",
        userId:"D201703240002",
        name:"小李",
        gender:"女",
        title:"主任医生",
        workUnit:"浙江XXX医院",
        department:"泌尿科2",
        major:"慢性肾炎、肾小管疾病"
          }
      ];
      for(var i=0;i<doctors.length;i++){
        var doctor=doctors[i];
        if(doctors[i].userId==uid)
        {
          result=doctor;
          break;
        }
      }
      return result;
  }
  return service;
})
.factory('fs',['$q','$cordovaFile','$filter',function($q,$cordovaFile,$filter){
    return {
        // createDir:function(){
        //     // $cordovaFile.checkDir(cordova.file.dataDirectory, "sourceimgs")
        //     //   .then(function (success) {

        //     //     // success
        //     //   }, function (err) {
        //     //     // error
        //     //   });
        //     $cordovaFile.createDir(cordova.file.dataDirectory,'voices')
        //     .then(function(success){
        //         console.log(res);
        //     },function(err){
        //         console.log(err);
        //     })
        //     $cordovaFile.createDir(cordova.file.dataDirectory,'sourceimgs')
        //     .then(function(success){
        //         console.log(res);
        //     },function(err){
        //         console.log(err);
        //     })
        // },
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
                    // $cordovaFile.checkFile(cordova.file.dataDirectory,newName)
                    // .then(function(res){
                    //     resolve(success.nativeURL);
                    // },function(err){
                    //     console.log(err);
                    // })
                    
                    // success
                  }, function (error) {
                    console.log(error);
                    reject(error);
                  });
              });
        }
    }

}])
.factory('voice',['$filter','$q','$ionicLoading','$cordovaFile','CONFIG','Storage','fs',function($filter,$q,$ionicLoading,$cordovaFile,CONFIG,Storage,fs){
  //funtion audio(){};
  var audio={};
    audio.src='';
    // audio.length=0;
    // audio.recTime=0;
    audio.media={};

  audio.record = function(receiver,onSuccess,onError){
        return $q(function(resolve, reject){
            if(audio.media.src)audio.media.release();
            console.log(this);
            var time=new Date();
            audio.src = $filter('date')(time,'yyyyMMddHHmmss')+'.amr';
            audio.media = new Media(audio.src,
              function(){
                // audio.length=audio.media.getDuration();
                console.info("recordAudio():Audio Success");
                // console.log(success);
                console.log(audio.media);
                clearInterval(audio.mediaTimer);
                $ionicLoading.hide();
                // var url=cordova.file.externalRootDirectory + audio.src;

                // resolve(url);
                // resolve(audio.src);
                fs.mvMedia('voice',audio.src,'.amr')
                .then(function(fileUrl){
                    console.log(fileUrl);
                    // window.JMessage.sendSingleVoiceMessage(receiver,fileUrl,CONFIG.appKey,onSuccess,onError);
                    window.JMessage.sendSingleVoiceMessage(receiver,fileUrl,CONFIG.appKey,
                        function(res){
                            resolve(res);
                        }
                        ,function(err){
                            reject(err)
                        });
                    // resolve(fileUrl.substr(fileUrl.lastIndexOf('/')+1));
                },function(err){
                    console.log(err);
                    reject(err);
                });
              },function(err){
                console.error("recordAudio():Audio Error");
                console.log(err);
                reject(err);
              });
            audio.media.startRecord();
            $ionicLoading.show({ template: 'recording'});
        });

    
    // audio.mediaTimer = setInterval(function() {
    //     audio.recTime = audio.recTime + 1;
    // }, 1000);
  }
  audio.stopRec = function(){
    audio.media.stopRecord();
  }
  audio.open = function(fileUrl){
    // if(audio.media.src)audio.media.release();
    return $q(function(resolve,reject){
        audio.media = new Media(fileUrl,
          function(success){
            resolve(audio.media)
          },function(err){
            reject(err);
          })
    });
    
  }
  audio.play = function(src){

    // if(audio.media.src){
      // audio.media.release();
      // audio.media = new Media(src,
        // function(res){
          // console.log(res);
        // },function(err){
          // console.log(err);
        // })
      audio.media.play();
      // $ionicLoading.show({ template: 'playing',duration:1000});
    // }
    // else
      // console.warn("open audio resource first");
  }
  audio.stop = function(){
    audio.media.stop();
  }
  audio.sendAudio = function(fileUrl,receiver){
    // return $q(function(resolve, reject) {
      window.JMessage.sendSingleVoiceMessage(receiver,cordova.file.externalRootDirectory+fileUrl,CONFIG.appKey,
        function(response){
          console.log("audio.send():OK");
          console.log(response);
          //$ionicLoading.show({ template: 'audio.send():[OK] '+response,duration:1500});
          // resolve(response);
        },
        function(err){
          //$ionicLoading.show({ template: 'audio.send():[failed] '+err,duration:1500});
          console.log("audio.send():failed");
          console.log(err);
          // reject(err);
        });
    // });
  }
  return audio;
}])
.factory('Chats', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
        id: 'user001',
        name: 'user001',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 'user002',
        name: 'user002',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 'user003',
        name: 'user003',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 'user004',
        name: 'user004',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 'user005',
        name: 'user005',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    return {
        all: function() {
            return chats;
        },
        remove: function(chat) {
            chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
            for (var i = 0; i < chats.length; i++) {
                if (chats[i].id === parseInt(chatId)) {
                    return chats[i];
                }
            }
            return null;
        }
    };
})

.factory('JM', ['Storage', function(Storage) {
    var ConversationList = [];
    var messageLIsts = {};

    function checkIsLogin() {
        console.log("checkIsLogin...");
        window.JMessage.getMyInfo(function(response) {
            console.log("user is login" + response);
            var myInfo = JSON.parse(response);
            window.JMessage.username = myInfo.userName;
            window.JMessage.nickname = myInfo.nickname;
            window.JMessage.gender = myInfo.mGender;
            usernameForConversation = myInfo.userName;
            // gotoConversation();
        }, function(response) {
            console.log("User is not login.");
            window.JMessage.username = "";
            window.JMessage.nickname = "";
            window.JMessage.gender = "unknown";
        });
    }

    function getPushRegistrationID() {
        try {
            window.JPush.getRegistrationID(onGetRegistrationID);
            if (device.platform != "Android") {
                window.JPush.setDebugModeFromIos();
                window.JPush.setApplicationIconBadgeNumber(0);
            } else {
                window.JPush.setDebugMode(true);
            }
        } catch (exception) {
            console.log(exception);
        }
    }

    function updateUserInfo() {
        window.JMessage.getMyInfo(
            function(response) {
                var myInfo = JSON.parse(response);
                console.log("user is login" + response);
                window.JMessage.username = myInfo.userName;
                window.JMessage.nickname = myInfo.nickname;
                window.JMessage.gender = myInfo.mGender;
                $('#myInfoUsername').val(myInfo.userName);
                $('#myInfoNickname').val(myInfo.nickname);
                $('#myInfoGender').val(myInfo.gender);
            }, null);
    }

    function getUserDisplayName() {
        if (window.JMessage.nickname.length == 0) {
            return window.JMessage.username;
        } else {
            return window.JMessage.nickname;
        }
    }

    function login() {
        var username = $("#loginUsername").val();
        var password = $("#loginPassword").val();
        window.JMessage.login(username, password,
            function(response) {
                window.JMessage.username = username;
                alert("login ok");
                gotoConversation();
            }, null);
    }

    function register(userID, passwd) {
        window.JMessage.register(userID, passwd,
            function(response) {
                console.log("login callback success" + response);
                alert("register ok");
            },
            function(response) {
                console.log("login callback fail" + response);
                alert(response);
            }
        );
    }

    function updateConversationList() {
        $('#conversationList').empty().listview('refresh');
        console.log("updateConversationList");
        window.JMessage.getConversationList(
            function(response) {
                conversationList = JSON.parse(response);
            },
            function(response) {
                alert("Get conversation list failed.");
                console.log(response);
            });
    }

    function onReceiveMessage(message) {
        console.log("onReceiveSingleMessage");
        if (device.platform == "Android") {
            message = window.JMessage.message;
            console.log(JSON.stringify(message));
        }
        // messageArray.unshift(message);
        //refreshConversation();
    }
    // function getMessageHistory(username) {
    //     $('#messageList').empty().listview('refresh');
    //     //读取的是从 0 开始的 50 条聊天记录，可按实现需求传不同的值。
    //     window.JMessage.getHistoryMessages("single", username,
    //         '', 0, 50, function (response) {
    //             console.log("getMessageHistory ok: " + response);
    //             messageArray = JSON.parse(response);
    //             refreshConversation();
    //         }, function (response) {
    //             alert("getMessageHistory failed");
    //             console.log("getMessageHistory fail" + response);
    //         }
    //     );
    // }
    // function sendMessage() {
    //     var messageContentString = $("#messageContent").val();
    //     window.JMessage.sendSingleTextMessage(
    //         usernameForConversation, messageContentString, null,
    //         function (response) {
    //             var msg = JSON.parse(response);
    //             messageArray.unshift(msg);
    //             refreshConversation();
    //         }, function (response) {
    //             console.log("send message fail" + response);
    //             alert("send message fail" + response);
    //         });
    // }
    function onGetRegistrationID(response) {
        console.log("registrationID is " + response);
        Storage.set('jid', response);
        //$("#registrationId").html(response);
    }

    function getPushRegistrationID() {
        try {
            window.JPush.getRegistrationID(onGetRegistrationID);
            if (device.platform != "Android") {
                window.JPush.setDebugModeFromIos();
                window.JPush.setApplicationIconBadgeNumber(0);
            } else {
                window.JPush.setDebugMode(true);
            }
        } catch (exception) {
            console.log(exception);
        }
    }

    function onOpenNotification(event) {
        console.log("index onOpenNotification");
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            alert("open Notification:" + alertContent);
        } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
        }
    }

    function onReceiveNotification(event) {
        console.log("index onReceiveNotification");
        try {
            var alertContent;
            if (device.platform == "Android") {
                alertContent = event.alert;
            } else {
                alertContent = event.aps.alert;
            }
            $("#notificationResult").html(alertContent);
        } catch (exception) {
            console.log(exception)
        }
    }

    function onReceivePushMessage(event) {
        try {
            var message;
            if (device.platform == "Android") {
                message = event.message;
            } else {
                message = event.content;
            }
            console.log(message);
            $("#messageResult").html(message);
        } catch (exception) {
            console.log("JPushPlugin:onReceivePushMessage-->" + exception);
        }
    }

    function onSetTagsWithAlias(event) {
        try {
            console.log("onSetTagsWithAlias");
            var result = "result code:" + event.resultCode + " ";
            result += "tags:" + event.tags + " ";
            result += "alias:" + event.alias + " ";
            $("#tagAliasResult").html(result);
        } catch (exception) {
            console.log(exception)
        }
    }

    function setTagWithAlias() {
        try {
            var username = $("#loginUsername").val();
            var tag1 = $("#tagText1").val();
            var tag2 = $("#tagText2").val();
            var tag3 = $("#tagText3").val();
            var alias = $("#aliasText").val();
            var dd = [];
            if (tag1 != "") {
                dd.push(tag1);
            }
            if (tag2 != "") {
                dd.push(tag2);
            }
            if (tag3 != "") {
                dd.push(tag3);
            }
            window.JPush.setTagsWithAlias(dd, alias);
        } catch (exception) {
            console.log(exception);
        }
    }
    return {
        init: function() {
            window.JPush.init();
            checkIsLogin();
            getPushRegistrationID();
            // document.addEventListener("jmessage.onReceiveMessage", onReceiveMessage, false);
            // document.addEventListener("deviceready", onDeviceReady, false);
            // document.addEventListener("jpush.setTagsWithAlias",
            //     onSetTagsWithAlias, false);
            // document.addEventListener("jpush.openNotification",
            //     onOpenNotification, false);
            // document.addEventListener("jpush.receiveNotification",
            //     onReceiveNotification, false);
            // document.addEventListener("jpush.receiveMessage",
            //     onReceivePushMessage, false);
        },
        register: register,
        checkIsLogin: checkIsLogin,
        getPushRegistrationID: getPushRegistrationID,
        updateUserInfo: function() {
            window.JMessage.getMyInfo(
                function(response) {
                    var myInfo = JSON.parse(response);
                    console.log("user is login" + response);
                    window.JMessage.username = myInfo.userName;
                    window.JMessage.nickname = myInfo.nickname;
                    window.JMessage.gender = myInfo.mGender;
                    $('#myInfoUsername').val(myInfo.userName);
                    $('#myInfoNickname').val(myInfo.nickname);
                    $('#myInfoGender').val(myInfo.gender);
                }, null);
        },
        getUserDisplayName: function() {
            if (window.JMessage.nickname.length == 0) {
                return window.JMessage.username;
            } else {
                return window.JMessage.nickname;
            }
        }
    }
}])
.factory('Camera', ['$q','$cordovaCamera','CONFIG','fs',function($q,$cordovaCamera,CONFIG,fs) { 
    
  return {
    getPicture: function(type){
        return $q(function(resolve, reject) {
            $cordovaCamera.getPicture(CONFIG.cameraOptions[type]).then(function(imageUrl) {
              console.log(imageUrl);
              // resolve(imageUrl);

              // file manipulation
              // var fileName='.Pic.jpg';
              var tail=imageUrl.lastIndexOf('?');
              if(tail!=-1) var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1,tail);
              else var fileName=imageUrl.slice(imageUrl.lastIndexOf('/')+1);
              // fileName.
              fs.mvMedia('image',fileName,'.jpg')
              .then(function(res){
                console.log(res);
                resolve(res);
              },function(err){
                console.log(err);
                reject(err);
              })
          }, function(err) {
            console.log(err);
              reject('fail to get image url');
          });
      })
    }
  }
}])