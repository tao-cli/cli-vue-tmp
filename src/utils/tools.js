/***********************
 * @name JS
 * @author Jo.gel
 * @date 2019/3/20 0020
 * @desc 工具函数
 ***********************/
import {
	Message
} from 'view-design';
import {
	isYesterday,
	isToday,
	format,
	startOfYesterday,
	startOfWeek,
	startOfMonth,
	startOfYear,
	endOfMonth,
	endOfYear,
	subDays,
	subWeeks,
	subMonths,
	subYears,
	getTime,
} from 'date-fns';
import _ from 'lodash';



/**
 * @desc xxx-ooo => ooo
 * @return {string} xxx-ooo
 * @return ooo {string}
 * */
export const routerName = (router) => {
	return router.replace(/^.*-/g, '');
};

/**
 * @desc 解析后台路由value值
 * @TO platform:employee->/platform/employee
 * @TO platform:employee:test->/platform/employee
 * */
// export const routerParser = (str) => {
// 	if (!str) return '';
// 	return '/' + str.replace(/(:(.+?):).*$/g, '/$2').replace(':', '/');
// };

/**
 * @desc routerToName
 * @TO platform:employee->platform-employee
 * @TO platform:employee:test->platform-employee
 * */
export const routerToName = (str) => {
	if (!str) return '';
	return str.replace(/(:(.+?):).*$/g, '-$2').replace(':', '-');
};
/**
 * @desc 将后端名称转为面包屑字段
 * @TO platform:employee->platform
 * @TO platform:employee:test->platform-employee
 * */
// export const routerToHo = (str) => {
// 	if (!str) return '';
// 	return str.replace(/:/i, '-').replace(/:.*$/, '');
// };

/*
 * @desc 时间戳转换工具
 * */
export const dateParser = (time, str) => {
	return format(Number(time), str || 'YYYY-MM-DD HH:mm:ss');
};

/**
 * @desc 密码校验工具
 * @str 8-16位
 * */
export const isPassword = (str,) => {
	return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(str);
};

/**
 * @desc 校验是否是合法手机
 * */
export const isPhone = (str) => {
	return !!/^1[3|4|5|6|7|8|9|]\d{9}$/.test(str);
};
/**
 * @desc 校验允许 中文、字母(大小写)、数字
 * @符合 true ，不符合 false
 * @str {String}
 * */
// export const isChineseAlphabetNumber = (str) => {
// 	return /^[a-zA-z0-9\u4e00-\u9fa5]+$/g.test(str);
// };

/**
 * @desc 格式化数字
 * */
export const formatNumber = (number, decimals = 2, dec_point = '.', thousands_sep = ',') => {
	/*
3     * 参数说明：
4     * number：要格式化的数字
5     * decimals：保留几位小数
6     * dec_point：小数点符号
7     * thousands_sep：千分位符号
8     * */
	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	// 解决小于1时数据错误问题
	if (number < 1000) {
		return Number(number).toFixed(decimals);
	}
	
	var n = !isFinite(+number) ? 0 : +number,
		pre = !isFinite(+decimals) ? 0 : Math.abs(decimals),
		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
		s = '',
		toFixedFix = function (n, prec) {
			var k = Math.pow(10, prec);
			return '' + Math.ceil(n * k) / k;
		};
	
	s = (pre ? toFixedFix(n, pre) : '' + Math.round(n)).split('.');
	var re = /(-?\d+)(\d{3})/;
	while (re.test(s[0])) {
		s[0] = s[0].replace(re, "$1" + sep + "$2");
	}
	
	if ((s[1] || '').length < pre) {
		s[1] = s[1] || '';
		s[1] += new Array(pre - s[1].length + 1).join('0');
	}
	return s.join(dec);
};

function _dateFn(date) {
	return format(date, 'YYYY-MM-DD');
}

/*
 * @desc 时间转 时间戳
 * @date 时间
 * @key 时间分隔符
 * */
export const timeToTimeStamp = (date, key) => {
	var timestamp = 0;
	if (typeof date != 'object') {
		if (date.length == 8) {
			date = '2019-07-24 ' + date;
		}
		date = date.substring(0, 19);
		date = date.replace(/-/g, key);
		timestamp = new Date(date).getTime();
		return timestamp;
	} else {
		timestamp = new Date(date).getTime();
		return timestamp;
	}
};

