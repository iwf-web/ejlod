EJLOD (ExtJs LOcale Debug) - a simple nodejs script to debug ExtJS locales
==========================================================================

## Intent
this script helps to find missing locale definitions in an ExtJS framework

## Usage
put the script in the directory with the locale files (in ExtJS5 at "packages/ext-locale/build")

call the script with nodejs with at least 2 parameters which represent file names from the locale directory

* the first parameter is the master locale file
* all subsequent parameters are slave locale files which are compared to the master

## Examples
* to debug German with English as master locale call `nodejs ejlod.js ext-locale-en-debug.js  ext-locale-de-debug.js`
* to debug all languages with English as master locale call `nodejs ejlod.js ext-locale-en-debug.js *-debug.js | less`

## Remarks

 1. the code at the beginning of the locale files within the Ext.onReady block (e.g. for Date) is ignored as of now
 2. the script just checks whether the overrides are set in both files, not whether they are "correct" translations
 3. beware that the master may still miss overrides, e.g. MultiSelector & MultiSelectorSearch still miss translation
    overrides in all locales in ExtJS 5.1.0, see [this bug](http://www.sencha.com/forum/showthread.php?288009)
 4. there's certainly room for improvements; don't hesitate to improve. add your name and increase the version below