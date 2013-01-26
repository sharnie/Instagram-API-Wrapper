/*global console:false, Modernizr:false, window:false, document: false, localStorage:false*/

/**
 * Instagram
 * @param  {object} $ jQuery
 * @param  {object} ns NameSpace
 * @dependencies jQuery, Modernizr
 */
(function ($, ns)
{
    "use strict";

    /**
     * Instagram Constructor
     */
    ns.Instagram = function(options)
    {
        var authUri = 'https://instagram.com/oauth/authorize/?',
            apiEndpoint = 'https://api.instagram.com/v1/',
            authParams = '',
            loc = window.location,

        /**
         * Authenticate with Instagram
         * @param {array} options A list of options to authenticate with: client_id, redirect_uri, scope, response_type.
         */
        auth = function()
        {
            $.each(options, function(key, value)
            {
                return authParams += key + '=' + value + '&';
            });

            authUri += authParams;

            return loc.href = authUri;
        },

        /**
         * Log off Instagram
         * unsets token opens instagrams log out window...
         */
        unAuth = function()
        {
            unSetToken(function()
            {
                window.open('https://instagram.com/accounts/logout/');
            });
        },

        /**
         * Returns the autentication token if it extsts, otherwise tries to get it from the url.
         * @return {string} authentication token
         */
        getToken = function()
        {
            var tokenFromUrl = loc.hash.replace('#access_token=', '');

            if(tokenFromUrl)
            {
                setToken(tokenFromUrl);
                return tokenFromUrl;
            }
            else
            {
                return retrieve();
            }
        },

        /**
         * Gets the token from localStorage or a cookie
         * @return {string} Instagram access token
         */
        retrieve = function()
        {
            if(Modernizr.localstorage)
            {
                return localStorage.getItem('instagram_access_token') || null;
            }
            else
            {
                return readCookie('instagram_access_token') || null;
            }
        },

        /**
         * Read a cookie by key
         * @param  {string} key Name of the cookie
         * @return {string} Value of the cookie
         */
        readCookie = function(key)
        {
            var result;
            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
        },

        /**
         * Set the authentication token. Saves in localStorage or in a cookie.
         * @param {sting} token The authentication token
         */
        setToken = function(token)
        {
            if(Modernizr.localstorage)
            {
                localStorage.setItem('instagram_access_token', token);
            }
            else
            {
                var expireDate = new Date(),
                    date = expireDate.setDate(expireDate.getDate() + 14);

                document.cookie = 'instagram_access_token = '+ token +'; expires=' + expireDate.toUTCString();
            }
        },

        /**
         *  Remove token from localStorage or cookie.
         *  @return {function} callback after the token was unset.
         */
        unSetToken = function(callback)
        {
            if(Modernizr.localstorage)
            {
                localStorage.removeItem('instagram_access_token');
            }
            else
            {
                document.cookie = 'instagram_access_token=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }

            if(callback && typeof callback === 'function')
            {
                callback();
            }
        },

        /**
         * Call the Instagram service
         * @param   {string}    url         The url to append to the endpoint url. e.g. /users/self/feed
         * @param   {object}    options     Options to send to the Instagram call
         * @param   {Function}  callback    Function to fire after the call to the API
         */
        call = function(url, callback, options)
        {
            if(!url) throw('No url given');
            if(!callback || typeof callback !== 'function') throw('No callback function has been defined or the callback variable is not a function.');

            var urlToCall = apiEndpoint + url + '?access_token=' + getToken() + '&callback=?',
                jqxhr;

            options = options || {};

            jqxhr = $.getJSON(urlToCall, options);
            
            jqxhr.done(function(result)
            {
                if(result.meta.code === 200)
                {
                    var resultData = result.data,
                        paginationData = result.pagination || {};

                    callback(resultData, paginationData);
                }
                else
                {
                    handleError(result.meta);
                }
            });

            jqxhr.error(handleError);
        },

        /**
         *  Shows the error in the console
         *  @param {object} error An object that holds the code, error type and the error message.
         */
        handleError = function(error)
        {
            if(error.code)
            {
                console.error('[Instagram] error:', error.code, error.error_type, error.error_message);
            }
            else
            {
                console.error('[Instagram] undefined error...');
            }
        },

        /**
         * Get user info
         * @param  {Function} callback Function to fire after the call to the API
         */
        getUser = function(callback, options)
        {
            call('users/self', callback, options);
        },

        /**
         * Get the users feed
         * @param  {Function} callback Function to fire after the call to the API
         */
        getFeed = function(callback, options)
        {
            call('users/self/feed', callback, options);
        },

        /**
         * Get the latest uploaded images
         * @param   {Function}  callback    Function to fire after the call to the API
         * @param   {object}    options     Options can be: count, max_timestamp, min_timestamp, min_id, max_id.
         */
        getRecentMedia = function(callback, options)
        {
            call('users/self/media/recent', callback, options);
        },

        /**
         * Get the latest uploaded images
         * @param   {Function}  callback    Function to fire after the call to the API
         * @param   {object}    options     Options can be: count, max_timestamp, min_timestamp, min_id, max_id.
         */
        getMedia = function(callback, options)
        {
            call('media/' + options.id, callback, options);
        },

        /**
         * Get the 20 latest liked media items
         * @param  {Function} callback Function to fire after the call to the API
         */
        getLikedMedia = function(callback, options)
        {
            call('users/self/media/liked', callback, options);
        };

        return {
            auth: auth,
            unAuth: unAuth,
            getToken: getToken,
            setToken: setToken,
            getFeed: getFeed,
            getRecentMedia: getRecentMedia,
            getUser: getUser,
            getLikedMedia: getLikedMedia,
            getMedia: getMedia
        };
    };

}(jQuery, window.NAMESPACE || window.NAMESPACE || {}));