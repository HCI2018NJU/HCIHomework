package ticketson.util;

import ticketson.entity.Coupon;
import ticketson.model.CouponTypeModel;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/2/24.
 */
public class CouponHelper {
    /**
     * 有效时长30天
     */
    private static final long validTime = 1000*60*60*24*30L;
    /**
     * 优惠券需满足的金额
     */
    private static final float[] min = {100,500,1000,2000,3000,
    600,1200,2400,3600};
    /**
     * 优惠额度
     */
    private static final float[] minus = {3,30,100,300,600,
    40,200,450,720};
    /**
     * 兑换优惠券需要的积分
     */
    private static final int[] minCredits = {500,1500,3000,5000,8000,0,0,0,0};
    /**
     * 优惠券名称
     */
    private static final String[] name = {"TicketsOn满百减三","TicketsOn满五百减三十","TicketsOn满一千减一百","TicketsOn满两千减三百","TicketsOn满三千减六百",
    "TicketsOn团购满六百减四十","TicketsOn团购满一千二减二百","TicketsOn团购满二千四减四百五","TicketsOn团购满三千六减七百二"};


    public static int getPersonalCouponTypeSize(){
        return 5;
    }
    /**
     * 根据现有积分返回可以兑换的优惠券
     * @param credit 现有积分
     * @return
     */
    public static List<CouponTypeModel> judgeCoupon(int credit){
        int left = credit;
        List<CouponTypeModel> couponTypeModels = new ArrayList<>();
        for(int i=minCredits.length-5;i>=0;i--){
            if(left>=minCredits[i]){
                CouponTypeModel couponTypeModel = new CouponTypeModel(i,name[i],minCredits[i],min[i],minus[i]);
                couponTypeModels.add(couponTypeModel);
                left-=minCredits[i];
            }
        }
        return couponTypeModels;
    }

    /**
     * 制作优惠券
     * @param type
     * @return
     */
    public static Coupon makeCoupon(int type){
        Coupon coupon = new Coupon();
        coupon.setMinus(minus[type]);
        coupon.setMin(min[type]);
        coupon.setName(name[type]);
        coupon.setType(type);
        coupon.setMinCredit(minCredits[type]);
        long validBegin = System.currentTimeMillis();
        long validEnd = validBegin+validTime;
        coupon.setValidDateBegin(validBegin);
        coupon.setValidDateEnd(validEnd);
        return coupon;
    }

    public static Coupon makeCoupon(double price){
        for(int i=min.length-1;i>=min.length-4;i--){
            if(price>min[i]){
                return makeCoupon(i);
            }
        }
        return null;
    }

    public static int judgeCouponType(double price){
        for(int i=min.length-1;i>=min.length-4;i--){
            if(price>min[i]){
                return i;
            }
        }
        return -1;
    }
}
