define('GitHub', ['when', 'lib/request'],
    function(when, request) {
        function GitHub(accessToken) {
            this.accessToken = accessToken;
        }

        GitHub.prototype.followers = function(username, page) {
            var deferred = when.defer(),
                _followers = JSON.parse(localStorage.getItem('flowerers:github:followers:' + username)),
                followers = [],
                req = {
                    method: 'GET',
                    path: 'https://api.github.com/users/' + username + '/followers',
                    params: {
                        page: 0,
                        access_token: this.accessToken
                    }
                };

            function fetch() {
                request(req)
                    .then(function(res) {
                        followers = followers.concat(res.body);

                        if (res.links.next) {
                            req.params.page += 1;
                            fetch();
                        }
                        else {
                            localStorage.setItem('flowerers:github:followers:' + username, JSON.stringify(followers));
                            deferred.resolve(followers);
                        }
                    })
                    .catch(function(e) {
                        console.error(e);
                        deferred.reject(e);
                    });
            }


            if (_followers) {
                console.debug('followers cache hit', username);
                deferred.resolve(_followers);
            }
            else {
                console.debug('followers cache miss', username);
                fetch();
            }

            return deferred.promise;
        };

        return GitHub;
    });
