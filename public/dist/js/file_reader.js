function verify_docx(fileElement) {

    var files = fileElement.files || [];

    if (!files.length) {
        console.log('no file found');
        return;
    }

    var file = files[0];


    let reader = new FileReader();
    reader.onloadend = function(event) {

        let arrayBuffer = reader.result;

        mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then(function(resultObject) {
            resultedFilter = resultObject.value.replace('  ', '')
            arrayText = resultedFilter.split("\n")
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
        title: ""

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

        if (flag && myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "remarks") {
            output.outcome = myText;
            myText = '';
            flag = false;
        }

        if (flag && myVal.replace(/ +/g, '').replace(":", "").toLowerCase() == "projectcategory(chooseone)") {
            output.title = myText
            myText = '';
            flag = false;
        }

        if (flag) myText += myVal;

        if (myVal.replace(/ +/g, '').toLowerCase() === "summaryofproposedproject(maximum300words)") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "projectobjective(s)") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "expectedresult(s)/outcome(s)") flag = true;

        if (myVal.replace(/ +/g, '').replace(":", "").toLowerCase() === "titleofproposedproject") flag = true;

    });

    return output;
    // console.log(getSimilarityScore(textCosineSimilarity(output.objectives,output.objectives)));
}



function perform_verify(resultDocx) {
    if (resultDocx.introduction == "" || resultDocx.outcome == "" || resultDocx.objectives == "" ||
        resultDocx.project_methodology == "") {
        $('#errorModal').modal('show');
        return;
    }
    let csrf = $("#csrf").val()
    $.ajax({
        url: "/project/verify",
        method: 'POST',
        data: { docx: resultDocx, _csrf: csrf },
        success: function(result) {
            if (!result.success) {
                fire_alert()
                return;
            }

            if (!result.verify) {
                $('#verify_failedModal').modal('show');
                return;
            }

            $('.after-verfiy').removeClass('d-none');

            // var before_docx = $("#before_docx"),
            //     report = before_docx.clone();
            // report.attr("class", "invisible");
            // report.insertAfter(".hidden_fields");

            $('.verify-doc').addClass('my-invisible');
            //$('.verify-doc').remove();
            $('#verifiedModal').modal('show');

            // Setting up fields
            $("#docx_introduction").val(resultDocx.introduction)
            $("#docx_objectives").val(resultDocx.objectives)
            $("#docx_outcome").val(resultDocx.outcome)
            $("#docx_title").val(resultDocx.title)
            $("#proj_title").val(resultDocx.title)

        },
        error: function(result) {
            fire_alert()
            return;
        },
    });
}

function fire_alert(icon = 'error', title = 'Oops..', text = 'We are having some issue right now. <br> Please try after some time.') {

    Swal.fire({
        icon: icon,
        title: title,
        html: text,
    })
}