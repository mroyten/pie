$(document).ready(function() {
	COW = COW || {};

	COW.config = {
		//jquery selectors
		$farmRow : '.farmRow',
		$farmSlot : '.farmSlot',
		$farmField : '#farmField',
		$flaggedPie: '.flaggedPie',
		$expose: '.expose',
		$farmField: '#farmField',
		$timer: '#timer',
		$cowPiesRemaining: '#cowPiesRemaining',
		$gameOver: '#gameOver',
		$setDifficulty: '#setDifficulty',
		$bestTimes: '#bestTimes',
		$startOver: '#startOver',
		
		//classNames
		farmSlot : 'farmSlot',
		farmRow : 'farmRow',
		farmField : 'farmField',
		flaggedPie: 'flaggedPie',
		questionMark: 'questionMark',
		cowPie: 'cowPie',
		expose: 'expose',
		
		//game over messaging
		gameOverMessage: 'Game Over, You Done Stepped In It Boy!',
		winnerMessage: 'You Have Won Boy'
	};
	
});