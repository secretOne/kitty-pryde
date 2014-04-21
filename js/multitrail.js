/***************************************
      Multiple mouse trail script
 Written by Mark Wilton-Jones, 6/1/2001
 Update v2.0 12/08/2003 to allow arrays
****************************************

Please see http://www.howtocreate.co.uk/jslibs/ for details and a demo of this script
Please see http://www.howtocreate.co.uk/jslibs/termsOfUse.html for terms of use

To use:
	You can only use this script once per page.
	In the <body> tag, you might want to add the attribute style="overflow-x:hidden;"
	Add the following lines just before the </body> tag:

<script src="PATH TO SCRIPT/multitrail.js" type="text/javascript" language="javascript1.2"></script>
<script type="text/javascript" language="javascript1.2"><!--

//for the same content in every trail (where number of trails > 0)
trailContents = '<img src="location of image" height="height of image" width="width of image" border="0" alt="">';
//or
trailContents = 'Welcome';

//for one trail for each letter given (where number of trails == 0)
trailContents = 'Welcome';

//for one trail for each string given in an array (where number of trails == 0)
trailContents = ['Welcome','to','my','site','<img src="hi.gif" height="20" width="10" alt="">'];

createMouseTrail(
	5, //number of trails (0 will make one trail for each letter or array entry) try not to make
	   //more than about 7-8 trails unless using fixed speed where upto thirty can be used
	75, //speed of trails - 50-75 is about right - higher numbers are slower. You may want to use 25 for fixed speed
	trailContents, //contents of each trail or contents to be spread across trails
	0, //x offset from mouse
	20, //y offset from mouse
	0, //x offset between trails
	0, //y offset between trails
	0, //elasticity (0 is none, 0.6 is about max - after that they start to jitter)
	true, //fixed speed - elasticity will be ignored - all trails will move as fast as each other
	'font-weight: bold;' //stylesheet for trails
);
//--></script>

*/

