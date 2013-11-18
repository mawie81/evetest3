angular.module('evetest3App')
 .directive('multiAvatar', [function () {
   return {
     restrict: 'E',
     link:function(scope, element, attrs) {

       var facebookId = attrs.facebookId;
       var githubUsername = attrs.githubUsername;
       var email = attrs.email;

       var tag = '';
       if ((facebookId !== null) && (facebookId !== undefined) && (facebookId !== '')) {
         tag = '<h6>Use Facebook</h6>' ;
       } else if ((githubUsername !== null) && (githubUsername !== undefined) && (githubUsername !== '')){
         tag = '<h6>Use github</h6>' ;
       } else {
         tag = '<h6>Use gravatar</h6>'; 
       }

       element.append(tag);
     }
   };
 }]);