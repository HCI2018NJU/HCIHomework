package ticketson.service.serviceimpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ticketson.configuration.FilePathConfig;
import ticketson.configuration.LayoutFileNameFilter;
import ticketson.dao.ActivityRepository;
import ticketson.dao.PeriodRepository;
import ticketson.dao.SeatRepository;
import ticketson.dao.VenueRepository;
import ticketson.entity.Activity;
import ticketson.entity.Period;
import ticketson.entity.Seat;
import ticketson.entity.Venue;
import ticketson.exception.InvalidRequestException;
import ticketson.exception.MethodFailureException;
import ticketson.model.*;
import ticketson.service.ActivityService;
import ticketson.service.VenueService;
import ticketson.util.FileHelper;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by shea on 2018/2/6.
 */
@Service
public class ActivityServiceImpl implements ActivityService{
    @Autowired
    ActivityRepository activityRepository;
    @Autowired
    VenueRepository venueRepository;
    @Autowired
    PeriodRepository periodRepository;
    @Autowired
    SeatRepository seatRepository;

    @Autowired
    VenueService venueService;

    /**
     * 找到文件a_aid_lid，没有就创建,并将layout写入文件
     * @param aid    活动ID
     * @param lid    本次活动的layoutID
     * @param layout 平面图
     * @return 写入成功与否
     */
    @Override
    public void writeActivityLayout(long aid, int lid, String layout) {
        String fileName = FileHelper.getVenueActivityLayouts()+"a_"+aid+"_"+lid;
        FileHelper.writeFile(fileName,layout);
    }

    /**
     * //找到a_aid_[0-9]的文件，读取内容，写进一个字符串数组
     *
     * @param aid 场馆ID
     * @return
     */
    @Override
    public List<String> getLayouts(long aid) {
        File path = new File(FileHelper.getVenueActivityLayouts());
        String[] fileNames = path.list(new LayoutFileNameFilter("a_"+aid+"_"));
        List<String> layouts = new ArrayList<>();
        for (int i=0;i<fileNames.length;i++){
            layouts.add(FileHelper.readFile(FileHelper.getVenueActivityLayouts()+fileNames[i]));
        }
        if(layouts.size()==0){
            Activity activity = activityRepository.findOne(aid);
            Venue venue = activity.getVenue();
            String vid = venue.getVid();
            layouts = venueService.getLayouts(vid);
        }
        return layouts;
    }

    /**
     * 场馆提交活动基本信息(并不包括座位价格信息)
     * @param vid 场馆注册码
     * @param name 活动名称
     * @param periods 活动的时间段
     * @param type 活动类型
     * @param description 活动描述
     * @return
     */
    @Override
    public SpecificActivityModel insertActivity(String vid,String name,String type,String fatherType,String description,String[] periods, String url, String prices) {
        Venue venue = venueRepository.findOne(vid);
        //创建并保存一条活动记录
        Activity activity = new Activity();
        activity.setVenue(venue);
        activity.setName(name);
        activity.setType(type);
        activity.setFatherType(fatherType);
        activity.setDescription(description);
        activity.setUrl(url);
        activity.setPrices(prices);
        activity.setVname(venue.getName());
        activity.setCityCode(venue.getCityCode());
        activity = activityRepository.saveAndFlush(activity);
        //保存场次
        List<Period> periodList = new ArrayList<>();
        //记录第一场活动的开始时间、最后一场活动的结束时间、最后一场活动的开始时间
        long firstBegin = 0;
        long lastEnd = 0;
        long endSell = 0;
        for (String s:periods){
            //将场次的起止时间转成long存储
            String beginText = s.split(" - ")[0];
            String endText = s.split(" - ")[1];
            Date beginDate;
            Date endDate;
            SimpleDateFormat sdf= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            try {
                beginDate = sdf.parse(beginText);
                endDate = sdf.parse(endText);
            } catch (ParseException e) {
                e.printStackTrace();
                throw new InvalidRequestException("时间解析错误");
            }
            long begin = beginDate.getTime();
            long end = endDate.getTime();
            //前端确保begin在end之前，并且时间段不会重复
            if(firstBegin==0 || firstBegin > begin){
                firstBegin = begin;
            }
            if(lastEnd==0 || lastEnd <end){
                lastEnd = end;
                endSell = begin;
            }
            //保存一条场次记录
            Period period = new Period();
            period.setEnd(end);
            period.setBegin(begin);
            period.setActivity(activity);
            periodList.add(period);
        }
        periodRepository.save(periodList);
        activity.setPeriods(periodList);
        //设置activity中的begin、end、endsell属性
        activity.setBegin(firstBegin);
        activity.setEnd(lastEnd);
        activity.setEndSell(endSell);
        activity = activityRepository.saveAndFlush(activity);

        SpecificActivityModel activityModel = new SpecificActivityModel(activity);
        return activityModel;
    }

