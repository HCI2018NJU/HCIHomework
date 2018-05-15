package ticketson.util;

/**
 * Created by shea on 2018/2/9.
 */
public class UnSubscribeHelper {
    public static double computeUnsubscribeFees(long orderDate,long beginDate,double totalPrice){
        long now = System.currentTimeMillis();
        double deduction = ((now-orderDate)/(1000*60*60*24)+1)*0.01*totalPrice;
        return deduction;
    }

}
