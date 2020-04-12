const productCategory=
{
    categories:[],
    init()
    {
        this.categories.push(
            {
                type:'Accessory',                
                description:`This is Accessory`,
                image_url:`/img/product_details/Accessory/accessory.jpg`
            }
        );
        this.categories.push(
            {
                type:'Gifts',                
                description:`This is Gifts`,
                image_url:'/img/product_details/Gifts/gifts.jpg'
            }
        );
        this.categories.push(
            {
                type:'Home Office',               
                description:`This is Home Office`,
                image_url:'/img/product_details/Home_Office/home_office.jpg'
            }
        );
        this.categories.push(
            {
                type:'Snack',                
                description:`This is Snack`,
                image_url:'/img/product_details/Snack/snack.jpg'
            }
        );            
    },
    getProductCategory()
    {
        const newCategories = this.categories.map((category)=>{
            return {
                type:category.type,
                slug:category.type.replace(/ /g,"_"),
                description:category.description,
                image_url:category.image_url
            }
        });
        return newCategories;
    }
}

productCategory.init();
module.exports=productCategory;