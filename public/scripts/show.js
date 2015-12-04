
// This JS will handle the inputs in the page
// that displays the single image >> Comments + Map


// For Comments in the blog:
// wait for DOM to load before running JS
$(function() {

 // compile handlebars template
  var source = $('#single-photo-template').html();
  var template = Handlebars.compile(source);
  console.log(source);

  // element to display list of posts
  var $postsList = $('#posts-list');

  // form to create new post
  var $createpost = $('#create-post');
  // get one photo (has comments inside) on page load


  // helper function to render all posts to view
  // note: we empty and re-render the collection each time our post data changes
  

  // listen for submit event-handlers on form
  $createpost.on('submit', function (event) {
    var photoId = $(this).attr('data-id');

    event.preventDefault();

    // serialze form data
    var newPost = $(this).serialize();

    // POST request to create new post
    $.post('/api/photos/'+photoId+'/comments', newPost, function (data) {
      console.log(data);
      var commentHtml = template(data);
      $postsList.append(commentHtml);
      
    });

    // reset the form
    $createpost[0].reset();
    $createpost.find('input').first().focus();
  });

  // add event-handlers to posts for updating/deleting
  $postsList

    // for update: submit event on `.update-post` form
    .on('submit', '.update-post', function (event) {
      event.preventDefault();
      
      // find the post's id (stored in HTML as `data-id`)
      var postId = $(this).closest('.post').attr('data-id');

      // find the post to update by its id
      var postToUpdate = allPosts.filter(function (post) {
        return post._id == postId;
      })[0];

      // serialze form data
      var updatedpost = $(this).serialize();

      // PUT request to update comment
      $.ajax({
        type: 'PUT',
        url: '/api/photos/'+photoId+'/comments'+ postId,
        data: updatedpost,
        success: function(data) {
          // replace post to update with newly updated version (data)
          allPosts.splice(allPosts.indexOf(postToUpdate), 1, data);

          // render all posts to view
          render();
        }
      });
    })
    
    // for delete: click event on `.delete-post` button
    .on('click', '.delete-post', function (event) {
      event.preventDefault();

      // find the post's id (stored in HTML as `data-id`)
      var postId = $(this).closest('.post').attr('data-id');

      // find the post to delete by its id
      var postToDelete = allPosts.filter(function (post) {
        return post._id == postId;
      })[0];

      // DELETE request to delete post
      $.ajax({
        type: 'DELETE',
        url: baseUrl + '/' + postId,
        success: function(data) {
          // remove deleted post from all posts
          allPosts.splice(allPosts.indexOf(postToDelete), 1);

          // render all posts to view
          render();
        }
      });
    });

});