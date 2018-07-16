# Ambrosia Web Portal

Project is currently under development during interning here at Ambrosia Systems. Currently, this portal will allow users to register, login, and view their readings.

## To run locally

The program is organized with client and server. To run this program locally, please have MySQL downloaded. Please uncomment createTable function from main.go to have the program create the proper table for you locally. To use reading functionality, please create the readings table with the same architecture 

### Prerequisites

Need to have NodeJS and Golang installed and the $PATH configured; refer to official documentation for more information.

```
MySQL
Golang
NodeJS
```

## Built With

* [Gorrila Mux](https://github.com/gorilla/mux) - Back-end Router
* [JWT-GO](https://github.com/dgrijalva/jwt-go) - Used for Authnetication
* [ReactJS](https://reactjs.org/) - Used for the front-end of the application
* [Redux](https://redux.js.org/) - Used for state management for front-end
* [MySQL](https://redux.js.org/) - Database used for user creation and glucose readings


## Author

* **Vishwas Shukla** - *Software Developer* - [vishshukla](https://github.com/vishshukla)
