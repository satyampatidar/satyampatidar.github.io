var ar = ar || {};


ar = {
	options : {
		sectionChangeSpeed : 2000, // this is duration for menu buttons
		menuLinkUlineSlide : 250, // speed of main nav links underline slide
		curBlockSelected : 0, // current selected subpage
		currMenuBg : 0,
		setBgOffset : 0,
		scrollTop : 0
	},
	init : function(){
		this.scrollTo();
		this.menu.init();
		//this.fancybox();
		//this.page.buttons();
		this.page.init();
		this.home.init();
		this.clients.init();
		this.cases.init();
		this.designing.init();
		this.portfolio.init();
		this.contact.actions();
		this.awards.init();
	},
	
	smoothScroll : function(){
		
        var step = 50,
			duration = ($('html').hasClass('chrome')) ? 900 : 750,
			viewport = $(window).height(),
			fullHeight = ($('html').hasClass('ie')) ? $('body').height() : $(document).height(),
			body = $("body, html, document"),
			wheel = false,
			scroll;
		
		$(body).on('mousewheel', function(event, delta) {
			wheel = true;
			scroll = false;
			
			if (delta < 0) {
				ar.options.scrollTop = (ar.options.scrollTop+viewport) >= $(document).height() ? ar.options.scrollTop : ar.options.scrollTop+=step;
				body.stop().animate({scrollTop: ar.options.scrollTop}, duration, 'easeInOutSine', function () {
					wheel = false;
				});
			} else {
				ar.options.scrollTop = ar.options.scrollTop <= 0 ? 0 : ar.options.scrollTop-=step;
				body.stop().animate({scrollTop: ar.options.scrollTop}, duration, 'easeInOutSine', function () {
					wheel = false;
				});
			}
			return false;
		});
		
		var timer;
		
		// set data even if we are using scroll instead of mousewheel
		$(window).on('scroll', function(){	
			clearTimeout(timer);
			timer = setTimeout( function(){
				scrollStopped( $(window).scrollTop() );	
			} , 150 );
		});
		
		scrollStopped = function () { 
			// do stuff
			ar.options.scrollTop = $(window).scrollTop();	
    	};

	},
	
	
	/*
	*	@Description: plugin to run scrollTo
	*	@Actions: move page to current element on the stage
	*/	
	
	scrollTo : function(){
		$.fn.extend({
			scrollTo : function(speed, easing) {
				return this.each(function() {
					var targetOffset = $(this).offset().top;
					ar.options.offsetTop = targetOffset;
					$('html,body').animate({scrollTop: targetOffset}, speed, easing );
				});
			}
		});	
	},


	/*
	*	@Description: main page menu buttons
	*	@Actions: on click scrollTo animations 
	*/


	menu : {
		init : function(){
			this.buttons();
		},
		view : {
			show : function(){
				$('nav').fadeIn();	
			},
			hide : function(){
				$('nav').fadeOut();
			}
		},
		buttons : function(){
			
			var btn = $('nav a:not(".fb, .mail")'),
				fadeSpeed = 400;
			
			// click event mechanism
			btn.on('click', function(e){
				e.preventDefault();
				
				btn.not( $(this) ).removeClass('selected');
							
				var elementClcked = btn.index($(this));
				ar.page.keyboard.hide();	
				//ar.menu.view.hide();
				switch(elementClcked){
					case 0:
						$('#home').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 1:
						$('#designing').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 2:
						$('#about').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 3:
						$('#awards').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 4:
						$('#portfolio').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						ar.portfolio.sort('mobile, web, interface, other');
						break;
					case 5:
						$('#case').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 6:
						$('#clients').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 7:
						$('#contact').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
						break;
					case 8:
						window.open($(this).attr('href'));
						break;
				}
				
			});
			
		},
		setBg : function(bg){
			var backgrounds = new Array('#08233E', '#F8823C', '#2C5379', '#EB2142', '#08233E', '#F8823C', '#EB2142', '#2C5379'),
				header = $('header');
					
			header.css('background-color', backgrounds[bg]);
		},
		// set bg in menu transparent
		setTransparent : function(){
			$('header').css('background-color', 'transparent');
		},
		// select currect button in main menu
		setSelected : function(eq){
			var btn = $('nav a');
			
			btn.removeClass('selected');
			btn.eq(eq).addClass('selected');
			ar.menu.view.show();	
			this.changeBgStatus = false;
			
		}
		
	},
	
	
	/*
	*	@Description: main page actions
	*	@Methods : added for overall page settings and actions
	*/	
	
	
	page : {
		init : function (){
			this.browser();
			this.setSubsHeight();
			this.keyboard.keysEvent();
			this.onScroll();
			this.buttons();
			//this.pageScroll();
		},
		res : {
			width : document.documentElement.clientWidth,
			height : document.documentElement.clientHeight
		},
		browser : function(){
			var version;
			if ($.browser.mozilla) { version = 'ff'; }
			if ($.browser.webkit) { version = 'safari'; }
			if ($.browser.chrome) { version = 'chrome'; }
			if ($.browser.opera) { version = 'opera'; }
			if ($.browser.msie) { version = 'ie'; }
			$('html').addClass(version);	
		},
		// control page button used on the page
		buttons : function(){
			$('header h1 a').on('click', function(e){
				e.preventDefault();
				$('#home').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
			});
		},
		// use this to make subpages full page height
		setSubsHeight : function(){
			var sections = $('#container .sub'),
				portfolioWrapper = $('#portfolio .projects-wrapper');
				
			sections.height( ar.page.res.height);
			
			// set height for portfolio wrapper
			portfolioWrapper.height( ar.page.res.height - $('#container header').innerHeight());
		},
		keyboard : {
			pressed : new String(),
			keysEvent : function(){
				var holder = $('.keyboard'),
					registeredBtn = new Array(38, 40, 37, 39),
					keys = {},
					fadeSpeed = 150,
					catNum = $('#container .sub').length,
					menuLink = $('nav a');

				$(document).on('keydown', function(e){
					var keycode = (e.keyCode ? e.keyCode : e.which),
						pressedBefore = ar.page.keyboard.pressed;
						
					if( $.inArray(keycode, registeredBtn) != -1 && (keycode != pressedBefore) ){
						e.preventDefault();	
						ar.page.keyboard.pressed = keycode;
						holder.find('.btn .pressed').fadeOut(fadeSpeed);
					}							
					
					switch (keycode){
						case 38: // up
							holder.find('.up .pressed').stop(true, true).fadeIn(fadeSpeed).css('display', 'block');
							if( ar.options.curBlockSelected-1 >= 0 ){
								ar.options.curBlockSelected = ar.options.curBlockSelected-1;
								menuLink.eq(ar.options.curBlockSelected).click();
							}				
							break;
						case 40: // down
							holder.find('.down .pressed').stop(true, true).fadeIn(fadeSpeed).css('display', 'block');
							if( ar.options.curBlockSelected+1 < catNum ){
								ar.options.curBlockSelected = ar.options.curBlockSelected+1;
								menuLink.eq(ar.options.curBlockSelected).click();
							}
							break;
						case 37: // left
							holder.find('.left .pressed').stop(true, true).fadeIn(fadeSpeed).css('display', 'block');
							if( ar.options.curBlockSelected == 1 ){
								ar.designing.moveSliderHorizontal('left');
							}
							if( ar.options.curBlockSelected == 4 ){
								ar.portfolio.moveProjects('left');
							}
							break;
						case 39: // right
							holder.find('.right .pressed').stop(true, true).fadeIn(fadeSpeed).css('display', 'block');
							if( ar.options.curBlockSelected == 1 ){
								ar.designing.moveSliderHorizontal('right');
							}
							if( ar.options.curBlockSelected == 4 ){
								ar.portfolio.moveProjects('right');
							}
							break;
					}
					// e.preventDefault();
			  	}).on('keyup', function(){
					holder.find('.btn .pressed').fadeOut(fadeSpeed);
				});
				
				// mouse control
				
				
				
			},
			show : function(){
				$('.keyboard').fadeIn(500);
			},
			hide : function(){
				$('.keyboard').fadeOut(500);	
			},
			pressAll : function(type){
				var keys = $('.keyboard .btn');
				(type == 'fade') ? keys.find('.pressed').stop(true, true).fadeIn(550).css('display', 'block') : keys.find('.pressed').css('display', 'block');				
			},
			unpressAll : function(type){
				var keys = $('.keyboard .btn');
				(type == 'fade') ? keys.find('.pressed').fadeOut(550) : keys.find('.pressed').css('display', 'none');	
			}
		},
		waypoints : function( scrollTop, delta ){
			var currBlockIndex = 0, i,
				currMenuBg = 0,
				setBgOffset = 0,
				blocks = $('.sub'),
				distance = parseInt(ar.page.res.height*0.4);
				makeTransparent = parseInt(ar.page.res.height*0.15);
				
			for (i=0; i<blocks.length; i++) {
				if (blocks.eq(i).offset().top - distance <= ar.options.scrollTop) { currBlockIndex = i; }
				if (blocks.eq(i).offset().top - makeTransparent <= ar.options.scrollTop) { currMenuBg = i; }
				if (blocks.eq(i).offset().top <= ar.options.scrollTop) { setBgOffset = i; }	
			}
			if(ar.options.curBlockSelected != currBlockIndex){
				ar.options.curBlockSelected = currBlockIndex;
				ar.menu.setSelected(currBlockIndex);
				ar.page.animations(currBlockIndex);
			}
			if(ar.options.currMenuBg != currMenuBg){
				ar.options.currMenuBg = currMenuBg;
				if(delta == 'down'){
					ar.menu.setTransparent();
				} else {
					ar.menu.setBg(currMenuBg);	
				}
			}
			if(ar.options.setBgOffset != setBgOffset){
				ar.options.setBgOffset = setBgOffset;
				if(delta == 'down'){
					ar.menu.setBg(setBgOffset);
				} else {
					ar.menu.setTransparent();	
				}
			}	
		},
		onScroll : function() {
			var oldScrollPosition = 0;
			$(window).on( 'scroll', onScroll );
			
			function onScroll() {				
				ar.options.scrollTop = $(window).scrollTop();
				var delta = ar.options.scrollTop - oldScrollPosition;
				( delta < 0 ) ? delta = 'up' : delta = 'down';
				
				oldScrollPosition = ar.options.scrollTop;
				ar.page.waypoints( ar.options.scrollTop, delta );
			}			
		},
		animations : function(number){
			switch(number){
				case 0:
					ar.page.keyboard.show();
					break;	
				case 1:
					if( !$('#designing').hasClass('animated') ){
						ar.designing.run();
					} else {
						ar.page.keyboard.show();	
					}
					break;	
				case 2:
					if( !$('#about').hasClass('animated') ){
						ar.about.run();
					} else {
						ar.page.keyboard.show();	
					}
					break;	
				case 3:
					if( !$('#awards').hasClass('animated') ){
						ar.awards.run();
					} else {
						ar.page.keyboard.show();	
					}
					break;	
				case 4:
					if( !$('#portfolio').hasClass('animated') ){
						//ar.portfolio.run();
					} else {
						(ar.page.res.height > 750) ? ar.page.keyboard.show() : ar.page.keyboard.hide() ;
					}
					break;	
				case 5:
					if( !$('#cases').hasClass('animated') ){
						ar.cases.run();
					} else {
						ar.page.keyboard.show();	
					}
					break;	
				case 6:
					if( !$('#clients').hasClass('animated') ){
						ar.clients.run();
					} else {
						ar.page.keyboard.show();	
					}
					break;
				case 7:
					if( !$('#contact').hasClass('animated') ){
						ar.contact.run();
					} else {
						ar.page.keyboard.show();	
					}
					break;	
			}
		},
		pageScroll : function(){
			// run and destroy sliders
			$('#container').mCustomScrollbar({
				scrollEasing : "easeOutQuart",
				autoDraggerLength: false
			});
		},
		cufon : {
			check : function(){
				if( $.browser.chrome ){
					web.page.cufon.execute();
				}
			},
			execute : function(){
				
				Cufon.replace('.we-are-working p, #main h2, #about-us .subtitle, #portfolio .subtitle, #portfolio h2, #portfolio .info, #portfolio dl dt, #portfolio dl dd, #portfolio-menu a, #portfolio .counter span, #offer .addition, #offer .subtitle, #offer .title, #offer .description, #offer .see-more, #contact .details, #contact h2, #contact label, #contact .validation, #send-question-popup label', { fontFamily: 'FrutigerPl' });
				
				
				Cufon.replace('nav a', { 
				fontFamily: 'FrutigerB',
				color: '#EDF6ED',
					hover: { 
						color: '#ead8b2'
					}
				});
				
				Cufon.replace('nav a.selected', { 
					fontFamily: 'FrutigerB',
					color: '#ead8b2'
				});
				
				Cufon.replace('#offer .see-more', { 
				fontFamily: 'FrutigerB',
				color: '#454232',
					hover: { 
						color: '#8f898d'
					}
				});			
			}
		}
	},
	
	
	/*
	*	@Description: about subpage
	*	@Actions: whole actions in this subpage (animation)
	*/
	
	about : {
		animate : false,
		actions : function(){
			var scaleSpeed = 70;
			$('#about .point').on('mouseenter', function(){
				$(this).find('.circle').stop(true, true).transition({ scale: 1.2 },  scaleSpeed, 'linear');
			}).on('mouseleave', function(){
				$(this).find('.circle').stop(true, true).transition({ scale: 1 },  scaleSpeed, 'linear');
			})
		},
		animation : function(){
			var fadeSpeed = 300,
				loadSpeed = 130,
				animSpeed = 320,
				holder = $('#about'),
				points = holder.find('.point').length,
				counter = 0;
			
			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();
				holder.addClass('animated');
				holder.find('.bottom').css('display', 'block');
				// run line animation
				holder.find('.line-1').animate( { 'width' : 0 }, animSpeed, 'linear', function(){
					holder.find('.curve-1 .current').transition( { 'rotate' : '180deg' }, animSpeed, 'linear', function(){
						holder.find('.line-2').animate( { 'width' : 0 }, animSpeed, 'linear', function(){
							holder.find('.curve-2 .current').transition( { 'rotate' : '-180deg' }, animSpeed, 'linear', function(){
								holder.find('.line-3').animate( { 'width' : 0 }, animSpeed, 'linear', function(){ 
									holder.find('.curve-3 .current').transition( { 'rotate' : '91deg' }, animSpeed, 'linear', function(){
										holder.find('.line-4').animate( { 'top' : 1000 }, animSpeed, 'linear');
										/*
										// go to next section
										if(ar.about.animate == false && ar.options.curBlockSelected == 2){
											$('#awards').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");	
											ar.about.animate = true;
										}
										*/
									});
								});
							});	
						});	
					});
				});	
				
				
				var pointsInterval = setInterval(function(){
					if(counter < points){
						holder.find('.point').eq(counter).find('.title').transition({ scale: 1 },  loadSpeed, 'linear');
						holder.find('.point').eq(counter).find('.info').fadeIn(fadeSpeed).css('display', 'block');
					} else {
						clearInterval(pointsInterval);	
					}
					counter++;	
				}, loadSpeed);
				
					
			});
			holder.find('.line').delay(fadeSpeed/1.3).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
			
		},
		// run animation with delay
		run : function(){
			ar.about.animation();
		}
	},
	
	
	/*
	*	@Description: awards subpage
	*	@Actions: whole actions in this subpage (animation)
	*/
	
	awards : {
		init : function(){
			//ar.awards.waveRun();
			ar.awards.actions();
		},
		actions : function(){
			$('#awards .achievement, #awards .mask-wave').not('#awards .mask-wave .achievement').on('mouseenter', function(){
				$(this).stop(true, true).animate( { 'margin-top' : 0 }, 300, 'easeOutBounce' );
			}).on('mouseleave', function(){
				$(this).animate( { 'margin-top' : 15 }, 300, 'easeOutBounce' );	
			})
		},
		animation : function(){
			var fadeSpeed = 300,
				loadSpeed = 130,
				animSpeed = 320,
				intervalSpeed = 200,
				moveSpeed = 1300,
				holder = $('#awards'),
				points = holder.find('.point').length,
				statsCount = holder.find('.achievement').length,
				counter = 0;
			
			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();
				holder.addClass('animated');
				
				// run line animation
				holder.find('.top').css('display', 'block');
				holder.find('.line-1').animate( { 'height' : 0 }, animSpeed, 'linear', function(){
					holder.find('.curve-1 .current').transition( { 'rotate' : '90deg' }, animSpeed, 'linear', function(){
						holder.find('.line-2').animate( { 'width' : 0 }, animSpeed, 'linear');	
						
						var pointsInterval = setInterval(function(){
							if(counter < points){
								holder.find('.point').eq(counter).find('.title').transition({ scale: 1 },  loadSpeed, 'linear');
								holder.find('.point').eq(counter).find('.info').fadeIn(fadeSpeed).css('display', 'block');
							} else {
								clearInterval(pointsInterval);	
							}
							counter++;	
						}, loadSpeed);
						
						var statsInterval = setInterval(function(){
							if(statsCount+1 > 0){
								holder.find('.achievement').eq(statsCount).fadeIn(fadeSpeed/3).animate( { 'left' : '0', 'opacity' : 1 }, fadeSpeed/3 , 'easeOutQuad' );
								holder.find('.number').eq(statsCount).delay(fadeSpeed/4).animate( { 'opacity' : 1 }, fadeSpeed/2);
								ar.awards.countDown(statsCount, holder.find('.number').eq(statsCount).attr('data-hidden-number'));
								holder.find('.number').eq(statsCount).text('0');	
							} else {
								clearInterval(statsInterval);	
							}
							statsCount--;	
						}, intervalSpeed);
						
					});
				});	
					
			});
			holder.find('.line').delay(fadeSpeed/1.3).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
		},
		// run animation with delay
		run : function(){
			ar.awards.animation();
		},
		waveInterval : new String,
		waveRun : function(){
			var moveSpeed = 1800,
				wave = $('.mask-wave .wave');
			ar.awards.waveInterval = setInterval(function(){
				wave.animate({ 'left' : '-150px' }, moveSpeed/2, 'easeOutQuad', function(){
					$(this).animate({ 'left' : '0px' }, moveSpeed/2, 'easeOutQuad');	
				});
			}, moveSpeed);
		},
		countDown : function(num, goto){
			var counter = 0,
				interval = 1200,
				element = $('#awards').find('.achievement').eq(num);
				speed = parseInt(interval/goto),
				wave = $('.mask-wave .wave'),
				details = $('.mask-wave .details');
			
			/*	
			if(num == 2){
				setTimeout(function(){
					wave.css('display', 'block');	
				}, 150);
				setTimeout(function(){
					details.css('display', 'block');
				}, 900);
			}*/
				
			var countInv = setInterval(function(){
				if(counter-1 < goto){
					/*
					if(num == 2){ // special statement for redbull wave
						wave.css( 'bottom',counter*0.48 );
						$('#awards .mask-wave .number').text('300');
					} else {
						element.find('.number').text(counter);
					}*/
					element.find('.number').text(counter);
				} else {
					if(element.find('.number').attr('data-after-count')){
						element.find('.number').html( element.find('.number').attr('data-after-count') );
					}
					if( num == 2 ){
						wave.css('display', 'none');
						clearInterval(ar.awards.waveInterval);
					}
					clearInterval(countInv);
				}
				counter++;	
			}, speed);	
		}
	},	
	
	
	/*
	*	@Description: portfolio subpage
	*	@Actions: whole actions in this subpage (animation), slider with mouse action on projects and slide down project details
	*/
	
	portfolio : {
		init : function(){
			ar.portfolio.grid();
			ar.portfolio.actions();
			ar.portfolio.mouseEvent();
		},
		// global settings for portfolio grid (you can change number of cols and rows)
		settings : {
			cols : 4,
			rows : 2
		},
		// current position of projects holder
		currentPos : 0,
		// sort the portfolio 
		sort : function( wantType ){
			var projectHolder = $('#portfolio .project'),
				num = projectHolder.length,
				i = 0;
			
			ar.portfolio.currentPos = 0;
			$('#portfolio .projects-wrapper').css('left', 0);
			
			projectHolder.each(function(){
				var type = $(this).attr('data-type');
				if( wantType.indexOf(type) > -1  ){
					$(this).css('display', 'block');
				} else {
					$(this).css('display', 'none');	
				}
				i++;
				if( i == num){
					ar.portfolio.grid();
				}
			});
		},
		// create grid fow projects
		grid : function(){
			var rows = ar.portfolio.settings.rows,
				cols = ar.portfolio.settings.cols,
				projectHolder = $('#portfolio .project').filter(':visible'),
				pageHeader = $('#container header');
				
			// get width and height of grided projects
			var proWidth = ar.page.res.width / cols,
				proHeight = (ar.page.res.height-pageHeader.innerHeight()) / rows;
				
			projectHolder.css({
				'width' : proWidth,
				'height' : proHeight	
			});	
			
			// placement of projects
			var projectsNum = projectHolder.length,
				rowsAmout = 0,
				colsAmout = 0,
				breakAt = Math.ceil(parseInt(projectsNum)/rows),
				avaRows;
				
			projectHolder.each(function(){
				var leftPos = proWidth * rowsAmout,
					topPos = proHeight * colsAmout;
					
				$(this).css({
					'left' : leftPos,
					'top' : topPos	
				}).attr({
					'data-left' : leftPos,
					'data-top' : topPos,
					'data-width' : proWidth,
					'data-height' : proHeight
				});
				
				if( rowsAmout < breakAt ){
					rowsAmout++;
				}
				if( rowsAmout == breakAt ){
					rowsAmout = 0;
					colsAmout++;
				}
				
			});
			
			// set projects holder width
			if( breakAt > ar.portfolio.settings.cols ){
				avaRows = breakAt;
			} else {
				avaRows = ar.portfolio.settings.cols;	
			}
			
			$('#portfolio .projects-wrapper').css('width', avaRows*proWidth);	

		},
		actions : function(){
			var project = $('#portfolio .project').filter(':visible'),
				arrowLeft = $('#portfolio .left span'),
				arrowRight = $('#portfolio .right span'),
				projectFull = $('#portfolio .full-size');
				fadeSpeed = 300;
			
			project.on('mouseenter', function(){
				$(this).children('.overlay').stop( true, true).fadeOut(fadeSpeed, 'easeOutQuad');
			}).on('mouseleave', function(){
				$(this).children('.overlay').stop( true, true).fadeIn(fadeSpeed, 'easeInQuad');
			}).on('click', function(e){
				e.preventDefault();
				var appendedImg = '<img alt="' + $(this).find('.full-size').attr('data-name') + '" src="images/projects/' + $(this).find('.full-size').attr('data-project') + '-big.png" class="project-img">',
					bgImg = 'images/projects/' + $(this).find('.full-size').attr('data-project') + '-big.png';
					
				$(this).find('.full-size').empty().append( appendedImg );
				
				var index = project.index($(this)),
					fullScreen = $(this).find('.full-size'),
					image = $(this).find('.project-img');
				
				ar.portfolio.loader.show( index );					
				$(this).find('.project-img').imgpreload(function()
				{
					ar.portfolio.loader.hide( index );
					setTimeout(function(){
						ar.portfolio.showFullProject( index );
						fullScreen.fadeIn(100);
						ar.portfolio.mouseMouvment = true;
					}, ar.portfolio.loader.fadeSpeed);
				});
			});
			
			arrowLeft.on('mouseenter', function(){
				$(this).stop( true, true).animate({'opacity' : 1}, 500);
			}).on('mouseleave', function(){
				$(this).animate({'opacity' : 0.4}, 500);
			}).on('click', function(e){
				e.preventDefault();
				ar.portfolio.moveProjects('left');
			});
			
			arrowRight.on('mouseenter', function(){
				$(this).stop( true, true).animate({'opacity' : 1}, 500);
			}).on('mouseleave', function(){
				$(this).animate({'opacity' : 0.4}, 500);
			}).on('click', function(e){
				e.preventDefault();
				ar.portfolio.moveProjects('right');
			});
			
			projectFull.click(function(e){
				e.preventDefault();
				e.stopPropagation();
				$(this).parent().animate({
					'left' : $(this).parent().attr('data-left'),
					'top' : $(this).parent().attr('data-top'),
					'width' : $(this).parent().attr('data-width'),
					'height' : $(this).parent().attr('data-height')
				}, 300);
				ar.portfolio.mouseMouvment = false;
				$(this).fadeOut(350);
			});
			
		},
		moveProjects : function(pos){
			var rows = Math.ceil(parseInt($('#portfolio .project').filter(':visible').length)/2),
				projectsHolder = $('#portfolio .projects-wrapper'),
				slideSpeed = 500,
				avaRows;
			
			// check how many rows is available
			if( rows > ar.portfolio.settings.cols ){
				avaRows = rows - ar.portfolio.settings.cols;
			} else {
				avaRows = 0;	
			}
			
			if( pos == 'right' && ar.portfolio.currentPos < avaRows && avaRows > 0 ){
				ar.portfolio.currentPos = ar.portfolio.currentPos+1;
			}
			if( pos == 'left' && ar.portfolio.currentPos > 0 && avaRows > 0 ){
				ar.portfolio.currentPos = ar.portfolio.currentPos-1;
			}
			
			projectsHolder.animate({ 'left' : -$('#portfolio .project:first').width()*ar.portfolio.currentPos }, slideSpeed, 'easeOutQuad');
		},
		showFullProject : function(item){
			var project = $('#portfolio .project'),
				posOnScreen = project.eq(item).offset().left,
				animSpeed = 350;
			
			project.eq(item).animate({ 
				'top' : 0, 
				'left': ar.portfolio.currentPos*(ar.page.res.width /ar.portfolio.settings.cols), 
				'width' : ar.page.res.width, 
				'height' : ar.page.res.height - $('#container header').innerHeight()  
			}, animSpeed, 'easeOutQuad').fadeIn(animSpeed);
			
		},
		loader : {
			fadeSpeed : 100,
			show : function( eq ){
				$('.project .loader').eq( eq ).fadeIn(ar.portfolio.loader.fadeSpeed);		
			},
			hide : function( eq ){
				$('.project .loader').eq( eq ).fadeOut(ar.portfolio.loader.fadeSpeed);
			}
		},
		mouseMouvment : false,
		mouseEvent : function(){
			$('#portfolio .full-size').on('mousemove', function(e){
				if(ar.portfolio.mouseMouvment)
					ar.portfolio.movement(e.pageX-$(this).offsetParent().offset().left, e.pageY-$(this).offsetParent().offset().top, true);
			});
		},
		movement : function(x,y, revert){
			var img = $('#portfolio .full-size .project-img').filter(':visible'),
				area = $('#portfolio .projects-wrapper');
			
			// revert mousemove event if nesssery
			var y = ( revert == true ) ? area.height()-y : y;
			
			// make % of screen
			var verticalMousePrc = ( ( area.height() - y) / area.height() ) * 100;
			var overlayY =  Math.abs(( area.height() - img.height() ) / 2);
			var imgPrcMoveY = (verticalMousePrc / 100) * (overlayY * 2);

			img.stop().animate( { 'top' : -imgPrcMoveY }, 500, 'easeOutCirc' );
			
		},
	},	
	
	
	
	/*
	*	@Description: designing subpage
	*	@Actions: whole actions in this subpage (animation), slider with mouse action on projects
	*/
	
	designing : {
		init : function(){
			ar.designing.slider();
			ar.designing.actions();
		},
		actions : function(){
			var button = $('#designing .type a');
				
			button.on('mouseenter', function(){
				$(this).stop(true, true).animate( { 'margin-top' : 0 }, 300, 'easeOutBounce' );
			}).on('mouseleave', function(){
				$(this).animate( { 'margin-top' : 5 }, 300, 'easeOutBounce' );	
			}).on('click', function(){
				$('#portfolio').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");
				switch( $(this).attr('data-type') ){
					case 'web':
						ar.portfolio.sort('web');
						break;	
					case 'mobile':
						ar.portfolio.sort('mobile');
						break;
					case 'interface':
						ar.portfolio.sort('interface');
						break;
				}
			});
			
		},
		animation : function(){
			var fadeSpeed = 1000,
				holder = $('#designing'),
				intervalSpeed = 550,
				projects = holder.find('.type').length,
				counter = 0;

			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();	
			});
			holder.find('.line').delay(fadeSpeed/1.3).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
			holder.find('#slider-designing').delay(fadeSpeed/1).animate( { 'opacity': 1 } , function(){
				holder.addClass('animated');
			});
			
			var interval = setInterval(function(){
					if(counter < projects){
						holder.find('.visual').eq(counter).animate( { 'opacity' : 1, 'top' : 0 }, intervalSpeed , 'easeOutQuad' );
						holder.find('.description').eq(counter).delay(intervalSpeed/2).animate( { 'opacity' : 1, 'top' : 0 }, intervalSpeed , 'easeOutQuad' );
					} else {
						clearInterval(interval);	
					}
					counter++;	
				}, intervalSpeed);
			

		},
		// run animation with delay
		run : function(){
			ar.designing.animation();
		},
		slider : function(){
			// run slider 
			$("#slider-designing").mCustomScrollbar({
				horizontalScroll : true,
				scrollEasing : "easeOutQuart",
				autoDraggerLength: false
			});	
		},
		sliderAmout : 0,
		moveSliderHorizontal : function(key){
			var elementWidth = $('#designing .type').eq(0).width(),
				elements = $('#designing .type').length,
				seenElements = 2;
			
			if(key == 'left'){
				if(ar.designing.sliderAmout > 0){
					ar.designing.sliderAmout--;
					$('#slider-designing').mCustomScrollbar("scrollTo", ar.designing.sliderAmout*elementWidth);	
				}
			}
			if(key == 'right'){
				if(ar.designing.sliderAmout < elements - seenElements){
					ar.designing.sliderAmout++;
					$('#slider-designing').mCustomScrollbar("scrollTo", ar.designing.sliderAmout*elementWidth );	
				}	
			}
		}
	},
	
	
	/*
	*	@Description: cases subpage
	*	@Actions: whole actions in this subpage (animation), slider with mouse action on projects
	*/
	
	cases : {
		init : function(){
			ar.cases.slider();
			ar.cases.actions();
		},
		actions : function(){
			var button = $('#case .introduction a');
				
			button.on('mouseenter', function(){
				$(this).stop(true, true).animate( { 'margin-top' : 0 }, 300, 'easeOutBounce' );
			}).on('mouseleave', function(){
				$(this).animate( { 'margin-top' : 5 }, 300, 'easeOutBounce' );	
			})
		},
		animation : function(){
			var fadeSpeed = 1300,
				holder = $('#case');
			
			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();
				holder.addClass('animated');
			});
			holder.find('.slider-holder').delay(100).animate( { 'top': 0, 'opacity' : 1 }, fadeSpeed, 'easeOutQuad');	
			holder.find('.introduction').delay(120).animate( { 'top': 170, 'opacity' : 1 }, fadeSpeed, 'easeOutQuad');
			holder.find('.line').delay(fadeSpeed/0.5).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
			/*
			holder.find('.slider-holder').delay(fadeSpeed/0.9).fadeIn(fadeSpeed, function(){
				holder.addClass('animated');
			});
			holder.find('.introduction').delay(fadeSpeed/0.6).fadeIn(fadeSpeed, 'easeOutQuad');
			*/
		},
		// run animation with delay
		run : function(){
			ar.cases.animation();
		},
		// 
		slider : function(){
			var holder = $('.slider-holder .container'),
				slider = holder.children('.slider'),
				mockup = holder.children('.mockup'),
				project = holder.children('.project');
				
			holder.on('mousedown', function(e){
				$(this).on('mousemove', function(e){
					var x = e.pageX - $(this).offset().left;
					if(x > parseInt(slider.width()/3) && x < holder.width() - parseInt(slider.width()/3) ){
						slider.css( 'left', x );
						mockup.css( 'width', x );
						project.css( 'width', holder.width() - x );
					}						
				});
			}).on('mouseup', function(){
				$(this).off('mousemove');	
			});
		}
	},

	
	/*
	*	@Description: contact subpage
	*	@Actions: whole actions in this subpage (animation)
	*/
	
	contact : {
		actions : function(){
			var cube = $('#contact .cube');
			cube.on('mouseenter', function(){
				$(this).stop(true, true).animate( { 'margin-top' : 0 }, 300, 'easeOutBounce' );
			}).on('mouseleave', function(){
				$(this).animate( { 'margin-top' : 15 }, 300, 'easeOutBounce' );	
			})
		},
		animation : function(){
			var fadeSpeed = 1000,
				intervalSpeed = 340,
				holder = $('#contact'),
				cubes = holder.find('.cube').length,
				counter = 0;
			
			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();	
			});
			
			holder.find('.line').delay(fadeSpeed/1.3).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
			
			var interval = setInterval(function(){
				if(counter < cubes){
					holder.find('.cube').eq(counter).delay(counter).animate( { 'top' : 0, 'opacity' : 1 }, intervalSpeed , 'easeOutQuad' );
				} else {
					clearInterval(interval);	
				}
				counter++;	
			}, intervalSpeed/2);
			
			
		},
		// run animation with delay
		run : function(){
			ar.contact.animation();
		}
	},
	
	/*
	*	@Description: contact subpage
	*	@Actions: whole actions in this subpage (animation)
	*/
	
	clients : {
		init : function(){
			ar.clients.client();
		},
		animation : function(){
			var fadeSpeed = 1000,
				loadSpeed = 150,
				holder = $('#clients'),
				clients = holder.find('.client').length,
				counter = 0;
			
			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();
				holder.addClass('animated');	
			});
			holder.find('.line').delay(fadeSpeed/1.3).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
			
			var clientsInterval = setInterval(function(){
				if(counter < clients){
					holder.find('.client').eq(counter).fadeIn();
				} else {
					clearInterval(clientsInterval);	
				}
				counter++;	
			}, loadSpeed);
			
		},
		// run animation with delay
		run : function(){
			ar.clients.animation();
		},
		client : function(){
			var holder = $('#clients .client'),
				fadeSpeed = 300;
			
			holder.on('mouseenter', function(e){
				e.preventDefault();
				$(this).children('.sunshine').stop().fadeIn(fadeSpeed);
			}).on('mouseleave', function(){
				$(this).children('.sunshine').fadeOut(fadeSpeed);
			}).on('click', function(e){
				e.preventDefault();
			});	
		}
	},
	
	
	/*
	*	@Description: home subpage
	*	@Actions: whole actions in this subpage (animation)
	*/
	
	
	home : {
		init : function(){
			ar.home.run();
			ar.home.actions();
		},
		actions : function(){
			var stat = $('#home .achievement');
				
			stat.on('mouseenter', function(){
				$(this).stop(true, true).animate( { 'margin-top' : 0 }, 300, 'easeOutBounce' );
			}).on('mouseleave', function(){
				$(this).animate( { 'margin-top' : 15 }, 300, 'easeOutBounce' );	
			})
			
			stat.eq(0).on('click', function(){
				$('#about').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");	
			});
			stat.eq(1).on('click', function(){
				$('#awards').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");	
			});
			stat.eq(2).on('click', function(){
				$('#portfolio').scrollTo(ar.options.sectionChangeSpeed, "easeOutQuart");	
			});
			
		},
		animation : function(){
			var fadeSpeed = 1000,
				intervalSpeed = 300,
				holder = $('#home'),
				counter = 0,
				stats = holder.find('.achievement').length;
			
			holder.find('h2').fadeIn(fadeSpeed, function(){
				ar.page.keyboard.show();	
				ar.page.keyboard.pressAll();
				
				setTimeout(function(){
					ar.page.keyboard.unpressAll('fade');
				}, 900);
				
			});
			holder.find('.line').delay(fadeSpeed/1.3).animate({ 'width' : 114 }, fadeSpeed, 'easeOutQuad');
			var statsInterval = setInterval(function(){
				if(counter < stats){
					holder.find('.achievement').eq(counter).fadeIn(fadeSpeed/3).animate( { 'left' : '0', 'opacity' : 1 }, fadeSpeed/3 , 'easeOutQuad' );
					holder.find('.number').eq(counter).delay(fadeSpeed/4).animate( { 'opacity' : 1 }, fadeSpeed/2);
					ar.home.countDown( counter, holder.find('.number').eq(counter).text() );
					holder.find('.number').eq(counter).text('0');
				} else {
					clearInterval(statsInterval);	
				}
				counter++;	
			}, intervalSpeed);
		},
		// run animation with delay
		run : function(){
			setTimeout(function(){
				ar.home.animation();
			}, 400);
		},
		countDown : function(num, goto){
			var counter = 0,
				interval = 1300,
				element = $('#home').find('.achievement').eq(num);
				speed = parseInt(interval/goto);
				
			var countInv = setInterval(function(){
				if(counter-1 < goto){
					element.find('.number').text(counter);
				} else {
					clearInterval(countInv);	
				}
				counter++;	
			}, speed);
		}
	},


	/*
	*	@Description: fancybox for projects galleries
	*	@Actions: work on projects images
	*/
	
	fancybox : function(){
		$(".fancybox").fancybox();
	},


	/*
	*	@Description: resizer actions
	*	@Actions: change params of window size in app
	*/
	
	resizer : {
		init : function(){
			ar.resizer.refreshSize();
		},
		refreshSize : function(){
			ar.page.res.height = document.documentElement.clientHeight;
			ar.page.res.width =  document.documentElement.clientWidth;	
			ar.page.setSubsHeight();
			ar.portfolio.grid();
		}
	}
	
}


/*
*	Lets run this machine on document ready!
*/

$(document).ready(function(){
	ar.init();
	//$.fx.interval = 3;
}); 

/*
*	Page resize! we can start the page engine!
*/

$(window).resize(function(){
	ar.resizer.init();
});

/*
*	Page loaded! we can start the page engine!
*/

$(window).load(function(){
	console.log('all loaded!');	
});