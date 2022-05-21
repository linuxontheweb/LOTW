# Linux on the Web (LOTW)

<p align="center">
  <img src="https://github.com/linuxontheweb/os/blob/main/img/screenshot.png">
</p>

## Concepts

### The Gist

LOTW is all about porting the Linux/Unix text-based command and configuration
ethos into the modern web environment. The desktop environment is minimal and
very configurable.  Out of the box, the only visible UI element (other than the
desktop) is the bar where minimized windows go.  It is essential that all tasks
can be accomplished via the keyboard (e.g. resizing windows and changing icon
locations).

### Your files are locally stored

Everything that I've ever seen that called itself a "web-based operating
system" never seemed to have any real concept of *local state*. With LOTW,
however, *local state* is really the name of the game. For example, performing
the following simple operation in the terminal application indeed creates
an entry at `~/file.txt`, held in the browser's sandboxed local storage, accessible 
regardless of network status.

	~$ echo "A bunch of interesting thoughts" > file.txt


## Disclaimer (YMMV)

LOTW is developed in [the crouton environment](https://github.com/dnschneid/crouton),
which involves ChromeOS in developer mode.  All development and testing is currently done
on a Chromebook.

The system should basically work in any modern browser, but there are likely
many tiny glitches that degrade the user experience in other operating systems
and/or other browsers.

## Getting Started

First, clone this repo (duh)!

Then, start the server with nodejs (uses the default port, 8080):

`$ node site.js`

Finally, in your browser, go to: http://localhost:8080


Or if you want to use another port (e.g. 12345), start it like so:

`$ node site.js 12345`

Then, go to: http://localhost:12345

## Desktop usage

### The taskbar

The visibility of the taskbar at the bottom of the screen can only be toggled
via the keyboard shortcut, **Toggle taskbar visibility** (shown below). The
taskbar currently only exists as a place to hold minimized windows. If the
taskbar is showing, then the windows held in it are kept in the window stack.
This means that they can be accessed by the **Cycle window stack** keyboard
shortcut. However, if the taskbar is not showing, then the windows held by it
are considered to be in a "backgrounded" state, i.e., they are no longer in the
window stack, and cannot be accessed by the keyboard shortcut. The taskbar
*must* be brought back into view in order to regain access to them.

### Keyboard shortcuts

This section particularly applies to the Chromebook keyboard layout. The main
differences with other layouts involve keys like Page Up, Page Down, Home and
End. Chromebooks don't have those keys, though the functions can be emulated
using combinations of Control, Alt and the Arrow keys.

**Desktop**
- Open terminal: Alt+t
- Invoke context menu: Alt+c
- Toggle taskbar visibility: Ctrl+Alt+Shift+b

**Windows**
- Maximize window: Alt+m
- Minimize window: Alt+n
- Close window: Alt+x
- Fullscreen window: Alt+f
- Move window: Shift+[arrow]
- Resize window: Ctrl+Shift+[arrow]
- Toggle layout mode: Ctrl+Shift+l
- Toggle window chrome: Ctrl+Shift+w
- Cycle window stack: Alt+\`

**Icons**
- Toggle icon cursor visibility: Ctrl+Alt+Shift+c
- Toggle icon selection status under cursor: Space
- Select then open icon under the cursor: Enter
- "Auto open" icon under cursor (like double clicking): Alt+Enter
- "Drag select" icons under cursor: Ctrl+arrow
- Move selected icons to cursor: Ctrl+m
- Delete selected icons: Ctrl+Backspace


## Command line usage

Other than high level control flow structures (like if..then and for..in), the
syntax of standard \*nix-compatible shells should mostly work. It is easiest to
provide working examples that showcase the particular capabilities of the LOTW
system. Those are forthcoming.


## Development

### Project structure

**site.js**: The main nodejs service for sending core system files (in **root/**) to the client.

**bin/**: Folder where scripts related to the development and maintenance of the project are kept.

**howto/**: Folder where instructions related to the development and maintenance of the project are kept.

**img/**: Folder where images to be shown in the project documentation are kept.

**root/**: Folder where essential client-side files of the LOTW system are kept.

**svcs/**: Folder where any kind of service to extend the system's functionality (such as
sending and receiving email) are kept. Each service is to be run as an independent nodejs server
on an available port.

**www/**: Folder where static assets to be used in the website (external to the LOTW system) are kept.

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



