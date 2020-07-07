/*
 * AngularJS extended select component.
 * Copyright (c) 2016-2019 Rodziu <mateusz.rohde@gmail.com>
 * License: MIT
 */

angular.module('exampleApp', ['extendedSelect'])
	.controller('exampleCtrl', ['$rootScope', '$scope', '$http', '$q', function($rootScope, $scope, $http, $q){
		const ctrl = this;
		ctrl.options = [];
		ctrl.shortOptions = [];
		$http.get('mock_data.json').then(function(response){
			ctrl.options = response.data;
			ctrl.shortOptions = response.data.slice(0, 100);
		});

		ctrl.resolvedOptions = [];
		ctrl.resolveOnSearch = function(search, page){
      search = search.toLowerCase();
			const defered = $q.defer(),
				results = [];
			let hasNextPage = false;
			for(let i = 0; i < ctrl.options.length; i++){
				if(!!~ctrl.options[i].word.indexOf(search)){
          if(results.length === (page * 10)){
            hasNextPage = true;
            break;
          }
					results.push(ctrl.options[i]);
				}
			}
			results.forEach((option) => {
			  if (!~ctrl.resolvedOptions.indexOf(option)) {
			    ctrl.resolvedOptions.push(option);
        }
      });
			defered.resolve({hasNextPage});
			return defered.promise;
		};

		ctrl.emptyOptions = [];
		ctrl.addOptionCallback = function(newOption){
			ctrl.emptyOptions.push({
				id: -1,
				word: newOption
			});
		};

		ctrl.word = ctrl.word2 = ctrl.word3 = ctrl.word4 = ctrl.word5 =
			ctrl.word6 = ctrl.word7 = ctrl.word8 = ctrl.word9 = undefined;

		ctrl.multiple = [];

		$rootScope.nav = [];
	}])
	/**
	 * @ngdoc component
	 * @name codeExample
	 */
	.component('codeExample', {
		transclude: true,
		bindings: {
			html: '<'
		},
		controllerAs: 'ctrl',
		template: '<p>Code:</p><code ng-repeat="h in ctrl.html">{{h}}</code>',
		controller: [function(){
			const ctrl = this;
			ctrl.$onInit = function(){
				ctrl.html = ctrl.html.split("\n");
			};
		}]
	})
	/**
	 * @ngdoc directive
	 * @name codeExampleHook
	 */
	.directive('codeExampleHook', ['$compile', function($compile){
		return {
			restrict: 'A',
			priority: 999999999999,
			compile: function(element){
				const html = element.clone().removeAttr('code-example-hook')[0].outerHTML;
				return function(scope){
					const newScope = scope.$new(),
						newElement = angular.element('<code-example html="html"></code-example>');
					newScope.html = html;
					element.after(newElement);
					$compile(newElement)(newScope);
				}
			}
		};
	}])
	.directive('pageHeader', [function(){
		return {
			restrict: 'C',
			controller: ['$rootScope', '$element', '$attrs', function($rootScope, $element, $attrs){
				if(angular.isUndefined($attrs.id)){
					return;
				}
				$rootScope.nav.push({
					id: $attrs.id,
					title: $element.text().trim(),
					subs: []
				});
			}]
		}
	}])
	.directive('cardHeader', [function(){
		return {
			restrict: 'C',
			controller: ['$rootScope', '$element', '$attrs', function($rootScope, $element, $attrs){
				if(angular.isUndefined($attrs.id)){
					return;
				}
				$rootScope.nav[$rootScope.nav.length - 1].subs.push({
					id: $attrs.id,
					title: $element.text().trim()
				});
			}]
		}
	}]);
