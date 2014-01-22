var COW = COW || {};

//difficulty levels for the game
COW.difficulty = {
	easy : {	
		text : 'easy',
		pieAmount : 12,
		slotAmount : 81  	//must have a whole number square root
	},
	medium : {	
		text : 'medium',
		pieAmount : 40,
		slotAmount : 225	//must have a whole number square root
	},
	hard : {	
		text : 'hard',
		pieAmount : 81,
		slotAmount : 441	//must have a whole number square root
	}
};

//establish base field object
COW.field = {
	size : localStorage.amount || COW.difficulty.easy.slotAmount,
	row : function () {  	// number of rows per the field - needs to be dynamic per the field size....
		return Math.floor(Math.sqrt(this.size));
	},
	pieNumber : localStorage.pieAmount || COW.difficulty.easy.pieAmount,
	level : localStorage.level || COW.difficulty.easy.text
};

//Class for each fieldSlot
COW.fieldSlot = function(farmRow, farmSlot, numb) {
	this.farmRow = farmRow;
	this.farmSlot = farmSlot;
	this.numb = numb;
	this.cowPie = false;
	this.areaPieNumber = 0;
};

//random pieSlot- param 'num' must be a number
COW.random = function(num) {
	return Math.floor(Math.random() * num);
};

//create pies and assign to Model
COW.pieMaker = function(){
	var pieNumb1, pieNumb2,	
		pieAmount = COW.field.pieNumber,
		rowLength = COW.field.row(),
		p;

	for (p = 0; p < pieAmount; p++) {
		pieNumb1 = COW.random(rowLength);
		pieNumb2 = COW.random(rowLength);
		
		if (COW.farmGrid[pieNumb1][pieNumb2].cowPie == true) {
			pieAmount++;
		} 
		COW.farmGrid[pieNumb1][pieNumb2].cowPie = true;
	}
};
