var TIMER_FREQUENCY = 10000;
var contentArray = [];
var myInterval = 0;

$(document).ready(function() {
  //make ajax call to pull down JSON Data
  $.ajax({
    url: 'http://devjana.net/support/tau_students.json',
    dataType: 'JSON',
    success: function(data) {
      var counter = 0;
      //parse through tauers in JSON data
      for (var i = 0; i < data.tau.length; i++) {
        var tauer = data.tau[i];
        //push tauers into content array
        contentArray.push(tauer);
        //add index property to tauers in contentArray
        tauer.index = counter;
        counter ++;
        //add go-to buttons to the DOM
        $('.slider-contain').append('<div class="goto-contain" data-index="'+ tauer.index +'"></div>');
        var $goTo = $('.slider-contain').children().last();
        $goTo.append('<div class="goto-btn main-btn" >' + tauer.first_name + '</div>');
      } // end for
      init();
    } // end success
  }); // end ajax
}); // end doc ready

var init = function() {
  generateContent(contentArray);
  startTimer();
  //event listeners
  $('#prevButton').on('click', function() {
    displayPrevOrNext(contentArray, 'prev');
  }); // end on click for #prevButton
  $('#nextButton').on('click', function(){
    displayPrevOrNext(contentArray, 'next');
  }); // end on click for #nextButton
  $('.goto-contain').on('click', function() {
    //get data-index of button clicked
    var $indexClicked = $(this).data('index');
    changeContent(contentArray, $indexClicked);
    //reset timer
    startTimer();
  });// end on click for .goto-contain
}; // end init

var changeContent = function(array, index) {
  var $visible = $('.content').find('.visible');
  //fadeOut previously visible content and remove .visible
  $visible.fadeOut('slow', function() {
    $visible.removeClass('visible');
    //fadeIn new content and add .visible
    var $toDisplay = $('.tau-student[data-index="' + contentArray[index].index + '"]');
    $toDisplay.fadeIn('slow');
    $toDisplay.addClass('visible');
  }); // end fadeOut
}; // end displayContent

var displayPrevOrNext = function(array, direction) {
  //get index of currently visible content
  var $visibleIndex = $('.content').find('.visible').data('index');
  var $toDisplay;
  //figure out direction of button pushed
  if (direction === 'prev') {
    //calculate index prior to currently visible content, wrap if index 0
    if ($visibleIndex === 0) {
      $toDisplay = array.length -1;
    } else {
      $toDisplay = $visibleIndex - 1;
    } // end if/else
  } else if (direction === 'next') {
    var $lastIndex = array.length - 1;
    //calculate next index after currently visible content, wrap if index is last in array
    if ($visibleIndex === $lastIndex) {
      $toDisplay = 0;
    } else {
      $toDisplay = $visibleIndex + 1;
    } // end if/else
  } // end else/if
  changeContent(array, $toDisplay);
  //reset timer
  startTimer();
}; // end displayPrevOrNext

var generateContent = function(array) {
  var position;
  //iterate through array to generate content, display on DOM
  for (var i = 0; i < array.length; i++) {
    var tauer = array[i];
    //add class .visible to first .tau-student on load
    if (tauer.index === 0) {
      $('.content').append('<div class="tau-student visible" data-index="'+ tauer.index +'"></div>');
    } else {
      $('.content').append('<div class="tau-student" data-index="'+ tauer.index +'"></div>');
    } // end if/else
    var $el = $('.content').children().last();
    $el.append('<img class="avatar-img img-responsive thumbnail" src="'+ tauer.picUrl +'" alt="'+ tauer.first_name +'">');
    $el.append('<div class="avatar-text"></div>');
    var $outputText = $el.find('.avatar-text');
    $outputText.append('<p class="avatar-name">' + tauer.first_name + ' ' + tauer.last_name + '</p><hr>');
    $outputText.append('<p class="avatar-info">' + tauer.info + '</p>');
    position = tauer.index + 1;
    $outputText.append('<p class="avatar-index">' + position + '/' + array.length + '</p>');
  } // end for
}; // end generateContent

var startTimer = function() {
  //displayNext() at TIMER_FREQUENCY if user is not clicking
  if (myInterval > 0) {
    clearInterval(myInterval);
  } // end if
  myInterval = setInterval('displayPrevOrNext(contentArray, "next")', TIMER_FREQUENCY);
}; // end startTimer
