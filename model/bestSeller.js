const bestSeller=
{
    bestSellers:[],
    bestSellerSectionHeading:``,
    init()
    {
        this.bestSellerSectionHeading = "Today's deal";
        this.bestSellers.push({
            name:'CHORTAU Dash Cam',
            description:`CHORTAU Dash Cam 1080P FHD 2019 New Version Car Dash Camera 3 inch Dashboard Camera with Night Vision, 170°Wide Angle, Parking Monitor, Loop Recording
            CHORTAU Dash Cam`,
            image_url:`/img/best_seller/camera.jpg`,
            price:`99.99`});
    
        this. bestSellers.push({
            name:'Echo Dot',
            description:`Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal`,
            image_url:`/img/promotion/Echo_flex.jpg `,
        image_url:`/img/best_seller/echo_dot.jpg`,
            price:`44.99`});
    
        this.bestSellers.push({
            name:'Cyxus Blue Light Blocking Glasses ',
            description:`Cyxus Blue Light Blocking Glasses Filter UV400 Computer Gaming Reading Glasses for Women Men Square 
            Frame Eyeglasses Anti Eye Strain Minimize Headache (8082T01, Standard size)`,
        image_url:`/img/best_seller/glass.jpg`,
            price:`19.99`});

        this.bestSellers.push({
            name:'Hat',
            description:`Queenfur Knit Slouchy Beanie for Women Thick Baggy Hat Faux Fur Pompom Winter Hat`,
            image_url:`/img/best_seller/hat.jpg`,
            price:`18.99`});

        this.bestSellers.push({
            name:'Mask Respirator',
            description:`GVS Elipse SPR457 P100 Elipse Half Mask Respirator, Medium/Large.`,
                image_url:`/img/best_seller/mask.jpg`,
            price:`49.99`});
        
        this.bestSellers.push({
            name:'Sweatshirt',
            description:`Hanes Mens EcoSmart Fleece Sweatshirt.`,
            image_url:`/img/best_seller/T-Shirt.jpg`,
            price:`13.99`});

    },

    getBestSeller()
    {
        let bestSellerInfo = {
            bestSellerSectionHeading:this.bestSellerSectionHeading,
            bestSellers: this.bestSellers
        }
        return this.bestSellers;
        
    }

}

bestSeller.init();
module.exports=bestSeller;