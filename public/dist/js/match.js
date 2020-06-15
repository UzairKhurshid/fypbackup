function matches(projects) {
    let proj = ''
    $.each(projects, function( index, value ) {
         proj += proj_card(value.name,value.year,value.season,value.department,value.description,value.type)
    });
    $('#match_projs').html(proj);
}

function proj_card(name,year,season,department,description,type) {
    return '<div class="match_proj">\n' +
        '        <div class="card d-inline-block w-sm-360p">\n' +
        '        <div class="card-body">\n' +
        '        <div class="d-flex flex-wrap">\n' +
        '    <div class="w-65">\n' +
        '        <h6 class="mb-5">'+name+'</h6>\n' +
        '    <p>'+ description+'</p>\n' +
        '    </div>\n' +
        '    </div>\n' +
        '    <div class="card-footer text-muted justify-content-between">\n' +
        '        <div class="text-uppercase"><span class="text-dark">'+type+'<br></span>'+department+' '+season+' '+year+'</div>\n' +
        '    </div>\n' +
        '    </div>\n' +
        '    </div>\n' +
        '    </div>';
}