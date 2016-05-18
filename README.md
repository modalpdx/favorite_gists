# favorite_gists

This is a school project that makes heavy use of Ajax to query Github "gists" and build/maintain a local listing of favorites. 

##How it works

Before going on, I will apologize in advance for the appearance of the
page. This assignment focused on functionality, not styling.

The initial view is split into two horizontal sections: the top contains a
"favorites" listing (empty on first-load) and the bottom contains a search
form where you can select topics to query and the number of pages of
results to return. 

After making your selections, hit the search button and a listing of gists that match the query will be presented. Each line in the listing contains three items: the title for the gist (doubles as a link that points back to the gist's webpage), the category, and a button that you can use to favorite the gist. If you click the favorite button, the gist will be removed from the search result listing and moved up to the favorites section. When the gist is moved, the favorite button changes to a remove button. Clicking remove will remove the gist from your favorites.

##Options for running this

There are two ways this can be run: either via the Internet or locally
using the "gists#" files included in this repo. Either way is fine as they
both provide similar JSON source material to the query. There is commented
code in the getUrl() function in functions.js that needs to be uncommented
to run locally. Comment out the two lines of code below "FOR PRODUCTION"
if you want to test locally.


##Disclaimer

This is code from a school project. It satisfies assignment requirements
but is nowhere near as "scrubbed" as released software should be.
Security is not addressed, only functionality and no input
validation. If you use this code for anything other than satisfying your
curiosity, please keep the following in mind:

- there is no warranty of any kind (you use the code as-is)
- there is no support offered, please do not ask
- there is no guarantee it'll work, although it's not complex so it should
  work
- please do not take credit for code you did not write, especially if you
  are a student. NO CHEATING.

Thanks!
