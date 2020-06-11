function verify_docx(fileElement){

    var files = fileElement.files || [];

        if (!files.length){
            console.log('no file found');
            return;
        }

        var file = files[0];


        let reader = new FileReader();
        reader.onloadend = function(event) {

            let arrayBuffer = reader.result;

            mammoth.extractRawText({arrayBuffer: arrayBuffer}).then(function (resultObject) {
                resultedFilter = resultObject.value.replace('  ','')
                arrayText = resultedFilter.split("\n")
                perform_verify(extractMain(arrayText),file)
            });

        };
    reader.readAsArrayBuffer(file);
}

function perform_verify(resultDocx,fileDocx){
    if(resultDocx.introduction == "" || resultDocx.outcome == "" || resultDocx.objectives == ""
        || resultDocx.project_methodology == "" ){
        alert('Please upload docx with proper formatting and headings.')
        return;
    }
    let csrf = $("#csrf").val()
    $.ajax({
        url: "/project/verify",
        method:'POST',
        data:{docx:resultDocx,_csrf:csrf}
        , success: function(result){
            if(!result.success){
                alert('Api Error');
                return;
            }

            if(!result.verify){

            }



            $('.after-verfiy').removeClass('d-none');

            // var before_docx = $("#before_docx"),
            //     report = before_docx.clone();
            // report.attr("class", "invisible");
            // report.insertAfter(".hidden_fields");

             $('.verify-doc').addClass('my-invisible');
            //$('.verify-doc').remove();


            // Setting up fields
            $("#docx_introduction").val(resultDocx.introduction)
            $("#docx_objectives").val(resultDocx.objectives)
            $("#docx_outcome").val(resultDocx.outcome)
            $("#docx_project_methodology").val(resultDocx.objectives)
            $("#docx_file").files = fileDocx;

        },
        error:function(result){
          alert('Ajax Error')
            return;
        },
    });
}

function extractMain(array){

    var output = {
        introduction : "",
        objectives  : "",
        outcome: "",
        project_methodology : ""

    };

    myText = '';
    flag = false;
    array.forEach(function(myVal,index) {

        if( myVal === '' ) return ;

        if( flag && myVal.replace(/ +/g,'').toLowerCase() == "objectives" ){
            output.introduction = myText
            myText = '';
            flag = false;
        }

        if( flag && myVal.replace(/ +/g,'').replace(":", "").toLowerCase() == "tools/languages" ) {
            output.objectives = myText
            myText = '';
            flag = false;
        }

        if( flag && myVal.replace(/ +/g,'').replace(":", "").toLowerCase() == "finaldeliverableoftheproject" ){
            output.outcome = myText;
            myText = '';
            flag = false;
        }

        if( flag && myVal.replace(/ +/g,'').replace(":", "").toLowerCase() == "projectschedule" ) {
            output.project_methodology = myText
            myText = '';
            flag = false;
        }

        if(flag) myText += myVal ;

        if(myVal.replace(/ +/g,'').toLowerCase() === "introduction") flag = true;

        if(myVal.replace(/ +/g,'').replace(":","").toLowerCase() === "objectives") flag = true ;

        if(myVal.replace(/ +/g,'').replace(":","").toLowerCase() === "outcome") flag = true ;

        if(myVal.replace(/ +/g,'').replace(":","").toLowerCase() === "projectmethodology") flag = true ;

    });

    return output;
    // console.log(getSimilarityScore(textCosineSimilarity(output.objectives,output.objectives)));
}