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
    for( var k in options ) {
        this.options[k] = options[k];
    }
    this.startDate = getDate(new Date(this.options.startDate));

    var createDom = function() {
        var wrapper = cDom("div","dataPicker"),
            container = cDom("div","container"),
            arrow = cDom("div","arrow"),
            prev = cDom("a","prev"),
            next = cDom("a","next"),
            dateBox = cDom("div","data-box");
        arrow.appendChild(prev);
        arrow.appendChild(next);
        container.appendChild(arrow);
    },
    createTable = function () {
        var table = cDom("table"),
            thead = cDom("thead"),
            theadTr = cDom("tr"); 
        var week = ["日","一","二","三","四","五","六"];
        var html = "";
        for(var i = 0; i < week.length; i++) {
            html += '<td>' + week[i] + '</td>';
        }
        theadTr.appendChild(html);
        thead.appendChild(theadTr);
        table.appendChild(thead);
    },
    creatTd = function() {
        var tbody = cDom("tbody"); 
        
        var curDate = getDate(new Date());


    }
};


// 获取指定年的某月份有多少天
function getDays(year,month) {
    switch(month) {
        case 1,3,5,7,8,10,12: return 31; break;
        case 2: return isLeapYear(year)? 28: 29; break;
        case 4,6,9,11: return 30; break;
    }
}

// 获取年，月份，月第一天星期
function getDate(day) {
    var startDate = day,
    year = startDate.getFullYear(),
    month = startDate.getMonth() + 1,
    monthDays = getDays(year,month),
    week = new Date(curYear, curMonth - 1, 1).getDay();
    return { year, month, week, monthDays };
}

// 判断当前年是否为闰年
function isLeapYear(year) {
    return year % 400 === 0 || (year % 4 ===0 && year % 100 !== 0);
}

// createDom addCLass
function cDom (node, className = "") {
    var el  =  document.createElement(node);
    if(className) {
        el.classList.add(className);
    }
    return el;
}