/**
 * @desc 时间转换工具
 * */
export const _date = {
	// 昨天
	yesterday: () => {
		return [_dateFn(startOfYesterday()), _dateFn(startOfYesterday())];
	},
	// 今天
	today: () => {
		return [_dateFn(new Date()), _dateFn(new Date())];
	},
	// 上周
	lastWeek: () => {
		const thisWeekStart = startOfWeek(new Date(), {weekStartsOn: 1});
		const lastWeekStart = subWeeks(thisWeekStart, 1);
		const lastWeekEnd = subDays(thisWeekStart, 1);
		return [_dateFn(lastWeekStart), _dateFn(lastWeekEnd)];
	},
	// 本周
	thisWeek: () => {
		const thisWeekStart = startOfWeek(new Date(), {weekStartsOn: 1});
		return [_dateFn(thisWeekStart), _dateFn(new Date())];
	},
	// 上月
	lastMonth: () => {
		const thisMonthStart = startOfMonth(new Date());
		const lastMonthStart = subMonths(thisMonthStart, 1);
		const lastMonthEnd = endOfMonth(lastMonthStart);
		return [_dateFn(lastMonthStart), _dateFn(lastMonthEnd)];
	},
	// 本月
	thisMonth: () => {
		const thisMonthStart = startOfMonth(new Date());
		return [_dateFn(thisMonthStart), _dateFn(new Date())];
	},
	// 去年
	lastYear: () => {
		const thisYearStart = startOfYear(new Date());
		const lastYearStart = subYears(thisYearStart, 1);
		const lastYearEnd = endOfYear(lastYearStart);
		return [_dateFn(lastYearStart), _dateFn(lastYearEnd)];
	},
	// 本年
	thisYear: () => {
		const thisYearStart = startOfYear(new Date());
		return [_dateFn(thisYearStart), _dateFn(new Date())];
	},
	//过去几天
	lastWhatDay: (num) => {
		const whatDayStart = subDays(new Date(), num);
		return [_dateFn(whatDayStart), _dateFn(new Date())];
	}
	
};
/**
 * @desc 判断增加的天数是否比今天还小
 * @return boolean
 * @今天小于活动时间，则返回false
 * */
export const checkSomeDay = (day, time, hour) => {
	
	const startDay = subDays((new Date(time)), day); //得到减去的时间点  18日
	const startDaySecond = (new Date(startDay)).valueOf();
	const theHour = hour.replace(/:.+$/, '');
	const theHourSecond = theHour * 60 * 60 * 1000; //小时的毫秒数
	const todaySecond = (new Date()).valueOf(); //现在的毫秒数
	return todaySecond > startDaySecond + theHourSecond;
};

/**
 * @desc 比较天数
 * @return number
 * */
export const diffDay = (timestamp) => {
	if (!timestamp) {
		return 0;
	}
	const today = getTime(new Date());
	return timestamp - today;
};

/**
 * @rule 校验 [{xx},{logic,subRules:{}}]
 * @desc 规则检查
 * */
