package ticketson.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ticketson.configuration.LayoutFileNameFilter;
import ticketson.dao.ActivityRepository;
import ticketson.dao.OrderRepository;
import ticketson.dao.VenueModifyRepository;
import ticketson.dao.VenueRepository;
import ticketson.entity.Activity;
import ticketson.entity.Order;
import ticketson.entity.Venue;
import ticketson.entity.VenueModify;
import ticketson.exception.InvalidRequestException;
import ticketson.model.VenueModel;
import ticketson.model.VenueStatisticsModel;
import ticketson.service.VenueService;
import ticketson.util.FileHelper;
import ticketson.util.ManagerHelper;
import ticketson.util.UuidHelper;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by shea on 2018/2/6.
 */
@Service
public class VenueServiceImpl implements VenueService {
    @Autowired
    VenueRepository venueRepository;
    @Autowired
    VenueModifyRepository venueModifyRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ActivityRepository activityRepository;
    /**
     * 生成七位注册码
     *
     * @return 生成的七位注册码
     */
    @Override
    public String generateRegistrationCode() {
        return UuidHelper.getShortUuid();
    }

    /**
     * 场馆注册
     *
     * @param name         名称
     * @param psw          密码
     * @param provinceCode 省
     * @param cityCode     市
     * @param districtCode 区
     * @param location     详细地址
     * @return
     */
    @Override
    public VenueModel register(String name, String psw, int provinceCode, int cityCode, int districtCode, String location) {
        Venue venue = new Venue();
        String vid = generateRegistrationCode();
        venue.setVid(vid);
        venue.setName(name);
        venue.setLocation(location);
        venue.setPsw(psw);
        venue.setCityCode(cityCode);
        venue.setDistrictCode(districtCode);
        venue.setProvinceCode(provinceCode);
        venue.setRegisterTime(System.currentTimeMillis());
        venue = venueRepository.save(venue);
        VenueModel venueModel = new VenueModel(venue);
        return venueModel;
    }

    @Override
    public void modifyInfo(String vid, String name, Integer provinceCode, Integer cityCode, Integer districtCode, String location) {
        VenueModify venueModify = new VenueModify();
        venueModify.setVmid(vid);
        venueModify.setLocation(location);
        venueModify.setName(name);
        venueModify.setCityCode(cityCode);
        venueModify.setDistrictCode(districtCode);
        venueModify.setProvinceCode(provinceCode);
        venueModify.setChecked(false);
        venueModify.setCheckPassed(false);
        venueModify.setModifyTime(System.currentTimeMillis());
        venueModifyRepository.save(venueModify);
    }

    @Override
    public VenueModel getInfo(String vid) {
        Venue venue = venueRepository.findOne(vid);
        return new VenueModel(venue);
    }


    /**
     * 检查用户名是否存在、用户名和密码是否匹配,返回venue记录
     *
     * @param vid 注册码
     * @param psw 密码
     * @return 审核不通过／未审核／用户名或密码错误／成功
     */
    @Override
    public void login(String vid, String psw) {
        Venue venue = venueRepository.findOne(vid);
        if(venue!=null){
            if(!venue.getPsw().equals(psw)) {
                throw new InvalidRequestException("用户名或密码错误");
            }else if(!venue.getChecked()){
                throw new InvalidRequestException("未审核");
            }else if(!venue.getCheckPassed()) {
                throw new InvalidRequestException("审核不通过");
            }
        }else {
            throw new InvalidRequestException("用户名或密码错误");
        }
        VenueModify venueModify = venueModifyRepository.findOne(vid);
        if(venueModify!=null){
            if(!venueModify.getChecked()){
                throw  new InvalidRequestException("修改未审核");
            }else if(!venueModify.getCheckPassed()){
                throw new InvalidRequestException("修改审核不通过");
            }
        }

    }

    /**
     * 设置座位总数
     *
     * @param vid
     * @param totalSeats
     */
    @Override
    public void setTotalSeats(String vid, int totalSeats) {
        Venue venue = venueRepository.findOne(vid);
        venue.setTotalSeats(totalSeats);
        venueRepository.save(venue);
    }

