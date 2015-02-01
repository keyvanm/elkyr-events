jQuery.fn.visible = function() {
	return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
	return this.css('visibility', 'hidden');
};

function sentenceAnimation (selector) {
	$(selector + " .sentence-select>span").each(function() {
		$(this).data('width', $(this).css("width"));
		$(this).css({width: "100%"});
	});
	$(selector + " .sentence-select>span").each(function(){
		$(this).animate({width:  $(this).data('width')}, 750, "easeInOutQuint", function(){
			$(this).css({"width": ""});
		});
	});
}

function myHide (selector) {
	$(selector).hide(250, function(){
		$(selector).addClass("my-hidden");
	})
}

function myShow (selector) {
	$(selector).show(250, function(){
		$(selector).removeClass("my-hidden");
		$(selector).find('input').focus();
	})
}

function loadSentence() {
	myHide('.inner.cover:not(.my-hidden)');
	myShow("#lively-sentence");
	// $('.masthead').show(250);
	sentenceAnimation("#lively-sentence");
}

function animateProgressBar (percent) {
	$(".progress > .progress-bar").animate({'width': percent+"%"}, 250, "easeOutQuint");
}
function sentenceClick (section) {
	myHide('.inner.cover:not(.my-hidden)');
	// $('.masthead').hide(250);
	myShow("#lively-sentence-"+section);
	sentenceAnimation("#lively-sentence-"+section);
}

function prefSelect (thisElem, selector, lsKey) {
	var val = $(thisElem).data("value")
	if (localStorage.getItem(lsKey) != val){
		localStorage.setItem(lsKey, val);
		$(thisElem).animate({width: "140px", height: "140px"}, 100, "easeOutBack");
		$(thisElem).children('span').animate({'line-height': '138px', 'font-size': '25px'}, 100, "easeOutBack");
		$(thisElem).addClass('pref-select-selected');
		$(selector).not($(thisElem)).animate({width: "100px", height: "100px"}, 100, "easeOutBack");
		$(selector).not($(thisElem)).children('span').animate({'font-size': '20px', 'line-height': '98px'}, 100, "easeOutBack");
		$(selector).not($(thisElem)).removeClass('pref-select-selected');
	}
}

$(function(){
	$('#clear-data').click(function(){
		myHide('.inner.cover:not(.my-hidden)');
		$(".navbar-toggle").click();
		myShow("#lively-clear-data");
	});

	$('#take-home').click(function(){
		myHide('.inner.cover:not(.my-hidden)');
		myShow("#lively-home");
	});

	$('#user-name-input').bind('keypress', function(e) {
		if (e.which == 13){
			$("#name-in").click();
		}
	});

	$('#user-age-input').bind('keypress', function(e) {
		if (e.which == 13){
			$("#age-in").click();
		}
	});

	$("#get-started").click(function(){
		$(".site-wrapper").css({'padding-top': '70px'});
		myHide(".masthead");
		myShow(".navbar.navbar-inverse.navbar-fixed-top");
		if (localStorage.user_name && localStorage.user_age && localStorage.user_ext && localStorage.user_doors && localStorage.user_dresscode) {
			loadSentence();
		} else {
			localStorage.clear();
			myHide('.inner.cover:not(.my-hidden)');
			myShow("#lively-name");
			myShow(".progress");
			animateProgressBar(0);
			// $("#user-name-input").focus();
		}
	});

	$("#name-in").click(function(){
		localStorage.user_name = $("#user-name-input").val();
		$("#user-name").text($("#user-name-input").val());
		myHide('.inner.cover:not(.my-hidden)');
		myShow("#lively-age");
		animateProgressBar(20);
		// $("#user-age-input").focus();
	});

	$("#age-in").click(function(){
		localStorage.user_age = $("#user-age-input").val();
		myHide('.inner.cover:not(.my-hidden)');
		myShow("#lively-extraversion");
		animateProgressBar(40);
	});

	$(".pref-select-ext").click(function(){
		prefSelect(this, ".pref-select-ext", "user_ext");
	});

	$("#ext-in").click(function(){
		myHide('.inner.cover:not(.my-hidden)');
		myShow("#lively-doors");
		animateProgressBar(60);
	});

	$(".pref-select-doors").click(function(){
		prefSelect(this, ".pref-select-doors", "user_doors");
	});

	$("#doors-in").click(function(){
		myHide('.inner.cover:not(.my-hidden)');
		myShow("#lively-dresscode");
		animateProgressBar(80);
	});

	$(".pref-select-dresscode").click(function(){
		prefSelect(this, ".pref-select-dresscode", "user_dresscode");
	});

	$("#dresscode-in").click(function(){
		myHide('.inner.cover:not(.my-hidden)');
		myShow("#lively-ready");
		animateProgressBar(100);
	});

	$("#find-events").click(function(){
		myHide(".progress");
		loadSentence();
	});

	$("#lively-sentence-im-link").click(function(){
		sentenceClick("im");
	});

	$("#lively-sentence-feel-link").click(function(){
		sentenceClick("feel");
	});

	$("#lively-sentence-with-link").click(function(){
		sentenceClick("with")
	});

	$("#lively-sentence-end-link").click(function(){
		sentenceClick("end")
	});

	$(".subsentence li.sentence-select").click(function(){
		var thisElem = this;
		var parentId = $(thisElem).closest(".inner.cover").attr("id");
		$("#"+parentId+"-link").data("skey", $(thisElem).data("skey"));
		$("#"+parentId+"-link").children("span").text($(thisElem).text());
		myHide('.inner.cover:not(.my-hidden)');
		loadSentence();
	});

	$("#search").click(function(){
		// myHide(".masthead");
		myHide('.inner.cover:not(.my-hidden)');
		myShow('#event-page');
	})
});