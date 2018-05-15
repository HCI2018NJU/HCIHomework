/**
 * Created by shea on 2018/2/11.
 */
$("#search-activity").css("display","none");

function delDate(event,dom) {
    if(event.code === 'Backspace'){
        $(dom).val('');
    }
}