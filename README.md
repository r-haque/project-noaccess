# Hexagon Security

Developed by the _NoAccess_ team.

## Project URL

-   [Web App](https://hexagon-web.xyz)
-   [Extension (requires local install)](https://github.com/UTSCC09/project-noaccess/releases)

## Project Video URL

[Link](https://youtu.be/O-1TdzbnZj8)

## Project Description

_Hexagon Security_ is a browser-centric security tool, capable of managing a user’s secure data
including passwords, MFA keys, and notes. As part of this tool, there is a website to manage data,
along with a chrome extension to facilitate quick actions such as saving/autofilling passwords and
adding MFA keys to their profile. In addition, this tool supports a few auxiliary features,
providing users with information about their password strength/breaches and allows sharing any
slice of their data with other users. _Hexagon_ supports all of these features while maintaining
a fully secure environment. The entirety of a user's data is ultimately encrypted using their
password, even preventing the development team from viewing the data.

-   **Supported Features:**
    -   Web App
        -   User authentication (sign up / sign in / sign out)
        -   Add / view / change / delete website credentials
        -   Add / change / delete MFA credentials
        -   Add / view / change / delete notes
        -   View the password strength for a website credential and determine whether it was part
            of a data breach
        -   View an MFA credential and generate TOTP tokens
        -   Change the master password for a _Hexagon_ account
        -   Import passwords from a CSV file
        -   Share any website credential / MFA credential / note with another user and send an email
            with the invite
        -   Accept / decline share invitations sent by another user
        -   Revoke access to a shared item from any user
    -   Chrome Extension
        -   User authentication (sign in via web app / native sign out)
        -   Automatically save / autofill account information for a website at sign in
        -   View / update / delete website credentials associated to the current website
        -   Generate a random secure password for a website
        -   Evaluate a password's strength
        -   Add a MFA credential for the current website

## Development

There are 3 main components for this project: frontend, backend and chrome extension. Each component
is configured with their own `NPM` project and their own `package.json` to manage libraries.
In addition to these main components, we make use of `Yarn` package manager and their workspaces
feature in order to share code across all 3 components using the `shared` component.

This component is just miscellaneous services and utilities written in JavaScript and upgraded to
TypeScript. All 3 main components make use of the `shared` component and in turn make use of
the `WebCrypto` library to encrypt/decyrpt the user's data when needed. We make use of the `PKDBF2`
algorithm to generate keys from secrets, `AES-GCM` to encrypt user-uploaded data and `AES-KW` to
encrypt keys associated to the user-uploaded data. All keys are 256-bit. In addition, this component
uses the `psl` library to extract domains from URLs.

The main components are developed as follows:

-   **Frontend**
    -   The frontend uses the `React` framework with `TypeScript`, `HTML` and `SCSS`. A `React-Redux-TypeScript`
        template was used initially to bootstrap the project.
    -   Libraries
        -   `mui` for component building
        -   `reduxjs` to manage app state and dispatch events
        -   `react-router` to manage routing
        -   `@shopify/react-web-worker` to create and manage a web web worker to handle cryptographic functions
        -   `@apollo/client` and `graphql` to make queries to the GraphQL server on the backend
        -   `totp-generator` to generate TOTP tokens for MFA credentials
        -   `zxcvbn` to evaluate password strength
    -   Third party APIs
        -   `Clearbit` to show logos for user credentials
        -   `Have I Been Pawned` to detect compromised passwords
    -   Security
        -   The frontend is resilient to attacks as all data injected into the DOM is made HTML-safe
            by React and tested by us to ensure infallibility. We deliberately made the decision to avoid
            using cookies of any sort so as to decrease our attack surface and instead stored all data
            in memory. As a result, a user's session only lasts as long as they do not leave the
            website. This also ensures that forgetting to sign out does not leave room for unauthorized
            users to view the original user's credentials on a shared computer. We do however make use
            of local storage to store the last user's email but this itself is not enough to use our
            app and security is maintained.
-   **Backend**
    -   The backend uses `Node.js` in `JavaScript` with the `Express` framework. It also makes use of
        `GraphQL` for its API, `MongoDB` as its database and `Redis` as an in-memory data store. The database
        stores all uploaded data related to the user, encrypted. The only unencrypted data stored on
        the server is the user's email and website names. The association between a user's uploaded data
        and their email is also encrypted and is only uncovered and stored in the form of a JWT,
        on sign in. We make use of `Redis` as a JWT blacklist to prevent the use of signed out tokens and
        provide future ability to revoke tokens on-demand, if necessary.
    -   Libraries
        -   `bcrypt` to store salted hashes of user master passwords
        -   `cors` to manage CORS and allowed origins
        -   `express-graphql` to manage the GraphQL implementation
        -   `form-data` and `mailgun.js` to send emails with share invitations
        -   `helmet` to prevent common attacks
        -   `jsonwebtoken` to manage all JWTs
        -   `mongo-sanitize` to prevent NoSQL attacks
        -   `mongoose` to connect to and simplify working with MongoDB
        -   `redis` to connect and work with the Redis cache
        -   `uuid` to generate unique IDs for users
        -   `validator` to validate user inputted data
    -   Third party APIs
        -   `Mailgun` to send emails about share invitations
    -   Security
        -   The `helmet`, `cors`, `validator`, `mongo-sanitize` and `jsonwebtoken` libraries are
            used to manage all security related to the backend and purpose described above. Further
            protections are instituted at the container level including HTTPS-only access, and minimal
            port exposure.
-   **Extension**
    -   The Chrome extention is developed in `React` with `TypeScript`, `HTML` and `CSS`. A
        `React-TypeScript-Extension` template was used to bootstrap the project. The extension runs
        separately to the other components but relies on the frontend to sign in (via message passing),
        reusable servicees, and the backend for data.
    -   Libraries
        -   `mui` for component building
        -   `fontsouce` for fonts
        -   `generate-password` for secure password generation
        -   `react-password-strength-bar` for measuring password strength
    -   No third party APIs were used
    -   Security
        -   We looked extensively for security-related options for the chrome extension in regards to
            persisting user credentials and ultimately discovered there are none available currently with
            Chrome. Subsequently, we had to store user credentials in Chrome storage (**not** local storage)
            in plain to be able to read the data later. After researching this option, Chrome storage
            is inaccessible to JavaScript ran by websites and only the extension itself can access it.
            To prevent attacks, we made sure that XSS attacks were not possible through extensive
            testing and relying on React's built-in security features.

## Deployment

The website is deployed in an entirely dockerized environment. We made containers for the frontend,
backend and used pre-existing containers for `Redis` and `MongoDB`. The frontend container uses the
built `React` bundles served through `Nginx` while the backend simply runs the `Express` app. We then used
another `Nginx` container as a reverse proxy for the frontend and backend while also converting all
requests to HTTPS. An `Nginx ACME` container was used to manage the SSL certificates for our app
provided through `Let's Encrypt`. All of these containers were then configured on a single
`Docker Compose` file to be run through a single command. To ensure reliability, all containers were
configured to restart always and the `Docker Compose` file is attached to a Unix service so that it
runs on startup and restarts on failure. This is all run on a `Digital Ocean` VM, connected to a
domain from `NameCheap`, and configured with a firewall to only allow certain types of traffic.
Finally, this entire workflow is automated by a few `GitHub Actions` workflows
that build and deploy the necessary containers on a push to the `production` branch. We manually
configured the DNS records and populated `GitHub Secrets` once to enable these processes.

## Maintenance

To monitor the app, we use `Datadog` as a monitoring utility where we ship all logs for each container.
For certain containers, we attach traces and specialized `Datadog` utilities to gather app-specific
metrics. This is all possible by modifiying our Docker Compose configuration with another container
for `Datadog` and configuring the others to use the logging utilities. After these configurations, we
can view all the logs and statuses of all our containers through the numerous dashboards on the `Datadog`
web app. As an alternative, we also have the `Digital Ocean` default metrics provided to us that showcase
resource usage.

## Challenges

1. The biggest challenge by far, was in deploying our application. As none of the team had experience
   with deploying on a VM, or creating docker configurations, there was a substantial learning curve in
   getting our app from local -> hosted website with domain.
2. Creating an encryption scheme that met all our requirements was quite the challenge. First, we
   had to pick an encyption library that had all the required algorithms. Then was the case of building
   the scheme itself in how to manage keys safely but also keeping performance in mind. At one point,
   the decryption process took 3 times as long as it does now! Lastly, we had to design the scheme such
   that sharing would work with revoking enabled.
3. Interacting with external websites in gathering / inputting user credentials using the Chrome
   extension. Many websites used varied techniques in getting users to input credentials and
   our extension had to be designed to facilitate the vast majority of them.

# One more thing?

This was a fun project and we all feel that we learned a lot throughout its course!
If it would be possible to release the project guidelines earlier, it would've given us more time
as there was much less time in the second half of a semester compared to the first.
