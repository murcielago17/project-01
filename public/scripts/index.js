
// This JS will handle the inputs in the page
// that displays the single image >> Comments + Map
$(document).ready( function() {

  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: 160
  });
  
});

// For Photos from database:
// wait for DOM to load before running JS
$(function() {
  console.log('js works');

  // base API route for comments
  var baseUrl = '/api/photos';

  // array to hold photo photos from API
  var allPhotos = [];

  // element to display list of photos
  var $photosList = $('#photos-list');

  // // form to create new photo
  // var $createphoto = $('#create-photo');

  // compile handlebars template
  var source = $('#photos-template').html();
  var template = Handlebars.compile(source);
  console.log(source);
  // helper function to render all photos to view
  // Empty and re-render the collection each 
  // time the photo photos changes
  var render = function() {
    // empty existing photos from view
    $photosList.empty();
     var photosHtml = template({ photos: allPhotos });
    console.log(photosHtml);
    // append html to the view
    $photosList.append(photosHtml);

  };

  // GET all photos on page load
  $.get(baseUrl, function (data) {
   
    // set `allphotos` to photo photos from API
    allPhotos = data.photos;
    console.log(allPhotos);
    // render all photos to view
    render();
  });

});