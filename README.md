# Voting App

This application is a simple web app that allows users to vote for candidates, store results in Firebase, and display the voting results. It also features a reset function to clear votes and show the vote count for each candidate.

## Project Structure

```
.
├── index.html            # Main HTML file containing the application interface
├── app.js                # Main JavaScript file handling voting logic and Firebase
├── firebase-config.js    # Firebase configuration file and connection initialization
├── style.css             # Custom CSS file for styling the interface
└── README.md             # Documentation file describing the project
```

## Main Components

### 1. `index.html`

The `index.html` file contains the HTML interface for the application, including voting buttons, a reset vote button, and the display of voting results for each candidate.

#### Key Elements:
- **Voting Buttons**: Buttons that allow users to vote for each candidate (A, B, C).
- **Reset Vote Button**: Allows users to clear their selected vote.
- **Vote Results**: Displays the vote count and percentage of votes for each candidate.

### 2. `app.js`

The `app.js` file contains the main logic of the application, including functions for voting, updating results, and resetting votes.

#### Key Functions:
- **`voteForCandidate(candidate)`**: Function that allows users to vote for a candidate. It checks if the user has already voted (using `localStorage`) to prevent multiple votes.
- **`updateResults()`**: Function that updates the voting results and displays the chart.
- **`resetVote()`**: Clears the user's vote and refreshes the voting data.
- **`showConfirmation(candidate)`**: Displays a thank you message after a successful vote.

### 3. `firebase-config.js`

The `firebase-config.js` file contains the configuration and initialization for Firebase. This file holds sensitive information such as `apiKey`, `authDomain`, `projectId`, etc., and is called from `app.js` to connect to Firebase.

#### Firebase Configuration Components:
- **apiKey**: The Firebase API key for connecting to the project.
- **authDomain**: The authentication domain of the Firebase project.
- **projectId**: The ID of the Firebase project.

#### Hiding Firebase Configuration:
You should use environment variables or secret management from the deployment platform to protect these sensitive details.

### 4. `style.css`

The `style.css` file contains custom CSS styles to create a user-friendly interface.

#### Main Classes:
- **`.button`**: Common design for buttons, ensuring a consistent interface.
- **`.result`**: Design for the results display area.
- **`.confirmation`**: Design for the thank-you message displayed after voting.

## Firebase Setup

1. Create a new project on the [Firebase Console](https://console.firebase.google.com).
2. Enable the Authentication service in Firebase and turn on the anonymous sign-in option.
3. Configure Firestore access rules with appropriate Security Rules to ensure security.

## How to Run the Application

1. **Set Up a Local Server**: You can run the application with a local server such as [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code or use a Python server:
   ```bash
   python3 -m http.server
   ```
   Access the app at `http://localhost:8000`.

2. **Set Up Firebase**: Ensure you have added the Firebase configuration to `firebase-config.js`.

3. **Open the Application**: From `index.html`, the app will automatically load the scripts and connect to Firebase.

## Notes

- Firebase configuration details should not be left directly in the source code when deployed. Use environment variables or security methods when necessary.
- Ensure Firebase Security Rules are tightly configured to prevent unauthorized access.

## References

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
