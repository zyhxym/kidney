angular.module('tdy.controllers', ['ionic','kidney.services'])

/////////////////////////tongdanyang/////////////////
.controller('DoctorDiagnoseCtrl', ['$scope', 'Storage','ionicDatePicker','Patient', function ($scope, Storage,ionicDatePicker,Patient) {
  $scope.Hypers =
  [
    {Name:"是",Type:1},
    {Name:"否",Type:2}
  ]
  
  $scope.Diseases =
  [
    {Name:"CKD1-2期",Type:2},
    {Name:"CKD3-4期",Type:3},
    {Name:"CDK5期未透析",Type:4},
    {Name:"腹透",Type:5},
    {Name:"血透",Type:6},
    {Name:"肾移植",Type:1}
  ]
  $scope.progressSelect =
  [
    [
      "疾病活跃期",
      "稳定期",
      ">3年"
    ],
    [
      "疾病活跃期",
      "稳定期"
    ]
  ]
  $scope.showDateTitle=function(type)
  {
    // console.log(type)
    var title="";
    if(type==1)
      title="手术日期"
    else if(type==5)
      title="插管日期"
    else if(type==6)
      title="开始日期"
    return title
  }

  $scope.Diagnose = 
  {
    "diagname": null,
    "diagtime": null,
    "operationTime": null,
    "hypertension": null,
    "diagprogress": '稳定期',
    "diagcontent":""
  }
  var datepickerD = {
        callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.Diagnose.operationTime=new Date(val);
        },
        titleLabel: '手术日期',
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
    $scope.openDatePicker = function(){
        ionicDatePicker.openDatePicker(datepickerD);
    };

  // {
  //     patientId:'',
  //     doctorId:'',
  //     diagname:'',
  //     diagtime:'',
  //     diagprogress:'',
  //     diagcontent:''
  //   }
  $scope.saveDiagnose=function()
  {
    $scope.Diagnose.patientId='330175147528475189';
    $scope.Diagnose.doctorId=Storage.get('UID');
    console.log($scope.Diagnose)
    Patient.insertDiagnosis($scope.Diagnose)
    .then(function(data){
      console.log(data)
    },function(err)
    {
      console.log(err)
    })
  }

  $scope.reset =function(){
    $scope.Diagnose = 
    {
      "KidneyDisease": null,
      "DiseaseDetail": null,
      "OperationDate": null,
      "Hypertension": '稳定期',
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
.controller('TaskSetCtrl', ['$scope', '$state', '$ionicPopup', function ($scope, $state, $ionicPopup) {
  $scope.Units = ["天", "周", "年", "月"];
  $scope.Times = ["1", "2", "3", "4", "5"];
  $scope.Tasks = [{Name: "体温", Description:"", Freq: {Time1:"1", Unit:"天", Time2:"1"}, Time:$scope.Times, Unit:$scope.Units}, 
                  {Name: "体重", Description:"", Freq: {Time1:"1", Unit:"天", Time2:"1"}, Time:$scope.Times, Unit:$scope.Units},  
                  {Name: "血压", Description:"每天晨起或睡前安静状态下测量血压2次", Freq: {Time1:"1", Unit:"天", Time2:"2"}, Time:$scope.Times, Unit:$scope.Units}, 
                  {Name: "心率", Description:"", Freq: {Time1:"1", Unit:"天", Time2:"2"}, Time:$scope.Times, Unit:$scope.Units}, 
                  {Name: "血管通路情况", Description:"", Freq:{Time1:"1", Unit:"天", Time2:"1"}, Time:$scope.Times, Unit:$scope.Units}, 
                  {Name: "复诊", Description:"", Freq: {Time1:"1", Unit:"月", Time2:"1"}, Time:$scope.Times, Unit:$scope.Units}, 
                  {Name: "化验", Description:"b2微球蛋白，转铁蛋白，前白蛋白，饮食记录，营养评估，sga评估，换管记录", Freq: {Time1:"2", Unit:"天", Time2:"1"}, Time:$scope.Times, Unit:$scope.Units}, 
                  {Name: "腹透方案", Description:"", Freq: {Time1:"1", Unit:"天", Time2:"3"}, Time:$scope.Times, Unit:$scope.Units},
                  {Name: "特殊评估", Description:"心电图、肺Ct、心脏B超、腹部B超，血管B超", Freq: {Time1:"1", Unit:"年", Time2:"1"}, Time:$scope.Times, Unit:$scope.Units}];

  $scope.SetFreq = function()
  {
      
      $state.go('tab.patientDetail');
  }
  
  //编辑任务描述
  $scope.showPopup = function(name) {
    $scope.data = {};
    for(var i=0;i<$scope.Tasks.length;i++)
    {
        if($scope.Tasks[i].Name == name)
        {
             $scope.data.value = $scope.Tasks[i].Description;
             break;
        }
    }   
           
    var myPopup = $ionicPopup.show({
       template: '<textarea style="height:150px;" ng-model="data.value"></textarea>',     
       title: '请填写'+ name + '备注',
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
        for(var i=0;i<$scope.Tasks.length;i++)
        {
            if($scope.Tasks[i].Name == name)
            {
                $scope.Tasks[i].Description = res;
                break;
            }
        } 
      }  
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
