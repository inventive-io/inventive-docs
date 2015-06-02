(function () {
    'use strict';

    function config($stateProvider) {
        // States
        $stateProvider
            .state('home', {
                url: '/',
                views: {
                    'content@': {
                        template: '<h1>Hello world</h1>'
                    }
                },
                data: {
                    pageTitle: 'Inventive Docs'
                }
            });
    }

    function AppController($scope) {
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.pageTitle = toState.data.pageTitle;
        });
    }

    angular
        .module('app', [
            // Dependencies
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ui.router',

            // Modules
            'app.core',
            'app.components'
        ])
        .config(['$stateProvider', config])
        .controller('AppController', ['$scope', AppController]);

}());
