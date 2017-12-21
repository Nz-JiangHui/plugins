/**
 * Created by Nz on 2017/12/21.
 */
//对图片旋转处理
/**
 *
 * @param image 图片对象 new Image()
 * @param Orientation 通过加载exif-js获取，npm install exif-js /bower install exif-js 等等方式加载
 * @returns 返回图片旋转后的base64，可以直接将图片的src定义为此值
 */
function getImgData(image,Orientation){
    var expectWidth = image.naturalWidth;
    var expectHeight = image.naturalHeight;

    if (image.naturalWidth > image.naturalHeight && image.naturalWidth > 800) {
        expectWidth = 800;
        expectHeight = expectWidth * image.naturalHeight / image.naturalWidth;
    } else if (image.naturalHeight > image.naturalWidth && image.naturalHeight > 1200) {
        expectHeight = 1200;
        expectWidth = expectHeight * image.naturalWidth / image.naturalHeight;
    }
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = expectWidth;
    canvas.height = expectHeight;
    ctx.drawImage(image, 0, 0, expectWidth, expectHeight);
    var base64 = null;
    //修复ios
    switch(Orientation){
        case 6://需要顺时针（向左）90度旋转
            rotateImg(image,'left',canvas);
            break;
        case 8://需要逆时针（向右）90度旋转
            rotateImg(image,'right',canvas);
            break;
        case 3://需要180度旋转
            rotateImg(image,'right',canvas);//转两次
            rotateImg(image,'right',canvas);
            break;
    }
    base64 = canvas.toDataURL("image/jpeg");//这里处理一下base64编码头，以便php的 base64_decode可以解析，压缩一下图片，否则会413错误
    return base64;
}

/**
 * 为getImgData方法做辅助，图片旋转方法
 * 只在getImgData中调用
 */
function rotateImg(img, direction,canvas) {
    //alert(img);
    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);
    if (img == null)return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;
    //var step = img.getAttribute('step');
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
}


/**
 * 例子
 */
var src = 'abc.jpg';                                          //需传入图片地址
var fileImg = new Image();
fileImg.src = src;
fileImg.onload = function () {
    var Orientation;
    EXIF.getData(fileImg, function () {
        Orientation = EXIF.getTag(this, "Orientation");
        var base64;                                            //需传出的图片地址
        if('368'.indexOf(Orientation)>-1){
            base64 = getImgData(fileImg, Orientation);
        }else{
            base64 = src;
        }
    });
};


