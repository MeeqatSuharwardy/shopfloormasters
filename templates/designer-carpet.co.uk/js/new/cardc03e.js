window.cardJS = function(){

	//Load styles.
	//var el=document.createElement('link');el.setAttribute('rel','stylesheet');el.setAttribute('href','https://designer-carpet.co.uk/css/card.css?v=20191125');document.body.appendChild(el);
	
	//TEMPER
	if(!window.temper){
		window.temper=function(a,b){
			var value=a,options=b,update;value=parseFloat(value)||options.min;
			if(options.increments){
				value=value.nearest(options.increments,options.round||'ceil');
				if(options.increments<1){var places=(String(value).split('.')[1]||'').length,max_places=(String(options.increments).split('.')[1]||'').length;
					if(places>max_places){value=value.toFixed(max_places);if(options.input){update=true}};
				};
			};
			if(value<options.min){value=options.min};if(value>options.max){value=options.max};
			return update ? {update:true,value:value} : value;
		};
	}

	//PRODUCT CARD
	on('set','.product.card',function(d){var p=d.value;if(!p.lookup){return};var t=e(this);
		e.ajax('get','/api/products',{sku:p.sku,context:'card'},function(x,d){
			if(x.status==200){
				p.add(d);delete p.lookup;
				//if(p.thumbnail){p.thumbnail="https://designer-carpet.co.uk"+p.thumbnail}
				if(p.cut){
					p.retail=Math.round(p.retail_sqm*p.area);
				};t.val(p);
			}
		});
	});
	on('set','.product.card',function(d){var p=d.value;if(p.lookup){return false};var t=e(this);

		//Flesh out product...
		var carpet=p.carpet=/^x/i.test(p.sku);
		var remnant=p.remnant=/^s/i.test(p.sku);
		p.brand=(p.tags.first({type:'Brand'})||{}).name;
		p.accessory=!!p.tags.first({name:'Accessory'});
		p.underlay=/underlay/i.test(p.name);
		p.grippers=/grippers/i.test(p.name);
		p.antislip=/anti-slip/i.test(p.name);
		var runner=p.runner=/^r/i.test(p.sku);
		p.clearance=!!p.tags.first({name:'Clearance'});
		p.roll=!!p.tags.first({name:'Roll'});
		p.rug=!!p.tags.first({name:'Rug'});
		//p.quote_only=!admin&&p.carpet&&(/Riviera/i.test(p.brand))
		p.location=(p.tags.first({type:'Location'})||{}).name

		//Cut?
		if(p.cut){
			p.url+=(p.cut=='length'?("?length="+p.length):("?width="+p.width));
		}

		//URL...
		if(t.is('a')){this.href=p.url}else{t.find("a").attr('href',p.url).val(p.name)};

		//SKU
		if(p.carpet||p.runner){
			t.find("[data-reflect='sku']").hide();
		}

		//Location
		if(p.location){
			t.find("[data-reflect='location']").val(p.location);
		}

		/* NEW Thumbnail
		if(p.thumbnail){
			let img=t.find("[data-reflect='thumbnail']")[0];
			let src=p.thumbnail;
			let srcset=src+" 350w, "+src.replace(".jpg","_big.jpg")+" 1000w";
			img.setAttribute('srcset',srcset);
		}else{
			t.find("[data-reflect='thumbnail']").val("/images/icons/coming-soon-min.png");
		};*/
                                         
        //Use CDN(Stackpath) For Thumbnail Images
        if(p.thumbnail) {
            let img=t.find("[data-reflect='thumbnail']")[0];
			let src="https://cdn.designer-carpet.co.uk"+p.thumbnail;
            img.setAttribute('src',src);
		img.setAttribute('alt',p.name+(runner?' Carpet Runner ':carpet?' Carpet':remnant?' Carpet Remnant':''))
        };
        
        //No Thumbnail Found
        if(!p.thumbnail){
			t.find("[data-reflect='thumbnail']").val("https://cdn.designer-carpet.co.uk/images/icons/coming-soon-min.png?v=2");
		};

		//Size...
		if(p.accessory&&!p.antislip||p.carpet||p.runner){
			t.find('.size').hide();
		}else if(url_params.units=='imp'){
			t.find("[data-reflect='length']").val(Math.floor((p.length*3.2808399))+"' "+Math.floor((p.length*39.3700787)%12)+'"')
			t.find("[data-reflect='width']").val(Math.floor((p.width*3.2808399))+"' "+Math.floor((p.width*39.3700787)%12)+'"')
		}

		//Quote?
		if(p.quote_only){
			t.add("<button class='rel get-quote'>GET QUOTE</button><form class='back full-width left flex column'><span class='center' data-reflect='name'></span><label>Email Address</label><input name='email'/><label>Length</label><input name='length'/><label>Width</label><select name='width' data-reflect='widths:array'><option data-reflect='width:template'></option></select><button class='send'>GET QUOTE</button><button class='cancel'>CANCEL</button></form>")
			t.find(".back [data-reflect='name']").val(p.name);
		}

        //Hidden Stock (Staff See Only)
		if(p.tags.first({name:'Hidden'})){
			t.find('.hidden-stock.hidden').show();
		}
                                         
		//Limited?
		if(p.tags.first({name:'Limited'})){
			t.find('.limited.hidden').show();
		}

		//Saving...
		if(p.carpet||p.runner||p.quote_only||!(p.retail||p.retail_sqm)){
			t.find(".saving").hide();
		}else if((!p.retail&&p.retail_sqm)||(p.clearance&&p.roll)){
			t.find(".saving [data-reflect='retail']").attr('data-reflect','retail_sqm').val(p.retail_sqm);
			t.find(".saving [data-reflect='saving']").val(p.saving=(100-(((p.price_sqm_3||p.price_sqm)/p.retail_sqm)*100))||0);
		}else{
			t.find(".saving [data-reflect='saving']").val(p.saving=(100-((p.price/p.retail)*100))||0);
		}

		//Price...
		if(p.quote_only){
			t.find('.price').hide();
		}else if(p.runner){
			t.find(".price [data-reflect='price']").class('pm',1);
		}else if(!p.price||p.underlay||(p.clearance&&p.roll)){
			t.find(".price [data-reflect='price']").remove();
		}else if(p.grippers){
			t.find(".price [data-reflect='price']").class('pm',1);
		}

		//Price sqm...
		if(p.rug||p.runner||(p.accessory&&!p.underlay)){
			t.find(".price [data-reflect='price_sqm']").remove();
		}else if(p.price_sqm_3){
			//t.find(".price [data-reflect='price_sqm").val(p.price_sqm_3).class('from',1);
		}

		//Google "product impression".
		dataLayer.push({
			ecommerce:{
				currencyCode:'GBP',
				impressions:[
					{
						id:p.sku,
						name:p.name,
						price:p.price,
						brand:p.brand,
						category:(p.tags.find({type:'Category'})[0]||{}).name,
						position:Array.prototype.slice.call(this.parentElement.children).indexOf(this)+1,
						list:'ProductCard'
					}
				]
			}
		});

	});

	//Google "Product Click".
	on('click','.product.card a',function(){
		var card=this.parentElement,container=card.parentElement,position=Array.prototype.slice.call(container.children).indexOf(card),product=page.products[position];
		dataLayer.push({event:'productCard',ecommerce:{
			click:{
				actionField:{
					list:'ProductCard'
				},
				products:[{
					id:product.sku,
					name:product.name,
					price:product.price,
					brand:product.brand,
					category:(product.tags.find(function(t){return t.type=='Category'})||{}).name,
					position:position+1
				}]
			}
		}})
	});

	//Instant Quote
	on('click','.product.card:not(.transitioning):not(.queried) .get-quote',function(){var c=e(this).closest('.product.card');
		e.ajax('get','/api/products',{sku:c.attr('data-sku'),context:'widths',limit:1},function(x,d){
			if(x.status==200){
				c.find("form [name='width']").val(d.widths);
			}
		});c.class('queried',1);
	});
	on('click','.product.card:not(.transitioning) .get-quote,.flipped.product.card:not(.transitioning) .cancel',function(v){
		var t=e(this),c=t.closest('.product.card'),cancel=t.is('.cancel'),action=cancel?'unflip':'flip';
		var styles=getComputedStyle(c.class('transitioning',1)[0]),transitions=styles.transitionProperty.split(',').map(function(p){return p.trim()}),duration=parseFloat(styles.transitionDuration)*1000;
		var transitionEnd=function(v){transitions.remove(v.propertyName);if(!transitions.length){
			c.class('transitioning',0).class(action,0);c[0].removeEventListener('transitionend',transitionEnd);if(action=='flip'){c.find("form [name='email']").focus()}
		}};c[0].addEventListener('transitionend',transitionEnd);
		window.requestAnimationFrame(function(){
			setTimeout(function(){c.class('flipped',cancel?0:1)},(duration*0.3));
			c.class(action,1);
		});
	});
	on('click','.product.card .get-quote,.flipped.product.card,.flipped.product.card *',function(v){
		v.preventDefault();
	});
	on('submit','.product.card form',function(){
		v.preventDefault();
	});
	on(['input','change'],".product.card form input[name='email']",function(){
		e(".product.card form input[name='email']").val(this.value);
	});
	on('input',".product.card form input[name='length']",function(v){
		var value=temper(this.value,{input:this,min:1.5,increments:0.1});
		if(value.update){this.value=value.value};
	});
	on('change',".product.card form input[name='length']",function(v){
		this.value=temper(this.value,{min:1.5,increments:0.1});
	});
	on('click','.product.card form .send:not(.wait)',function(v){
		var t=e(this).class('wait',1).val('WAIT'),obj={};t.closest('form').find("[name]").forEach(function(input){var t=e(input);
			obj[t.attr('name')]=t.val();
		});obj.sku=t.closest('.product').attr('data-sku');
		e.ajax('get','/api/quote',obj,function(x,d){
			if(x.status==200){
				alert("Success! Your quote request has been received and we'll get back to you as soon as we can.");
				t[0].nextElementSibling.click();
			}else{
				alert(d.error||x.responseText);
			};t.class('wait',0).val('GET QUOTE');
		});
	});

};if(window.ready){cardJS()}else{window.addEventListener('ready',cardJS)};
