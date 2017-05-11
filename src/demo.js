function replace(number) {
    let strArr = String(number).split("");
    for(let i=1;i<strArr.length;i++){
        if(i%3===0){
            strArr.splice(i+1,0,",")
        }
    }
    return strArr;
}