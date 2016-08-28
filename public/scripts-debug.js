"use strict";

(function ($) {
    var fileTypes = ["image/png", "image/gif", "image/jpeg", "video/mp4", "video/quicktime"];

    function init() {
        var fileselect = $id("fileselect");
        fileselect.addEventListener("change", FileSelectHandler, false);
    }
    function $id(id) {
        return document.getElementById(id);
    }

    function FileSelectHandler(e) {
        var files = e.target.files || e.dataTransfer.files;
        for (var i = 0, f; f = files[i]; i++) {
            ParseFile(i, f);
        }
    }
    function ParseFile(i, file) {
        if ($.inArray(file.type, fileTypes) !== -1) {
            var reader = new FileReader();
            reader.onload = function (e) {
                uploadProcess(file, e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert(file.type);
        }
    }
    function uploadProcess(file, data) {
        var fd = new FormData();
        fd.append('uploadFile', file);
        fd.append('date', new Date().toString()); // req.body.date
        fd.append('comment', 'test me');

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', uploadProgress, false);

        xhr.addEventListener('load', function (evt) {
            uploadComplete(evt, file, data);
        }, false);

        //xhr.addEventListener('error', uploadFailed, false);
        //xhr.addEventListener('abort', uploadCanceled, false);

        xhr.open('POST', '/uploadFile');
        xhr.send(fd);
    }
    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            //console.log(percentComplete.toString() + '%');
        } else {
                //console.log('unable to compute');
            }
    }
    function uploadComplete(evt, file, data) {
        uploadProgress(evt);
        var res = JSON.parse(evt.target.responseText).res;

        if (typeof res[0] !== "undefined") {
            $("#file-list-upload").append(displayPreviewFile(data, file.type, res[0].filename));
        } else {
            alert("Something went wrong on file upload of " + file.name);
        }
    }

    function displayPreviewFile(data, type, fcode) {
        var html = '';
        var icon = 'picture';
        var media = '';

        if (type.indexOf("image") === 0) {
            media = '<img data-fcode="' + fcode + '" data-type="image" class="item-src" src="' + data + '"/>';
        }
        if (type.indexOf("video") === 0) {
            icon = 'play';
            media = '<video data-fcode="' + fcode + '" data-type="video" autoplay muted class="item-src" ><source src="' + data + '" type="video/mp4"></video>';
        }

        html += '<div class="panel panel-default">';
        html += '<div class="panel-body item-pbody">';
        html += '<div class="custom-desc">';
        html += '<div class="input-group">';
        html += '<span class="input-group-addon"><span class="glyphicon glyphicon-' + icon + '" aria-hidden="true"></span></span>';
        html += '<input type="text" class="form-control message_text" placeholder="Custom text">';
        html += '</div>';
        html += '</div>';
        html += '<div class="media-wrap">';
        html += media;
        html += '</div>';
        html += '</div>';
        html += '</div>';

        return html;
    }
    $("#upload-btn").click(function (e) {
        if ($(".message_text").length) {
            //$.post('/post',{param:'hey'});
            processPost();
        } else {
            alert("You need to upload media!");
        }
    });
    function processPost() {
        var items = [];
        var hastag = $("#hashtag").val();
        var preftext = $("#preftext").val();
        $("#file-list-upload .item-pbody").each(function (i, item) {

            //console.log(i);
            //console.log(item);
            var c_msg = $(item).find('.message_text');
            var media = $(item).find('.item-src');

            var msg = c_msg.val();
            var m_fcode = media.data('fcode');
            var m_type = media.data('type');

            items[i] = {
                msg: msg,
                fcode: m_fcode,
                type: m_type
            };
        });

        if (items.length) {
            var params = {
                items: items,
                hashtag: hastag,
                preftext: preftext,
                token: Math.random(0, 10000) + '-' + Math.random(0, 1888)
            };

            var post = $.post('/post', { params: params });
            post.done(function (obj) {
                if (obj.status) {
                    window.location.reload();
                }
                console.log(obj);
            });
        }
    }
    if (window.File && window.FileList && window.FileReader) {
        init();
    }

    $('#refresh-oht').click(function () {
        refresh_oht();
    });

    function refresh_oht() {
        $('#hashtag').prop('disabled', true);
        var oht = $.get('/oht');
        oht.done(function (obj) {
            if (obj.status) {
                $('#hashtag').val($.trim(obj.oht));
                $('#hashtag').prop('disabled', false);
            }
        });
    }
    $(window).on("load", function () {
        refresh_oht();
    });
})(jQuery);