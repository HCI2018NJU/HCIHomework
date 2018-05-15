package ticketson.util;

import java.text.SimpleDateFormat;

/**
 * Created by shea on 2018/3/21.
 */
public class Test {
    public static void main(String[] args) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        System.out.println(simpleDateFormat.format(1509596157743l));
    }
}
