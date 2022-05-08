  /*
   * generate random float
   */
  export function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
      return parseFloat(str);
  }
  
    /*
     * validation if its a number or not
     */
  export function checkNumber(x) {
    var isNum = false;
    if(typeof x == 'number' && !isNaN(x)){
        isNum = true;
    }
    return isNum;
  }