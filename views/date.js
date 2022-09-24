
// exports.getDate=function()
// {

//  let today = new Date();

//  let options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long"
// };

// return  today.toLocaleDateString("en-us", options);

// }

exports.getTime=function()
{

    let clock = new Date();
    
    let watch = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    };
    
    return clock.toLocaleTimeString("en-us", {
        timeZone: 'Asia/Kolkata'
    }, watch);
    
    }