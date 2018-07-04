# datePicker
<<<<<<< HEAD
双日历插件
<br/>支持单日历，单日期，日期范围选择  

### Demo
https://guoguo13.github.io/datePicker/

### 参数说明

 * @param {double} 是否显示双日历，默认为true
 * @param {format} 日期格式 支持yyyy/mm/dd和yyyy-mm-dd两种
 * @param {range} 是否支持选取日期范围，默认为false
 * @param {startDate} 初始可选取日期，此日期之前日期不可选择
 * @return {value} 返回选中值
 
```
options = {
	double: true,
	format: 'yyyy-mm-dd',
	range: false,
	startDate: new Date(),
	callback: function() {}
};
```

### 使用说明
```
var datePicker = new DatePicker( document.querySelector(".doubleDatePicker"), {
	double: true,
	format: 'yyyy/mm/dd',
	range: false,
	startDate: '2018/03/04',
	callback: function(value) {
		console.log(value)
	}
});
```

## 未完成，待优化
  
=======
双日历插件 , 支持单日历，单日期，日期范围选择
## Demo
https://guoguo13.github.io/datePicker/
>>>>>>> 1d3d6e03ac13de5501f10b5a7b9afde84f6a8c10
