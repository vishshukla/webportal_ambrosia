package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/goware/emailx"

	simplejson "github.com/bitly/go-simplejson"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"

	keys "github.com/vishshukla/platform/server/config"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

var db, err = sql.Open("mysql", keys.ProdDb)

//SecretKey is a global variable used to add 'password' to all the JWT
var SecretKey = keys.Secret

//	BEGIN STRUCTS FOR PROGRAM BEGIN STRUCTS FOR PROGRAM BEGIN STRUCTS FOR PROGRAM

//User has all of the elements for a basic user in this web app.
type User struct {
	ID           int    `db:"id" `
	UserType     int    `db:"user_type" form:"user_type" validate:"required"`
	Prefix       string `db:"prefix" form:"prefix"`
	FirstName    string `db:"first_name" form:"first_name" validate:"required"`
	MiddleName   string `db:"middle_name" form:"middle_name"`
	LastName     string `db:"last_name" form:"last_name" validate:"required" `
	Suffix       string `db:"suffix" form:"suffix"`
	Email        string `db:"email" form:"email" validate:"required,email" `
	Password     string `db:"password" form:"password" validate:"required,password" `
	Ssn          string `db:"ssn" form:"ssn"`
	Phone        string `db:"phone" form:"phone" validate:"required"`
	Address      string `db:"address" form:"address" validate:"required"`
	Zipcode      string `db:"zipcode" form:"zipcode"`
	City         string `db:"city" form:"city" `
	State        string `db:"state" form:"state"`
	Country      string `db:"country" form:"country" validate:"required"`
	LoginAttempt int    `db:"login_attempt" form:"login_attempt"`
	ActiveStatus int    `db:"active_status" form:"active_status"`
}

//These structs are for reading in the JSON Req Data passed into create and login routes... {
type tempNewUser struct {
	First           string `bson:"first_name" json:"first_name" db:"first_name"`
	Last            string `bson:"last_name" json:"last_name" db:"last_name"`
	Email           string `bson:"email" json:"email" db:"email"`
	Password        string `bson:"password" json:"password" db:"password"`
	ConfirmPassword string `bson:"confirm_password" json:"confirm_password"`
}
type tempUserLogin struct {
	Email    string `bson:"email" json:"email" db:"email"`
	Password string `bson:"password" bson:"password" db:"password"`
}

//This struct is used to format the stored readings for a given user...
type Reading struct {
	ReadingNumber int    `bson:"reading_number" json:"reading_number" db:"reading"`
	ReadingTime   string `bson:"reading_time" json:"reading_time" db:"reading_time"`
}

type Notes struct {
	// Body string `bson:""`
}

//	END OF STRUCTS	END OF STRUCTS	END OF STRUCTS	END OF STRUCTS
// }

//CREATING THE TABLE FOR MYSQL

func createTable() {
	stmt, err := db.Prepare("CREATE TABLE user (id INT NOT NULL AUTO_INCREMENT, user_type INT DEFAULT 1, prefix VARCHAR(10) DEFAULT '', first_name VARCHAR(40) , middle_name VARCHAR(40) DEFAULT '', last_name VARCHAR(40), suffix VARCHAR(10) DEFAULT '' , email VARCHAR(60), password VARCHAR(200), ssn VARCHAR(9) DEFAULT '',phone VARCHAR(15) DEFAULT '', address VARCHAR(100) DEFAULT '', zipcode VARCHAR(8) DEFAULT '', city VARCHAR(20) DEFAULT '', state VARCHAR(2) DEFAULT '', country VARCHAR(100) DEFAULT '', login_attempt INT DEFAULT 0, active_status INT DEFAULT 0, PRIMARY KEY (id));")
	if err != nil {
		fmt.Println(err.Error())
	}
	_, err = stmt.Exec()
	if err != nil {
		fmt.Println(err.Error())
	} else {
		fmt.Println("Table is successfully created....")
	}
}

// func signOut(c *gin.Context) {
// 	ID := c.Param("id")
// 	db.QueryRow("UPDATE user SET active_status = 0 WHERE id=?;", ID)
// 	// switch {
// 	// case err != nil:
// 	// 	log.Fatal(err)
// 	// default:
// 	// 	log.Printf("Signed out")
// 	// }
// }

