/*
 * @param {double} 是否显示双日历，默认为true
 * @param {format} 日期格式 支持yyyy/mm/dd和yyyy-mm-dd两种
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
    var startTime = null, endTime = null, isHide = false;
    var curDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    };
    curDate.days =  new Date(curDate.year,curDate.month,0).getDate();
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
        var dateBox = creEle("div", {className:"date-box"});
        var calendar = createCalendar();
        dateBox.appendChild(calendar);
        if(options.double) {
            handleDate();
            dateBox.appendChild(createCalendar());
        }
        return dateBox;
    },
    handleDate = function() {
        if(curDate.month === 12 ) {
            curDate.month = 1;
            curDate.year = curDate.year + 1;
        } else {
            curDate.month++;
        }
        curDate.days = new Date(curDate.year, curDate.month, 0).getDate();
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
        var startDate = new Date(curDate.year, curDate.month - 1, 1).getDay();
        var endDate = new Date(curDate.year, curDate.month - 1, curDate.days).getDay();
        var rows = parseInt( ( curDate.days + startDate + (6 - endDate) ) / 7 );
        for( var i = 0 ; i < rows; i++) {
            var tr = creEle("tr");
            for(var j = 0; j < 7; j++) {
                if((j < curDate.startDate && i < 1) || (j > curDate.endDate && i == rows - 1)) {
                   tr.appendChild(createTd("")); 
                } else {
                    if(day >= curDate.days) break;
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
            var format = options.format;
            a.textContent = n;
            format = format.replace(/yyyy/,curDate.year);
            format = format.replace(/mm/,(curDate.month < 10 ? '0' + parseInt(curDate.month) : curDate.month ));
            format = format.replace(/dd/,(n < 10 ? '0' + parseInt(n) : n ));
            
            a.dataset.date = format;
            a.className = new Date(a.dataset.date) >= new Date(options.startDate) ? "date-item" : "disabled";
            if(new Date(a.dataset.date) >= new Date(startTime) && new Date(a.dataset.date) <= new Date(endTime) || (a.dataset.date == startTime)) {
                a.classList.add("active");
            }
        }
        td.appendChild(a);
        return td;
    },
    // Dom的移除与显示
    handleDom = function(flag) {
        var datePicker = find(elP.children,"datePicker");
        if(datePicker) {
            elP.removeChild(datePicker);
            if(flag) return;
        }
        var dom = createDom();
        dom.style.display = 'block';
        elP.appendChild(dom);
    };
    // isHidden = function() {
    //     if(isHide) {
    //         isHide = false;
    //         handleDom(true);
    //     }
    // };

    el.addEventListener("focus", function() {
        handleDom(false);
    });
    el.addEventListener("blur", function() {
        console.log(isHide);
        if(isHide) {
            isHide = false;
            handleDom(true);
        }
    });
    elP.addEventListener('click', function(e){
        var target = e.target;
        //日历前进/后退
        if(target.classList.contains("next")) {
            handleDate();
            handleDom(false);
        } else if(target.classList.contains("prev")) {
            if(options.double) {
                if(curDate.month <= 2) {
                    curDate.month = curDate.month + 10;
                    curDate.year = curDate.year - 1;
                } else {
                    curDate.month = curDate.month - 3;
                }
            } else {
                if(curDate.month <= 1) {
                    curDate.month = curDate.month + 11;
                    curDate.year = curDate.year - 1;
                } else {
                    curDate.month = curDate.month - 1;
                }
            }
            curDate.days = new Date(curDate.year, curDate.month, 0).getDate();
            handleDom(false);
        }
        // 日期选中
        if(target.classList.contains("date-item")) {
            var dateItems = document.querySelectorAll(".date-item");
            var selectedDate = null;
            if(!options.range) {
                el.value = selectedDate = startTime = target.dataset.date;
                curDate.year = startTime.match(/\d+/g)[0];
                curDate.month = startTime.match(/\d+/g)[1];
                curDate.days =  new Date(curDate.year,curDate.month,0).getDate();
                for(var i = 0; i < dateItems.length; i++) {
                    dateItems[i].classList.remove("active");
                }
                target.classList.add("active");
                handleDom(true);
            } else {
                var curTime = target.dataset.date;
                if(startTime) {
                    if(endTime) {
                        startTime = curTime;
                        endTime = null;
                        for(var i = 0; i < dateItems.length; i++) {
                            dateItems[i].classList.remove("active");
                        }
                        target.classList.add("active");
                    } else {
                        if( new Date(curTime) >= new Date(startTime)) {
                            endTime = curTime;
                        } else {
                            endTime = startTime;
                            startTime = curTime;
                        }
                    }
                } else {
                    startTime = curTime;
                    target.classList.add("active");
                }
                if(startTime && endTime) {
                    for(var i = 0; i < dateItems.length; i++) {
                        var itemDate = dateItems[i].dataset.date;
                        if(new Date(itemDate) >= new Date(startTime) && new Date(itemDate) <= new Date(endTime)) {
                            dateItems[i].classList.add("active");
                        }
                    }
                    curDate.year = endTime.match(/\d+/g)[0];
                    curDate.month = endTime.match(/\d+/g)[1];
                    curDate.days =  new Date(curDate.year,curDate.month,0).getDate();
                    selectedDate = startTime + '~' + endTime;
                    el.value = selectedDate;
                    handleDom(true);
                }
            }
            options.callback(selectedDate);
        }
    });
    window.addEventListener("click",function(e) {
        e.stopPropagation();
        var target = e.target;
        if(!target.classList.contains("next") && !target.classList.contains("prev") && !target.classList.contains("date-item")) {
            if(target != el) {
                isHide = true;
            }
            return; 
         }
    });
    // window.addEventListener("click",function(e) {
    //     e.stopPropagation();
    //     var target = e.target;
    //     if(!target.classList.contains("next") && !target.classList.contains("prev") && !target.classList.contains("date-item")) {
    //         if(target != el) {
    //             isHide = true;
    //         } 
    //      }
    //      isHidden();
    // });

};

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

function find(node,className) {
    for(var i = 0; i < node.length; i++) {
        if(node[i].classList.contains(className)) {
            return node[i];
        }
    }
    return null;
}


