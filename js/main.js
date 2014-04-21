//for one trail for each letter given (where number of trails == 0)
trailContents = '•(¯°·._.•|[NerdNic]|•._.·°¯)•';

createMouseTrail(
	0, //number of trails (0 will make one trail for each letter or array entry) try not to make
	   //more than about 7-8 trails unless using fixed speed where upto thirty can be used
	20, //speed of trails - 50-75 is about right - higher numbers are slower. You may want to use 25 for fixed speed
	trailContents, //contents of each trail or contents to be spread across trails
	20, //x offset from mouse
	2, //y offset from mouse
	15, //x offset between trails
	0, //y offset between trails
	0, //elasticity (0 is none, 0.6 is about max - after that they start to jitter)
	true, //fixed speed - elasticity will be ignored - all trails will move as fast as each other
	'font-weight: normal;' //stylesheet for trails
);