func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "applications/json")
	var user tempUserLogin
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&user)
	//This is used for front-end validations
	var everythingOkay = true
	json := simplejson.New()
	err := emailx.Validate(user.Email)
	if user.Email == "" {
		everythingOkay = false
		json.Set("email", "Enter email")
	} else if err != nil {
		everythingOkay = false
		json.Set("email", "Invalid email")
	}
	if user.Password == "" {
		everythingOkay = false
		json.Set("password", "Enter password")
	}
	if !everythingOkay {
		payload, _ := json.MarshalJSON()
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(payload)
		return
	}

	var ID int
	var FirstName string
	var LastName string
	err = db.QueryRow("SELECT id ,first_name, last_name FROM user WHERE email= ?;", user.Email).Scan(&ID, &FirstName, &LastName)
	if err != nil {
		log.Print(err)
		json.Set("email", "No user with that email was found.")
		payload, _ := json.MarshalJSON()
		w.WriteHeader(http.StatusBadRequest)
		w.Write(payload)
		return
	}
	if passwordMatch(user.Email, user.Password) {

		//creating a token
		token := jwt.New(jwt.SigningMethodHS256)
		token.Claims = jwt.MapClaims{
			"id":   ID,
			"name": fmt.Sprint(FirstName + " " + LastName),
			"exp":  time.Now().Add(time.Hour * 72).Unix(),
		}

		tokenString, _ := token.SignedString(SecretKey)
		json.Set("success", true)
		json.Set("token", tokenString)
		payload, _ := json.MarshalJSON()
		w.WriteHeader(http.StatusOK)
		w.Write(payload)
		return
	}
	//else
	json.Set("success", false)
	json.Set("password", "Password incorrect")
	payload, _ := json.MarshalJSON()
	w.WriteHeader(http.StatusBadRequest)
	w.Write(payload)
	// switch {
	// case err != nil:
	// 	log.Fatal(err)
	// 	return false
	// default:
	// 	log.Printf("Signed in")
	// 	return true
	// }
}

//Message used to send JSON back one time.
type Message struct {
	Name string
	Body string
}

//GetByID
//@GET
func getByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	// json := simplejson.New()
	var user User
	token, err := parseToken(w, r)
	id := fmt.Sprint(token.Claims.(jwt.MapClaims)["id"])
	if err != nil {
		m := Message{"Message", "Unauthorized Link"}
		payload, _ := json.Marshal(m)
		w.Write(payload)
		return
	}
	row := db.QueryRow("SELECT id, user_type, prefix, first_name, middle_name, last_name, suffix, email, phone, address, zipcode, city, state, country, active_status, ssn FROM user WHERE id=?", id)

	err = row.Scan(&user.ID, &user.UserType, &user.Prefix, &user.FirstName, &user.MiddleName, &user.LastName, &user.Suffix, &user.Email, &user.Phone, &user.Address, &user.Zipcode, &user.City, &user.State, &user.Country, &user.ActiveStatus, &user.Ssn)
	if err != nil {
		log.Printf("Couldn't find user...")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	log.Printf("Requesting info from user id: " + id)
	// w.WriteHeader(http.StatusOK)
	m, _ := json.Marshal(user)
	w.Write(m)

}

//GetAllUsers
//@GET Request
func getAllUsers(w http.ResponseWriter, r *http.Request) {
	var (
		user  User
		users []User
	)

	rows, err := db.Query("SELECT id, user_type, first_name, middle_name, last_name, suffix, email, ssn, phone, address, zipcode, city, state, country, active_status FROM user;")

	if err != nil {
		fmt.Print(err.Error())
	}
	for rows.Next() {
		rows.Scan(&user.ID, &user.UserType, &user.FirstName, &user.MiddleName, &user.LastName, &user.Suffix, &user.Email, &user.Ssn, &user.Phone, &user.Address, &user.Zipcode, &user.City, &user.State, &user.Country, &user.ActiveStatus)
		users = append(users, user)
	}
	defer rows.Close()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)

}

// func getNotesByID(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	var (
// 		notes Notes
// 	)
// 	token, err := parseToken(w,r)
// 	id := fmt.Sprint(token.Claims.(jwt.MapClaims)["id"]
// 	if err != nil {
// 		m := Message{"Message", "Unauthorized Link"}
// 		payload, _ := json.Marshal(m)
// 		w.Write(payload)
// 		return
// 	}
// 	rows, err := db.Query("")

// )
// }

func getReadingsByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var (
		reading  Reading
		readings []Reading
	)
	token, err := parseToken(w, r)
	id := fmt.Sprint(token.Claims.(jwt.MapClaims)["id"])
	if err != nil {
		m := Message{"Message", "Unauthorized Link"}
		payload, _ := json.Marshal(m)
		w.Write(payload)
		return
	}
	rows, err := db.Query("SELECT reading , reading_time FROM app_device_readings WHERE user_id = ? ORDER BY reading_time DESC", id)
	if err != nil {
		fmt.Print(err.Error())
	}
	for rows.Next() {
		rows.Scan(&reading.ReadingNumber, &reading.ReadingTime)
		readings = append(readings, reading)
	}
	defer rows.Close()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(readings)

}

