#Space Game
An odd mixture of many genres

##Attribution
###Images
* [The Noun Project](http://www.thenounproject.com)
* [code32](http://opengameart.org/users/code32)
* [eleazzaar](http://opengameart.org/users/eleazzaar)
* [wojtar-stock](http://wojtar-stock.deviantart.com/)

###Music
* [avgst](http://opengameart.org/users/avgvst)
* [WrathGames Studio](http://wrathgames.com/blog/)
* [copyc4t](http://www.freesound.org/people/copyc4t/)

###Sound Effects
* [bart](http://opengameart.org/users/bart)
* [WrathGames Studio](http://wrathgames.com/blog/)

###Some Design Elements
* [Paul M. Watson](http://www.paulmwatson.com)
* [simurai](http://www.simurai.com/)

###Libraries
* [EaselJS](http://easeljs.com)
* [speak.js](https://github.com/kripken/speak.js)
* [SoundManager 2](http://www.schillmania.com/projects/soundmanager2/)

##Changes
###January 21st, 2012
* Started project
* Added the EaselJS and jQuery libraries
* Added the Segoe WP font
* Added some icons
* Set up Apple stuff
* 3D!!!

###January 26th, 2012
* Began work on actual game part
* Some CSS fiddling
* Created desktop-only CSS file
* Added speak.js

###January 30th, 2012
* Made TTS voice female
* Added actual movement
* Started making the menu do stuff
* Fixed some weird CSS regression

###January 31st, 2012
* Added bullets

###February 3rd, 2012
* Added shooting interval

###February 4th, 2012
* Added splash screen
* Made bullets rectangles
* Made bullets gradients

###February 5th, 2012
* Added `Enemy` class
* Made changes to the `Bullet` class
* Added enemy bullet array

###February 17th, 2012
* Added enemies
* Crappy enemy AI, initiate!
* Music
* SM2

###February 18th, 2012
* Created an Icons directoryy
* Shooting SFX
* Side menu
* Health bar
* Changed background scrolling speed(Ship now moves at ~150 MPH)
* Music fixed
* Changed enemy firing interval

###February 19th, 2012
* Moved images to one big resource URL object
* Added Modernizr
* Fixed bugs in Firefox
* Began to add images for SVG-less browsers

###February 20th, 2012
* Continued to make PNGs
* Mobile Support:
    * Touch controls
    * Scalable canvas
    * Startup image
    * Glossy icon for home screen
    * Hid Safari topbar
    * Moved some CSS around
    * Continued to work on Android support

###February 21st, 2012
* Fixed mobile controls for landscape
* Changed splash logo
* Made it so that you tap the canvas to pause on mobiles
* Hid the secondary menu for mobiles
* Made ship speed, bullet speed and bullet size relative
* Hid Safari topbar for splash screen when in landscape
* Tested on Windows(But haven't been able to get into C9 in IE, though)

###February 22nd, 2012
* Began adding some 3D to the canvas
* Fixed some issues with the secondary menu

###February 23rd, 2012
* Moar 3D
* Made it so that the canvas is even bigger on large screens
* Web Sockets Test
* Fullscreen API

###March 3rd, 2012
* Added 3D in the background
* 3D is all controlled by one variable
* Attempted to move the space background to C9 so I can 3D it. Didn't work.

###March 9th, 2012
* Began adding the `Planet` class, before I decided that my sleep deprivation and lack of memory of what I was in the middle of doing would result in bad things happening.
* Mysteriously got the space background to appear

###March 10th, 2012
* Added Planet class
* Began designing interstellar distance system
* Added some planet graphics

###March 16th, 2012
* Finished up planet class
* Changed up the `travelTo` to unpause the ticker
* Changed planet scale
* Added planet name to menu screen

###March 18th, 2012
* Began work on map

###March 30th, 2012
* Added some more SFX
* Changed travelling music
* Added multiple battle tunes
* Made sounds preload by default

###April 9th, 2012
* Made the travel canvas be as big as possible
* Finished map
* Added metal texture for travelling
* Set the map scale to something a little more standard(It previously depended on the planet image size)
* Made the standard font Segoe WP
* Moved the speak.js options into one object
* Made the ship persist between planets
* New fullscreen dialog
* Moved the setting of the onclick handler to `init`

###April 21st, 2012
* Got Firefox working
* Added a function to handle SM2 errors
* Increased framerate to 60 FPS
* Switched to local version of space BG
* Going to add a more compressed version of above
* Ended up changing SM2 back to debug mode, will undo

###April 22nd, 2012
* Switched from jQuery to zepto.js
* Converted all canvas.width()s to canvas[0].width
* Switched SM2 out of debug

###April 24th, 2012
* Updated EaselJS version

###May 15th, 2012
* Began ring system
* Added ring switching keys

###July 21st, 2012
* Fixed key event problems
* Tested in Chromium 20, FF 14 and Opera 12
* TODO: Fix insecure(ie. external) content, fix fullscreen problems

###July 22nd, 2012
* Fixed bug where ship would disappear on second flight(Harder than I though =/)
* Changed fullscreen interface so it works(Needs some more work, though)
* TODO: Fix insecure(ie. external) content, make fullscreen UI better, make images work in Opera, parallex background, find some better planets

###July 23rd, 2012
* Steam sale over... Damn you, Newell!
* Parallex, because #YOLO
* Decided that Chrome's treatment of fullscreen is insane... I had to clear the cache to get it to work like normal
* TODO: Fix insecure(ie. external) content, make fullscreen UI better, make images work in Opera, find some better planets, get some #Swaqqalicious music

###July 24th, 2012
* Moved some external content to here
* Fixed up parallex effect
* Will add more music tomorrow
* TODO: Fix remaining insecure(ie. external) content, make fullscreen UI better, make images work in Opera, find some better planets, add music

###July 25th, 2012
* Added LICENSE.md
* Added a bunch of music
* Discovered fix for problems with bullet sound: turns out, SM2 has issues with .wav files, so I had to use a .mp3. Will convert the explosion sound later.
* Made travel music use random selection, just like the battle music

###July 26th, 2012
* Moved development to local, as C9 is being annoying

###July 27th, 2012
* Updated version of EaselJS, which fixed framerate drops in Firefox
* Got explosion sound working
