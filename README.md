### app
---
cue allows for users to easily manage tasks like times to study and tasks like homework or projects.

#### features:
Spaced repetition reminder: this feature allows for users to set reminders for specific subjects, use nebius integration to generate quick notes, and use ai to set up the best time to review based off of user response.
Task list: allows users to set times for tasks to do and will notify them at that time. They can also use the ai assistant to help prioritize tasks to finish work more efficiently

#### installation:
Need to have latest version of node js installed.
first either install the folder from the github page or clone the repository and enter the file using

`git clone https://github.com/retekant/cue.git 
cd cue`

then install npm through npm install

then, create a file called ".env.local" there should only be one line. it should be `nebius_api_key=yourkey`. replace yourkey with your nebius api key.

finally, start the application using `npm run dev`
