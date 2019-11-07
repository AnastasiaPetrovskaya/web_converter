global.ApplicationHelper = function () { console.log('eee');};

ApplicationHelper.count_pages = function(docs, limit) {
    if (!docs || docs < limit) {
        return 1;
    } else if (docs % limit === 0) {
        return docs/limit;
    } else {
        return Math.floor(docs/limit)+1;
    }
};

/*
ApplicationHelper.check_access = function (req, partner_id, only_subtree, no_error) {
    var user_partner_id = req.user.partner_id;
    return app.cache.partners.check_in(partner_id, user_partner_id, only_subtree)
    .then(function (result) {
        if (!result && !no_error) {
            throw {message: 'AccessDenied'};
        } else {
            return result;
        }
    });
};
*/


