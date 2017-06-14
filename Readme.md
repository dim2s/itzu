Itzu a Modern configuration tool
==================================

Itzu is a modern solution to generate test sequence for Automation software(AVL PUMA, FEV Morphee, etc.). By modern, I mean Itzu is a single page application written in HTLM5+javascript+css. The only thing you need to run the application is a compatible browser. 

Itzu comes with these features:
- Easy to use
- Export/Import test sequence in CSV format
- Excel like Autofill features
- Autocompletion
- Activate/De-activate operating point
- Operating point automatic generation
- setvalues handling
- multi-selection of operating point or setvalues 

Compatible Browser
-------------------

For now it has been test on:
- Chrome
- firefox
- IE11 

Itzu should also work out of the box on edge or safari, but it has not been test on this browsers yet. If you have any issue with safari or Edge please let us know.

How to use Itzu
----------------

### Add some operating points

Without operating point there is no test sequence. So your first step should be to add at least one operating point.
There is several ways to achieve this goal:
1- Add operating points manually
2- Use the wizard
3- Import an Itzu generated CSV

### Add some setvalues

Each setvalue is linked to one or several operating point.
You have to select an operating point first, than you can add some setvalues to this operating point.
If you select several operating point, the setvalue will be link to all selected operating points.

### Merge some setvalues

A new setvalue is linked to an operating point. 
If you want to apply the value to all existing operating points, you must use the merge all button.

### Edit setvalue

### Remove setvalue

### Label config

### Add operating point

### Remove operating point

### Edit operating point

### Activate operating point

### Select/Deselect operating point

### Export CSV

Contributing
-------------

To discuss a new feature or ask a question, open an issue. To fix a bug, submit a pull request to be credited with [contributors](https://github.com/dim2s/itzu)!
