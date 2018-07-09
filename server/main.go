package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	simplejson "github.com/bitly/go-simplejson"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"

	keys "github.com/vishshukla/learning_go/server/config"

	"github.com/dgrijalva/jwt-go"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

var db, err = sql.Open("mysql", "testuser:password@tcp(127.0.0.1:3306)/test")

//SecretKey is a global variable used to add 'password' to all the JWT
var SecretKey = keys.Secret

//User has all of the elements for a basic user in this web app.
type User struct {
	ID           int    `db:"id"`
	UserType     int    `db:"user_type" form:"user_type"`
	Prefix       string `db:"prefix" form:"prefix"`
	FirstName    string `db:"first_name" form:"first_name"`
	MiddleName   string `db:"middle_name" form:"middle_name"`
	LastName     string `db:"last_name" form:"last_name"`
	Suffix       string `db:"suffix" form:"suffix"`
	Email        string `db:"email" form:"email"`
	Password     string `db:"password" form:"password"`
	Ssn          string `db:"ssn" form:"ssn"`
	Phone        string `db:"phone" form:"phone"`
	Address      string `db:"address" form:"address"`
	Zipcode      string `db:"zipcode" form:"zipcode"`
	City         string `db:"city" form:"city"`
	State        string `db:"state" form:"state"`
	Country      string `db:"country" form:"country"`
	LoginAttempt int    `db:"login_attempt" form:"login_attempt"`
	ActiveStatus int    `db:"active_status" form:"active_status"`
}

//CREATING THE TABLE FOR MYSQL

