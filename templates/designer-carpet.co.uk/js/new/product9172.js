window.product={id:location.pathname.match(/^\/(\d+)/)[1]}
window.addEventListener('ready',function(){

	e.ajax('get','/api/products',{id:product.id,limit:1,context:'productpage'},function(x,d){
		if(x.status==200){if(!d){return}

			//Add in server info
			window.product.add(d);

			//Fix canonical?
			product.pathname='/'+product.id+'/'+product.name.toLowerCase().replace(/ /g,'-');if(location.pathname!=product.pathname){
				document.querySelector("link[rel='canonical']").href=location.origin+product.pathname;
			}

			//Convert prices.
			['price','price_sqm','price_sqm_2','price_sqm_3','retail','retail_sqm'].forEach(function(p){
				product[p]=parseFloat(product[p]);if(isNaN(product[p])){product[p]=null};
			});

			//Attach tags as properties.
			var processed={};product.tags.forEach(function(t){
				var type=t.type.toLowerCase().replace(/\s/,'_')
				if(!/tag/.test(type)){
					if(!processed[type]){
						product[type]=t.name;
						processed[type]=[t.name];
					}else{
						processed[type].push(t.name);
						product[/y$/.test(type)?type.slice(0,-1)+'ies':type+'s']=processed[type];
					}
				}
				if(/tag|category|status/i.test(type)){
					product[t.name.toLowerCase()]=true;
				};
			});

			//Quotable?
			//product.quotable=product.carpet&&/Riviera/.test(product.brand);

			//Meta title.
			var meta_title=product.meta_title||(product.remnant?default_meta_titles.remnants:product.carpet?product.quotable?default_meta_titles.quotables:default_meta_titles.carpets:product.roll?default_meta_titles.rolls:undefined)||(product.name+(product.price_sqm_3?" | £"+product.price_sqm_3+" - £"+product.price_sqm+"m²":''));if(meta_title){
				if(/{{/.test(meta_title)){
					let r=/{{price_sqm}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,'£'+product.price_sqm.toFixed(2)+'m²')};
					r=/{{retail_sqm}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,'£'+product.retail_sqm.toFixed(2)+'m²')};
					r=/{{saving}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,(product.saving=product.saving=(100-((product.price_sqm/product.retail_sqm)*100))||0).toFixed(2)+'%')};
					r=/{{year}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,new Date().getFullYear())};
					r=/{{month}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,('00'+new Date().getMonth()+1).slice(-2))};
					r=/{{name}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.name)};
					r=/{{brand}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.brand)};
					r=/{{type}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.type)};
					r=/{{composition}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.composition)};
					r=/{{colour}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.colour)};
					r=/{{style}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.style)};
					r=/{{range}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.range)};
					r=/{{length}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.length)};
					r=/{{width}}/;if(r.test(meta_title)){meta_title=meta_title.replace(r,product.width)};
				}
				document.title=meta_title+" | "+document.title.replace(/.*\|\s*/,'');
			}

			//Meta description
			var meta_description=product.meta_description||(product.remnant?default_meta_descriptions.remnants:product.carpet?product.quotable?default_meta_descriptions.quotables:default_meta_descriptions.carpets:product.roll?default_meta_descriptions.rolls:undefined)||("Buy "+product.name+" online today - Great Service From Leading UK Supplier - 5 Star Reviews");if(meta_description){
				if(/{{/.test(meta_description)){
                    let r=/{{price_sqm}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,'£'+product.price_sqm.toFixed(2)+'m²')};
					//let r=/{{price_sqm}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,(product.price_sqm_3?'£'+product.price_sqm_3.toFixed(2)+'m² - ':'')+'£'+product.price_sqm.toFixed(2)+'m²')};
					r=/{{retail_sqm}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,'£'+product.retail_sqm.toFixed(2)+'m²')};
					r=/{{saving}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,(product.saving=product.saving=(100-((product.price_sqm/product.retail_sqm)*100))||0).toFixed(2)+'%')};
					r=/{{year}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,new Date().getFullYear())};
					r=/{{month}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,('00'+new Date().getMonth()+1).slice(-2))};
					r=/{{name}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.name)};
					r=/{{brand}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.brand)};
					r=/{{type}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.type)};
					r=/{{composition}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.composition)};
					r=/{{colour}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.colour)};
					r=/{{style}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.style)};
					r=/{{range}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.range)};
					r=/{{length}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.length)};
					r=/{{width}}/;if(r.test(meta_description)){meta_description=meta_description.replace(r,product.width)};
				}
				var el=document.querySelector("meta[name='description']"),create=!el;if(create){el=document.createElement('meta');el.setAttribute('name','description')};
				el.setAttribute('content',meta_description);if(create){document.head.appendChild(el)};
			}

			//Noindex?
			product.hasTag=function(t){if(t.trim){t={name:t}};return !!product.tags.find(t)[0]};
			if(product.noindex=product.hasTag('noindex')||product.hasTag('hidden')||product.hasTag('gone')||product.hasTag('discontinued')){
				var robots=document.createElement('meta');robots.name='robots';robots.setAttribute('content','noindex, follow');document.head.appendChild(robots);
			}

			//Insert name into DOM.
			e("#Name").val(product.name);
			
            if (product.real_name) {e("#ProductInfo [data-reflect='real_name']").val("Real Name: " + product.real_name)};if(window.admin){e("#ProductInfo [data-reflect='real_name']").show()};

			//Supplier code
			if (product.supplier_code) {e("#ProductInfo [data-reflect='supplier_code']").val("Supplier Code: " + product.supplier_code)};if(window.admin){e("#ProductInfo [data-reflect='supplier_code']").show()};

			//Save full prices.
			product.full_price=product.price;
			product.full_retail=product.retail;

			//Process length URL parameter.
			product.full_length=!/^x/.test(product.sku)?product.length:undefined;
			var length;if(length=urlParams().length){
				product.length=parseFloat(length);
				if(isNaN(product.length)||product.full_length&&product.length>(product.full_length-4)){
					product.length=product.full_length;
				}else if(product.remnant){
					product.sku+='-'+('00'+String(Math.round(product.length*100))).slice(-4);
				}
			};

			//Process width URL parameter.
			if(product.widths){product.widths=product.widths.sort().reverse();product.width=product.widths[0]};
			product.full_width=product.tags.some(function(t){return t.type=='Width'})?undefined:product.width;
			var width;if(width=urlParams().width){
				if(product.carpet){
					if((product.widths||[product.width]).indexOf(width)>=0){
						product.width=width;
					}
				}else if(product.full_width>=3&&product.length<=2.5&&(product.full_width+0.5)>=width){
					//Remnant width cut
					product.width=width;
					product.sku+='w'+('00'+String(product.width*100)).slice(-4);
				}
			};

			var meta=document.querySelector("meta[property='og:title']"),exists=!!meta,append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','og:title')};meta.setAttribute('content',product.name+(product.remnant||product.rug?" ("+product.length+"m x "+product.width+"m)":''));if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='og:type']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','og:type')};meta.setAttribute('content','product');if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='og:description']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','og:description')};meta.setAttribute('content',product.carpet?'Carpet':product.rug?'Rug':product.remnant?'Carpet Remnant':undefined);if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='og:url']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','og:url')};meta.setAttribute('content',location.origin+product.pathname);if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='og:image']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','og:image')};meta.setAttribute('content',location.origin+product.images[1]);if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='product:retailer_item_id']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:retailer_item_id')};meta.setAttribute('content',product.sku);if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='product:brand']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:brand')};meta.setAttribute('content',product.brand);if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='product:availability']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:condition')};meta.setAttribute('content','in stock');if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='product:condition']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:condition')};meta.setAttribute('content','new');if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='product:price:amount']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:price:amount')};meta.setAttribute('content',product.price||product.price_sqm);if(append){document.head.appendChild(meta)};
			meta=document.querySelector("meta[property='product:price:currency']");exists=!!meta;append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:price:currency')};meta.setAttribute('content','GBP');if(append){document.head.appendChild(meta)};

			//Insert SKU into DOM.
			e("#SKU").val(product.sku);

			//Stainguard?
			var no_stainguard=product.tags.some(function(tag){return /polyprop/i.test(tag.name)?((tag.name.match(/(\d*)% polyprop/i)||[])[1]||0)>=80:/westex|ryalux|brintons|accessory|manmade|no stainguard|coir matting/i.test(tag.name)})
			if(!no_stainguard){
				e.ajax('get','/api/products',{sku:'sg001',limit:1,context:'stainguard'},function(x,d){
					if(x.status==200){
						window.stainguard=d;
						if(urlParams().stainguard){e("#AddStainguard").class('active',1)};
						e("#AddStainguard").trigger('update');
						if(!product.quote_only){e('#AddStainguard, .stainguard').show()};
					}
				});
			}

			//Auto add?
			if(location.hash=='#add'&&!(product.out_of_stock||product.reserved)){
				once('update',!no_stainguard&&urlParams().stainguard?'#AddStainguard':'#Price',function(){
					location.hash='';e('#AddToBasket').click();
				});
			};

			//Sample Button?
			product.underlay=/underlay/i.test(product.name);
			if(product.hasTag('No Sample')){
				e('#AddSample').hide();
			}

			//Input conditions.
			product.antislip=/anti-slip/i.test(product.name);
			product.grippers=/grippers/i.test(product.name);
			product.matting=/matting/i.test(product.name);
            product.itc=/silk touch/i.test(product.name);
			product.runner=/^r/i.test(product.sku);
			if(product.carpet){
				if(product.matting){
					product.min_length=0.5;product.max_cut=Infinity;product.length_increments=0.1;
				}else if(product.itc){
				product.min_length=3;product.max_cut=Infinity;product.length_increments=0.1;
			}else{
					product.min_length=1.5;product.max_cut=Infinity;product.length_increments=0.1;
				}
			}else if(product.runner){
				product.min_length=1;product.max_cut=Infinity;product.length_increments=0.1;
			}else if(product.grippers){
				product.min_length=15;product.length_increments=15;
			}else if(product.underlay){
				product.min_area=5;product.area_increments=5;
			}else{
				product.min_length=0.5;product.max_cut=product.full_length>4?product.full_length-4:undefined;product.length_increments=0.1;
			}
                          
            //Hide width/stainguard section for standard accessories
            if(product.accessory&&!product.antislip&&!product.underlay&&!product.grippers){ 
                e('.carpet-options').hide();
            }
                          
            if(product.carpet || product.runner){
                e("#minOrderLength span").val(product.min_length);
                e('#minOrderLength').show();   
            }

			//Show length...
			if(product.carpet){
				e("#Length input").show()
			}else if(product.runner){
				e("#Length input").show()
			}else if(product.roll&&product.length==product.full_length){
				e("#Length select").val([product.full_length,'6','5.5','5','4.5','4','3.5','3','2.5','2','1.5','1','0.5','Custom (Max '+(product.max_cut.toFixed(2))+'m)']).show();
			}else if(product.grippers){
				e("#Length select").val(['15','30','45','60','75','90','105','120','135','150','Custom (15m increments)']).show().trigger('change');
			}else if(product.accessory&&!product.antislip){
				e('#Length').hide();
			}else{
				e('#Length span').show();
			};

			//Show width...
			if(product.carpet){
				e("#Width select").val(product.widths||[product.width]).show()
			}else if(product.accessory&&!product.antislip){
				e('#Width').hide();
			}else{
				e("#Width span").show();
			};

			//Show area?
			if(product.underlay){
				var select=e("#Area select");select.val(['5','10','15','20','25','30','35','40','45','50','55','60','65','70','75','Custom (5m² increments)']);select.find('option').forEach(function(o){o.setAttribute('value',o.innerText)});
				//['15','30','45','60','75'].forEach(function(v,i){
				//	select.find("option[value='"+v+"']")[0].innerText=v+' ('+(i+1)+' Roll'+(i>0?'s':'')+')'
				//});
				var initial=15;if(window.order){
					var order_area=(window.order.items||[]).map(function(item){return item.area}).reduce(function(value,current){return value+=current},0);
					if(order_area){initial=order_area.nearest(5,'ceil')}
				}
				select.val(initial).show().trigger('change');
			}else{
				e("#Area").hide();
			};

			

			//Show Quantity?
			if(product.accessory&&!product.underlay&&!product.grippers)
			e('#Quantity').show();

			//Tiered?
			if(product.carpet){
				if(product.brand=='Westex'){
					e('#WestexPriceTiers').val([product.price_sqm,product.price_sqm_3]).show();
				}else{
					e('#PriceTiers').val([product.price_sqm,product.price_sqm_2,product.price_sqm_3]).show();
				}
			};

			//Out of stock?
			product.out_of_stock=product.stock!=null&&(!/^cc/i.test(product.sku))&&product.stock<1;
			if(product.out_of_stock){
				e('#AddToBasket').hide();
				e("#OutOfStock").show();
			};

			//Reserved?
			if(product.reserved){
				e('#AddToBasket').hide();
				e("#Reserved").show();
			};

			//Retail information?
			if(!(product.retail||product.retail_sqm)){
				e('#Saving').hide();
			}

			/*
			//Get quote?
			product.quote_only=product.quotable&&!admin;if(product.quote_only){
				e('#Price,#WestexPriceTiers,#PriceTiers,#Saving,#AddToBasket').hide();
				e('#GetQuote').show();
			}
			*/

			//Show width label on big image?
			if(product.carpet||product.remnant){
				e('#ImageWidthLabel').show();
			}

			//Tabs...
			if(!product.description){
				e("#DescriptionTab").hide();
			};
			if(product.accessory){
				e("#AccessoriesTab").hide();
			};
			if(product.accessory&&!product.underlay){
				e("#StatsTab").hide();
			};
			if(!product.remnant||product.hasTag('No Rug')){
				e('#Product').class('no-rug',1);
				e("#RugTab,button[data-action='make_rug']").hide();
			};
			var first=e("#Tabs .tab:not(.hidden)")[0];if(first){first.click()};

			//Resolve images.
			product.images=product.images.map(function(src){return "https://cdn.designer-carpet.co.uk"+src})
			product.thumbnails=product.images.filter(function(src){return !/_big/.test(src)})
			product.thumbnail=product.thumbnails[0]||'https://cdn.designer-carpet.co.uk/images/icons/coming-soon-large-min.png';

			//Insert images (deferred).
			window.requestAnimationFrame(function(){e("#Images").val(product.images)});

			//Set length
			product.weight_sqm=product.carpet?product.weight:product.weight/product.area;
			e("#Length:not(.hidden)").val(product.length);

			//Set width
			e("#Width:not(.hidden)").val(product.width||(product.widths||[])[0],{update:{area:false}});

			//Set carpet price
			if(product.carpet){
				e("#Price").val(product.price_sqm);
			
				//Set carpet retail/saving
				e("#Retail").val(product.retail_sqm);
				if(product.saving==undefined){product.saving=(100-((product.price_sqm/product.retail_sqm)*100))||0};
				e("#Saving [data-reflect='saving']").val(product.saving);
			//set runner price
			}else if(product.runner){
				e("#Price").val(product.price);
			
				//Set runner retail/saving
				e("#Retail").val(product.retail);
				if(product.saving==undefined){product.saving=(100-((product.price/product.retail)*100))||0};
				e("#Saving [data-reflect='saving']").val(product.saving);
			};


			//Update area.
			if(product.carpet||product.runner||product.length<product.full_length||product.width<product.full_width){e("#Area").trigger('update')};
			
			//Update price?
			if((!product.carpet&&!product.runner&&product.length==product.full_length)||!(product.length||product.width||product.area)){
				e("#Price,#AddStainguard:not(.hidden)").trigger('update')
			};
		
			//Set breadcrumbs.
			//e("#Breadcrumbs [data-reflect='home']").val(location.origin);
			//e("#Breadcrumbs [data-reflect='category']").val(product.carpet?'Carpets':product.remnant?'Remnants':product.accessory?'Accessories':undefined);
			//e("#Breadcrumbs [data-reflect='brand']").val(product.brand);
			//e("#Breadcrumbs [data-reflect='range']").val(product.range);
			//e("#Breadcrumbs [data-reflect='quality']").val(product.quality);
			//e("#Breadcrumbs [data-reflect='range_colour']").val(product.range_colour);

			//Carpet defaults
			if(product.carpet&&product.length==null&&!product.quote_only){
				e("#AddToBasket").hide();
				e("#PriceM2").show();
			};
			//Runner default
			if(product.runner&&product.length==null){
				e("#AddToBasket").hide();
			};

			//Load styles and show.
			//var style=document.createElement('link');style.setAttribute('rel','stylesheet');style.setAttribute('href','https://designer-carpet.co.uk/css/product.css?v=270121');document.body.appendChild(style);
			//style.addEventListener('load',function(){
				//e('#Product,#Quotes').show();
			//})
            
            //Show the product
            e('#Product,#Quotes').show();

			//Social
			//var fb=e('#Share .facebook');if(fb[0]){fb[0].href+=location.href};
			//var twitter=e('#Share .twitter');if(twitter[0]){twitter[0].href+=location.href+"&text="+product.name+"&hastags=DesignerCarpet"};
			//var gplus=e('#Share .google');if(gplus[0]){gplus[0].href+=location.href};
			//var linkedin=e('#Share .linkedin');if(linkedin[0]){linkedin[0].href+=location.href};
			//var reddit=e('#Share .reddit');if(reddit[0]){reddit[0].href+=location.href+"&title="+product.name};
			//var tumblr=e('#Share .tumblr');if(tumblr[0]){tumblr[0].href+=location.href+"&title="+product.name};
			//var email=e('#Share .email');if(email[0]){email.href="mailto:?Subject=Designer Carpet&Body="+product.name+" "+location.href};

			//Recommendations
			if(product.remnant){

				//More sizes
				e.ajax('get','/api/products',{context:'recommendations',"name.like":product.name.replace(/\s\*b-grade\*/i,'')+'%',tags:'Remnant',"id.not":product.id,limit:4},function(x,d){
					if(x.status==200){
						window.more_sizes=d;if(window.order_more){e("#Recommendations").trigger('update')};
					}
				});

				//Order more
				e.ajax('get','/api/products',{context:'recommendations',"name.like":product.name.replace(/\s\*b-grade\*/i,'')+'%',tags:'Carpet',limit:1},function(x,d){
					if(x.status==200){
						window.order_more=d;if(window.more_sizes){e("#Recommendations").trigger('update')};
					}
				});

			}else if(product.carpet){

				//Remnants of this carpet
				e.ajax('get','/api/products',{context:'recommendations',name:product.name,tags:'Remnant',limit:4},function(x,d){
					if(x.status==200){window.remnants_of_this_carpet=d;

						//Remnants of this range
						e.ajax('get','/api/products',{context:'recommendations',"name.like":product.brand+' '+product.range+'%',tags:'Remnant',limit:4}.add(remnants_of_this_carpet.products.length?{"id.not":window.remnants_of_this_carpet.products.map(function(r){return r.id}).join(',')}:undefined),function(x,d){
							if(x.status==200){
								window.remnants_in_this_range=d;e("#Recommendations").trigger('update');
							}
						});

					}
				});
			}

			//Update category?
			if(!product.remnant){
				e("#Search select,#CategoryFilter select").val(window.category=product.category.toLowerCase())
			}

			//Fill out some more properties for later handlers.
			product.naturals=/sisal|sisool|coir|jute|seagrass/i.test(product.type);

			
            if(product.notes) { 
                //Mini Description
			     e("#Overview p").val(product.notes);
                e("#Overview").show();
            }


		}
	});

	//BREADCRUMBS
	//on('set.before',"#Breadcrumbs a[data-reflect='home']",function(p){
	//	this.href=p.value;return false;
	//});
	on('set',"#Breadcrumbs a",function(p){
		var t=this,type=t.getAttribute('data-reflect'),rc=type=='range_colour',prev=e.prev(rc?"[data-reflect='brand']":'[href]',this)[0],search=rc||(type=='range'&&product.remnant);
		var href=prev?prev.getAttribute('href')+'/':'';if(search){href=href.replace(/\/(carpet|remnant)s\//i,'/search/$1/')};href+=p.value.toLowerCase().replace(/\s/g,'-')
		this.setAttribute('href',href);if(type=='home'){this.textContent='Home'};
	});

	//IMAGES
	on('set','#Images',function(p){
		var big=p.value.first(/_big/);
		if(!big){big='/images/icons/coming-soon-large-min.png';e('#ImageWidthLabel').hide()};
		var img=e("#BigImage img");img.val(big);img[0].setAttribute('alt',product.name+(product.carpet?' Carpet':product.remnant?' Carpet Remnant':product.rug?' Rug':product.runner?' Runner':''))
		if(product.thumbnails.length>1){e("#Thumbnails").val(product.thumbnails)};
	});
	on('click','#Thumbnails img',function(){
		e('#ImageWidthLabel')[(product.carpet||product.remnant)&&e(this).is('img:first-child')?'show':'hide']();
		e('#BigImage img').val(this.src.replace(/(\.[^.]*)$/,"_big$1"));
	});

	//ZOOM
	/*on('click','#BigImage img,#ZoomButton',function(){
		var eImg=e('#BigImage img'),img=eImg[0],clone=img.cloneNode(true);clone.id='';clone.style.opacity='0';e(clone).class('clone',1);

		var from=img.getBoundingClientRect();
		img.parentElement.insertBefore(clone,img);
		e('#Zoom').add(img).show();
		var to=img.getBoundingClientRect();

		img.style.position='fixed';
		img.style.top=from.top+'px';
		img.style.left=from.left+'px';
		img.style.height=from.height+'px';
		img.style.width=from.width+'px';

		eImg.class('transitioning',1);
		var transitions=getComputedStyle(img).transitionProperty.split(',').map(function(p){return p.trim()});
		var transitionEnd=function(v){
			transitions.splice(transitions.indexOf(v.propertyName),1);
			if(!transitions.length){
				eImg.class('transitioning',0);img.style='';img.removeEventListener('transitionend',transitionEnd);
			};
		};img.addEventListener('transitionend',transitionEnd);

		requestAnimationFrame(function(){
			img.style.top=to.top+'px';
			img.style.left=to.left+'px';
			img.style.height=to.height+'px';
			img.style.width=to.width+'px';
		});

		return false;

	});
	on('click','#Zoom,#Zoom *',function(){

		var eImg=e('#Zoom img'),img=eImg[0];
		var clone=e('#Images img.clone')[0];

		var from=img.getBoundingClientRect();
		var to=clone.getBoundingClientRect();

		img.style.position='fixed';
		img.style.zIndex='999';
		img.style.top=from.top+'px';
		img.style.left=from.left+'px';
		img.style.height=from.height+'px';
		img.style.width=from.width+'px';

		clone.parentElement.insertBefore(img,clone);
		e('#Zoom').hide();

		eImg.class('transitioning',1);
		var transitions=getComputedStyle(img).transitionProperty.split(',').map(function(p){return p.trim()});
		var transitionEnd=function(v){
			transitions.splice(transitions.indexOf(v.propertyName),1);
			if(!transitions.length){
				clone.parentElement.removeChild(clone);
				eImg.class('transitioning',0);img.setAttribute('style','');img.removeEventListener('transitionend',transitionEnd);
			};
		};img.addEventListener('transitionend',transitionEnd);

		requestAnimationFrame(function(){
			img.style.top=to.top+'px';
			img.style.left=to.left+'px';
			img.style.height=to.height+'px';
			img.style.width=to.width+'px';
		});

	});*/

	//SIZE
	on('set','#Size select',function(p){if(!p.value||!p.value.pop){return};
		var t=this;t.innerHTML='';p.value.forEach(function(o){
			t.insertAdjacentHTML('beforeEnd',"<option>"+o+"</option>")
		});
	});
	on('show','#Length>*,#Width>*,#Area>*',function(){
		var t=e(this);if(t.prev().is('.custom')){return};
		t.siblings().hide();
	});

	//TEMPER
	if(!window.temper){
		window.temper=function(a,b){
			var value=a,options=b,update=false;value=parseFloat(value)||options.min;
			if(options.increments){
				value=value.nearest(options.increments,options.round||'ceil');
				if(options.increments<1){var places=(String(value).split('.')[1]||'').length,max_places=(String(options.increments).split('.')[1]||'').length;
					if(places>max_places){value=parseFloat(value.toFixed(max_places));if(options.input){update=true}};
				};
			}
			if(value<options.min){value=options.min};if(value>options.max){value=options.max};
			return update ? {update:true,value:value} : value;
		};
	}


	//LENGTH
	on('set','#Length',function(d){
		e("#Length>*:not(.hidden):not(.custom)").val(product.length=d.value);
		if((!d.update||d.update.area!=false)){e('#Area').trigger('update')};
	});
	on('change','#Length select',function(){
		var custom=/custom/i.test(this.value),input=e("#Length input");e(this).class('custom',custom?1:0);
		product.length=!custom?parseFloat(this.value):product.max_cut||product.length||null;
		input.val(product.length.toFixed(2))[custom?'show':'hide']();if(custom){input.focus()};
		e('#'+(product.width?'Area':'Price')).trigger('update');
	});
	
	on('change','#Length input',function(v){
		product.length=temper(this.value,{input:this,min:product.min_length,max:product.max_cut,increments:product.length_increments});
		if(product.length.update){this.value=product.length=product.length.value};
		e('#'+(product.width?'Area':'Price')).trigger('update');
		if(!product.quote_only){
			e('#AddToBasket').show();
			e("#PriceM2").hide();
		}
	});
	on('input','#Length input',function(v){
		product.length=temper(this.value,{input:this,min:product.min_length,max:product.max_cut,increments:product.length_increments});
		if(product.length.update){this.value=product.length=product.length.value};
		e('#'+(product.width?'Area':'Price')).trigger('update');
		if(!product.quote_only){
			e('#AddToBasket').show();
			e("#PriceM2").hide();
		}
	});
	on('change','#Length input',function(){
		product.length=temper(this.value,{min:product.min_length,max:product.max_cut,increments:product.length_increments});
		e('#Length').val(product.length);
	});

	//WIDTH
	on('set','#Width',function(d){
		e("#Width>*:not(.hidden)").val(d.value);product.width=parseFloat(d.value);
		if((!d.update||d.update.area!=false)){e('#Area').trigger('update')};
	});
	on('change','#Width select',function(){
		product.width=parseFloat(this.value);
		if(product.brand=='Westex'){
			product.min_length=product.width==1?5:1.5;
			e("#Length input").trigger('change')
		}
		if(product.length !== null){
			e('#'+(product.length?'Area':'Price')).trigger('update');
		}
	});

	//AREA
	on('set','#Area',function(d){
		var element=document.querySelector("#Area>*:not(.hidden):not(.custom)");if(d.from!=element){
			e(element).val(product.area=d.value);
		}
		e(this).trigger('update',{value:product.area,from:d.from});
	});
	on('set.before','#Area select',function(d){
		if(d.value&&d.value.constructor==Number&&d.value>75){var select=this,area=d.value;
			d.value=[].slice.call(this.querySelectorAll('option'),-1)[0].value;
			setTimeout(function(){e(select.nextElementSibling).val(area).trigger('change',{from:select})},0);
		}
	})
	on('change','#Area select',function(){
		var custom=/custom/i.test(this.value),input=e("#Area input");e(this).class('custom',custom?1:0);
		product.area=!custom?parseFloat(this.value):product.area||null;
		input.val(product.area)[custom?'show':'hide']();if(custom){input.focus()};
		e("#Price").trigger('update');
	});
	on(['input','change'],'#Area input',function(d){
		product.area=temper(this.value,{input:this,min:product.min_area,increments:product.area_increments});
		if(product.area.update){this.value=product.area=product.area.value};
		e('#Price').trigger('update');
	});
	//on('change','#Area input',function(d){
	//	product.area=temper(this.value,{min:product.min_area,increments:product.area_increments})
	//	e('#Area').val(product.area,{from:d.detail&&d.detail.from});
	//});
	on('update','#Area',function(d){
		if(!product.length||!product.width){return}
		if(!d.detail.value){
			product.area=product.length*product.width;if(!product.area){return}else{product.area=product.area.nearest(0.01)};
			if(!match(d.from,"#Area:not(.hidden)>*:not(.hidden)")){
				e("#Area:not(.hidden)>*:not(.hidden)").val(product.area);
			};
		}
		product.weight=product.area*product.weight_sqm;
		if(product.carpet){
			e(product.brand=='Westex'?"#WestexPriceTiers":"#PriceTiers").trigger('update');
		};
		e("#Price").trigger('update');
		if(window.stainguard){e("#AddStainguard:not(.hidden)").trigger('update')};
	});

	//TIERS
	on('set.before','#PriceTiers',function(p){
		var reflections=e(this).find("[data-reflect^='price_sqm']");
		p.value.forEach(function(p,i){
			e(reflections[i]).val(p);
		});
		return false;
	});
	on('update','#PriceTiers',function(){
		product.tier=product.area<50?1:product.area<100?2:3;
		e("#PriceTiers div:nth-of-type("+product.tier+")").class('active',1).siblings('.active').class('active',0);
	});

	//WESTEX TIERS
	on('set.before','#WestexPriceTiers',function(p){
		var reflections=e(this).find("[data-reflect^='price_sqm']");
		p.value.forEach(function(p,i){
			e(reflections[i]).val(p);
		});
		return false;
	});
	on('update','#WestexPriceTiers',function(){
		var tier=product.tier=product.area<80?1:3,nth=tier==3?2:1;
		e("#WestexPriceTiers div:nth-of-type("+nth+")").class('active',1).siblings('.active').class('active',0);
	});


	//PRICE
	on('update','#Price',function(){
		if(product.grippers||product.runner){
			e("#Price").val(product.price=product.full_price*product.length);
			e("#Retail").val(product.retail=product.full_retail*product.length);
		}else{
			if(product.tier==3){
				product.price=product.price_sqm_3*product.area;
			}else if(product.tier==2){
				product.price=product.price_sqm_2*product.area;
			}else if(product.length<product.full_length&&!product.roll){
				product.price=Math.round(product.cut_price*product.area);
			}else if(product.width<product.full_width){var remaining={length:product.length,width:product.full_width-product.width}
				product.price=Math.round(((remaining.length<1.2||remaining.width<1.2)||(remaining.length<1.8&&remaining.width<1.8)) ? product.full_price : product.full_price*(1-((remaining.width>3&&remaining.width<4.5?0.95:0.85)-(product.width/product.full_width))));
			}else{
				product.price=(!product.price_sqm||(product.length&&product.length==product.full_length)?product.full_price:product.carpet?product.price_sqm*product.area:Math.round(product.price_sqm*product.area));
			};e('#Price').val(product.price);
			e("#Retail").val(product.retail=(product.retail_sqm&&(product.carpet||product.underlay||(product.length<product.full_length)||(product.width<product.full_width))?Math.round(product.retail_sqm*product.area):product.full_retail));
		};
		e("#Saving").trigger('update');

		//OpenGraph Data (Facebook)
		var meta=document.querySelector("meta[property='product:price:amount']"),exists=!!meta,append=!exists;if(!exists){meta=document.createElement('meta');meta.setAttribute('property','product:price:amount')};meta.setAttribute('content',product.carpet?product.price_sqm.toFixed(2):product.price.toFixed(2));if(append){document.head.appendChild(meta)};

		//Structured data
		if(!window.structured_data){
			var jsonld=document.createElement('script');jsonld.setAttribute('type','application/ld+json');
			jsonld.innerHTML=JSON.stringify(window.structured_data={
				"@context":"https://schema.org/",
				"@type":"Product",
				productID:product.sku,
				name:product.name+(product.rug||product.remnant?" ("+product.length+" m x "+product.width+"m)":""),
				sku:product.sku,
				brand:product.brand,
				depth:product.length,
				width:product.width,
				description:product.description,
				color:(product.colours||[product.colour]).join(', '),
				category:(product.categories||[product.category]).join(', '),
				image:product.images[1],
				offers:product.carpet?{
					"@type":"AggregateOffer",
					availability:"http://schema.org/InStock",
					url:location.href,
					lowPrice:product.price_sqm_3.toFixed(2),
					highPrice:product.price_sqm.toFixed(2),
					priceCurrency:'GBP',
					offerCount:3
				}:{
					"@type":"Offer",
					availability:"http://schema.org/InStock",
					url:location.href,
					price:product.price.toFixed(2),
					priceCurrency:'GBP'
				}
			});
			document.head.appendChild(jsonld);
		}

		//GTM (NEW)
		dataLayer.push({
			'ecommerce':{
				'currencyCode':'GBP',
				'impressions':[
					{
						'name':product.name,
						'id':product.sku,
						'price':product.price,
						'brand':product.brand,
						'category':product.category,
					}
				]
			}
		});

	})

	//SAVING
	on('update','#Saving',function(){
		e("#Saving [data-reflect='saving']").val(product.saving=(100-((product.price/product.retail)*100))||0);
	});

	//STAINGUARD
	on('update','#AddStainguard',function(){
		var extra=(stainguard.price=(stainguard.price_sqm*product.area)).toFixed(2);
        
        // If the stainguard costs less than £9, set it to the minimum
        if (extra < 9) {
            //Shown to users
            var extra='9.00';
            //Value added to basket
            stainguard.price = 9;
        }
        
		e("#AddStainguard [data-reflect='extra'],#StainguardPopup [data-reflect='extra']").val(extra);
	});
	on('click','#AddStainguard,#AddStainguard *',function(){
		e(this).closest('button').class('active',2);
	});
    on('click','.question-mark, .question-mark *',function(){
		e(this).closest('div').class('open',2);
	});
    

	//QUEUE JUMP
//	on('update','#AddQueueJump',function(){
//		var extra=(40).toFixed(2);
//		e("#AddQueueJump [data-reflect='extra']").val(extra);
//	});
//	on('click','#AddQueueJump,#AddQueueJump *',function(){
//		e(this).closest('button').class('active',2);
//	});

	//STAINGUARD POPUP
	on('show','#StainguardPopup',function(d){
		e(this).class('rug',d.rug?1:0);
	});
	on('click','#StainguardPopup,#StainguardPopup .close',function(){
		e(e('#StainguardPopup.rug')[0]?'#OrderRug':'#AddToBasket').trigger('click',{nagged:true});
	});
	on('click','#StainguardPopup .no',function(){
		e(e('#StainguardPopup.rug')[0]?'#OrderRug':'#AddToBasket').trigger('click',{nagged:true});
	});
	on('click','#StainguardPopup .yes,#StainguardPopup .yes *',function(){
		e('#AddStainguard').class('active',1);
		e(e('#StainguardPopup.rug')[0]?'#OrderRug':'#AddToBasket').trigger('click',{nagged:true});
	});

	//ADD TO BASKET
	on('click','#AddToBasket',function(v){var d=v.detail||{};

		//Length check...
		var base_sku_regex=/(?:-.*|w\d+)$/g,base_sku=product.sku.replace(base_sku_regex,'');
		var same_sku=order.items.filter(function(item){return item.sku.replace(base_sku_regex,'')==base_sku});
		var constraint=/^cc/.test(product.sku)?undefined:/^s.*w/.test(product.sku)?'width':'length';if(constraint&&!d.sample){
			var total=same_sku.reduce(function(total,item){return total+item[constraint]},0);
			var max=product['full_'+constraint]||NaN;if(total&&constraint=='length'){max-=4};
			if((total+product[constraint])>max){
				alert('You have too much of this product in your basket already.');return;
			}
		}

		//Stainguard?
		if(!d.sample&&!d.nagged&&e('#AddStainguard:not(.hidden):not(.active)')[0]){
			e('#StainguardPopup').show(d);return;
		}

		//Clone...
		var item=product.clone();item.url=location.href;delete item.hasTag;delete item.images;delete item.thumbnails;delete item.description;

		//Bespoke rug?
		if(item.bespoke_rug=!!d.rug){var rug=item.rug=d.rug;
			item.price+=rug.extra;item.name+=" ("+rug.length+"m x "+rug.width+"m "+rug.border+" Rug) (PP)";
		};

		//Add to name...
		if(item.underlay){
			item.name+=" ("+item.area+"m²)"
		}else if(item.length<item.full_length){
			item.name+=" ("+item.length+"m x "+item.width+"m Cut)";item.cut='length';
		}else if(item.width<item.full_width&&((item.full_width-(item.width+0.05))>1.2)){
			item.name+=" ("+item.length+"m x "+item.width+"m Cut)";item.cut='width';
		}else if(item.length&&item.width){
			item.name+=" ("+item.length+"m x "+item.width+"m)"
		}else if(item.length){
			item.name+=" ("+item.length+"m)"
		}

		//How many in quantity
		item.quantity=e('#Quantity input').val();

		//Stainguard?
		if(e("#AddStainguard.active")[0]){
			item.price+=stainguard.price;item.name+=" (With Stainguard)";
		}

		//Sample?
		if(item.sample=!!d.sample){
			item.price=0;item.name+=" (Sample)";item.sample=true;
			if(item.discontinued){item.name+=" (D)"}
		}

		//Replace?
		//if(item.stock==1&&!cuts.length){
		//	order.items.remove({sku:item.sku});
		//}else{
		//	order.items.remove({sku:item.sku,name:/\(sample\)/i});
		//}

		//Facebook add to cart event
		//if(fbq){fbq('track','AddToCart',{content_type:'product',content_ids:[item.sku],contents:[{id:item.sku,quantity:1}]})}

		//Google "Add to Basket" event
		dataLayer.push({'event':'addToCart','ecommerce':{'currencyCode': 'GBP',
    			'add':{
				'products':[{
					'name':item.name,
					'id':item.sku,
					'price':item.price,
					'brand':product.brand,
					'category':product.category
				}]
			}
		}});

		//Add...
		order.items.push(item);sessionStorage['order']=JSON.stringify(order);

		//Queue Jump?
		if(e("#AddQueueJump")[0].checked){
			order.items.push({sku:'cc022',quantity:1,thumbnail:'/images/products/queue-jump/queue-jump.jpg',name:'Priority Queue Jump',price:40});sessionStorage['order']=JSON.stringify(order);
		}

		if(item.sample){
            location.hash='#sampleadded';    
        } else {
            location.hash='#itemadded';
        }
        //Reload
        location.reload();

	});
	
    //Product added text
    if(location.hash=='#itemadded'){
		e('#SampleAdded').hide();		
        e('#ItemAdded, #AddItem').show();        
        //setTimeout(function(){e('#ItemAdded').hide()},3000);
        location.hash='';
	}
    
    //Sample added text
    if(location.hash=='#sampleadded'){
		e('#AddItem').hide();		
        e('#ItemAdded, #SampleAdded').show();        
        //setTimeout(function(){e('#ItemAdded').hide()},3000);
        location.hash='';
	}

	//ADD SAMPLE
	on('click','#AddSample',function(){
		if(order.items.find({name:/sample/i}).length>3&&!e('#AdminBar').length){alert('Sorry, you can only order 4 samples per day.');return};
		e('#AddToBasket').trigger('click',{sample:true});
	});

	//GET QUOTE
	/*
	on('submit','#QuoteForm',function(v){
		v.preventDefault();
	});
	on('click','#GetQuote',function(){
		e('#GetQuote').hide();
		var form=e('#QuoteForm').show(),rect=form[0].getBoundingClientRect();form.find('input').focus();
		form.class('minimised',1);requestAnimationFrame(function(){
			form.class('transitioning',1);var transitions=getComputedStyle(form[0]).transitionProperty.split(',').map(function(p){return p.trim()});
			transitions.some(function(c,i,a){if(c=='padding'){return a.splice.apply(a,[i,1].concat(['padding-top','padding-right','padding-bottom','padding-left']))}});
			var transitionEnd=function(v){if(!transitions.remove(v.propertyName).length){
				form[0].removeEventListener('transitionend',transitionEnd);form.class('transitioning',0).class('minimised',0);form[0].removeAttribute('style');
			}};form[0].addEventListener('transitionend',transitionEnd);requestAnimationFrame(function(){
				form[0].style.padding='10px';form[0].style.paddingTop='30px';form[0].style.height=rect.height+'px';form[0].style.width=rect.width+'px';
			});
		});
	});
	on('click','#QuoteForm:not(.transitioning) .close',function(v){
		e('#QuoteForm').hide();
		e('#GetQuote').show();
	});
	on('click','#QuoteForm .send:not(.wait)',function(){
		var t=e(this).class('wait',1).val('WAIT');
		e.ajax('get','/api/quote',{sku:product.sku,length:product.length,width:product.width.toFixed(2),email:e('#QuoteForm input').val()},function(x,d){
			if(x.status==200){
				alert("Success! Your quote request has been received and we'll get back to you as soon as we can.");
				e('#QuoteForm .close').click();
			}else{
				alert(d.error||x.responseText);
			};t.class('wait',0).val('SEND');
		});
	});
	*/

	//TABS
	on('click','#Tabs .tab:not(.active),#Tabs .tab:not(.active) *',function(){
		var t=e(this).closest('.tab');
		t.class('active',1).siblings('.active').class('active',0);
		e('#'+t.attr('id')+'Content').show();
	});
	on('show','#Tabs>*',function(){
		e(this).class('active',1).siblings('.active').class('active',0).hide();
	});
	on('click','#CollapseTabs,#ExpandTabs',function(){
		e('#Tabs').class('collapsed',2);
	});

	//DESCRIPTION
	on('show','#DescriptionTabContent:not(.loaded)',function(){
		e("#Description").val(product.description)
		e(this).class('loaded',1);
	})

	//STATS
	on('show','#StatsTabContent:not(.loaded)',function(){
		e("#StatsTabContent [data-reflect='composition']").val(product.compositions||product.composition)
		e("#StatsTabContent [data-reflect='construction']").val(product.constructions||product.construction)
		e("#StatsTabContent [data-reflect='type']").val(product.type)
		e("#StatsTabContent [data-reflect='prl']").val(product.prl)
		e("#StatsTabContent [data-reflect='prw']").val(product.prw)
		e("#StatsTabContent [data-reflect='colour']").val(product.colours||product.colour)
		e("#StatsTabContent [data-reflect='suitability']").val(product.suitabilities||product.suitability)
		e("#StatsTabContent [data-reflect='density']").val(product.density)
		e("#StatsTabContent [data-reflect='tog']").val(product.tog)
		e("#StatsTabContent [data-reflect='decibel_rating']").val(product.decibel_rating)
		e("#StatsTabContent [data-reflect='double_stick']").val(product.double_stick)
		e(this).class('loaded',1);
	});
	on('set.before',"#StatsTabContent>*",function(p){
		if(p.value.pop){p.value=p.value.join(', ')};
	});

	//ACCESSORIES
	on('show','#AccessoriesTabContent:not(.loaded)',function(){var t=e(this);
		e.ajax('get','/api/products',{tags:'underlay',context:'card',sort:"name,asc"},function(x,d){
			if(x.status==200){
				t.add(e(".product.card[data-reflect$=':template']").clone());
				if(product.naturals){d.remove({sku:/cc028|cc029|cc027|cc002|cc008|cc006|cc007|cc040|cc041|cc050|cc051|cc052|cc053|cc054|cc056|cc009|cc010|cc011|cc039|cc023|cc024|cc098|cc055|cc100|cc099|cc057/})}
				if((((product.composition||'').match(/(\d+)%\D*Wool/i)||[])[1]||0)<50){d.remove({sku:'cc001'})};
				d.remove({tags:/Hidden|Gone/}); //Remove Hidden Products
				t.val(d);
			};
		});
		e(this).class('loaded',1);
	});

	//RUG BUILDER
	on('click',"button[data-action='make_rug']",function(){
		e('#RugTab').click();
	});
	on('show','#RugTabContent:not(.loaded)',function(){
		e("#RugTabContent img:not(.overlay)").val(product.images[1]);
		e("#RugTabContent [data-reflect='length']").val(product.length);
		e("#RugTabContent [data-reflect='width']").val(product.width);
		e.ajax('get','/api/products',{context:'border',sort:'name,asc'}.add('sku.like','rb%'),function(x,d){
			if(x.status==200){
				var borders=window.borders=d.filter(function(b){if(/whipped/i.test(b.name)&&(product.hasTag('No Whipping')||(product.naturals?!/naturals/i.test(b.name):product.type=='Artificial Grass'?!/nylon/i.test(b.name):!/wool/i.test(b.name)))){return false}else{return true}});
				borders.forEach(function(border){borders[border.sku]=border});
				['rb007','rb097','rb098','rb099'].forEach(function(sku){
					var i=borders.indexOf(borders[sku]);if(i>=0){
						borders.unshift(borders.splice(i,1)[0])
					}
				});
				e("#RugTabContent [data-reflect='borders:array']").val(borders);
			}else{
				alert(d.error||x.responseText);
			};
		});e(this).class('loaded',1);
	});
	on('set.before',"#RugTabContent button[data-reflect='border']",function(p){
		var thumbnail=p.value.thumbnail=p.value.images[0];
		this.setAttribute('data-id',p.value.id);
		if(thumbnail){this.style.backgroundImage="url('"+encodeURI(thumbnail)+"')"};
		p.handled=true;
	});
	on('set',"#RugTabContent button[data-reflect='border']:first-child",function(p){
		e(this).click();
	});
	on('scroll',"#RugTabContent [data-reflect='borders:array']",function(){
		var offset=this.scrollLeft,max=(this.scrollWidth-this.clientWidth)-3,wrapper=this.parentElement,scrolled=wrapper.classList.contains('scrolled'),end=wrapper.classList.contains('end');
		if(offset>0&&!scrolled){wrapper.classList.add('scrolled')}else if(offset==0&&scrolled){wrapper.classList.remove('scrolled')}
		if(offset>=max&&!end){wrapper.classList.add('end')}else if(offset<max&&end){wrapper.classList.remove('end')}
	});
	on('click',"#RugTabContent button[data-reflect='border']",function(){
		e(this).class('active',1).siblings('.active').class('active',0);
		var border=window.borders.first({id:this.getAttribute('data-id')});
		e("#RugTabContent img.overlay").val(border.images[1]||border.images[0]||'');
		e("#RugTabContent [data-reflect='name']").val(border.name);
		e("#RugTabContent [data-reflect='extra']").trigger('update',{border:border});
	});
	on(['input','change'],"#RugTabContent [data-reflect='length']",function(v){
		var length=temper(this.value,{input:this,min:0.1,increments:0.01,max:product.length});
		if(length.update){this.value=length=length.value}else if(v.type=='change'){this.value=length};
		e("#RugTabContent [data-reflect='extra']").trigger('update',{length:length});
	});
	on(['input','change'],"#RugTabContent [data-reflect='width']",function(v){
		var width=temper(this.value,{input:this,min:0.1,increments:0.01,max:product.width});
		if(width.update){this.value=width=width.value}else if(v.type=='change'){this.value=width};
		e("#RugTabContent [data-reflect='extra']").trigger('update',{width:width});
	});
	on('update',"#RugTabContent [data-reflect='extra']",function(v){var d=v.detail||{};
		var border=d.border||window.borders.first({id:e("#RugTabContent [data-reflect='border'].active").attr('data-id')});
		var border_price=border.price;if(/rb097|rb099|rb098/.test(border.sku)&&product.tags.find({name:'Thick'}).length){border_price=8};
		var length=d.length||e("#RugTabContent [data-reflect='length']").val();
		var width=d.width||e("#RugTabContent [data-reflect='width']").val();
		var area=length*width;
		var price=(border_price*((length*2)+(width*2)))+(/herringbone|jute/i.test(border.name)?area>=30?60:area>=25?50:area>=20?40:area>=15?25:0:/whipped/i.test(border.name)?area>=16?25:area>=7?15:0:0);
		e(this).val(price)
	});
	on(['show','hide'],'#RugTabContent',function(){
		e("#AddToBasket,button[data-action='make_rug']").class('hidden',2);
	});
	on('click','#RugTabContent #OrderRug',function(v){var d=v.detail||{};
		var border=d.border||window.borders.first({id:e("#RugTabContent [data-reflect='border'].active").attr('data-id')});
		var length=d.length||e("#RugTabContent [data-reflect='length']").val();
		var width=d.width||e("#RugTabContent [data-reflect='width']").val();
		var extra=d.extra||e("#RugTabContent [data-reflect='extra']").val();
		e("#AddToBasket").trigger('click',{nagged:d.nagged,rug:{length:length,width:width,border:border.name,extra:extra}});
	});


	//increase
	on('click','#increase',function(){
		var value = parseInt(document.getElementById('QuantityNumber').value, 10);
		value = isNaN(value) ? 0 : value;
		value++;
		document.getElementById('QuantityNumber').value = value;
	  });
	  on('click','#decrease',function(){
		var value = parseInt(document.getElementById('QuantityNumber').value, 10);
		value = isNaN(value) ? 0 : value;
		value < 1 ? value = 1 : '';
		value--;
		document.getElementById('QuantityNumber').value = value;
	  });


	//RECOMMENDATIONS
	on('update','#Recommendations',function(){
		if(product.remnant){var t=e(this),v;

			//Deal with wrapping
			if(window.order_more.count&&window.more_sizes.products.length>3){
				window.more_sizes.products=window.more_sizes.products.slice(0,3);
			}

			//Insert products (including section labels and show all links).
			v=window.more_sizes.products;if(v.length){t.val(v,{append:true,sync:true});
				e("#Recommendations [data-sku='"+v[0].sku+"']").add("<label class='nowrap abs above left'>OTHER SIZES</label>").attr('id','MoreSizes')
				//if(more_sizes.count>more_sizes.products.length){e("#Recommendations [data-sku='"+v[v.length-1].sku+"']").add("<a href='/search/remnant?q="+product.name+"' class='see-all abs above right'>See All</a>")};
			}
			v=window.order_more.products;if(v.length){t.val(v,{append:true,sync:true});
				e("#Recommendations [data-sku='"+v[0].sku+"']").add("<label class='nowrap abs above left'>ORDER MORE</label>").attr('id','OrderMore')
				//if(order_more.count>order_more.products.length){e("#Recommendations [data-sku='"+v[v.length-1].sku+"']").add("<a href='/search/remnant?q="+product.brand+' '+product.range+"' class='see-all abs above right'>See All</a>")};
			};


		}else if(product.carpet){var t=e(this),v,row;

			//Deal with wrapping
			var top=window.remnants_of_this_carpet.products.length,bottom=window.remnants_in_this_range.products.length;
			if(top>0&&top<=2&&bottom>=2){
				window.remnants_in_this_range.products=window.remnants_in_this_range.products.slice(0,2);
			}else{
				row=top>3||bottom>2;
			}

			//Insert products (including section labels and show all links).
			v=window.remnants_of_this_carpet.products;if(v.length){t.val(v,{append:true,sync:true});
				e("#Recommendations [data-sku='"+v[0].sku+"']").add("<label class='nowrap abs above left'>AVAILABLE REMNANTS</label>").attr('id','RemnantsOfThisCarpet')
				//if(remnants_of_this_carpet.count>remnants_of_this_carpet.products.length){e("#Recommendations [data-sku='"+v[v.length-1].sku+"']").add("<a class='see-all abs above right'>See All</a>")};
			};if(row){e("#Recommendations").add("<div class='full-width spacer'></div>")};
			v=window.remnants_in_this_range.products;if(v.length){t.val(v,{append:true,sync:true});
				e("#Recommendations [data-sku='"+v[0].sku+"']:not([id])").add("<label class='nowrap abs above left'>REMNANTS IN THIS RANGE</label>").attr('id','RemnantsInThisRange').class('wide',v.length>2?1:0);
				//if(remnants_in_this_range.count>remnants_in_this_range.products.length){e("#Recommendations [data-sku='"+v[v.length-1].sku+"']").add("<a class='see-all abs above right'>See All</a>")};
			}
		}
	});

	//SEE ALL
	on(['mouseenter','mouseleave'],'#Recommendations a.above',function(){
		e(this).closest('.product.card').class('unhover',2)
	});

	//QUOTES
	/*
	window.nextQuote=function(a){
		setTimeout(function(){
			var current=e('#Quotes blockquote.active'),next=current.next('blockquote');
			if(!next[0]){next=e('#Quotes blockquote:first-of-type')};
			current.class('transitioning',1);var transitionEnd=function(){
				current[0].removeEventListener('transitionend',transitionEnd);
				current.class('active',0).class('transitioning',0).class('fade',0);
				next.class('fade',1).class('active',1).class('hidden',0);requestAnimationFrame(function(){next.class('transitioning',1).class('fade',0)});
			};current[0].addEventListener('transitionend',transitionEnd);
			requestAnimationFrame(function(){current.class('fade',1)});
			nextQuote(5000);
		},a);
	};nextQuote(4000);
	*/

	//FILTERS
	e.ajax('get','/api/tags/filters',function(x,d){
		if(x.status==200){
			e('#Tags').val(d);
		}
	});

});
