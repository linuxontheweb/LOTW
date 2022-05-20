# Linux on the Web (LOTW)

<p align="center">
  <img src="https://github.com/linuxontheweb/os/blob/main/img/screenshot.png">
</p>


## The Gist

LOTW is all about porting the Linux/Unix text-based command and configuration ethos into the
modern web environment. The desktop environment is minimal and very
configurable.  Out of the box, the only visible UI element (other than the
desktop) is the bar where minimized windows go.  It is essential that all tasks
can be accomplished via the keyboard (e.g.  resizing windows and changing icon
locations).

## YMMV

LOTW is developed in [the crouton environment](https://github.com/dnschneid/crouton),
which involves ChromeOS in developer mode.  All development and testing is currently done
on a Chromebook.

The system should basically work in any modern browser, but there are likely
many tiny glitches that degrade the user experience in other operating systems
and/or other browsers.

## Getting Started

First, clone this repo (duh)!

Then, start the server with nodejs (uses the default port, 8080):

`$ node server.js`

Finally, in your browser, go to: http://localhost:8080


Or if you want to use another port (e.g. 12345), start it like so:

`$ node server.js 12345`

Then, go to: http://localhost:12345

## Using the keyboard

This section particularly applies to the Chromebook keyboard layout. The main
differences with other layouts involve keys like Page Up, Page Down, Home and
End. Chromebooks don't have those keys, though the functions can be emulated
using combinations of Contrl, Alt and the Arrow keys.

### Desktop
- **Invoke the context menu**: Alt+c
- **Toggle taskbar visibility**: Ctrl+Alt+Shift+b
- **Toggle icon cursor visibility**: Ctrl+Alt+Shift+c
- **Open a terminal**: Alt+t

### Windows
- **Maximize window**: Alt+m
- **Minimize window**: Alt+n
- **Close window**: Alt+x
- **Fullscreen window**: Alt+f
- **Move window**: Shift+[arrow]
- **Resize window**: Ctrl+Shift+[arrow]
- **Toggle layout mode**: Ctrl+Shift+l
- **Toggle window chrome**: Ctrl+Shift+w

### Icons
- **Toggle icon selection status under the cursor**: Space
- **Select then open icon under the cursor**: Enter
- **"Auto open" icon under the cursor (like double clicking)**: Alt+Enter
- **"Drag select" icons under the cursor**: Ctrl+arrow
- **Move selected icons to cursor**: Ctrl+m
- **Delete selected icons**: Ctrl+Backspace


## Development

vim is the recommended text editor.

To see the folded rows in the source code, put these lines in your .vimrc:

	set foldmethod=marker
	set foldmarker=«,»
	set foldlevelstart=0

I like to use the Enter key to toggle folded rows (while in "normal" mode), so
I also have this line in .vimrc:

	nmap <enter> za


