# Instagram API wrapper
I needed to do some heavy Instagram integration in my last project and decided to create an Instagram API wrapper for ease of use.
It saves your oAuth token for internal use and makes sure all Instagram's functions are accessinble in the same simple async way.

For some basics see: 
http://instagram.com/developer/

You can create a client here:
http://instagram.com/developer/clients/manage/

Scope can be:
* `basic` To read any and all data related to a user (e.g. following/followed-by lists, photos, etc.) (granted by default)
* `comments` To create or delete comments on a user’s behalf
* `relationships` To follow and unfollow users on a user’s behalf
* `likes` To like and unlike items on a user’s behalf

## Requirements
* jQuery (For ajax calls)
* Modernizr (To check if local storage is supported)

## How to instantiate
```javascript
var InstagramWrapperInstance = new Instagram(
{
	client_id: '<your_instagram_client_id>'
	redirect_uri: '<should_be_the_same_as_in_instagram_client_config>'
	scope: 'basic'
	response_type: 'token'
});
```

## How to use
```javascript

var token = InstagramWrapperInstance.getToken();

if(token)
{
	// Get feed
	InstagramWrapperInstance.getFeed(function(instagramData, paginationData)
	{
		console.log(instagramData, paginationData);
	));

	// Get Recent Media
	InstagramWrapperInstance.getRecentMedia(function(instagramData, paginationData)
	{
		console.log(instagramData, paginationData);
	});

	// Get a single image
	InstagramWrapperInstance.getMedia(function(instagramData)
	{
		console.log(instagramData);
	
	}, { id: '<xxx>' });
}
else
{
	InstagramWrapperInstance.auth();
}
```
