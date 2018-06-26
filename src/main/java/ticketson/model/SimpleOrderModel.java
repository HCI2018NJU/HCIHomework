package ticketson.model;

import ticketson.entity.*;
import ticketson.util.CreditHelper;
import ticketson.util.DateHelper;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 * Created by shea on 2018/3/14.
 * 订单详情界面订单的信息
 */
public class SimpleOrderModel {
    public Long oid;
    public Long oidshow;

    /**
     * 订单生成时间，可以用来判断是否支付过期
     */
    public String orderDate;

    /**
     * 总票数
     */
    public int totalAmount;

    /**
     * 总价(原价)
     */
    public float totalPrice;

    /**
     * 实付价，折扣之后的价格
     */
    public float payPrice;

    /**
     * 会员折扣。会员折扣可以和优惠券一起使用。先折扣后减。但不可以同时使用多张优惠券
     */
    public float discount;
    public String discountName;

    /**
     * 选座购买或直接购买,默认为选座购买,isImmediatePurchase为false
     */
    public boolean isImmediatePurchase;

    /**
     * 订单中所有可能的票价
     */
    public String prices;

    /**
     * 当直接购买的时候，选择等级
     */
    public int level;

    /**
     * 是否被退订
     */
    public boolean isUnSubscribed;

    /**
     * 退订后被扣除的手续费
     */
    public double unSubscribeFees;

    /**
     * 订单状态
     */
    public String state;

    /**
     * 购买者使用的优惠券的名称
     */
    public String couponName;



    //下面是场次信息

    /**
     * 订单选择的场次的开始时间
     */
    public String time;



    //下面是活动信息


    /**
     * 活动名称
     */
    public String aName;

    public long aid;

    /**
     * 活动类型
     */
    public String aType;

    public String aUrl;


    //下面是场馆信息
    /**
     * 场馆名称
     */
    public String vName;

    /**
     * 场馆城市
     */
    public int vCityCode;

    public boolean canUnsubscribe;

    public SimpleOrderModel() {
    }

    public SimpleOrderModel(Order order) {
        this.oid = order.getOid();
        this.oidshow = Long.MAX_VALUE/2-this.oid;
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm");
        this.orderDate = simpleDateFormat.format(order.getOrderDate());
        this.totalAmount = order.getTotalAmount();
        this.totalPrice = order.getTotalPrice();
        this.payPrice = order.getPayPrice();
        this.discount = order.getDiscount();
        this.discountName = CreditHelper.judgeDiscountName(this.discount);
        this.isImmediatePurchase = order.getIsImmediatePurchase();
        this.prices = order.getPrices();
        this.level = order.getLevel();
        this.isUnSubscribed = order.getIsUnSubscribed();
        this.unSubscribeFees = order.getUnSubscribeFees();
        this.couponName = order.getCouponName();
        this.canUnsubscribe = true;
        if(this.couponName==null){
            this.couponName = "无优惠券";
        }
        //如果是线下购买
        if(order.getIsOfflinePurchase()){
            state = "线下购买";
            this.canUnsubscribe = false;
        }else {
            //如果已经退订
            if(order.getIsUnSubscribed()){
                if(order.getIsImmediatePurchase() && order.getIsAllocated() && !order.getAllocateSucceeded()){
                    state = "配票失败";
                }else {
                    state = "已退订";
                }
                //如果没有退订
            }else {
                if(!order.getPaySuccess()){
                    state = "等待支付";
                }if(!order.getIsImmediatePurchase()){
                    state = "预定成功";
                    //如果是直接购买
                }else if(order.getIsImmediatePurchase()&&!order.getIsAllocated()){
                    state = "未配票";
                }else if(order.getIsImmediatePurchase() && order.getIsAllocated() && order.getAllocateSucceeded()){
                    state = "已配票";
                }
            }
        }

        Period period = order.getPeriod();
        if(period!=null){
            setPeriodInfo(period);
        }

    }

    private void setPeriodInfo(Period period){
        this.time = DateHelper.format(period.getBegin());
        //如果已经开场，则不可以退订
        if(period.getBegin()<System.currentTimeMillis()){
            this.canUnsubscribe = false;
        }
        Activity activity = period.getActivity();
        if(activity!=null){
            setActivityInfo(activity);
        }
    }

    private void setActivityInfo(Activity activity){
        this.aName = activity.getName();
        this.aType = activity.getType();
        this.aUrl = activity.getUrl();
        this.aid = activity.getAid();
        Venue venue = activity.getVenue();
        if(venue!=null){
            setVenueInfo(venue);
        }
    }

    private void setVenueInfo(Venue venue){
        this.vName = venue.getName();
        this.vCityCode = venue.getCityCode();
    }

    @Override
    public String toString() {
        return "SimpleOrderModel{" +
                "oid=" + oid +
                ", orderDate='" + orderDate + '\'' +
                ", totalAmount=" + totalAmount +
                ", totalPrice=" + totalPrice +
                ", payPrice=" + payPrice +
                ", discount=" + discount +
                ", isImmediatePurchase=" + isImmediatePurchase +
                ", prices='" + prices + '\'' +
                ", level=" + level +
                ", isUnSubscribed=" + isUnSubscribed +
                ", unSubscribeFees=" + unSubscribeFees +
                ", state='" + state + '\'' +
                ", couponName='" + couponName + '\'' +
                ", time='" + time + '\'' +
                ", aName='" + aName + '\'' +
                ", aType='" + aType + '\'' +
                ", vName='" + vName + '\'' +
                ", vCityCode=" + vCityCode +
                ", canUnsubscribe=" + canUnsubscribe +
                '}';
    }
}