//PasswordMatch
//Used for login and updating user profile
func passwordMatch(email string, pwd string) bool {
	var passwordFromDB string

	row := db.QueryRow("SELECT password FROM user WHERE email = ? ;", email)
	err = row.Scan(&passwordFromDB)

	passwordInByte := []byte(passwordFromDB)
	inputPassword := []byte(pwd)

	err = bcrypt.CompareHashAndPassword(passwordInByte, inputPassword)
	if err == nil {
		return true //passwords match
	}
	return false //incorrect password

}

//isEmailOrPhoneInUse
//Used in creating a user
func doesEmailExist(email string) bool {
	var ID int
	err := db.QueryRow("SELECT id FROM user WHERE email=?", email).Scan(&ID)

	switch {
	case err == sql.ErrNoRows:
		log.Printf("No user with that ID.")
		return false
	case err != nil:
		log.Fatal(err)
		return false
	default:
		log.Printf("Found")
		return true
	}
}

//TESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTING
// formatRequest generates ascii representation of a request

//TESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTING

//CreateUser
//@POST
//TODO- FIX r.FormValue
func createUser(w http.ResponseWriter, r *http.Request) {
	var user tempNewUser
	decoder := json.NewDecoder(r.Body)
	decoder.Decode(&user)
	var everythingOkay = true
	// error := simplejson.New()
	// error.Set("email", "needs to be valid")
	// payload, _ := error.MarshalJSON()
	// w.Write(payload)
	// w.WriteHeader(http.StatusBadRequest)

	_, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		log.Println("Error reading input json")
		panic(err)
	}
	if err := r.Body.Close(); err != nil {
		panic(err)
	}
	// if err := json.Unmarshal(body, &user); err != nil {
	// 	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	// 	w.WriteHeader(422) // unprocessable entity
	// 	if err := json.NewEncoder(w).Encode(err); err != nil {
	// 		panic(err)
	// 	}
	// }
	// Put the body back for FormatRequest to read it

	// Put it back before you call client.Do()
	w.Header().Set("Content-Type", "application/json")
	// if err != nil {
	// 	w.WriteHeader(http.StatusBadGateway)
	// 	return
	// }
	// for key, values := range r.PostForm {
	// 	fmt.Printf(key, values)
	// }
	// logic part of log in
	// UserType := r.FormValue("user_type")
	// Prefix := r.FormValue("prefix")
	// FirstName := r.FormValue("first_name")
	// MiddleName := r.FormValue("middle_name")
	// LastName := r.FormValue("last_name")
	// Suffix := r.FormValue("suffix")
	// Email := r.FormValue("email")
	// Password := r.FormValue("password")
	// ConfirmPassword := r.FormValue("confirm_password")
	// Ssn := r.FormValue("ssn")
	// Phone := r.FormValue("phone")
	// Address := r.FormValue("address")
	// Zipcode := r.FormValue("zipcode")
	// City := r.FormValue("city")
	// State := r.FormValue("state")
	// Country := r.FormValue("country")

	w.Header().Set("Content-Type", "application/json")
	json := simplejson.New()

	if user.Email == "" {
		json.Set("email", "Enter email")
		everythingOkay = false
	}
	if user.First == "" {
		json.Set("first_name", "Enter first name")
		everythingOkay = false
	}
	if user.Last == "" {
		everythingOkay = false
		json.Set("last_name", "Enter last name")
	}
	if user.Password == "" {
		everythingOkay = false
		json.Set("password", "Enter password")
	}
	// if user.ConfirmPassword == "" {
	// 	everythingOkay = false
	// 	json.Set("confirm_password", "Confirm Password field is required")
	// }

	if !everythingOkay {
		payload, _ := json.MarshalJSON()
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write(payload)
		return
	}
	err = emailx.Validate(user.Email)
	if err != nil {
		everythingOkay = false
		json.Set("email", "Please enter a valid email.")
		// payload, _ := json.MarshalJSON()
		// w.Header().Set("Content-Type", "application/json")
		// w.WriteHeader(http.StatusBadRequest)
		// w.Write(payload)
	}

	//If email already exists
	if doesEmailExist(user.Email) {
		everythingOkay = false
		json.Set("email", "An account with this email already exists.")
	}
	if len(user.Password) < 6 || len(user.Password) > 20 {
		everythingOkay = false
		json.Set("password", "Use 6 character or more for your password.")
	}

	if user.Password != user.ConfirmPassword {
		everythingOkay = false
		json.Set("confirm_password", "Passwords must match")
	}
	if !everythingOkay {
		payload, err := json.MarshalJSON()
		if err != nil {
			w.Write([]byte("Something went wrong..."))
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			w.Write(payload)
		}
		return
	}

	HashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	//insert into database
	stmt, err := db.Prepare("insert into user (first_name,last_name,email,password,active_status) values(?,?,?,?,1);")
	if err != nil {
		log.Println("Error in the executing call")
		fmt.Print(err.Error())
	}

	_, err = stmt.Exec(user.First, user.Last, user.Email, string(HashedPassword))
	if err != nil {
		fmt.Print(err.Error())
		json.Set("message", "Something went wrong, please check every field and try again")
		payload, _ := json.MarshalJSON()
		w.WriteHeader(http.StatusBadGateway)
		w.Write(payload)
		// c.JSON(http.StatusOK, gin.H{
		// 	"message": fmt.Sprintf("Something went wrong, please check every field and try again"),
		// })
		return
	}

	defer stmt.Close()

	json.Set("message", "Successfully created")
	payload, _ := json.MarshalJSON()
	w.WriteHeader(http.StatusOK)
	w.Write(payload)
}

