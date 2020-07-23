    var j$ = jQuery.noConflict();
    
    j$(document).ready(function(){
    
        j$(function() {
        $('button').button();
        });
    
        j$(".div1,.div2,.div3,.div5").hide();
        
        j$('.1').click(function() {
            j$(".div2,.div3,.div4,.div5").hide();
            j$('.div1').show('fade',2000);
        });
        
        j$('.2').click(function() {
            j$(".div1,.div3,.div4,.div5").hide();
            j$('.div2').show('fade',2000);
        });
        
        j$('.3').click(function() {
            j$(".div2,.div1,.div4,.div5").hide();
            j$('.div3').show('fade',2000);
        });
        
        j$('.4').click(function() {
            j$(".div2,.div3,.div1,.div5").hide();
            j$('.div4').show('fade',2000);
        });
		
		j$('.5').click(function() {
            j$(".div2,.div3,.div1,.div4").hide();
            j$('.div5').show('fade',2000);
        });
        
        j$('#filterType').hover(function() {
			j$('#filterTypeImg').fadeIn();
			}, function() {
			j$('#filterTypeImg').fadeOut();
        });
		
		j$('#matchInsert').hover(function() {
			j$('#matchOnInsertImg').fadeIn();
			}, function() {
			j$('#matchOnInsertImg').fadeOut();
        });
		
		j$('#matchUpdate').hover(function() {
			j$('#matchOnUpdateImg').fadeIn();
			}, function() {
			j$('#matchOnUpdateImg').fadeOut();
        });
		
		j$('#taskAlert').hover(function() {
			j$('#taskAlertImg').fadeIn();
			}, function() {
			j$('#taskAlertImg').fadeOut();
        });
		
		j$('#matchBlanks').hover(function() {
			j$('#matchBlanksImg').fadeIn();
			}, function() {
			j$('#matchBlanksImg').fadeOut();
        });
    });