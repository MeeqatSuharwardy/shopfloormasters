if(window.e){
	on('input','#SizeFilter .ft,#SizeFilter .in',function(){
		var t=e(this),f=t.is('.ft'),s=t.siblings(f?'.in':'.ft'),m=(((f?t:s).val()||0)*0.3048)+(((f?s:t).val()||0)*0.0254);
		t.siblings('.metric').val(convert(m).nearest(0.05,'ceil').toFixed(2),{from:'imp'});
	});
	e("[data-reflect='rotation_lock'] input").val(sessionStorage['rotation_lock']=='true');
	on('change',"[data-reflect='rotation_lock'] input",function(){
		sessionStorage['rotation_lock']=this.checked;
	})
	on('keyup','#Subscribe input',function(v){if(v.which!=13){return}
		e('#Subscribe .button').click();
	});
	on('click','#Subscribe .button:not(.wait)',function(){
		var t=e(this),i=e('#Subscribe input'),v=i.val();if(!v){alert('No email provided');return};
		t.class('wait',1);ajax('post','/api/newsletter/subscribe',{email:v},function(x){
			if(x.status==200){
				i.val(null);t.class('done',1);delay(function(){t.class('done',0)},1000);
			}else{
				alert(x.responseText);
			};t.class('wait',0);
		});
	});

	//NEW

	//Landing Pages
	on('get','.landingpage .minputboxes',function(p){
		p.value=parseFloat(p.value);if(isNaN(p.value)){p.value=undefined}
	})
	on('click','.landingpage .sizebuttons,.landingpage .sizebuttons *',function(){
		var button=e(this).closest('button')
		button.class('active',1).siblings('.active').class('active',0);
		var isM = button.is('#mbutton');
		e('.minputboxes').class('hidden',isM?0:1);
		e('.ftinputboxes').class('hidden',isM?1:0);
	})
	on('change',".landingpage .switch input[type='checkbox']",function(){
		e('.minputboxes').class('hidden',this.checked?1:0);
		e('.ftinputboxes').class('hidden',this.checked?0:1);
	});
	on(['input','change'],'.landingpage .minputboxes',function(ev){if(this.value==''&&ev.type!='change'){return};
		var v=parseFloat(this.value),min=0;if((ev.type=='change'&&(!v||v<=0))||(this.value!=''&&isNaN(v))||v<min){v=min;this.value=v};
		if(/\.\d{3,}/.test(this.value)){v=+v.toFixed(2);this.value=v};
		var length=e('#mlength').val()
		if(length){
			var length_ft=length*3.28084
			var length_in=Math.ceil(((length_ft%1)*12)*100)/100
			e('#ftlength').val(Math.floor(length_ft))
			e('#inlength').val(length_in)
		}
		var width=e('#mwidth').val()
		if(width){
			var width_ft=width*3.28084
			var width_in=Math.ceil(((width_ft%1)*12)*100)/100
			e('#ftwidth').val(Math.floor(width_ft))
			e('#inwidth').val(width_in)
		}
	});
	on(['input','change'],'.landingpage .ftinputboxes',function(ev){if(this.value==''&&ev.type!='change'){return};
		var v=parseFloat(this.value),min=0;if((ev.type=='change'&&(!v||v<=0))||(this.value!=''&&isNaN(v))||v<min){v=min;this.value=v};
		if(/\.\d{3,}/.test(this.value)){v=+v.toFixed(2);this.value=v};
		var length_ft=e('#ftlength').val()
		var length_in=e('#inlength').val()
		var width_ft=e('#ftwidth').val()
		var width_in=e('#inwidth').val()
		var length=Math.ceil(((length_ft*0.3048)+(length_in*0.0254))*100)/100
		var width=Math.ceil(((width_ft*0.3048)+(width_in*0.0254))*100)/100
		e('#mlength').val(length)
		e('#mwidth').val(width)
	});
	on('click','.landingpage .searchbutton,.landingpage .searchbutton *, #Page .searchbutton, #Page .searchbutton *',function(){
		var container=e(this).closest('.searchbox');
		var data = container.val();
		var imp=!!container.find("input[type='checkbox']").val()
		var url = '/search'
		if (data.category){
			url=url+'/'+data.category.toLowerCase().replace('remnants','remnant').replace('carpets','carpet');
		}
		if (data.brand){
			url=url+'/'+data.brand.toLowerCase();
		}
		if (data.range){
			url=url+'/'+data.range.toLowerCase();
		}
		if (data.colour){
			url=url+'/'+data.colour.toLowerCase();
		}
		if (data.style){
			url=url+'/'+data.style.toLowerCase();
		}
		if (data.type){
			url=url+'/'+data.type.toLowerCase();
		}
		if (data.suitability){
			url=url+'/'+data.suitability.toLowerCase();
		}
		if (data.length){
			if(data.length<0.5){data.length=0.5};
			url+='?length='+data.length.nearest(0.05,'ceil').toFixed(2);
		}
		if (data.width){
			if(data.width<0.5){data.width=0.5};
			url=url+(data.length?'&':'?')+'width='+data.width.nearest(0.05,'ceil').toFixed(2);
		}
		if(imp){
			url+="&units=imp";
		}
		location=url;
	})

	//Search
	addEventListener('ready',function(){
		window.url_params=urlParams();if(url_params.units=='imp'){
			document.body.classList.add('imp')
			e("#SizeFilter [data-reflect='length']~.select select").val('imperial').trigger('change');
		}
		window.category=/\/runner/.test(location.pathname)?'runner':(/\/carpet/.test(location.pathname))?'carpet':/\/roll/i.test(location.pathname)?'roll':/\/accessor/i.test(location.pathname)?'accessory':/\/rug/.test(location.pathname)?'rug':'remnant';
		e('#Search select').val(category);
		e('#Search .select').show();
		e('#Search input,#SearchFilter input').val(urlParams().q||null);
	});

	//Desktop Search
	on('keyup','#Search input',function(v){
		e('#SearchFilter input').val(this.value);
	});
	on('keypress','#Search input',function(v){if(v.which!=13){return}
		e('#Search button').trigger('mousedown');
	});
	on('mousedown','#Search button, #Search button *',function(){if(e('#MenuButton').css('display')!='none'){return}
		var input=e('#Search input')[0];if(match(input,'*:focus')){
			var category=e('#Search select')[0].value,string=input.value;
			if(/W\d+$/i.test(string)){
				var split=string.split('W'),width=split[1][0]+split[1][1]+'.'+split[1][2]+split[1][3];
				location='/search/'+category+'?q='+split[0]+'&width='+width;
			}else if(/^s.*-\d+$/i.test(string)){
				var split=string.split('-'),length=split[1][0]+split[1][1]+'.'+split[1][2]+split[1][3];
				location='/search/'+category+'?q='+split[0]+'&length='+length;
			}else{
				location='/search/'+category+'?q='+string;
			}
		}else{
			once('click',function(){input.focus()});
		}
	});
    
	// Search/Filters Menu
    on('click','#SearchButton:not(.active), #SearchButton:not(.active) *',function(){
		
		//Set the search button and bar classes
		var button=e(this).closest('button'); button.class('active',1);
        var searchbar=e('#Filters'); searchbar.class('open',1);
		
		var f=function(v){
			if(!match(v.target,'#Filters, #Filters *')){
				searchbar.class('open',0);
                button.class('active',0);
                e('.collapsible').class('collapsed',1);				
                v.preventDefault();return false;
			};            
            once('click',f);
		};setTimeout(function(){once('click',f)});
	});
    
    //Mobile Search
	on('keyup','#SearchFilter input',function(v){
		e('#Search input').val(this.value);
	});
    
    //Mobile Menu
	on('click','#MenuButton:not(.active),#MenuButton:not(.active) *',function(){
		
		//Set navigation button and nav classes
		var button=e(this).closest('button'); button.class('active',1);
		var nav=e('#Nav'); nav.class('open',1);
		
		//Listen for clicks outside of nav in order to reset CSS classes
		var f=function(v){
			if(!match(v.target,'#Nav, #Nav *')){
				nav.class('open',0);
				button.class('active',0);
				e('.menu-container>div').class('open',0);
				e('.expandable').class('open',0);				
				v.preventDefault();
				return false;
			};once('click',f);
		};setTimeout(function(){once('click',f)});
	});
    
    //Open the Mobile Sub-Nav (if it has one)
	on('click', '#Nav.open .open-menu, #Nav.open .nav-next', function(event) {
        		
		var subnav = e(this).closest('div'); subnav.class('open',1);		
		event.preventDefault();
		
	}, false);
	
	//Sub-Menu Back Button/Title
	on('click','#Nav.open .nav-back',function(){		
		
		e('.menu-container>div').class('open',0);		
		e('.expandable').class('open',0);
	
	});
	
	// Sub-Menu Accordian
	//Get all expandable tags
	var acc = document.getElementsByClassName("expandable");
	var i;
	var open = null;

		for (i = 0; i < acc.length; i++) {
		  acc[i].addEventListener("click", function() {
			if (open == this) {
			  open.classList.toggle("open");
			  open = null;
			} else {
			  if (open != null) {
				open.classList.toggle("open");
			  }
			  this.classList.toggle("open");
			  open = this;
			}
		  });
		}
    
    //Desktop Drop Down Navigation
    on('mouseover','.has-children *:hover, .has-children:hover',function(){		
		e('#Nav').class('hover',1);
	});
	on('mouseout','.has-children *, .has-children',function(){		
		e('#Nav').class('hover',0);
	});

    // Mobile Footer Menu
	on('click','footer h4',function(){		
		var button=e(this).closest('div');button.class('open',2);
	});

	//Back to top
	on('click','#BackToTop',function(){
		window.scrollTo(0,0);
	});

	//Selects
	on('change','.sort:not(.carpet) select',function(){
		sessionStorage['sort']=this.value;location.reload();
	});
	on('change','.carpet.sort select',function(){
		sessionStorage['carpet_sort']=this.value;location.reload();
	});
	on('change','#Limit select',function(){
		sessionStorage['limit']=this.value;location.reload();
	});

	//Filters
	on('show','#Filters',function(){var params=urlParams();
		var length=params['length'];if(length){e('#SizeFilter .length .metric').val(length)};
		var width=params['width'];if(width){e('#SizeFilter .width .metric').val(width)};
		var min=params['min'];if(min){e("#PriceFilter [data-reflect='min']").val(min);e('#PriceFilter').class('collapsed',0)};
		var max=params['max'];if(max){e("#PriceFilter [data-reflect='max']").val(max);e('#PriceFilter').class('collapsed',0)};
		var min_sqm=params['min_sqm'];if(min_sqm){e("#PriceFilter [data-reflect='min_sqm']").val(min_sqm);e('#PriceFilter').class('collapsed',0)};
		var max_sqm=params['max_sqm'];if(max_sqm){e("#PriceFilter [data-reflect='max_sqm']").val(max_sqm);e('#PriceFilter').class('collapsed',0)};
		e('#Page').class('has-filters',1);
	});
	on('get','#Filters input',function(p){
		if(!p.value){p.value=undefined}
	});
	on('get','#Filters .metric',function(p){
		p.value=parseFloat(p.value);if(isNaN(p.value)){p.value=undefined}
	})
	on(['set','change'],'#CategoryFilter select',function(d){

		var category=d.value;if(category=='carpet'){
			e("#SortFilter>.select:not(.carpet)").hide();
			e("#SortFilter>.carpet.select").show();
			e("#PriceFilter .header .label").val("PRICE SQM");
			e("#SizeFilter,#PriceFilter [data-reflect='min'],#PriceFilter [data-reflect='max']").hide();
			e("#PriceFilter [data-reflect='min_sqm'],#PriceFilter [data-reflect='max_sqm']").show();

			e("[data-reflect='type'][data-name='Accessory Type'],[data-reflect='type'][data-name='Edge']").hide();

			e("#Tags .type[data-name='Width'] .tag").show();
			e("[data-reflect='type'][data-name='Width']").show();

			e("#Tags .type[data-name='Brand'] .tag").hide();
			['Alternative Flooring','Brintons','Crucial Trading','Designer Carpet','Kersaint Cobb','designer carpet','Manx Tomkinson','Westex'].forEach(function(n){e("#Tags .type[data-name='Brand'] [data-name='"+n+"']").show()})
		}
		else if(category=='accessory'){

			e("#SizeFilter,#PriceFilter,[data-reflect='type'][data-name='Width'],[data-reflect='type'][data-name='Colour'],[data-reflect='type'][data-name='Type'],[data-reflect='type'][data-name='Style'],[data-reflect='type'][data-name='Composition'],[data-reflect='type'][data-name='Brand'],[data-reflect='type'][data-name='Edge'],[data-reflect='type'][data-name='Edge'],[data-reflect='type'][data-name='Construction']").hide();
			e("[data-reflect='type'][data-name='Accessory Type']").show();

		}else if(category=='runner'){

			e("#SortFilter>.select:not(.carpet)").hide();
			e("#SortFilter>.carpet.select").show();
			e("#PriceFilter .header .label").val("PRICE SQM");
			e("#SizeFilter,#PriceFilter [data-reflect='min'],#PriceFilter [data-reflect='max']").hide();
			e("#PriceFilter [data-reflect='min_sqm'],#PriceFilter [data-reflect='max_sqm']").show();

			e("[data-reflect='type'][data-name='Accessory Type'],[data-reflect='type'][data-name='Edge']").hide();

			e("#Tags .type[data-name='Width'] .tag").hide();
			['0.66','0.69'].forEach(function(n){e("#Tags .type[data-name='Width'] [data-name='"+n+"']").show()})
			e("[data-reflect='type'][data-name='Width']").show();

			e("#Tags .type[data-name='Brand'] .tag").hide();
			['Alternative Flooring','Brintons','Crucial Trading','Designer Carpet','Kersaint Cobb','designer carpet','Manx Tomkinson','Westex'].forEach(function(n){e("#Tags .type[data-name='Brand'] [data-name='"+n+"']").show()})

		}else{

			e("#SortFilter>.carpet.select").hide();
			e("#SortFilter>.select:not(.carpet)").show();
			e("#PriceFilter>button").val("PRICE");
			e("#PriceFilter [data-reflect='min_sqm'],#PriceFilter [data-reflect='max_sqm']").hide();
			e("#SizeFilter,#PriceFilter [data-reflect='min'],#PriceFilter [data-reflect='max']").show();

			e("[data-reflect='type'][data-name='Width'],[data-reflect='type'][data-name='Accessory Type'],[data-reflect='type'][data-name='Edge']").hide();
			e("[data-reflect='type'][data-name='Width'],[data-reflect='type'][data-name='Accessory Type']").hide();

			if(category=='rug'){
				e("[data-reflect='type'][data-name='Edge']").show();
			}

		}
		//e("#Tags .type[data-name='Edge']")[this.value=='rug'?'show':'hide']();
	});
	on('mousedown','#SizeFilter select',function(v){
		this.selectedIndex=this.selectedIndex?0:1;
		v.preventDefault();e(this).trigger('change');
	});
	on(['set','change'],'#SizeFilter select',function(v){
		e("#SizeFilter input:not([type='checkbox']").hide();
		e('#SizeFilter input.'+this.value).show();
		if(v instanceof Event){e(e(this).closest('.length,.width').siblings()[0]).find('select').val(this.value)};
	});
	on(['set','input','change'],'#SizeFilter .metric',function(v){if(v.set&&v.from=='imp'){return}
		var ft=this.value*3.28084,inch=(ft%1)*12;ft=Math.floor(ft);inch=Math.floor(inch);
		var p=e(this).parent();p.find('.ft').val(ft);p.find('.in').val(inch);
	});
	//on(['input','change'],'#SizeFilter .imperial',function(){
	//	var p=e(this).parent(),ft=p.find('.ft').val(),inch=p.find('.in').val()||0;
	//	p.find('.metric').val(((ft*0.3048)+(inch*0.0254)));
	//});
	on('set.before','#Filters .collapsible>*:first-child',function(p){
		p.value=p.value.toUpperCase();
	});
	on('click','#Filters .collapsible>*:first-child,#Filters .collapsible>*:first-child button',function(){
		e(this).closest('.collapsible').class('collapsed',2);
	});
	on(['input','change'],'#Filters input',function(){
		e('#Filters .apply').show();
	});
	on('keypress','#Filters input',function(v){if(v.which!=13){return}
		e('#Filters .apply').click();
	});
	on('click','#Filters .apply',function(){
		var params={},href='/search';
		var tags=[e('#CategoryFilter select').val()].concat(e('#Tags').val()||[]).concat(((window.page||{}).tags||[]).filter(function(t){return !t.not&&!/category|brand|style|type|colour|width|construction|composition|accessory type|edge/i.test(t.type)&&t.name!='noindex'})).map(function(t){let name=t.trim?t:t.name;return ((t.ambiguous ? t.type+'~' : '')+name).toLowerCase()}).filter(function(t,i,a){return a.indexOf(t)==i});
		if(tags.length){href+='/'+tags.join('/')};
		params.add(e('#SizeFilter').val());
		if(e('#SizeFilter select').val()=='imperial'){
			params.add({units:'imp'})
		}
		if(params.length){if(params.length<0.5){params.length=0.5};params.length=convert(params.length).nearest(0.05,'ceil').toFixed(2)};
		if(params.width){if(params.width<0.5){params.width=0.5};params.width=convert(params.width).nearest(0.05,'ceil').toFixed(2)}
		params.add(e('#PriceFilter').val());
		params.add(e('#SearchFilter').val());
		params=e.urlParams(params);
		location=href+(params?('?'+params):'');
	});
	on('click','#Filters .clear',function(){
		e('#Filters input').val(null);
		e('#Tags .active.tag').class('active',0);
		e('#Tags .not.tag').class('not',0);
		if(e('#MenuButton').css('display')=='none'){
			e('#Filters .apply').click();
		}
	});

	//Tags
	on('get.before','#Tags',function(p){var t=e(this);
		p.value=[];t.find('.active.tag').each(function(t){var t=e(this),tag=t.data('base');
			var str=tag.ambiguous||parseFloat(tag.name)?tag.type+'~'+tag.name:tag.name;
			p.value.push(str)
		});
		t.find('.not.tag').each(function(t){var t=e(this),tag=t.data('base');
			var str=tag.ambiguous||parseFloat(tag.name)?tag.type+'~'+tag.name:tag.name;
			p.value.push('!'+str)
		});
		p.handled=true;return false;
	});
	on('set.before','#Tags',function(p){

		var tags=p.value,types={};tags.forEach(function(tag){
			if(!types[tag.type]){types[tag.type]={name:tag.type,tags:[]}}
			types[tag.type].tags.push(tag);
		});


		var allowed=['Width','Colour','Type','Style','Composition','Brand','Construction','Accessory Type','Edge'];
		tags=p.value=[];allowed.forEach(function(type){
			if(types[type]){tags.push(types[type])};
		});

	});
	on('set','#Tags',function(p){if(!p.value){return};
		window.tags=(window.product||{}).tags||(window.page||{}).tags||[];
		var category=window.category=tags.first({name:/remnant/i})?'remnant':tags.first({name:/rug/i})?'rug':window.category;
	});

	//When all the tags have loaded into the DOM...
	on('done',"#Tags [data-reflect='type'][data-name='Edge'] [data-reflect='tags']",function(){
		e('#CategoryFilter select').val(category);
	});

	on('set.before','#Tags .type .content',function(p){
		p.value=p.value.sortBy('name');
	});
	on('set.before',"#Tags .type[data-name='Brand'] .tag",function(p){if(!p.value){return}
		if(category=='carpet'&&!/alternative flooring|westex|manx tomkinson|crucial trading|brintons|designer carpet|kersaint cobb/i.test(p.value.name)){
			e(this).hide();
		}
	});
	on('set','#Tags .tag',function(p){if(!p.value){return}
		if(!window.product&&window.tags.first({name:p.value.name,type:p.value.type})){return e(this).class('active',1)};
		var last=tags[tags.length-1],not_tags=last&&last.not;if(not_tags){
			if(not_tags.first({name:p.value.name,type:p.value.type})){return e(this).class('not',1)}
		}
	});
	on('done','#Tags .type .content',function(){
		var t=e(this);t.parent().class('collapsed',t.find('.tag.active,.tag.not')[0]?0:1);
	});

	//Neutral tag - add
	on('click','#Tags .tag:not(.not):not(.active)>button:not(.not)',function(){
		e(this).parent().class('active',1);
		var apply=e('#Filters .apply');apply.show();
		if(e('#MenuButton').css('display')=='none'){
			apply.click();
		};return false;
	});

	//Neutral tag - not
	on('click','#Tags .tag:not(.not):not(.active)>button.not',function(){
		e(this).parent().class('not',1);
		var apply=e('#Filters .apply');apply.show();
		if(e('#MenuButton').css('display')=='none'){
			apply.click();
		};return false;
	});

	//Active tag - un-active
	on('click','#Tags .tag.active>button:first-child,#Tags .tag.active>button.not',function(){
		e(this).parent().class('active',0);
		var apply=e('#Filters .apply');apply.show();
		if(e('#MenuButton').css('display')=='none'){
			apply.click();
		};return false;
	});

	//Notted tag - un-not.
	on('click','#Tags .tag.not>button',function(){
		e(this).parent().class('not',0);
		var apply=e('#Filters .apply');apply.show();
		if(e('#MenuButton').css('display')=='none'){
			apply.click();
		};return false;
	});

	//Accessories popup
	on('click','#MiniBasket,#MiniBasket *',function(v){
		if((!/\/accessories/.test(location.href))&&order.items.some(function(i){return (i.carpet||i.remnant)&&!i.sample})&&!order.items.some(function(i){return i.accessory})&&order.items.every(function(i){return /rug/i.test(i.name)})!=true){
			v.preventDefault();
			e('#AccessoriesPopup').show();
		};
	});
	on('show','#AccessoriesPopup:not(.loaded)',function(){
		var images=e("#AccessoriesPopup img");
		images[0].src='/images/products/carpenter-ultimate-living-underlay-10mm/carpenter-ultimate-living-underlay-10mm.jpg';
		images[1].src='/images/products/designer-carpet-wood-floor-grippers-150m/designer-carpet-wood-floor-grippers-150m.jpg';
		images[2].src='/images/products/designer-carpet-double-brass-effect-door-strip-3-ft/designer-carpet-double-brass-effect-door-strip-3-ft.jpg';	
		e(this).class('loaded',1);
	});
	on('click','#AccessoriesPopup,#AccessoriesPopup .close',function(){
		location.href='/checkout';
	});
	on('click','#AccessoriesPopup .no',function(){
		location.href='/checkout';
	});
	on('click','#AccessoriesPopup .yes',function(){
		location.href='/accessories';
	});

	//Order
	try{window.order=JSON.parse(sessionStorage['order']||null)}catch(ex){};window.order=window.order||{items:[]};
	on('load',function(v){
		var mini={count:0,total:0};window.order.items.each(function(i){
			mini.count+=i.quantity||1;mini.total+=i.price*(i.quantity||1);
		});e('#MiniBasket').val(mini);
	});

	var ua=navigator.userAgent;
	if(/edge/i.test(ua)){
		e(document.body).class('edge',1);
	}else if(/mac/i.test(ua)){
		e(document.body).class('safari',1);
	}else if(/chrome/i.test(ua)){
		e(document.body).class('chrome',1);
	}else if(/firefox/i.test(ua)){
		e(document.body).class('firefox',1);
	}else if(/trident/i.test(ua)){
		e(document.body).class('ie',1);
	}


	var cookies_accepted=localStorage['cookies_accepted'];
	if(!cookies_accepted){
		on('click',"#CookieNotice [data-action='accept']",function(){
			localStorage['cookies_accepted']='true';
			e('#CookieNotice').hide();
		});
		e("#CookieNotice").show()
	}

	window.admin=false;
	window.ready=true;e.trigger('ready');
}
