package ticketson.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by shea on 2018/3/13.
 */
public class CreditHelper {
    private static List<Float> discounts = Arrays.asList(new Float[]{0.99f, 0.95f,0.88f,0.8f,0.77f,0.75f,0.7f});
    private static List<String> discountNames = Arrays.asList(new String[]{"九九折","九五折","八八折","八折","七七折","七五折","七折"});
    /**
     * 用户买票可以获得积分
     * @param pay
     * @return
     */
    public static int addCredit(double pay){
        return (int)pay/8;
    }

    /**
     * 用户退订票扣除积分
     * @param pay
     * @return
     */
    public static int takeOffCredit(double pay){
        return (int)pay/8;
    }

    /**
     * 根据用户的积分判断用户的等级
     * @param credit
     * @return
     */
    public static int judgeLevel(int credit){

        //初始等级为1
        return 1+credit/888;
    }

    public static float judgeDiscount(int level) {

        return level>=discounts.size()?discounts.get(discounts.size()-1):discounts.get(level-1);
    }

    public static String judgeDiscountName(float discount){
        int index = discounts.indexOf(discount);
        if(index==-1){
            return "无";
        }else {
            return discountNames.get(discounts.indexOf(discount));
        }
    }

    public static void main(String[] args) {
        System.out.println(CreditHelper.addCredit(430.8));
    }
}
