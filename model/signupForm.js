const signupForm=
{
    signupFormData :[],   
    init()
    {
        this.signupFormData.push(
            {
                label:'name',
                labelText:`Your Name`
                        
            }
        );       
        this.signupFormData.push(
            {
                label:'email',
                labelText:`Email`   
                           
            }
        );  
        this.signupFormData.push(
            {
                label:'password',
                labelText:`Password`,
                placeHolder:`At least 6 characters` ,
                fieldNotice:`<!> Passwords must consist of 6 to 12 characters`            
            }
        ); 
        this.signupFormData.push(
            {
                label:'passwordAgain',
                labelText:`Password again`              
            }
        ); 
    },
    getSignupFormData()
    {
        return this.signupFormData;
    }
    
}

signupForm.init();
module.exports=signupForm;