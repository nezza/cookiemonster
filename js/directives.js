var cookiemonster_directives = angular.module('cookiemonsterDirectives', []);
cookiemonster_directives.directive('tooltip', function() {
	return {
		// This is an attribute.. <p tooltip="blaw">
		restrict: 'A',
		// We're not replacing the element
		replace: false,
		link: function(scope, element, attrs) {
			console.log("LINKING TOOLTIP");
			element.tooltip({
				title: attrs.tooltip
			});
		}
	}
});


