JSON._parse = JSON.parse;
JSON.parse = function() {
	var gp = this._parse.apply(this, arguments),
	findrefs = function(obj) {
		var keys = Object.keys(obj);
		keys.forEach(function(key) {
			if(typeof obj[key] === 'string' && obj[key].substr(0, 5) === 'jref:') {
				var ref = obj[key].split(':')[1].replace('this', 'gp'),
					val = eval(ref);
				if(typeof val === 'object') {
					obj[key] = val;
				}
				else {
					obj.__defineGetter__(key, eval('(function() { return ' + ref + '; })'));
					obj.__defineSetter__(key, eval('(function(val) { return ' + ref + ' = val; })'));
				}
			}
			else if(typeof obj[key] === 'object') {
				findrefs(obj[key]);
			}
		});
	}
	findrefs(gp);
	return gp;
}

JSON._stringify = JSON.stringify;
JSON.stringify = function(obj) {
	var gp = obj,
		dictionary = [
			{obj: gp, path: 'this', refs_to: []}
		],
		findrefs = function(obj, path) {
			var keys = Object.keys(obj),
				tmp;
			keys.forEach(function(key) {
				if(typeof obj[key] === 'object') {
					var registred = false;
					dictionary.every(function(dict) {
						if(obj[key] === dict.obj) {
							dict.refs_to.push(path+'.'+key);
							if((path+'.'+key).split('.').length < dict.path.split('.').length) {
								dict.refs_to.push(dict.path);
								dict.path = path+'.'+key;
							}
							registred = true;
							return false;
						}
						return true;
					});
					if(registred === false) {
						dictionary.push({
							obj: obj[key],
							path: path+'.'+key,
							refs_to: []
						});
						if(typeof obj[key] === 'object') {
							findrefs(obj[key], path+'.'+key);
						}
					}
				}
				else {
					if(obj.__lookupGetter__(key)) {
						tmp = obj.__lookupGetter__(key).toString().split('return ')[1].split(';')[0].replace('gp.', 'this.');
						delete obj[key];
						obj[key] = 'jref:'+tmp;
					}
				}
			});
		};
	findrefs(gp, 'this');
	
	dictionary.forEach(function(dict) {
		dict.refs_to.forEach(function(ref) {
			eval('gp.' + ref.substr(ref.indexOf('.') + 1) + '=\'jref:' + dict.path + '\'');
		});
	});
	return this._stringify.call(this, gp);
}
