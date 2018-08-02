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
        
			self.tools = {
				setTime: function() {
					return moment().format('L') + ' ' + moment().format('LTS');
				},
                clearTarefa: function () {
                    self.msg = null;
					self.modelAux ={descricao: null, titulo: null};
					$('#collapseTarefa').collapse('hide');
                },
                saveTarefa: function () {
                    if(!self.tools.verificaTarefa()) return;
                    
                    if(self.modelAux.id >= 0) {
                        var index = self.modelAux.index;
                        delete self.modelAux.index;
                        self.tools.update(self.modelAux);
                    } else {
                        self.tools.save(self.modelAux);
                    }
                },
                editTarefa: function (id) {                    
                    self.tools.getTarefa(id);
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
                alterarStatus: function(id, status) {
                    var newStatus = status == 2 ? 1 : 2;
                    var data = {id: id, status: newStatus};
                    self.tools.update(data);
                },
                getTarefa: function(id){
                    $http.get('http://localhost:9001/api/v1/task/'+id)
                    .then(function successCallback(response) {
                        self.modelAux = response.data;
                        return;                      
                    }, function errorCallback(response) {
                        return;
                    });
                },
				recuperaRegistros: function() {
                    $http.get('http://localhost:9001/api/v1/task')
                    .then(function successCallback(response) {
                        self.modelTarefas.tarefas = response.data;
					    self.tools.clearTarefa();
                        return;                      
                    }, function errorCallback(response) {
                        return;
                    });
                },
                save: function(data){
                    $http.post('http://localhost:9001/api/v1/task', data)
                    .then(function successCallback(response) {                        
                        self.tools.recuperaRegistros();
                        return;                      
                    }, function errorCallback(response) {
                        return;
                    });
                },
                update: function(data){
                    $http.put('http://localhost:9001/api/v1/task/'+data.id, data)
                    .then(function successCallback(response) {                        
                        self.tools.recuperaRegistros();
					    self.tools.clearTarefa();
                        return;                      
                    }, function errorCallback(response) {
                        return;
                    });
                },
                delete: function(id){
                    $http.delete('http://localhost:9001/api/v1/task/'+id)
                    .then(function successCallback(response) {
                        self.tools.recuperaRegistros();                        
                        return;                      
                    }, function errorCallback(response) {
                        return;
                    });
                },
            };

            self.formatDate = function(data) {
                var dateTime = moment( data, "YYYY-MM-DD HH:mm:ss",true);;
                return dateTime.isValid() ? dateTime.format('DD/MM/YYYY HH:mm:ss') : '--';
            };
            
            // Model to JSON for demo purpose
            $scope.$watch('lists', function(lists) {
                $scope.modelAsJson = angular.toJson(lists, true);
            }, true);

			self.tools.recuperaRegistros();
		}]);
})();