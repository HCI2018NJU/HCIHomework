package ticketson.model;

import ticketson.entity.Venue;
import ticketson.util.DateHelper;

/**
 * Created by shea on 2018/3/15.
 */
public class VenueModel {
    public String vid;
    /**
     * 场馆名称
     */
    public String name;

    public int provinceCode;
    public int cityCode;
    public int districtCode;
    /**
     * 详细地址
     */
    public String location;

    public Integer totalSeats;

    public String registerTime;

    public VenueModel(){

    }

    public VenueModel(Venue venue){
        this.vid = venue.getVid();
        this.name = venue.getName();
        this.provinceCode = venue.getProvinceCode();
        this.cityCode = venue.getCityCode();
        this.districtCode = venue.getDistrictCode();
        this.location = venue.getLocation();
        this.totalSeats = venue.getTotalSeats();
        this.registerTime = DateHelper.format(venue.getRegisterTime());
    }
}
