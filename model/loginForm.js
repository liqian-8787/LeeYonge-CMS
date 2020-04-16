const loginForm=
{
    loginFormData:[],   
    init()
    {
        this.loginFormData.push(
            {
                label:'email',
                labelText:`Email`  ,
                type:`text`         
            }
        );       
        
        this.loginFormData.push(
            {
                label:'password',
                labelText:`Password` ,
                placeHolder:`Between 6 to 12 characters` ,
                type:`password`      
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