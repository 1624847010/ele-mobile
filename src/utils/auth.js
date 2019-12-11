import Cookies from 'js-cookie'

const USERLOGINKEY = "eleUserLoginKey"
export function setUserId(value){
    Cookies.set(USERLOGINKEY,value)
}
export function getUserId(){
    return Cookies.get(USERLOGINKEY)
}
export function removeUserId(){
    Cookies.remove(USERLOGINKEY)
}