func createTable() {
	stmt, err := db.Prepare("CREATE TABLE user (id INT NOT NULL AUTO_INCREMENT, user_type INT, prefix VARCHAR(10), first_name VARCHAR(40), middle_name VARCHAR(40), last_name VARCHAR(40), suffix VARCHAR(10) , email VARCHAR(60), password VARCHAR(200), ssn VARCHAR(9),phone VARCHAR(15), address VARCHAR(100), zipcode VARCHAR(8), city VARCHAR(20), state VARCHAR(2), country VARCHAR(100), login_attempt INT, active_status INT, PRIMARY KEY (id));")
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

	Email := r.FormValue("email")
	Password := r.FormValue("password")
	json := simplejson.New()
	var ID int
	err := db.QueryRow("SELECT id FROM user WHERE email= ?", Email).Scan(&ID)
	if err != nil {
		json.Set("message", "No user with that email was found.")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}
	if passwordMatch(Email, Password) {

		//creating a token
		token := jwt.New(jwt.SigningMethodHS256)
		token.Claims = jwt.MapClaims{
			"id":  ID,
			"exp": time.Now().Add(time.Hour * 72).Unix(),
		}

		tokenString, _ := token.SignedString(SecretKey)
		json.Set("success", true)
		json.Set("token", "Bearer "+tokenString)
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}
	//else
	json.Set("success", false)
	json.Set("message", "Invalid credentials, please check and try again.")
	payload, _ := json.MarshalJSON()
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

//GetByID
//@GET
func getByID(w http.ResponseWriter, r *http.Request) {
	var user User
	params := mux.Vars(r)
	id := params["id"]
	row := db.QueryRow("SELECT id, user_type, prefix, first_name, middle_name, last_name, suffix, email, phone, address, zipcode, city, state, country, active_status, ssn FROM USER WHERE id = ?", id)

	row.Scan(&user.ID, &user.UserType, &user.Prefix, &user.FirstName, &user.MiddleName, &user.LastName, &user.Suffix, &user.Email, &user.Phone, &user.Address, &user.Zipcode, &user.City, &user.State, &user.Country, &user.ActiveStatus, &user.Ssn)

	w.Header().Set("Content-Type", "application/json")
	log.Printf("Requesting info from user id: " + id)
	json.NewEncoder(w).Encode(user)
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
func isEmailOrPhone(email, phone string) bool {
	var ID int
	err := db.QueryRow("SELECT id FROM user WHERE email=? OR phone=?", email, phone).Scan(&ID)

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

//CreateUser
//@POST
//TODO- FIX r.FormValue
func createUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	UserType := r.FormValue("user_type")
	Prefix := r.FormValue("prefix")
	FirstName := r.FormValue("first_name")
	MiddleName := r.FormValue("middle_name")
	LastName := r.FormValue("last_name")
	Suffix := r.FormValue("suffix")
	Email := r.FormValue("email")
	Password := r.FormValue("password")
	Ssn := r.FormValue("ssn")
	Phone := r.FormValue("phone")
	Address := r.FormValue("address")
	Zipcode := r.FormValue("zipcode")
	City := r.FormValue("city")
	State := r.FormValue("state")
	Country := r.FormValue("country")
	w.Header().Set("Content-Type", "application/json")
	json := simplejson.New()

	if Email == "" || Password == "" || FirstName == "" || LastName == "" || Address == "" || Country == "" || Phone == "" {
		json.Set("message", "Please fill all mandatory fields...")
		payload, err := json.MarshalJSON()
		if err != nil {
			w.Write([]byte("Something went wrong..."))
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.Write(payload)
		}

		return
	}
	//If email already exists
	if isEmailOrPhone(Email, Phone) {
		json.Set("message", "An account with this email or phone already exists...")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}

	HashedPassword, err := bcrypt.GenerateFromPassword([]byte(Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	//insert into database
	stmt, err := db.Prepare("insert into user (user_type,prefix,first_name,middle_name,last_name,suffix,email,password,ssn,phone,address,zipcode,city,state,country,login_attempt,active_status) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,1);")
	if err != nil {
		log.Println("Error in the executing call")
		fmt.Print(err.Error())
	}

	_, err = stmt.Exec(UserType, Prefix, FirstName, MiddleName, LastName, Suffix, Email, string(HashedPassword), Ssn, Phone, Address, Zipcode, City, State, Country)
	if err != nil {
		fmt.Print(err.Error())
		json.Set("message", "Something went wrong, please check every field and try again")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		// c.JSON(http.StatusOK, gin.H{
		// 	"message": fmt.Sprintf("Something went wrong, please check every field and try again"),
		// })
		return
	}

	defer stmt.Close()

	json.Set("message", "Successfully created")
	payload, _ := json.MarshalJSON()
	w.Write(payload)
}

//DeleteUser
//@DELETE
func deleteUser(w http.ResponseWriter, r *http.Request) {
	param := mux.Vars(r)
	json := simplejson.New()
	ID := param["id"]
	w.Header().Set("Content-Type", "application/json")
	stmt, err := db.Prepare("delete from user where id= ?;")

	if err != nil {
		json.Set("message", "Something went wrong...")
		fmt.Print(err.Error())
	}

	_, err = stmt.Exec(ID)

	if err != nil {
		fmt.Print(err.Error())
	}

	if err != nil {
		fmt.Print(err.Error())
	}
	json.Set("message", "Successfully deleted")
	payload, _ := json.MarshalJSON()
	w.Write(payload)
}

//UpdateUSER
//@PUT
//TODO: Need to add verification to new email before setting new email
func updateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ID := mux.Vars(r)["id"]
	UserType := r.FormValue("user_type")
	Prefix := r.FormValue("prefix")
	FirstName := r.FormValue("first_name")
	MiddleName := r.FormValue("middle_name")
	NewPassword := r.FormValue("new_password")
	OldPassword := r.FormValue("old_password")
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

	if Email == "" || OldPassword == "" || NewPassword == "" || FirstName == "" || LastName == "" || Address == "" || Country == "" {
		json.Set("message", "Please fill in all the required fields")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}

	if !passwordMatch(Email, OldPassword) {
		json.Set("message", "Old password doesn't match")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}

	var HashedPassword []byte

	HashedPassword, err = bcrypt.GenerateFromPassword([]byte(NewPassword), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	//To check if the user actually inserted a different password
	if passwordMatch(Email, NewPassword) {
		json.Set("message", "Choose a password you haven't used before!")
		payload, _ := json.MarshalJSON()
		w.Write(payload)
		return
	}

	stmt, err := db.Prepare("update user set user_type=?, prefix=?,first_name=?,middle_name=?,last_name=?,suffix=?, password=?,ssn=?,phone=?,address=?,zipcode=?,city=?,state=?,country=? WHERE id=?; ")
	if err != nil {
		fmt.Print(err.Error())
	}

	_, err = stmt.Exec(UserType, Prefix, FirstName, MiddleName, LastName, Suffix, string(HashedPassword), Ssn, Phone, Address, Zipcode, City, State, Country, ID)
	if err != nil {
		fmt.Print(err.Error())
	}

	defer stmt.Close()

	json.Set("message", "Successfully updated "+FirstName+" "+LastName)
	payload, _ := json.MarshalJSON()
	w.Write(payload)
}

//ValidateTokenMiddleware still working on this..
func ValidateTokenMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	w.Header().Set("Content-Type", "application/json")
	rawToken := r.Header.Get("Authorization")
	// token, err := request.ParseFromRequest(r, request.AuthorizationHeaderExtractor,
	// 	func(token *jwt.Token) (interface{}, error) {
	// 		return SecretKey, nil
	// 	})
	token, err := jwt.Parse(rawToken, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return SecretKey, nil
	})
	if err == nil {
		// idPassed := interface{}(mux.Vars(r)["id"])
		// fmt.Printf(idPassed.(string))
		idPassed := mux.Vars(r)["id"]
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			idFromClaims := fmt.Sprint(claims["id"])
			if idPassed == idFromClaims {
				next(w, r)
			} else { //trying to access someone else's info

				w.WriteHeader(http.StatusUnauthorized)
				fmt.Fprint(w, "Unauthorized access to this resource")
			}
		} else {
			w.WriteHeader(http.StatusUnauthorized)
			fmt.Fprint(w, "Unauthorized access to this resource")
		}
	} else {
		fmt.Printf("Token is not right...")
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprint(w, "Unauthorized access to this resource")
	}

}

func main() {
	// createTable() <-- already created table

	// if err != nil {
	// 	fmt.Print(err.Error())
	// }
	// defer db.Close()

	// err = db.Ping()
	// if err != nil {
	// 	fmt.Print(err.Error())
	// }
	r := mux.NewRouter()
	api := mux.NewRouter()
	// admin := mux.NewRouter()

	//Put protection on all user routes
	r.PathPrefix("/api/user/{id}").Handler(negroni.New(
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
	// r.HandleFunc("/api/users", getAllUsers).Methods("GET")
	// router.GET("/api/users", getAllUsers)
	//GETBYID
	//@PRIVATE - LOGGED

	//@PRIVATE
	// r.Handle("/api/user/{id}", negroni.New(
	// 	negroni.HandlerFunc(ValidateTokenMiddleware),
	// 	negroni.Wrap(http.HandlerFunc(getByID)),
	// )).Methods("GET")
	api.HandleFunc("/api/user/{id}", getByID).Methods("GET")
	// router.GET("api/user/:id", getByID)

	//@PUBLIC
	r.HandleFunc("/create", createUser).Methods("POST")
	// router.POST("/api/user", createUser)

	//@PRIVATE
	api.HandleFunc("/api/user/{id}", deleteUser).Methods("DELETE")
	// r.HandleFunc("/api/user/{id}", deleteUser).Methods("DELETE")
	// router.DELETE("/api/user/:id", deleteUser)

	api.HandleFunc("/api/user/{id}", updateUser).Methods("PUT")
	// router.PUT("/api/user/:id", updateUser)

	r.HandleFunc("/login", login).Methods("PUT")
	// router.PUT("/api/users/login", login)

	// router.PUT("/api/signout/:id", signOut)
	log.Fatal(http.ListenAndServe(":8000", r))

}
