$(document).ready(function() {
    // Allow using Handlebars templates as partials as well
    Handlebars.partials = Handlebars.templates;
    // Enable use of HandlebarsIntl for formatRelative helper
    HandlebarsIntl.registerWith(Handlebars);

    // Register helper to check equality in templates
    // Referred to: http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
    Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
        if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
        if( lvalue!=rvalue ) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    });

    // Determine if there is an existing session (and show All Freets page),
    // otherwise show Login page
    $.get('/testIfSession', function(resp) {
        if (resp.success) {
            if (resp.loggedIn) {
                loadFritterAndHeader(resp);
                displayFreets(function() {});
            } else {
                displayLogin();
            }
        }
    });

    // Load the header and empty Fritter content that is displayed
    // to a logged in user
    var loadFritterAndHeader = function(resp) {
        var fritterHtml = Handlebars.templates.fritter({});
        $('#content').html(fritterHtml);   
        var welcomeHtml = Handlebars.templates.header(resp);
        $('#welcome-row').append(welcomeHtml);  
    }

    // Display all freets
    var displayFreets = function(cb) {  
        $.get('/freets', function(resp) {
            if (resp.success) {
                resp = JSON.parse(JSON.stringify(resp));
                // Load all the freets onto the page
                var html = Handlebars.templates.freets(resp);
                $('#freet-table-list-group').html(html);
                cb();
            }
        });
    }

    // Display freets by users the session user is following
    var displayFollowingFreets = function(cb) {  
        $.get('/freets/following', function(resp) {
            if (resp.success) {
                resp = JSON.parse(JSON.stringify(resp));
                // Load all the freets onto the page
                var html = Handlebars.templates.freets(resp);
                $('#freet-table-list-group').html(html);
                cb();
            }
        });
    }

    // Display the login page
    var displayLogin = function() {
        var loginHtml = Handlebars.templates.login({});
        $('#content').html(loginHtml);
    }

    // When the "Logout" button is clicked, log the user out and show the
    // login page
    $('#content').on('click', '#logout-btn', function(e) {
        $.post('/logout', function(resp) {
            if (resp.success) {
                var loginHtml = Handlebars.templates.login(resp);
                $('#content').html(loginHtml);
            }
        });
    });

    // When the Sign up link is clicked, show the signup form
    $('#content').on('click', '#signup-page-btn', function(e) {
        e.preventDefault();
        var signupHtml = Handlebars.templates.signup({});
        $('#content').html(signupHtml);
    });

    // When the Log in link is clicked, show the login form 
    $('#content').on('click', '#login-page-btn', function(e) {
        e.preventDefault();
        var loginHtml = Handlebars.templates.login({});
        $('#content').html(loginHtml);
    });

    // When a user clicks the "Sign up" button, post a request to
    // register the user
    $('#content').on('click', '#signup-submit-btn', function(e) {
        e.preventDefault();        
        $('.error-msg').html(''); // Reset error message
        $.post("/signup", {
            "fullName": $('#signup-fullname').val(),
            "username": $('#signup-username').val(),   
            "password": $('#signup-password').val()
        }, function(resp) {
            if (resp.success) {
                // If sign up successful, show Fritter
                loadFritterAndHeader(resp);
                displayFreets(function() {});
            } else if (resp.message !== undefined) {
                // Sign up was unsuccessful, show user message
                // of what error occurred
                $('.error-msg').html(resp.message);
            }
        });
    });

    // When a user clicks the "Log in" button, post a request to
    // log the user in
    $('#content').on('click', '#login-submit-btn', function(e) {
        e.preventDefault();
        $('.error-msg').html(''); // Reset error message
        $.post("/login", {
            "username": $('#login-username').val(),   
            "password": $('#login-password').val()
        }, function(resp) {
            if (resp.success) {
                // If log in successful, show Fritter
                loadFritterAndHeader(resp);
                displayFreets(function() {});
            } else if (resp.message !== undefined) {
                // Log in was unsuccessful, show user message
                // of what error occurred
                $('.error-msg').html(resp.message);
            }
        });
    });

    // When the All Freets tab is clicked, display all freets
    $('#content').on('click', '#all-freets-btn', function(e) {
        e.preventDefault();
        displayFreets(function() {
            // Make the All Freets tab active and others inactive
            $('#all-freets-tab').addClass('active');
            $('#following-freets-tab').removeClass('active');
            $('#users-tab').removeClass('active');
        });
    });

    // When the Following Freets tab is clicked, display freets by users
    // the sesion user is following
    $('#content').on('click', '#following-freets-btn', function(e) {
        e.preventDefault();
        displayFollowingFreets(function() {
            // Make the Following Freets tab active and others inactive
            $('#all-freets-tab').removeClass('active');
            $('#following-freets-tab').addClass('active');
            $('#users-tab').removeClass('active');
        });
    });

    // When the Users tab is clicked, display users the session user
    // is following and not following with options to follow users
    $('#content').on('click', '#users-btn', function(e) {
        e.preventDefault();
        $.get('/following', function(resp) {
            if (resp.success) {
                var html = Handlebars.templates.users(resp);
                $('#freet-table-list-group').html(html);
                // Make the Users tab active and others inactive
                $('#users-tab').addClass('active');
                $('#all-freets-tab').removeClass('active');
                $('#following-freets-tab').removeClass('active');
            }
        });
    });

    // When a "Follow" button is clicked in the Users page, post the
    // new follow
    $('#content').on('click', '.follow-btn', function(e) {
        var followBtn = $(this);
        var followingId = $(this).parent().attr('val');
        $.post('/follow', {
            followingId: followingId
        }, function(resp) {
            if (resp.success) {
                // Disable the Follow button since user is now following
                followBtn.prop('disabled', true);
            }
        });
    });

    // On "Publish Freet!" button click, POST to /freets to create new 
    // freet and display the new freet
    $('#content').on("click", "#freet-button", function() {
        $.post("/freets", {
            "isRefreet": false,
            "message": $("#new-freet").val()
        }, function(resp) {
            if (resp.success) {
                // Display new freet at top of freet table option to remove
                var freetInfo = resp.freet;
                freetInfo.user = resp.user;
                var html = Handlebars.templates.freet(freetInfo);
                $('#freet-table-list-group').prepend(html);
                // Reset textarea
                $("#new-freet").val('');
            }
        });
    });

    // When the Remove link for a freet is clicked, make the call to
    // delete that freet and remove it from the window
    $("#content").on('click', '.remove-link', function(e) {
        e.preventDefault();
        var freetLi = $(this).parent();
        var freetId = freetLi.attr('val');
        $.ajax({
            url: '/freet/' + freetId,
            type: 'DELETE',
            success: function(resp) {
                freetLi.remove();
            }
        });
    });

    // When the Retweet link for a freet is clicked, create the refreet
    // and display the new refreet
    $("#content").on('click', '.refreet-link', function(e) {
        e.preventDefault();
        var freetLi = $(this).parent();
        var freetId = freetLi.attr('val');
        $.post("/freets", {
            "isRefreet": true,
            "freetId": freetId
        }, function(resp) {
            if (resp.success) {
                var freetInfo = resp.freet;
                freetInfo.user = resp.user;
                // Display new refreet at top of freet table with option to remove
                var html = Handlebars.templates.freet(freetInfo);
                $('#freet-table-list-group').prepend(html);
            }
        });
    });
});
