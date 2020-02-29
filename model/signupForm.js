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
                placeHolder:`At least 6 characters` 
             
            }
        ); 
        this.signupFormData.push(
            {
                label:'passwordConfirm',
                labelText:`Password Confirm`              
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