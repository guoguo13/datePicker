/*
 * @param {double} 是否显示双日历，默认为true
 * @param {format} 日期格式
 * @param {range} 是否支持选取日期范围，默认为false
 * @param {startDate} 初始可选取日期，此日期之前日期不可选择
 * @return {value} 返回选中值
 */
function DatePicker(node, params) {
    if(typeof node === 'undefined') {
        throw new Error('node is not Element');
    }
    var options = {
        double: true,
        format: 'yyyy-mm-dd',
        range: false,
        startDate: new Date(),
        callback: function() {}
    };
    var el = node;
    var elP = el.parentNode;
    var flagArrow = true;     // true，增加 ;false，减少
    var curDate = getDates(new Date());
    for( var k in params ) {
        options[k] = params[k];
    }

    var createDom = function() {
        var prev = creEle("a", {className:"prev"},"<" ),
            next = creEle("a", {className:"next"},">" ),
            arrow = creEle("div",{className:"arrow"}, [prev,next]);
            dateBox = getCalendar(),
            container = creEle("div", {className:"container"}, [arrow,dateBox]);
            wrapper = creEle("div", {className:"datePicker"}, container);
        return wrapper;
    },


    //判断是否显示双日历 
    getCalendar = function() {
        var double = options.double ? 2: 1;
        var dateBox = creEle("div", {className:"date-box"});
        while(double > 0) {
            var calendar = createCalendar();
            dateBox.appendChild(calendar);
            handleDate(true);
            double--;
        }
        return dateBox;
    },


    handleDate = function(flag) {
        if(flag) {
            if(curDate.month === 12 ) {
                curDate.month = 1;
                curDate.year = curDate.year + 1;
            } else {
                curDate.month++;
            }
        } 
        curDate.monthDays = getDays(curDate.year,curDate.month);
        curDate.startDate = new Date(curDate.year, curDate.month - 1, 1).getDay();
        curDate.endDate = new Date(curDate.year, curDate.month - 1, curDate.monthDays).getDay();
    },

    createCalendar = function () {
        var table = creEle("table"),
            thead = creEle("thead"),
            theadTr = creEle("tr"),
            tbody = createTable(),
            h4 = creEle("h4", {className:"month"}, curDate.year + '年' + curDate.month + '月');
        var week = ["日","一","二","三","四","五","六"], weekHTML = '';
        for(var i = 0; i < week.length; i++) {
            weekHTML += '<td>' + week[i] + '</td>';
        }
        theadTr.innerHTML = weekHTML;
        thead.appendChild(theadTr);
        table = creEle("table", {}, [thead, tbody]);
        return creEle("div", {className:"calendar-item"}, [h4, table]);
    },
    createTable = function() {
        var tbody = creEle("tbody"); 
        var day = 0;
        var rows = parseInt( ( curDate.monthDays + curDate.startDate + (6 - curDate.endDate) ) / 7 );
        for( var i = 0 ; i < rows; i++) {
            var tr = creEle("tr");
            for(var j = 0; j < 7; j++) {
                if((j < curDate.startDate && i < 1) || (j > curDate.endDate && i == rows - 1)) {
                   tr.appendChild(createTd("")); 
                } else {
                    if(day > curDate.monthDays) break;
                    day++;
                    tr.appendChild(createTd(day)); 
                }   
            }
            tbody.appendChild(tr);
        };
        return tbody;
    },
    createTd = function(n) {
        var td = creEle("td");
        var a = creEle("a",{href: "javascript:;"});
        if(n === "") {
            a.textContent = "";
        } else {
            a.textContent = n;
            a.dataset.date = curDate.year + '-' + curDate.month + '-' + n;
            
            a.className = new Date(a.dataset.date) >= new Date(options.startDate) ? "date-item" : "disabled";
        }
        td.appendChild(a);
        return td;
    };
    elP.appendChild(createDom());
    elP.addEventListener('click', function(e){
        var target = e.target;
        //日历前进/后退
        if(target.classList.contains("next")) {
            elP.removeChild(elP.children[1]);
            elP.appendChild(createDom());
        } else if(target.classList.contains("prev")) {
            if(options.double) {
                if(curDate.month <= 4) {
                    curDate.month = curDate.month + 8;
                    curDate.year = curDate.year - 1;
                } else {
                    curDate.month = curDate.month - 4;
                }
            } else {
                if(curDate.month <= 2) {
                    curDate.month = curDate.month + 10;
                    curDate.year = curDate.year - 1;
                } else {
                    curDate.month = curDate.month - 2;
                }
            }
            
            curDate.monthDays = getDays(curDate.year,curDate.month);
            curDate.startDate = new Date(curDate.year, curDate.month - 1, 1).getDay();
            curDate.endDate = new Date(curDate.year, curDate.month - 1, curDate.monthDays).getDay();
            elP.removeChild(elP.children[1]);
            elP.appendChild(createDom());
        }
        if(target.classList.contains("date-item")) {
            var selectedDate = target.dataset.date;
            var dateItems = document.querySelectorAll(".date-item");
            el.value = selectedDate;
            for(var i = 0; i < dateItems.length; i++) {
                dateItems[i].classList.remove("active");
            }
            target.classList.add("active");
        }
    });
};

// 获取指定年的某月份有多少天
function getDays(year,month) {
    switch(month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:  return 31;
        case 2: return isLeapYear(year)? 28: 29;
        case 4 : case 6: case 9: case 11: return 30;
    }
}

// 获取年，月份，月第一天星期
function getDates(day) {
    year = day.getFullYear(),
    month = day.getMonth() + 1,
    date = day.getDate(),
    monthDays = getDays(year,month),
    startDate = new Date(year, month - 1, 1).getDay();
    endDate = new Date(year, month - 1, monthDays).getDay();
    return { year, month, date, startDate, endDate, monthDays };
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