export const isNoValueLevel = (arr) => {
	let obj = {
		A: [],
		B: [],
		C: []
	};
	for (let items of arr) {
		//A级检查
		if (!items.subRules && !items.subRules) {
			if (!items.value) obj.A.push('A_value');
			if (!items.operator) obj.A.push('A_operator');
			if (items.isThird && !items.thirdValue) obj.A.push('A_thirdValue'); // 支持第二级下校验第三级
			if (items.isTimeRange && !items.tempTime) obj.A.push('A_isTimeRange'); // 是否支持时间域
			if (items.isTimeRange && !items.timeRange) obj.A.push('A_timeRang');
			if (items.isTimeRange && items.timeRange && !(items.timeRange.value.trim())) obj.A.push('A_timeRange_value');
			
		}
		// B级检查
		if (items.logic && items.subRules && items.subRules.length) {
			for (let item of items.subRules) {
				if (!item.value && !item.subRules) obj.B.push('B_value');
				if (item.isThird && !item.thirdValue) obj.B.push('B_thirdValue');
				if (!item.operator && !item.subRules) obj.B.push('B_operator');
				if (item.isTimeRange && !item.tempTime && !item.subRules) obj.B.push('B_isTimeRange');
				if (item.isTimeRange && !item.tempTime && !item.subRules && item.timeRange) obj.B.push('B_timeRange');
				if (item.isTimeRange && !item.tempTime && !item.subRules && !(item.timeRange.value).trim()) obj.B.push('B_timeRange_value');
				
				// C级检查
				if (item.subRules) {
					for (let ite of item.subRules) {
						if (!ite.value) obj.C.push('C_value');
						if (ite.isThird && ite.thirdValue) obj.C.push('C_thirdValue');
						if (!ite.operator) obj.C.push('C_operator');
						if (ite.isTimeRange && !ite.tempTime) obj.C.push('C_isTimeRange');
						if (ite.isTimeRange && !ite.tempTime && !ite.timeRange) obj.C.push('C_timeRange');
						if (ite.isTimeRange && !ite.tempTime && ite.timeRange && !(ite.timeRange.value).trim()) obj.C.push('C_timeRange_value');
					}
				}
			}
		}
	}
	// console.info(obj);
	return !!(obj['A'].length || obj['B'].length || obj['C'].length);
};

/**
 * @desc 深拷贝
 * */

export const deepCopy = (src, obj) => {
	obj = obj || {};
	for (let i in src) {
		if (typeof src[i] === "object") {
			obj[i] = (src[i].constructor === Array) ? [] : {};
			deepCopy(src[i], obj[i]);
		} else {
			obj[i] = src[i];
		}
	}
	return obj;
};

/**
 * @desc 根据key 渲染时间格式，默认
 * */
export const renderTime = (h, params) => {
	return h('span', params.row[params.column.key] ? dateParser(params.row[params.column.key]) : '');
};

/**
 * @desc 回显以万，亿处理的数据
 * @params
 * 	number：数据值
 * 	unit：数值单位（元，人）
 *  digit:保留小数位，默认2位
 * @return {num:Number,unit:String}
 */
export const unitNumber = ({number, unit, digit = 2}) => {
	let cNum = 0;
	if (number < 10000) {
		return {number: (number * 1).toFixed(0), unit}; // 万以下直接回显
	} else if (number < 100000000) {
		cNum = (number / 10000).toFixed(digit);
		return {number: cNum * 1, unit: '万' + unit}; // 亿以下除以10000回显
	} else {
		cNum = (number / 100000000).toFixed(digit);
		return {number: cNum * 1, unit: '亿' + unit
		}; // 亿以上除以100000000回显
	}
};

/**
 * @desc 检测上传图片宽高
 * @params
 * 	file：文件
 * 	width：需检测的图片宽度
 *  height: 需检测的图片高度
 * @return Promise 检测通过返回resolve  失败返回reject
 */
export const checkImageWH = (file, width, height) => {
	return new Promise(function (resolve, reject) {
		let filereader = new FileReader();
		filereader.onload = e => {
			let src = e.target.result;
			const image = new Image();
			image.onload = function () {
				if (this.width != width || this.height != height) {
					Message.error("请上传宽高为" + width + "*" + height + "尺寸的图片");
					reject();
				} else {
					resolve();
				}
			};
			image.onerror = reject;
			image.src = src;
		};
		filereader.readAsDataURL(file);
	});
};
/**
 * @desc 图片上传
 * @params
 * 	id：容器id
 * 	name: 下载后的图片名称
 * @return 直接开启浏览器下载
 */
export const saveImage = (id, name) => {
	var oCode = document.querySelector(id);
	if (oCode) {
		var url = oCode.src || oCode.children[0].toDataURL("image/jpeg");
		var a = document.createElement('a');
		var event = new MouseEvent('click');
		// 下载图名字
		a.download = name;
		a.href = url;
		// 合成函数，执行下载
		a.dispatchEvent(event);
	}
};

/**
 * @desc 打印输出
 * @return void
 *
 */
export const log = console.log.bind(console);

/**
 * @desc 过滤手机号
 * @return {string} 12345678910 => 123****8910
 *
 */
