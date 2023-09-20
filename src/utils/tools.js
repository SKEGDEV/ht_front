

export default class tools{

  validateRegEx = function(item){
    const {regExp, plainText} = item;
    const isValid = new RegExp(regExp);
    if(isValid.test(plainText)){
      return true;
    }
    return false;
  }
}
