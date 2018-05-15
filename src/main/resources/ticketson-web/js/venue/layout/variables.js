/**
 * Created by shea on 2018/1/31.
 */
/**
 * venue
 * @type {number}
 */
const header_height = 80;
const venue_wrapper_height = 740;
const venue_wrapper_width = 1100;

$('#below-header').css({
    height:window.innerHeight-header_height,
});
$('#venue-wrapper').css({
    'width':venue_wrapper_width,
    'height': venue_wrapper_height,
});

const stage_height = 80;
const stage_size = 40;
//椅子以及椅子空隙占地总边长
const seat_size = 30;
//椅子边长
const seat_edge_length = 20;


let canvases = [];//{name,type,id,canvas}
let canvas_pointer = 0;
let floor_names = [];
//ellipse,rect,select_rect,poly,line
let draw_mode = null;
let mouse_down = false;
let to_draw = null;
//选择框
let select_rect = null;

let line = null;
//多边形
let new_edge = null;//画多边形时新建的一条边
let begin_pointer = null;//多边形的起始顶点
let poly_pointers = [];//依次记录多边形的每个顶点
let poly_edges = [];//记录多边形的每条边

//记录正在移动的座椅或座椅组
let isMoving = null;

//记录当前的tooltip
let tooltip_rect = null;
let tooltip = null;

const tooltip_width = 120;
const tooltip_height = 100;

