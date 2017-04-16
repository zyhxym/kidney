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
.controller('TestRecordCtrl', ['$scope', '$http','Storage', function ($scope,$http, Storage) {
  // $scope.$on('$ionicView.afterEnter', function() {  

//                 console.log('afterEnter');  

// }, false);  
 // console.log("mmb");
 //  $scope.$on('$ionicView.enter', function() 
 //  {
 //    console.log("mmb");
     $http.get("../data/pressure.json").success(function(data) {
         $scope.pressuredata = data;
         console.log($scope.pressuredata)
         createStockChart($scope.pressuredata,"血压","mmHg");
     });
  // })

  $scope.title="血压"
  $scope.unit="mmHg"
  $scope.chart = createStockChart($scope.data1,$scope.title,$scope.unit);
  ////提振参数选择下拉框选项 默认收缩压selected
  //下拉选择不同体征类型
  $scope.options = [{"SignName":"血压"},
    {"SignName":"体重"},
    {"SignName":"体温"},
    {"SignName":"尿量"},
    {"SignName":"心率"}
  ];  
  $scope.vitalInfo=$scope.options[0].SignName

  //切换体征
  $scope.changeVitalInfo = function(option) 
    {
       $scope.selectedname=option;
       console.log($scope.selectedname)
       drawcharts($scope.selectedname);
    };
    //根据体征类型画图
    var drawcharts=function(param){
    if (param=="血压") {
      $http.get("../data/pressure.json").success(function(data) {
         $scope.pressuredata = data;
         console.log($scope.pressuredata)
         createStockChart($scope.pressuredata,"血压","mmHg");
     });
      
      
    }
    if(param=="体温"){
      $http.get("../data/temperature.json").success(function(data) {
         $scope.temperature = data.dahjvhjkhs;
         console.log($scope.temperature)
         createStockChart($scope.temperature,"体温","℃");
     });
      
      
    }
  }
  //传参绘图
  function createStockChart(ChartData,title,unit) {

    chart="";
    var chart = AmCharts.makeChart("chartdiv", {
    "type": "serial",
    "theme": "light",
    "marginTop":0,
    "marginRight": 80,
    "dataProvider": ChartData,
    "valueAxes": [{
        "axisAlpha": 0,
        "position": "left"
    }],
    // "graphs": [{
    //       "balloonText": "[[category]]: <p>[[title]]：[[value]] [[unit]]</p>",
    //       "bullet": "round",
    //       "bulletSize": 8,
    //       "lineThickness": 2,
    //       "lineColor": "#d1655d",
    //       "type": "smoothedLine",
    //       "valueField": "Value",
    //       "title":title,
    //       "fillAlphas": 0
    //     }],
    "graphs": [{
        "id":"g1",
        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
        "bullet": "round",
        "bulletSize": 8,
        "lineColor": "#d1655d",
        "lineThickness": 2,
        "negativeLineColor": "#637bb6",
        "type": "smoothedLine",
        "valueField": "value"
    }],
    "chartScrollbar": {
        "graph":"g1",
        "gridAlpha":0,
        "color":"#888888",
        "scrollbarHeight":55,
        "backgroundAlpha":0,
        "selectedBackgroundAlpha":0.1,
        "selectedBackgroundColor":"#888888",
        "graphFillAlpha":0,
        "autoGridCount":true,
        "selectedGraphFillAlpha":0,
        "graphLineAlpha":0.2,
        "graphLineColor":"#c2c2c2",
        "selectedGraphLineColor":"#888888",
        "selectedGraphLineAlpha":1

    },
    "chartCursor": {
        "categoryBalloonDateFormat": "YYYY",
        "cursorAlpha": 0,
        "valueLineEnabled":true,
        "valueLineBalloonEnabled":true,
        "valueLineAlpha":0.5,
        "fullWidth":true
    },
    "dataDateFormat": "YYYY",
    "categoryField": "year",
    "categoryAxis": {
        "minPeriod": "YYYY",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
    },
    "export": {
        "enabled": true
    }
});


// chart.addListener("rendered", zoomChart);
// if(chart.zoomChart){
//   chart.zoomChart();
// }

// function zoomChart(){
//     chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.4), Math.round(chart.dataProvider.length * 0.55));
// }
}
  
}])

