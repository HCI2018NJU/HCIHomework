package ticketson.model;

import ticketson.entity.VenueModify;
import ticketson.util.DateHelper;

/**
 * Created by shea on 2018/3/20.
 */
public class VenueModifyModel {
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

    public String modifyTime;

    public VenueModifyModel() {
    }

    public VenueModifyModel(VenueModify venueModify) {
        this.vid = venueModify.getVmid();
        this.name = venueModify.getName();
        this.provinceCode = venueModify.getProvinceCode();
        this.cityCode = venueModify.getCityCode();
        this.districtCode = venueModify.getDistrictCode();
        this.location = venueModify.getLocation();
        this.modifyTime = DateHelper.format(venueModify.getModifyTime());
    }
}
