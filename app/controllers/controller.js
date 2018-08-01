(function () {
  'use strict';
  app.controller('TarefasCtrl', ['$rootScope', '$scope', '$location', '$filter', '$http', function ($rootScope, $scope, $location, $filter, $http)
		{
			$rootScope.activetab = $location.path();
			var self = $scope;

			self.modelAux = {descricao: null, titulo: null};

            self.modelTarefas = 
                {
                    label: "Tarefas",
                    allowedTypes: ['tarefa'],
                    tarefas: []
                };
        
            // Model to JSON for demo purpose
            self.$watch('modelTarefas', function(modelTarefas) {
                self.modelAsJson = angular.toJson(modelTarefas, true);
            }, true);

			self.tools = {
				setTime: function() {
					return moment().format('L') + ' ' + moment().format('LTS');
				},
                clearTarefa: function () {
                    self.msg = null;
					self.modelAux ={descricao: null, titulo: null};
					$('#collapseTarefa').collapse('hide');
                },
                addTarefa: function () {
                    if(!self.tools.verificaTarefa()) return;
                    
                    if(self.modelAux.index >= 0) {
                        var index = self.modelAux.index;
                        delete self.modelAux.index;
                        self.modelTarefas.tarefas[index] = angular.copy(self.modelAux);
                    } else {
                        self.modelTarefas.tarefas.push(angular.copy(self.modelAux));
                        self.tools.save(self.modelAux);
                    }
                },
                editTarefa: function (index) {
                    if(!self.tools.verificaTarefa()) return;
                    
                    self.modelAux = angular.copy(self.modelTarefas.tarefas[index]); ;
                    self.modelAux.index = index;
                    $('#collapseTarefa').collapse('show');
                },
                verificaTarefa: function() {
                    self.msg = "";
                    if(self.modelAux.titulo == null || self.modelAux.titulo == '' || self.modelAux.titulo == undefined) {
                        self.msg = "Campo título é obrigatório.";
                        return false;
                    }
                    if(self.modelAux.descricao == null || self.modelAux.descricao == '' || self.modelAux.descricao == undefined) {
                        self.msg = "Campo descrição é obrigatório.";                        
                        return false;
                    }
                    return true;
                },
				recuperaRegistros: function() {
                    $http.get('http://localhost:9001/api/v1/task')
                    .then(function successCallback(response) {
                        console.log(response);
                        self.modelTarefas.tarefas = response.data;
					    self.tools.clearTarefa();
                        return;                      
                    }, function errorCallback(response) {
                        console.log(response);
                        return;
                    });
                },
                save: function(data){
                    $http.post('http://localhost:9001/api/v1/task', data)
                    .then(function successCallback(response) {                        
                        console.log(response);
                        self.modelTarefas.tarefas = response.data;
                        return;                      
                    }, function errorCallback(response) {
                        console.log(response);
                        return;
                    });
                }
            };
            
            // Model to JSON for demo purpose
            $scope.$watch('lists', function(lists) {
                $scope.modelAsJson = angular.toJson(lists, true);
            }, true);

			self.tools.recuperaRegistros();
		}]);
})();