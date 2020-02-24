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
                placeHolder:`At least 6 characters` ,
                fieldNotice:`<!> Passwords must consist of at least 6 characters`            
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