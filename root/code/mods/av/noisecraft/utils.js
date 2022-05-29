
export function assert(condition, errorText){//«
/**
 * Assert that a condition holds true
 */
    if (!errorText)
        errorText = 'assertion failed';

    if (!condition)
    {
        throw new Error(errorText);
    }
}//»
export function escapeHTML(unsafe){//«
/**
 * Escape a string to be included in HTML
 */
    return (
        unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
    );
}//»
export function anyInputActive(){//«
/**
 * Check if any input element in the page is active
 */
    let ele = document.activeElement;
    return ele && (ele.tagName === 'INPUT' || ele.tagName === 'SELECT');
}//»
export function makeSvg(elName){//«
    return document.createElementNS("http://www.w3.org/2000/svg", elName);
}//»
export function getSvg(element, key){//«
    return element.getAttributeNS(null, key);
}//»
export function setSvg(element, key, val){//«
    element.setAttributeNS(null, key, val);
}//»
export function treeCopy(obj){//«
// Recursively copy a JSON tree data structure
    if (obj instanceof Array)
    {
        let newObj = new Array(obj.length);

        for (let i = 0; i < obj.length; ++i)
            newObj[i] = treeCopy(obj[i]);

        return newObj;
    }

    if (obj instanceof Object)
    {
        let newObj = {...obj};

        for (let k in obj)
            newObj[k] = treeCopy(obj[k]);

        return newObj;
    }

    return obj;
}//»
export function treeEq(a, b){//«
// Recursively compare two JSON tree data structures for equality
    if (a instanceof Array && b instanceof Array)
    {
        if (a.length !== b.length)
            return false;

        for (let i = 0; i < a.length; ++i)
        {
            if (!treeEq(a[i], b[i]))
                return false;
        }

        return true;
    }

    if (a instanceof Object && b instanceof Object)
    {
        // Compare all entries
        for (let k in a)
        {
            if (!(k in b))
                return false;

            if (!treeEq(a[k], b[k]))
                return false;
        }

        // a and b must have the same keys
        for (let k in b)
        {
            if (!(k in a))
                return false;
        }

        return true;
    }

    return a === b;
}//»
export function isObject(val){//«
/**
Test that a value is an object
*/
    return (typeof val === 'object') && (val !== null);
}//»
export function isString(val){//«
/**
Test that a value is a string
*/
    return (typeof val === 'string') || (val instanceof String);
}//»
export function isInt(val){//«
/**
Test that a value is integer
*/
    return (
        Math.floor(val) === val
    );
}//»
export function isNonNegInt(val){//«
/**
Test that a value is a nonnegative integer
*/
    return (
        isInt(val) &&
        val >= 0
    );
}//»
export function isPosInt(val){//«
/**
Test that a value is a strictly positive (nonzero) integer
*/
    return (
        isInt(val) &&
        val > 0
    );
}//»
export function randInt(a, b){//«
/**
Generate a random integer within [a, b]
*/
    assert (
        isInt(a) && isInt(b) && a <= b,
        'invalid params to randInt'
    );

    var range = b - a;

    var rnd = a + Math.floor(Math.random() * (range + 1));

    return rnd;
}//»
export function randIndex(len){//«
/**
Generate a random integer within [0, len[
*/
    return randInt(0, len-1);
}//»
export function randBool(){//«
/**
Generate a random boolean
*/
    return (randInt(0, 1) === 1);
}//»
export function randFloat(a, b){//«
/**
Generate a random floating-point number within [a, b]
*/
    if (a === undefined)
        a = 0;
    if (b === undefined)
        b = 1;

    assert (
        a <= b,
        'invalid params to randFloat'
    );

    var range = b - a;

    var rnd = a + Math.random() * range;

    return rnd;
}//»
export function randNorm(mean, variance){//«
/**
Generate a random value from a normal distribution
*/
	// Declare variables for the points and radius
    var x1, x2, w;

    // Repeat until suitable points are found
    do
    {
    	x1 = 2.0 * randFloat() - 1.0;
    	x2 = 2.0 * randFloat() - 1.0;
    	w = x1 * x1 + x2 * x2;
    } while (w >= 1.0 || w == 0);

    // compute the multiplier
    w = Math.sqrt((-2.0 * Math.log(w)) / w);

    // compute the gaussian-distributed value
    var gaussian = x1 * w;

    // Shift the gaussian value according to the mean and variance
    return (gaussian * variance) + mean;
}//»
export function randElem(array){//«
/**
Choose a random argument element of an array
*/
    assert (
        array.length > 0,
        'must supply at least one possible choice'
    );

    var idx = randInt(0, array.length - 1);

    return array[idx];
}//»
export function getBrightColor(key){//«
/**
Returns a hex string (with a preceding '#') that is a bright color.

If a key is provided, the same color will always be returned for that key.

If no key is provided, the returned color is randomly selected.
*/
    // Colors of the 12-band rainbow flag!
    let colors = [
        '#971c93',
        '#5124cd',
        '#0551ff', // Bright blue
        '#009393',
        '#00fa00',
        '#cbfa00',
        '#fefb00',
        '#fec802',
        '#ff9501',
        '#ff5004',
        '#fe2204',
        '#d81d52'
    ];

    if (isString(key))
        return colors[hash(key) % colors.length];
    else
        return colors[key % colors.length];
}//»
export function plotFn(fn, xMin, xMax, canvasId){//«
/**
Plot a single-variable function on a canvas
*/
    var canvas = document.getElementById(canvasId);
    var ctx = canvas.getContext("2d");

    var numPts = canvas.width;

    var xs = [];
    var ys = [];

    for (var i = 0; i < numPts; ++i)
    {
        var x = xMin + (i / (numPts - 1)) * (xMax - xMin);
        var y = fn(x);
        xs.push(x);
        ys.push(y);
    }

    var yMin = Math.min(...ys);
    var yMax = Math.max(...ys);

    console.log(yMin);
    console.log(yMax);

    ctx.strokeStyle="#FF0000";

    for (var i = 0; i < ys.length; ++i)
    {
        var x = xs[i];
        var y = ys[i];
        var relX = (x - xMin) / (xMax - xMin);
        var relY = (y - yMin) / (yMax - yMin);
        var cX = canvas.width * relX;
        var cY = canvas.height * (1 - relY);

        if (i < 80)
            console.log('i=', i, 'y=', y, 'cY=', cY);

        if (i == 0)
        {
            ctx.moveTo(cX, cY);
        }
        else
        {
            ctx.lineTo(cX, cY);
            ctx.stroke();
        }
    }
}//»
export function hash(str){//«
/**
Hash a string into a non-negative integer.

Uses the DJB2 algorithm.
*/
    let hash = 5381;
    for (let i = 0; i < str.length; i++)
    {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }

    return hash >>> 0;
}//»

