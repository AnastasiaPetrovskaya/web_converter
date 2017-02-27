module.exports.Timestamp = (function () {
    return {
        /**
         * Returns current timestamp in seconds
         */
        now: function () {
            return Math.round(new Date().getTime() / 1000);
        }
    }
}());
