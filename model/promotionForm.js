const promotionForm=
{
    promotion:[],
    init()
    {
        this.promotion.push(
            {
                type:'Toy',
                description:`AMOSTING Magentic Building Tiles Building Blocks Educational 
                Construction Building Toys for Boys and Girls Colorful Durable - 56 pcs`,
                image_url:`/img/promotion/toy.jpg`,
                price:`$23.99`,
                orignal_price:`$39.99`
            }
        );
        this.promotion.push(
            {
                type:'Echo Dot',
                description:`Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal`,
                image_url:`/img/promotion/Echo_dot.jpg`,
                price:`$44.99`,
                orignal_price:`$64.99`
            }
        );
        this.promotion.push(
            {
                type:'Echo Flex',
                description:`Echo Dot (3rd gen) - Smart speaker with Alexa - Charcoal`,
                image_url:`/img/promotion/Echo_flex.jpg`,
                price:`$24.99`,
                orignal_price:`$34.99`
            }
        );
        this.promotion.push(
            {
                type:'ETEKCITY Body Weight',
                description:`ETEKCITY Digital Body Weight Bathroom 
                Scale with Body Measuring Tape, Ultra Accurate, Large Easy-to-Read Backlit LCD Display, Step-On Technology, 400 lb/180 kg`,
                image_url:`/img/promotion/elec.jpg`,
                price:`$19.99`,
                orignal_price:`$31.99`
            }
        );         
        this.promotion.push(
            {
                type:'VIVOSUN fan',
                description:`VIVOSUN 4 inch Inline Duct Booster Fan 100 CFM, Extreme Low Noise & Extra Long 5.5' Grounded Power Cord`,
                image_url:`/img/promotion/fan.jpg`,
                price:`$19.99`,
                orignal_price:`$25.99`
            }
        );    
        this.promotion.push(
            {
                type:'LEVOIT Top Fill',
                description:`LEVOIT Top Fill BPA Free Ultrasonic Cool Mist Humidifier for Bedroom;
                 Whisper Quiet Essential Oil Diffuser, 3 Mist Levels, 1.8L/0.48 Gallon`,
                image_url:`/img/promotion/levoit.jpg`,
                price:`$59.99`,
                orignal_price:`$79.99`
            }
        );       
    },
    getProductPromotion()
    {
        return this.promotion;
    }
}

promotionForm.init();
module.exports=promotionForm;