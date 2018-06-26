package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

var db, err = sql.Open("mysql", "testuser:password@tcp(127.0.0.1:3306)/test")

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
func getAllUsers(c *gin.Context) {
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
	c.JSON(http.StatusOK, users)
}

func signOut(c *gin.Context) {
	ID := c.Param("id")
	db.QueryRow("UPDATE user SET active_status = 0 WHERE id=?;", ID)
	// switch {
	// case err != nil:
	// 	log.Fatal(err)
	// default:
	// 	log.Printf("Signed out")
	// }
}

func signIn(c *gin.Context) {

	Email := c.PostForm("email")
	Password := c.PostForm("password")
	if passwordMatch(Email, Password) {
		var ID int
		db.QueryRow("SELECT id FROM user WHERE email= ?", Email).Scan(&ID) //finding id
		db.QueryRow("UPDATE user SET active_status = 1 WHERE id=?;", ID)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{
				"message": fmt.Sprintf("Hmm... Something went wrong, please try again later."),
			})
		} else {
			c.JSON(http.StatusOK, gin.H{
				"message": fmt.Sprintf("Welcome back."),
			})
		}
	} else {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Invalid credentials, please check and try again"),
		})
	}
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
func getByID(c *gin.Context) {
	var user User
	id := c.Param("id")
	row := db.QueryRow("SELECT id, user_type, prefix, first_name, middle_name, last_name, suffix, email, phone, address, zipcode, city, state, country, active_status FROM USER WHERE id = ?", id)

	err := row.Scan(&user.ID, &user.UserType, &user.Prefix, &user.FirstName, &user.MiddleName, &user.LastName, &user.Suffix, &user.Email, &user.Phone, &user.Address, &user.Zipcode, &user.City, &user.State, &user.Country)
	if err != nil {
		c.JSON(http.StatusOK, nil)
	} else {
		c.JSON(http.StatusOK, user)
	}
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
	} else {
		return false //incorrect password
	}

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
func createUser(c *gin.Context) {
	UserType := c.PostForm("user_type")
	Prefix := c.PostForm("prefix")
	FirstName := c.PostForm("first_name")
	MiddleName := c.PostForm("middle_name")
	LastName := c.PostForm("last_name")
	Suffix := c.PostForm("suffix")
	Email := c.PostForm("email")
	Password := c.PostForm("password")
	Ssn := c.PostForm("ssn")
	Phone := c.PostForm("phone")
	Address := c.PostForm("address")
	Zipcode := c.PostForm("zipcode")
	City := c.PostForm("city")
	State := c.PostForm("state")
	Country := c.PostForm("country")

	if Email == "" || Password == "" || FirstName == "" || LastName == "" || Address == "" || Country == "" {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Please fill all mandatory fields"),
		})
		return
	}
	//If email already exists
	if isEmailOrPhone(Email, Phone) {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Email or Phone is already in use"),
		})
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
	}

	defer stmt.Close()

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully created"),
	})
}

//DeleteUser
//@DELETE
func deleteUser(c *gin.Context) {
	ID := c.Param("id")
	stmt, err := db.Prepare("delete from user where id= ?;")

	if err != nil {
		fmt.Print(err.Error())
	}

	_, err = stmt.Exec(ID)

	if err != nil {
		fmt.Print(err.Error())
	}

	if err != nil {
		fmt.Print(err.Error())
	}

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully deleted user with ID: %s", ID),
	})
}

func updateUser(c *gin.Context) {
	ID, err := strconv.Atoi(c.Param("id"))
	UserType := c.PostForm("user_type")
	Prefix := c.PostForm("prefix")
	FirstName := c.PostForm("first_name")
	MiddleName := c.PostForm("middle_name")
	NewPassword := c.PostForm("new_password")
	OldPassword := c.PostForm("old_password")
	LastName := c.PostForm("last_name")
	Suffix := c.PostForm("suffix")
	Email := c.PostForm("email")
	Ssn := c.PostForm("ssn")
	Phone := c.PostForm("phone")
	Address := c.PostForm("address")
	Zipcode := c.PostForm("zipcode")
	City := c.PostForm("city")
	State := c.PostForm("state")
	Country := c.PostForm("country")

	if Email == "" || OldPassword == "" || FirstName == "" || LastName == "" || Address == "" || Country == "" {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Please fill all mandatory fields"),
		})
		return
	}

	if !passwordMatch(Email, OldPassword) {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Old password does not match"),
		})
		return
	}

	var HashedPassword []byte

	HashedPassword, err = bcrypt.GenerateFromPassword([]byte(NewPassword), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	//To check if the user actually inserted a different password
	if passwordMatch(Email, NewPassword) {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Please choose a password that you haven't used before"),
		})
		return
	}

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": fmt.Sprintf("Please use a different password you aren't currently using"),
		})
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

	c.JSON(http.StatusOK, gin.H{
		"message": fmt.Sprintf("Successfully updated " + FirstName + " " + LastName),
	})
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

	router := gin.Default()
	router.GET("/api/users", getAllUsers)
	router.GET("api/user/:id", getByID)
	router.POST("/api/user", createUser)
	router.DELETE("/api/user/:id", deleteUser)
	router.PUT("/api/user/:id", updateUser)
	router.PUT("/api/signin", signIn)
	router.PUT("/api/signout/:id", signOut)
	router.Run(":8000")
}
