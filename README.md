# Linux on the Web (LOTW)

<p align="center">
  <img src="https://github.com/linuxontheweb/os/blob/main/img/screenshot.png">
</p>


## YMMV

LOTW is developed in [the crouton environment](https://github.com/dnschneid/crouton),
which involves ChromeOS in developer mode.  All development and testing is currently done
on a Chromebook.

The system should basically work in any modern browser, but there are likely
many tiny glitches that degrade the user experience in other operating systems
and/or other browsers.

## Getting Started

First, start the server with nodejs (defaults to port 8080):

`$ node server.js`

Then, in your browser, go to: http://localhost:8080


If you want to use another port (e.g. 12345), start it like so:

`$ node server.js 12345`

Then, in your browser, go to: http://localhost:12345

## The Gist

LOTW is all about porting the Linux/Unix text-based command and configuration ethos into the
modern web environment. The desktop environment is minimal and very
configurable.  Out of the box, the only visible UI element (other than the
desktop) is the bar where minimized windows go.  It is essential that all tasks
can be accomplished via the keyboard (e.g.  resizing windows and changing icon
locations).

## Development

vim is the recommended text editor.

To see the folded rows, put these lines in your .vimrc:

	set foldmethod=marker
	set foldmarker=«,»
	set foldlevelstart=0
