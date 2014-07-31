define('lib/request', ['Arg', 'when'],
function(Arg, when) {

    function request(options) {
        var url = Arg.url(options.path, options.params),
            req = new XMLHttpRequest(),
            deferred = when.defer();

        console.log(options, options.method, '=>',  url);

        req.open(options.method, url, true);

        req.onload = function() {
            var headers = parseHeaders(req.getAllResponseHeaders()),
                result = {
                    request: {
                        options: options,
                        url: url
                    },
                    status: req.status,
                    headers: headers,
                    links: parseLinks(headers),
                    body: null
                };

            try {
                result.body = JSON.parse(req.responseText);
            }
            catch (e) {
                result.body = req.responseText;
            }

            if (req.status >= 200 && req.status < 400) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(result);
            }
        };

        req.onerror = function(e) {
            deferred.reject(e);
        };

        req.send();

        return deferred.promise;
    }

    function parseHeaders(headerStr) {
        var result = {};

        window.h = headerStr;

        headerStr
            .split('\n')
            .forEach(function(h) {
                var split = h.split(':'),
                    k = split[0],
                    v = split[1];

                if (!!k) {
                    k = k.trim();
                    v = v.trim();

                    result[k] = v;
                }
            });

        return result;
    }

    function parseLinks(headers) {
        if (headers.Link) {

        }
    }

    return request;
});
