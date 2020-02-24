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
                image_url:`/img/product_details/gifts/gifts.jpg`
            }
        );
        this.categories.push(
            {
                type:'Home Office',
                description:`This is Home Office`,
                image_url:`/img/product_details/home_office/home_office.jpg`
            }
        );
        this.categories.push(
            {
                type:'Snack',
                description:`This is Snack`,
                image_url:`/img/product_details/Snack/Snack.jpg`
            }
        );            
    },
    getProductCategory()
    {
        return this.categories;
    }
}

productCategory.init();
module.exports=productCategory;