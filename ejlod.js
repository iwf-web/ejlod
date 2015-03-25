/**
 * EJLOD (ExtJs LOcale Debug) - a simple nodejs script to debug ExtJS locales
 * ==========================================================================
 *
 * ## Intent
 *  this script helps to find missing locale definitions in an ExtJS framework
 *
 *  ## Usage
 *  put the script in the directory with the locale files (in ExtJS5 at "packages/ext-locale/build")
 *
 *  call the script with nodejs with at least 2 parameters which represent file names from the locale directory
 *  - the first parameter is the master locale file
 *  - all subsequent parameters are slave locale files which are compared to the master
 *
 * ## Examples
 * -to debug German with English as master locale call `nodejs ejlod.js ext-locale-en-debug.js  ext-locale-de-debug.js`
 * -to debug all languages with English as master locale call `nodejs ejlod.js ext-locale-en-debug.js *-debug.js | less`
 *
 * ## Remarks
 *  1. The code at the beginning of the locale files within the Ext.onReady block (e.g. for Date) is ignored as of now
 *  2. The script just checks whether the overrides are set in both files, not whether they are "correct" translations
 *  3. Beware that the master may still miss overrides, e.g. MultiSelector & MultiSelectorSearch still miss translation
 *     overrides in all locales in ExtJS 5.1.0, see [this bug](http://www.sencha.com/forum/showthread.php?288009)
 *  4. There's certainly room for improvements; don't hesitate to improve. add your name and increase the version below
 *
 *
 * ## Metadata
 *
 *  @license: MIT license
 *  @version: 0.1
 *
 *  @author: Pat Mächler <p.maechler@iwf.ch>
 *  @since: 2015-03-25
 *
 *  // add your name and a "since" here if you make improvements; don't forget to update the version number :-)
 **/


Master = {};

Ext = {
    onReady: function(){}, //not debugged yet
    define: function(name,object){
        var key = object.override;
        Master[key] = {};
        for (var index in object) {
            var val = object[index];
            Master[key][index] = val;
        }
    },
    defineAlt: function(name,object){
        var key = object.override;
        Compare[key] = {};
        for (var index in object) {
            var val = object[index];
            Compare[key][index] = val;
        }
    },
    doCompare: function(){
        //console.log(Master,Compare);
        for (var index1 in Master){
            var val1 = Master[index1];
            //console.log(index1);
            if (Compare[index1]) {
                for (var index2 in val1) {
                    //console.log("  ",index2)
                    var val2 = val1[index2];
                    if (Compare[index1][index2]) {
                        //console.log()
                        //console.log("OK",index1, index2, val2,"=",Compare[index1][index2])
                    } else {
                        console.log("OVERRIDE NOT FOUND IN SLAVE FOR PROPERTY",index1+"."+index2);
                        console.log("Value from Master = ");
                        console.log(val2);
                        console.log("---------------------------");
                    }
                }
            } else { //object is not overridden
                console.log("OVERRIDE NOT FOUND IN SLAVE FOR OBJECT",index1);
                console.log("Value from Master = ");
                console.log(val1);
                console.log("---------------------------");
            }
        }
        for (var index1 in Compare){
            var val1 = Compare[index1];
            //console.log(index1);
            if (Master[index1]) {
                for (var index2 in val1) {
                    //console.log("  ",index2)
                    var val2 = val1[index2];
                    if (Master[index1][index2]) {
                        //console.log()
                        //console.log("OK",index1, index2, val2,"=",Compare[index1][index2])
                    } else {
                        console.log("OVERRIDE NOT FOUND IN MASTER FOR PROPERTY",index1+"."+index2);
                        console.log("Value from Slave = ");
                        console.log(val2);
                        console.log("---------------------------");
                    }
                }
            } else { //object is not overridden
                console.log("OVERRIDE NOT FOUND IN MASTER FOR OBJECT",index1);
                console.log("Value from Slave = ");
                console.log(val1);
                console.log("---------------------------");
            }
        }
    }
};


process.argv.forEach(function (val, index, array) {
    if (index<2) { //parameters we don't care about
        //nop;
    } else if (index===2) { //this is the master locale language

        console.log("Master locale:",val,"\n");
        require('./'+val);
        //override original function
        Ext.define = Ext.defineAlt;
    } else {
        Compare = {}; //reset Compare object
        //console.log(index + ': ' + val);
        console.log("==========================");
        console.log(val);
        console.log("==========================");
        require('./'+val);
       Ext.doCompare();
    }
});

