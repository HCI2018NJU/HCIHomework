/**
 * Created by shea on 2018/1/27.
 * 为了往图形中添加自定义属性并存储，覆写原图形
 */

/**
 * 定义场馆看台类型
 */
fabric.GrandstandRect = fabric.util.createClass(fabric.Rect,{
    type: 'grandstand-rect',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('floor', options.floor) &&
        this.set('name', options.name) &&
        this.set('g_id',options.g_id) &&
        // this.set('g_width',options.g_width) &&
        // this.set('g_height',options.g_height) &&
        this.set('hasCanvas',options.hasCanvas) &&
        this.set('lowestPrice',options.lowestPrice)&&
        this.set('highestPrice',options.highestPrice);
        // this.set('origin_fill',options.origin_fill);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'),
            {
                floor: this.floor,
                name: this.name,
                g_id: this.g_id,
                // g_width: this.g_width,
                // g_height: this.g_height,
                hasCanvas: this.hasCanvas,
                lowestPrice: this.lowestPrice,
                highestPrice: this.highestPrice,
                // origin_fill: this.origin_fill
            });
    }
});
fabric.GrandstandRect.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('GrandstandRect', object, callback, forceAsync);
};
fabric.GrandstandRect.async = true;

fabric.GrandstandTriangle = fabric.util.createClass(fabric.Triangle,{
    type: 'grandstand-triangle',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('floor', options.floor) &&
        this.set('name', options.name) &&
        this.set('g_id',options.g_id) &&
        // this.set('g_width',options.g_width) &&
        // this.set('g_height',options.g_height) &&
        this.set('hasCanvas',options.hasCanvas)&&
        this.set('lowestPrice',options.lowestPrice)&&
        this.set('highestPrice',options.highestPrice);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'),
            {
                floor: this.floor,
                name: this.name,
                g_id: this.g_id,
                // g_width: this.g_width,
                // g_height: this.g_height,
                hasCanvas: this.hasCanvas,
                lowestPrice: this.lowestPrice,
                highestPrice: this.highestPrice,
                // origin_fill: this.origin_fill
            });
    }
});
fabric.GrandstandTriangle.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('GrandstandTriangle', object, callback, forceAsync);
};
fabric.GrandstandTriangle.async = true;


fabric.GrandstandEllipse = fabric.util.createClass(fabric.Ellipse,{
    type: 'grandstand-ellipse',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('floor', options.floor) &&
        this.set('name', options.name) &&
        this.set('g_id',options.g_id) &&
        // this.set('g_width',options.g_width) &&
        // this.set('g_height',options.g_height) &&
        this.set('hasCanvas',options.hasCanvas)&&
        this.set('lowestPrice',options.lowestPrice)&&
        this.set('highestPrice',options.highestPrice);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'),
            {
                floor: this.floor,
                name: this.name,
                g_id: this.g_id,
                // g_width: this.g_width,
                // g_height: this.g_height,
                hasCanvas: this.hasCanvas,
                lowestPrice: this.lowestPrice,
                highestPrice: this.highestPrice,
                // origin_fill: this.origin_fill
            });
    }
});
fabric.GrandstandEllipse.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('GrandstandEllipse', object, callback, forceAsync);
};
fabric.GrandstandEllipse.async = true;


fabric.GrandstandPolygon = fabric.util.createClass(fabric.Polygon,{
    type: 'grandstand-polygon',

    initialize: function (points, options) {
        options || ( options = { });
        this.callSuper('initialize', points, options);
        options &&
        this.set('floor', options.floor||'') &&
        this.set('name', options.name||'') &&
        this.set('g_id',options.g_id||'') &&
        // this.set('g_width',options.g_width) &&
        // this.set('g_height',options.g_height) &&
        this.set('hasCanvas',options.hasCanvas)&&
        this.set('lowestPrice',options.lowestPrice||'')&&
        this.set('highestPrice',options.highestPrice||'');
    },

    getKlass: function(type, namespace) {
        // capitalize first letter only
        type = fabric.util.string.camelize(type.charAt(0).toUpperCase() + type.slice(1));
        return fabric.util.resolveNamespace(namespace)[type];
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'),
            {
                floor: this.floor,
                name: this.name,
                g_id: this.g_id,
                // g_width: this.g_width,
                // g_height: this.g_height,
                hasCanvas: this.hasCanvas,
                lowestPrice: this.lowestPrice,
                highestPrice: this.highestPrice,
                // origin_fill: this.origin_fill
            });
    }
});
fabric.GrandstandPolygon.fromObject = function (object, callback) {
    callback && callback(new fabric.GrandstandPolygon(object.points, object));
};
fabric.GrandstandPolygon.async = true;



/**
 * 场馆座位
 */
fabric.SeatRect = fabric.util.createClass(fabric.Rect, {
    type: 'seat-rect',

    initialize: function (element, options) {
        this.callSuper('initialize', element, options);
        options &&
        this.set('floor', options.floor) &&
        this.set('area', options.area) &&
        this.set('row', options.row) &&
        this.set('column', options.column) &&
        this.set('price', options.price) &&
        this.set('level', options.level) &&
        this.set('state', options.state) &&
        this.set('origin_fill', options.origin_fill) &&
        this.set('seatid', options.seatid);
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'),
            {
                floor: this.floor,
                area: this.area,
                row: this.row,
                column: this.column,
                price: this.price,
                level: this.level,
                state: this.state,
                origin_fill: this.origin_fill,
                seatid: this.seatid
            });
    }
});

fabric.SeatRect.fromObject = function (object, callback, forceAsync) {
    return fabric.Object._fromObject('SeatRect', object, callback, forceAsync);
};

fabric.SeatRect.async = true;

// fabric.Group.prototype.lockRotation = true;
// fabric.Group.prototype.lockScalingX = true;
// fabric.Group.prototype.lockScalingY = true;
// fabric.Group.prototype.lockUniScaling= true;
// fabric.Group.prototype.hasBorders = false;
fabric.Group.prototype.hasControls = false;
fabric.SeatRect.prototype.hasControls = false;
// fabric.Group.prototype._controlsVisibility = {
//     tl: true,
//     tr: true,
//     br: true,
//     bl: true,
//     ml: false,
//     mt: false,
//     mr: false,
//     mb: false,
//     mtr: false
// };