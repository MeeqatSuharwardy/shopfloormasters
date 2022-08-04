//Copyright Wordcraft International Ltd. 2019

//Functions
function def(a,b,i){return b===undefined?a!=undefined:b===1?a!==undefined:b===null?a===b:i?a instanceof b:def(a)&&a.constructor==b};function are(a,b,i){return a.every(function(a){return def(a,b,i)})};function any(a,b,i){return a.some(function(a){return def(a,b,i)})};function is(a,b,i){return b&&b.some(function(b){return def(a,b,i)})};
function convert(f,t,s,r){r=t===Array?!def(f)?[]:def(f,Array)?f:s||is(f,[NodeList,HTMLCollection,NamedNodeMap],1)?[].slice.call(f):[f]:t===String?!def(f)?'':def(f,String)?f:JSON.stringify(f).replace(/^"|"$/g,''):t===Number?new Number(f):t===Object&&def(f,Date)?{time:f.getTime(),date:f.getDate(),day:f.getDay(),month:f.getMonth(),year:f.getFullYear(),hours:f.getHours(),minutes:f.getMinutes(),seconds:f.getSeconds()}:r;if(!def(r)){try{r=JSON.parse(f)}catch(e){}};if(t==Number&&s&&isNaN(r)){r=NaN};return def(r,1)?r:f||null};
function extend(o,n,v){Object.defineProperty(o.prototype,n,{value:v,writable:true})};
function delay(f,d,c){return setTimeout(function(){f.call(c)},d)};
function every(t,f,o){var o=o||{},s=Date.now(),e=s+(o.for||-s),i=setInterval(function(){var n=Date.now();f.call(o.this||this,{interval:i,elapsed:n-s}.add(o.params));e&&n>=e?clearInterval(i):0},t);return i};
function parseHTML(s,d,f,w){d=document,f=d.createDocumentFragment(),w=d.createElement('div');f.appendChild(w);w.insertAdjacentHTML('afterbegin',s);return w.children};
function find(q,p,o){p=p||document;return convert(q.trim?o?p.querySelector(q):q.match(/^#[^,\s:>[.#]+$/)?p.getElementById(q.slice(1)):q.match(/^\.[^,\s:>[.#]+$/)?p.getElementsByClassName(q.slice(1)):q.match(/^[^,\s:>[.#]+$/)?p.getElementsByTagName(q):p.querySelectorAll(q):q,Array)};
function ajax(t,u,d,c,p,g,b,o,x){if(def(t,Object)){o=t;t=o.type;u=o.url;d=o.data;c=o.complete;p=o.progress};t=t.toUpperCase();d=d||{};g=t=='GET';!o||!o.cache?d.add('t',Date.now()):0;x=new XMLHttpRequest();x.onreadystatechange=function(){var data={};try{data=JSON.parse(x.responseText)||{}}catch(ex){};x.readyState==4?c.call(x,x,data):0};x.open(t,g?u+'?'+urlParams(d):u);x.setRequestHeader('X-Requested-With','XMLHttpRequest');if(p){b=new FormData();d.each(function(k,v){b.append(k,v)});x.upload.onprogress=p}else if(!g){b=urlParams(d);x.setRequestHeader('Content-Type','application/x-www-form-urlencoded')};x.send(b)};
function urlParams(o,r){var r=o?'':{},o=o?o.each(function(k,v){def(v)?r+='&'+encodeURI(k)+'='+encodeURIComponent(convert(v,String)):0}):location.href.split(/[?&#]/).each(function(p){p=p.split('=');p[1]?r.add(decodeURI(p[0]),decodeURIComponent(p[1]),true):0});return r.trim?r.slice(1):r};
function match(a,b,e){return (a===b)||(are([a,b])&&((a.valueOf()==b.valueOf())||(def(b,Function)&&def(a,b))||(def(b,String)&&def(a,Element,1)&&(a.matches||a.msMatchesSelector||a.webkitMatchesSelector||a.mozMatchesSelector).call(a,b))||(b.exec&&new RegExp(b).exec(a))||(is(b,[Object,Array])&&Object.keys(b).every(function(k){var d=b[k],s=k.trim?k.split('$'):[k],c=a[s[0]],o=s[1];
	return o?o=='lt'?c<d:o=='lte'?c<=d:o=='gt'?c>d:o=='gte'?c>=d:o=='not'?!match(c,d):o=='in'?d.has(c):0:match(c,d);
})&&(!e||match(b,a)))))};

//Object
extend(Object,'each',function(f,c){return Object.keys(this).each(function(k){return f.call(c,k,this[k])},this)});
extend(Object,'clone',function(){return {}.add(this)});
extend(Object,'has',function(k){return this.hasOwnProperty(k)});
extend(Object,'add',function(n,v,o,t,a,b){t=this;if(n){if(n.trim){b={};b[n]=v}else{b=n;o=v};b.each(function(k,b){a=t[k];o||!def(a,1)?t[k]=b:o!=0?are([a,b],Object)?a.add(b):are([a,b],Array)?a.add(b,1):0:0})};return t});
extend(Object,'remove',function(a){convert(a,Array).each(function(k){delete this[k]},this);return this});

//Array
extend(Array,'each',function(f,c,r){this.every(function(v){r=f.apply(c||v,arguments);return def(r)?r:true});return this});
extend(Array,'clone',function(){return this.slice()});
extend(Array,'has',function(v,x){return x?this.indexOf(v)>=0:this.some(function(e){return match(e,v)})});
extend(Array,'add',function(v,u,t){t=this;convert(v,Array).each(function(v){!u||!t.has(v)?t.push(v):0});return t});
extend(Array,'remove',function(v,e,t){t=this;convert(v,Array).each(function(b){t.hcae(function(a,i){match(a,b,e)?t.splice(i,1):0})});return t});
extend(Array,'hcae',function(f,i){for(i=this.length-1;i>=0;i--){if(match(f.call(this,this[i],i),false)){break}}});
Array.prototype._find=Array.prototype.find;extend(Array,'find',function(q,l,m,a){m=l<0?'hcae':'each',a=[];this[m](function(v){if(match(v,q)){a.push(v);if(def(l,Number)){l+=l<0?1:-1;return l==0?l:1}}});return a});
extend(Array,'first',function(q,l,a){l=l||q;l=def(l,Number)?l:1;a=def(q)&&!def(q,Number)?this.find(q,l):this.slice(l>0?0:l,l>0?l:undefined);return a.length>1?a:a[0]});
extend(Array,'last',function(q,l){l=l||q;l=-(def(l,Number)?l:1);return this.first(q,l)});
extend(Array,'get',function(i,t){t=this;return(t.index||t)[i>=0?i:t.length+i]});
extend(Array,'indexBy',function(n,i,v){i={};this.each(function(o){v=o[n];i[v]=o});return this.index=i});
extend(Array,'groupBy',function(n,g,v){g={};this.each(function(o){v=o[n];g[v]=g[v]||[];g[v].push(o)});return this.groups=g});
extend(Array,'sortBy',function(n,d,c){return this.sort(function(a,b){a=c?convert(a[n]):a[n];b=c?convert(b[n]):b[n];if(are([a,b],String)){a=a.toLowerCase();b=b.toLowerCase()};return a<b?-1:a>b?1:0})});
extend(Array,'delay',function(f,d,o,t,i){o=o||{};t=t||this;i=i||0;c=o.context||t;t.timeout=i<t.length?delay(function(){f.call(c,t[i],i,t,o);i++;if(t.timeout){t.delay(f,d,o,t,i)}},i?d:0,c):o.done?o.done.call(c,o):0;return function(){clearTimeout(t.timeout);t.timeout=null}});
extend(Array,'uniq',function(t){t=this;t.hcae(function(v,i){t.indexOf(v)!=i?t.splice(i,1):0});return t});
extend(Array,'compact',function(t){t=this;t.hcae(function(v,i){def(v)?0:t.splice(i,1)});return t});

//Strings
extend(String,'each',function(f,c){convert(this,Array,1).each(f,c);return this});
extend(String,'has',function(v){return v?this[v.trim?'indexOf':'search'](v)>=0:!1});
extend(String,'remove',function(v){return v?this.replace(v.trim?RegExp(v,'g'):v,''):this});
extend(String,'squeeze',function(s){s=s||' ';return this.replace(new RegExp(s+'+','g'),s).trim()});
extend(String,'titleize',function(){return this.split(/\s+/).map(function(w){return (w[0]||'').toUpperCase()+w.slice(1).toLowerCase()}).join(' ')});

//Number
extend(Number,'to',function(v,m){var s=def(v,String)?v.split(/\D/):'',t=s[0]||v,p=Math.pow(10,t),r=(Math[m||'round']((this*p))/p);return s?new Array(s[1]?(s[0]-(Math.ceil(Math.log(r+1)/Math.LN10)||1))+1:0).join('0')+r.toFixed(s.last()):r});
extend(Number,'nearest',function(v,m){var n=this/v;/*if(v<0.1){n=Math.round(n)};*/n=Math[m||'round'](n)*v;return v<1?parseFloat(n.toFixed(v.decimals())):n});
extend(Number,'fractional',function(){return Math.abs(Math.round(this)-this)>1e-10});
extend(Number,'decimals',function(){let n=+this,count=0;while ((n * (10 ** count)).fractional() && isFinite(10 ** count)){count++};return count});

//Date
extend(Date,'clone',function(c){return c?new Date(this.getFullYear(),this.getMonth(),this.getDate()):new Date(this.getTime())});
extend(Date,'add',function(v,m){m=(m||'date').titleize();this['set'+m](this['get'+m]()+v);return this});
extend(Date,'remove',function(v,m){return this.add(-v,m)});
extend(Date,'getWeek',function(){
	var target  = new Date(this.valueOf());
    var dayNr   = (this.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    var firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() != 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target) / 604800000);
});

//e
function e(q,a){if(this==window){return new e(q)};a=def(q,String)?q[0]=='<'?parseHTML(q):find(q):q;Array.prototype.add.call(this,a,1)};e.prototype=[];e.add({data:{},callbacks:{},eid:0});
function on(a,s,f,i,c,p){if(!f){f=s;s=undefined};f.s=s;c=e.callbacks;(a.pop?a:[a]).each(function(n){n=n.split('.');i=n[1]=='before';n=n[0];if(!c[n]){addEventListener(n,function(v,t){t=v.target;p={};c[v.type].each(function(c){if(c.s?def(c.s,Array)?c.s.has(t):match(t,c.s):1){return c.call(t,v,p)}})},true)};c[n]=c[n]||[];i?c[n].splice(0,0,f):c[n].push(f)})};
function once(a,s,f,w,r){if(!f){f=s;s=undefined};w=function(){r=f.apply(this,arguments);(a.pop?a:[a]).each(function(n){e.callbacks[n.split('.')[0]].remove(w)});return r};on.call(this,a,s,w)};
extend(e,'clone',function(){return e(this[0].cloneNode(true))});
extend(e,'find',function(q,x,l,m,a){l=l||x,m=l<0?'hcae':'each',a=[];this[m](function(d){!l?a.add(find(q,d)):convert(d.children,Array)[m](function(c){if(!match(c,x)){if(match(c,q)){a.add(c);if(def(l,Number)){l+=l<0?1:-1;return l==0?l:1}}else{var a2=e(c).find(q,l);a.add(a2);if(def(l,Number)){l+=l<0?a2.length:-a2.length;return l==0?l:1}}}});return l==0?l:1});return e(a)});    
extend(e,'first',function(q,x,l){l=l||x||q;l=def(l,Number)?l:1;return !def(q)||def(q,Number)?e(Array.prototype.first.call(this,q,l)):this.find(q,x,l)});
extend(e,'last',function(q,x,l){l=l||x||q;l=-(def(l,Number)?l:1);return this.first(q,x,l)});
extend(e,'add',function(c,s,m,p,n,f){m=s=='before'?1:s=='after'?2:s=='start'?3:0;this.each(function(d,i){convert(c,Array).each(function(c){c=i>0&&!c.trim?c.cloneNode(true):c;p=d.parentNode;n=d.nextElementSibling;f=d.firstElementChild;c.trim?d.insertAdjacentHTML(m==1?'beforeBegin':m==2?'afterEnd':m==3?'afterBegin':'beforeEnd',c):m==1?p.insertBefore(c,d):m==2?n?p.insertBefore(c,n):p.appendChild(c):m==3?f?d.insertBefore(c,f):d.appendChild(c):d.appendChild(c)})});return this});
extend(e,'remove',function(q){q?Array.prototype.remove.call(this,q):this.each(function(d){var p=d.parentNode;p?p.removeChild(d):0});return this});
extend(e,'filter',function(q){return e(Array.prototype.filter.call(this,function(d){return match(d,q)}))});
extend(e,'attr',function(n,v,s,r){s=def(v,1);(s?this:convert(this[0],Array)).each(function(d){return r=n?convert(d[(s?v?'set':'remove':'get')+'Attribute'](n,v)):convert(d.attributes,Array)});return s?this:r});
extend(e,'data',function(n,v,s,r,p,o){s=def(v,1),p='eid',o=e.data;(s?this:convert(this[0],Array)).each(function(d){d[p]=d[p]||++e[p];o[d[p]]=o[d[p]]||{};return r=s?o[d[p]].add(n,v,1):n?o[d[p]][n]||null:o[d[p]]});return s?this:r});
extend(e,'class',function(n,v,s,r,c,h,p,x){p=def(n);s=def(v);x=p?new RegExp('^'+n+'$|^'+n+'\\s|\\s'+n+'\\s|\\s'+n+'$'):0;(p?this:convert(this[0],Array)).each(function(d){c=d.className;h=c.has(x);return p?s?h?v!=1?(d.className=c.replace(x,' ').squeeze())||1:1:v>0?(d.className=(c+' '+n).squeeze())||1:1:r=h:r=c});return def(r)?r:this});
extend(e,'css',function(n,v,r){(def(v)?this:convert(this[0],Array)).each(function(d){def(v)?d.style[n]=v:r=getComputedStyle(d)[n]});return r||this})
extend(e,'val',function(v,p,s,r){s=def(v,1);r=this[s?'set':'get'](null,v,p);return !s?r:this});
extend(e,'is',function(q){return this.some(function(d){return match(d,q)})});
extend(e,'index',function(){return this.siblings(1).indexOf(this[0])});
extend(e,'parent',function(q,a,p){a=[];this.each(function(d){p=d.parentNode;!q||match(p,q)?a.push(p):0});return e(a)});
extend(e,'children',function(q,a){a=[];this.each(function(d){convert(d.children,Array).each(function(c){!q||match(c,q)?a.push(c):0})});return e(a)});
extend(e,'siblings',function(q,s,a){a=[];this.each(function(d){convert(d.parentNode.children,Array).each(function(c){((q==1)||(!q&&c!=d)||(match(c,q)&&(s||c!=d)))?a.push(c):0})});return e(a)});
extend(e,'next',function(s,a){s=!def(s)?1:s;a=[];this.each(function(d,n){do{n=(n||d).nextElementSibling}while((s.trim?match(n,s):--s>=0)?a.add(n):0)});return e(s.trim?a[0]:a)});
extend(e,'prev',function(s,a){s=!def(s)?1:s;a=[];this.each(function(d,p){do{p=(p||d).previousElementSibling}while((s.trim?match(p,s):--s>=0)?a.add(p):0)});return e(s.trim?a[0]:a)});
extend(e,'closest',function(q,a,p){a=[];this.each(function(d){match(d,q)?a.push(d):d.parentNode?a.add(e(d.parentNode).closest(q)):0});return e(a)});
extend(e,'clear',function(){this.each(function(d,c){while(c=d.lastChild){d.removeChild(c)}});return this});
extend(e,'replaceWith',function(r){if(def(r,String)){r=parseHTML(r)[0]};this.each(function(d,i){d.parentNode.replaceChild(i>0?r.cloneNode(true):r,d)});return this});
extend(e,'trigger',function(a,b){this.forEach(function(x){e.trigger(a,x,b)});return this});
['submit','click','focus','blur'].each(function(f){extend(e,f,function(v){this.each(function(d){v?e(d).trigger(f,v):d[f]()});return this})});
['get','set','show','hide'].each(function(f){extend(e,f,function(n,v,o,p){o=f=='set'?(o||{}).add({value:v}):v||{};def(n,Object)?o.add(n):o[f]=n;(f=='get'?[this[0]]:this).each(function(d){p=o.clone();e.callbacks[f].each(function(c,r){r=(def(c.s,Array)?c.s.has(d):match(d,c.s))?c.call(d,p):true;return def(r)?r:true})});return f=='get'?p.value:this});e.callbacks[f]=[]});

//Explicit Values
on('get','[data-value]',function(p){if(p.get){return};p.value=convert(this.getAttribute('data-value'));p.handled=true});
on('set','[data-value]',function(p){if(p.set){return};this.setAttribute('data-value',convert(p.value,String));p.handled=true});

//Default Values
on('get','[data-default]',function(p){if(p.get!='default'){return};p.value=convert(this.getAttribute('data-default'));p.handled=true});
on('set','[data-default]',function(p){if(p.set!='default'){return};this.setAttribute('data-default',convert(p.value,String));p.handled=true});

//Selection
on('get','[data-select]',function(p){if(p.get&&p.get!='selection'){return};var t=e(this),s=convert(t.attr('data-select'),String),d=t[s?'find':'children'](s+'.selected'),x=t.attr('data-max'),x=def(x)?x:1,r=[];
	d.each(function(d){r.push(e(d).val())});p.value=x==1?r[0]||null:r;p.handled=true;
});
on('set','[data-select]',function(p){if(p.set&&p.set!='selection'){return};var t=e(this),s=convert(t.attr('data-select'),String),d=t[s?'find':'children'](s);
	d.each(function(d){var d=e(d),c=p.clone();d.set('selected',convert(c.value,Array).some(function(v){return match(d.val(),v)}))});p.handled=true;
});
on('click','[data-select] *',function(){var t=e(this),w=t.closest('[data-select]'),m=w.attr('data-min'),x=w.attr('data-max'),s=w.attr('data-select'),d=w[s?'find':'children'](s),c='selected',s='.'+c,f=d.filter(s),n=f.length,h=0;if(!d.some(function(d){return d.contains(t[0])?t=e(d):0})){return};h=t.is(s);m=def(m)?m:0;x=def(x)?x:1;
	x==1&&!h?f.class(c,0):0;t.class(c,h?n>m?0:1:x<2||n<x?1:0);delay(function(){w.trigger('change',{type:'selection',element:this})});
});
on('set','[data-select] *',function(p){if(p.set!='selected'){return};
	e(this).class('selected',p.value?1:0);p.handled=true;
});

//Reflection
on('get','[data-reflect]',function(p){if(p.handled||p.get&&p.get!='reflection'&&p.get!='default'){return};var t=e(this),b=t.data('base'),a=def(b,Array)||t.is("[data-reflect$=':array']");if(a&&p.get=='default'){return};var d=t.find('[data-reflect]','[data-refract]');if(!b&&!d.length){return};var o=a?[]:{};
	d.remove("[data-reflect$=':template']").each(function(d){var d=e(d),v=d.get(p);a?o.push(v):o.add(convert(d.attr('data-reflect'),String).split(':')[0],v)});if(!a&&p.get!='default'){t.attr().each(function(a){var n=a.name,r=/^data-/,m=n.match(r),n=n.replace(r,''),v=convert(a.value);m&&b&&b[n]?o.add(n,v):0});o.add(b,0)};
	p.value=a?o.length?o:null:o;p.handled=true;
});
on('set','[data-reflect]',function(p){if(p.handled||p.set&&p.set!='reflection'||!is(p.value,[Object,Array,null])){return};var t=e(this),a='data-reflect',s='['+a+']',k='base',o=p.value,b=t.data(k);!p.nobase?t.data(k,o):0;
	if(any([o,b],Array)){var k='template',b=t.data(k)||t.first(s),f=function(v,c){c=b.clone().attr(a,b.attr(a).remove(':'+k));t.add(c);c.val(v)};t.data(k,b);
		p.append?0:t.clear();o?p.sync?o.each(f):t.data('stop',o.delay(f,0,{done:function(){t.trigger('done',p)}})):0;o&&p.sync?t.trigger('done',p):0;p.handled=true;
	}else{
		t.attr().each(function(a){var n=a.name,r=/^data-/,m=n.match(r),n=n.replace(r,''),v=o?o[n]:null;if(m&&(v||b&&b[n])){a.value=convert(v,String);p.handled=true}});t.find(s,'[data-refract]').each(function(d,v){d=e(d),v=o?o[d.attr(a).split(':')[0]]:null,v=def(v)?v:null;d.val(v);p.handled=true});
	};
});

//Cycles
on('get','[data-states]',function(p){if(p.get&&p.get!='state'){return};var t=e(this),a='data-state',s=t.attr(a)||0,x=t.attr(a+'s');p.value=x.pop?x[s]:s;p.handled=true});
on('set','[data-states]',function(p){if(p.set&&p.set!='state'){return};var t=e(this),a='data-state',v=p.value,x=t.attr(a+'s');t.attr(a,x.pop?x.indexOf(x.first(v)):v)});
on('click','[data-states],[data-states] *',function(p){var t=e(this).closest('[data-states]'),a='data-state',s=t.attr(a),x=t.attr(a+'s'),n=s+1,x=x.length||x,s=n<x?n:0;t.attr(a,s);t.trigger('change')});

//Text Content
on('get','h1,h2,h3,h4,h5,h6,p,span,label,button,li,a,blockquote',function(p){!p.handled?p.value=convert(this.textContent.trim()):0});
on('set','h1,h2,h3,h4,h5,h6,p,span,label,button,li,a,blockquote',function(p){!p.handled?this.textContent=convert(p.value,String):0});

//Inputs
on('get',"input[type='checkbox']",function(p){if(!p.handled){p.value=this.checked;p.handled=true}});
on('set',"input[type='checkbox']",function(p){if(!p.handled){this.checked=p.value;p.handled=true}});
on('get',"input,select,textarea",function(p){if(!p.handled){p.value=convert(this.value);p.handled=true}});
on('set',"input,textarea",function(p){if(!p.handled){this.value=convert(p.value,String);p.handled=true}});
on('set',"select",function(p){if(!p.handled){this.value=convert(p.value,String)||'null';p.handled=true}});
on('set',"option",function(p){if(!p.handled){this.value=convert(p.value,String)||'null';if(!this.innerText){this.innerText=this.value};p.handled=true}});

//Images
on('set',"img",function(p){if(!p.handled&&p.value!=null){this.src=p.value;p.handled=true}});

//Hooks
on('set.before','[data-precision]',function(p){if(def(p.value)){p.value=convert(p.value,Number).to(this.getAttribute('data-precision'),this.getAttribute('data-mode'))}});
on('set.before','[data-reflect]',function(p){var v=p.value,d=p.set=='default'&&!def(v),s=d?null:p.set,v=d||def(v,Object)&&!Object.keys(v).length?e(this).get('default'):v;p.add({set:s,value:v},1)});
on('set.before','[data-reflect$=":array"]',function(p){if(are([p.value,p.append])){p.value=convert(p.value,Array)}});
on('set.before','[data-reflect][data-states]',function(p){!p.set?p.set=!def(p.value,Number)?'reflection':'state':0});
on('get.before','input[data-reflect],select[data-reflect],textarea[data-reflect]',function(p){!p.get?p.get='raw':0});
on('set.before','input[data-reflect],select[data-reflect],textarea[data-reflect]',function(p){!p.set?p.set='raw':0});
on('get.before','[data-reflect][data-select]',function(p){!p.get?p.get='selection':0});
on('set.before','[data-reflect][data-select],select[data-reflect]',function(p){!p.set?p.set=def(p.value,Array)?'reflection':'selection':0});
on('set.before','[data-reflect].sync',function(p){p.sync=true});

//Fallbacks
on('show','*',function(p){!p.handled?e(this).class('hidden',0):0});
on('hide','*',function(p){!p.handled?e(this).class('hidden',1):0});

on(['set','change'],'.faux-select select',function(p){if(p.set=='reflection'){return};
	e(this).closest('.faux-select').find('.value').val(e(this).children(':nth-child('+(this.selectedIndex+1)+')').val());
});
on(['set','change'],'.select select',function(){
	e(this).parent().find('.value').val((this.options[this.selectedIndex]||{}).textContent);
});
//New

e.ajax=function(a,b,c,d,f){var x=new XMLHttpRequest,y,z;
	if(!c||c.call){if(d){f=d;d=c}else{f=c};c={}}else{if(!f){f=d;d=null}};c.t=Date.now();
	if(/get/.test(a)){
		b+='?'+e.urlParams(c);c=null;
	}else{
		c=FormData?e.formData(c):e.urlParams(c);
	}
	var callback=function(v){
		var t=v.type,p=t=='progress',y=p?d:f;if(!y){return};var r=x.responseText,r=d?r.match(/[^\n]*$/)[0]:r;
		try{z=JSON.parse(r.replace(/\0/g,''))}catch(ex){z={}};y.call(x,x,z);
	};['progress','load','error'].forEach(function(n){x.addEventListener(n,callback)});
	x.open(a,b);
	x.setRequestHeader('X-Requested-With','XMLHttpRequest');
	if(c&&!c.append){x.setRequestHeader('Content-Type','application/x-www-form-urlencoded')};
	x.send(c);return x;
}
e.formData=function(a){
	var r=new FormData();Object.keys(a).forEach(function(k,v){v=a[k];
		if(v===undefined){
			return
		}else if(v instanceof Blob){
			
		}else if(v instanceof Object){
			v=convert(v,String)
		};
		r.append(k,v);
	});return r;
}
e.urlParams=function(a){
	if(!a||a.trim){
		var r={};(a||location.href.split('?')[1]||'').split('&').forEach(function(p){
			var s=p.split('='),k=s[0],v=s[1];if(k){r[k]=convert(decodeURIComponent(v))};
		});
	}else{
		var r='',i=0;Object.keys(a).forEach(function(k,v){v=a[k];
			if(v===undefined){return}else if(v instanceof Object){v=convert(v,String)};
			if(i++){r+='&'};r+=encodeURIComponent(k)+'='+encodeURIComponent(v);
		});
	};return r;
};
e.class=function(a,b,c,d){var x=[].slice.call(document.querySelectorAll(a)),y=b?b.split(','):b,z=c!=null?c>0?c>1?'toggle':'add':'remove':'contains';
	x.forEach(function(x){
		y.forEach(function(y){
			x.classList[z](y);
		});
	});
	if(d){
		setTimeout(function(){
			e.class(a,b,2);
		},d);
	};
};
e.trigger=function(a,b,c){
	var x=b?b.pop?b:b.trim?[].slice.call(document.querySelectorAll(b)):[b]:[window];
	x.forEach(function(x){
		var y;if(CustomEvent&&CustomEvent.constructor!=Object){
			y=new CustomEvent(a,{detail:c||{}});
		}else{
			y=document.createEvent('CustomEvent');y.initCustomEvent(a,true,true,c||{});
		};x.dispatchEvent(y);
	});
};
e.is=function(a,b){
	return match(a,b);
};
e.prev=function(a,b,c){
	if(a.trim){c=b;b=a;a=-1};c=!c?[]:c.trim?e.get(c):c.pop?c:[c];
	var x=[];c.forEach(function(c,y){
		while(a&&(c=c.previousElementSibling)){
			if(e.is(c,b)){x.push(c);a--};
		};
	});return x;
}
e.clone=function(a){
	var x={};Object.keys(a).forEach(function(k){
		x[k]=a[k];
	});return x;
}
e.sort=function(a,b,c){if(!c&&/asc|desc/i.test(b)){c=b;b=c};var z=c=='desc';
	return a.sort(function(x,y){if(b){x=x[b];y=y[b]};
		return x<y?z?1:-1:x>y?z?-1:1:0;
	});
};
e.stream=function(a,b,c,d){
	var x=new XMLHttpRequest(),start=0,method=a,url=b,data=d?c:{},callback=d?d:c;
	var formData=new FormData();Object.keys(data).forEach(function(k){
		formData.append(k,data[k]);
	});
	x.addEventListener('progress',function(v){
		var t=x.responseText;do{
			var end=t.indexOf("\n",start),fin=end<0;if(fin){end=t.length-1};
			var line=t.substring(start,end).trim();if(line){callback(x,line)};
		}while((start=end+1)&&!fin)
	});
	x.addEventListener('loadend',function(){
		callback(x);
	});
	x.open(method,url);
	x.send(formData);
};

function breakpoint(){
	var lol=1;
}

function calcSize(item,mode){
	if(!mode){return calcSize(item,'cut')||calcSize(item,'rug')||calcSize(item,'item')||calcSize(item,'product')}else if(mode=='base'){return calcSize(item,'cut')||calcSize(item,'product')||calcSize(item,'item')}else if(mode=='product'){return ((item.length&&item.width)||item.area)?{length:item.length,width:item.width,area:item.length&&item.width?item.length*item.width:item.area}:null};
	var regexp=RegExp('([\\d\\.]+)m[^m²][\\sx]*([\\d\\.]+)?'+(mode=='rug'?'\\D*Rug':mode=='cut'?'[\\sm]*Cut':mode=='item'?'.*':''),'i'),match=(item.name||'').match(regexp);
	return match ? {length:parseFloat(match[1])||undefined,width:parseFloat(match[2])||undefined,area:(match[1]*match[2])||undefined} : match;
}
function calcCourier(a,name){
	var id=null;if(a.items){
		var order=a;order.items.forEach(function(item){
			var c=calcCourier(item);if(c>id){id=c};
		});
	}else{
		var item=a,s=/sample/i.test(item.name)?null:calcSize(item,'base');
		if(!s){
			id=null;
		}else if(s.length&&s.width?(((s.length<=1.3&&s.width<5)||(s.width<=1.3&&s.length<5))&&item.weight<=20):s.area<=5){
			id=1 //UKMail
		//}else if(s.length&&s.width?((s.length<=4||s.width<=4)&&s.area<25&&(item.weight||0)<70):/grippers|underlay/i.test(item.name)){
			//OLD Tufnells.
		}else if(s.length&&s.width?((s.length<=4||s.width<=4)&&(window.order.shipping_postcode&&/(?:^(B|BA|BS|CF|CV|DE|DY|EX|GL|HR|LD|LE|MK|NN|NP|PL|SA|SN|SY|TA|TF|TQ|TR|WR|WS|WV|AL|BB|BD|BL|BR|CB|CH|CM|CO|CT|CW|DA|DT|E|EC|EN|HA|HD|HP|HX|L|LS|LU|M|ME|N|NG|OL|PR|RM|S|SE|SG|SK|SS|ST|TN|WA|WC|WD|WF|WN|AB|BN|CA|CR|DD|DG|EH|FK|G|GU|IG|IV|KA|KT|KW|KY|LA|ML|NW|PA|PH|RG|RH|SL|SM|SW|TD|TW|UB|W|B|CV|DE|DY|LE|MK|NN|TF|WS|WV|BH|OX|PO|SO|SP|BB|BD|BL|CH|CW|DN|HD|HX|L|LS|M|NG|OL|PR|S|SK|ST|WA|WF|WN|DH|DL|FY|HG|HU|IP|LL|LN|NE|NR|PE|SR|TS|YO)\d)|(?:^(?:DN[1-9]|DN1[0-2]))/i.test(window.order.shipping_postcode))):/^cc/.test(item.sku)){
			id=3 //JD
		}else if(window.order.shipping_postcode&&/^(AL|B|BA|BH|BL|BN|BR|BS|CB|CF|CH|CM|CO|CR|CT|CV|CW|DA|DH|DE|DL|DN|DT|DY|E|EC|EN|EX|FY|GL|GU|HA|HD|HG|HP|HR|HU|HX|IG|IP|KT|L|LA|LD|LE|LL|LN|LS|LU|M|ME|MK|N|NE|NG|NN|NP|NR|NW|OL|OX|PE|PL|PO|PR|RG|RH|RM|S|SA|SE|SG|SK|SL|SM|SN|SO|SP|SR|SS|ST|SW|SY|TA|TF|TN|TQ|TR|TS|TW|UB|W|WA|WC|WD|WF|WN|WR|WS|WV|YO)\d/i.test(window.order.shipping_postcode)){
			id=4 //Designer Carpet
		}else if((s.length&&s.width)&&(s.length<=4||s.width<=4)&&(s.area<25)&&((item.weight||0)<70)){
			id=2 //Tuffnells
		};
	};return !name?id:['Unknown','UKMail','Tuffnells','TagTrans','Designer Delivery'][id||0];
}

addEventListener('ready',function(){setTimeout(function(){
	if(document.getElementById('ze-snippet')){document.body.classList.add('with-chat')}
},10)});
