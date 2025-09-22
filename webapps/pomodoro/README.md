# Pomodoro-timer

This is just a really simple Pomodoro-timer, nothing special in this other than I made this from the ground up myself (mostly)!!!!
Yeah I had to use co-pilot a little, but it's automatically giving me suggestions and well... it's a little good at them. I'll be doing something to somehow stop those autosuggestions though, it's annoying in my opinion.

And, in case you haven't noticed... I dont know how to write proper README's. My experience is **very** limited...

url: chefyeshpal.github.io/webapps/pomodoro/index.html 
(I'm not a master coder or anything, seriously...)

## Where was AI used?

- I mainly used it for javascript, as my knowledge is rather... bad.
- It was also used in code review, and for just understading some stuff in CSS, I tried to put a time limit of 2 hours on this project and I really needed it to be done...
- No where else really.

The main point of this project was to just test my CSS skills, as it's been some time since I did new things other than just update my own website. Plus, I wanted to try to increase my productivity.
By the way, this is a little inspired from ```pomofocus.io```, I had been using their website since covid-19 (2019 hm...) and it's pretty good. I also wanted to include some "insights" or some kind of a similar section in my own website, but I guess it's a little hard to do that cause I have absolutely no clue how to store that data in the "cookies" of the browser and all that... Hopefully I learn it soon enough though :D

Update: I'm using ai for the stuff I dont understand, which still includes most of js. But I'm trying to ask for snippets of code as "Examples" and trying to integrate them with my actual code

## Stuff That works here

- Basic timer functionality where it counts down from a user given number (in minutes) towards 00:00
- Timer working accurately even in the background, processes aren't put in inactive mode (can make countdown inaccurate)
- Colour changes based on mode (work or break)
- Task's can be created, edited, completed and deleted
- Number of pomodoro's shown, 1 pomodoro = worktime + breaktime
- Gravity toggle
- A clock that shows Union Standard Time (with a little wonkey thing, wait for the second hand to run out)

## Stuff I wanted to add

- A way to track your progress
  - Couldn't add this because it would probably require some kind of a storage for the data, I'm really hosting this on my github website so I dont think I'd wanna do it.
- Use better colours
  - The current ones look a little... weird, I'm looking into colour theory for my future projects
- Make the gravity toggle better
  - Currently the stat bar is kind of locked to the central position, it's probably a very easy fix but I've kind of run out of my given time (and I'm lazyyy)
- Add an easter egg
  - I did add some but I dont think it'll be considered one... that's if they're a lazy procastinator like me :p

## Changelog

- 18 September 2025
  - Added a progress bar in the top
  - Made it so that pressing enter on keyboard also saves your config in the edit session window, before you had to move the mouse *all* the way over to the "save" button and click.
  - Added feature of sending notification after the timer ends, with subtitles.
- 19 September 2025
  - Added a stats box and button
    - Stats do show up, added a temp function to check if it shows up. Will need to test it out tomorrow
    - Y axis has work, short break, and long break
    - X axis has time, from 0 to 24.
    - Apparently this type of chart is called a "gantt-style chart"
    - I wont bother with makeing it so that it stores "yearly" and "weekly" and "monthly" data... probably.
  - Added data tracking
    - Basically, it'll store the pomodoro's and a few more data things in the local storage.
  - Updated styles.css so that it gives a multi-row chart layout.
    - Red is work time
    - Blue is short break
    - Green is long break
  - Added proper comments so that I can check and read though the code even if I decide to abandon this project and pick it back up after a few months.
  - Updated css a bit, not many visual changes. Just mainly for the analysis button.
- 20 September 2025
  - Added "reset" button in edit session dialogue
    - Basically it just resets everything, including the pomodoro sessions, and duration of the user set sessions (if any)
  - Updated gravity toggle
    - It used to become center aligned after untoggling, so changed the js a bit so that it doesn't center align after untoggle. Was encountering this problem with the stats button as well.
    - Has better, more fluid animation for it when the elements are falling or going back to their original position after untoggle
  - Updated position of stats button
    - It would clip under the progress bar after untoggling the gravity, couldn't figure out how to not get that to happen so just changed the top padding to 20px
    - Wouldn't work if I placed the stat button div above the progress bar in [[index.html]], that's because it'll not be a part of the elements which'll drop when gravity comes...
  - Stat button seems to work, but seems like it isn't storing the data for the pomodoro's when manually done. I had created a function to test out with pre test data, but seems like I'll need to change and work on it a bit more to figure out where things got wonky. 
    - Running "generateFakeSessions()" in the console seemed to work, but seems like it doesn't log the time in real time use.
    - Probably need to do some dialogue or something for localstorage? I dont know what I missed, so It'll take a few hours maybe...
- 22 September 2025
  - Moved all the js code for stat's tracking and charting from main.js to stats.js, should make it more organised.
  - Added debugging tool: window.checkStoredSessions()
    - Can be used to inspect stored session data
  - Time tracking works properly now, and shows up on the stats page
    - Had to add completeCurrentSession() function to properly end sessions
    - Also improved startSession() to automatically end any existing incomplete session (dunno why I'd need it, but felt like it would help in the long run)
  - Modified nextStage() funct
    - Instead of calling stopTimer() which ends the session, I made it directly handle the timer cleanup and call completeCurrentSession()
    - This should make it properly end the current session (wether it be work or break)
  - Added console updates to be able to view if console registers sessions starting. Should also help in timekeeping?
  - Should show start time end time for sessions in the bar graph when mouse is hovering over them
  - Added filters in stats dialogue, so it should now show hourly, quaterly (6 hours), half-day (12 hours) and full (24 hours) for easier looking into if it's working or not
    - Also made it so that the bar glows a bit when I hover my mouse over it
  - Added gray areas to tell what amount of time you have skipped in work and break