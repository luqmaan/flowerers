define('GitHub', ['when', 'lib/request'],
    function(when, request) {
        function GitHub(accessToken) {
            this.accessToken = accessToken;
        }

        GitHub.prototype.followers = function(username, page) {
            var deferred = when.defer(),
                followers = [],
                req = {
                    method: 'GET',
                    path: 'https://api.github.com/users/' + username + '/followers',
                    params: {
                        page: 0,
                        access_token: this.accessToken
                    }
                };

            request(req)
                .then(function(res) {
                    console.log(res);
                    window.res = res;
                    deferred.resolve(followers);
                })
                .catch(function(e) {
                    window.res = e;
                    console.error(e);
                    deferred.reject(e);
                });

            return deferred.promise;
        };

        return GitHub;
    });
