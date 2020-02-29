const products=
{
    productLists:[],

    init()
    {
        this.productLists.push(
            {
                name:'Toy',
                description:`AMOSTING Magentic Building Tiles Building Blocks Educational 
                Construction Building Toys for Boys and Girls...`,
                image_url:`/img/product_details/Gifts/toy.jpg`,
                price:`$23.99`,
                category:'Gifts',
                isBestSeller:false
            }
        );
        this.productLists.push(
            {
                name:'Echo Dot',
                description:`Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal`,
                image_url:`/img/product_details/Home_Office/echo_dot.jpg`,
                price:`$44.99`,
                category:'Home_Office',
                isBestSeller:true
            }
        );
        this.productLists.push(
            {
                name:'Echo Flex',
                description:`Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal`,
                image_url:`/img/product_details/Home_Office/Echo_flex.jpg`,
                price:`$24.99`,
                category:'Home_Office',
                isBestSeller:false
            }
        );
        this.productLists.push(
            {
                name:'ETEKCITY Digital Body Weight',
                description:`ETEKCITY Digital Body Weight Bathroom 
                Scale with Body Measuring Tape, Ultra Accurate...`,
                image_url:`/img/product_details/Home_Office/elec.jpg`,
                price:`$19.99`,
                category:'Home_Office',
                isBestSeller:true
            }
        );    
        this.productLists.push({
            name:'Phone Loops ',
            description:`Phone Loops Phone Grip Finger Strap Accessory for Mobile Cell Phone (Calavera)`,
            image_url:`/img/product_details/Accessory/accessory_1.jpg`,
            price:`19.99`,
            category:'Accessory',
            isBestSeller:false
        });

        // this.productLists.push(
        //     {
        //     name:'Mask Respirator',
        //     description:`GVS Elipse SPR457 P100 Elipse Half Mask Respirator, Medium/Large.`,
        //     image_url:`/img/product_details/Home_Office/mask.jpg`,
        //     price:`49.99`,
        //     category:'Home_Office',
        //     isBestSeller:true
        // });     

        this.productLists.push(
            {
                name:'Hazelnut Chocolate ',
                description:`Nutella and Go Snack Packs, Hazelnut Chocolate Spread with Breadsticks, 52 grams, Pack of 4`,
                image_url:`/img/product_details/Snack/snack_1.jpg`,
                price:`$4.99`,
                category:'Snack',
                isBestSeller:false
            }
        );       
    },

    getAllProducts()
    {
        return this.productLists;
    }

}

products.init();
module.exports=products;