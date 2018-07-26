;(function() {
	"use strict";
	var root;
	if(this.exports) {
		root = this.exports;
	}
	else {
		root = this.JREF = {};
	}
	root.parse = function(str) {
		var pointers = [];
		var tmp = JSON.parse(str, function(key, val) {
			if(typeof val === 'string' && val.substr(0, 7) === '__jref:') {
				pointers.push({obj: this, key: key, ref: val.substr(7).split('.')});
			}
			return val;
		});

		pointers.forEach(pointer => pointer.obj[pointer.key] = [tmp].concat(pointer.ref.slice(1)).reduce((carry, item) => carry[item]));
		
		return tmp;
	}
	root.unRef = function(obj) {
		var result = obj.constructor();
		var work = [
			{
				path: [],
				obj: obj,
				res: result
			}
		];
		
		for(var i = 0; i < work.length; i++) {
			Object.keys(work[i].obj).forEach(key => {
				if(typeof work[i].obj[key] === 'object' && work[i].obj[key] !== null) {
					if(!work[i].res[key]) {
						work[i].res[key] = work[i].obj[key].constructor();
					}
					let workItem = {
						path: work[i].path.concat(key),
						obj: work[i].obj[key],
						res: work[i].res[key]
					};
					let registered = work.filter(entry => entry.obj === workItem.obj);
					if(registered.length === 0) {
						work.push(workItem);
					}
					else {
						work[i].res[key] = '__jref:' + ['this'].concat(registered[0].path).join('.');
					}
				}
				else {
					work[i].res[key] = work[i].obj[key];
				}
			});
		}
		return result;
	}
	root.stringify = function(obj) {
		return JSON.stringify(this.unRef(obj));
	}

	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	function isInteger(n) {
		return isNumeric(n) && Number.isInteger(parseFloat(n));
	}
}).call(typeof module !== 'undefined' && module.exports ? module : this);