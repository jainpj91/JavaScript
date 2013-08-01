function getVideoPlayer(videoID) {
    var divRecent = $('div#divRecent' + videoID);
    var divImg = $('div#divImg' + videoID);
    $.ajax({
        type: "POST",
        url: "Home.aspx/GetVideoPlayer ",
        data: '{videoID: "' + videoID + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() {
            divImg[0].innerHTML = "<img src='./Images/loader.gif' />";

        },
        success: function(msg) {
            divRecent[0].innerHTML = msg.d;

        }
    });
}

function showCommentdiv(videoID, videoOwnerID, videoProjectID, videoClientId) {
    var divComment = $('div#divComment' + videoID);
    divComment.fadeToggle('slow');

    // if this span is empty then get email ids
    if ($('#spanEmailSendTo' + videoID).text() == '') {
        GetEmailIds(videoID, videoOwnerID, videoProjectID, videoClientId)
    }
   
}

function insertComment(videoID, projectID) {
    if (validateComment(videoID)) {
        var textarea = $('textarea#textarea' + videoID);
        var textValue = $.trim(textarea.val());
        var divComment = $('div#divComment' + videoID);
        textValue = textValue.replace(/'/gi, '&#39');
        $.ajax({
            type: "POST",
            url: "Home.aspx/InsertComments ",
            data: "{note: '" + textValue + "', videoID: " + videoID + ", projectID:" + projectID + "}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function() {


            },
            success: function(msg) {               
                $(msg.d).insertAfter('#divComment' + videoID);
                textarea[0].value = "";
                divComment.fadeOut(1);

            }
        });
    }
}



function validateComment(videoID) {    
    var commentText = $('textarea#textarea' + videoID);
    var spanText = $('span#commentSpan' + videoID);
    var textValue = $.trim(commentText.val());   
    if (textValue == '') {
        spanText.html('Note is required');
        return false;
    }
    else if (!validateString(textValue)) {
        spanText.html('Invalid characters (<, > and &#)');
        return false;
    }
    else if (textValue.length > 4000) {
        spanText.html('Invalid note length.Please limit to 4000 characters');
        return false;
    }
    else {        
        spanText.html('');
        return true;
    }
}
   

function validateString(inputText) {
        if (inputText.match(/[<>]/)) {
            return false;
        }
        if (inputText.match(/(&#)/)) {
            return false;
        }
        return true;
    }

    function limiter(videoID) { 
        var commentText = $('textarea#textarea' + videoID);
        var textValue = $.trim(commentText.val());
        var i = textValue.split("\n");
        if (i.length >= 2) {
            commentText[0].rows = i.length + 1;
        }
    }

    jQuery.fn.fadeToggle = function(speed, easing, callback) {
        return this.animate({ opacity: 'toggle' }, speed, easing, callback);
    };

    /* to get email ids to show beside note panel*/
    function GetEmailIds(videoId, videoOwnerId, projectId, clientId) {
        $.ajax({
            type: "POST",
            url: "Home.aspx/GetEmailIds ",
            data: "{videoId: '" + videoId + "', twoMVOwnerId: " + videoOwnerId + ", projectId:" + projectId + ", clientId:" + clientId + "}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
                $('#spanEmailSendTo' + videoId).css('display', 'inline');

                // split emailIds into array
                var emailIds = (msg.d).split(", ");
                var emailIdsWithoutDomain = new Array();

                // remove domain name from emailIds
                if (emailIds.length > 0) {
                    for (var emailCount = 0; emailCount < emailIds.length; emailCount++) {
                        emailIdsWithoutDomain[emailCount] = emailIds[emailCount].substring(0, emailIds[emailCount].indexOf('@') + 1) + '..';
                    }
                }

                // set emailIds without domain name
                $('#spanEmailSendTo' + videoId).text(emailIdsWithoutDomain.join(", "));

                // set tooltip with emailIds
                $('#spanEmailSendTo' + videoId).attr('title', 'adding note fires email to ' + msg.d);
            }
        });
    }