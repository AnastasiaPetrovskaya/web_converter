module.exports = exports = function() {

    var crypto = require('crypto');


    /*
     * Default encoding alphabets
     * URL-friendly base-64 encoding is chosen.  Base-32 is best suited
     * for tiny-URL like applications, because I and 1 can't be confused
     * and the upper-case characters are more easily remembered by a human.
     *
     * Where "native", we use the bignum native encoding routine.
     */
    var defaultAlphabets = {
        10: "0123456789",
        16: "0123456789ABCDEF",
        32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        36: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        62: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
    };

    function getRandomChar(array) {
        var rNum = Math.floor(Math.random() * array.length);
        return array[rNum];
    }


    return function(options, cb) {
        var len = options.len || 7;
        // if an alphabet was specified it takes priorty
        // otherwise use the default alphabet for the given base
        var base = options.alphabet ? options.alphabet.length : (options.base || 64);
        var alphabet = options.alphabet || defaultAlphabets[base];

        if (!alphabet) {
            var err = new Error(
                "Only base " +
                Object.keys(alphabets).join(", ") +
                " supported if an alphabet is not provided."
            );
            cb(err, null);
            return;
        }

        // Transform alphabet to array
        alphabet = alphabet.split('');

        // Get a random char for each chars of final id
        var id = '';
        for(var i = 0; i < len; i++) {
            id += getRandomChar(alphabet);
        }

        cb(null, id);
    };
}();
