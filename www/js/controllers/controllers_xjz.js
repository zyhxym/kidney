angular.module('xjz.controllers', ['ionic','kidney.services'])

.controller('GroupAddCtrl',['$scope','$state',function($scope,$state){
    console.log($state);
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
            {url:'img/ben.png',name:'Black'}
        ]
    }
}])
.controller('GroupDetailCtrl',['$scope','$state','$ionicModal',function($scope,$state,$ionicModal){
    $scope.addMember = function(){
        $state.go('tab.group-add-member',{groupId:$scope.group.id});
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
        $state.go('tab.group-qrcode',{groupId:$scope.group.id});
    }
    $scope.closeModal = function() {
        // $scope.imageHandle.zoomTo(1,true);
        $scope.modal.hide();
        $scope.modal.remove()
    };
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
            {url:'img/ben.png',name:'Green'},
            {url:'img/perry.png',name:'Gray'},
            {url:'img/adam.jpg',name:'White'},
            {url:'img/max.png',name:'Blue'},
            {url:'img/ben.png',name:'Black'},
            {url:'img/ben.png',name:'Green'},
            {url:'img/perry.png',name:'Gray'},
            {url:'img/adam.jpg',name:'White'},
            {url:'img/max.png',name:'Blue'},
            {url:'img/adam.jpg',name:'White'},
            {url:'img/max.png',name:'Blue'},
            {url:'img/ben.png',name:'Nat King Cole'}
        ]
    }
}])
.controller('GroupQrcodeCtrl',['$scope','$state',function($scope,$state){
    $scope.params={
        // groupId:$state.params.groupId
        groupId: '123123123'

    }
}])
.controller('GroupAddMemberCtrl',['$scope','$state',function(){
    //get groupId via $state.params.groupId

}])
.controller('GroupChatCtrl',['$scope','$state','$rootScope',function($scope,$state,$rootScope){
  $scope.params={
      type:$state.params.type,
      groupId:$state.params.groupId,
        msgCount:0,
        helpDivHeight:40,
        hidePanel:true,
        isDiscuss:false
        // helpDivStyle:"{'padding-top':'100px'}"
    }
    $scope.$on('$ionicView.beforeEnter',function(){
      if($scope.params.type==2)$scope.params.isDiscuss=true;
    })
    $scope.$on('$ionicView.enter',function(){
        $rootScope.conversation.type='group';
        $rootScope.conversation.id=$state.params.groupId;
        if(window.JMessage){
            window.JMessage.enterSingleConversation($state.params.chatId,"");
            getMsg();
        }
    })
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
    $scope.group={
        name:'BME319',
        id:$state.params.groupId,

    }

}])