export const filterPhone = (no) => {
	if (!no) return '';
	return (no + '').replace(/(\w{3})\w{4}(\w{4})/, '$1****$2');
};

/**
 * 选择时间间隔 日期间隔
 * @param time {String}, [oneWeek, oneMonth, threeMonth, halfYear, oneYear]
 * @param formatStr
 * @returns []
 */
export const createRangeTime = (time = 'oneMonth', formatStr = 'YYYY-MM-DD HH:mm:ss') => {
	const nowTime = format(new Date(), formatStr);
	let dateRange = {
		oneWeek: () => {
			let weekAgo = format(subWeeks(new Date(), 1))
			return [weekAgo, nowTime]
		},
		oneMonth: () => {
			let monthStart = startOfMonth(new Date())
			return [format(monthStart, formatStr), nowTime]
		},
		threeMonth: () => {
			const currentStart = startOfMonth(new Date())
			const monthStart = subMonths(currentStart, 2)
			return [format(monthStart, formatStr), nowTime]
		},
		halfYear: () => {
			const currentStart = startOfMonth(new Date())
			const monthStart = subMonths(currentStart, 5)
			return [format(monthStart, formatStr), nowTime]
		},
		oneYear: () => {
			const currentStart = startOfMonth(new Date())
			const monthStart = subMonths(currentStart, 11)
			return [format(monthStart, formatStr), nowTime]
		},
	}

	let fn = dateRange[time]
	if (fn) {
		let pack = fn()
		return pack
	} else {
		return ['', '']
	}
};

/**
 * 找出列表的中指定项的 label
 * @param list
 * @param itemValue
 * @returns {string}
 */
export const findListLabel = (list, itemValue) => {
	let item = _.find(list, {value: itemValue});
	let label = '';
	if (item !== undefined) {label = item.label;}
	return label;
};

/**
 * 判断时间戳是否为昨天
 * @param d 毫秒
 * @returns {boolean}
 */
export const _isYesterday = (d) => {
	return isYesterday(new Date(d))
};

/**
 * 判断时间戳是否为今天
 * @param d 毫秒
 * @returns {boolean}
 */
export const _isToday = (d) => {
	return isToday(new Date(d))
};

/**
 * 提取出数组的对应项
 */
export const extractListValue = (list, key) => {
	let tempList = []
	list.forEach(item => {
		tempList.push(item[key])
	})
	return tempList
}

/**
 * 显示千分符
 * @param num
 * @returns {string}
 */
export const toThousand = (num) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 校验 URL 格式
 * @param {String} url 
 */
export const checkUrl = (url)=>{
	// eslint-disable-next-line no-useless-escape
	var RegUrl = new RegExp("(https?|ftp|http)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]"); 
	// RegUrl.compile("^[A-Za-z]+://[A-Za-z0-9-_]+\\.[A-Za-z0-9-_%&\?\/.=]+$"); 
	if (!RegUrl.test(url)) { 
		return false; 
	} 
	return true; 
}

/**
 * 获取出生日期、性别和年龄
 * @param cardId 身份证号码
 * @param type 1 出生日期
 *            2 获取性别
 *            3 获取年龄,年龄小于1岁的时候默认为1岁
 * @returns {*}
 * @constructor
 */
export const getIdentityInfo = (cardId, type) => {
	if(type === 1){
		//获取出生日期
		let birth=cardId.substring(6, 10) + "-" + cardId.substring(10, 12) + "-" + cardId.substring(12, 14);
		return birth
	}

	if(type === 2){
		//获取性别
		if (parseInt(cardId.substr(16, 1)) % 2 === 1) {
			//男
			return "M";
		} else {
			//女
			return "F";
		}
	}

	if(type === 3){
		//获取年龄
		let myDate = new Date();
		let month = myDate.getMonth() + 1;
		let day = myDate.getDate();
		let age = myDate.getFullYear() -   cardId.substring(6, 10) - 1;
		if (cardId.substring(10, 12) < month || cardId.substring(10, 12) === month && cardId.substring(12, 14) <= day) {
			age++;
		}

		if(age <= 0){
			age = 1;
		}
		return age;
	}
}
