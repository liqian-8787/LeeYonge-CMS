const loginForm=
{
    loginFormData:[],   
    init()
    {
        this.loginFormData.push(
            {
                label:'email',
                labelText:`Email`          
            }
        );       
        
        this.loginFormData.push(
            {
                label:'Password',
                labelText:`Password` ,
                placeHolder:`Between 6 to 12 characters` ,
                // fieldNotice:`<!> Passwords must consist of 6 to 12 characters`            
            }
        ); 
    },
    getLoginFormData()
    {
        return this.loginFormData;
    }
    
}

loginForm.init();
module.exports=loginForm;