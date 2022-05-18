# Linux on the Web (LOTW)

## YMMV

LOTW is developed in [the crouton environment](https://github.com/dnschneid/crouton), which involves ChromeOS put into developer mode. 
All development and testing is therefore currently done in Chrome on a Chromebook.

The system should "basically" work in any browser, but there are probably tons of tiny glitches 
that degrade the user experience in other operating systems and/or other browsers.

## Getting Started

First, start the server with nodejs (defaults to port 8080):

`$ node server.js`

Then, in your browser, go to: http://localhost:8080


If you want to use another port (e.g. 12345), start it like so:

`$ node server.js 12345`

Then, in your browser, go to: http://localhost:12345


