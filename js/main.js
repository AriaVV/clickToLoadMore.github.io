$(function(){
    in_theaters();
})


//电影正在热映获取数据
function in_theaters(){
    var count = 8;
    var total =8;
    $.ajax({
        url: 'https://api.douban.com/v2/movie/in_theaters',
        type: 'GET',
        dataType: 'jsonp',
        data: {
            count:count,
            total:total
        },
        success:function(data){
            $('#in_theaters').html(template('template',{model:data.subjects}));
            $('.clsDetail').append('<button class="in_more">点击加载更多</button>');
        }
    })
    $('.clsDetail').on('click','.in_more',function(){
        count += 8;
        $(this).html('<i></i>正在努力的加载中...').attr('disabled','true').css('backgroundColor','#ccc');
        $.ajax({
            url: 'https://api.douban.com/v2/movie/in_theaters',
            type: 'GET',
            dataType: 'jsonp',
            data: {
                count:count,
                total:total
            },
            success:function(data){
                $('#in_theaters').html(template('template',{model:data.subjects}));
                $('.in_more').html('点击加载更多').css('backgroundColor','#1c8bd0').removeAttr('disabled');
                if(count>data.total){
                    $('.in_more').html('没有更多了').attr('disabled','true').css('backgroundColor','#ccc');
                }
            }
        })
    })
}