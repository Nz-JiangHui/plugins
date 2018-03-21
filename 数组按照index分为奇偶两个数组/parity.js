/**
 * Created by Nz on 2018/3/16.
 */
function filterArrayByIndexParity(arr) {
    function oddEven(bool) {
        return function (item,index){
            return !!(index%2) == !!bool;
        }
    }
    return {
        odd:arr.filter(oddEven(1)),
        even:arr.filter(oddEven(0))
    }
}
var arr = [1,2,3,4,5];
console.log(filterArrayByIndexParity(arr));