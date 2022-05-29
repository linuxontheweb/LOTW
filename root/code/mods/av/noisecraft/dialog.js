
import { Eventable } from './eventable.js';

export class Dialog extends Eventable{//«
/**
Create a modal dialog popup showing content wrapped in a div
*/
    constructor(title, main){//«
        super();

        // Div that wraps the dialog
        this.wrapperDiv = document.createElement('div');
this.wrapperDiv.style.cssText=`
color: #fff;
    z-index:3;
    width: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #666;
    border: 2px solid #AAA;
    padding: 10px;
    font-family: monospace
`;
//        this.wrapperDiv.className = 'dialog';
/*
*/
        // Form title
        let titleDiv = document.createElement('div');
//        titleDiv.className = 'dialog_title';
titleDiv.style.cssText=`
    font-size: 24px;
    font-family: sans-serif;
    text-align: center;
    margin-top: 4px;
    margin-bottom: 10px;
`;
        titleDiv.appendChild(document.createTextNode(title));
        this.wrapperDiv.appendChild(titleDiv);

        // Div to host the dialog contents (text, inputs, buttons, etc).
        this.div = document.createElement('div');
//console.log(this.div);
//this.div.style.cssText=`
//font-size: 18px;
//`;
        this.wrapperDiv.appendChild(this.div);

        // Form validation error message (hidden by default)
        this.errorDiv = document.createElement('div');
//        this.errorDiv.className = 'form_error';
this.errorDiv.style.cssText=`
    display: none;
    margin-top: 6;
    margin-bottom: 6;
    padding-bottom: 2;
    color: #F00;
    background: #333;
    text-align: center;
    font-size: 18px;
`;
        this.wrapperDiv.appendChild(this.errorDiv);

        // Used to detect/prevent clicks outside dialog
        this.bgDiv = document.createElement('div');
//        this.bgDiv.className = 'dark_overlay';
this.bgDiv.style.cssText=`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.80);
    z-index: 2;
`;
        this.bgDiv.onclick = bgClick.bind(this);

        // Add the form to the document
//        var body = document.getElementsByTagName("body")[0];
		this.body = main;
		let body = main;
        body.appendChild(this.wrapperDiv);
        body.appendChild(this.bgDiv);
//console.log(body);
        function bgClick(evt)
        {
            this.trigger('userclose');
            this.close();
            evt.stopPropagation();
        }

        function keyHandler(evt)
        {
            this.trigger('keydown', evt.key);

            // Trigger a special handler for the enter key
            if (evt.key === "Enter")
            {
                this.trigger('enter');
            }

            // Close the dialog when the escape key is pressed
            if (evt.key === "Escape")
            {
                this.trigger('userclose');
                this.close();
            }
        }

        this.keyHandler = keyHandler.bind(this);
//        body.addEventListener('keydown', this.keyHandler);
//		main.dialog = this;
    }//»

    appendChild(node){//«
    /**
     * Shorthand method to add elements to the dialog contents
     */
        this.div.appendChild(node);
    }//»

    paragraph(html){//«
    /**
     * Append a new paragraph
     */
        let text = document.createElement('p');
        text.innerHTML = html;
        this.appendChild(text);
    }//»

    // TODO: method to create a named button with the right styling

    showError(msg){//«
    /**
     * Show an error message (e.g. for form validation)
     */
        this.errorDiv.textContent = msg;
        this.errorDiv.style.display = 'block';
    }//»

    hideError(){//«
    /**
     * Hide the form error message
     */
        this.errorDiv.style.display = 'none';
    }//»

    close(){//«
    /**
     * Close the dialog window
     */
//        var body = document.getElementsByTagName("body")[0];
		let body = this.body;

        if (!body.contains(this.wrapperDiv))
            return;

        body.removeChild(this.wrapperDiv);
        body.removeChild(this.bgDiv);
        body.removeEventListener('keydown', this.keyHandler);

        this.trigger('close');
    }//»

}//»

export function errorDialog(message){//«
/**
 * Show a dialog with an error message and an Ok button
 */
    let dialog = new Dialog('Error');

    dialog.paragraph(message);

    let saveBtn = document.createElement('button');
    saveBtn.textContent = 'Ok';
//    saveBtn.className = 'form_btn';
saveBtn.style.cssText=`
    margin-top: 4;
    margin-right: 4;
`;
    saveBtn.onclick = () => dialog.close();
    dialog.appendChild(saveBtn);

    return dialog;
}//»