var xcoord = -1000, ycoord = -1000, trailSpeed, xcoordOff, ycoordOff, trailoffsetsx, trailoffsetsy, trlElast, setUpIntr, trlSpeedX = [], trlSpeedY = [];
function setUpInit() {
	if( !getRefToDivNest('msTrlDiv'+(numTrails-1)) ) { return; }
	window.clearInterval(setUpIntr); var oPix = document.childNodes ? 'px' : 0;
	for( var x = 0; x < numTrails; x++ ) {
		var divRef = getRefToDivNest('msTrlDiv'+x);
		if( divRef.style ) { divRef = divRef.style; }
		divRef.top = ( -1000 ) + oPix; //start them out of sight
		divRef.left = ( -1000 ) + oPix;
	}
	setUpIntr = window.setInterval('mvTrDivs();',trailSpeed);
}
function mvTrDivs() {
	var oPix = document.childNodes ? 'px' : 0;
	if( trailFix ) { //fixed speed
		trlSpeedX[0] = xcoord; trlSpeedY[0] = ycoord;
		for( var x = numTrails - 1; x >= 0; x-- ) {
			var divRef = getRefToDivNest('msTrlDiv'+x); if( divRef.style ) { divRef = divRef.style; }
			//each one assumes the position that the last one was at at the last interval (plus offsets)
			divRef.top = trlSpeedY[x] + oPix; divRef.left = trlSpeedX[x] + oPix;
			trlSpeedY[x+1] = parseInt( divRef.top ) + trailoffsetsy;
			trlSpeedX[x+1] = parseInt( divRef.left ) + trailoffsetsx;
		}
	} else { //variable speed
		var lastx = xcoord, lasty = ycoord;
		for( var x = 0; x < numTrails; x++ ) {
			var divRef = getRefToDivNest('msTrlDiv'+x); if( divRef.style ) { divRef = divRef.style; }
			//these two complicated lines move each trail one xth of the way towards the one before it
			//all of that floor, ceil and > 0 stuff ensures that they end up exactly on top of each other
			//the ( trlSpeedY[x] * trlElast ) bit adds on any elasticity
			trlSpeedY[x] = ( trlSpeedY[x] * trlElast ) + ( ( lasty - parseInt( divRef.top ) > 0 ) ? Math.ceil( ( lasty - parseInt( divRef.top ) ) / ( x + 1 ) ) : Math.floor( ( lasty - parseInt( divRef.top ) ) / ( x + 1 ) ) );
			trlSpeedX[x] = ( trlSpeedX[x] * trlElast ) + ( ( lastx - parseInt( divRef.left ) > 0 ) ? Math.ceil( ( lastx - parseInt( divRef.left ) ) / ( x + 1 ) ) : Math.floor( ( lastx - parseInt( divRef.left ) ) / ( x + 1 ) ) );
			divRef.top = ( parseInt( divRef.top ) + trlSpeedY[x] ) + oPix;
			divRef.left = ( parseInt( divRef.left ) + trlSpeedX[x] ) + oPix;
			lastx = parseInt( divRef.left ) + trailoffsetsx; lasty = parseInt( divRef.top ) + trailoffsetsy;
		}
	}
}
function getRefToDivNest( divID, oDoc ) {
	if( !oDoc ) { oDoc = document; }
	if( document.layers ) {
		if( oDoc.layers[divID] ) { return oDoc.layers[divID]; } else {
			for( var x = 0, y; !y && x < oDoc.layers.length; x++ ) {
				y = getRefToDivNest(divID,oDoc.layers[x].document); }
			return y; } }
	if( document.getElementById ) { return document.getElementById(divID); }
	if( document.all ) { return document.all[divID]; }
	return document[divID];
}
function msIsMv(e) { if( !e ) { e = window.event; } if( !e || ( typeof( e.pageX ) != 'number' && typeof( e.clientX ) != 'number' ) ) { return; }
	if( typeof( e.pageX ) == 'number' ) { xcoord = e.pageX; ycoord = e.pageY; } else {
		xcoord = e.clientX; ycoord = e.clientY;
		if( !( ( window.navigator.userAgent.indexOf( 'Opera' ) + 1 ) || ( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) || window.navigator.vendor == 'KDE' ) ) {
			if( document.documentElement && ( document.documentElement.scrollTop || document.documentElement.scrollLeft ) ) {
				xcoord += document.documentElement.scrollLeft; ycoord += document.documentElement.scrollTop;
			} else if( document.body && ( document.body.scrollTop || document.body.scrollLeft ) ) {
				xcoord += document.body.scrollLeft; ycoord += document.body.scrollTop;
			} } } xcoord += xcoordOff; ycoord += ycoordOff;
}
function createMouseTrail(numT,spdT,conT,msOfX,msOfY,tOffX,tOffY,elAs,isFix,trSty) {
	trailSpeed = spdT; xcoordOff = msOfX; ycoordOff = msOfY; trailoffsetsx = tOffX; trailoffsetsy = tOffY; trlElast = elAs; trailFix = isFix;
	//NS4 does not like inline styles in dynamic layers, so I use invalid style (not in head)
	if( document.layers && navigator.mimeTypes['*'] ) {
		document.write('<style type="text/css"><!--\n.trailStyle { '+trSty+' }\n--></style>'); trSty = 'class="trailStyle"';
	} else { trSty = 'style="position:absolute;left:0px;top:0px;'+trSty+'"'; }
	if( numT < 1 ) { numTrails = conT.length; window.isNoLen = conT; } else { numTrails = numT; }
	for( var x = 0; x < numTrails; x++ ) {
		trlSpeedX[x] = 0; trlSpeedY[x] = 0;
		if( window.isNoLen ) { if( typeof( window.isNoLen ) != 'string' ) { conT = window.isNoLen[x]; } else { conT = window.isNoLen.charAt( x ); } } //split layers
		if( document.layers ) { //releave NS4 bug
			document.write('<layer id="msTrlDiv'+x+'" left="0" top="0" '+trSty+'>'+conT+'</layer>');
		} else {
			document.write('<div '+trSty+' id="msTrlDiv'+x+'">'+conT+'</div>');
		}
	}
	if(document.captureEvents) { if(Event.MOUSEMOVE) { document.captureEvents(Event.MOUSEMOVE); } }
	document.onmousemove = msIsMv;
	setUpIntr = window.setInterval('setUpInit();',100);
}