/*
 * @param {double} 是否显示双日历，默认为true
 * @param {format} 日期格式
 * @param {range} 是否支持选取日期范围，默认为false
 * @param {startDate} 初始可选取日期，此日期之前日期不可选择
 * @return {value} 返回选中值
 */
function DatePicker(node, options) {
    if(typeof node === 'undefined') {
        throw new Error('node is not Element');
    }
    this.options = {
        double: true,
        format: 'yyyy-mm-dd',
        range: false,
        startDate: new Date(),
        callback: function() {}
    };
    this.el = node;
    this.elP = this.el.parentNode;
    for( var k in options ) {
        this.options[k] = options[k];
    }
    this.startDate = getDate(new Date(this.options.startDate));
    var that = this;

    var createDom = function() {
        var prev = creEle("a", {className:"prev"} ),
            next = creEle("a", {className:"next"} ),
            arrow = creEle("div",{className:"arrow"}, [prev,next]),
            calendar = createCalendar(),
            dateBox = creEle("div", {className:"date-box"}, calendar),
            container = creEle("div", {className:"container"}, [arrow,calendar]);
            wrapper = creEle("div", {className:"datePicker"}, container);
        that.elP.appendChild(wrapper);
    },
    createCalendar = function () {
        var table = creEle("table"),
            thead = creEle("thead"),
            tbody = craeteTd(),
            theadTr = creEle("tr"),
            h4 = creEle("h4", {className:"month"}, that.startDate.year + '年' + that.startDate.month + '月');
        var week = ["日","一","二","三","四","五","六"], weekHTML = '';
        for(var i = 0; i < week.length; i++) {
            weekHTML += '<td>' + week[i] + '</td>';
        }
        theadTr.innerHTML = weekHTML;
        thead.appendChild(theadTr);
        table = creEle("table", {}, [thead, tbody]);
        return creEle("div", {className:"calendar-item"}, [h4, table]);
    },
    createTd = function() {
        var tbody = creEle("tbody"); 
        var curDate = getDate(new Date());
    }
    createDom();
};



// 获取指定年的某月份有多少天
function getDays(year,month) {
    switch(month) {
        case 1,3,5,7,8,10,12: return 31;
        case 2: return isLeapYear(year)? 28: 29;
        case 4,6,9,11: return 30;
    }
}

// 获取年，月份，月第一天星期
function getDate(day) {
    var startDate = day,
    year = startDate.getFullYear(),
    month = startDate.getMonth() + 1,
    monthDays = getDays(year,month),
    week = new Date(year, month - 1, 1).getDay();
    return { year, month, week, monthDays };
}

// 判断当前年是否为闰年
function isLeapYear(year) {
    return year % 400 === 0 || (year % 4 ===0 && year % 100 !== 0);
}

/* 
 * @param {type} 需创建的元素
 * @param {props} 接收一个对象，用于添加属性, 可选
 * @param {children} 接收一个对象，用于添加子元素, 可选
*/
function creEle(type, props, children) {
    var node = document.createElement(type);
    var childs = children != null ? [].concat(children) : [];
    function cd(child) {
      if(child instanceof HTMLElement){
        return child;
      }
      return document.createTextNode(String(child));
    }
    for(var key in props){
      node[key] = props[key];
    }

    for(var i = 0; i < childs.length; i++) {
        node.appendChild(cd(childs[i]));
    }
    return node;
}




