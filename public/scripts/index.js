
// This JS will handle the inputs in the page
// that displays the single image >> Comments + Map


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
  // // listen for submit even on form
  // $createphoto.on('submit', function (event) {
  //   event.preventDefault();

  //   // serialze form photos
  //   var newphoto = $(this).serialize();

  //   // photo request to create new photo
  //   $.photo(baseUrl, newphoto, function (photos) {
  //     console.log(photos);

  //     // add new photo to `allphotos`
  //     allphotos.push(photos);

  //     // render all photos to view
  //     render();
  //   });

  //   // reset the form
  //   $createphoto[0].reset();
  //   $createphoto.find('input').first().focus();
  // });

  // // add event-handlers to photos for updating/deleting
  // $photosList

  //   // for update: submit event on `.update-photo` form
  //   .on('submit', '.update-photo', function (event) {
  //     event.preventDefault();
      
  //     // find the photo's id (stored in HTML as `photos-id`)
  //     var photoId = $(this).closest('.photo').attr('photos-id');

  //     // find the photo to update by its id
  //     var photoToUpdate = allphotos.filter(function (photo) {
  //       return photo._id == photoId;
  //     })[0];

  //     // serialze form photos
  //     var updatedphoto = $(this).serialize();

  //     // PUT request to update comment
  //     $.ajax({
  //       type: 'PUT',
  //       url: baseUrl + '/' + photoId,
  //       photos: updatedphoto,
  //       success: function(photos) {
  //         // replace photo to update with newly updated version (photos)
  //         allphotos.splice(allphotos.indexOf(photoToUpdate), 1, photos);

  //         // render all photos to view
  //         render();
  //       }
  //     });
  //   })
    
  //   // for delete: click event on `.delete-photo` button
  //   .on('click', '.delete-photo', function (event) {
  //     event.preventDefault();

  //     // find the photo's id (stored in HTML as `photos-id`)
  //     var photoId = $(this).closest('.photo').attr('photos-id');

  //     // find the photo to delete by its id
  //     var photoToDelete = allphotos.filter(function (photo) {
  //       return photo._id == photoId;
  //     })[0];

  //     // DELETE request to delete photo
  //     $.ajax({
  //       type: 'DELETE',
  //       url: baseUrl + '/' + photoId,
  //       success: function(photos) {
  //         // remove deleted photo from all photos
  //         allphotos.splice(allphotos.indexOf(photoToDelete), 1);

  //         // render all photos to view
  //         render();
  //       }
  //     });
  //   });

});