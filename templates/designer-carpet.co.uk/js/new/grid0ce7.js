addEventListener('ready',function(){

	if(window.autofill_schema){
		on('set','#Products',function(){
			var grid=document.getElementById('Grid'),container=grid.parentElement;
			var tag=document.createElement('script');tag.setAttribute('type',"application/ld+json");
			var brand,range;page.tags.some(function(t){if(t.type=='Brand'){return (brand=t.name)}});page.tags.some(function(t){if(t.type=='Range'){return (range=t.name)}});
			var prod=page.products[0],low=parseFloat(prod.price_sqm_3).toFixed(2),high=parseFloat(prod.price_sqm).toFixed(2),schema={"@context":"http://schema.org/","@type":"Product",name:brand+" "+range,brand:{type:"Thing",name:brand},offers:{"@type":"AggregateOffer",lowPrice:low,highPrice:high,priceCurrency:"GBP"}}
			document.title=document.title.replace('|',"| From £"+high+"m² |");
			tag.textContent=JSON.stringify(schema)
			container.insertBefore(tag,grid)
		});
	}

	//Noindex?
	if(window.location.href.includes('search')){
		var robots=document.createElement('meta');robots.name='robots';robots.setAttribute('content','noindex, follow');document.head.appendChild(robots);
	}
    
    //Fix canonical - /page/1 and the initial grid page are the same (duplicate content)
    document.querySelector("link[rel='canonical']").href=location.origin+location.pathname.toLowerCase().replace(/\/page\/1$/,'');
    	   
	//Reserved?
	on('set','#Grid .product',function(d){var p=d.value;if(p.lookup){return};var t=e(this);
		if(p.tags.first({name:'Reserved'})){t.find('.reserved').show()};
	});

	//More?
	on('set','#Grid .product',function(d){var p=d.value;if(p.lookup){return};var t=e(this);
		e.ajax('get','/api/products',{"id.not":p.id,name:p.name,tags:'remnant',limit:1,context:'more?'},function(x,d){
			if(d&&d.id){t.find(".more").val(/^x/i.test(p.sku)?"Remnants Available":"Other Sizes Available").show()};
		});
	});
	on('click','#Grid .product .more',function(v){v.preventDefault();
		var p=e(this).closest('.product').val();
		location='/search/remnant?q='+encodeURIComponent(p.name);
	});

	//Switch?
	on('done',"#Products",function(){
		if(window.products.length<5&&!/\/accessor/.test(location)){
			var switch_to=/\/remnant/.test(location)?'carpets':'remnants',url=switch_to=='carpets'?location.href.replace('/remnant','/carpet'):location.href.replace(/(\/search)?\/carpet(s)?/,'/search/remnant');url=url.replace(/[?&](?:length|width)=(?:\d|\.)*/gi,'')
			e('#Products').add("<a id='SwitchTo' href='"+url+"' class='center middle flex column'><span class='full-width'>Search for "+switch_to+" instead &raquo;</span></a>");
		}
	});

	//Page Numbers
	on('set','#Products',function(){
		var max=page.show<Infinity?(Math.ceil(page.products.count/page.show)):1;
		if(max>1){
			if(page.number>max){
				location=location.pathname.replace(/\/page\/\d*$/,'')+'/page/'+max
			}else{
				var pages=[];if(max<=7){
					for(var i=0;i<max;i++){pages.push(i+1)};
				}else{
					pages[0]=1;if(page.number<5){
						pages[1]=2;pages[2]=3;pages[3]=4;pages[4]=5;pages[5]='...';pages[6]=max;
					}else if((max-page.number)<4){
						pages[1]='...';pages[2]=max-4;pages[3]=max-3;pages[4]=max-2;pages[5]=max-1;pages[6]=max;
					}else{
						pages[1]='...';pages[2]=page.number-1;pages[3]=page.number;pages[4]=page.number+1;pages[5]='...';pages[6]=max;
					}
				}
			};e("[data-reflect^='pages']").val(pages);
            
            e("#PageNav").class('hidden',0);
		} 
        
        if(page.number>1){
            e(".intro-text p").hide();
            e(".intro-text h1").add(' - Page '+page.number);
            e(".intro-image, .sub-links").hide();
        }
    
        //If first page    
        if(page.number==1){
            e("#PageNav .previous").class('disabled',1);
            e("#PageNav .first-page").class('disabled',1);
		}
        else {
            var a = document.createElement('a');                        
            a.href = location.pathname.toLowerCase().remove(/\/page\/\d+/);
            e("#PageNav .first-page").add(a); 
        }
        //If last page
        if(window.pages==1||page.number==window.pages){
			e("#PageNav .next").class('disabled',1);
            e("#PageNav .last-page").class('disabled',1);
		}
	});
	on('set',"[data-reflect='page']",function(p){if(!p.value){return};
		var t=e(this);if(p.value=='...'){
			t.class('ellipsis',1)
		}else{
			if(p.value==page.number){t.class('active',1)}
			
            this.href=location.origin+location.pathname.remove(/\/page\/\d+/)+'/page/'+p.value+location.search+location.hash;
            //if (this.href.includes('page/1')) { this.href=this.href.replace(/\/page\/[1]/g,'') }
            if (p.value==1) { this.href=this.href.replace(/\/page\/1$/,'') }
		};
	});
	on('click','#Grid .ellipsis:not(.expanded),#Grid .ellipis:not(.expanded) *',function(){
		e(this).class('expanded',1).add("<input/>").find("input").focus();
	});
	on('keydown','#Grid .ellipsis input',function(v){if(v.which!=13){return}
		var page=this.value,regexp=/(\/page\/)\d+/;
		location.href=regexp.test(location.href)?location.href.replace(regexp,'$1'+page):location.href+'/page/'+page;
	});
	on('blur','#Grid .ellipsis input',function(){
		e(this).closest('.ellipsis').class('expanded',0).find('input').remove();
	});
	on('click','#PageNav .previous',function(){
		e('.page.active').prev().click();
	});
    on('click','#PageNav .first-page:not(.disabled)',function(){
		e('.page').first().click();
	});
	on('click','#PageNav .next',function(){
		e('.page.active').next().click();
	});
    on('click','#PageNav .last-page:not(.disabled)',function(){
		e('.page').last().click();
	});

	//Mobile Filter Button
	on('click','#FilterButton',function(){
		e("#SearchButton").click();
	});

    
    
	//Define query.
	page.number=parseInt((location.pathname.match(/\/page\/(\d+)/)||[])[1])||1;
	var carpet=/\/carpet/.test(location.pathname),urlParams=e.urlParams();
	var sort=urlParams.sort;if(!sort){var select=e('.sort'+(carpet?'.carpet':':not(.carpet)')+' select'),sort=sessionStorage[(carpet?'carpet_':'')+'sort'];if(sort){select.val(sort)}else{sort=select.val()};select.parent().show()};
	page.show=36;page.products=[];page.products.query={search:urlParams.q,sort:sort};
	if(urlParams.length||urlParams.width){
		window.requested={length:urlParams.length,width:urlParams.width,rotations:sessionStorage.getItem('rotation_lock')!='true'};
		page.products.query.script_sort=true;
	}else{
		page.products.query.limit=page.show;
		page.products.query.offset=(page.show*(page.number-1))||undefined;
	}
    
	if(urlParams.min){page.products.query['price.gte']=parseFloat(urlParams.min)};
	if(urlParams.max){page.products.query['price.lte']=parseFloat(urlParams.max)};
	if(urlParams.min_sqm){page.products.query['price_sqm.gte']=parseFloat(urlParams.min_sqm)};
	if(urlParams.max_sqm){page.products.query['price_sqm.lte']=parseFloat(urlParams.max_sqm)};
	//if(urlParams.length){page.products.query['length.gte']=parseFloat(urlParams.length)||undefined;page.products.query['length.lte']=(parseFloat(urlParams.length)||undefined)+1};
	//if(urlParams.width){page.products.query['width.gte']=parseFloat(urlParams.width)||undefined};

	//Run query.
	page.query.limit=1;page.query.context='grid';page.query.products=page.products.query;
    
	ajax('get','/api/pages',page.query,function(x,d){
		if(x.status==200){

			//Associate with tags.
			page.tags=d.tags;

			//Add meta properties.
			page.meta_title=d.meta_title;
			page.meta_description=d.meta_description;

			//Insert meta properties into DOM.
			var meta_title=page.meta_title||page.title;
            
            //Get custom meta title
            if(meta_title){
				document.title=meta_title+' | '+document.title;
			};
            //Adjust/deoptimise meta title for paginated pages (to ensure main category page ranks highest)
            if(page.number>1){
                document.title= 'Results Page '+page.number+ ' for '+document.title;
            }                       
            
			//Noindex?
			page.hasTag=function(t){if(t.trim){t={name:t}};return page.tags&&page.tags.find(t)[0]};
			if(page.noindex=page.hasTag('noindex')){
				var robots=document.createElement('meta');robots.name='robots';robots.setAttribute('content','noindex, follow');document.head.appendChild(robots);
			}

			//Populate sidebar
			e('#Tags').val(page.filters=d.filters);
			e('#Filters').show();

			//Generate H1
			/*if(/^search/.test(page.route)){
				var length,width,brands,colours,styles,types,constructions,category;
				e('#Content').add("<h1>Search"+((length=page.products.query.length)&&(width=page.products.query.width)?(' '+length+'m X '+width+'m'):'')+((width=page.tags.first({type:'Width'}))?' '+width.name:'')+((brands=page.tags.find({type:'Brand'})).length?(' '+brands.map(function(t){return t.name}).join(' ')):'')+((colours=page.tags.find({type:'Colour'})).length?(' '+colours.map(function(t){return t.name}).join(' ')):'')+((styles=page.tags.find({type:'Style'})).length?(' '+styles.map(function(t){return t.name}).join(' ')):'')+((types=page.tags.find({type:'Type'})).length?(' '+types.map(function(t){return t.name}).join(' ')):'')+((constructions=page.tags.find({type:'Construction'})).length?(' '+constructions.map(function(t){return t.name}).join(' ')):'')+((category=page.tags.first({type:'Category'}))?' '+category.name+'s':'')+"</h1>",'start')
			}*/
			if(/^search/.test(page.route)){
				var category;
				if(window.location.href.indexOf("accessory") != -1){
					e('#Content').add( "<h1>Search" + ( (category = page.tags.first( {type:'Category'} ) ) ? ' ' + 'Accessories':'') + "</h1>", 'start' )
				}
				else{
					e('#Content').add( "<h1>Search" + ( (category = page.tags.first( {type:'Category'} ) ) ? ' ' +category.name+ 's':'') + "</h1>", 'start' )
				}
			}


			//
			if(d.products){
				if(page.products.query.script_sort){
					d.products.forEach(function(product){product.price_sqm=parseFloat(product.price_sqm);
						//Eligible?
						if(requested.length&&(product.length-requested.length)>=4&&(requested.width?product.width>=requested.width:1)){
							//Length cut
							if(product.length<10){product.price_sqm+=1};
							product.cut='length';product.price=(product.price_sqm)*(product.area=(product.length=requested.length)*product.width);
							product.sku+='-'+('00'+(product.length*100).toFixed()).slice(-4)
						}else if(requested.rotations!=false&&requested.length&&requested.width&&((product.length-requested.width)>=4)&&product.width>=requested.length){
							//Rotated length cut
							if(!/c$/i.test(product.sku)){product.price_sqm+=1};
							product.eligible='rotated';product.cut='length';product.price=(product.price_sqm)*(product.area=(product.length=requested.width)*product.width);
							product.sku+='-'+('00'+(product.length*100).toFixed()).slice(-4)
						}else if(requested.width&&product.width>=3&&product.length<=2.5&&product.length>=(requested.length||0)&&(product.width-0.5)>=requested.width){
							//Width cut
							product.cut='width';product.full_price=(product.full_price_sqm=product.price_sqm)*(product.full_area=(product.length*(product.full_width=product.width)));
							product.width=requested.width;product.area=product.length*product.width;var remaining={length:product.length,width:product.full_width-product.width};
							product.price=((remaining.length<1.2||remaining.width<1.2)||(remaining.length<1.8&&remaining.width<1.8)) ? product.full_price : (remaining.width>3&&remaining.width<4.5) ? product.full_price*(1-(0.95-(product.width/product.full_width))) : product.full_price*(1-(0.85-(product.width/product.full_width)));product.price_sqm=product.price/product.area;
							product.sku+='w'+('00'+(product.width*100).toFixed()).slice(-4)
						}else if(requested.rotations!=false&&requested.length&&requested.width&&product.width>=3&&product.length<=2.5&&product.length>=requested.width&&product.width>=requested.length&&(product.width-0.5)>=requested.length){
							//Rotated width cut
							product.eligible='rotated';product.cut='width';product.full_price=(product.full_price_sqm=product.price_sqm)*(product.full_area=(product.length*(product.full_width=product.width)));
							product.width=requested.length;product.area=product.length*product.width;var remaining={length:product.length,width:product.full_width-product.width};
							product.price=((remaining.length<1.2||remaining.width<1.2)||(remaining.length<1.8&&remaining.width<1.8)) ? product.full_price : (remaining.width>3&&remaining.width<4.5) ? product.price*(1-(0.95-(product.width/product.full_width))) : product.price*(1-(0.85-(product.width/product.full_width)));product.price_sqm=product.price/product.area;
							product.sku+='w'+('00'+(product.width*100).toFixed()).slice(-4)
						}else if((requested.length?(product.length>=requested.length&&product.length<=requested.length+1.5):1)&&(requested.width ? (product.width>=requested.width):1)){
							//Whole piece
							product.price=Math.round(product.price_sqm*(product.area=product.length*product.width));
						}else if(requested.rotations!=false&&requested.length&&requested.width&&product.length>=requested.width&&product.length<=requested.width+1.5&&product.width>=requested.length){
							//Rotated whole piece
							product.eligible='rotated';product.price=Math.round(product.price_sqm*(product.area=product.length*product.width));
						}
						if(product.price){product.price=product.cut?Math.round(product.price):product.price.nearest(0.01);page.products.push(product)};
					});

					//Sort
					var query=page.products.query,sort=query.sort.split(','),asc=sort[1]=='asc',sort=sort[0];
					page.products=page.products.sort(function(a,b){return a[sort]>b[sort]?asc?1:-1:b[sort]>a[sort]?asc?-1:1:0});

					//How many pages?
					window.pages=Math.ceil(page.products.length/page.show)||1;

					//Just this page's worth...
					var count=page.products.length,start=start=page.show*(page.number-1),end=start+page.show;
					page.products=page.products.slice(start,end);page.products.count=count;page.products.start=start;page.products.end=end;page.products.query=query;
					window.products=page.products;

					//
					page.products.forEach(function(p){p.lookup=true});
					e('#Products').val(window.products)
					e('#Grid .controls').show();
					e('#Loading').hide();

				}else{

					//Calculate number of pages
					if(page.show!=Infinity){
						window.pages=(page.show<Infinity?Math.ceil(d.count/page.show):1)||1;
					}

					//
					window.products=page.products;
					page.products.push.apply(page.products,d.products);
					page.products.count=d.count;

					e('#Products').val(window.products)
					e('#Grid .controls').show();
					e('#Loading').hide();
				}
                
                
                

			}else{
				e('#Loading').hide();
			}
            
            //Get custom meta description            
			if(page.number==1){	
			     var meta_description= page.meta_description;
            }
            //Deoptimise meta description for paginated pages
            else {
                //Get the meta title and strip everything from the first '|' onwards
                var category_title = meta_title;
                if (category_title.includes("|")) {category_title = category_title.substring(0, category_title.indexOf(" |"));}
                
                //The current product offset
                var products_start = page.products.query.offset
                //The current max product number on the page
                var products_end = (page.products.query.offset+page.show) > page.products.count ? page.products.count:  (page.products.query.offset+page.show);
                //New meta description for paginated pages
                var meta_description = 'Products ' + products_start + ' to ' + products_end + ' of ' + page.products.count + ' ' + category_title+ ' available at Designer Carpet. Free Sample Service. Fast UK Delivery. Rated Excellent on Trustpilot';
            }
            //Output the meta description
            if(meta_description){
                var element=document.querySelector("meta[name='description']"),create=!element;if(create){element=document.createElement('meta');element.setAttribute('name','description')}
                element.setAttribute('content',meta_description);if(create){document.head.appendChild(element)};
            };
            
            //Next/Prev links
            if (page.number>1) {
                //Prev Link
                let link=document.createElement('link');link.setAttribute('rel','prev');
                
                if (page.number==2) {
                    link.href=location.origin+location.pathname.replace(/\/page\/\d*$/,'');
                } else {
                    link.href=location.origin+location.pathname.replace(/\/page\/\d*$/,'')+'/page/'+(page.number-1);
                }
                
                //link.href=location.origin+location.pathname;
                document.head.appendChild(link);
            }
            if(page.number<window.pages){
                //Next Link
                let link=document.createElement('link');link.setAttribute('rel','next');
                
                link.href=location.origin+location.pathname.replace(/\/page\/\d*$/,'')+'/page/'+(page.number+1);
                
                //link.href=location.origin+location.pathname;
                document.head.appendChild(link);                
            };

			//Google
			gtag('event','page_view',{
				send_to:'AW-1006307364',
				ecomm_pagetype:(location.pathname=='/'?'home':/^\/search/.test(location.pathname)?'searchresults':d.products?'category':'other')
			});

		}else{
			alert(d.error||x.responseText);
		}
	});

});