//任务设置--GL
.controller('TaskSetCtrl', ['$scope', '$state', '$ionicPopup', 'Storage', function ($scope, $state, $ionicPopup, Storage) {
   var UserId = Storage.get('UID'); 
    $scope.$on('$ionicView.enter', function() {
        Temp();
    }); 
  //任务先写死
    $scope.Tasks = [
        {
          "type": "Measure",
          "details": [
            {
              "code": "Temperature",
              "instruction": "",
              "content": "",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 1,
              "timesUnits": "次",
              "frequencyTimes": 1,
              "frequencyUnits": "天"
            },
            {
              "code": "Weight",
              "instruction": "",
              "content": "",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 1,
              "timesUnits": "次",
              "frequencyTimes": 1,
              "frequencyUnits": "天"
            },
            {
              "code": "BloodPressure",
              "instruction": "",
              "content": "",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 2,
              "timesUnits": "次",
              "frequencyTimes": 1,
              "frequencyUnits": "天"
            },
            {
              "code": "Vol",
              "instruction": "",
              "content": "",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 1,
              "timesUnits": "次",
              "frequencyTimes": 1,
              "frequencyUnits": "天"
            },
            {
              "code": "HeartRate",
              "instruction": "",
              "content": "",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 2,
              "timesUnits": "次",
              "frequencyTimes": 1,
              "frequencyUnits": "天"
            }
          ]
        },
        {
          "type": "ReturnVisit",
          "details": [            
            {
              "code": "TimeInterval_3",
              "instruction": "术后时间>3年",
              "content": "",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 1,
              "timesUnits": "次",
              "frequencyTimes": 2,
              "frequencyUnits": "月"
            }
          ]
        },
        {
          "type": "LabTest",
          "details": [
            {
              "code": "LabTest_3",
              "instruction": "术后时间>3年",
              "content": "血常规、血生化、尿常规、尿生化、移植肾彩超、血药浓度",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 1,
              "timesUnits": "次",
              "frequencyTimes": 2,
              "frequencyUnits": "周"
            }
          ]
        },
        {
          "type": "SpecialEvaluate",
          "details": [
            {
              "code": "ECG",
              "instruction": "",
              "content": "心电图，胸片，移植肾B超",
              "startTime": "2050-11-02T07:58:51.718Z",
              "endTime": "2050-11-02T07:58:51.718Z",
              "times": 1,
              "timesUnits": "次",
              "frequencyTimes": 1,
              "frequencyUnits": "年"
            }            
          ]
        }
      ];
  
  function Temp()
    {
       //console.log($scope.Tasks);
       $scope.Tasks.Other = [];
      for (var i=0;i<$scope.Tasks.length;i++)
      {      
         var task = $scope.Tasks[i];
         if(task.type == 'Measure')
         {
            $scope.Tasks.Measure = task.details;
            for(var j=0;j<$scope.Tasks.Measure.length;j++)
            {
                $scope.Tasks.Measure[j].Name = NameMatch($scope.Tasks.Measure[j].code);                    
            }
         }
         else
         {
            var newTask = task.details[0];        
            newTask.type = task.type;
            newTask.Name = NameMatch(newTask.type);               
            $scope.Tasks.Other.push(newTask);                            
         }
         
      }
      //console.log($scope.Tasks);
    }

  //名称转换
   function NameMatch(name)
   {
     var Tbl = [
                 {Name:'体温', Code:'Temperature'},
                 {Name:'体重', Code:'Weight'},
                 {Name:'血压', Code:'BloodPressure'},
                 {Name:'尿量', Code:'Vol'},
                 {Name:'心率', Code:'HeartRate'},
                 {Name:'复诊', Code:'ReturnVisit'},
                 {Name:'化验', Code:'LabTest'},
                 {Name:'特殊评估', Code:'SpecialEvaluate'}
                ];
      for (var i=0;i<Tbl.length;i++)
      {
         if(Tbl[i].Code == name)
         {
            name = Tbl[i].Name
            break;
         }
      }
      return name;
   }
  
  //下拉框数据
    $scope.Units = ["天", "周", "年", "月"];
    $scope.Times = [1, 2, 3, 4, 5, 6];

  //确定按钮
    $scope.OkClick = function()
    {
        //调用修改模板函数
        $state.go('tab.patientDetail');
    }
  
  //编辑任务描述
    $scope.showPopup = function(task) {
      $scope.data = {};    
      $scope.data.value = task.content;                    
      var myPopup = $ionicPopup.show({
         template: '<textarea style="height:150px;" ng-model="data.value"></textarea>',     
         title: '请填写'+ task.Name + '备注',
         scope: $scope,
         buttons: [
           { text: '取消' },
           {
             text: '<b>保存</b>',
             type: 'button-positive',
             onTap: function(e) {
               if (!$scope.data.value) {
                 // 不允许用户关闭，除非输入内容
                 e.preventDefault();
               } else {
                return $scope.data.value;
               }  
            }
           },
           ]
       });
       myPopup.then(function(res) {
        //console.log(res);
        if(res)
        {        
          for(var i=0;i<$scope.Tasks.Measure.length;i++)
          {
              if($scope.Tasks.Measure[i].Name == task.Name)
              {
                  $scope.Tasks.Measure[i].content = res;
                  break;
              }
          } 
          for(var i=0;i<$scope.Tasks.Other.length;i++)
          {
              if($scope.Tasks.Other[i].Name == task.Name)
              {
                  $scope.Tasks.Other[i].content = res;
                  break;
              }
          } 
        } 
        //console.log( $scope.Tasks);
      });
    };

}])
//消息类型--PXY
.controller('VaryMessageCtrl', ['$scope','$state','$ionicHistory',function($scope, $state,$ionicHistory) {
  $scope.barwidth="width:0%";

  $scope.Goback = function(){
    $ionicHistory.goBack();
  }
  $scope.messages =[
  
  {
    img:"img/default_user.png",
    time:"2017/03/21",
    response:"今天还没有测量血压，请及时完成！"

  },
  {
    img:"img/default_user.png",
    time:"2017/03/11",
    response:"今天建议运动半小时，建议以散步或慢跑的形式！"

  }]

  
}])
//消息中心--PXY
.controller('messageCtrl', ['$scope','$state','$ionicHistory',function($scope, $state,$ionicHistory) {
  $scope.barwidth="width:0%";

  $scope.Goback = function(){
    $ionicHistory.goBack();
  }

  $scope.getMessageDetail = function(type){
    if(type == 2){
      $state.go('messagesDetail');
    }

  }
  //查询余额等等。。。。。
  $scope.messages =[
  {
    img:"img/default_user.png",
    name:"支付消息",
    type:1,
    time:"2017/04/01",
    response:"恭喜你！成功充值50元，交易账号为0093842345."
  },
  {
    img:"img/default_user.png",
    name:"任务消息",
    type:2,
    time:"2017/03/21",
    response:"今天还没有测量血压，请及时完成！"

  },
  {
    img:"img/default_user.png",
    name:"警报消息",
    type:3,
    time:"2017/03/11",
    response:"你的血压值已超出控制范围！"

  }]


  $scope.consults =[
  {
    img:"img/default_user.png",
    name:"李芳",
    time:"2017/03/04",
    response:"您好,糖尿病患者出现肾病的,一般会出现低蛋白血症.低蛋白血症患者一般会出现浮肿.治疗浮肿时就需要适当的补充蛋白,但我们一般提倡使用优质蛋白,我不知道您的蛋白粉是不是植物蛋白,所以您还是慎重一点好."

  },
  {
    img:"img/default_user.png",
    name:"张三",
    time:"2017/03/01",
    response:"糖尿病肾损害的发生发展分5期.Ⅰ期,为糖尿病初期,肾体积增大,肾小球滤过滤增高,肾小球入球小动脉扩张,肾小球内压升高.Ⅱ期,肾小球毛细血管基底膜增厚,尿白蛋白排泄率多正常,或间歇性升高。"

  }
  

  ]
    

  
}])
// .controller('groupQRCodeCtrl', ['$scope', 'Storage', function ($scope, Storage) {
//   $scope.groupQRCodedata = "www.baidu.com"
// }])