//DeleteUser
//@DELETE
func deleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	token, err := parseToken(w, r)
	if err != nil {
		m := Message{"message", "Unauthorized Route."}
		payload, _ := json.Marshal(m)
		w.Write(payload)
		return
	}
	ID := fmt.Sprint(token.Claims.(jwt.MapClaims)["id"])
	w.Header().Set("Content-Type", "application/json")
	stmt, err := db.Prepare("delete from user where id= ?;")
	if err != nil {
		m := Message{"message", "Something went wrong..."}
		payload, _ := (json.Marshal(m))
		w.Write(payload)
		fmt.Print(err.Error())
	}

	_, err = stmt.Exec(ID)

	if err != nil {
		fmt.Print(err.Error())
	}

	if err != nil {
		fmt.Print(err.Error())
	}
	m := Message{"message", "Successfully deleted"}
	payload, _ := (json.Marshal(m))
	w.Write(payload)
}

//UpdateUSER
//@PUT
//TODO: Need to add verification to new email before setting new email
func updateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	token, err := parseToken(w, r)
	if err != nil {
		m := Message{"message", "Unauthorized Route!"}
		payload, _ := json.Marshal(m)
		w.Write(payload)
		return
	}
	ID := fmt.Sprint(token.Claims.(jwt.MapClaims)["id"])
	UserType := r.FormValue("user_type")
	Prefix := r.FormValue("prefix")
	FirstName := r.FormValue("first_name")
	MiddleName := r.FormValue("middle_name")
	NewPassword := r.FormValue("new_password")
	CurrentPassword := r.FormValue("current_password")
	LastName := r.FormValue("last_name")
	Suffix := r.FormValue("suffix")
	Email := r.FormValue("email")
	Ssn := r.FormValue("ssn")
	Phone := r.FormValue("phone")
	Address := r.FormValue("address")
	Zipcode := r.FormValue("zipcode")
	City := r.FormValue("city")
	State := r.FormValue("state")
	Country := r.FormValue("country")
	json := simplejson.New()
	var oldEmail string
	db.QueryRow("SELECT email FROM user WHERE ID=?", ID).Scan(&oldEmail)

	if Email == "" || CurrentPassword == "" || FirstName == "" || LastName == "" || Address == "" || Country == "" {
		json.Set("message", "Please fill in all the required fields")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}

	if !passwordMatch(oldEmail, CurrentPassword) {
		json.Set("message", "Current password doesn't match")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}
	//if they are changing their password
	if NewPassword != "" {
		var HashedPassword []byte
		if len(NewPassword) < 6 || len(NewPassword) > 20 {
			json.Set("message", "Password must be between 6-20 characters")
			return
		}

		HashedPassword, err = bcrypt.GenerateFromPassword([]byte(NewPassword), bcrypt.DefaultCost)
		if err != nil {
			panic(err)
		}

		//To check if the user actually inserted a different password
		if passwordMatch(oldEmail, NewPassword) {
			json.Set("message", "Choose a password you haven't used before!")
			payload, _ := json.MarshalJSON()
			w.Write(payload)
			return
		}
		stmt, err := db.Prepare("update user set user_type=?, prefix=?,first_name=?,middle_name=?,last_name=?,suffix=?, password=?,email=?,ssn=?,phone=?,address=?,zipcode=?,city=?,state=?,country=? WHERE id=?; ")
		if err != nil {
			fmt.Print(err.Error())
		}

		_, err = stmt.Exec(UserType, Prefix, FirstName, MiddleName, LastName, Suffix, string(HashedPassword), Email, Ssn, Phone, Address, Zipcode, City, State, Country, ID)
		if err != nil {
			fmt.Print(err.Error())
		}

		defer stmt.Close()
	} else {
		stmt, err := db.Prepare("update user set user_type=?, prefix=?,first_name=?,middle_name=?,last_name=?,suffix=?,email=?,ssn=?,phone=?,address=?,zipcode=?,city=?,state=?,country=? WHERE id=?; ")
		if err != nil {
			fmt.Print(err.Error())
		}

		_, err = stmt.Exec(UserType, Prefix, FirstName, MiddleName, LastName, Suffix, Email, Ssn, Phone, Address, Zipcode, City, State, Country, ID)
		if err != nil {
			fmt.Print(err.Error())
		}

		defer stmt.Close()
	}

	json.Set("message", "Successfully updated "+FirstName+" "+LastName)
	payload, _ := json.MarshalJSON()
	w.Write(payload)
}

