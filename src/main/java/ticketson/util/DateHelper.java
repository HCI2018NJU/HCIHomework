package ticketson.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by shea on 2018/3/20.
 */
public class DateHelper {
    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    public static final SimpleDateFormat dateFormat2 = new SimpleDateFormat("HH:mm");

    public static String format(Long time){
        if(time==null){
            return "";
        }
        String[] weekOfDays = {"星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"};
        Date date = new Date(time);
        Calendar calendar = Calendar.getInstance();
        if(date != null){
            calendar.setTime(date);
        }
        int w = calendar.get(Calendar.DAY_OF_WEEK) - 1;
        if (w < 0){
            w = 0;
        }
        return dateFormat.format(time)+" "+weekOfDays[w]+" "+dateFormat2.format(time);
    }

}
