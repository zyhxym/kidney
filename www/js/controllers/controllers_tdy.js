angular.module('tdy.controllers', ['ionic','kidney.services'])

/////////////////////////tongdanyang/////////////////
.controller('DoctorDiagnoseCtrl', ['$scope', 'Storage', function ($scope, Storage) {
  $scope.Hypers =
  [
    {Name:"是",Type:1},
    {Name:"否",Type:2}
  ]
  
  $scope.Diseases =
  [
    {Name:"肾移植",Type:1},
    {Name:"CKD1-2期",Type:2},
    {Name:"CKD3-4期",Type:3},
    {Name:"CDK5期未透析",Type:4},
    {Name:"腹透",Type:5},
    {Name:"血透",Type:6}
  ]

  $scope.Diagnose = 
  {
    "KidneyDisease": null,
    "DiseaseDetail": null,
    "OperationDate": null,
    "Hypertension": null,
    "DetailDiagnose": null
  }

  // --------datepicker设置----------------
  var  monthList=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  var weekDaysList=["日","一","二","三","四","五","六"];
  
  // --------诊断日期----------------
  var DiagnosisdatePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.datepickerObject1.inputDate=val;
      var dd=val.getDate();
      var mm=val.getMonth()+1;
      var yyyy=val.getFullYear();
      var d=dd<10?('0'+String(dd)):String(dd);
      var m=mm<10?('0'+String(mm)):String(mm);
      //日期的存储格式和显示格式不一致
      $scope.Diagnose.LastDiagnosisTime=yyyy+'/'+m+'/'+d;
    }
  };
  
  $scope.datepickerObject1 = {
    titleLabel: '诊断日期',  //Optional
    todayLabel: '今天',  //Optional
    closeLabel: '取消',  //Optional
    setLabel: '设置',  //Optional
    setButtonType : 'button-assertive',  //Optional
    todayButtonType : 'button-assertive',  //Optional
    closeButtonType : 'button-assertive',  //Optional
    inputDate: new Date(),    //Optional
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
      DiagnosisdatePickerCallback(val);
    }
  };  
  // --------手术日期----------------
  var OperationdatePickerCallback = function (val) {
    if (typeof(val) === 'undefined') {
      console.log('No date selected');
    } else {
      $scope.datepickerObject2.inputDate=val;
      var dd=val.getDate();
      var mm=val.getMonth()+1;
      var yyyy=val.getFullYear();
      var d=dd<10?('0'+String(dd)):String(dd);
      var m=mm<10?('0'+String(mm)):String(mm);
      //日期的存储格式和显示格式不一致
      $scope.Diagnose.OperationDate=yyyy+'/'+m+'/'+d;
    }
  };
  $scope.datepickerObject2 = {
    titleLabel: '手术日期',  //Optional
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
      OperationdatePickerCallback(val);
    }
  };  
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
      $scope.Diagnose.Birthday=yyyy+'/'+m+'/'+d;
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
  $scope.showProgress = function(){
    //console.log($scope.User.KidneyDisease.t.Type);
    if($scope.Diagnose.KidneyDisease == 1 || $scope.Diagnose.KidneyDisease == null || $scope.Diagnose.KidneyDisease == "" ){
      return false;}
    else{
      return true;}
  }

  $scope.showOperationTime = function(){
    //console.log($scope.User.KidneyDisease.t.Type);
    if($scope.Diagnose.KidneyDisease == 1){
      return true;}
    else{
      return false;}
  }

  $scope.reset =function(){
    $scope.Diagnose = 
    {
      "KidneyDisease": null,
      "DiseaseDetail": null,
      "OperationDate": null,
      "Hypertension": null,
      "DetailDiagnose": null
    }
  }
}])


