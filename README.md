# Linux on the Web (LOTW)

<p align="center">
  <img src="https://github.com/linuxontheweb/os/blob/main/img/screenshot.png">
</p>


## The Gist

LOTW is all about porting the Linux/Unix text-based command and configuration
ethos into the modern web environment. The desktop environment is minimal and
very configurable.  Out of the box, the only visible UI element (other than the
desktop) is the bar where minimized windows go.  It is essential that all tasks
can be accomplished via the keyboard (e.g. resizing windows and changing icon
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
using combinations of Control, Alt and the Arrow keys.

### Desktop
- **Open a terminal**: Alt+t
- **Invoke the context menu**: Alt+c
- **Toggle taskbar visibility**: Ctrl+Alt+Shift+b

### Windows
- **Maximize window**: Alt+m
- **Minimize window**: Alt+n
- **Close window**: Alt+x
- **Fullscreen window**: Alt+f
- **Move window**: Shift+[arrow]
- **Resize window**: Ctrl+Shift+[arrow]
- **Toggle layout mode**: Ctrl+Shift+l
- **Toggle window chrome**: Ctrl+Shift+w
- **Cycle through open windows**: Alt+\`

### Icons
- **Toggle icon cursor visibility**: Ctrl+Alt+Shift+c
- **Toggle icon selection status under the cursor**: Space
- **Select then open icon under the cursor**: Enter
- **"Auto open" icon under the cursor (like double clicking)**: Alt+Enter
- **"Drag select" icons under the cursor**: Ctrl+arrow
- **Move selected icons to cursor**: Ctrl+m
- **Delete selected icons**: Ctrl+Backspace


## Development

### Project structure

**README.md**: This file.

**server.js**: The main service for sending core LOTW system files to the client.

**bin**: Folder where scripts related to the development and maintenance of the LOTW project are kept.

**howto**: Folder where instructions related to the development and maintenance of the LOTW project are kept.

**img**: Folder where images to be shown in the project documentation are kept.

**root**: Folder where essential client-side files of the LOTW system are kept.

**svcs**: Folder where any kind of service to extend the system's functionality (such as
sending and receiving email) are kept. Each service is to be run as an independent nodejs server
on an available port.

**www**: Folder where static assets to be used in the website (external to the LOTW system) are kept.

### Viewing and editing files

vim is the recommended text editor.

To see the folded rows in the source code, put these lines in your .vimrc:

	set foldmethod=marker
	set foldmarker=«,»
	set foldlevelstart=0

I like to use the Enter key to toggle folded rows (while in "normal" mode), so
I also have this line in .vimrc:

	nmap <enter> za

In order to quickly insert fold markers into the code file, I also use the following mappings.

This inserts an open fold marker, invoked with Alt+o:

	execute "set <M-o>=\eo"
	nnoremap <M-o> a//«<esc>
	inoremap <M-o> //«

This inserts a close fold marker, invoked with Alt+c:

	execute "set <M-c>=\ec"
	nnoremap <M-c> a//»<esc>
	inoremap <M-c> //»

This inserts an open and close fold marker, with a space in between, invoked with Alt+f:

	execute "set <M-f>=\ef"
	nnoremap <M-f> a//«<enter><enter>//»<esc>
	inoremap <M-f> //«<enter><enter>//»



