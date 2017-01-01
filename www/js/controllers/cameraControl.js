angular.module('MySocial')

  // .config(function( $mdGestureProvider ) {
  //   $mdGestureProvider.skipClickHijack();
  // })

  .controller('cameraController',function ($scope, $firebaseObject, $firebaseArray, $cordovaGeolocation) {

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCWQCBzNRtKu47UNx2O6I7JagM7snxZ4Qo",
      //authDomain: "bmon2-996ca.firebaseapp.com",
      //databaseURL: "https://bmon2-996ca.firebaseio.com",
      storageBucket: "bmon2-996ca.appspot.com",
      messagingSenderId: "312660114333"
    };
    firebase.initializeApp(config);

    var refStorage = firebase.storage().ref();

    //image's name
    var imgName = "test2.jpg";

    var refBMONimg = refStorage.child("bmon-img/"+imgName);
    var upImgData
    var fileName

$scope.btnCamera = function(){

  // This iOS/Android only example requires the dialog and the device plugin as well.

  navigator.camera.getPicture(onSuccess, onFail, { 

    quality : 75,
    destinationType : Camera.DestinationType.DATA_URL,
    sourceType : Camera.PictureSourceType.CAMERA,
    allowEdit : false,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 300,
    targetHeight: 300,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: false 

  });

}

function onSuccess(result) {
   // convert JSON string to JSON Object
   var thisResult = JSON.parse(result);

   // convert json_metadata JSON string to JSON Object 
   var metadata = JSON.parse(thisResult.json_metadata);

   upImgData = JSON.stringify(metadata);
   fileName = thisResult.filename

    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + fileName

    alert(upImgData);

    if (thisResult.json_metadata != "{}") {
        if ((device.platform) == 'iOS') {

          // notice the difference in the properties below and the format of the result when you run the app.
          // iOS and Android return the exif and gps differently and I am not converting or accounting for the Lat/Lon reference.
          // This is simply the raw data being returned.

          alert('Lat: '+metadata.GPS.Latitude+' Lon: '+metadata.GPS.Longitude);
        } else {
          alert('Lat: '+metadata.gpsLatitude+' Lon: '+metadata.gpsLongitude);
          alert('Date: '+metadata.datetime);
        }

    }
}

function onFail(message) {
    alert('Failed because: ' + message);
}

$scope.viewExif = function(){
      alert("viewExif : "+upImgData);
}



$scope.btnGallery = function(){
  console.log('btnGallery');
  alert("btnGallery");

  navigator.camera.getPicture(onSuccess, onFail, { 

      quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit : false,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 300,
      targetHeight: 300,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false 

    });

}

    $scope.btnUpload = function(){
      alert('btnUpload' + fileName);
      // Base64url formatted string
      // var metaData = {
      //   contentType: 'image/jpeg'
      // };
      refBMONimg.putString(fileName, 'base64').then(function(snapshot) {
        alert('Uploaded');
      });

    }




  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude

      alert("lat : "+lat+" long : "+long);

    }, function(err) {
      // error
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
  });


  watch.clearWatch();
  // // OR
  // $cordovaGeolocation.clearWatch(watch)
  //   .then(function(result) {
  //     // success
  //     }, function (error) {
  //     // error
  //   });




  })
