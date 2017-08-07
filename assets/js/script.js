$(function(){
    mvApp = {
        state: {
            'apiKey': '<<API_KEY>>',
            'totalPage': 0,
            'type': 'popular',
            'imageUrl': 'http://image.tmdb.org/t/p/w185/',
            'currentPage': 1
        },
        
        init: function() {
            mvApp.getMovieList();
            mvApp.initEvents();
        },
        
        initEvents: function() {
            $(document).scroll(function() {
                console.log(mvApp.state);
                if (($(window).scrollTop() + $(window).height() > parseInt($('.list-footer').offset().top)) && (mvApp.state.currentPage < mvApp.state.totalPage)) {
                    mvApp.state.currentPage += 1;
                    mvApp.getMovieList();
                }
            });

            $('.movie-poster-wrapper').on( "click", '.poster', function(ev) {                
               mvApp.getMovieDetail($(this).data('posterid')); 
            });
            
            $('#movie-desc .page-title').click(function(){
                window.history.back();
            });            
        },
        
        getMovieDetail: function(movieId) {            
            $( ".movie-detail-wrapper").empty();
            $.mobile.loading('show');
            var apiUrl = 'https://api.themoviedb.org/3/movie/'+movieId+'?api_key='+mvApp.state.apiKey+'&language=en-US';
            $.getJSON(apiUrl, function(movieDetail) {     
                var movieHtml = mvApp.buildMovieDescTemplate(movieDetail)
                if (movieHtml) {
                    $( ".movie-detail-wrapper").append(movieHtml);
                    $.mobile.loading('hide');
                    $.mobile.navigate( "#movie-desc", { transition : "slide"});
                } else {
                    alert('Ooops!!! something went wrong');
                }
            }).fail(function(e) {
                console.log(e); // requires creative for this case.
            });            
        },
        
        getMovieList: function() {
            $.mobile.loading('show');
            var apiUrl = 'https://api.themoviedb.org/3/movie/'+mvApp.state.type+'?api_key='+mvApp.state.apiKey+'&language=en-US&page='+mvApp.state.currentPage;
            $.getJSON(apiUrl, function(data) {                
                $.each( data, function(key,val) {
                    if (key == 'total_pages') {
                        mvApp.state.totalPage = val;
                    }
                    if (key == 'results') {
                        mvApp.loadPostersToUi(val);
                    }                    
                });
            }).fail(function(e) {
                console.log(e); // requires creative for this case.
            });
            $.mobile.loading('hide');
        },
        
        loadPostersToUi: function(obj) {
            var posters = '';
            $.each(obj, function( key, val ) {
                posters += '<img class="poster" data-posterid="' + val.id + '" src="'+mvApp.buildPosterUrl(val.poster_path)+'" />';
            });
            $( ".movie-poster-wrapper").append(posters);
        },
        
        buildMovieDescTemplate(movie) {
            if ($.isEmptyObject(movie)) {
                return false;
            }
            
            var releaseDate = new Date(movie.release_date);
            
            var html = '<div class="movie-title">'+ movie.original_title+'</div>';
            html += ''+
                '<div class="movie-snapshot">' +
                    '<div class="movie-poster">' +
                        '<img class="movie-thumbnail" src="'+mvApp.buildPosterUrl(movie.poster_path)+'" />' +
                    '</div>' +
                    '<div class="movie-info">' +
                        '<div class="movie-release-year">'+releaseDate.getFullYear()+'</div>'+
                        '<div class="movie-length">'+movie.runtime+' min</div>'+
                        '<div class="movie-ratings">'+ movie.vote_average +'/10</div>'+
                        '<div class="mark-favorite">Mark as favorite</div>'+
                    '</div>' +
                    '<div class="movie-overview">'+movie.overview+'</div>'
                '</div>'                
            ;
            
            return html;            
        },
        
        buildPosterUrl(posterPath) {
            return mvApp.state.imageUrl+posterPath;
        }
        
    }

    mvApp.init();    
});