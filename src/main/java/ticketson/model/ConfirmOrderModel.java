package ticketson.model;

import ticketson.entity.*;
import ticketson.util.CreditHelper;
import ticketson.util.DateHelper;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by shea on 2018/3/14.
 * 确认订单界面的信息
 */
public class ConfirmOrderModel {
    public Long oid;

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

    /**
     * 活动类型
     */
    public String aType;



    //下面是场馆信息
    /**
     * 场馆名称
     */
    public String vName;

    /**
     * 场馆城市
     */
    public int vCityCode;


    //下面是用户信息

    /**
     * 购买者的邮箱
     */
    public String email;

    /**
     * 购买者可用优惠券
     */
    public List<CouponModel> coupons = new ArrayList<>();


    //下面是票的信息

    public List<TicketModel> tickets = new ArrayList<>();


    public ConfirmOrderModel(Order order) {
        this.oid = order.getOid();
        this.orderDate = DateHelper.format(order.getOrderDate());
        this.totalAmount = order.getTotalAmount();
        this.totalPrice = order.getTotalPrice();
        this.payPrice = order.getPayPrice();
        this.discount = order.getDiscount();
        this.discountName = "无";
        this.isImmediatePurchase = order.getIsImmediatePurchase();
        this.prices = order.getPrices();
        this.level = order.getLevel();
        this.isUnSubscribed = order.getIsUnSubscribed();
        this.unSubscribeFees = order.getUnSubscribeFees();
        this.couponName = order.getCouponName();
        //如果是线下购买 todo 判断是否需要
        if(order.getIsOfflinePurchase()){
            state = "线下购买";
        }else {
            //如果已经退订
            if(order.getIsUnSubscribed()){
                if(order.getIsImmediatePurchase() && order.getIsAllocated() && !order.getAllocateSucceeded()){
                    state = "配票失败";
                }else {
                    state = "用户退订";
                }
                //如果没有退订
            }else {
                if(!order.getIsImmediatePurchase()){
                    state = "选座购买";
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
        Member member = order.getMember();
        if(member!=null){
            setMemberInfo(member);
        }
        List<Ticket> ticketList = order.getTickets();
        if(ticketList!=null){
            setTicketsInfo(ticketList);
        }

        
    }

    public void setPeriodInfo(Period period){
        this.time = DateHelper.format(period.getBegin());
        Activity activity = period.getActivity();
        if(activity!=null){
            setActivityInfo(activity);
        }
    }
    
    public void setActivityInfo(Activity activity){
        this.aName = activity.getName();
        this.aType = activity.getType();
        Venue venue = activity.getVenue();
        if(venue!=null){
            setVenueInfo(venue);
        }
    }
    
    public void setVenueInfo(Venue venue){
        this.vName = venue.getName();
        this.vCityCode = venue.getCityCode();
    }

    public void setMemberInfo(Member member){
        this.discount = CreditHelper.judgeDiscount(member.getLevel());
        this.discountName = CreditHelper.judgeDiscountName(this.discount);
        this.email = member.getEmail();
        List<Coupon> couponList = member.getCoupons();
        if(couponList!=null){
            System.out.println(couponList.size());
            long now = System.currentTimeMillis();
            for(Coupon cpn:couponList){
                //如果优惠券符合使用要求
                if(cpn.getConsumeTime() == null &&
                        cpn.getMin() < totalPrice &&
                        cpn.getValidDateBegin()<now &&
                        cpn.getValidDateEnd() >now){
                    CouponModel couponModel = new CouponModel(cpn);
                    coupons.add(couponModel);
                }
            }
        }
    }

    public void setTicketsInfo(List<Ticket> ticketList){
        for(Ticket ticket: ticketList){
            TicketModel ticketModel = new TicketModel(ticket);
            tickets.add(ticketModel);
        }
    }

    @Override
    public String toString() {
        return "ConfirmOrderModel{" +
                "oid=" + oid +
                ", orderDate=" + orderDate +
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
                ", time=" + time +
                ", aName='" + aName + '\'' +
                ", aType='" + aType + '\'' +
                ", vName='" + vName + '\'' +
                ", vCityCode=" + vCityCode +
                ", email='" + email + '\'' +
                ", coupons=" + coupons +
                ", tickets=" + tickets +
                '}';
    }
}