    /**
     * 获得活动详情
     * @param aid
     * @return
     */
    public SpecificActivityModel getActivity(long aid){
        Activity activity = activityRepository.findOne(aid);
        activity.setPageView(activity.getPageView()+1);
        activityRepository.save(activity);
        return new SpecificActivityModel(activity);
    }

    /**
     * 向activity表、period表、seat表插入数据
     *
     * @param aid         活动ID
     * @param seatModels     座位信息（位置等级价格等），每一个活动计划虽然有多个时间段，但是每个活动只有一组平面图，但是会存储多组座位信息。
     *                    每次初始化活动平面图的时候，根据座位ID查询相关组的座位信息，判断是否可售
     * @return
     */
    @Override
    public void insertActivitySeats(long aid, List<SeatModel> seatModels) {
        List<Period> periods = periodRepository.findByActivity_Aid(aid);
        List<Seat> seats = new ArrayList<>();
        for(int i=0;i<periods.size();i++){
            for (int j=0;j<seatModels.size();j++){
                SeatModel seatVo = seatModels.get(j);
                Seat seat = new Seat();
                seat.setColumn(seatVo.column);
                seat.setIsAvailable(seatVo.isAvailable);
                seat.setFloor(seatVo.floor);
                seat.setGs(seatVo.gs);
                seat.setLayoutSid(seatVo.layout_sid);
                seat.setLevel(seatVo.level);
                seat.setRow(seatVo.row);
                seat.setPrice(seatVo.price);
                seat.setPeriod(periods.get(i));
                seats.add(seat);
            }
        }
        seatRepository.save(seats);
    }

    @Override
    public void setLowestPrice(long aid, float lowestPrice) {
        Activity activity = activityRepository.findOne(aid);
        activity.setLowestPrice(lowestPrice);
        activityRepository.save(activity);
    }


    @Override
    public String postPhoto(String vid, MultipartFile file){
        // 文件保存路径
        String filePath = FilePathConfig.PATH +vid+"_"+ System.currentTimeMillis()+file.getOriginalFilename();
        // 文件url
        String fileUrl = FilePathConfig.URL +vid+"_"+ System.currentTimeMillis()+file.getOriginalFilename();
        if (!file.isEmpty()) {
            try {
                File dest = new File(filePath);

                // 检测是否存在目录
                if (!dest.getParentFile().exists()) {
                    dest.getParentFile().mkdirs();
                }

                file.transferTo(dest);
                return fileUrl;
            } catch (Exception e) {
                e.printStackTrace();
                throw new MethodFailureException("文件上传出错");
            }
        }else {
            throw new InvalidRequestException("文件不存在");
        }
    }

    /**
     * 在activity数据表中找寻符合数目的记录列表,获得正在卖票的活动
     *
     * @param page    第几页
     * @param perPage 每页几个活动
     * @return 正在卖票的活动
     */
    @Override
    public List<ActivityModel> getActivities(String type,String fatherType,Integer cityCode,Integer timeType,Integer page, Integer perPage) {
        Sort sort = new Sort(Sort.Direction.DESC,"endSell");
        PageRequest pageRequest = new PageRequest(page,perPage,sort);
        List<Activity> activities = filter(type,fatherType,cityCode,timeType,pageRequest);
        System.out.println("activitySize:"+activities.size());
        List<ActivityModel> result = new ArrayList<>();
        Activity activity = null;
        for (int i = 0; i < activities.size(); i++) {
            activity = activities.get(i);
            ActivityModel activityModel = new ActivityModel(activity);
            result.add(activityModel);
        }
        return result;
    }

