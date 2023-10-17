
export const search_Actions = state =>{
  const {variant, item} = state;
  var type = ''
  switch(variant){
    case 1:
      type='ACTION_SET_IS_VISIBLE'
    break;
    case 2:
      type='ACTION_SET_INIT_OBJECT'
    break;
    case 3:
      type='ACTION_ON_CHANGE_INPUT'
    break;
  }
  return{
    type:type,
    payload:item
  };
}
