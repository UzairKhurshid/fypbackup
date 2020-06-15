function verify_docx(fileElement) {

    var files = fileElement.files || [];

    if (!files.length) {
        fire_alert('No file found')
        return;
    }

    var file = files[0];


    if (file.name.split('.').pop()!== 'docx') {
       fire_alert('Files with docx extension are supported')
        return;
    }

    let reader = new FileReader();
    reader.onloadend = function(event) {

        let arrayBuffer = reader.result;

        mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then(function(resultObject) {
            resultedFilter = resultObject.value.replace('  ', '')
            arrayText = resultedFilter.split("\n")
            //console.log(arrayText)
            perform_verify(extractMain(arrayText))
        });

    };
    reader.readAsArrayBuffer(file);
}

function extractMain(array) {

    var output = {
        introduction: "",
        objectives: "",
        outcome: "",
        title: "",
        area:"",

    };

    myText = '';
    flag = false;
    array.forEach(function(myVal, index) {

        if (myVal === '') return;

        if (flag && myVal.replace(/ +/g, '').toLowerCase() == "projectobjective(s)") {
            output.introduction = myText
            myText = '';
            flag = false;
        }

        if (flag && myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "expectedresult(s)/outcome(s)") {
            output.objectives = myText
            myText = '';
            flag = false;
        }

        if (flag && (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "remarks" || myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "forresearchgroupheadonly")) {
            output.outcome = myText;
            myText = '';
            flag = false;
        }

        if (flag && myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "projectcategory(chooseone)") {
            output.title = myText
            myText = '';
            flag = false;
        }

        if (flag && myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "summaryofproposedproject(maximum300words)") {
            output.area = myText
            myText = '';
            flag = false;
        }

        if (flag) myText += myVal;

        if (myVal.replace(/ +/g, '').toLowerCase() === "summaryofproposedproject(maximum300words)") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "projectobjective(s)") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "expectedresult(s)/outcome(s)") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "titleofproposedproject") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "area/specialization") flag = true;

    });

    //console.log(output)
    return output;
    // console.log(getSimilarityScore(textCosineSimilarity(output.objectives,output.objectives)));
}



function perform_verify(resultDocx) {
    // console.log(resultDocx)
    if (resultDocx.introduction == "" || resultDocx.outcome == "" || resultDocx.objectives == "" ||
        resultDocx.title == ""||
        resultDocx.area == "") {
        $('#errorModal').modal('show');
        return;
    }

    let csrf = $("#csrf").val()
    let verifyWait = $('.verify-wait')
    verifyWait.fadeIn();
    $.ajax({
        url: "/project/verify",
        method: 'POST',
        data: { docx: resultDocx, _csrf: csrf },
        success: function(result) {
            verifyWait.fadeOut();
            if (!result.success) {
                fire_alert()
                console.log('Server Error')
                return;
            }

            if (!result.verify) {

                $('#verify_failedModal').modal('show');
                matches(result.detects)
                return;
            }

            $('.after-verfiy').removeClass('d-none');
            $('.verify-doc').addClass('my-invisible');
            //$('.verify-doc').remove();
            $('#verifiedModal').modal('show');

            // Setting up fields
            $("#docx_introduction").val(resultDocx.introduction)
            $("#docx_objectives").val(resultDocx.objectives)
            $("#docx_outcome").val(resultDocx.outcome)
            $("#docx_title").val(resultDocx.title)
            $("#proj_title").val(resultDocx.title)
            $("#docx_area").val(resultDocx.area)
            $("#proj_description").val(resultDocx.introduction.substring(0,200)+'.........');

        },
        error: function(result) {
            verifyWait.fadeOut();
            console.log('Ajax Error')
            fire_alert()
            return;
        },
    });
}

function fire_alert( text = 'We are having some issue right now. <br> Please try after some time.',icon = 'error', title = 'Oops..') {

    Swal.fire({
        icon: icon,
        title: title,
        html: text,
    })
}