"use strict";

(function(){

	var _self = null;
  var _scope = null;

	function PlanningCalendarController(PlanningCalendarManager, $scope) {
		PlanningCalendarManager.call(this, $scope);
		angular.extend(PlanningCalendarController.prototype, PlanningCalendarManager.prototype);

    _self = this;
    _scope = $scope;
		this.reloadCalendar();
	}

	angular.module('resa_app').controller('PlanningCalendarController', PlanningCalendarController);
}());