    private List<Activity> filter(String type,String fatherType,Integer cityCode,Integer timeType,PageRequest pageRequest){
        long now = System.currentTimeMillis();
        System.out.println(type.equals(""));
        System.out.println(fatherType.equals(""));
        System.out.println(cityCode==0);
        //所有时间
        if(timeType==null||timeType==0){
            if(cityCode==0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.findByEndSellGreaterThan(now,pageRequest).getContent();
            }else if(cityCode==0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.findByFatherTypeAndEndSellGreaterThan(fatherType,now,pageRequest).getContent();
            }else if(cityCode==0&&!type.equals("")){
                return activityRepository.findByTypeAndEndSellGreaterThan(type,now,pageRequest).getContent();
            }if(cityCode!=0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.findByCityCodeAndEndSellGreaterThan(cityCode,now,pageRequest).getContent();
            }else if(cityCode!=0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.findByCityCodeAndFatherTypeAndEndSellGreaterThan(cityCode,fatherType,now,pageRequest).getContent();
            }else if(cityCode!=0&&!type.equals("")){
                return activityRepository.findByCityCodeAndTypeAndEndSellGreaterThan(cityCode,type,now,pageRequest).getContent();
            }
        }else {
            long time = getTime(timeType);
            if(cityCode==0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.findByEndSellGreaterThanAndEndSellLessThanEqual(now,time,pageRequest).getContent();
            }else if(cityCode==0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.findByFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(fatherType,now,time,pageRequest).getContent();
            }else if(cityCode==0&&!type.equals("")){
                return activityRepository.findByTypeAndEndSellGreaterThanAndEndSellLessThanEqual(type,now,time,pageRequest).getContent();
            }if(cityCode!=0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.findByCityCodeAndEndSellGreaterThanAndEndSellLessThanEqual(cityCode,now,time,pageRequest).getContent();
            }else if(cityCode!=0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.findByCityCodeAndFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(cityCode,fatherType,now,time,pageRequest).getContent();
            }else if(cityCode!=0&&!type.equals("")){
                return activityRepository.findByCityCodeAndTypeAndEndSellGreaterThanAndEndSellLessThanEqual(cityCode,type,now,time,pageRequest).getContent();
            }


        }

        return activityRepository.findByEndSellGreaterThan(now,pageRequest).getContent();

    }
    
    private long getTime(int timeType){
        Calendar calendar = Calendar.getInstance();
        long time = System.currentTimeMillis();
        if(timeType==1){
            //today
            calendar.set(calendar.get(Calendar.YEAR),Calendar.MONTH,Calendar.DATE);
            time = calendar.getTimeInMillis();
        }else if(timeType==2){
            //tomorrow
            calendar.set(calendar.get(Calendar.YEAR),Calendar.MONTH,Calendar.DATE+1);
            time = calendar.getTimeInMillis();
        }else if(timeType==3){
            //within a week
            calendar.set(calendar.get(Calendar.YEAR),Calendar.MONTH,Calendar.DATE+7);
            time = calendar.getTimeInMillis();
        }else if(timeType==4){
            //within a month
            calendar.set(calendar.get(Calendar.YEAR),Calendar.MONTH+1,Calendar.DATE);
            time = calendar.getTimeInMillis();
        }
        return time;
    }

