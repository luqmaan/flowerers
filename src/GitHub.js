define('GitHub', ['when', 'lib/request'],
    function(when, request) {
        var PER_PAGE = 100,
            MAX_PAGES = 3,
            MIN_FETCH_INTERVAL = 10,
            MAX_FETCH_INTERVAL = 50;

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

                        if (res.links.next && req.params.page <= MAX_PAGES) {
                            req.params.page += 1;
                            setTimeout(fetch, Math.random(MIN_FETCH_INTERVAL, MAX_FETCH_INTERVAL));
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

            setTimeout(fetch, Math.random(MIN_FETCH_INTERVAL, MAX_FETCH_INTERVAL));

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
                        per_page: PER_PAGE,
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

        return GitHub;
    });
