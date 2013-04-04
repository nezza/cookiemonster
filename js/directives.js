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
