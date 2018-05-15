package ticketson.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by shea on 2018/3/20.
 */
public class DateHelper {
    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy年M月d日 hh:mm:ss");

    public static String format(Long time){
        if(time==null){
            return "";
        }
        return dateFormat.format(new Date(time));
    }

}
