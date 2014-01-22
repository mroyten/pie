COW = COW || {};

//game timer
COW.timer = function() {
	var $digit1 = $('#digit1').text(),
		$digit2 = $('#digit2').text(),
		$digit3 = $('#digit3').text();
	
	setInterval(function() {
		$('#digit1').text($digit1++);
		
		if ($digit1 > 10) {
			$('#digit2').text('')
		}
				
		if ($digit1 > 100) {
			$('#digit3').text('')
		}
		
		if ($digit3 === 9 && $digit2 === 9 && $digit1 === 9) {
			clearInterval();
		}
	}, 1000);
};

//set best time to local storage if best time
//@param - number
COW.checkTime = function(time) {
	var diff = COW.difficulty;
	var level = level || localStorage.level;
	
	if (typeof level === undefined) {
		level = diff.easy.text;
	}
	
	switch (level) {
		case diff.easy.text: 
			if (time < localStorage.bestTimeEasy || !localStorage.bestTimeEasy) {
				localStorage.bestTimeEasy = time;
			}
		break;
		
		case diff.medium.text: 
			if (time < localStorage.bestTimeMedium || !localStorage.bestTimeMedium) {
				localStorage.bestTimeMedium = time;
			}
		break;
		
		case diff.hard.text: 
			if (time < localStorage.bestTimeHard || !localStorage.bestTimeHard) {
				localStorage.bestTimeHard = time;
			}
		break;
	}
};
