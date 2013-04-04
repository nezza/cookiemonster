var cookiemonster_directives = angular.module('cookiemonsterDirectives', []);
cookiemonster_directives.directive('tooltip', function() {
	return {
		// This is an attribute.. <p tooltip="blaw">
		restrict: 'A',
		// We're not replacing the element
		replace: false,
		link: function(scope, element, attrs) {
			element.tooltip({
				title: attrs.tooltip
			});
		}
	}
});

cookiemonster_directives.directive('labeledInput', function() {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			title:'@title',
			value: '@value',
		},
		template: '<div class="input-prepend input-xxlarge">\
			<span class="add-on">{{title}}</span>\
			<input class="input-xxlarge" type="text" value="{{value}}">\
		</div>'
	}
})

cookiemonster_directives.directive('snapshot', function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<div class="btn-group">\
			<a href="#" class="btn btn-small btn-danger" ng-click="delete_snapshot(snapshot.name)"><i class="icon-trash icon-white"></i> delete</a>\
			<a href="#" class="btn btn-small" ng-click="get_snapshot(snapshot.name);">{{snapshot.name}}</a>\
			<a href="#" class="btn btn-small" ng-click="goto_snapshot(snapshot.name);">Go to snapshot URL</a>\
		</div>'
	}
})