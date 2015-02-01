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
		$(document.body).css({"background-image": "none"});
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

	$("#next-event").click(function(){
		populatePage();
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
		var mu_url_string = "https://api.meetup.com/2/open_events?&sign=true&photo-host=public&state=ON&lon=-79.36000061035156&city=560735&lat=43.7400016784668&country=ca&key=33594d52533a314944433d6d22685d4a&radius=smart&page=20&";
		mu_url_string += formatMuCategories();

		$.ajax({
			url: mu_url_string,
			success: muSuccess,
			error: showError,
			dataType: "jsonp"
		});

	});
});

var currentEventIndex = 0;
var jsonResponse;

function muSuccess(data){
	if (data.results.length == 0){
		sendEbRequest();
	}
	jsonResponse = data;

	populatePage();
}

function populatePage(){
	var data = jsonResponse;
	if (currentEventIndex >= data.results.length){
		$("#find-events").click();
	}
	myHide('.inner.cover:not(.my-hidden)');
	try {
		var lat = data.results[currentEventIndex].venue.lat;
		var lon = data.results[currentEventIndex].venue.lon;
	} catch(e){
		var lat = 43.652;
		var lon = -79.381;
	}
	var eventUrl = data.results[currentEventIndex].event_url;
	var mapSrc = formatMapUrl(lat, lon);

	$("#event-name").text(data.results[currentEventIndex].name);
	$("#event-desc").html(data.results[currentEventIndex].description);
	$("#event-desc").find('a').text('link');
	$("#event-url").attr("href", eventUrl);
	$("#map").attr("src", mapSrc);

	currentEventIndex++;

	myShow('#event-page');

}

function sendEbRequest(){
	var eb_url_string = "https://www.eventbriteapi.com/v3/events/search/?token=WLDLTCSQNTYUFBSE32R2&location.address=toronto&location.within=100km&";
	eb_url_string += formatEbPopular() + formatEbCategories();

	$.ajax({
		url: eb_url_string,
		success: ebSuccess,
		error: showError,
		jsonp: false,
		jsonpCallback: false,
		dataType: "json",
		cache: true
	});
}

function formatMapUrl(lat, lon){
	return "https://maps.googleapis.com/maps/api/staticmap?size=342x180&markers=color:red%7C" + lat + "," + lon;
}


function formatEbPopular() {
    if ($("#lively-sentence-feel-link").data("skey") == 11){
      return "popular=off&";
    }
    return "popular=on&";
}

function formatEbCategories() {

  choice = $("#lively-sentence-feel-link").data("skey");

  if (choice == 1)
    return "q=party&categories=103%2C+104%2C+106%2C+110%2C+116%2C+119+%2C+199&";
  if (choice == 2)
    return "categories=103&";
  if (choice == 3)
    return "categories=110&";
  if (choice == 4)
    return "categories=119%2C+117%2C+115%2C+113%2C+110&";
  if (choice == 5)
    return "categories=108&";
  if (choice == 6)
    return "categories=109&";
  if (choice == 7)
    return "categories=111&";
  if (choice == 8)
    return "categories=102&";
  if (choice == 9)
    return "categories=114&";
  if (choice == 10)
    return "categories=105&";
  return "";

}

function formatMuCategories() {

  choice = $("#lively-sentence-feel-link").data("skey");

  if (choice == 1)
    return "category=5,21&";
  if (choice == 2)
   return "category=21&";
  if (choice == 3)
    return "category=10&";
  if (choice == 4)
    return "category=1,4,8,11,14,17&";
  if (choice == 5)
    return "category=9&";
  if (choice == 6)
    return "category=9&";
  if (choice == 7)
    return "category=4&";
  if (choice == 8)
    return "category=6&";
  if (choice == 9)
    return "category=22&";
  if (choice == 10)
    return "category=20,18,1&";
  return "";
}

function showError(){
	alert("Oops! Something went wrong :-(");
}