(function () {
    'use strict';

    function config($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to home
        $urlRouterProvider.otherwise("/");

        // States
        $stateProvider
            .state('home', {
                url: '/',
                controller: function() {
                    console.log('Hello world');
                },
                controllerAs: 'vm',
                template: '<h1>Hello world</h1>',
                data: {
                    pageTitle: 'Inventive'
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
        .config(['$stateProvider', '$urlRouterProvider', config])
        .controller('AppController', ['$scope', AppController]);

}());
