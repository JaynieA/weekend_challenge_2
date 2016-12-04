
var contentArray = [];
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
        $('.slider-contain').append('<div class="goto-contain"></div>');
        var $goTo = $('.slider-contain').children().last();
        $goTo.append('<div class="goto-btn main-btn" data-index="'+ tauer.index +'">' + tauer.first_name + '</div>');
      } // end for
      console.log(contentArray); // logs complete content array
      init();
    } // end success
  }); // end ajax
}); // end doc ready

var init = function() {
  console.log('ajax success!');
  generateContent(contentArray);
  //event listeners
  $('#prevButton').on('click', function() {
    displayPrev(contentArray);
  }); // end on click for #prevButton
  $('#nextButton').on('click', function(){
    console.log('next button clicked');
  }); // end on click for #nextButton
}; // end init

var generateContent = function(array) {
  console.log('in generateContent');
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
  //add .visible class to first student so it shows

}; // end generateContent

var changeContent = function(array, index) {
  console.log('in displayContent');
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

var displayPrev = function(array) {
  console.log('in displayPrev');
  //get index of currently visible content
  var $visibleIndex = $('.content').find('.visible').data('index');
  var $toDisplay;
  //calculate index prior to currently visible content, wrap if index 0
  if ($visibleIndex === 0) {
    $toDisplay = array.length -1;
  } else {
    $toDisplay = $visibleIndex - 1;
  } // end if/else
  changeContent(array, $toDisplay);
}; // end displayPrev
