
The heart of the LOTW system lies under this folder heirarchy. 

## code

The contents of the code subfolder are opaque to the end user, and can only be
seen by developers, whether on the host system's command line, or inspecting
files in developer tools.

## bin

The bin subfolder is where developers can put command line utilities that are
automatically mounted in LOTW's /bin folder upon system startup (i.e. loading
the web page). The name of the command available to the LOTW CLI is just the
filename, with the *.js* extension removed. For example, the contents of the file
at bin/dummy.js can be viewed in LOTW by opening a terminal (Alt+t) and running
the command:

	$ cat /bin/dummy

The "dummy" command can then be invoked like so:

	$ dummy

## etc

The etc subfolder is where things like default configuration files and initialization scripts 
can go.