.controller('mygrouplistCtrl', ['$scope', '$http','$state','$ionicPopover','Storage', function ($scope, $http, $state,$ionicPopover,Storage) {
  $scope.mygroups = ""

  $http.get("data/grouplist.json").success(function(data){
    $scope.mygroups = data
  })
  var options=[{
        name:'搜索团队',
        href:'#/tab/groups/search'
    },{
        name:'新建团队',
        href:'#/tab/newgroup'
    }]
    $scope.$on('$ionicView.enter',function(){
        $ionicPopover.fromTemplateUrl('partials/group/pop-menu.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.options=options;
          $scope.popover = popover;
        });
    })
    $scope.enterChat = function(id){
        $state.go('tab.group-chat',{groupId:id});
    }
    $scope.$on('$ionicView.beforeLeave',function(){
        if($scope.popover)$scope.popover.hide();
    })

  

  $scope.groupcommunication = function(group){
    $state.go('tab.group-chat',{groupId:group.groupID,type:1});
    // Storage.set("groupId",group.groupID) 
    // $state.go("tab.groupQRCode")
    //alert(group.groupID)
  }

  $scope.grouppatients = function(group){
    Storage.set("groupId",group.groupID) 
     $state.go("tab.grouppatient")
    //alert(group.groupID)
  }
}])

.controller('grouppatientCtrl', ['$scope', '$http','$state','Storage', function ($scope, $http, $state,Storage) {
  $scope.grouppatients1 = ""
  $scope.grouppatients2 = ""

  $http.get("data/grouppatient1.json").success(function(data){
    $scope.grouppatients1 = data
    $scope.ongoingcounts = data.length
  })

  $http.get("data/grouppatient2.json").success(function(data){
    $scope.grouppatients2 = data
    $scope.finishedcounts = data.length
  })

  $scope.addgroup = function(){
    // $state.go()
  }

  $scope.groupcommunication = function(grouppatient){
    $state.go('tab.group-chat',{groupId:grouppatient.patientID,type:2});
    // Storage.set("grouppatientID",grouppatient.patientID)
    // $state.go()

    // alert(goruppatient.patientID)
  }
}])

// .controller('groupQRCodeCtrl', ['$scope', 'Storage', function ($scope, Storage) {
//   $scope.groupQRCodedata = "www.baidu.com"
// }])
.controller('GroupsCtrl', ['$scope','$state','$ionicPopover',function($scope,$state,$ionicPopover) {
    var options=[{
        name:'搜索团队',
        href:'#/tab/groups/search'
    },{
        name:'新建团队',
        href:'#/tab/newgroup'
    }]
    $scope.$on('$ionicView.enter',function(){
        $ionicPopover.fromTemplateUrl('templates/pop-menu.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.options=options;
          $scope.popover = popover;
        });
        // $rootScope.conversation.type='single';
        // $rootScope.conversation.id=$state.params.chatId;
        // if(window.JMessage){
        //     window.JMessage.enterSingleConversation($state.params.chatId,"");
        //     getMsg();
        // }
    })
    $scope.enterChat = function(id){
        $state.go('tab.group-chat',{groupId:id});
    }
    $scope.$on('$ionicView.beforeLeave',function(){
        $scope.popover.hide();
    })
}])
.controller('NewGroupCtrl', ['$scope','$state',function($scope,$state){
    $scope.addMember = function(){
        $state.go('tab.group-add-member');
    }
    $scope.group={
        id:$state.params.groupId,
        name:'折翼肾病管家联盟',
        admin:'ABC',
        number:15,
        locale:'中国杭州',
        createAt:'2016-1-1',
        description:'Material takes cues from contemporary architecture, road signs, pavement marking tape, and athletic courts. Color should be unexpected and vibrant.',
        members:[
            {url:'img/ben.png',name:'Green'},
            {url:'img/perry.png',name:'Gray'},
            {url:'img/adam.jpg',name:'White'},
            {url:'img/max.png',name:'Blue'},
            {url:'img/ben.png',name:'Black'},
            {url:'img/max.png',name:'Blue'},
            {url:'img/ben.png',name:'Nat King Cole'}
        ]
    }
}])
.controller('GroupsSearchCtrl',['$scope','$state',function($scope,$state){
    $scope.viewGroupInfo= function(id){
        $state.go('tab.group-add',{groupId:id});
    }
}])