    /**
     * //找到vid_[0-9]的文件，读取内容，写进一个字符串数组
     *
     * @param vid 场馆ID
     * @return
     */
    @Override
    public List<String> getLayouts(String vid) {
        File path = new File(FileHelper.getVenueLayouts());
        String[] fileNames = path.list(new LayoutFileNameFilter(vid+"_"));
        List<String> layouts = new ArrayList<>();
        for (int i=0;i<fileNames.length;i++){
            layouts.add(FileHelper.readFile(FileHelper.getVenueLayouts()+fileNames[i]));
        }
        return layouts;
    }

    /**
     * 找到文件vid_lid,没有就创建，并且将layout写进文件
     *
     * @param vid    场馆ID
     * @param lid    layoutID
     * @param layout 平面图
     * @return 写入是否成功
     */
    @Override
    public void writeLayout(String vid, int lid, String layout) {
        String fileName = FileHelper.getVenueLayouts()+vid+"_"+lid;
        FileHelper.writeFile(fileName,layout);
    }

    /**
     * 找到文件m_vid_lid，没有就创建,并将layout写入文件
     *
     * @param vid    场馆注册码
     * @param lid    平面图id,场馆平面图id为0，看台平面图从1开始
     * @param layout 平面图
     * @return
     */
    @Override
    public String writeModifyLayout(String vid, int lid, String layout) {
        String fileName = FileHelper.getVenueModifyLayouts()+"m_"+vid+"_"+lid;
        FileHelper.writeFile(fileName,layout);
        return "success";
    }

    @Override
    public VenueStatisticsModel getStatistics(String vid) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yy年M月");
        //此时
        Calendar end = Calendar.getInstance();
        //五个月之前
        Calendar begin = Calendar.getInstance();
        begin.set(end.get(Calendar.YEAR),end.get(Calendar.MONTH)-4,1);
        //得到近五个月售票的活动
        List<Activity> activities = activityRepository.findByVenue_VidAndEndSellGreaterThanEqual(vid,begin.getTimeInMillis());
        //得到近五个月支付成功并且未退订的订单
        List<Order> orders = orderRepository.findByPeriod_Activity_Venue_VidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(vid,false,true,begin.getTimeInMillis(),end.getTimeInMillis());
        int unsubscribeNum = orderRepository.countByPeriod_Activity_Venue_VidAndIsUnSubscribedAndPaySuccessAndOrderDateGreaterThanEqualAndOrderDateLessThanEqual(vid,true,true,begin.getTimeInMillis(),end.getTimeInMillis());
        //近五个月的收入走势
        Map<String,Double> trend = new TreeMap<>();
        Map<String,Double> type = new TreeMap<>();
        Map<String,Integer> subscribe = new TreeMap<>();
        //初始化预订退订数目的map
        subscribe.put("退订数目",unsubscribeNum);
        subscribe.put("预订数目",orders.size());
        //初始化收入走势的map
        Calendar j = begin;
        while (j.getTimeInMillis()<=end.getTimeInMillis()){
            trend.put(simpleDateFormat.format(j.getTime()),0.0);
            j.set(j.get(Calendar.YEAR),j.get(Calendar.MONTH)+1,1);
        }
        for(Order order:orders){
            //设置该类型的订单金额
            if(type.containsKey(order.getType())){
                type.replace(order.getType(),type.get(order.getType())+order.getPayPrice()*(1-ManagerHelper.dividend) );
            }else {
                type.put(order.getType(),(double)order.getPayPrice()*(1-ManagerHelper.dividend));
            }
            //设置该月的订单收入金额
            Calendar orderDate = Calendar.getInstance();
            orderDate.setTimeInMillis(order.getOrderDate());
            String orderDateKey = simpleDateFormat.format(orderDate.getTime());
            trend.replace(orderDateKey,(double)order.getPayPrice()*(1-ManagerHelper.dividend)+trend.get(orderDateKey));
        }

        activities.sort((activity1,activity2)->{
            double totalTurnover1 = activity1.getTurnover()+activity1.getOfflineTurnover();
            double totalTurnover2 = activity2.getTurnover()+activity2.getOfflineTurnover();
            return totalTurnover1<totalTurnover2?1:-1;
        });
        int endIndex = activities.size()>=3?3:activities.size();
        return new VenueStatisticsModel(trend,type,subscribe,activities.subList(0,endIndex));
    }
}
