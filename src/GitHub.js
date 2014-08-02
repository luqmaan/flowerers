define('GitHub', ['when', 'lib/request'],
    function(when, request) {
        function GitHub(accessToken) {
            this.accessToken = accessToken;
        }

        GitHub.prototype.fetchAll = function(req) {
            var deferred = when.defer(),
                result = [];

            function fetch() {
                request(req)
                    .then(function(res) {
                        result = result.concat(res.body);

                        if (res.links.next && req.params.page < 4) {
                            req.params.page += 1;
                            fetch(req);
                        }
                        else {
                            console.log('Resolving fetchAll', req);
                            deferred.resolve(result);
                        }
                    }.bind(this))
                    .catch(function(e) {
                        console.error(e);
                        deferred.reject(e);
                    });
            }

            fetch();

            return deferred.promise;
        };

        GitHub.prototype.followers = function(username) {
            var deferred = when.defer(),
                _followers = JSON.parse(localStorage.getItem('flowerers:github:followers:' + username)),
                req;

            if (_followers) {
                console.debug('followers cache hit', username);
                deferred.resolve(_followers);
            }
            else {
                console.debug('followers cache miss', username);
                req = {
                    method: 'GET',
                    path: 'https://api.github.com/users/' + username + '/followers',
                    params: {
                        page: 0,
                        per_page: 100,
                        access_token: this.accessToken
                    }
                };

                this.fetchAll(req)
                    .then(function(flowers) {
                        localStorage.setItem('flowerers:github:followers:' + username, JSON.stringify(flowers));
                        deferred.resolve(flowers);
                    })
                    .catch(function(e) {
                        console.error(e);
                        deferred.reject(e);
                    });
            }

            return deferred.promise;
        };

        GitHub.prototype.following = function(username) {
            var deferred = when.defer(),
                _following = JSON.parse(localStorage.getItem('flowerers:github:following:' + username)),
                req;

            return deferred.resolve(_following);

            if (_following) {
                console.debug('following cache hit', username);
                deferred.resolve(_following);
            }
            else {
                console.debug('following cache miss', username);
                req = {
                    method: 'GET',
                    path: 'https://api.github.com/users/' + username + '/following',
                    params: {
                        page: 0,
                        per_page: 100,
                        access_token: this.accessToken
                    }
                };

                this.fetchAll(req)
                    .then(function(flowering) {
                        console.log('flowerers:github:following:' + username);
                        localStorage.setItem('flowerers:github:following:' + username, JSON.stringify(flowering));
                        deferred.resolve(flowering);
                    })
                    .catch(function(e) {
                        console.error(e);
                        deferred.reject(e);
                    });
            }

            return deferred.promise;
        };

        return GitHub;
    });
