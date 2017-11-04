var playerSelector = document.getElementById('p-count');

playerSelector.onchange = function(e) {
    if(playerSelector.value === '2') {
        $('#p2').removeClass('hidden');
    }
    
    if(playerSelector.value === '1') {
        $('#p2').addClass('hidden');
    }
}

function hasWhiteSpace(s) {
  return s.indexOf(' ') >= 0;
}

var teamNameInput = document.getElementById('tname')
teamNameInput.onchange = function(e) {
    var value = teamNameInput.value;
    if(hasWhiteSpace(value)) {
      $('#tname-div').addClass('has-error');
    } else {
       $('#tname-div').removeClass('has-error'); 
    }
}