func parseToken(w http.ResponseWriter, r *http.Request) (*jwt.Token, error) {
	w.Header().Set("Content-Type", "application/json")

	rawToken := r.Header.Get("Authorization")

	token, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return SecretKey, nil
	})
	return token, err
}

//ValidateTokenMiddleware checks if the Auth token in the header is valid.
func ValidateTokenMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	// w.Header().Set("Content-Type", "application/json")
	// json := simplejson.New()

	// rawToken := r.Header.Get("Authorization")
	// // token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
	// // 	func(token *jwt.Token) (interface{}, error) {
	// // 		return SecretKey, nil
	// // 	})
	// token, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
	// 	// Don't forget to validate the alg is what you expect:
	// 	if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
	// 		return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
	// 	}

	// 	return SecretKey, nil
	// })
	json := simplejson.New()
	token, err := parseToken(w, r)
	// if fmt.Sprint(token.Claims.(jwt.MapClaims)["id"]) {

	// }
	if err == nil && token.Valid {
		// idPassed := interface{}(mux.Vars(r)["id"])
		// fmt.Printf(idPassed.(string))
		// idFromClaims := fmt.Sprint(claims["id"]) claims, ok := token.Claims.(jwt.MapClaims)
		next(w, r)
	} else {
		json.Set("message", "Unauthorized access to this resource, please log in again.")
		payload, _ := json.MarshalJSON()
		w.WriteHeader(http.StatusUnauthorized)
		w.Write(payload)
	}

}

func main() {
	// createTable() //<-- already created table

	if err != nil {
		fmt.Print(err.Error())
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Print(err.Error())
	}
	r := mux.NewRouter()
	api := mux.NewRouter()
	// admin := mux.NewRouter()

	//Put protection on all user routes
	r.PathPrefix("/api/user").Handler(negroni.New(
		negroni.HandlerFunc(ValidateTokenMiddleware),
		negroni.Wrap(api),
	))

	// router.Handle("/resource", negroni.New(
	// 	negroni.HandlerFunc(ValidateTokenMiddleware),
	// ))
	r.HandleFunc("/test", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("In test page"))
	}).Methods("GET")
	//GETUSERS
	//@ADMIN ONLY
	r.HandleFunc("/users", getAllUsers).Methods("GET")
	// router.GET("/api/users", getAllUsers)
	//GETBYID
	//@PRIVATE - LOGGED

	//@PRIVATE
	api.HandleFunc("/api/user", getByID).Methods("GET")

	api.HandleFunc("/api/user/readings", getReadingsByID).Methods("GET")
	//@PUBLIC
	r.HandleFunc("/register", createUser).Methods("POST")
	// router.POST("/api/user", createUser)

	//@PRIVATE
	api.HandleFunc("/api/user", deleteUser).Methods("DELETE")
	// r.HandleFunc("/api/user/{id}", deleteUser).Methods("DELETE")
	// router.DELETE("/api/user/:id", deleteUser)

	api.HandleFunc("/api/user", updateUser).Methods("PUT")
	// router.PUT("/api/user/:id", updateUser)

	r.HandleFunc("/login", login).Methods("PUT")
	// router.PUT("/api/users/login", login)

	// router.PUT("/api/signout/:id", signOut)
	log.Fatal(http.ListenAndServe(":8000", r))

}
