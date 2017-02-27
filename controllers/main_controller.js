var get = {
    '/': function(req, res, next) {
        console.log('here');
        res.render('main/index', { current_page: 'main' });
    },

    '/login': function(req, res, next) {
        res.render('login');
    },
};


module.exports = {
    resource: '',
    methods: {
        get: get
    }
};
