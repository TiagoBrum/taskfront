var app = angular.module('app',['ngRoute', 'dndLists']);

(function () {
  'use strict';
      app.config(function($routeProvider, $locationProvider)
      {
         $locationProvider.html5Mode({
           enabled: true,
           requireBase: true
         });
         moment.locale('pt-br');

         $routeProvider

         .when('/', {
            templateUrl : 'app/views/gerenciarTarefas.html',
            controller     : 'TarefasCtrl',
         })

         // caso não seja nenhum desses, redirecione para a rota '/'
         .otherwise ({ redirectTo: '/' });
      });
})();

(function () {
  'use strict';
    app.directive('timeNow', function($interval) {
      return {
        restrict: 'AE',
        link: function(scope, element, attrs){
          var timer = $interval(function(){
            atualizaTempo();
          },1000);

          function atualizaTempo(){
            element.text(moment().format('dddd') + ', ' + moment().format('LL') + ', ' + moment().format('LTS'));
          }
        }
      }  
    });
})();