    @Override
    public int countActivities(String type,String fatherType,Integer cityCode,Integer timeType) {
        long now = System.currentTimeMillis();
        //所有时间
        if(timeType==null||timeType==0){
            if(cityCode==0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.countByEndSellGreaterThan(now);
            }else if(cityCode==0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.countByFatherTypeAndEndSellGreaterThan(fatherType,now);
            }else if(cityCode==0&&!type.equals("")){
                return activityRepository.countByTypeAndEndSellGreaterThan(type,now);
            }if(cityCode!=0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.countByCityCodeAndEndSellGreaterThan(cityCode,now);
            }else if(cityCode!=0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.countByCityCodeAndFatherTypeAndEndSellGreaterThan(cityCode,fatherType,now);
            }else if(cityCode!=0&&!type.equals("")){
                return activityRepository.countByCityCodeAndTypeAndEndSellGreaterThan(cityCode,type,now);
            }
        }else {
            long time = getTime(timeType);
            if(cityCode==0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.countByEndSellGreaterThanAndEndSellLessThanEqual(now,time);
            }else if(cityCode==0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.countByFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(fatherType,now,time);
            }else if(cityCode==0&&!type.equals("")){
                return activityRepository.countByTypeAndEndSellGreaterThanAndEndSellLessThanEqual(type,now,time);
            }if(cityCode!=0&&type.equals("")&&fatherType.equals("")){
                return activityRepository.countByCityCodeAndEndSellGreaterThanAndEndSellLessThanEqual(cityCode,now,time);
            }else if(cityCode!=0&&type.equals("")&&!fatherType.equals("")){
                return activityRepository.countByCityCodeAndFatherTypeAndEndSellGreaterThanAndEndSellLessThanEqual(cityCode,fatherType,now,time);
            }else if(cityCode!=0&&!type.equals("")){
                return activityRepository.countByCityCodeAndTypeAndEndSellGreaterThanAndEndSellLessThanEqual(cityCode,type,now,time);
            }


        }

        return activityRepository.countByEndSellGreaterThan(now);

    }

    /**
     * 根据场馆ID得到活动
     *
     * @param vid
     * @param type    -1表示已经结束，0表示进行，1表示尚未开始
     * @param page
     * @param pageNum
     * @return
     */
    @Override
    public List<ActivityModel> getActivitiesByVid(String vid, int type, int page, int pageNum) {
        Page<Activity> activityPage;
        List<Activity> activities;
        long now = System.currentTimeMillis();
        Pageable pageable = new PageRequest(page,pageNum,Sort.Direction.DESC,"endSell");
        switch (type){
            case -1:
                activityPage = activityRepository.findByVenue_VidAndEndLessThan(vid,now,pageable);
                activities =activityPage.getContent();
                break;
            case 0:
                activityPage = activityRepository.findByVenue_VidAndBeginLessThanEqualAndEndGreaterThanEqual(vid,now,now,pageable);
                activities =activityPage.getContent();
                break;
            case 1:
                activityPage = activityRepository.findByVenue_VidAndBeginGreaterThan(vid,now,pageable);
                activities = activityPage.getContent();
                break;
            default:
                activities = new ArrayList<>();
                break;
        }
        List<ActivityModel> activityModels = new ArrayList<>();
        for(Activity activity:activities){
            activityModels.add(new ActivityModel(activity));
        }
        return activityModels;
    }

    /**
     * 根据场馆ID得到活动数目
     *
     * @param vid
     * @param type -1表示已经结束，0表示进行，1表示尚未开始
     * @return
     */
    @Override
    public int getActivitiesTotalNumByVid(String vid, int type) {
        long now = System.currentTimeMillis();
        int count = 0;
        switch (type){
            case -1:
                count = activityRepository.countByVenue_VidAndEndLessThan(vid,now);
                break;
            case 0:
                count = activityRepository.countByVenue_VidAndBeginLessThanEqualAndEndGreaterThanEqual(vid,now,now);
                break;
            case 1:
                count = activityRepository.countByVenue_VidAndBeginGreaterThan(vid,now);
                break;
            default:
                break;
        }
        return count;
    }

    @Override
    public int getStatisticsTotalNum(String vid) {
        return activityRepository.countByVenue_Vid(vid);
    }

    @Override
    public List<ActivityStatisticsModel> getStatistics(String vid, int page, int perPage) {
        Pageable pageable = new PageRequest(page,perPage,Sort.Direction.DESC,"endSell");
        Page<Activity> activityPage = activityRepository.findByVenue_Vid(vid,pageable);
        List<Activity> activities = activityPage.getContent();
        List<ActivityStatisticsModel> result = new ArrayList<>();
        activities.forEach(activity -> {
            result.add(new ActivityStatisticsModel(activity));
        });
        return result;
    }

}
