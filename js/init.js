//establish namespace
var COW = COW || {};

//initalize and build farmField
$(document).ready(function() {
	COW.farmGrid = [];
	var $farmRow = $('<div class="' +  COW.config.farmRow + '"></div>');
	var $farmSlot = $('<div class="' + COW.config.farmSlot  + '"></div>');
	var theField = '';
	var farmRowLength = COW.field.row();
	var farmSlotNum, farmRowNum, rowNum, clonedNode, tt, t, p, farmSlotNumber, rowIndex, slotIndex;

	//make the rows for DOM and JS Objects
	for (rowNum = 0; rowNum < farmRowLength; rowNum++) {
		COW.farmGrid.push([rowNum]);	//JS Object row
		$($farmRow).clone().appendTo(COW.config.$farmField);		//Dom Row Creation
	}
	
	//clone row columns
	for (tt = 0; tt < farmRowLength; tt++) {
		clonedNode = $($farmSlot).clone().attr('data-col', tt);
		clonedNode.appendTo(COW.config.$farmRow);
	}
	
	//count each farm slot
	farmSlotNumber = 0;
	
	//make JS objects for each 'slot'
	for (rowIndex = 0; rowIndex < farmRowLength; ++rowIndex) {
		COW.farmGrid[rowIndex].pop(); 	//added this pop, as this made an unneeded array element for some reason.
		for (slotIndex = 0; slotIndex < farmRowLength; ++slotIndex ) {
			COW.farmGrid[rowIndex].push(new COW.fieldSlot(rowIndex, slotIndex, farmSlotNumber));
			farmSlotNumber++;
		}
	}
	
	//make some Pies on the GRID!
	COW.pieMaker();
	
	//exposed neigbhor array
	COW.theZeroPieNeigbhors = [];
		
	//	flatten utility function to flatten arrays
	// param 'newArray' needs to be an array, leave 'returnedArray' empty
	COW.flatten = function reFlatten(newArray, returnedArray) {
		var i,
		length = newArray.length;
	
		if (!returnedArray) {
			returnedArray = [];
		}
	
		if (newArray instanceof Array) {
		
			for (i = 0; i < length; i++) {
				
				if (newArray[i] instanceof Array) {
					reFlatten(newArray[i], returnedArray);
					continue;
				}
				
				returnedArray.push(newArray[i]);
			}; 
			
		} else {
			throw new Error('flatten function: need an array as an argument');
		}
		
		return returnedArray;
	}

	//send in an array of JS objects to check if it touches another farmSlot with zero pies
	// param 'farmSlotNeighbors' needs to be an array
	COW.groupZeroPies = function zeroPies (/*array of neighbors*/ farmSlotNeighbors) {
		var scope = scope || farmSlotNeighbors.length,
			zeroPieNeighbors = [],
			currentSlotNeighbors = [],
			currentRow,	currentSlot, index, indexed;
			
			COW.theZeroPieNeigbhors = []; 	//empty out this array
		
		for (index = 0; index < scope; index++) {
			indexed = farmSlotNeighbors[index];
			
			if (indexed.areaPieNumber === 0 && (indexed.pushed === undefined || indexed.pushed !== true)) {
					
				currentRow = indexed.farmRow;
				currentSlot = indexed.farmSlot;
				indexed.pushed = true;
				zeroPieNeighbors.push(indexed);
				currentSlotNeighbors = COW.checkNeighbors(currentRow, currentSlot); 	// slot with zero area pies' neighbors and their neigbhors
				zeroPies(currentSlotNeighbors); 	//recurse the function if zero areapienumbers exist
				COW.exposeSlot(zeroPieNeighbors);	//expose the zero pies!!!!
			}
		}
		
		return COW.flatten(COW.theZeroPieNeigbhors);	//flatten the arrays into one large array;
	};
	
	//insert farmSlot JS object and expose the DOM equivalent 
	//param 'currentSlotNeighbors' needs to be an array
	COW.exposeSlot = function(currentSlotNeighbors) {
		var length = currentSlotNeighbors.length,
			farmRow, farmSlot, $currentFarmSlot, areaPieNumber, index;
		
		if (currentSlotNeighbors instanceof Array) {
			for (index = 0; index < length; index++) {
				farmRow = currentSlotNeighbors[index].farmRow;
				farmSlot = currentSlotNeighbors[index].farmSlot;
				$currentFarmSlot = $(COW.config.$farmRow)[farmRow].childNodes[farmSlot];
				areaPieNumber = COW.farmGrid[farmRow][farmSlot].areaPieNumber;
				
				$currentFarmSlot.className = COW.config.farmSlot + ' ' + COW.config.expose;
				$currentFarmSlot.textContent = areaPieNumber;
				
				if (currentSlotNeighbors[index].areaPieNumber === 0) {
					COW.theZeroPieNeigbhors.push(COW.checkNeighbors(farmRow, farmSlot));
				}
			}
		} else {
			throw new Error('use an array for the expose method');
		}
	};

	//instert farm row number in first param, and column number in 2nd para and get an array returned with its neighbors
	COW.checkNeighbors = function(farmRowNum, farmColNum) {
		var neighbors = [],
			row = farmRowNum,
			col = farmColNum,
			rowPlus = row + 1,
			colPlus = col + 1,
			rowMinus = row - 1,
			colMinus = col -1;
			
		//check current row	
		if (COW.farmGrid[row][colPlus] !== undefined) {
			neighbors.push(COW.farmGrid[row][colPlus]);
		}
		if (COW.farmGrid[row][colMinus] !== undefined) {
			neighbors.push(COW.farmGrid[row][colMinus]);
		}
		
		//check top row	
		if (COW.farmGrid[rowPlus] !== undefined) {
			if (COW.farmGrid[rowPlus][colPlus] !== undefined) {
				neighbors.push(COW.farmGrid[rowPlus][colPlus]);
			}
			if (COW.farmGrid[rowPlus][colMinus] !== undefined) {
				neighbors.push(COW.farmGrid[rowPlus][colMinus]);
			}
			if (COW.farmGrid[rowPlus][col] !== undefined) {
				neighbors.push(COW.farmGrid[rowPlus][col]);
			}
		}
		
		//check bottom row
		if (COW.farmGrid[rowMinus] !== undefined) {
			if (COW.farmGrid[rowMinus][colPlus] !== undefined) {
				neighbors.push(COW.farmGrid[rowMinus][colPlus]);
			}
			if (COW.farmGrid[rowMinus][colMinus] !== undefined) {
				neighbors.push(COW.farmGrid[rowMinus][colMinus]);
			}
			if (COW.farmGrid[rowMinus][col] !== undefined) {
				neighbors.push(COW.farmGrid[rowMinus][col]);
			}
		}
		
		return neighbors;
	};
	
	//add expose to farmSlots that have a pie
	COW.openPieSlots = function(gameOver) {
		var currentSlot, farmSlot, farmRow;
			
		for (farmRow = 0; farmRow < farmRowLength; ++farmRow) {
			for (farmSlot = 0; farmSlot < farmRowLength; ++farmSlot ) {
				if (COW.farmGrid[farmRow][farmSlot].cowPie === true) {
					if (gameOver == 'winner') {
						$(COW.config.$farmRow)[farmRow].childNodes[farmSlot].className = COW.config.farmSlot + ' ' + COW.config.flaggedPie;
					} else {
						$(COW.config.$farmRow)[farmRow].childNodes[farmSlot].className = COW.config.farmSlot + ' ' + COW.config.cowPie;
					}
				}
			} 
		}
	};

	//grab the remain number of pies 
	COW.pieCounter = function() {
		$('#cowPiesRemaining').text(COW.field.pieNumber - $(COW.config.$flaggedPie).length);
	};
	
	//inialize remaining pie counter
	COW.pieCounter();
	
	//assign neighbors of nearby cowpie numbers.
	for (t = 0; t < farmRowLength; ++t) {
		for (p = 0; p < farmRowLength; ++p ) {
			if (COW.farmGrid[t][p].cowPie === true) {
				farmSlotNum = COW.farmGrid[t][p].farmSlot;
				farmRowNum = COW.farmGrid[t][p].farmRow; 
				
				//assign cowPieNums to Neighbors
				$.each(COW.checkNeighbors(farmRowNum, farmSlotNum), function () {
					this.areaPieNumber += +1;
				});
			}
		}
	}
});

