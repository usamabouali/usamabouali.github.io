// thatmikeflynn.com/egg.js/
/*
Copyright (c) 2015 Mike Flynn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */
function Egg(/* keySequence, fn, metadata */) {
  this.eggs = [];
  this.hooks = [];
  this.kps = [];
  this.activeEgg = '';
  // for now we'll just ignore the shift key to allow capital letters
  this.ignoredKeys = [16];

  if(arguments.length) {
    this.AddCode.apply(this, arguments);
  }
}

// attempt to call passed function bound to Egg object instance
Egg.prototype.__execute = function(fn) {
  return typeof fn === 'function' && fn.call(this);
}

// converts literal character values to keyCodes
Egg.prototype.__toCharCodes = function(keys) {
  var special = {
      "slash": 191, "up": 38, "down": 40, "left": 37, "right": 39, "enter": 13, "space": 32, "ctrl": 17, "alt": 18, "tab": 9, "esc": 27
    },
    specialKeys = Object.keys(special);

  if(typeof keys === 'string') {
    // make sure there isn't any whitespace
    keys = keys.split(',').map(function(key){
      return key.trim();
    });
  }

  var characterKeyCodes = keys.map(function(key) {
    // check if it's already a keycode
    if(key === parseInt(key, 10)) {
      return key;
    }

    // lookup in named key map
    if(specialKeys.indexOf(key) > -1) {
      return special[key];
    }
    // it's a letter, return the char code for it
    return (key).charCodeAt(0);
  });

  return characterKeyCodes.join(',');
}

// Keycode lookup: http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
Egg.prototype.AddCode = function(keys, fn, metadata) {
  this.eggs.push({keys: this.__toCharCodes(keys), fn: fn, metadata: metadata});

  return this;
}

Egg.prototype.AddHook = function(fn) {
  this.hooks.push(fn);

  return this;
}

Egg.prototype.handleEvent = function(e) {
  var keyCode  = e.which;
  var isLetter = keyCode >= 65 && keyCode <= 90;
  /*
    This prevents find as you type in Firefox.
    Only prevent default behavior for letters A-Z.
    I want keys like page up/down to still work.
  */
  if ( e.type === "keydown" && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey ) {
    var tag = e.target.tagName;

    if ( ( tag === "HTML" || tag === "BODY" ) && isLetter ) {
      e.preventDefault();
      return;
    }
  }

  if ( e.type === "keyup" && this.eggs.length > 0 ) {
    // keydown defaults all letters to uppercase
    if(isLetter) {
      if(!e.shiftKey) {
        // convert to lower case letter
        keyCode = keyCode + 32;
      }
    }

    // make sure that it's not an ignored key (shift for one)
    if(this.ignoredKeys.indexOf(keyCode) === -1) {
      this.kps.push(keyCode);
    }

    this.eggs.forEach(function(currentEgg, i) {
      var foundEgg = this.kps.toString().indexOf(currentEgg.keys) >= 0;

      if(foundEgg) {
        // Reset keys; if more keypresses occur while the callback is executing, it could retrigger the match
        this.kps = [];
        // Set the activeEgg to this one
        this.activeEgg = currentEgg;
        // if callback is a function, call it
        this.__execute(currentEgg.fn, this);
        // Call the hooks
        this.hooks.forEach(this.__execute, this);

        this.activeEgg = '';
      }
    }, this);
  }
};

Egg.prototype.Listen = function() {
  // Standards compliant only. Don't waste time on IE8.
  if ( document.addEventListener !== void 0 ) {
    document.addEventListener( "keydown", this, false );
    document.addEventListener( "keyup", this, false );
  }

  return this;
};

Egg.prototype.listen  = Egg.prototype.Listen;
Egg.prototype.addCode = Egg.prototype.AddCode;
Egg.prototype.addHook = Egg.prototype.AddHook;

//My EggSample
var modal = document.getElementById('myModal');

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");

//Picture of Me
var egg = new Egg();
egg
  .AddCode("k,i,n,g", function() {
    
    modal.style.display = "block";
    //modalImg.src = lilMe.jpg;
    modalImg.src = img.src;
    captionText.innerHTML = '<font size="6"> 🎮 Created by Dundun 💩 </font>';
    console.log("This happened");
  }, "konami-code")
 .AddHook(function(){
    //alert("Konami!"); //added
    console.log("Hook called for: " + this.activeEgg.keys);
    console.log(this.activeEgg.metadata);
  }).Listen();

 //The Team
var img2 = document.getElementById('myImg2');
var egg = new Egg();
egg
  .AddCode("t,h,e,space,t,e,a,m", function() {
    modal.style.display = "block";
    //modalImg.src = lilMe.jpg;
    modalImg.src = img2.src;
    captionText.innerHTML = '<font size="6"> The Team: Dion, Pam, Manny & Dundun 😈 </font>';
    console.log("This happened");
  }, "konami-code")
 .AddHook(function(){
    //alert("Konami!"); //added
    console.log("Hook called for: " + this.activeEgg.keys);
    console.log(this.activeEgg.metadata);
  }).Listen();

  //egg
var img3 = document.getElementById('myImg3');
var egg = new Egg();
egg
  .AddCode("e,a,s,t,e,r,space,e,g,g", function() {
    modal.style.display = "block";
    //modalImg.src = lilMe.jpg;
    modalImg.src = img3.src;
    captionText.innerHTML = '<font size="5"> Congrats you found the easter egg! You can add whatever you like here! </font>';
    console.log("This happened");
  }, "konami-code")
 .AddHook(function(){
    //alert("Konami!"); //added
    console.log("Hook called for: " + this.activeEgg.keys);
    console.log(this.activeEgg.metadata);
  }).Listen();



 // Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
    modal.style.display = "none";
}

 

// EGGSAMPLE
// var egg = new Egg();
// egg
//   .AddCode("up,up,down,down,left,right,left,right,b,a", function() {
//     alert("Konami!");
//   }, "konami-code")
//  .AddHook(function(){
//     console.log("Hook called for: " + this.activeEgg.keys);
//     console.log(this.activeEgg.metadata);
//   }).Listen();
