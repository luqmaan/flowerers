define('lib/request', ['Arg', 'when'],
function(Arg, when) {

    function request(options) {
        var url = Arg.url(options.path, options.params),
            req = new XMLHttpRequest(),
            deferred = when.defer();

        console.log(options.method, '=>',  url);

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
                    links: parseLinkHeader(headers.link),
                    body: null
                };

            try {
                result.body = JSON.parse(req.responseText);
            }
            catch (e) {
                result.body = req.responseText;
            }
            console.log(options.method, '=>',  url, '=>', result);

            if (req.status >= 200 && req.status < 400) {
                deferred.resolve(result);
            }
            else {
                deferred.reject(result);
            }
        };

        req.onerror = function(e) {
            console.error(e);
            deferred.reject(e);
        };

        req.send();

        return deferred.promise;
    }

    function parseHeaders(headerStr) {
        var parsed = {};

        headerStr
            .split('\n')
            .forEach(function(line) {
                var i = line.indexOf(':'),
                    k = line.substr(0, i),
                    v = line.substr(i + 1);

                if (!!k) {
                    k = k.trim().toLowerCase();
                    v = v.trim();

                    parsed[k] = v;
                }
            });

        return parsed;
    }

    function parseLinkHeader(linkStr) {
        // Copypasta + pesto from https://github.com/jfromaniello/parse-links/blob/master/lib/index.js
        if (!linkStr) return {};

        var parsed = {},
            entries = linkStr.split(','),
            relsRegExp = /\brel="?([^"]+)"?\s*;?/,
            keysRegExp = /(\b[0-9a-z\.-]+\b)/g,
            sourceRegExp = /^<(.*)>/;

        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i].trim(),
                rels = relsRegExp.exec(entry);

            if (rels) {
                var keys = rels[1].match(keysRegExp),
                    source = sourceRegExp.exec(entry)[1],
                    kLength = keys.length,
                    k;

                for (k = 0; k < kLength; k += 1) {
                    parsed[keys[k]] = source;
                }
            }
        }

        return parsed;
    }

    return request;
});
