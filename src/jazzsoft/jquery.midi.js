(function ( $ ) {
	function _midiProc(t,a,b,c){
		$.event.trigger({
			type: "rawMidiIn",
			param1: a,
			param2: b,
			param3: c,
			time: t
		});
		
		var cmd=Math.floor(a/16);
		var noteB = b;
		var note=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'][b%12]+Math.floor(b/12);
		var i;
		a=a.toString(16);
		b=(b<16?'0':'')+b.toString(16);
		c=(c<16?'0':'')+c.toString(16);
		if(cmd==8){
			$.midiIn("release_key", noteB);
			$.event.trigger({
				type: "midiNoteOff",
				
				    noteInt: noteB,
				    noteName: note,
				    time: t
				
			});
		}
		else if(cmd==9){
			if (c == 0) {
				$.midiIn("release_key", noteB);
				$.event.trigger({
					type: "midiNoteOff",
					
					    noteInt: noteB,
					    noteName: note,
					    time: t
					
				});
			}
			else {
				$.midiIn("press_key", noteB);
				$.event.trigger({
					type: "midiNoteOn",
					
					    noteInt: noteB,
					    noteName: note,
					    time: t
					
				});
			}
		}
		else if(cmd==10){
			$.event.trigger({
				type: "midiAftertouch",
				
				    aftNote: noteB,
				    aftValue: c,
				    time: t
				
			});
		}
		else if(cmd==11){
			$.event.trigger({
				type: "midiControl",
				
				    ctlNo: b,
				    ctlValue: c,
				    time: t
				
			});
		}
		else if(cmd==12){
			$.event.trigger({
				type: "midiProgramChg",
				
				    progNo: b,
				    progValue: c,
				    time: t
				
			});
		}
		else if(cmd==13){
			//str+="Aftertouch";
		}
		else if(cmd==14){
			//str+="Pitch Wheel";
		}		
	}
	$.midiIn = function( action, arg2, newMidiIn ) {
		if (action === "open") {
			if (!this.Jazz) {
				var r = $('<object>')
					.attr('classid', "CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90")
					.addClass("hidden");
				var s = $('<object>')
					.attr('type', "audio/x-jazz")
					.addClass("hidden");
				s.append('<p style="visibility:visible;">This page requires <a href="http://jazz-soft.net/">Jazz-Plugin</a> ...</p>');
				r.append(s);
				$('#MidiInStuff').append(r);
				this.Jazz = r[0];
				if(!this.Jazz || !this.Jazz.isJazz) this.Jazz = s[0];
			}
			this.midiInVars = {
				current_in: this.Jazz.MidiInOpen(newMidiIn, _midiProc),
				midiKeysPressed: new Array(),
				currentChord: new Array()
			};
			//this.current_in = this.Jazz.MidiInOpen(newMidiIn, _midiProc);
			return this.Jazz;
		}
		else if (action === "close") {
			this.Jazz.MidiInClose();
			this.midiInVars.current_in='';
		}
		else if (action === "list") {
			return this.Jazz.MidiInList();
		}
		else if (action === "current_in") {
			return this.midiInVars.current_in;
		}
		else if (action === "keys_pressed") {
			return this.midiInVars.midiKeysPressed.sort();
		}
		else if (action === "release_key") {
			var i;
			while ((i = this.midiInVars.midiKeysPressed.indexOf(arg2)) > -1) {
				this.midiInVars.midiKeysPressed.splice(i, 1);
			}
			if (this.midiInVars.midiKeysPressed.length == 0) {
			    this.event.trigger({
			        type: "midiChordReleased",
			        chord: this.midiInVars.currentChord.sort()
			    });
                //{ chord: this.midiInVars.currentChord.sort() });
				this.midiInVars.currentChord = new Array();
			}
		}
		else if (action === "press_key") {
			this.midiInVars.currentChord.push(arg2);
			this.midiInVars.midiKeysPressed.push(arg2);
		}
	};
	/*$.fn.pianoKeyboard = function(param, app) {
		var tgSpacing = param.tgWidth *7/12;
		for (var i = 21; i < 109; i++) {
			var det = ((i+7)*7) % 12;
			var className = 'bw' + det;
			var left = (det < 7) ? (i - 21 - det/7)*tgSpacing : (i - 21 - (det - 8)/7 )*tgSpacing;
			this.append (
				$('<span>')
					.attr('id', 'tast'+i)
					.addClass('up')
					.addClass(className)
					.css('left', left)
					.on('mousedown touchstart', function () {
					    $obj = $(this);
					    $obj.data('timer', 1);
					    $obj.data('downX', $obj.position().left);

					    event = event.originalEvent;
					    if (event.targetTouches && event.targetTouches.length === 1) {
					        var touch = event.targetTouches[0];
					        $obj.data('downX', $obj.position().left + touch.clientX);
                        }
					    var p = $(this).attr('id').replace('tast', '');

					    setTimeout(function (p) {
					        var timer = $obj.data('timer');
					        if (timer) {					            
					            app.ProcessEvent("midinoteon", {
					                type: "midinoteon",
					                noteInt: parseInt(p),
					                //noteName: note,
					                //time: t
					            });
					        }
					    }, 50, p);
					    event.preventDefault();
					})
					.on('mouseup touchend', function () {
					    var p = $(this).attr('id').replace('tast', '');
					    app.ProcessEvent("midinoteoff", {
					        type: "midinoteoff",
					        noteInt: parseInt(p),
					    });
					    event.preventDefault();
					})
					.on('touchmove', function (event) {
					    $obj = $(this);
					    $obj.data('timer', 0);

					    event = event.originalEvent;

					    if (event.targetTouches.length === 1) {
					        var touch = event.targetTouches[0];
					        var downX = parseInt($obj.data('downX'));
					        $obj.parent().css({ position: 'absolute', left: touch.pageX - downX + 'px', bottom: '0px' })
					        $('.staffTitleArea:last').text($obj.data('downX') + ' ' + downX);
					    }
					    event.preventDefault();
					}));
		}
		return this;
	};*/
}(jQuery));
