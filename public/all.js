'use strict';

(function ($) {
  const fileTypes = ['image/png', 'image/gif', 'image/jpeg', 'video/mp4', 'video/quicktime'];

  function init() {
    $('#fileselect')[0].addEventListener('change', FileSelectHandler, false);
  }

  function FileSelectHandler(e) {
    var files = e.target.files || e.dataTransfer.files;
    for (var file of files) {
      if ($.inArray(file.type, fileTypes) !== -1) {
        let reader = new FileReader();
        reader.onload = e => {
          // uploadProcess(file, e.target.result)
        };
        reader.readAsDataURL(file);
        console.log('Filename: ' + file.name);
      } else {
        alert('FileType error:' + file.type);
      }
    }
  }

  function uploadProcess(file, data) {
    let fd = new FormData();
    fd.append('uploadFile', file);
    fd.append('date', new Date().toString());

    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener('progress', uploadProgress, false);

    xhr.addEventListener('load', evt => {
      // uploadComplete(evt,file,data)
    }, false);

    // xhr.addEventListener('error', uploadFailed, false);
    // xhr.addEventListener('abort', uploadCanceled, false);

    xhr.open('POST', '/uploadFile');
    xhr.send(fd);
  }

  if (window.File && window.FileList && window.FileReader) {
    init();
  } else {
    alert('Error: Your browser is not supported');
  }
})(jQuery);