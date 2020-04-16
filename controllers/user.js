const express = require('express')
const router = express.Router();
const userModel = require("../model/user");
const path = require("path");
const bcrypt = require("bcryptjs");
const signupFormModel = require("../model/signupForm");
const loginFormModel = require("../model/loginForm");
const isAuthenticated = require("../middleware/auth");
const dashBoardLoader = require("../middleware/authorization");
//signup router
router.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Sign Up",
        headingInfo: "Sign Up",
        hasError: "",
        signupForm: signupFormModel.getSignupFormData().map(data => {
            //remove properties from data
            delete data.value;
            delete data.errorMessage;
            return data;
        })
    });
});

router.post("/signup", (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;
    let signupFormData = signupFormModel.getSignupFormData();
    for (var index in signupFormData) {
        let self = signupFormData[index];
        switch (self.label) {
            case "name":
                if (name == "") {
                    delete self.value;
                    self.errorMessage = "<!> Enter your name";
                }
                else {
                    self.value = name;
                    delete self.errorMessage;
                }
                break;
            case "email":
                let emailPattern = new RegExp(/^([a-zA-Z0-9.]+)@([a-zA-Z0-9.]+)\.([a-zA-Z]{2,5})$/);
                if (email == "") {
                    delete self.value;
                    self.errorMessage = "<!> Enter your e-mail";
                }
                else if (!(emailPattern.test(email))) {
                    delete self.value;
                    self.errorMessage = "<!> Password must be like: somthing@someserver.com";
                }
                else {
                    self.value = email;
                    delete self.errorMessage;
                }
                break;
            case "password":
                let passwordPattern = new RegExp(/^[A-Za-z0-9]{6,12}$/);
                if (password == "") {
                    delete self.value;
                    self.errorMessage = "<!> Enter your password";
                }
                else if (!(passwordPattern.test(password))) {
                    delete self.value;
                    self.errorMessage = "<!> Password must consist of 6 to 12 characters(letters and numbers)";
                } else {
                    self.value = password;
                    delete self.errorMessage;
                }
                break;
            case "passwordConfirm":
                if (passwordConfirm == "" || passwordConfirm !== password) {
                    delete self.value;
                    self.errorMessage = "<!> Password must be match";
                } else {
                    self.value = password;
                    delete self.errorMessage;
                }
                break;
        }
    }

    if (signupFormData.filter(errors => errors.errorMessage).length)//if there is errors in signupformdata
    {
        res.render("signup", {
            signupForm: signupFormData
        });
    }
    else {
        const newUser =
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        }
        const user = new userModel(newUser);
        userModel.findOne({ email: user.email })
            .then(doc => {
                if (doc != null) {
                    res.render('general/error', {
                        errorMessage: `Singup failed: User email has already been registered!`
                    })
                } else {
                    user.save()
                        .then(() => {
                            const sgMail = require('@sendgrid/mail');
                            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                            const msg = {
                                from: `${process.env.SENDER_EMAIL_ADDRESS}`,
                                to: `${email}`,
                                subject: 'Signup form submitted',
                                html:
                                    `<strong>Hi.${name}!  welcome to Amazon.</br> 
                         Now, you can log in and enjoy your shopping time!!!</strong>`,
                            };

                            sgMail.send(msg)
                                .then(() => {
                                    console.log(`Email sent!`)
                                })
                                .catch(err => {
                                    console.log(`Error ${err}`);
                                })
                            res.render("dashboard", {
                                name: `${name}`
                            })
                        })
                        .catch(err => console.log(`Error happened when inserting in the database :${err}`));
                }
            })
    }

});

//login router
router.get("/login", (req, res) => {
    res.render("login", {
        title: "Log In",
        headingInfo: "Log In",
        loginForm: loginFormModel.getLoginFormData().map(data => {
            delete data.value;     //remove properties from data
            delete data.errorMessage;
            return data;
        }),
        userInfo: req.session.userInfo
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    let loginFormData = loginFormModel.getLoginFormData();
    for (var index in loginFormData) {
        let self = loginFormData[index];
        switch (self.label) {
            case "email":
                if (email == "") {
                    delete self.value;
                    self.errorMessage = "<!> Enter your e-mail";
                }
                else {
                    self.value = email;
                    delete self.errorMessage;
                }
                break
            case "password":
                if (password == "") {
                    delete self.value;
                    self.errorMessage = "<!> Enter your password";

                } else {
                    self.value = password;
                    delete self.errorMessage;
                }
                break;
        }
    }

    if (loginFormData.filter(error => error.errorMessage).length)//if there is errors in signupformdata
    {
        res.render("login", {
            loginForm: loginFormData
        });
    }
    else {
        userModel.findOne({ email: req.body.email })
            .then(user => {

                const errors = [];

                //email not found
                if (user == null) {
                    errors.push("Sorry, your email and/or password incorrect");
                    res.render("login", {
                        title: "Log In",
                        headingInfo: "Log In",
                        errors: errors,
                        loginForm: loginFormModel.getLoginFormData().map(data => {
                            delete data.value;     //remove properties from data
                            delete data.errorMessage;
                            return data;
                        })
                    })

                }

                //email is found
                else {

                    bcrypt.compare(req.body.password, user.password)
                        .then(isMatched => {

                            if (isMatched) {
                                console.log(`user auth pass!`)
                                //cretae our sessoin
                                req.session.userInfo = user;
                                res.redirect("/user/profile");
                            }

                            else {
                                errors.push("Sorry, your email and/or password incorrect ");
                                res.render("login", {
                                    title: "Log In",
                                    headingInfo: "Log In",
                                    errors: errors,
                                    loginForm: loginFormModel.getLoginFormData().map(data => {
                                        delete data.value;     //remove properties from data
                                        delete data.errorMessage;
                                        return data;
                                    })
                                })
                            }

                        })
                        .catch(err => console.log(`Error ${err}`));
                }


            })
            .catch(err => console.log(`Error ${err}`));
    }
});

router.get("/profile", isAuthenticated, (req,res)=>{
    console.log(req.session.userInfo.name);
    if(req.session.userInfo.role == "Clerk"){
        res.redirect("/product/list")
    }else{
        res.redirect("/products")
    }
    
});

router.get("/logout", (req, res) => {

    req.session.destroy();
    res.redirect("/user/login")

})
module.exports = router;