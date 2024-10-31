"use strict";

(function(){
	var _self = null;
	var _scope = null;
  var _ajaxUrl = null;

	function PlanningCalendarManagerFactory($filter, FunctionsManager, CalendarManager){

		var PlanningCalendarManager = function(scope){
  		FunctionsManager.call(this);
  		angular.extend(PlanningCalendarManager.prototype, FunctionsManager.prototype);
      CalendarManager.call(this, this);
			angular.extend(PlanningCalendarManager.prototype, CalendarManager.prototype);

      _scope = scope;
      _scope.backendCtrl.planningCtrl = this;
			this.viewDate = _scope.backendCtrl.viewDate;
		}

		PlanningCalendarManager.prototype.changeCalendarView = function(){

		}

		PlanningCalendarManager.prototype.dateAlreadyLoaded = function(date){
			return _scope.backendCtrl.dateAlreadyLoaded(date);
		}


		PlanningCalendarManager.prototype.dateClicked = function(date){
			this.viewDate = new Date(date);
			this.calendarView = 'day';
			this.reloadCalendar();
		}

		PlanningCalendarManager.prototype.getGroupName = function(group){
			if(group == null) return '';
			var name = $filter('htmlSpecialDecode')(group.name);
			/*if(group.oneByBooking){
				name += '(#'+group.id+')';
			}*/
			return name;
		}


    PlanningCalendarManager.prototype.reloadCalendar = function(){
      this.events = [];
      var rapportsByServices = _scope.backendCtrl.filteredRapportsByServicesPlanning;
			for(var i = 0; i < rapportsByServices.length; i++) {
				var rapportByServices = rapportsByServices[i];
				for(var indexGroup = 0; indexGroup < rapportByServices.groups.length; indexGroup++){
					var group = rapportByServices.groups[indexGroup];
	        var service = rapportByServices.service;
					var startDate = rapportByServices.startDate;
					var endDate = rapportByServices.endDate;
					if(startDate.getTime() == endDate.getTime()){
						endDate.setMinutes(endDate.getMinutes() + 30);
					}

	        var color = '#ffff00';
	        if(service != null){
	          color = group.color;
	        }
	        var serviceName = 'Unknown service';
	        if(service){
	          serviceName = this.getTextByLocale(service.name, this.locale);
	          if(rapportByServices.idPlace != null){
	            var place = _scope.backendCtrl.getPlaceById(rapportByServices.idPlace);
	            if(place != null){
	              serviceName = '['+ this.getTextByLocale(place.name, this.locale)+'] '+serviceName;
	            }
	          }
	        }
	        var diffHours = endDate.getHours() - startDate.getHours();
	        diffHours = Math.min(4, diffHours);
	        diffHours = Math.max(1, diffHours);

	        var presentation = '<div id="appointment'+rapportByServices.id+'_'+group.id+'_'+this.calendarView+'" class="creneau t'+diffHours+'"> <div class="creneau_content">';
	        if(!rapportByServices.noEnd){
	          presentation += ''+$filter('formatDateTime')(startDate, _scope.backendCtrl.timeformat)+'';
	        }
	        //presentation += '<div class="creneau_service">'+serviceName+'</div>';
					presentation += ' - '+this.getGroupName(group)+'';
	        var displayMembersSentence = '';
	        for(var j = 0; j < group.idMembers.length; j++){
	          var member = _scope.backendCtrl.getMemberById(group.idMembers[j]);
	          displayMembersSentence += member.nickname;
	        }
	        if(displayMembersSentence != ''){
	          presentation += ' - ' + displayMembersSentence + '';
	        }
					/*
	        if(rapportByServices.groups.length == 0) presentation += '<div class="creneau_members">Aucun groupe</div>';
	        if(rapportByServices.groups.length > 0) presentation += '<div class="creneau_members">'+rapportByServices.groups.length+' groups</div>';
					*/
					var nbParticipants = _scope.backendCtrl.getNumberParticipantsInGroup(_scope.backendCtrl.getRapportByServicesByGroup(group), group);
					var bgColor = '';
					if(nbParticipants > group.max) bgColor = 'bg_rouge';
					else if(nbParticipants == 0) bgColor = 'bg_gris';
					else if(nbParticipants <= group.max) bgColor = 'bg_vert';
					presentation += '<div class="creneau_members"><span class="'+bgColor+'">'+nbParticipants+'/'+group.max+'</span> personnes</div>';
					presentation += '</div></div>';
	        group.description = presentation;

					this.events.unshift(this.createNewEvent(
							presentation,
							serviceName,
							startDate,
							endDate,
							color,
							false,
							[],
							false)
	        );
				}
			}
		}

    PlanningCalendarManager.prototype.getGroupByDescription = function(rapportsByServices, description){
			for(var i = 0; i < rapportsByServices.length; i++){
				var rapportByServices = rapportsByServices[i];
				for(var j = 0; j < rapportByServices.groups.length; j++){
					var group = rapportByServices.groups[j];
					if(group.description == description){
						return {rapportByServices:rapportByServices, group:group};
					}
				}
			}
			return null;
		}

    PlanningCalendarManager.prototype.displayEvent = function(event){
      var result = this.getGroupByDescription(_scope.backendCtrl.filteredRapportsByServicesPlanning, event.title);
      if(result!= null){
        _scope.backendCtrl.openGroupManagerDialog(result.rapportByServices, result.group);
      }
    }


		return PlanningCalendarManager;
	}

	angular.module('resa_app').factory('PlanningCalendarManager', PlanningCalendarManagerFactory);
}());
