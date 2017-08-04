angular.module('fyl.controllers', ['ionic', 'kidney.services'])

.controller('ReportCtrl', ['$scope', '$state', 'getPatientData', function($scope, $state, getPatientData){
  patientId = "U201705110001"
  $scope.writeReport = true
  $scope.type = "week"
  $scope.toWeekReports = function(){
    $scope.modify = 0
    $scope.writeReport = true
    document.getElementById($scope.type).style.backgroundColor = "#FFFFFF"
    document.getElementById($scope.type).style.color = "#000000"
    $scope.type = "week"
    document.getElementById($scope.type).style.backgroundColor = "#6ac4f8"
    document.getElementById($scope.type).style.color = "#FFFFFF"
    healthyCurve()
  }
  
  $scope.toMonthReports = function(){
    $scope.modify = 0
    $scope.writeReport = true
    document.getElementById($scope.type).style.backgroundColor = "#FFFFFF"
    document.getElementById($scope.type).style.color = "#000000"
    $scope.type = "month"
    document.getElementById($scope.type).style.backgroundColor = "#6ac4f8"
    document.getElementById($scope.type).style.color = "#FFFFFF"
    healthyCurve()
  }

  $scope.toSeasonReports = function(){
    $scope.modify = 0
    $scope.writeReport = true
    document.getElementById($scope.type).style.backgroundColor = "#FFFFFF"
    document.getElementById($scope.type).style.color = "#000000"
    $scope.type = "season"
    document.getElementById($scope.type).style.backgroundColor = "#6ac4f8"
    document.getElementById($scope.type).style.color = "#FFFFFF"
    healthyCurve()
  }

  $scope.toYearReports = function(){
    $scope.modify = 0
    $scope.writeReport = true
    document.getElementById($scope.type).style.backgroundColor = "#FFFFFF"
    document.getElementById($scope.type).style.color = "#000000"
    $scope.type = "year"
    document.getElementById($scope.type).style.backgroundColor = "#6ac4f8"
    document.getElementById($scope.type).style.color = "#FFFFFF"
    healthyCurve()
  }

  $scope.last = function(){
    console.log($scope.modify)
    $scope.modify -= 1
    $scope.writeReport = true
    healthyCurve()
  }
  $scope.next = function(){
    console.log($scope.modify)
    $scope.modify += 1
    $scope.writeReport = true
    healthyCurve()
  }

  var healthyCurve = function(){
    var date = new Date()
    var date = "2017-05-27T00:00:00.000Z"

    getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "Temperature", showType: $scope.type, modify: $scope.modify}).then(
      function(data){
        var vitalsign = new Array()
        var ChartData = new Array()
        var ChartTime = new Array()
        var ChartTimeTemp = new Array()
        vitalsign = data
        $scope.Temp = data.results.item
        console.log(vitalsign.results.item.data1.length==0)
        if(vitalsign.results.item.data1.length==0){
            console.log('no data')
            var chart = new Highcharts.Chart('container1', {
                credits:{enabled:false},
                chart: {
                    height:50,
                    borderRadius:5,//图表边框圆角角度  
                    shadow:true,//是否设置阴影  
                }, 
                title: {
                    text: '您没有体温的测量数据！',
                    x: 0,
                    y: 20,
                }
            })
        }else{
            ChartData = vitalsign.results.item.data1
            ChartTimeTemp = vitalsign.results.item.recordTime
            for(i=0; i<ChartTimeTemp.length; i++){
                ChartTime[i]=ChartTimeTemp[i].substring(0,10)
            }
            var chart = new Highcharts.Chart('container1', {
                credits:{enabled:false},
                chart: {
                            // backgroundColor:"#ECFFFF",//图表背景色  
                            // borderWidth:5,//图表边框宽度  
                            borderRadius:5,//图表边框圆角角度  
                            // plotBackgroundColor:"#46A3FF",//主图表区背景颜色  
                            // plotBorderColor:'blue',//主图表边框颜色  
                            // plotBorderWidth:2,//主图表边框宽度  
                            shadow:true,//是否设置阴影  
                            zoomType:'xy'
                }, 
                colors:[       
                            '#FF8040',
                            '#66B3FF',
                            '#0080FF',
                            '#00FF00',//绿  
                            '#0000FF',//蓝  
                            '#FFFF00',//黄  
                            '#FF00FF',//紫  
                            '#FFFFFF',//紫 
                            '#000000',//黑  
                            '#FF0000',//红  
                          ],  
                title: {
                    text: '体温',
                    x: 0,
                    y: 33,
                },
                xAxis: {
                    categories: ChartTime
                },
                yAxis: {
                    title: {
                        text: '温度(°C)',
                        x:0,
                        y:-10
                    },
                    plotLines: [{
                        //控制x轴线型
                        value: 0,
                        width: 0.1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'horizontal',   //图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                    align: 'center',      //图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                    verticalAlign: 'top', //垂直对齐方式，有 'top'， 'middle' 及 'bottom' 可选
                    borderWidth: 0,
                    x:0,
                    y:+50
                },
                series: [{
                    name: '体温℃',
                    data: ChartData
                }]
            })
        }
        // $scope.TempAdvice = "体温高于37.3为发热"
      },function(err){
    })

    //体重
    getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "Weight", showType: $scope.type, modify: $scope.modify}).then(
      function(data){
        console.log(data.results) 
        var vitalsign = new Array()
        var ChartData = new Array()
        var ChartTime = new Array()
        var ChartTimeTemp = new Array()
        vitalsign = data
        $scope.Weight = data.results.item
        if(vitalsign.results.item.data1.length==0){
            var chart = new Highcharts.Chart('container2', {
                credits:{enabled:false},
                chart: {
                    height:50,
                    borderRadius:5,//图表边框圆角角度  
                    shadow:true,//是否设置阴影  
                }, 
                title: {
                    text: '您没有体重的测量数据！',
                    x: 0,
                    y: 20,
                }
            })
        } else{
            ChartData = vitalsign.results.item.data1
            ChartTimeTemp = vitalsign.results.item.recordTime
            for(i=0; i<ChartTimeTemp.length; i++){
                ChartTime[i]=ChartTimeTemp[i].substring(0,10)
            }
            var chart = new Highcharts.Chart('container2', {
                credits:{enabled:false},
                chart: {
                        // backgroundColor:"#ECFFFF",//图表背景色  
                        // borderWidth:5,//图表边框宽度  
                        borderRadius:5,//图表边框圆角角度  
                        // plotBackgroundColor:"#46A3FF",//主图表区背景颜色  
                        // plotBorderColor:'blue',//主图表边框颜色  
                        // plotBorderWidth:2,//主图表边框宽度  
                        shadow:true,//是否设置阴影        
                        zoomType:'xy'
                }, 
                colors:[       
                        '#FF8040',
                        '#66B3FF',
                        '#0080FF',
                        '#00FF00',//绿  
                        '#0000FF',//蓝  
                        '#FFFF00',//黄  
                        '#FF00FF',//紫  
                        '#FFFFFF',//紫 
                        '#000000',//黑  
                        '#FF0000',//红  
                      ],  
                title: {
                    text: '体重',
                    x: 0,
                    y: 33,
                },
                xAxis: {
                    categories: ChartTime
                },
                yAxis: {
                    title: {
                        text: '质量(Kg)',
                        x:0,
                        y:-10
                    },
                    plotLines: [{
                        //控制x轴线型
                        value: 0,
                        width: 0.1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: 'Kg'
                },
                legend: {
                    layout: 'horizontal',   //图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                    align: 'center',      //图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                    verticalAlign: 'top', //垂直对齐方式，有 'top'， 'middle' 及 'bottom' 可选
                    borderWidth: 0,
                    x:0,
                    y:+50
                },
                series: [{
                    name: '体重Kg',
                    data: ChartData
                }]
            })
        }
        $scope.WeightLow = 50
        $scope.WeightHigh =60
      },function(err){
    })

    //血压
    getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "BloodPressure", showType: $scope.type, modify: $scope.modify}).then(
      function(data){
        console.log(data.results) 
        var vitalsign = new Array()
        var ChartData1 = new Array()
        var ChartData2 = new Array()
        var ChartTime = new Array()
        var ChartTimeTemp = new Array()
        vitalsign = data
        $scope.BP = data.results.item
        if(vitalsign.results.item.recordTime.length==0){
            var chart = new Highcharts.Chart('container3', {
                credits:{enabled:false},
                chart: {
                    height:50,
                    borderRadius:5,//图表边框圆角角度  
                    shadow:true,//是否设置阴影  
                }, 
                title: {
                    text: '您没有血压的测量数据！',
                    x: 0,
                    y: 20,
                }   
            })
        }else{
            ChartData1 = vitalsign.results.item.data1
            ChartData2 = vitalsign.results.item.data2
            ChartTimeTemp = vitalsign.results.item.recordTime
            for(i=0; i<ChartTimeTemp.length; i++){
               ChartTime[i]=ChartTimeTemp[i].substring(0,10)
            }
            var chart = new Highcharts.Chart('container3', {
                credits:{enabled:false},
                chart: {
                    // backgroundColor:"#ECFFFF",//图表背景色  
                    // borderWidth:5,//图表边框宽度  
                    borderRadius:5,//图表边框圆角角度  
                    // plotBackgroundColor:"#46A3FF",//主图表区背景颜色  
                    // plotBorderColor:'blue',//主图表边框颜色  
                    // plotBorderWidth:2,//主图表边框宽度  
                    shadow:true,//是否设置阴影  
                    zoomType:'xy'
                }, 
                colors:[       
                    '#FF8040',
                    '#66B3FF',
                    '#0080FF',
                    '#00FF00',//绿  
                    '#0000FF',//蓝  
                    '#FFFF00',//黄  
                    '#FF00FF',//紫  
                    '#FFFFFF',//紫 
                    '#000000',//黑  
                    '#FF0000',//红  
                    ],  
                title: {
                    text: '血压',
                    x: 0,
                    y: 33,
                },
                xAxis: {
                    categories: ChartTime
                },
                yAxis: {
                    title: {
                        text: '压强(mmHg)',
                        x:0,
                        y:-10
                    },
                    plotLines: [{
                        //控制x轴线型
                        value: 0,
                        width: 0.1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: 'mmHg'
                },
                legend: {
                    layout: 'horizontal',   //图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                    align: 'center',      //图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                    verticalAlign: 'top', //垂直对齐方式，有 'top'， 'middle' 及 'bottom' 可选
                    borderWidth: 0,
                    x:0,
                    y:+50
                },
                series: [{
                    name: '高压mmHg',
                    data: ChartData1
                },{
                    name: '低压mmHg',
                    data: ChartData2
                }]
            })
        }
      },function(err){
    })

    //尿量
    getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "Vol", showType: $scope.type, modify: $scope.modify}).then(
      function(data){
        console.log(data.results)
        var vitalsign = new Array()
        var ChartData = new Array()
        var ChartTime = new Array()
        var ChartTimeTemp = new Array()
        vitalsign = data
        $scope.Vol = data.results.item
        if(vitalsign.results.item.recordTime.length==0){
            var chart = new Highcharts.Chart('container4', {
                credits:{enabled:false},
                chart: {
                    height:50,
                    borderRadius:5,//图表边框圆角角度  
                    shadow:true,//是否设置阴影  
                }, 
                title: {
                    text: '您没有尿量的测量数据！',
                    x: 0,
                    y: 20,
                }
            })
        }else{
            ChartData = vitalsign.results.item.data1
            ChartTimeTemp = vitalsign.results.item.recordTime
            for(i=0; i<ChartTimeTemp.length; i++){
               ChartTime[i]=ChartTimeTemp[i].substring(0,10)
            }
            var chart = new Highcharts.Chart('container4', {
                credits:{enabled:false},
                chart: {
                    // backgroundColor:"#ECFFFF",//图表背景色  
                    // borderWidth:5,//图表边框宽度  
                    borderRadius:5,//图表边框圆角角度  
                    // plotBackgroundColor:"#46A3FF",//主图表区背景颜色  
                    // plotBorderColor:'blue',//主图表边框颜色  
                    // plotBorderWidth:2,//主图表边框宽度  
                    shadow:true,//是否设置阴影  
                    zoomType:'xy'
                }, 
                colors:[       
                    '#FF8040',
                    '#66B3FF',
                    '#0080FF',
                    '#00FF00',//绿  
                    '#0000FF',//蓝  
                    '#FFFF00',//黄  
                    '#FF00FF',//紫  
                    '#FFFFFF',//紫 
                    '#000000',//黑  
                    '#FF0000',//红  
                    ],  
                title: {
                    text: '尿量',
                    x: 0,
                    y: 33,
                },
                xAxis: {
                    categories: ChartTime
                },
                yAxis: {
                    title: {
                        text: '体积(mL)',
                        x:0,
                        y:-10
                    },
                    plotLines: [{
                        //控制x轴线型
                        value: 0,
                        width: 0.1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: 'mL'
                },
                legend: {
                    layout: 'horizontal',   //图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                    align: 'center',      //图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                    verticalAlign: 'top', //垂直对齐方式，有 'top'， 'middle' 及 'bottom' 可选
                    borderWidth: 0,
                    x:0,
                    y:+50
                },
                series: [{
                    name: '尿量mL',
                    data: ChartData
                }]
            })
        }
      },function(err){
    })


    //心率
    getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "HeartRate", showType: $scope.type, modify: $scope.modify}).then(
      function(data){
        console.log(data.results)
        var vitalsign = new Array()
        var ChartData = new Array()
        var ChartTime = new Array()
        var ChartTimeTemp = new Array()
        vitalsign = data
        $scope.HR = data.results.item
        if(vitalsign.results.item.recordTime.length==0){
            var chart = new Highcharts.Chart('container5', {
                credits:{enabled:false},
                chart: {
                                height:50,
                                borderRadius:5,//图表边框圆角角度  
                                shadow:true,//是否设置阴影  
                }, 
                title: {
                    text: '您没有心率的测量数据！',
                    x: 0,
                    y: 20,
                }
            })
        }else{
            ChartData = vitalsign.results.item.data1
            ChartTimeTemp = vitalsign.results.item.recordTime
            for(i=0; i<ChartTimeTemp.length; i++){
               ChartTime[i]=ChartTimeTemp[i].substring(0,10)
            }
            var chart = new Highcharts.Chart('container5', {
                credits:{enabled:false},
                chart: {
                    // backgroundColor:"#ECFFFF",//图表背景色  
                    // borderWidth:5,//图表边框宽度  
                    borderRadius:5,//图表边框圆角角度  
                    // plotBackgroundColor:"#46A3FF",//主图表区背景颜色  
                    // plotBorderColor:'blue',//主图表边框颜色  
                    // plotBorderWidth:2,//主图表边框宽度  
                    shadow:true,//是否设置阴影  
                    zoomType:'xy'
                }, 
                colors:[       
                    '#FF8040',
                    '#66B3FF',
                    '#0080FF',
                    '#00FF00',//绿  
                    '#0000FF',//蓝  
                    '#FFFF00',//黄  
                    '#FF00FF',//紫  
                    '#FFFFFF',//紫 
                    '#000000',//黑  
                    '#FF0000',//红  
                    ],  
                title: {
                    text: '心率',
                    x: 0,
                    y: 33,
                },
                xAxis: {
                    categories: ChartTime
                },
                yAxis: {
                    title: {
                        text: '频率(次/分钟)',
                        x:0,
                        y:-10
                    },
                    plotLines: [{
                      //控制x轴线型
                        value: 0,
                        width: 0.1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '次/分钟'
                },
                legend: {
                    layout: 'horizontal',   //图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                    align: 'center',      //图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                    verticalAlign: 'top', //垂直对齐方式，有 'top'， 'middle' 及 'bottom' 可选
                    borderWidth: 0,
                    x:0,
                    y:+50
                },
                series: [{
                    name: '心率（次/分钟）',
                    data: ChartData
                }]
            })
        }
      },function(err){
    })

    //腹透
    getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "PeritonealDialysis", showType: $scope.type, modify: $scope.modify}).then(
      function(data){
        console.log(data.results) 
        var vitalsign = new Array()
        var ChartData1 = new Array()
        var ChartData2 = new Array()
        var ChartTime = new Array()
        var ChartTimeTemp = new Array()
        vitalsign = data
        $scope.PD = data.results.item
        if(vitalsign.results.item.recordTime.length==0){
            var chart = new Highcharts.Chart('container6', {
                credits:{enabled:false},
                chart: {
                    height:50,
                    borderRadius:5,//图表边框圆角角度  
                    shadow:true,//是否设置阴影  
                }, 
                title: {
                    text: '您没有腹透的测量数据！',
                    x: 0,
                    y: 20,
                }   
            })
        }else{
            ChartData1 = vitalsign.results.item.data1
            ChartData2 = vitalsign.results.item.data2
            ChartTimeTemp = vitalsign.results.item.recordTime
            for(i=0; i<ChartTimeTemp.length; i++){
               ChartTime[i]=ChartTimeTemp[i].substring(0,10)
            }
            var chart = new Highcharts.Chart('container6', {
                credits:{enabled:false},
                chart: {
                    // backgroundColor:"#ECFFFF",//图表背景色  
                    // borderWidth:5,//图表边框宽度  
                    borderRadius:5,//图表边框圆角角度  
                    // plotBackgroundColor:"#46A3FF",//主图表区背景颜色  
                    // plotBorderColor:'blue',//主图表边框颜色  
                    // plotBorderWidth:2,//主图表边框宽度  
                    shadow:true,//是否设置阴影  
                    zoomType:'xy'
                }, 
                colors:[       
                    '#FF8040',
                    '#66B3FF',
                    '#0080FF',
                    '#00FF00',//绿  
                    '#0000FF',//蓝  
                    '#FFFF00',//黄  
                    '#FF00FF',//紫  
                    '#FFFFFF',//紫 
                    '#000000',//黑  
                    '#FF0000',//红  
                    ],  
                title: {
                    text: '腹透',
                    x: 0,
                    y: 33,
                },
                xAxis: {
                    categories: ChartTime
                },
                yAxis: {
                    title: {
                        text: '流量(mL)',
                        x:0,
                        y:-10
                    },
                    plotLines: [{
                        //控制x轴线型
                        value: 0,
                        width: 0.1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: 'mL'
                },
                legend: {
                    layout: 'horizontal',   //图例内容布局方式，有水平布局及垂直布局可选，对应的配置值是： “horizontal”， “vertical”
                    align: 'center',      //图例在图表中的对齐方式，有 “left”, "center", "right" 可选
                    verticalAlign: 'top', //垂直对齐方式，有 'top'， 'middle' 及 'bottom' 可选
                    borderWidth: 0,
                    x:0,
                    y:+50
                },
                series: [{
                    name: '超滤量mL',
                    data: ChartData1
                },{
                    name: '出量mL',
                    data: ChartData2
                }]
            })
        }
      },function(err){
    })

    //化验
    //getPatientData.ReportData({time: date, type: "Measure", patientId: patientId, code: "lab"})         
  }

  $scope.editReport = function(){
    $scope.writeReport = false
    // $scope.MeasureData = "MeasureData1"
    // document.getElementByName('')
  }
  $scope.saveReport = function(){
    $scope.writeReport = true
    data = [
        {itemType: "Weight", recommendValue11: $scope.WeightLow, recommendValue12: $scope.WeightHigh},
        {itemType: "BloodPressure", recommendValue11: $scope.BPH1, recommendValue12: $scope.BPH2, recommendValue13: $scope.BPL1, recommendValue14: $scope.BPL2},
        {itemType: "HeartRate", recommendValue11: $scope.HRL, recommendValue12: $scope.HRH},
        {itemType: "PeritonealDialysis", recommendValue11: $scope.PDL, recommendValue12: $scope.PDH}
    ]           
    getPatientData.SaveReport({patientId: patientId, time: $scope.Temp.time, type: $scope.type, data: data}).then(
        function(data){},
        function(err){})
    // $scope.MeasureData = "MeasureData"
  }

  $scope.Goback = function(){
    $state.go('tab.patient')
  }

  $scope.toWeekReports()
}])