$(document).ready(function() {
	var field, diff;
	
	//start time upon stepping on the farm
	$(COW.config.$farmField).one('click', function(e) {
		COW.timer();
	});
	
	//hide elements that require local storage
	if (!localStorage) {
		$(COW.config.$bestTimes, COW.config.$setDifficulty).hide();
	}
	
	//the best times saved in local storage
	$(COW.config.$bestTimes).on('click', function() {
		var none = 'TBD',
			noEasy = parseInt(localStorage.bestTimeEasy),
			noMedium = parseInt(localStorage.bestTimeMedium),
			noHard = parseInt(localStorage.bestTimeHard); 
		
		if (isNaN(noEasy)) {
			noEasy = none;
		} else {
			noEasy = noEasy
		}
		if (isNaN(noMedium)) {
			noMedium = none;  
		} else {
			noMedium = noMedium
		}
		
		if (isNaN(noHard)) {
			noHard = none;
		} else {
			noHard = noHard
		}
		
		alert('Best Times' + 
				'\n Easy - ' +  noEasy + 
				'\n Medium - ' + noMedium + 
				'\n Hard - ' + noHard
		)
	});	
	
	diff = COW.difficulty;
	
	//get local storage value and set select list value
	$(COW.config.$setDifficulty).val(
		function() {
			var difficulty = localStorage.amount || diff.easy.slotAmount,
				value;
				
			if (difficulty == diff.easy.slotAmount) {
				value = diff.easy.text;
			} else if (difficulty == diff.medium.slotAmount){
				value = diff.medium.text;
			} else if (difficulty == diff.hard.slotAmount){
				value = diff.hard.text;
			}
			
			return value;
		}
	);
	
	//reload page when selecting 'start over' button
	$(COW.config.$startOver).on('click', function() {
		window.location = window.location;
	});
	
	//set game difficulty level
	$(COW.config.$setDifficulty).on('change', function(event) {
		var difficulty = this.value,
			amount,	level, pieAmount;

		switch (difficulty) {
			case diff.easy.text: 
				amount = diff.easy.slotAmount;
				level = diff.easy.text;
				pieAmount = diff.easy.pieAmount;
				break;
			case diff.medium.text: 
				amount = diff.medium.slotAmount;
				level = diff.medium.text;
				pieAmount = diff.medium.pieAmount;
				break;
			case diff.hard.text: 
				amount = diff.hard.slotAmount;
				level = diff.hard.text;
				pieAmount = diff.hard.pieAmount;
				break;
		}
		
		localStorage.amount = amount;
		localStorage.level = level;
		localStorage.pieAmount = pieAmount;
		window.location = window.location;
	});

	//set up right click handler
	field = document.getElementById(COW.config.farmField);
	
	//avoid a context menu popping up on right click
	field.oncontextmenu = function() {return false;};
	
	//add a marker to spot of pie identification
	$(COW.config.$farmSlot).mousedown(function(event){ 
		var $this = $(this);
		if( event.button == 2 ) { 
			if ($this.hasClass(COW.config.flaggedPie)) {
				$this.removeClass(COW.config.flaggedPie);
				$this.addClass(COW.config.questionMark);
				$this.text('?');
			} else if ($this.hasClass(COW.config.questionMark)) {
				$this.text('');
				$this.removeClass(COW.config.questionMark);
			} else if ($this.hasClass(COW.config.expose)) {
				return false;
			} else {
				$this.addClass(COW.config.flaggedPie);
				$this.text('');
			}
			$(COW.config.$cowPiesRemaining).text(COW.pieCounter());
			return false; 
		} 
		return true; 
	});  
	
	//add events to each field slot
	$(COW.config.$farmRow).on('click', function(event) {
		var $this = $(this),
			targetRow = $this.index(),	
			targetColStr = event.target.dataset.col, 	// don't know why this is a string
			targetCol = parseFloat(targetColStr),
			target = event.target,
			pies = (COW.field.size - COW.field.pieNumber - 1),
			exposedLength = $(COW.config.$expose).length,
			cowpieNumber, neighbors, zeroPies;
		
		//return if not clicked on farmRow or previously selected slot
		if (target.className === COW.config.farmRow || target.className === COW.config.farmSlot + ' ' + COW.config.expose) {
			return false;
		}
		
		cowpieNumber = COW.farmGrid[targetRow][targetCol].areaPieNumber;
		
		//if user steps in pie, they lose, else expose area pie numbers 
		if (COW.farmGrid[targetRow][targetCol].cowPie) {
			$(COW.config.$gameOver).text(COW.config.gameOverMessage);
			COW.openPieSlots(); 	//expose all Pies!
			$(COW.config.$farmRow).off();
			$(COW.config.$timer).text($(COW.config.$timer).text());
		} else {
			$(target).text(cowpieNumber);
			if (cowpieNumber !== 0) {
				$(target).removeClass(COW.config.flaggedPie);
			} else {
				neighbors = COW.checkNeighbors(targetRow, targetCol);
				zeroPies = COW.groupZeroPies(neighbors); 
				COW.exposeSlot(zeroPies);	//expose neighbors of zero slots
			}
			target.className = target.className + ' ' + COW.config.expose;
		}
		
		//is the user a winner?
		if (exposedLength === pies) {
			$(COW.config.$gameOver).text(COW.config.winnerMessage);
			$(COW.config.$cowPiesRemaining).text(0)
			COW.openPieSlots('winner');
			$(COW.config.$farmRow).off();
			COW.checkTime($(COW.config.$timer).text());
			$(COW.config.$timer).text($(COW.config.$timer).text());
		}
	});
});